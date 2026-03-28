'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import type {
  DomainAccessUser,
  DomainWithAccess,
  GetDomainAccessUsersResult,
  GrantDomainAccessResult,
  RevokeDomainAccessResult,
  GetDomainsWithAccessInfoResult,
} from '@/types/domain-types';

export async function getDomainAccessUsers(domainId: string): Promise<GetDomainAccessUsersResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Forbidden' };
    }

    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
      include: {
        allowedUsers: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
          },
          orderBy: { email: 'asc' },
        },
      },
    });

    if (!domain) {
      return { success: false, error: 'Domain not found' };
    }

    return { success: true, users: domain.allowedUsers };
  } catch (error) {
    console.error('Error fetching domain access users:', error);
    return { success: false, error: 'Failed to fetch domain access users' };
  }
}

export async function grantDomainAccess(
  domainId: string,
  userId: string
): Promise<GrantDomainAccessResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Forbidden' };
    }

    const [domain, targetUser] = await Promise.all([
      prisma.domain.findUnique({ where: { id: domainId } }),
      prisma.user.findUnique({ where: { id: userId } }),
    ]);

    if (!domain) {
      return { success: false, error: 'Domain not found' };
    }

    if (!targetUser) {
      return { success: false, error: 'User not found' };
    }

    const alreadyHasAccess = await prisma.domain.findFirst({
      where: {
        id: domainId,
        allowedUsers: { some: { id: userId } },
      },
    });

    if (alreadyHasAccess) {
      return { success: false, error: 'User already has access to this domain' };
    }

    await prisma.domain.update({
      where: { id: domainId },
      data: {
        allowedUsers: {
          connect: { id: userId },
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error granting domain access:', error);
    return { success: false, error: 'Failed to grant domain access' };
  }
}

export async function revokeDomainAccess(
  domainId: string,
  userId: string
): Promise<RevokeDomainAccessResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Forbidden' };
    }

    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
      include: { allowedUsers: { where: { id: userId } } },
    });

    if (!domain) {
      return { success: false, error: 'Domain not found' };
    }

    if (domain.allowedUsers.length === 0) {
      return { success: false, error: 'User does not have access to this domain' };
    }

    await prisma.domain.update({
      where: { id: domainId },
      data: {
        allowedUsers: {
          disconnect: { id: userId },
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error revoking domain access:', error);
    return { success: false, error: 'Failed to revoke domain access' };
  }
}

export async function getDomainsWithAccessInfo(): Promise<GetDomainsWithAccessInfoResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Forbidden' };
    }

    const domains = await prisma.domain.findMany({
      select: {
        id: true,
        domain: true,
        user: {
          select: { id: true, email: true },
        },
        _count: {
          select: { allowedUsers: true },
        },
      },
      orderBy: { domain: 'asc' },
    });

    return { success: true, domains };
  } catch (error) {
    console.error('Error fetching domains with access info:', error);
    return { success: false, error: 'Failed to fetch domains' };
  }
}
