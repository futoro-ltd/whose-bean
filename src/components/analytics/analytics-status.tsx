'use client';

import { Sparkles } from 'lucide-react';
import { DomainVisibilityToggle } from '@/components/dashboard/domain-visibility-toggle';
import { useAnalyticsData } from '@/hooks/use-analytics-data';
import { useState } from 'react';

interface AnalyticsHeaderProps {
  domain: string;
  domainId: string;
  isPublic: boolean;
  userRole: 'admin' | 'user' | null;
}

export function AnalyticsStatus({ domain, domainId, isPublic, userRole }: AnalyticsHeaderProps) {
  const [isPublicState, setIsPublicState] = useState(isPublic);
  const { isLive } = useAnalyticsData();

  return (
    <div
      className="text-center mb-6 md:mb-12"
      style={{ animation: `fadeInUp 0.6s 0s ease-out both` }}
    >
      <div className="inline-flex md:flex-row flex-col items-center gap-2 flex-wrap justify-center">
        <div className="flex items-center gap-2">
          <DomainBadge domain={domain} />
          <LiveStatus isLive={isLive} />
        </div>
        <div className="flex gap-2 md:flex-row flex-col">
          <DomainVisibilityToggle
            domainId={domainId}
            isPublic={isPublicState}
            isAdmin={userRole === 'admin'}
            onToggle={setIsPublicState}
          />
        </div>
      </div>
    </div>
  );
}

function DomainBadge({ domain }: { domain: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm md:text-base font-medium">
      <Sparkles className="w-4 h-4" />
      <span className="flex gap-2">
        <span className="md:flex hidden font-thin">Analytics for</span>{' '}
        <span className="font-bold">{domain}</span>
      </span>
    </div>
  );
}

function LiveStatus({ isLive }: { isLive: boolean }) {
  return (
    <div
      className={`w-24 justify-center inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${isLive ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`}
      />
      {isLive ? 'Live' : 'Connecting...'}
    </div>
  );
}
