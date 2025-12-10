'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Default Footer if DB is empty
const DEFAULT_FOOTER = {
  social: { facebook: '', instagram: '', twitter: '', youtube: '' },
  columns: [
    { title: 'Shop', links: [{ label: 'Living Room', url: '/search?category=living-room' }] },
    { title: 'Support', links: [{ label: 'Help', url: '/support' }] }
  ]
};

export async function getFooterSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'config' }
  });

  if (!settings?.footerConfig) return DEFAULT_FOOTER;
  return settings.footerConfig as typeof DEFAULT_FOOTER;
}

export async function updateFooterSettings(data: any) {
  const session = await auth();
  // @ts-ignore
  if (session?.user?.role !== 'SUPER_ADMIN') return { error: "Unauthorized" };

  try {
    await prisma.siteSettings.upsert({
      where: { id: 'config' },
      update: { footerConfig: data },
      create: { id: 'config', footerConfig: data }
    });

    revalidatePath('/'); // Refresh the whole site to show new footer
    return { success: true };
  } catch (e) {
    return { error: "Failed to save settings" };
  }
}