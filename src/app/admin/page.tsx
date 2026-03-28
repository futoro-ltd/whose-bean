import { Suspense } from 'react';
import { NewUserCard } from '@/components/user-management/new-user-card';
import { UserManagementTable } from '@/components/user-management/user-management-table';
import { UserManagementTableSkeleton } from '@/components/user-management/user-management-table-skeleton';
import { DomainAccessOverview } from '@/components/domain-access/domain-access-overview';
import { DomainAccessOverviewSkeleton } from '@/components/domain-access/domain-access-overview-skeleton';
import { DangerZone } from '@/components/admin/danger-zone';
import { PageHeader } from '@/components/page-header';

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <PageHeader
          title="Admin"
          description="Manage users, domains, and system settings"
          backHref="/dashboard"
        />
        <div className="flex flex-col gap-8">
          <NewUserCard />
          <Suspense fallback={<UserManagementTableSkeleton />}>
            <UserManagementTable />
          </Suspense>
          <Suspense fallback={<DomainAccessOverviewSkeleton />}>
            <DomainAccessOverview />
          </Suspense>
          <DangerZone />
        </div>
      </div>
    </div>
  );
}
