'use client';

import { useEffect } from 'react';
import { useDomainAnalyticsStream } from '@/hooks/use-domain-analytics-stream';
import { useAnalyticsDataStore } from '@/stores/analytics-data-store';

interface AnalyticsProviderProps {
  domainId: string;
  children: React.ReactNode;
}

export function AnalyticsProvider({ domainId, children }: AnalyticsProviderProps) {
  const { data, loading, isUpdating, isLive, error } = useDomainAnalyticsStream(domainId);
  const {
    setAnalyticsData,
    setLoading,
    setIsUpdating,
    setIsLive,
    setDomainId,
    setError,
    clearAnalyticsData,
  } = useAnalyticsDataStore();

  useEffect(() => {
    setDomainId(domainId);
    return () => {
      clearAnalyticsData();
    };
  }, [domainId, setDomainId, clearAnalyticsData]);

  useEffect(() => {
    setAnalyticsData(data ?? null);
  }, [data, setAnalyticsData]);

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  useEffect(() => {
    setIsUpdating(isUpdating);
  }, [isUpdating, setIsUpdating]);

  useEffect(() => {
    setIsLive(isLive);
  }, [isLive, setIsLive]);

  useEffect(() => {
    setError(error);
  }, [error, setError]);

  return <>{children}</>;
}
