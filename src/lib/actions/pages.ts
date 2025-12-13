'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Fetch pages for the dropdowns
export async function getAllContentPages() {
  try {
    return await prisma.contentPage.findMany({ 
      select: { id: true, title: true, slug: true, category: true },
      orderBy: { title: 'asc' } 
    });
  } catch (e) {
    return [];
  }
}

// Full fetch for the editor
export async function getContentPageDetails(slug: string) {
    return await prisma.contentPage.findUnique({ where: { slug } });
}

export async function updateContentPage(slug: string, content: string, title: string, category: string) {
  const session = await auth();
  // @ts-ignore
  if (session?.user?.role !== 'SUPER_ADMIN') return { error: "Unauthorized" };

  try {
    await prisma.contentPage.update({
      where: { slug },
      data: { content, title, category }
    });
    revalidatePath('/', 'layout'); // Refresh entire site
    return { success: true };
  } catch (e) {
    return { error: "Failed to update page" };
  }
}

export async function createContentPage(data: { title: string; slug: string; category: string }) {
  const session = await auth();
  // @ts-ignore
  if (session?.user?.role !== 'SUPER_ADMIN') return { error: "Unauthorized" };

  if (!data.title || !data.slug) return { error: "Title and URL required" };

  try {
    const existing = await prisma.contentPage.findUnique({ where: { slug: data.slug } });
    if (existing) return { error: "URL already exists" };

    await prisma.contentPage.create({
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        content: "<h2>New Page</h2><p>Start writing...</p>"
      }
    });
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (e) {
    return { error: "Failed to create page" };
  }
}

export async function deleteContentPage(slug: string) {
  const session = await auth();
  // @ts-ignore
  if (session?.user?.role !== 'SUPER_ADMIN') return { error: "Unauthorized" };

  try {
    await prisma.contentPage.delete({ where: { slug } });
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (e) {
    return { error: "Failed to delete page" };
  }
}