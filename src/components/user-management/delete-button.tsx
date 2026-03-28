'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PermissionMessages {
  allowedMessage: string;
  disallowedMessage: string;
}

interface DeleteButtonProps {
  permissionMessages: PermissionMessages;
  disabled: boolean;
  onDelete: () => void;
}

export function DeleteButton({ permissionMessages, disabled, onDelete }: DeleteButtonProps) {
  return (
    <span
      title={disabled ? permissionMessages.disallowedMessage : permissionMessages.allowedMessage}
    >
      <Button
        variant="destructive"
        type="button"
        onClick={() => onDelete()}
        disabled={disabled}
        className="gap-1"
      >
        <Trash2 />
        <span className="md:flex hidden">Delete</span>
      </Button>
    </span>
  );
}
