'use client';

import { StandardCard } from '../standard-card';
import { useAnalyticsDataSelector } from '@/hooks/use-analytics-data';
import { useAnalyticsDataStore } from '@/stores/analytics-data-store';
import { useChartAnimation } from '@/hooks/use-chart-animation';
import { MutedSubheader } from '../muted-subheader';

type StatDataName = 'totalViews' | 'uniqueVisitors' | 'uniquePagesCount';

interface StatCardProps {
  title: string;
  /** @deprecated Use dataName instead */
  value?: number | string;
  dataName?: StatDataName;
  icon: React.ElementType;
  gradient: string;
  delay: string;
}

export function StatCard({ title, value, dataName, icon: Icon, gradient, delay }: StatCardProps) {
  const loading = useAnalyticsDataStore((state) => state.loading);
  const { animationMode, isHighlighting } = useChartAnimation();

  // Always call the selector (hooks must be called unconditionally)
  const storeValue = useAnalyticsDataSelector((data) => {
    if (!data || !dataName) return 0;
    switch (dataName) {
      case 'totalViews':
        return data.totalViews;
      case 'uniqueVisitors':
        return data.uniqueVisitors;
      case 'uniquePagesCount':
        return data.uniquePagesCount;
      default:
        return 0;
    }
  });

  let displayValue: number | string;

  if (dataName) {
    // Show loading skeleton if still loading
    if (loading) {
      displayValue = 'loading';
    } else {
      displayValue = storeValue;
    }
  } else if (value !== undefined) {
    // Deprecated value prop
    displayValue = value;
  } else {
    // Fallback
    displayValue = 0;
  }

  let animationStyle = {};
  if (animationMode === 'stagger') {
    animationStyle = { animation: `fadeInUp 0.6s ${delay} ease-out both` };
  } else if (animationMode === 'highlight' && isHighlighting) {
    animationStyle = { animation: `borderGlow 0.5s ease-out both` };
  }

  const countText =
    displayValue === 'loading' ? (
      <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-24 animate-pulse mt-2" />
    ) : (
      <p className="font-bold bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent mt-2">
        {displayValue.toLocaleString()}
      </p>
    );

  return (
    <StandardCard className="relative" style={animationStyle}>
      <div className="flex flex-row w-full justify-between ">
        <div className="flex flex-col gap-2 md:p-8  items-start justify-center">
          <div className="flex items-start gap-2 min-w-0">
            <div className={`p-3 rounded-xl ${gradient} shadow-lg`}>
              <Icon className="md:w-7 md:h-7 w-5 h-5 text-white" />
            </div>
          </div>
          <MutedSubheader label={title} />
        </div>
        <div className="flex md:pr-6 pr-8 text-7xl items-center">{countText}</div>
      </div>
    </StandardCard>
  );
}
