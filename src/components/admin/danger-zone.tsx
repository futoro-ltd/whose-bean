'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { StandardCard } from '@/components/standard-card';
import { DeleteAllDomainsModal } from './delete-all-domains-modal';
import { ResetDatabaseModal } from './reset-database-modal';
import { deleteAllDomains, resetDatabase } from '@/app/actions/admin';
import { useAlerts } from '@/hooks/use-alerts';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangleIcon } from 'lucide-react';
import { MutedSubheader } from '../muted-subheader';

const RESET_PHRASES = [
  'reset-all-db',
  'destroy-everything',
  'clear-data-2024',
  'nuke-the-database',
  'wipe-it-all',
  'start-fresh',
  'delete-all-now',
  'total-reset',
];

export function DangerZone() {
  const { setError, setSuccess } = useAlerts();
  const queryClient = useQueryClient();
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetPhrase, setResetPhrase] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteAllDomains = async () => {
    setLoading(true);

    const result = await deleteAllDomains();

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess('All domains deleted successfully');
    setShowDeleteAllModal(false);
    setLoading(false);
    queryClient.invalidateQueries({ queryKey: ['domains'] });
    queryClient.invalidateQueries({ queryKey: ['domain-access', 'all'] });
  };

  const openResetModal = () => {
    const randomPhrase = RESET_PHRASES[Math.floor(Math.random() * RESET_PHRASES.length)];
    setCurrentPhrase(randomPhrase);
    setResetPhrase('');
    setShowResetModal(true);
  };

  const handleResetDatabase = async () => {
    setResetLoading(true);

    const result = await resetDatabase();

    if (!result.success) {
      setError(result.error);
      setResetLoading(false);
      return;
    }

    window.location.href = '/login';
  };

  return (
    <>
      <StandardCard
        title="Danger Zone"
        description="Irreversible and destructive actions"
        className=" border-red-200 dark:border-red-800 bg-red-300/40 dark:bg-red-900/40"
      >
        <div className="space-y-6">
          <div className="flex md:flex-row gap-2 flex-col items-center justify-between">
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Delete All Domains</h3>
              <MutedSubheader
                label="Permanently delete all domains and their analytics data. This action cannot be
                undone."
              />
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteAllModal(true)}
              className="gap-1"
            >
              <AlertTriangleIcon />
              Delete All Domains
            </Button>
          </div>

          <Separator className="bg-red-200 dark:bg-red-900 h-0.5" />

          <div className="flex md:flex-row gap-2 flex-col  items-center justify-between">
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Reset Database</h3>
              <MutedSubheader label="Wipe all data including users, domains, and analytics. This will log you out" />
            </div>
            <Button variant="destructive" onClick={openResetModal} className="gap-1">
              <AlertTriangleIcon />
              Reset Database
            </Button>
          </div>
        </div>
      </StandardCard>

      <DeleteAllDomainsModal
        open={showDeleteAllModal}
        loading={loading}
        onOpenChange={setShowDeleteAllModal}
        onConfirm={handleDeleteAllDomains}
      />

      <ResetDatabaseModal
        open={showResetModal}
        phrase={resetPhrase}
        currentPhrase={currentPhrase}
        loading={resetLoading}
        error={''}
        onOpenChange={setShowResetModal}
        onPhraseChange={setResetPhrase}
        onConfirm={handleResetDatabase}
      />
    </>
  );
}
