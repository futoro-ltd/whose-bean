import { redirect } from 'next/navigation';
import { getCurrentUser, isCurrentUserAdmin } from '@/lib/auth';
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard';
import { getDomainName } from '@/app/actions/domains';
import { checkDomainAnalyticsAccess } from '@/app/actions/analytics-domain-access';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import GotoButton from '@/components/gotoButton';
import { Database } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const domainName = await getDomainName(id);
  return {
    title: `Whose Bean - ${domainName || 'Analytics'}`,
    description: `Analytics dashboard for ${domainName || 'your domain'}`,
  };
}

export default async function AnalyticsDashboardPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();
  const isAdmin = await isCurrentUserAdmin();

  const accessCheck = await checkDomainAnalyticsAccess(id, user?.id);

  if (!accessCheck.success) {
    redirect('/dashboard');
  }

  const { domain: domainInfo } = accessCheck;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <PageHeader
          title="Analytics"
          description="Track your website performance and visitor insights with beautiful visualizations"
          backHref={user ? '/dashboard' : undefined}
        >
          {isAdmin && (
            <GotoButton
              label="Debug"
              href={`/admin/debug-analytics?domainId=${id}`}
              icon={Database}
            />
          )}
        </PageHeader>

        <AnalyticsDashboard
          domain={domainInfo.domain}
          domainId={id}
          isPublic={domainInfo.isPublic}
          userRole={(user?.role as 'admin' | 'user' | null) || null}
        />
      </div>
    </div>
  );
}
