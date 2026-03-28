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

interface DeleteDomainModalProps {
  open: boolean;
  loading: boolean;
  domainName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteDomainModal({
  open,
  loading,
  domainName,
  onOpenChange,
  onConfirm,
}: DeleteDomainModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Domain?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{domainName}&quot;? This will also delete all
            analytics data associated with this domain. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Yes, delete domain'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
