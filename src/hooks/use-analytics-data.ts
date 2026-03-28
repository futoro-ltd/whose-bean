'use client';

import { useAnalyticsDataStore, AnalyticsData } from '@/stores/analytics-data-store';

export function useAnalyticsData() {
  const data = useAnalyticsDataStore((state) => state.data);
  const loading = useAnalyticsDataStore((state) => state.loading);
  const isUpdating = useAnalyticsDataStore((state) => state.isUpdating);
  const isLive = useAnalyticsDataStore((state) => state.isLive);
  const domainId = useAnalyticsDataStore((state) => state.domainId);
  const error = useAnalyticsDataStore((state) => state.error);

  return { data, loading, isUpdating, isLive, domainId, error };
}

export function useAnalyticsDataSelector<T>(selector: (data: AnalyticsData | null) => T) {
  const selectedData = useAnalyticsDataStore((state) => selector(state.data));
  return selectedData;
}

function createDataHook<T>(key: keyof AnalyticsData | null, defaultValue: T) {
  return () =>
    useAnalyticsDataSelector((data) => (key ? ((data?.[key] as T) ?? defaultValue) : defaultValue));
}

export const useDevicesData = createDataHook<AnalyticsData['devices']>('devices', []);
export const useBrowsersData = createDataHook<AnalyticsData['browsers']>('browsers', []);
export const useOperatingSystemsData = createDataHook<AnalyticsData['operatingSystems']>(
  'operatingSystems',
  []
);
export const useViewsOverTimeData = createDataHook<AnalyticsData['viewsOverTime']>(
  'viewsOverTime',
  []
);
export const useVisitorsOverTimeData = createDataHook<AnalyticsData['visitorsOverTime']>(
  'visitorsOverTime',
  []
);
export const useTopPagesData = createDataHook<AnalyticsData['topPages']>('topPages', []);
export const useReferrersData = createDataHook<AnalyticsData['referrers']>('referrers', []);
export const useCountriesData = createDataHook<AnalyticsData['countries']>('countries', []);
