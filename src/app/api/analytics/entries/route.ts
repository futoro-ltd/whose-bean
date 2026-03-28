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
    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get('domainId');
    const period = (searchParams.get('period') || 'last7days') as Period;
    const type = searchParams.get('type') || 'pageviews';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const sortBy = searchParams.get('sortBy') || 'timestamp';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const filters = parseFilterParams(searchParams);
    const excludeBots = parseExcludeBots(searchParams);

    if (!domainId) {
      return NextResponse.json({ error: 'domainId is required' }, { status: 400 });
    }

    const { start, end = new Date() } = getDateRange(period);
    const filterConditions = getFilterConditions(filters, excludeBots);

    const user = await getCurrentUser();
    const accessCheck = await checkDomainAnalyticsAccess(domainId, user?.id);

    if (!accessCheck.success) {
      const status = accessCheck.code === 'NOT_FOUND' ? 400 : 403;
      return NextResponse.json({ error: accessCheck.error }, { status });
    }

    const skip = (page - 1) * limit;

    if (type === 'pageviews') {
      const [entries, total] = await Promise.all([
        prisma.analyticsEntry.findMany({
          where: {
            domainId,
            timestamp: { gte: start, lte: end },
            ...filterConditions,
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        prisma.analyticsEntry.count({
          where: { domainId, timestamp: { gte: start, lte: end }, ...filterConditions },
        }),
      ]);

      return NextResponse.json({
        entries: entries.map((e) => ({
          id: e.id,
          timestamp: e.timestamp,
          page: e.page,
          browser: e.browser,
          device: e.device,
          country: e.country,
          city: e.city,
          os: e.os,
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    }

    if (type === 'visitors') {
      const entries = await prisma.analyticsEntry.findMany({
        where: {
          domainId,
          timestamp: { gte: start, lte: end },
          ...filterConditions,
        },
        orderBy: { timestamp: sortOrder === 'asc' ? 'asc' : 'desc' },
      });

      const visitorMap: Record<
        string,
        {
          sessionId: string;
          firstSeen: Date;
          lastSeen: Date;
          pageCount: number;
          country: string | null;
          device: string | null;
          browser: string | null;
          os: string | null;
        }
      > = {};

      const getVisitorKey = (e: {
        sessionId: string;
        country: string | null;
        device: string | null;
        browser: string | null;
        os: string | null;
      }) => {
        return `${e.country || 'Unknown'}-${e.device || 'Unknown'}-${e.browser || 'Unknown'}-${e.os || 'Unknown'}`;
      };

      entries.forEach((e) => {
        const visitorKey = getVisitorKey(e);
        if (!visitorMap[visitorKey]) {
          visitorMap[visitorKey] = {
            sessionId: visitorKey,
            firstSeen: e.timestamp,
            lastSeen: e.timestamp,
            pageCount: 0,
            country: e.country,
            device: e.device,
            browser: e.browser,
            os: e.os,
          };
        }
        visitorMap[visitorKey].pageCount++;
        if (e.timestamp < visitorMap[visitorKey].firstSeen) {
          visitorMap[visitorKey].firstSeen = e.timestamp;
        }
        if (e.timestamp > visitorMap[visitorKey].lastSeen) {
          visitorMap[visitorKey].lastSeen = e.timestamp;
        }
      });

      const visitors = Object.values(visitorMap);
      const total = visitors.length;

      const sortedVisitors = visitors.sort((a, b) => {
        const aVal = a[sortBy as keyof typeof a] ?? '';
        const bVal = b[sortBy as keyof typeof b] ?? '';
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      const paginatedVisitors = sortedVisitors.slice(skip, skip + limit);

      return NextResponse.json({
        entries: paginatedVisitors,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching analytics entries:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics entries' }, { status: 500 });
  }
}
