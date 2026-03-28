'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { DebugAnalyticsEntry } from '@/types/analytics-types';
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ColumnDef, SortingState, PaginationState } from '@tanstack/react-table';
import { formatDate } from '@/lib/format-utils';

const SESSION_COLORS = [
  '!bg-teal-200 dark:!bg-teal-800 !border-l-4 !border-teal-600 dark:!border-teal-400',
  '!bg-lime-200 dark:!bg-lime-800 !border-l-4 !border-lime-600 dark:!border-lime-400',
  '!bg-yellow-200 dark:!bg-yellow-800 !border-l-4 !border-yellow-600 dark:!border-yellow-400',
  '!bg-stone-200 dark:!bg-stone-800 !border-l-4 !border-stone-600 dark:!border-stone-400',
  '!bg-neutral-200 dark:!bg-neutral-800 !border-l-4 !border-neutral-600 dark:!border-neutral-400',
  '!bg-fuchsia-200 dark:!bg-fuchsia-800 !border-l-4 !border-fuchsia-600 dark:!border-fuchsia-400',
  '!bg-pink-200 dark:!bg-pink-800 !border-l-4 !border-pink-600 dark:!border-pink-400',
  '!bg-rose-200 dark:!bg-rose-800 !border-l-4 !border-rose-600 dark:!border-rose-400',
  '!bg-sky-200 dark:!bg-sky-800 !border-l-4 !border-sky-600 dark:!border-sky-400',
  '!bg-red-200 dark:!bg-red-800 !border-l-4 !border-red-600 dark:!border-red-400',
  '!bg-emerald-200 dark:!bg-emerald-800 !border-l-4 !border-emerald-600 dark:!border-emerald-400',
  '!bg-cyan-200 dark:!bg-cyan-800 !border-l-4 !border-cyan-600 dark:!border-cyan-400',
  '!bg-blue-200 dark:!bg-blue-800 !border-l-4 !border-blue-600 dark:!border-blue-400',
  '!bg-orange-200 dark:!bg-orange-800 !border-l-4 !border-orange-600 dark:!border-orange-400',
  '!bg-amber-200 dark:!bg-amber-800 !border-l-4 !border-amber-600 dark:!border-amber-400',
  '!bg-green-200 dark:!bg-green-800 !border-l-4 !border-green-600 dark:!border-green-400',
  '!bg-slate-200 dark:!bg-slate-800 !border-l-4 !border-slate-600 dark:!border-slate-400',
  '!bg-zinc-200 dark:!bg-zinc-800 !border-l-4 !border-zinc-600 dark:!border-zinc-400',
  '!bg-gray-200 dark:!bg-gray-800 !border-l-4 !border-gray-600 dark:!border-gray-400',
  '!bg-indigo-200 dark:!bg-indigo-800 !border-l-4 !border-indigo-600 dark:!border-indigo-400',
  '!bg-violet-200 dark:!bg-violet-800 !border-l-4 !border-violet-600 dark:!border-violet-400',
  '!bg-purple-200 dark:!bg-purple-800 !border-l-4 !border-purple-600 dark:!border-purple-400',
];

const TEXT_COLORS = [
  '!text-teal-700 dark:!text-teal-300',
  '!text-rose-700 dark:!text-rose-300',
  '!text-indigo-700 dark:!text-indigo-300',
  '!text-orange-700 dark:!text-orange-300',
  '!text-slate-700 dark:!text-slate-300',
];

function getSessionStyles(sessionId: string): string {
  let hash = 0;
  for (let i = 0; i < sessionId.length; i++) {
    hash = sessionId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const bgColor = SESSION_COLORS[Math.abs(hash) % SESSION_COLORS.length];
  const textColor = TEXT_COLORS[Math.abs(hash) % TEXT_COLORS.length];
  return `${bgColor} ${textColor}`;
}

interface DebugAnalyticsTableProps {
  entries: DebugAnalyticsEntry[];
  error: string | null;
  page: number;
  pageSize: number;
  total: number;
}

export function DebugAnalyticsTable({
  entries,
  error,
  page,
  pageSize,
  total,
}: DebugAnalyticsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [, startTransition] = useTransition();

  const pageCount = Math.ceil(total / pageSize);

  const handlePaginationChange = (
    updater: PaginationState | ((old: PaginationState) => PaginationState)
  ) => {
    const newPagination =
      typeof updater === 'function' ? updater({ pageIndex: page - 1, pageSize }) : updater;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPagination.pageIndex + 1));

    startTransition(() => {
      router.replace(`/admin/debug-analytics?${params.toString()}`, { scroll: false });
    });
  };

  const columns = useMemo<ColumnDef<DebugAnalyticsEntry>[]>(
    () => [
      {
        accessorKey: 'domain',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Domain"
            sorting={sorting}
            onSortingChange={setSorting}
          />
        ),
        cell: ({ row }) => <span className="text-xs font-medium">{row.original.domain}</span>,
      },
      {
        accessorKey: 'timestamp',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Time"
            sorting={sorting}
            onSortingChange={setSorting}
          />
        ),
        cell: ({ row }) => <span className="text-xs">{formatDate(row.original.timestamp)}</span>,
      },
      {
        accessorKey: 'sessionId',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Session"
            sorting={sorting}
            onSortingChange={setSorting}
          />
        ),
        cell: ({ row }) => (
          <span className="text-xs font-mono">{row.original.sessionId.slice(0, 8)}...</span>
        ),
      },
      {
        accessorKey: 'page',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Page"
            sorting={sorting}
            onSortingChange={setSorting}
          />
        ),
        cell: ({ row }) => (
          <span className="text-xs max-w-xs truncate block">{row.original.page}</span>
        ),
      },
      {
        accessorKey: 'country',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Country"
            sorting={sorting}
            onSortingChange={setSorting}
          />
        ),
        cell: ({ row }) => <span className="text-xs">{row.original.country || 'Unknown'}</span>,
      },
      {
        accessorKey: 'city',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="City"
            sorting={sorting}
            onSortingChange={setSorting}
          />
        ),
        cell: ({ row }) => <span className="text-xs">{row.original.city || 'Unknown'}</span>,
      },
      {
        accessorKey: 'device',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Device"
            sorting={sorting}
            onSortingChange={setSorting}
          />
        ),
        cell: ({ row }) => <span className="text-xs">{row.original.device || 'Unknown'}</span>,
      },
      {
        accessorKey: 'browser',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Browser"
            sorting={sorting}
            onSortingChange={setSorting}
          />
        ),
        cell: ({ row }) => <span className="text-xs">{row.original.browser || 'Unknown'}</span>,
      },
      {
        accessorKey: 'os',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="OS"
            sorting={sorting}
            onSortingChange={setSorting}
          />
        ),
        cell: ({ row }) => <span className="text-xs">{row.original.os || 'Unknown'}</span>,
      },
      {
        accessorKey: 'isBot',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Bot"
            sorting={sorting}
            onSortingChange={setSorting}
          />
        ),
        cell: ({ row }) => <span className="text-xs">{row.original.isBot ? 'Yes' : 'No'}</span>,
      },
    ],
    [sorting]
  );

  if (error) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={entries}
      pageCount={pageCount}
      pageIndex={page - 1}
      pageSize={pageSize}
      total={total}
      onPaginationChange={handlePaginationChange}
      emptyMessage="No analytics entries found"
      sorting={sorting}
      onSortingChange={setSorting}
      rowClassName={(row) => getSessionStyles(row.sessionId)}
    />
  );
}
