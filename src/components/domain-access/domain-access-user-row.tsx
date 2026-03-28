'use client';

import { X, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';

interface DomainAccessUserRowProps {
  user: {
    id: string;
    email: string;
    role: string;
  };
  revoking: string | null;
  onRevokeAccess: (userId: string) => void;
}

export function DomainAccessUserRow({ user, revoking, onRevokeAccess }: DomainAccessUserRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{user.email}</TableCell>
      <TableCell>
        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRevokeAccess(user.id)}
          disabled={revoking === user.id}
        >
          {revoking === user.id ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <X className="w-4 h-4" />
          )}
          <span className="ml-1">Revoke</span>
        </Button>
      </TableCell>
    </TableRow>
  );
}
