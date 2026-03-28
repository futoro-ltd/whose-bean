'use client';

import * as React from 'react';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import { ChevronDown, CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownButtonProps {
  label: string;
  icon: React.ElementType;
  options: FilterOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  className?: string;
}

export function FilterDropdownButton({
  label,
  icon: Icon,
  options,
  selectedValues,
  onSelectionChange,
  className,
}: FilterDropdownButtonProps) {
  const realOptions = options.filter((opt) => opt.value !== 'All');
  const realSelectedValues = selectedValues.filter((v) => v !== 'All');
  const allSelected = realSelectedValues.length === realOptions.length;
  const displayText = allSelected
    ? label
    : `${label} (${realSelectedValues.length}/${realOptions.length})`;

  const handleCheckedChange = (value: string, checked: boolean) => {
    if (value === 'All') {
      if (checked) {
        onSelectionChange(options.map((opt) => opt.value));
      } else {
        onSelectionChange([]);
      }
    } else if (checked) {
      const newValues = [...realSelectedValues, value];
      if (newValues.length === realOptions.length) {
        onSelectionChange(options.map((opt) => opt.value));
      } else {
        onSelectionChange(newValues);
      }
    } else {
      const newValues = realSelectedValues.filter((v) => v !== value);
      if (selectedValues.includes('All')) {
        onSelectionChange(newValues);
      } else {
        onSelectionChange(newValues);
      }
    }
  };

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <Button
          variant="outline"
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md',
            'bg-muted hover:bg-muted/50 border-0 transition-colors',
            className
          )}
        >
          <Icon className="w-4 h-4" />
          <span className="md:flex hidden">{displayText}</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-50" />
        </Button>
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          className={cn(
            'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
          )}
          align="start"
          sideOffset={4}
        >
          {options.map((option) => {
            const isChecked =
              option.value === 'All' ? allSelected : realSelectedValues.includes(option.value);
            return (
              <DropdownMenuPrimitive.CheckboxItem
                key={option.value}
                className={cn(
                  'relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors',
                  'focus:bg-accent focus:text-accent-foreground',
                  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                )}
                checked={isChecked}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={(checked) => handleCheckedChange(option.value, checked)}
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  {isChecked && <CheckIcon className="h-3 w-3" />}
                </span>
                {option.label}
              </DropdownMenuPrimitive.CheckboxItem>
            );
          })}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
