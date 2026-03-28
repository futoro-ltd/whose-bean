'use client';

import { StandardCard } from '@/components/standard-card';
import { CardContent } from '@/components/ui/card';
import { DomainCard } from './domain-card';
import { DeleteDomainModal } from '@/components/delete-domain-modal';
import { useDomainsQuery } from '@/hooks/use-domains-query';
import { useAuthQuery } from '@/hooks/use-auth-query';
import { useDeleteDomainModal } from '@/hooks/use-delete-domain-modal';
import { useAlerts } from '@/hooks/use-alerts';

export function DomainList() {
  const { domains, isLoading, isError, deleteDomain, isDeleting } = useDomainsQuery();

  const { isAdmin } = useAuthQuery();

  const { deleteDomainModal, closeDeleteDomainModal } = useDeleteDomainModal();
  
  const { setSuccess, setError } = useAlerts();

  const handleConfirmDelete = async () => {
    if (!deleteDomainModal.domainId) return;

    try {
      await deleteDomain(deleteDomainModal.domainId);
      closeDeleteDomainModal();
      setSuccess(`Domain "${deleteDomainModal.domainName}" deleted successfully!`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete domain');
    }
  };

  if (isLoading) {
    return (
      <StandardCard>
        <CardContent className="py-12 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">Loading domains...</p>
        </CardContent>
      </StandardCard>
    );
  }

  if (isError) {
    return (
      <StandardCard>
        <CardContent className="py-12 text-center">
          <p className="text-red-500">Failed to load domains. Please try again.</p>
        </CardContent>
      </StandardCard>
    );
  }

  if (domains.length === 0) {
    return (
      <StandardCard>
        <CardContent className="py-12 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">
            No domains added yet. Add your first domain above!
          </p>
        </CardContent>
      </StandardCard>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {domains.map((domain) => (
          <DomainCard key={domain.id} domain={domain} isAdmin={isAdmin} />
        ))}
      </div>

      <DeleteDomainModal
        open={deleteDomainModal.open}
        loading={isDeleting}
        domainName={deleteDomainModal.domainName || ''}
        onOpenChange={(open) => !open && closeDeleteDomainModal()}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
