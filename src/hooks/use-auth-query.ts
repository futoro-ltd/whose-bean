'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUserServer } from '@/app/actions/auth';
import { CurrentUser } from '@/types/auth-types';

export type { CurrentUser };

export function useAuthQuery() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: async () => {
      const result = await getCurrentUserServer();
      return result as CurrentUser | null;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

  const isAdmin = user?.role === 'admin';

  const clearAuth = () => {
    queryClient.setQueryData(['auth', 'currentUser'], null);
  };

  const refetchUser = async () => {
    await refetch();
  };

  return {
    user,
    isAdmin,
    isLoading,
    isError,
    error,
    clearAuth,
    refetchUser,
  };
}
