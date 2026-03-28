'use client';

import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAnalyticsFilterStore } from '@/stores/analytics-filter-store';
import type {
  PageViewEntry,
  VisitorEntry,
  AnalyticsEntriesResponse,
} from '@/types/analytics-types';

export type { PageViewEntry, VisitorEntry, AnalyticsEntriesResponse };

export function useAnalyticsEntries(
  domainId: string,
  type: 'pageviews' | 'visitors',
  page: number = 1,
  limit: number = 50,
  sortBy: string = 'timestamp',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  const queryClient = useQueryClient();
  const [isLive, setIsLive] = useState(false);
  const { period, operatingSystems, browsers, devices } = useAnalyticsFilterStore();

  const queryKey = [
    'analytics-entries',
    domainId,
    { type, page, limit, sortBy, sortOrder, period, operatingSystems, browsers, devices },
  ];

  const {
    data,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!domainId) return null;

      const params = new URLSearchParams({
        domainId,
        period,
        type,
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
        browsers: browsers.join(','),
        devices: devices.join(','),
        operatingSystems: operatingSystems.join(','),
      });

      const res = await fetch(`/api/analytics/entries?${params}`);
      const responseData = await res.json();
      if (responseData.error) {
        throw new Error(responseData.error);
      }
      return responseData as AnalyticsEntriesResponse;
    },
    enabled: !!domainId,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!domainId) return;

    const eventSource = new EventSource(`/api/analytics/stream?domainId=${domainId}`);

    eventSource.onopen = () => {
      setIsLive(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === 'connected') {
          setIsLive(true);
        }
        if (parsed.type === 'update') {
          queryClient.invalidateQueries({ queryKey: ['analytics-entries', domainId] });
        }
      } catch {
        // Ignore parse errors
      }
    };

    eventSource.onerror = () => {
      setIsLive(false);
    };

    return () => {
      eventSource.close();
    };
  }, [domainId, queryClient]);

  if (isError) {
    console.error('Analytics entries fetch error:', error);
  }

  return { data, loading, isLive, refetch };
}
