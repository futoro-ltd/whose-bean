export type Period =
  | 'today'
  | 'yesterday'
  | 'lastHour'
  | 'last6hours'
  | 'last12hours'
  | 'last24hours'
  | 'last7days'
  | 'last14days'
  | 'last28days'
  | 'last90days'
  | 'last180days'
  | 'last365days'
  | 'yearToDate';

export type Granularity = 'hour' | '10min' | 'day';

export interface PeriodOption {
  value: Period;
  label: string;
  xAxisInterval: number | 'preserveStartEnd' | 'dynamic';
  granularity: Granularity;
}

export const PERIOD_OPTIONS: PeriodOption[] = [
  { value: 'today', label: 'Today', xAxisInterval: 'preserveStartEnd', granularity: 'hour' },
  {
    value: 'yesterday',
    label: 'Yesterday',
    xAxisInterval: 'preserveStartEnd',
    granularity: 'hour',
  },
  {
    value: 'lastHour',
    label: 'Last hour',
    xAxisInterval: 'preserveStartEnd',
    granularity: '10min',
  },
  {
    value: 'last6hours',
    label: 'Last 6 hours',
    xAxisInterval: 'preserveStartEnd',
    granularity: 'hour',
  },
  {
    value: 'last12hours',
    label: 'Last 12 hours',
    xAxisInterval: 'preserveStartEnd',
    granularity: 'hour',
  },
  {
    value: 'last24hours',
    label: 'Last 24 hours',
    xAxisInterval: 'preserveStartEnd',
    granularity: 'hour',
  },
  { value: 'last7days', label: 'Last 7 days', xAxisInterval: 0, granularity: 'day' },
  { value: 'last14days', label: 'Last 14 days', xAxisInterval: 1, granularity: 'day' },
  { value: 'last28days', label: 'Last 28 days', xAxisInterval: 2, granularity: 'day' },
  { value: 'last90days', label: 'Last 90 days', xAxisInterval: 9, granularity: 'day' },
  { value: 'last180days', label: 'Last 180 days', xAxisInterval: 19, granularity: 'day' },
  { value: 'last365days', label: 'Last year', xAxisInterval: 29, granularity: 'day' },
  { value: 'yearToDate', label: 'Year to date', xAxisInterval: 'dynamic', granularity: 'day' },
];

export function getXAxisInterval(period: Period): number | 'preserveStartEnd' {
  const option = PERIOD_OPTIONS.find((o) => o.value === period);
  if (!option) return 'preserveStartEnd';

  if (option.xAxisInterval === 'dynamic') {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const daysSoFar = Math.ceil((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    return Math.floor(daysSoFar / 10);
  }

  return option.xAxisInterval;
}

export function getGranularity(period: Period): Granularity {
  return PERIOD_OPTIONS.find((o) => o.value === period)?.granularity ?? 'day';
}
