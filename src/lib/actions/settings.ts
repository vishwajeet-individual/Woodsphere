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
  const settings = await prisma.siteSettings.findFirst(); // Changed to findFirst to match your new logic
  return {
    heroConfig: settings?.heroConfig || DEFAULT_HERO,
    promoBannerConfig: settings?.promoBannerConfig || DEFAULT_BANNER,
    footerConfig: settings?.footerConfig || DEFAULT_FOOTER,
    // ⚠️ Added this so the Editor can actually READ the saved images
    categoryGridConfig: settings?.categoryGridConfig || {} 
  };
}

export async function getFooterSettings() {
  const settings = await prisma.siteSettings.findFirst();
  // @ts-ignore
  return settings?.footerConfig || DEFAULT_FOOTER;
}

export async function getHeaderSettings() {
  const settings = await prisma.siteSettings.findFirst();
  // @ts-ignore
  return settings?.headerConfig || {};
}

// --- SETTERS ---

// ⚠️ FIXED: Now accepts categoryImages as the 3rd argument
export async function updateHomeSettings(hero: any, banner: any, categoryImages: any) {
  const session = await auth();
  // @ts-ignore
  if (session?.user?.role !== 'SUPER_ADMIN') return { error: "Unauthorized" };

  try {
    const existing = await prisma.siteSettings.findFirst();
    
    // Construct data object
    const dataToSave = { 
        heroConfig: hero, 
        promoBannerConfig: banner,
        // ⚠️ Save the images map to the database
        categoryGridConfig: categoryImages 
    };

    if (existing) {
      await prisma.siteSettings.update({
        where: { id: existing.id },
        data: dataToSave
      });
    } else {
      await prisma.siteSettings.create({
        data: dataToSave
      });
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (e) {
    console.error("Save Error:", e);
    return { error: "Failed to save settings. Check server logs." };
  }
}

export async function updateFooterSettings(footerData: any) {
  const session = await auth();
  // @ts-ignore
  if (session?.user?.role !== 'SUPER_ADMIN') return { error: "Unauthorized" };

  try {
    // Helper logic to find the singleton row
    const existing = await prisma.siteSettings.findFirst();
    if (existing) {
        await prisma.siteSettings.update({
            where: { id: existing.id },
            data: { footerConfig: footerData }
        });
    } else {
        await prisma.siteSettings.create({
            data: { footerConfig: footerData }
        });
    }
    revalidatePath('/', 'layout'); 
    return { success: true };
  } catch (e: any) {
    console.error("Footer Update Error:", e);
    return { error: e.message || "Failed to save footer settings" };
  }
}

export async function updateHeaderSettings(headerData: any) {
  const session = await auth();
  // @ts-ignore
  if (session?.user?.role !== 'SUPER_ADMIN') return { error: "Unauthorized" };

  try {
    const existing = await prisma.siteSettings.findFirst();
    if (existing) {
        await prisma.siteSettings.update({
            where: { id: existing.id },
            data: { headerConfig: headerData }
        });
    } else {
        await prisma.siteSettings.create({
            data: { headerConfig: headerData }
        });
    }
    revalidatePath('/', 'layout'); 
    return { success: true };
  } catch (e: any) {
    console.error("Header Update Error:", e);
    return { error: e.message || "Failed to save header settings" };
  }
}