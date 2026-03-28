'use client';

import { useUIStore } from '@/stores/ui-store';

export function useDeleteDomainModal() {
  const { deleteDomainModal, openDeleteDomainModal, closeDeleteDomainModal } = useUIStore();

  return {
    deleteDomainModal,
    openDeleteDomainModal,
    closeDeleteDomainModal,
  };
}
