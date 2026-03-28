import { getDebugDatabaseInfo } from '@/app/actions/get-all-analytics-entries';
import type { DebugDatabaseInfo } from '@/types/analytics-types';
import { StatCard } from './stat-card';
import { StandardCard } from '../standard-card';

export async function DatabaseStats() {
  let dbInfo: DebugDatabaseInfo | null = null;
  let error: string | null = null;

  try {
    dbInfo = await getDebugDatabaseInfo();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load database info';
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
        {error}
      </div>
    );
  }

  if (!dbInfo) {
    return (
      <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-md">
        <span className="text-zinc-500 dark:text-zinc-400">Loading database info...</span>
      </div>
    );
  }

  return (
    <StandardCard title="Overall Database Stats">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard label="Users" value={dbInfo.userCount} sublabel={`${dbInfo.adminCount} admins`} />
        <StatCard label="Invitations" value={dbInfo.invitationCount} />
        <StatCard label="Password Tokens" value={dbInfo.passwordResetTokenCount} />
        <StatCard
          label="Domains"
          value={dbInfo.domainCount}
          sublabel={`${dbInfo.publicDomainCount} public, ${dbInfo.privateDomainCount} private`}
        />
        <StatCard label="Analytics Entries" value={dbInfo.analyticsEntryCount} />
        <StatCard label="Bot Entries" value={dbInfo.botCount} />
      </div>
    </StandardCard>
  );
}
