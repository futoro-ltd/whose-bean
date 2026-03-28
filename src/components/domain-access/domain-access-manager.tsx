'use client';

import { useState } from 'react';
import { UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { DomainAccessUserRow } from './domain-access-user-row';
import { useDomainAccess } from '@/hooks/use-domain-access';
import { MutedSubheader } from '../muted-subheader';

interface DomainAccessManagerProps {
  domainId: string;
}

export function DomainAccessManager({ domainId }: DomainAccessManagerProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const {
    users,
    allUsers,
    isLoadingUsers,
    isLoadingAllUsers,
    usersError,
    allUsersError,
    grantError,
    revokeError,
    grantAccess,
    revokeAccess,
    isGranting,
    revokingUserId,
  } = useDomainAccess(domainId);

  const handleGrantAccess = async () => {
    if (!selectedUserId) return;
    await grantAccess(selectedUserId);
    setSelectedUserId('');
  };

  const handleRevokeAccess = async (userId: string) => {
    await revokeAccess(userId);
  };

  // Filter out admin users and users who already have access
  const filteredUsers = allUsers.filter(
    (u) => u.role !== 'admin' && !users.some((hasAccess) => hasAccess.id === u.id)
  );

  return (
    <div className="flex flex-col space-y-4">
      <MutedSubheader label="Manage access to this domain analytics page" />
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
          <SelectTrigger
            className="w-full sm:w-[250px]"
            disabled={isLoadingAllUsers || !!allUsersError}
          >
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            {filteredUsers.length === 0 ? (
              <div className="px-2 py-4 text-center text-sm text-zinc-500">No users available</div>
            ) : (
              filteredUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.email}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {allUsersError && <div className="text-sm text-red-500">{allUsersError}</div>}
        <Button onClick={handleGrantAccess} disabled={!selectedUserId || isGranting}>
          {isGranting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4" />
          )}
          <span className="ml-2">Grant Access</span>
        </Button>
      </div>
      {(grantError || revokeError) && (
        <div className="text-sm text-red-500 mt-2">
          {grantError && <div>{grantError}</div>}
          {revokeError && <div>{revokeError}</div>}
        </div>
      )}

      {isLoadingUsers ? (
        <div className="text-center py-8 text-zinc-500">Loading users...</div>
      ) : usersError ? (
        <div className="text-center py-8 text-red-500">{usersError}</div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 text-zinc-500">No users have been granted access yet</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <DomainAccessUserRow
                key={user.id}
                user={user}
                revoking={revokingUserId}
                onRevokeAccess={handleRevokeAccess}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
