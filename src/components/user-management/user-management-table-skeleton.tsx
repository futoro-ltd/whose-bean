import { CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StandardCard } from '@/components/standard-card';

export function UserManagementTableSkeleton() {
  return (
    <StandardCard title="User Management" description="Manage existing users and their roles">
      <CardContent className="pt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(2)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-48 animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-16 animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-20 animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-24 animate-pulse" />
                    <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </StandardCard>
  );
}
