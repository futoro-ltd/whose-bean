import { AddDomainForm, DomainList } from '@/components/dashboard';
import GotoButton from '@/components/gotoButton';
import { PageHeader } from '@/components/page-header';
import { isCurrentUserAdmin } from '@/lib/auth';
import { SettingsIcon, ShieldEllipsis } from 'lucide-react';

export default async function DashboardPage() {
  const isAdmin = await isCurrentUserAdmin();

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <PageHeader title="Domains" description="View and manage your tracked domains">
          <GotoButton label="Settings" href="/settings" icon={SettingsIcon} />
          {isAdmin && <GotoButton label="Admin" href="/admin" icon={ShieldEllipsis} />}
        </PageHeader>
        <AddDomainForm />
        <DomainList />
      </div>
    </div>
  );
}
