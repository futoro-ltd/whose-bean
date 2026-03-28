'use client';

import type { DebugAnalyticsEntry, DebugDomainInfo } from '@/types/analytics-types';
import { DebugAnalyticsTable } from './debug-analytics-table';
import { DomainFilter } from './domain-filter';
import { DomainStats } from './domain-stats';
import { MockAnalyticsGenerator } from './mock-analytics-generator';
import { StandardCard } from '../standard-card';

interface DebugAnalyticsClientProps {
  entries: DebugAnalyticsEntry[];
  error: string | null;
  domains: { id: string; domain: string }[];
  selectedDomainId?: string;
  domainInfo: DebugDomainInfo | null;
  isDev: boolean;
  page: number;
  pageSize: number;
  total: number;
}

export function DebugAnalyticsClient({
  entries,
  error,
  domains,
  selectedDomainId,
  domainInfo,
  isDev,
  page,
  pageSize,
  total,
}: DebugAnalyticsClientProps) {
  return (
    <StandardCard title="Domain Related">
      <div className="flex flex-col gap-8">
        <DomainFilter domains={domains} selectedDomainId={selectedDomainId} />
        {selectedDomainId && domainInfo && <DomainStats domainInfo={domainInfo} />}
        {isDev && selectedDomainId && (
          <MockAnalyticsGenerator selectedDomainId={selectedDomainId} />
        )}
        <DebugAnalyticsTable
          entries={entries}
          error={error}
          page={page}
          pageSize={pageSize}
          total={total}
        />
      </div>
    </StandardCard>
  );
}
