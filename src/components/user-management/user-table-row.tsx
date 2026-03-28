'use client';

import { Shield, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { DeleteButton } from './delete-button';

interface UserTableRowProps {
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: Date | string;
  };
  adminCount: number;
  onPromoteToAdmin: (userId: string) => void;
  onDeleteClick: (userId: string, userEmail: string) => void;
}

export function UserTableRow({
  user,
  adminCount,
  onPromoteToAdmin,
  onDeleteClick,
}: UserTableRowProps) {
  return (
    <TableRow>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
          {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
          {user.role}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-zinc-500 dark:text-zinc-400">
        {new Date(user.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          {user.role !== 'admin' && (
            <Button variant="outline" className="gap-1" onClick={() => onPromoteToAdmin(user.id)}>
              <UserCheck />
              <span className="md:flex hidden">Make Admin</span>
            </Button>
          )}
          <DeleteButton
            permissionMessages={{
              allowedMessage: 'Delete user',
              disallowedMessage: 'Cannot delete the last admin',
            }}
            disabled={user.role === 'admin' && adminCount <= 1}
            onDelete={() => onDeleteClick(user.id, user.email)}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
