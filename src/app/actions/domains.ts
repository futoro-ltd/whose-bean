'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';
import { sanitizeDomain, isValidDomain } from '@/lib/sanitize';
import type {
  DomainWithCount,
  GetDomainsResult,
  CreateDomainResult,
  GetDomainResult,
  DeleteDomainResult,
  ToggleDomainVisibilityResult,
} from '@/types/domain-types';

const createDomainSchema = z.object({
  domain: z.string().min(1).max(253).refine(isValidDomain, {
    message: 'Invalid domain format',
  }),
});

export async function getDomains(): Promise<GetDomainsResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const domains = await prisma.domain.findMany({
      where:
        user.role === 'admin'
          ? {}
          : {
              allowedUsers: { some: { id: user.id } },
            },
      orderBy: { domain: 'asc' },
      select: {
        id: true,
        domain: true,
        createdAt: true,
        userId: true,
        isPublic: true,
        user: {
          select: { email: true },
        },
        allowedUsers: {
          select: { id: true, email: true },
        },
        _count: {
          select: { analyticsEntries: { where: { isBot: false } } },
        },
      },
    });

    return { success: true, domains };
  } catch (error) {
    console.error('Error fetching domains:', error);
    return { success: false, error: 'Failed to fetch domains' };
  }
}

export async function createDomain(
  data: z.infer<typeof createDomainSchema>
): Promise<CreateDomainResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Forbidden - Admin access required' };
    }

    const parsed = createDomainSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: 'Invalid input' };
    }

    const { domain } = parsed.data;
    const sanitizedDomain = sanitizeDomain(domain);

    if (!sanitizedDomain || !isValidDomain(sanitizedDomain)) {
      return { success: false, error: 'Invalid domain format' };
    }

    const existingDomain = await prisma.domain.findUnique({
      where: { domain: sanitizedDomain },
    });

    if (existingDomain) {
      return { success: false, error: 'Domain already registered' };
    }

    const newDomain = await prisma.domain.create({
      data: {
        domain: sanitizedDomain,
        userId: user.id,
      },
    });

    return { success: true, domain: newDomain };
  } catch (error) {
    console.error('Error creating domain:', error);
    return { success: false, error: 'Failed to create domain' };
  }
}

export async function getDomain(id: string): Promise<GetDomainResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const domain = await prisma.domain.findUnique({
      where: { id },
      select: {
        id: true,
        domain: true,
        createdAt: true,
        userId: true,
        isPublic: true,
        user: {
          select: { email: true },
        },
        allowedUsers: {
          select: { id: true, email: true },
        },
        _count: {
          select: { analyticsEntries: { where: { isBot: false } } },
        },
      },
    });

    if (!domain) {
      return { success: false, error: 'Domain not found' };
    }

    const hasAccess = user.role === 'admin' || domain.allowedUsers.some((u) => u.id === user.id);
    if (!hasAccess) {
      return { success: false, error: 'Forbidden' };
    }

    return { success: true, domain: domain as DomainWithCount };
  } catch (error) {
    console.error('Error fetching domain:', error);
    return { success: false, error: 'Failed to fetch domain' };
  }
}

export async function deleteDomain(id: string): Promise<DeleteDomainResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Forbidden - Admin access required' };
    }

    const domain = await prisma.domain.findUnique({
      where: { id },
    });

    if (!domain) {
      return { success: false, error: 'Domain not found' };
    }

    await prisma.domain.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting domain:', error);
    return { success: false, error: 'Failed to delete domain' };
  }
}

export async function toggleDomainVisibility(id: string): Promise<ToggleDomainVisibilityResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Forbidden - Admin access required' };
    }

    const domain = await prisma.domain.findUnique({
      where: { id },
      select: { id: true, isPublic: true },
    });

    if (!domain) {
      return { success: false, error: 'Domain not found' };
    }

    const updatedDomain = await prisma.domain.update({
      where: { id },
      data: { isPublic: !domain.isPublic },
      select: { isPublic: true },
    });

    return { success: true, isPublic: updatedDomain.isPublic };
  } catch (error) {
    console.error('Error toggling domain visibility:', error);
    return { success: false, error: 'Failed to toggle domain visibility' };
  }
}

export async function getDomainName(id: string): Promise<string | null> {
  try {
    const domain = await prisma.domain.findUnique({
      where: { id },
      select: { domain: true },
    });
    return domain?.domain || null;
  } catch (error) {
    console.error('Error fetching domain name:', error);
    return null;
  }
}
