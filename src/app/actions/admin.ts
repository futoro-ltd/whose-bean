'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser, verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import type {
  User,
  GetUsersResult,
  DeleteUserResult,
  PromoteUserResult,
  DeleteAllAnalyticsEntriesResult,
  DeleteAllDomainsResult,
  ResetDatabaseResult,
} from '@/types/auth-types';

export async function getAllUsers(): Promise<GetUsersResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Forbidden' };
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const adminCount = users.filter((u) => u.role === 'admin').length;

    return { success: true, users, adminCount };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, error: 'Failed to fetch users' };
  }
}

export async function deleteUser(userId: string): Promise<DeleteUserResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Forbidden' };
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!targetUser) {
      return { success: false, error: 'User not found' };
    }

    if (targetUser.role === 'admin') {
      const adminCount = await prisma.user.count({
        where: { role: 'admin' },
      });

      if (adminCount <= 1) {
        return { success: false, error: 'Cannot delete the last admin user' };
      }
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const decoded = token ? verifyToken(token) : null;

    await prisma.user.delete({
      where: { id: userId },
    });

    if (decoded?.userId === userId) {
      cookieStore.set('token', '', { maxAge: 0 });
      return { success: true, deletedSelf: true };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'Failed to delete user' };
  }
}

export async function promoteToAdmin(userId: string): Promise<PromoteUserResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Forbidden' };
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!targetUser) {
      return { success: false, error: 'User not found' };
    }

    if (targetUser.role === 'admin') {
      return { success: false, error: 'User is already an admin' };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: 'admin' },
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: 'Failed to update user' };
  }
}

export async function deleteAllAnalyticsEntries(
  domainId: string
): Promise<DeleteAllAnalyticsEntriesResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Forbidden - Admin access required' };
    }

    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
      select: { id: true },
    });

    if (!domain) {
      return { success: false, error: 'Domain not found' };
    }

    await prisma.analyticsEntry.deleteMany({
      where: { domainId },
    });

    await prisma.pageView.deleteMany({
      where: { domainId },
    });

    return { success: true, message: 'All analytics and page view data deleted' };
  } catch (error) {
    console.error('Error deleting analytics entries:', error);
    return { success: false, error: 'Failed to delete analytics entries' };
  }
}

export async function deleteAllDomains(): Promise<DeleteAllDomainsResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Forbidden - Admin access required' };
    }

    await prisma.domain.deleteMany({});

    return { success: true, message: 'All domains deleted' };
  } catch (error) {
    console.error('Error deleting domains:', error);
    return { success: false, error: 'Failed to delete domains' };
  }
}

export async function resetDatabase(): Promise<ResetDatabaseResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Forbidden - Admin access required' };
    }

    await prisma.analyticsEntry.deleteMany({});
    await prisma.pageView.deleteMany({});
    await prisma.domain.deleteMany({});
    await prisma.invitation.deleteMany({});
    await prisma.user.deleteMany({});

    return { success: true, message: 'Database reset complete' };
  } catch (error) {
    console.error('Error resetting database:', error);
    return { success: false, error: 'Failed to reset database' };
  }
}
