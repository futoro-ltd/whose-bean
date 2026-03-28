'use server';

import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';
import { z } from 'zod';
import { cookies } from 'next/headers';
import type {
  RequestResetResult,
  ValidateResetTokenResult,
  ResetPasswordResult,
} from '@/types/auth-types';

const requestResetSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

export async function requestPasswordReset(
  data: z.infer<typeof requestResetSchema>
): Promise<RequestResetResult> {
  try {
    const parsed = requestResetSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: 'Invalid email address' };
    }

    const { email } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      };
    }

    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { email },
    });

    if (existingToken) {
      await prisma.passwordResetToken.delete({
        where: { email },
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    const emailSent = await sendPasswordResetEmail(email, token);

    if (!emailSent) {
      await prisma.passwordResetToken.delete({ where: { email } }).catch(() => {});
      return {
        success: false,
        error: 'Failed to send password reset email. Please try again later.',
      };
    }

    return {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
  } catch (error) {
    console.error('Password reset request error:', error);
    console.error('Error details:', error instanceof Error ? error.message : error);
    return { success: false, error: 'Failed to process password reset request' };
  }
}

export async function validateResetToken(token: string): Promise<ValidateResetTokenResult> {
  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return { valid: false, error: 'Invalid or expired reset link' };
    }

    if (new Date() > resetToken.expiresAt) {
      await prisma.passwordResetToken.delete({ where: { token } });
      return { valid: false, error: 'This reset link has expired. Please request a new one.' };
    }

    return { valid: true, email: resetToken.email };
  } catch (error) {
    console.error('Token validation error:', error);
    return { valid: false, error: 'Failed to validate reset token' };
  }
}

export async function resetPassword(
  data: z.infer<typeof resetPasswordSchema>
): Promise<ResetPasswordResult> {
  try {
    const parsed = resetPasswordSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: 'Invalid input' };
    }

    const { token, password } = parsed.data;

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return { success: false, error: 'Invalid or expired reset link' };
    }

    if (new Date() > resetToken.expiresAt) {
      await prisma.passwordResetToken.delete({ where: { token } });
      return { success: false, error: 'This reset link has expired. Please request a new one.' };
    }

    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({ where: { token } });

    const cookieStore = await cookies();
    cookieStore.delete('token');

    return { success: true, message: 'Password has been reset successfully. You can now login.' };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: 'Failed to reset password' };
  }
}
