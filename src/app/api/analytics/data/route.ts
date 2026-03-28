import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { Period } from '@/data/period-options';
import { checkDomainAnalyticsAccess } from '@/app/actions/analytics-domain-access';
import {
  getDateRange,
  getFilterConditions,
  parseFilterParams,
  parseExcludeBots,
} from '@/lib/analytics-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get('domainId');
    const period = (searchParams.get('period') || 'last7days') as Period;

    const filters = parseFilterParams(searchParams);
    const excludeBots = parseExcludeBots(searchParams);

    if (!domainId) {
      return NextResponse.json({ error: 'domainId is required' }, { status: 400 });
    }

    const { start, end, granularity } = getDateRange(period, true);
    const filterConditions = getFilterConditions(filters, excludeBots);

    const accessCheck = await checkDomainAnalyticsAccess(domainId, user?.id);

    if (!accessCheck.success) {
      const status = accessCheck.code === 'NOT_FOUND' ? 400 : 403;
      return NextResponse.json({ error: accessCheck.error }, { status });
    }

    const { domain: domainInfo } = accessCheck;

    const totalViews = await prisma.analyticsEntry.count({
      where: { domainId, timestamp: { gte: start, lte: end }, ...filterConditions },
    });

    const uniqueVisitors = await prisma.analyticsEntry.groupBy({
      by: ['sessionId'],
      where: { domainId, timestamp: { gte: start, lte: end }, ...filterConditions },
      _count: {
        sessionId: true,
      },
    });

    const topPagesData = await prisma.analyticsEntry.groupBy({
      by: ['page'],
      where: { domainId, timestamp: { gte: start, lte: end }, ...filterConditions },
      _count: { page: true },
      orderBy: { _count: { page: 'desc' } },
      take: 10,
    });
    const topPages = topPagesData.map((p) => ({ path: p.page, views: p._count.page }));

    const uniquePagesData = await prisma.analyticsEntry.findMany({
      where: { domainId, timestamp: { gte: start, lte: end }, ...filterConditions },
      select: { page: true },
      distinct: ['page'],
    });
    const uniquePagesCount = uniquePagesData.filter((p) => p.page !== null).length;

    const viewsOverTimeData = await prisma.analyticsEntry.findMany({
      where: {
        domainId,
        timestamp: { gte: start, lte: end },
        ...filterConditions,
      },
      select: { timestamp: true, sessionId: true },
    });

    const viewsByTime: Record<string, number> = {};
    const visitorsByTime: Record<string, Set<string>> = {};
    viewsOverTimeData.forEach((entry) => {
      const date = new Date(entry.timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes =
        granularity === 'hour'
          ? 0
          : granularity === '10min'
            ? Math.floor(date.getMinutes() / 10) * 10
            : date.getMinutes();
      const key =
        granularity !== 'day'
          ? `${year}-${month}-${day} ${hours}:${minutes.toString().padStart(2, '0')}`
          : `${year}-${month}-${day}`;
      viewsByTime[key] = (viewsByTime[key] || 0) + 1;
      if (!visitorsByTime[key]) {
        visitorsByTime[key] = new Set();
      }
      visitorsByTime[key].add(entry.sessionId);
    });

    const allDates: string[] = [];
    if (granularity === 'hour') {
      const current = new Date(start.getTime());
      while (current <= end) {
        const year = current.getFullYear();
        const month = (current.getMonth() + 1).toString().padStart(2, '0');
        const day = current.getDate().toString().padStart(2, '0');
        const hours = current.getHours().toString().padStart(2, '0');
        allDates.push(`${year}-${month}-${day} ${hours}:00`);
        current.setHours(current.getHours() + 1);
      }
    } else if (granularity === '10min') {
      const current = new Date(start.getTime());
      while (current <= end) {
        const year = current.getFullYear();
        const month = (current.getMonth() + 1).toString().padStart(2, '0');
        const day = current.getDate().toString().padStart(2, '0');
        const hours = current.getHours().toString().padStart(2, '0');
        const minutes = Math.floor(current.getMinutes() / 10) * 10;
        allDates.push(`${year}-${month}-${day} ${hours}:${minutes.toString().padStart(2, '0')}`);
        current.setMinutes(current.getMinutes() + 10);
      }
    } else {
      const current = new Date(start);
      while (current <= end) {
        const year = current.getFullYear();
        const month = (current.getMonth() + 1).toString().padStart(2, '0');
        const day = current.getDate().toString().padStart(2, '0');
        allDates.push(`${year}-${month}-${day}`);
        current.setDate(current.getDate() + 1);
      }
    }

    const viewsOverTime = allDates.map((date) => ({
      date,
      views: viewsByTime[date] || 0,
    }));

    const visitorsOverTime = allDates.map((date) => ({
      date,
      visitors: visitorsByTime[date]?.size || 0,
    }));

    const browserData = await prisma.analyticsEntry.groupBy({
      by: ['browser'],
      where: {
        domainId,
        timestamp: { gte: start, lte: end },
        browser: { not: null },
        ...filterConditions,
      },
      _count: true,
    });
    const browsers = browserData
      .map((b) => ({ browser: b.browser || 'Unknown', count: b._count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const deviceData = await prisma.analyticsEntry.groupBy({
      by: ['device'],
      where: {
        domainId,
        timestamp: { gte: start, lte: end },
        device: { not: null },
        ...filterConditions,
      },
      _count: true,
    });
    const devices = deviceData
      .map((d) => ({ device: d.device || 'Unknown', count: d._count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const osData = await prisma.analyticsEntry.groupBy({
      by: ['os'],
      where: {
        domainId,
        timestamp: { gte: start, lte: end },
        os: { not: null },
        ...filterConditions,
      },
      _count: true,
    });
    const operatingSystems = osData
      .map((o) => ({ os: o.os || 'Unknown', count: o._count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const countryData = await prisma.analyticsEntry.groupBy({
      by: ['country'],
      where: {
        domainId,
        timestamp: { gte: start, lte: end },
        country: { not: null },
        ...filterConditions,
      },
      _count: true,
    });
    const countries = countryData
      .map((c) => ({ country: c.country || 'Unknown', count: c._count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const referrerData = await prisma.analyticsEntry.groupBy({
      by: ['referrer'],
      where: { domainId, timestamp: { gte: start, lte: end }, ...filterConditions },
      _count: true,
    });
    const referrers = referrerData
      .filter((r) => r.referrer !== null && r.referrer !== '')
      .map((r) => ({ referrer: r.referrer || 'Direct', count: r._count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      domain: domainInfo.domain,
      isPublic: domainInfo.isPublic,
      totalViews,
      uniqueVisitors: uniqueVisitors.length,
      uniquePagesCount,
      topPages: topPages.map((p) => ({ path: p.path, views: p.views })),
      viewsOverTime,
      visitorsOverTime,
      browsers,
      devices,
      operatingSystems,
      countries,
      referrers,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
