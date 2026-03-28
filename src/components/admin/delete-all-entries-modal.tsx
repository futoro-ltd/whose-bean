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

interface DeleteAllEntriesModalProps {
  open: boolean;
  loading: boolean;
  domainName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteAllEntriesModal({
  open,
  loading,
  domainName,
  onOpenChange,
  onConfirm,
}: DeleteAllEntriesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clear All Analytics for {domainName}?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete all analytics data for this domain? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? 'Clearing...' : 'Yes, clear all analytics'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
