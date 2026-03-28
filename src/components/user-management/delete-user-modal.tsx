'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteUserModalProps {
  open: boolean;
  loading: boolean;
  userEmail: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteUserModal({
  open,
  loading,
  userEmail,
  onOpenChange,
  onConfirm,
}: DeleteUserModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the user <strong>{userEmail}</strong>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Yes, delete user'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
