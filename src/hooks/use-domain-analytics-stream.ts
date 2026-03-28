'use client';

import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAnalyticsFilterStore } from '@/stores/analytics-filter-store';
import type { AnalyticsStreamData } from '@/types/analytics-types';

export type { AnalyticsStreamData };

export function useDomainAnalyticsStream(domainId: string) {
  const queryClient = useQueryClient();
  const [isLive, setIsLive] = useState(false);
  const { period, operatingSystems, browsers, devices } = useAnalyticsFilterStore();

  const queryKey = ['analytics', domainId, { period, operatingSystems, browsers, devices }];

  const {
    data,
    isLoading: loading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!domainId) return null;

      const params = new URLSearchParams({
        domainId,
        period,
        browsers: browsers.join(','),
        devices: devices.join(','),
        operatingSystems: operatingSystems.join(','),
      });

      const res = await fetch(`/api/analytics/data?${params}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch analytics: ${res.statusText}`);
      }
      return res.json() as Promise<AnalyticsStreamData>;
    },
    enabled: !!domainId,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (!domainId) return;

    const eventSource = new EventSource(`/api/analytics/stream?domainId=${domainId}`);

    eventSource.onopen = () => setIsLive(true);

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === 'connected') {
          setIsLive(true);
        }
        if (parsed.type === 'update') {
          queryClient.invalidateQueries({ queryKey: ['analytics', domainId] });
        }
      } catch {
        // Ignore parse errors
      }
    };

    eventSource.onerror = () => setIsLive(false);

    return () => eventSource.close();
  }, [domainId, queryClient]);

  let errorMessage: string | null = null;
  if (isError && error) {
    errorMessage = error instanceof Error ? error.message : 'Failed to fetch analytics data';
    console.error('Analytics fetch error:', error);
  }

  return { data, loading, isUpdating: isFetching, isLive, error: errorMessage };
}
