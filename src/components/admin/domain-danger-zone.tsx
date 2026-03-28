'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DeleteAllEntriesModal } from './delete-all-entries-modal';
import { deleteAllAnalyticsEntries } from '@/app/actions/admin';
import { useAlerts } from '@/hooks/use-alerts';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangleIcon } from 'lucide-react';

interface DomainDangerZoneProps {
  domain: string;
  domainId: string;
}

export function DomainDangerZone({ domain, domainId }: DomainDangerZoneProps) {
  const { setError, setSuccess } = useAlerts();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteAllEntries = async () => {
    setLoading(true);

    const result = await deleteAllAnalyticsEntries(domainId);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess('All analytics entries cleared successfully');
    setShowDeleteModal(false);
    setLoading(false);
    queryClient.invalidateQueries({ queryKey: ['analytics', domainId] });
  };

  return (
    <>
      <div className="flex md:flex-row flex-col items-center justify-between space-y-4">
        <div>
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Clear All Analytics</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Permanently delete all analytics data for {domain}. This action cannot be undone.
          </p>
        </div>
        <Button variant="destructive" onClick={() => setShowDeleteModal(true)} className="gap-1">
          <AlertTriangleIcon />
          <span>Clear All Analytics</span>
        </Button>
      </div>

      <DeleteAllEntriesModal
        open={showDeleteModal}
        loading={loading}
        domainName={domain}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDeleteAllEntries}
      />
    </>
  );
}
