'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDomainAccessUsers,
  grantDomainAccess,
  revokeDomainAccess,
} from '@/app/actions/domain-access';
import { getAllUsers } from '@/app/actions/admin';
import type { User } from '@/types/auth-types';
import type { DomainAccessUserWithDateString } from '@/types/domain-types';

export type { User, DomainAccessUserWithDateString };

export function useDomainAccess(domainId: string) {
  const queryClient = useQueryClient();

  // Query for users who have access to this domain
  const usersQuery = useQuery({
    queryKey: ['domain-access', domainId, 'users'],
    queryFn: async () => {
      const result = await getDomainAccessUsers(domainId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.users.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
      })) as DomainAccessUserWithDateString[];
    },
    staleTime: 30 * 1000,
  });

  // Query for all users (for the grant dropdown)
  const allUsersQuery = useQuery({
    queryKey: ['admin', 'all-users'],
    queryFn: async () => {
      const result = await getAllUsers();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.users.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
      })) as Pick<User, 'id' | 'email' | 'role'>[];
    },
    staleTime: 30 * 1000,
  });

  // Grant access mutation
  const grantAccessMutation = useMutation({
    mutationFn: async (userId: string) => {
      const result = await grantDomainAccess(domainId, userId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onMutate: async (userId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['domain-access', domainId, 'users'] });

      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData(['domain-access', domainId, 'users']);

      // Optimistically update by adding the user
      queryClient.setQueryData(
        ['domain-access', domainId, 'users'],
        (old: DomainAccessUserWithDateString[] | undefined) => {
          if (!old) return old;
          // Find the user in allUsers to get their data
          const allUsers = queryClient.getQueryData(['admin', 'all-users']) as
            | Pick<User, 'id' | 'email' | 'role'>[]
            | undefined;
          const userToAdd = allUsers?.find((u) => u.id === userId);
          if (!userToAdd) return old;

          // Create a new DomainAccessUser entry
          const newUser: DomainAccessUserWithDateString = {
            id: userToAdd.id,
            email: userToAdd.email,
            role: userToAdd.role,
            createdAt: new Date().toISOString(), // Approximate, server will correct
          };

          return [...old, newUser].sort((a, b) => a.email.localeCompare(b.email));
        }
      );

      return { previousUsers };
    },
    onError: (err, userId, context) => {
      // Rollback on error
      queryClient.setQueryData(['domain-access', domainId, 'users'], context?.previousUsers);
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['domain-access', domainId, 'users'] });
    },
  });

  // Revoke access mutation
  const revokeAccessMutation = useMutation({
    mutationFn: async (userId: string) => {
      const result = await revokeDomainAccess(domainId, userId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onMutate: async (userId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['domain-access', domainId, 'users'] });

      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData(['domain-access', domainId, 'users']);

      // Optimistically update by removing the user
      queryClient.setQueryData(
        ['domain-access', domainId, 'users'],
        (old: DomainAccessUserWithDateString[] | undefined) => {
          if (!old) return old;
          return old.filter((u) => u.id !== userId);
        }
      );

      return { previousUsers };
    },
    onError: (err, userId, context) => {
      // Rollback on error
      queryClient.setQueryData(['domain-access', domainId, 'users'], context?.previousUsers);
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['domain-access', domainId, 'users'] });
    },
  });

  // Transform dates and handle errors
  const users = usersQuery.data ?? [];
  const allUsers = allUsersQuery.data ?? [];

  // Extract error messages
  const usersError = usersQuery.isError
    ? usersQuery.error instanceof Error
      ? usersQuery.error.message
      : 'Failed to load users with access'
    : null;

  const allUsersError = allUsersQuery.isError
    ? allUsersQuery.error instanceof Error
      ? allUsersQuery.error.message
      : 'Failed to load all users'
    : null;

  const grantError = grantAccessMutation.isError
    ? grantAccessMutation.error instanceof Error
      ? grantAccessMutation.error.message
      : 'Failed to grant access'
    : null;

  const revokeError = revokeAccessMutation.isError
    ? revokeAccessMutation.error instanceof Error
      ? revokeAccessMutation.error.message
      : 'Failed to revoke access'
    : null;

  return {
    // Data
    users,
    allUsers,

    // Loading states
    isLoadingUsers: usersQuery.isLoading,
    isLoadingAllUsers: allUsersQuery.isLoading,

    // Error states
    usersError,
    allUsersError,
    grantError,
    revokeError,

    // Mutations
    grantAccess: grantAccessMutation.mutateAsync,
    revokeAccess: revokeAccessMutation.mutateAsync,

    // Mutation states
    isGranting: grantAccessMutation.isPending,
    isRevoking: revokeAccessMutation.isPending,
    revokingUserId: revokeAccessMutation.variables ?? null,

    // Refetch
    refetchUsers: usersQuery.refetch,
    refetchAllUsers: allUsersQuery.refetch,
  };
}
