'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- DEFAULTS ---
const DEFAULT_HERO = {
  heading: "Crafting the future of your home.",
  subHeading: "Discover a world where sustainable materials meet timeless design.",
  imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=2070",
  ctaText: "Shop Collection",
  ctaLink: "/search"
};

const DEFAULT_BANNER = {
  title: "End of Season Sale",
  subtitle: "Up to 50% OFF on premium living room sets",
  buttonText: "Shop the Sale",
  link: "/search?sale=true"
};

const DEFAULT_FOOTER = {
  social: { facebook: '', instagram: '', twitter: '', youtube: '' },
  columns: []
};

// --- GETTERS ---

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'config' } });
  return {
    hero: settings?.heroConfig || DEFAULT_HERO,
    banner: settings?.promoBannerConfig || DEFAULT_BANNER,
    footer: settings?.footerConfig || DEFAULT_FOOTER
  };
}

export async function getFooterSettings() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'config' } });
  // @ts-ignore
  return settings?.footerConfig || DEFAULT_FOOTER;
}

export async function getHeaderSettings() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'config' } });
  // @ts-ignore
  return settings?.headerConfig || {};
}

// --- SETTERS ---

export async function updateHomeSettings(heroData: any, bannerData: any) {
  const session = await auth();
  // @ts-ignore
  if (session?.user?.role !== 'SUPER_ADMIN') return { error: "Unauthorized" };

  try {
    await prisma.siteSettings.upsert({
      where: { id: 'config' },
      update: { heroConfig: heroData, promoBannerConfig: bannerData },
      create: { id: 'config', heroConfig: heroData, promoBannerConfig: bannerData }
    });
    revalidatePath('/'); 
    return { success: true };
  } catch (e: any) {
    console.error("Home Update Error:", e); // ⚠️ LOGGING ADDED
    return { error: e.message || "Failed to save homepage settings" };
  }
}

export async function updateFooterSettings(footerData: any) {
  const session = await auth();
  // @ts-ignore
  if (session?.user?.role !== 'SUPER_ADMIN') return { error: "Unauthorized" };

  try {
    await prisma.siteSettings.upsert({
      where: { id: 'config' },
      update: { footerConfig: footerData },
      create: { id: 'config', footerConfig: footerData }
    });
    revalidatePath('/'); 
    return { success: true };
  } catch (e: any) {
    console.error("Footer Update Error:", e); // ⚠️ LOGGING ADDED
    return { error: e.message || "Failed to save footer settings" };
  }
}

export async function updateHeaderSettings(headerData: any) {
  const session = await auth();
  // @ts-ignore
  if (session?.user?.role !== 'SUPER_ADMIN') return { error: "Unauthorized" };

  try {
    await prisma.siteSettings.upsert({
      where: { id: 'config' },
      update: { headerConfig: headerData },
      create: { id: 'config', headerConfig: headerData }
    });
    revalidatePath('/', 'layout'); 
    return { success: true };
  } catch (e: any) {
    console.error("Header Update Error:", e); // ⚠️ LOGGING ADDED
    return { error: e.message || "Failed to save header settings" };
  }
}