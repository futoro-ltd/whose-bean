'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StandardCard } from '@/components/standard-card';
import { DeleteUserModal } from './delete-user-modal';
import { useAdminQuery } from '@/hooks/use-admin-query';
import { useAlerts } from '@/hooks/use-alerts';
import { UserTableRow } from './user-table-row';
import { MutedSubheader } from '../muted-subheader';

export function UserManagementTable() {
  const { users, adminCount, isLoading, deleteUser, isDeleting, promoteToAdmin } = useAdminQuery();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showLoading = mounted ? isLoading : true;

  const { setSuccess, setError } = useAlerts();

  const [pendingDelete, setPendingDelete] = useState<{ userId: string; userEmail: string } | null>(
    null
  );

  const handleDeleteClick = (userId: string, userEmail: string) => {
    setPendingDelete({ userId, userEmail });
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      await deleteUser(pendingDelete.userId);
      setSuccess(`User ${pendingDelete.userEmail} deleted successfully`);
      setPendingDelete(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete user');
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    try {
      await promoteToAdmin(userId);
      setSuccess('User promoted to admin successfully');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to promote user');
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setPendingDelete(null);
    }
  };

  return (
    <>
      <StandardCard title="User Management" description="Manage existing users and their roles">
        {showLoading ? (
          <div className="text-center py-8 text-zinc-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">No users found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <MutedSubheader label="Email" />
                </TableHead>
                <TableHead>
                  <MutedSubheader label="Role" />
                </TableHead>
                <TableHead>
                  <MutedSubheader label="Created" />
                </TableHead>
                <TableHead className="text-right">
                  <MutedSubheader label="Actions" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  adminCount={adminCount}
                  onPromoteToAdmin={handlePromoteToAdmin}
                  onDeleteClick={handleDeleteClick}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </StandardCard>

      <DeleteUserModal
        open={pendingDelete !== null}
        loading={isDeleting}
        userEmail={pendingDelete?.userEmail || ''}
        onOpenChange={handleOpenChange}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
