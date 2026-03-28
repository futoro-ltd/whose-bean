'use server';

import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';
import type { VerifyTokenResult, VerifyResult } from '@/types/auth-types';

const verifySchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

export async function verifyToken(token: string): Promise<VerifyTokenResult> {
  try {
    if (!token) {
      return { valid: false, error: 'Token is required' };
    }

    const invitation = await prisma.invitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      return { valid: false, error: 'Invalid invitation token' };
    }

    if (invitation.expiresAt < new Date()) {
      await prisma.invitation.delete({ where: { token } });
      return { valid: false, error: 'Invitation has expired' };
    }

    return { valid: true, email: invitation.email, role: invitation.role };
  } catch (error) {
    console.error('Verify token error:', error);
    return { valid: false, error: 'Failed to verify token' };
  }
}

export async function verifyUser(data: z.infer<typeof verifySchema>): Promise<VerifyResult> {
  try {
    const parsed = verifySchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: 'Invalid input' };
    }

    const { token, password } = parsed.data;

    const invitation = await prisma.invitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      return { success: false, error: 'Invalid invitation token' };
    }

    if (invitation.expiresAt < new Date()) {
      await prisma.invitation.delete({ where: { token } });
      return { success: false, error: 'Invitation has expired' };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: invitation.email },
    });

    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        email: invitation.email,
        password: hashedPassword,
        role: invitation.role,
      },
    });

    await prisma.invitation.delete({ where: { token } });

    return { success: true, message: 'Account created successfully' };
  } catch (error) {
    console.error('Verify error:', error);
    return { success: false, error: 'Failed to create account' };
  }
}
