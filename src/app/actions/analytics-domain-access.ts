'use server';

import { prisma } from '@/lib/db';
import type { CheckDomainAnalyticsAccessResult } from '@/types/domain-types';

export async function checkDomainAnalyticsAccess(
  domainId: string,
  userId?: string
): Promise<CheckDomainAnalyticsAccessResult> {
  try {
    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
      select: {
        domain: true,
        isPublic: true,
        allowedUsers: userId ? { where: { id: userId }, select: { id: true } } : undefined,
      },
    });

    if (!domain) {
      return { success: false, error: 'Domain not found', code: 'NOT_FOUND' };
    }

    const isAllowedUser = domain.allowedUsers && domain.allowedUsers.length > 0;
    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
    }
    const hasAccess = domain.isPublic || (user && (user.role === 'admin' || isAllowedUser));

    if (!hasAccess) {
      return { success: false, error: 'Forbidden', code: 'FORBIDDEN' };
    }

    return {
      success: true,
      domain: { domain: domain.domain, isPublic: domain.isPublic },
    };
  } catch (error) {
    console.error('Error checking domain analytics access:', error);
    return { success: false, error: 'Internal server error', code: 'FORBIDDEN' };
  }
}
