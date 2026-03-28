import { StatCard } from './stat-card';
import type { DebugDomainInfo } from '@/types/analytics-types';

interface DomainStatsProps {
  domainInfo: DebugDomainInfo;
}

export function DomainStats({ domainInfo }: DomainStatsProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
        Stats for Selected Domain
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Entries" value={domainInfo.entryCount} />
        <StatCard label="Unique Sessions" value={domainInfo.uniqueSessionCount} />
        <StatCard label="Bot Entries" value={domainInfo.botCount} />
        <StatCard label="Last 24h" value={domainInfo.entriesLast24h} />
        <StatCard label="Last 7 days" value={domainInfo.entriesLast7d} />
      </div>
    </div>
  );
}
