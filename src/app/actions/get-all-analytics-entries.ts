'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import type {
  DebugAnalyticsEntry,
  DebugAnalyticsEntriesResult,
  DebugDatabaseInfo,
  DebugDomainInfo,
} from '@/types/analytics-types';

export async function getAllAnalyticsEntries(
  domainId?: string,
  page: number = 1,
  pageSize: number = 20
): Promise<DebugAnalyticsEntriesResult> {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }

  const where = domainId ? { domainId } : {};

  const [entries, total] = await Promise.all([
    prisma.analyticsEntry.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        domain: {
          select: { domain: true },
        },
      },
    }),
    prisma.analyticsEntry.count({ where }),
  ]);

  return {
    entries: entries.map((e) => ({
      id: e.id,
      sessionId: e.sessionId,
      page: e.page,
      referrer: e.referrer,
      browser: e.browser,
      os: e.os,
      device: e.device,
      country: e.country,
      city: e.city,
      timestamp: e.timestamp,
      isBot: e.isBot,
      domain: e.domain.domain,
    })),
    total,
  };
}

export async function getAllDomains(): Promise<{ id: string; domain: string }[]> {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }

  const domains = await prisma.domain.findMany({
    select: { id: true, domain: true },
    orderBy: { domain: 'asc' },
  });

  return domains;
}

export async function getDebugDomainInfo(domainId: string): Promise<DebugDomainInfo> {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }

  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const entries = await prisma.analyticsEntry.findMany({
    where: { domainId },
    select: { sessionId: true, isBot: true, timestamp: true },
  });

  const uniqueSessions = new Set(entries.map((e) => e.sessionId));

  return {
    entryCount: entries.length,
    uniqueSessionCount: uniqueSessions.size,
    botCount: entries.filter((e) => e.isBot).length,
    entriesLast24h: entries.filter((e) => e.timestamp >= last24h).length,
    entriesLast7d: entries.filter((e) => e.timestamp >= last7d).length,
  };
}

export async function getDebugDatabaseInfo(): Promise<DebugDatabaseInfo> {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }

  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    userCount,
    adminCount,
    invitationCount,
    passwordResetTokenCount,
    domainCount,
    publicDomainCount,
    privateDomainCount,
    analyticsEntryCount,
    analyticsEntriesLast24h,
    analyticsEntriesLast7d,
    pageViewCount,
    botCount,
    nonBotCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'admin' } }),
    prisma.invitation.count(),
    prisma.passwordResetToken.count(),
    prisma.domain.count(),
    prisma.domain.count({ where: { isPublic: true } }),
    prisma.domain.count({ where: { isPublic: false } }),
    prisma.analyticsEntry.count(),
    prisma.analyticsEntry.count({ where: { timestamp: { gte: last24h } } }),
    prisma.analyticsEntry.count({ where: { timestamp: { gte: last7d } } }),
    prisma.pageView.count(),
    prisma.analyticsEntry.count({ where: { isBot: true } }),
    prisma.analyticsEntry.count({ where: { isBot: false } }),
  ]);

  return {
    userCount,
    adminCount,
    invitationCount,
    passwordResetTokenCount,
    domainCount,
    publicDomainCount,
    privateDomainCount,
    analyticsEntryCount,
    analyticsEntriesLast24h,
    analyticsEntriesLast7d,
    pageViewCount,
    botCount,
  };
}
