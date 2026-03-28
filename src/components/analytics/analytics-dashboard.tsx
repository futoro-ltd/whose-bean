import { AnalyticsFilters } from '@/components/analytics/analytics-filters';
import { AnalyticsStatus } from '@/components/analytics/analytics-status';
import { AnalyticsDashboardSection } from './analytics-dashboard-section';
import { AdminControlCard } from './admin-control-card';
import { TrackDomainCard } from '../track-domain-card';

interface AnalyticsDashboardProps {
  domain: string;
  domainId: string;
  isPublic: boolean;
  userRole: 'admin' | 'user' | null;
}

export function AnalyticsDashboard({
  domain,
  domainId,
  isPublic,
  userRole,
}: AnalyticsDashboardProps) {
  return (
    <div className="space-y-8">
      <AnalyticsStatus
        domain={domain}
        domainId={domainId}
        isPublic={isPublic}
        userRole={userRole}
      />

      <div>
        {userRole === 'admin' && <AdminControlCard domain={domain} domainId={domainId} />}
        {userRole === 'user' && <TrackDomainCard domain={domain} domainId={domainId} />}
      </div>

      <div className="max-w-6xl mx-auto sticky top-0 z-50 ">
        <AnalyticsFilters />
      </div>

      <AnalyticsDashboardSection domainId={domainId} />
    </div>
  );
}
