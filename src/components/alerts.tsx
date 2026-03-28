'use client';

import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAlerts } from '@/hooks/use-alerts';

export function Alerts() {
  const { error, success } = useAlerts();

  if (!error && !success) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-full mx-4 space-y-2">
      {error && (
        <Alert variant="destructive" className="shadow-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="shadow-lg border-green-500/50 bg-green-50 text-green-800 dark:bg-green-950/50 dark:text-green-200">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
