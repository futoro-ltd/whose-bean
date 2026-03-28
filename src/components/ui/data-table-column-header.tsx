import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { Column, SortingState, OnChangeFn } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  defaultSorted?: boolean;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  defaultSortColumn?: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  defaultSorted,
  sorting = [],
  onSortingChange,
  defaultSortColumn,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const sorted = column.getIsSorted();

  const handleClick = () => {
    if (!onSortingChange || !defaultSortColumn) {
      if (sorted === 'asc') {
        column.toggleSorting(true);
      } else if (sorted === 'desc') {
        column.clearSorting();
      } else {
        column.toggleSorting(false);
      }
      return;
    }

    const columnId = column.id;
    const isInSort = sorting.some((s) => s.id === columnId);
    const currentSort = sorting.find((s) => s.id === columnId);

    if (isInSort) {
      if (currentSort?.desc === false) {
        onSortingChange(sorting.map((s) => (s.id === columnId ? { id: columnId, desc: true } : s)));
      } else {
        const newSort = sorting.filter((s) => s.id !== columnId);
        if (!newSort.some((s) => s.id !== defaultSortColumn)) {
          onSortingChange([]);
        } else {
          onSortingChange(newSort);
        }
      }
    } else {
      const newSort = [{ id: columnId, desc: false }];
      if (!sorting.some((s) => s.id === defaultSortColumn)) {
        newSort.push({ id: defaultSortColumn, desc: true });
      }
      onSortingChange([...newSort, ...sorting]);
    }
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={handleClick}
      >
        <span>{title}</span>
        {sorted === 'asc' ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : sorted === 'desc' ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : defaultSorted ? (
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        ) : (
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        )}
      </Button>
    </div>
  );
}
