'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser, verifyPassword, hashPassword } from '@/lib/auth';
import { z } from 'zod';
import type { ChangePasswordResult } from '@/types/auth-types';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export async function changePassword(
  data: z.infer<typeof changePasswordSchema>
): Promise<ChangePasswordResult> {
  try {
    const parsed = changePasswordSchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message).join(', ');
      return { success: false, error: errors };
    }

    const { currentPassword, newPassword } = parsed.data;

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'You must be logged in to change your password' };
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: { password: true },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const isValid = await verifyPassword(currentPassword, user.password);
    if (!isValid) {
      return { success: false, error: 'Current password is incorrect' };
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { password: hashedPassword },
    });

    return { success: true, message: 'Password changed successfully' };
  } catch (error) {
    console.error('Change password error:', error);
    return { success: false, error: 'Failed to change password' };
  }
}
