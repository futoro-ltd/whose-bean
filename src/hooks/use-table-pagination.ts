'use client';

import { useState } from 'react';
import { PaginationState, SortingState, OnChangeFn } from '@tanstack/react-table';

export function useTablePagination(
  defaultPageSize: number = 10,
  defaultSortColumn: string = 'timestamp'
) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const sortBy = sorting[0]?.id || defaultSortColumn;
  const sortOrder = sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : 'desc';

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
    setSorting(newSorting);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return {
    pagination,
    setPagination,
    sorting,
    setSorting,
    sortBy,
    sortOrder,
    handleSortingChange,
  };
}
