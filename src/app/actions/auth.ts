'use server';

import { prisma } from '@/lib/db';
import { hashPassword, generateToken, verifyPassword, getCurrentUser } from '@/lib/auth';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type {
  LoginResult,
  RegisterResult,
  CurrentUserResult,
  UsersExistResult,
} from '@/types/auth-types';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function loginUser(data: z.infer<typeof loginSchema>): Promise<LoginResult> {
  try {
    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: 'Invalid input' };
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return { success: false, error: 'Invalid credentials' };
    }

    const token = generateToken(user.id);
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && process.env.HTTPS === 'true',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return {
      success: true,
      user: { id: user.id, email: user.email },
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Failed to login' };
  }
}

export async function registerUser(data: z.infer<typeof registerSchema>): Promise<RegisterResult> {
  try {
    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: 'Invalid input' };
    }

    const { email, password } = parsed.data;

    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return {
        success: false,
        error:
          'Registration is no longer available. Please login or contact an admin to invite new users.',
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: userCount === 0 ? 'admin' : 'user',
      },
    });

    const token = generateToken(user.id);
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return {
      success: true,
      user: { id: user.id, email: user.email, role: user.role },
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Failed to register' };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  redirect('/login');
}

export async function getCurrentUserServer(): Promise<CurrentUserResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;
    return { id: user.id, email: user.email, role: user.role };
  } catch {
    return null;
  }
}

export async function checkUsersExist(): Promise<UsersExistResult> {
  try {
    const userCount = await prisma.user.count();
    return { hasUsers: userCount > 0 };
  } catch {
    return { hasUsers: false };
  }
}
