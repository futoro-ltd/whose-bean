import { Suspense } from 'react';
import { AccountInformationCard } from './account-information-card';
import { AccountInformationCardSkeleton } from './account-information-card-skeleton';
import { ChangePasswordForm } from './change-password-form';

export function SettingsContent() {
  return (
    <div className="flex lg:flex-row flex-col gap-8">
      <Suspense fallback={<AccountInformationCardSkeleton />}>
        <AccountInformationCard />
      </Suspense>
      <ChangePasswordForm />
    </div>
  );
}
