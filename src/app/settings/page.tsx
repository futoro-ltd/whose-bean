import { PageHeader } from '@/components/page-header';
import { SettingsContent } from '@/components/settings/settings-content';

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <PageHeader
          title="Settings"
          description="Manage your account settings and preferences"
          backHref="/dashboard"
        />
        <SettingsContent />
      </div>
    </div>
  );
}
