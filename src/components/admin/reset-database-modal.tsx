'use client';

import { AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ResetDatabaseModalProps {
  open: boolean;
  phrase: string;
  currentPhrase: string;
  loading: boolean;
  error: string;
  onOpenChange: (open: boolean) => void;
  onPhraseChange: (phrase: string) => void;
  onConfirm: () => void;
}

export function ResetDatabaseModal({
  open,
  phrase,
  currentPhrase,
  loading,
  error,
  onOpenChange,
  onPhraseChange,
  onConfirm,
}: ResetDatabaseModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-600 dark:text-red-400">Reset Database</DialogTitle>
          <div className="text-sm text-muted-foreground">
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <div className="text-sm text-red-700 dark:text-red-300 font-medium mb-2">
                Warning: This will permanently delete ALL data including:
              </div>
              <ul className="text-sm text-red-600 dark:text-red-400 list-disc list-inside">
                <li>All users (including admin accounts)</li>
                <li>All domains and analytics</li>
                <li>All pending invitations</li>
              </ul>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 mb-2">
              To confirm, type{' '}
              <code className="bg-zinc-100 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-sm font-mono">
                {currentPhrase}
              </code>{' '}
              below:
            </p>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            value={phrase}
            onChange={(e) => onPhraseChange(e.target.value)}
            placeholder="Type the phrase to confirm"
          />
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={phrase !== currentPhrase || loading}
          >
            {loading ? 'Resetting...' : 'Reset Database'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
