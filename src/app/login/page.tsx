import { Suspense } from 'react';
import { LoginPageContent } from '@/components/login/login-page-content';
import { LoginPageContentSkeleton } from '@/components/login/login-page-content-skeleton';

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageContentSkeleton />}>
      <LoginPageContent />
    </Suspense>
  );
}
