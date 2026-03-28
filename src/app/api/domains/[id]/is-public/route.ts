import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const domain = await prisma.domain.findUnique({
    where: { id },
    select: { id: true, isPublic: true },
  });

  if (!domain) {
    return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
  }

  return NextResponse.json({ isPublic: domain.isPublic });
}
