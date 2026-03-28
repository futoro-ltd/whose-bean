'use client';

import { create } from 'zustand';

export interface AnalyticsData {
  domain: string;
  isPublic: boolean;
  totalViews: number;
  uniqueVisitors: number;
  uniquePagesCount: number;
  topPages: { path: string; views: number }[];
  viewsOverTime: { date: string; views: number }[];
  visitorsOverTime: { date: string; visitors: number }[];
  browsers: { browser: string; count: number }[];
  devices: { device: string; count: number }[];
  operatingSystems: { os: string; count: number }[];
  countries: { country: string; count: number }[];
  referrers: { referrer: string; count: number }[];
}

interface AnalyticsDataState {
  data: AnalyticsData | null;
  dataVersion: number;
  loading: boolean;
  isUpdating: boolean;
  isLive: boolean;
  domainId: string | null;
  error: string | null;
  hasCompletedInitialLoad: boolean;
  setAnalyticsData: (data: AnalyticsData | null) => void;
  setLoading: (loading: boolean) => void;
  setIsUpdating: (updating: boolean) => void;
  setIsLive: (isLive: boolean) => void;
  setDomainId: (domainId: string | null) => void;
  setError: (error: string | null) => void;
  setHasCompletedInitialLoad: (complete: boolean) => void;
  clearAnalyticsData: () => void;
}

export const useAnalyticsDataStore = create<AnalyticsDataState>((set) => ({
  data: null,
  dataVersion: 0,
  loading: true,
  isUpdating: false,
  isLive: false,
  domainId: null,
  error: null,
  hasCompletedInitialLoad: false,
  setAnalyticsData: (data) => set((state) => ({ data, dataVersion: state.dataVersion + 1 })),
  setLoading: (loading) => set({ loading }),
  setIsUpdating: (updating) => set({ isUpdating: updating }),
  setIsLive: (isLive) => set({ isLive }),
  setDomainId: (domainId) => set({ domainId }),
  setError: (error) => set({ error }),
  setHasCompletedInitialLoad: (complete) => set({ hasCompletedInitialLoad: complete }),
  clearAnalyticsData: () =>
    set({
      data: null,
      dataVersion: 0,
      loading: true,
      isUpdating: false,
      isLive: false,
      domainId: null,
      error: null,
      hasCompletedInitialLoad: false,
    }),
}));
