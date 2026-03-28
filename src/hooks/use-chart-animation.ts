'use client';

import { useState, useEffect, useRef } from 'react';
import { useAnalyticsDataStore } from '@/stores/analytics-data-store';
import { useAnalyticsFilterStore } from '@/stores/analytics-filter-store';

export function useChartAnimation() {
  const data = useAnalyticsDataStore((state) => state.data);
  const domainId = useAnalyticsDataStore((state) => state.domainId);
  const hasCompletedInitialLoad = useAnalyticsDataStore((state) => state.hasCompletedInitialLoad);
  const setHasCompletedInitialLoad = useAnalyticsDataStore(
    (state) => state.setHasCompletedInitialLoad
  );
  const period = useAnalyticsFilterStore((state) => state.period);
  const [animationMode, setAnimationMode] = useState<'stagger' | 'highlight'>(() =>
    hasCompletedInitialLoad ? 'highlight' : 'stagger'
  );
  const [isHighlighting, setIsHighlighting] = useState(false);

  const prevDomainIdRef = useRef(domainId);
  const prevPeriodRef = useRef(period);
  const initialTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const highlightTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Sync animationMode when hasCompletedInitialLoad changes
  useEffect(() => {
    if (hasCompletedInitialLoad) {
      setAnimationMode('highlight');
    }
  }, [hasCompletedInitialLoad]);

  // Reset on domain change
  useEffect(() => {
    if (domainId !== prevDomainIdRef.current) {
      prevDomainIdRef.current = domainId;
      prevPeriodRef.current = period;
      setAnimationMode('stagger');
      setIsHighlighting(false);
      if (initialTimerRef.current) clearTimeout(initialTimerRef.current);
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    }
  }, [domainId, period]);

  // Stagger only on first load
  useEffect(() => {
    if (data && !hasCompletedInitialLoad) {
      initialTimerRef.current = setTimeout(() => {
        setAnimationMode('highlight');
        setHasCompletedInitialLoad(true);
      }, 2000);
    }

    return () => {
      if (initialTimerRef.current) clearTimeout(initialTimerRef.current);
    };
  }, [data, hasCompletedInitialLoad, setHasCompletedInitialLoad]);

  // Border glow on live updates (not filter changes)
  useEffect(() => {
    if (data && hasCompletedInitialLoad) {
      const periodChanged = period !== prevPeriodRef.current;
      prevPeriodRef.current = period;

      if (!periodChanged) {
        setIsHighlighting(true);
        highlightTimerRef.current = setTimeout(() => {
          setIsHighlighting(false);
        }, 500);
      }
    }

    return () => {
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    };
  }, [data, period, hasCompletedInitialLoad]);

  return { animationMode, isHighlighting };
}
