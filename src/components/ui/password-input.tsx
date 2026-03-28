'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrength?: boolean;
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 3) return { score, label: 'Medium', color: 'bg-orange-500' };
  if (score <= 4) return { score, label: 'Strong', color: 'bg-yellow-500' };
  return { score, label: 'Very Strong', color: 'bg-green-500' };
}

export function PasswordInput({
  className,
  showStrength = false,
  value,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState('');

  const passwordValue = value !== undefined ? String(value) : internalValue;
  const strength = showStrength ? getPasswordStrength(passwordValue) : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    props.onChange?.(e);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={cn('pr-10', className)}
          value={value}
          onChange={handleChange}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {showStrength && strength && (
        <div className="space-y-1.5 mt-3">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={cn(
                  'h-2 flex-1 rounded-full transition-colors',
                  strength.score >= level ? strength.color : 'bg-muted'
                )}
              />
            ))}
          </div>
          <p
            className={cn(
              'text-xs font-medium',
              passwordValue.length === 0
                ? 'text-muted-foreground'
                : strength.color.replace('bg-', 'text-')
            )}
          >
            {passwordValue.length === 0 ? 'Password strength' : strength.label}
          </p>
        </div>
      )}
    </div>
  );
}
