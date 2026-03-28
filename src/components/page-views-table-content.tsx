'use client';

import { useAnalyticsEntries, PageViewEntry } from '@/hooks/use-analytics-entries';
import { useTablePagination } from '@/hooks/use-table-pagination';
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ColumnDef } from '@tanstack/react-table';
import { formatDate, formatLocation } from '@/lib/format-utils';
import { TableLoadingSpinner } from '@/components/table-loading-spinner';
import { MutedSubheader } from './muted-subheader';

interface PageViewsTableContentProps {
  domainId: string;
}

export function PageViewsTableContent({ domainId }: PageViewsTableContentProps) {
  const { pagination, setPagination, sorting, handleSortingChange } = useTablePagination(
    10,
    'timestamp'
  );

  const sortBy = sorting[0]?.id || 'timestamp';
  const sortOrder = sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : 'desc';

  const { data, loading } = useAnalyticsEntries(
    domainId,
    'pageviews',
    pagination.pageIndex + 1,
    pagination.pageSize,
    sortBy,
    sortOrder
  );

  const entries = (data?.entries as PageViewEntry[]) || [];

  const columns: ColumnDef<PageViewEntry>[] = [
    {
      accessorKey: 'timestamp',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Time"
          defaultSorted
          sorting={sorting}
          onSortingChange={handleSortingChange}
          defaultSortColumn="timestamp"
        />
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-xs">{formatDate(row.original.timestamp)}</span>
      ),
    },
    {
      accessorKey: 'country',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Location"
          sorting={sorting}
          onSortingChange={handleSortingChange}
          defaultSortColumn="timestamp"
        />
      ),
      cell: ({ row }) => formatLocation(row.original.country),
    },
    {
      accessorKey: 'page',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Page"
          sorting={sorting}
          onSortingChange={handleSortingChange}
          defaultSortColumn="timestamp"
        />
      ),
      cell: ({ row }) => (
        <span className="font-medium max-w-xs truncate block" title={row.original.page}>
          {row.original.page}
        </span>
      ),
    },
    {
      accessorKey: 'browser',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Browser"
          sorting={sorting}
          onSortingChange={handleSortingChange}
          defaultSortColumn="timestamp"
        />
      ),
      cell: ({ row }) => row.original.browser || 'Unknown',
    },
    {
      accessorKey: 'device',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Device"
          sorting={sorting}
          onSortingChange={handleSortingChange}
          defaultSortColumn="timestamp"
        />
      ),
      cell: ({ row }) => row.original.device || 'Unknown',
    },
    {
      accessorKey: 'os',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="OS"
          sorting={sorting}
          onSortingChange={handleSortingChange}
          defaultSortColumn="timestamp"
        />
      ),
      cell: ({ row }) => row.original.os || 'Unknown',
    },
  ];

  if (loading) {
    return <TableLoadingSpinner />;
  }

  return (
    <div className="flex flex-col space-y-4">
      <MutedSubheader label="Individual page views statistics" />
      <DataTable
        columns={columns}
        data={entries}
        pageCount={data?.totalPages ?? 0}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        total={data?.total ?? 0}
        onPaginationChange={setPagination}
        emptyMessage="No page views found for this period"
        sorting={sorting}
        onSortingChange={handleSortingChange}
      />
    </div>
  );
}
