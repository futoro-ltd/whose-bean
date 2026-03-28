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

export function DomainAccessOverviewSkeleton() {
  return (
    <StandardCard
      title="Domain Access"
      description="Overview of all domains and how many users have access"
    >
      <CardContent className="pt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Users with Access</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(2)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-32 animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-48 animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-20 animate-pulse" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-20 animate-pulse ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </StandardCard>
  );
}
