'use client';

import { useAnalyticsData } from '@/hooks/use-analytics-data';
import { AnalyticsProvider } from '@/components/analytics/analytics-provider';
import { AnalyticsLoading } from './analytics-loading';
import { AnalyticsError } from './analytics-error';
import { AnalyticsContent } from './analytics-content';

interface AnalyticsDashboardSectionProps {
  domainId: string;
}

export function AnalyticsDashboardSection({
  domainId,
}: AnalyticsDashboardSectionProps) {
  const { error, loading, data } = useAnalyticsData();

  const showInitialLoading = loading && !data;
  const showError = error && !data;

  return (
    <AnalyticsProvider domainId={domainId}>
      <div className="flex flex-col max-w-6xl mx-auto gap-8 mt-8 mb-64">
        {showInitialLoading ? (
          <AnalyticsLoading />
        ) : showError ? (
          <AnalyticsError error={error} />
        ) : (
          <AnalyticsContent domainId={domainId} />
        )}
      </div>
    </AnalyticsProvider>
  );
}
