'use client';

import { Laptop, Globe, Monitor, Filter } from 'lucide-react';
import { useAnalyticsFilterStore, FILTER_OPTIONS } from '@/stores/analytics-filter-store';
import { PERIOD_OPTIONS } from '@/data/period-options';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StandardCard } from '@/components/standard-card';
import { CardContent } from '@/components/ui/card';
import { FilterDropdownButton } from '@/components/filter-dropdown-button';
import { MutedSubheader } from '../muted-subheader';

export function AnalyticsFilters() {
  const {
    period,
    setPeriod,
    operatingSystems,
    setOperatingSystems,
    browsers,
    setBrowsers,
    devices,
    setDevices,
  } = useAnalyticsFilterStore();

  return (
    <StandardCard className="sticky top-0 z-50 bg-zinc-500/20 dark:bg-zinc-700/20 backdrop-blur-xl">
      <div className="flex md:flex-row flex-col items-center justify-between space-y-2">
        <div className="flex flex-row md:w-3/4 w-full items-center justify-between">
          <div className="md:w-1/3 flex flex-row items-center gap-4">
            <div className="flex p-3 rounded-xl shadow-lg bg-gradient-to-br from-indigo-500 to-violet-500">
              <Filter className="w-5 h-5 text-white" />{' '}
            </div>
            <div className="flex gap-2">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white truncate">
                Filter
              </h3>
            </div>
          </div>

          <div className="flex md:w-2/3 justify-center">
            <div className="flex gap-2 w-full justify-end md:justify-center">
              <FilterDropdownButton
                label="Operating Systems"
                icon={Laptop}
                options={[...FILTER_OPTIONS.operatingSystems]}
                selectedValues={operatingSystems}
                onSelectionChange={setOperatingSystems}
              />
              <FilterDropdownButton
                label="Browsers"
                icon={Globe}
                options={[...FILTER_OPTIONS.browsers]}
                selectedValues={browsers}
                onSelectionChange={setBrowsers}
              />
              <FilterDropdownButton
                label="Devices"
                icon={Monitor}
                options={[...FILTER_OPTIONS.devices]}
                selectedValues={devices}
                onSelectionChange={setDevices}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:w-1/4 w-full md:justify-end justify-center">
          <span className="text-sm text-zinc-500 dark:text-zinc-400 md:flex hidden">Period:</span>
          <Select
            value={period}
            onValueChange={(value: string | null) => value && setPeriod(value as typeof period)}
          >
            <SelectTrigger className="md:w-40 w-full justify-center">
              <SelectValue>{PERIOD_OPTIONS.find((o) => o.value === period)?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </StandardCard>
  );
}
