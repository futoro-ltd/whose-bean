'use server';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { eventBus } from '@/lib/event-bus';
import { generateMultipleMockAnalyticsEntries } from '@/lib/dev-populate-db';
import type { SendMockAnalyticsResult } from '@/types/analytics-types';

export async function sendMockAnalytics(
  domainId?: string,
  count: number = 1
): Promise<SendMockAnalyticsResult> {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    return { success: false, count: 0, error: 'Unauthorized: Admin access required' };
  }

  let targetDomainId = domainId;

  if (!targetDomainId) {
    const randomDomain = await prisma.domain.findFirst({
      select: { id: true },
    });

    if (!randomDomain) {
      return { success: false, count: 0, error: 'No domains found in database' };
    }

    targetDomainId = randomDomain.id;
  } else {
    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
      select: { id: true },
    });

    if (!domain) {
      return { success: false, count: 0, error: 'Domain not found' };
    }
  }

  const entries = generateMultipleMockAnalyticsEntries(targetDomainId, count);

  try {
    for (const entry of entries) {
      await prisma.analyticsEntry.create({
        data: {
          sessionId: entry.sessionId,
          page: entry.page,
          referrer: entry.referrer,
          browser: entry.browser,
          os: entry.os,
          device: entry.device,
          country: entry.country,
          domainId: entry.domainId,
        },
      });

      await prisma.pageView.upsert({
        where: { path_domainId: { path: entry.page, domainId: entry.domainId } },
        update: {
          views: { increment: 1 },
          uniqueViews: { increment: 1 },
          lastViewed: new Date(),
        },
        create: {
          path: entry.page,
          views: 1,
          uniqueViews: 1,
          domainId: entry.domainId,
        },
      });
    }

    eventBus.emit(targetDomainId, { type: 'update', domainId: targetDomainId });

    return { success: true, count, entries };
  } catch (error) {
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : 'Failed to send mock analytics',
    };
  }
}
