import { Prisma } from '@prisma/client';
import { Period, Granularity, getGranularity } from '@/data/period-options';

export interface FilterParams {
  browsers: string[] | null;
  devices: string[] | null;
  operatingSystems: string[] | null;
}

export interface DateRangeResult {
  start: Date;
  end: Date;
  granularity?: Granularity;
}

export function getDateRange(period: Period, includeGranularity: boolean = false): DateRangeResult {
  const now = new Date();
  const end = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    )
  );
  let start: Date;

  switch (period) {
    case 'today': {
      start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      break;
    }
    case 'yesterday': {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      start = new Date(
        Date.UTC(yesterday.getUTCFullYear(), yesterday.getUTCMonth(), yesterday.getUTCDate())
      );
      end.setUTCDate(end.getUTCDate() - 1);
      end.setUTCHours(23, 59, 59, 999);
      break;
    }
    case 'lastHour': {
      start = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    }
    case 'last6hours': {
      start = new Date(now.getTime() - 6 * 60 * 60 * 1000);
      break;
    }
    case 'last12hours': {
      start = new Date(now.getTime() - 12 * 60 * 60 * 1000);
      break;
    }
    case 'last24hours': {
      start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    }
    case 'last7days': {
      start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 7));
      break;
    }
    case 'last14days': {
      start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 14));
      break;
    }
    case 'last28days': {
      start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 28));
      break;
    }
    case 'last90days': {
      start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 90));
      break;
    }
    case 'last180days': {
      start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 180));
      break;
    }
    case 'last365days': {
      start = new Date(Date.UTC(now.getUTCFullYear() - 1, now.getUTCMonth(), now.getUTCDate()));
      break;
    }
    case 'yearToDate': {
      start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
      break;
    }
  }

  if (includeGranularity) {
    return { start, end, granularity: getGranularity(period) };
  }

  return { start, end };
}

export function getFilterConditions(
  filters: FilterParams,
  excludeBots: boolean = false
): Prisma.AnalyticsEntryWhereInput {
  const conditions: Prisma.AnalyticsEntryWhereInput = {};

  const ALL_OS = ['Windows', 'macOS', 'Linux', 'Android', 'iOS', 'Unknown'];
  const ALL_BROWSERS = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Other', 'Unknown'];
  const ALL_DEVICES = ['Desktop', 'Mobile', 'Tablet', 'Unknown'];

  const osFilterLength = filters.operatingSystems?.length || 0;
  const browserFilterLength = filters.browsers?.length || 0;
  const deviceFilterLength = filters.devices?.length || 0;

  const osMatchesAll = osFilterLength === ALL_OS.length;
  const browserMatchesAll = browserFilterLength === ALL_BROWSERS.length;
  const deviceMatchesAll = deviceFilterLength === ALL_DEVICES.length;

  if (osFilterLength > 0 && !osMatchesAll) {
    conditions.os = { in: filters.operatingSystems };
  } else if (osFilterLength === 0) {
    conditions.os = { equals: null };
  }
  if (browserFilterLength > 0 && !browserMatchesAll) {
    conditions.browser = { in: filters.browsers };
  } else if (browserFilterLength === 0) {
    conditions.browser = { equals: null };
  }
  if (deviceFilterLength > 0 && !deviceMatchesAll) {
    conditions.device = { in: filters.devices };
  } else if (deviceFilterLength === 0) {
    conditions.device = { equals: null };
  }

  if (excludeBots) {
    conditions.isBot = false;
  }

  return conditions;
}

export function parseFilterParams(searchParams: URLSearchParams): FilterParams {
  const browsersParam = searchParams.get('browsers');
  const devicesParam = searchParams.get('devices');
  const operatingSystemsParam = searchParams.get('operatingSystems');

  const parseArray = (param: string | null): string[] | null => {
    if (!param) return null;
    return param.split(',').filter((v) => v && v !== 'All');
  };

  return {
    browsers: parseArray(browsersParam),
    devices: parseArray(devicesParam),
    operatingSystems: parseArray(operatingSystemsParam),
  };
}

export function parseExcludeBots(searchParams: URLSearchParams): boolean {
  const excludeBotsParam = searchParams.get('excludeBots');
  return excludeBotsParam !== 'false';
}
