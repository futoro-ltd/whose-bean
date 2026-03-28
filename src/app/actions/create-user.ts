'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { z } from 'zod';
import type { CreateUserResult } from '@/types/auth-types';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  isAdmin: z.boolean().default(false),
});

export async function createUserAction(
  data: z.infer<typeof createUserSchema>
): Promise<CreateUserResult> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    const parsed = createUserSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: 'Invalid input' };
    }

    const { email, password, isAdmin } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: isAdmin ? 'admin' : 'user',
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Create user error:', error);
    return { success: false, error: 'Failed to create user' };
  }
}
