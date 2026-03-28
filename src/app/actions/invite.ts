'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';
import { z } from 'zod';
import type { InviteResult } from '@/types/auth-types';

const inviteSchema = z.object({
  email: z.string().email(),
  isAdmin: z.boolean().default(false),
});

export async function inviteUser(data: z.infer<typeof inviteSchema>): Promise<InviteResult> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    const parsed = inviteSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: 'Invalid input' };
    }

    const { email, isAdmin } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    const existingInvitation = await prisma.invitation.findUnique({
      where: { email },
    });

    if (existingInvitation) {
      await prisma.invitation.delete({ where: { email } });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.invitation.create({
      data: {
        email,
        role: isAdmin ? 'admin' : 'user',
        token,
        expiresAt,
      },
    });

    const emailSent = await sendVerificationEmail(email, token, isAdmin, currentUser.email);

    if (!emailSent) {
      await prisma.invitation.delete({ where: { email } }).catch(() => {});
      return {
        success: false,
        error: 'Failed to send invitation email. Please check SMTP configuration.',
      };
    }

    return { success: true, message: 'Invitation sent successfully (previous link invalidated)' };
  } catch (error) {
    console.error('Invite error:', error);
    return { success: false, error: 'Failed to send invitation' };
  }
}
