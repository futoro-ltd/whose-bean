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

interface DeleteAllDomainsModalProps {
  open: boolean;
  loading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteAllDomainsModal({
  open,
  loading,
  onOpenChange,
  onConfirm,
}: DeleteAllDomainsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete All Domains?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete all domains? This will also delete all analytics data
            associated with these domains. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Yes, delete all domains'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
