'use client';

import { create } from 'zustand';
import { Period, Granularity, getGranularity } from '@/data/period-options';
import { OPERATING_SYSTEMS, BROWSERS, DEVICES } from '@/data/filter-options';

export const FILTER_OPTIONS = {
  operatingSystems: [
    { label: 'All', value: 'All' },
    ...OPERATING_SYSTEMS,
    { label: 'Unknown', value: 'Unknown' },
  ],
  browsers: [{ label: 'All', value: 'All' }, ...BROWSERS, { label: 'Unknown', value: 'Unknown' }],
  devices: [{ label: 'All', value: 'All' }, ...DEVICES],
} as const;

interface AnalyticsFilterState {
  period: Period;
  granularity: Granularity;
  operatingSystems: string[];
  browsers: string[];
  devices: string[];
  setPeriod: (period: Period) => void;
  setOperatingSystems: (values: string[]) => void;
  setBrowsers: (values: string[]) => void;
  setDevices: (values: string[]) => void;
}

export const useAnalyticsFilterStore = create<AnalyticsFilterState>((set) => ({
  period: 'last7days',
  granularity: 'day',
  operatingSystems: [...OPERATING_SYSTEMS.map((os) => os.value), 'Unknown'],
  browsers: [...BROWSERS.map((b) => b.value), 'Unknown'],
  devices: [...DEVICES.map((d) => d.value)],

  setPeriod: (period) => set({ period, granularity: getGranularity(period) }),
  setOperatingSystems: (values) => set({ operatingSystems: values }),
  setBrowsers: (values) => set({ browsers: values }),
  setDevices: (values) => set({ devices: values }),
}));
