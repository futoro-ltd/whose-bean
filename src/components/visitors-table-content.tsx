'use client';

import { useAnalyticsEntries, VisitorEntry } from '@/hooks/use-analytics-entries';
import { useTablePagination } from '@/hooks/use-table-pagination';
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatLocation } from '@/lib/format-utils';
import { TableLoadingSpinner } from '@/components/table-loading-spinner';
import { MutedSubheader } from './muted-subheader';

interface VisitorsTableContentProps {
  domainId: string;
}

export function VisitorsTableContent({ domainId }: VisitorsTableContentProps) {
  const { pagination, setPagination, sorting, handleSortingChange } = useTablePagination(
    10,
    'pageCount'
  );

  const sortBy = sorting[0]?.id || 'pageCount';
  const sortOrder = sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : 'desc';

  const { data, loading } = useAnalyticsEntries(
    domainId,
    'visitors',
    pagination.pageIndex + 1,
    pagination.pageSize,
    sortBy,
    sortOrder
  );

  const entries = (data?.entries as VisitorEntry[]) || [];

  const columns: ColumnDef<VisitorEntry>[] = [
    {
      accessorKey: 'pageCount',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Pages"
          defaultSorted
          sorting={sorting}
          onSortingChange={handleSortingChange}
          defaultSortColumn="pageCount"
        />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-xs">
          {row.original.pageCount} {row.original.pageCount === 1 ? 'page' : 'pages'}
        </Badge>
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
          defaultSortColumn="pageCount"
        />
      ),
      cell: ({ row }) => formatLocation(row.original.country),
    },
    {
      accessorKey: 'firstSeen',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="First Seen"
          sorting={sorting}
          onSortingChange={handleSortingChange}
          defaultSortColumn="pageCount"
        />
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-xs">{formatDate(row.original.firstSeen)}</span>
      ),
    },
    {
      accessorKey: 'lastSeen',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Last Seen"
          sorting={sorting}
          onSortingChange={handleSortingChange}
          defaultSortColumn="pageCount"
        />
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-xs">{formatDate(row.original.lastSeen)}</span>
      ),
    },
    {
      accessorKey: 'device',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Device"
          sorting={sorting}
          onSortingChange={handleSortingChange}
          defaultSortColumn="pageCount"
        />
      ),
      cell: ({ row }) => row.original.device || 'Unknown',
    },
    {
      accessorKey: 'browser',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Browser"
          sorting={sorting}
          onSortingChange={handleSortingChange}
          defaultSortColumn="pageCount"
        />
      ),
      cell: ({ row }) => row.original.browser || 'Unknown',
    },
    {
      accessorKey: 'os',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="OS"
          sorting={sorting}
          onSortingChange={handleSortingChange}
          defaultSortColumn="pageCount"
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
      <MutedSubheader label="Individual visitor statistics" />
      <DataTable
        columns={columns}
        data={entries}
        pageCount={data?.totalPages ?? 0}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        total={data?.total ?? 0}
        onPaginationChange={setPagination}
        emptyMessage="No visitors found for this period"
        sorting={sorting}
        onSortingChange={handleSortingChange}
      />
    </div>
  );
}
