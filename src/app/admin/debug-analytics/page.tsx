import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import {
  getAllAnalyticsEntries,
  getAllDomains,
  getDebugDomainInfo,
} from '@/app/actions/get-all-analytics-entries';
import type { DebugDomainInfo, DebugAnalyticsEntriesResult } from '@/types/analytics-types';
import { DebugAnalyticsClient } from '@/components/debug/debug-analytics-client';
import { DatabaseStats } from '@/components/debug/database-stats';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/page-header';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ domainId?: string; page?: string }>;
}

export default async function DebugAnalyticsPage({ searchParams }: Props) {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    redirect('/dashboard');
  }

  const { domainId, page } = await searchParams;
  const isDev = process.env.NODE_ENV === 'development';
  const currentPage = page ? parseInt(page, 10) : 1;
  const pageSize = 20;

  let entriesResult: DebugAnalyticsEntriesResult = { entries: [], total: 0 };
  let domainInfo: DebugDomainInfo | null = null;
  let domains: { id: string; domain: string }[] = [];
  let entriesError: string | null = null;

  try {
    entriesResult = await getAllAnalyticsEntries(domainId, currentPage, pageSize);
  } catch (e) {
    entriesError = e instanceof Error ? e.message : 'Failed to load analytics entries';
  }

  try {
    domains = await getAllDomains();
  } catch (e) {
    console.error('Failed to load domains:', e);
  }

  if (domainId) {
    try {
      domainInfo = await getDebugDomainInfo(domainId);
    } catch (e) {
      console.error('Failed to load domain info:', e);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <PageHeader
          title="Debug"
          description="Database status and raw analytics entries"
          backHref="/dashboard"
        />

        <DatabaseStats />

        <DebugAnalyticsClient
          entries={entriesResult.entries}
          error={entriesError}
          domains={domains}
          selectedDomainId={domainId}
          domainInfo={domainInfo}
          isDev={isDev}
          page={currentPage}
          pageSize={pageSize}
          total={entriesResult.total}
        />
      </div>
    </div>
  );
}
