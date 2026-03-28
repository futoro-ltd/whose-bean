'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDomains,
  deleteDomain,
  createDomain,
  toggleDomainVisibility,
} from '@/app/actions/domains';
import type { DomainWithCount, Domain } from '@/types/domain-types';

export type { Domain };

export function useDomainsQuery() {
  const queryClient = useQueryClient();

  const domainsQuery = useQuery({
    queryKey: ['domains'],
    queryFn: async () => {
      const result = await getDomains();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.domains.map((d: DomainWithCount) => ({
        ...d,
        createdAt: d.createdAt.toISOString(),
      })) as Domain[];
    },
    staleTime: 30 * 1000,
  });

  const deleteDomainMutation = useMutation({
    mutationFn: async (domainId: string) => {
      const result = await deleteDomain(domainId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onMutate: async (domainId) => {
      await queryClient.cancelQueries({ queryKey: ['domains'] });
      const previousDomains = queryClient.getQueryData(['domains']);
      queryClient.setQueryData(['domains'], (old: Domain[] | undefined) =>
        old?.filter((domain) => domain.id !== domainId)
      );
      return { previousDomains };
    },
    onError: (err, domainId, context) => {
      queryClient.setQueryData(['domains'], context?.previousDomains);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
    },
  });

  const createDomainMutation = useMutation({
    mutationFn: async (data: { domain: string }) => {
      const result = await createDomain(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async (domainId: string) => {
      const result = await toggleDomainVisibility(domainId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onMutate: async (domainId) => {
      await queryClient.cancelQueries({ queryKey: ['domains'] });
      const previousDomains = queryClient.getQueryData(['domains']);
      queryClient.setQueryData(['domains'], (old: Domain[] | undefined) =>
        old?.map((domain) =>
          domain.id === domainId ? { ...domain, isPublic: !domain.isPublic } : domain
        )
      );
      return { previousDomains };
    },
    onError: (err, domainId, context) => {
      queryClient.setQueryData(['domains'], context?.previousDomains);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
    },
  });

  return {
    domains: domainsQuery.data ?? [],
    isLoading: domainsQuery.isLoading,
    isError: domainsQuery.isError,
    error: domainsQuery.error,
    refetch: domainsQuery.refetch,
    deleteDomain: deleteDomainMutation.mutateAsync,
    isDeleting: deleteDomainMutation.isPending,
    createDomain: createDomainMutation.mutateAsync,
    isCreating: createDomainMutation.isPending,
    toggleVisibility: toggleVisibilityMutation.mutateAsync,
    isToggling: toggleVisibilityMutation.isPending,
  };
}
