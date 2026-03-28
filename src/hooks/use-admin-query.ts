'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, deleteUser, promoteToAdmin } from '@/app/actions/admin';
import { inviteUser } from '@/app/actions/invite';
import { createUserAction } from '@/app/actions/create-user';
import type { UserWithStringDate as User } from '@/types/auth-types';

export type { User };

export function useAdminQuery() {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const result = await getAllUsers();
      if (!result.success) {
        throw new Error(result.error);
      }
      return {
        users: result.users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() })) as User[],
        adminCount: result.adminCount,
      };
    },
    staleTime: 30 * 1000,
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const result = await deleteUser(userId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ['admin', 'users'] });
      const previousData = queryClient.getQueryData(['admin', 'users']);
      queryClient.setQueryData(
        ['admin', 'users'],
        (old: { users: User[]; adminCount: number } | undefined) => {
          if (!old) return old;
          const deletedUser = old.users.find((u) => u.id === userId);
          return {
            users: old.users.filter((u) => u.id !== userId),
            adminCount: deletedUser?.role === 'admin' ? old.adminCount - 1 : old.adminCount,
          };
        }
      );
      return { previousData };
    },
    onError: (err, userId, context) => {
      queryClient.setQueryData(['admin', 'users'], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  const promoteToAdminMutation = useMutation({
    mutationFn: async (userId: string) => {
      const result = await promoteToAdmin(userId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ['admin', 'users'] });
      const previousData = queryClient.getQueryData(['admin', 'users']);
      queryClient.setQueryData(
        ['admin', 'users'],
        (old: { users: User[]; adminCount: number } | undefined) => {
          if (!old) return old;
          return {
            users: old.users.map((u) => (u.id === userId ? { ...u, role: 'admin' } : u)),
            adminCount: old.adminCount + 1,
          };
        }
      );
      return { previousData };
    },
    onError: (err, userId, context) => {
      queryClient.setQueryData(['admin', 'users'], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  const inviteUserMutation = useMutation({
    mutationFn: async (data: { email: string; isAdmin: boolean }) => {
      const result = await inviteUser(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: { email: string; password: string; isAdmin: boolean }) => {
      const result = await createUserAction(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  return {
    users: usersQuery.data?.users ?? [],
    adminCount: usersQuery.data?.adminCount ?? 0,
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error,
    refetch: usersQuery.refetch,
    deleteUser: deleteUserMutation.mutateAsync,
    isDeleting: deleteUserMutation.isPending,
    deleteError: deleteUserMutation.error,
    promoteToAdmin: promoteToAdminMutation.mutateAsync,
    isPromoting: promoteToAdminMutation.isPending,
    promoteError: promoteToAdminMutation.error,
    inviteUser: inviteUserMutation.mutateAsync,
    isInviting: inviteUserMutation.isPending,
    inviteError: inviteUserMutation.error,
    createUser: createUserMutation.mutateAsync,
    isCreatingUser: createUserMutation.isPending,
    createUserError: createUserMutation.error,
  };
}
