import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, getCurrentUser } from './lib/auth';
import { prisma } from './lib/db';

const protectedPaths = ['/dashboard', '/admin', '/settings'];
const authPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/verify'];

async function isPublicDomain(pathname: string): Promise<boolean> {
  const match = pathname.match(/^\/dashboard\/([a-zA-Z0-9_-]+)$/);
  if (!match) return false;

  try {
    const domain = await prisma.domain.findUnique({
      where: { id: match[1] },
      select: { isPublic: true },
    });
    return domain?.isPublic ?? false;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard/') && pathname !== '/dashboard') {
    const publicDomain = await isPublicDomain(pathname);
    if (publicDomain) {
      return NextResponse.next();
    }
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    if (protectedPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.set('token', '', { maxAge: 0 });
    return response;
  }

  const user = await getCurrentUser();

  if (!user) {
    const response = NextResponse.redirect(new URL('/login?reason=deleted', request.url));
    response.cookies.set('token', '', { maxAge: 0 });
    return response;
  }

  if (pathname.startsWith('/admin') && user.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (authPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register', '/settings'],
};
