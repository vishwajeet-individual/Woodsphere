'use server';

import { auth, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { redirect } from 'next/navigation';

const StoreSchema = z.object({
  name: z.string().min(3, "Store name must be at least 3 chars"),
  slug: z.string().min(3, "Slug must be unique (e.g. urban-living)"),
  description: z.string().min(10),
});

export async function registerStoreAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "You must be logged in" };

  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
  };

  const validated = StoreSchema.safeParse(rawData);
  if (!validated.success) return { error: validated.error.issues[0].message };

  const { name, slug, description } = validated.data;

  try {
    // 1. Check if slug exists
    const existing = await prisma.store.findUnique({ where: { slug } });
    if (existing) return { error: "Store URL already taken. Try another." };

    // 2. Transaction: Create Store & Update User Role
    await prisma.$transaction([
      prisma.store.create({
        data: {
          name,
          slug,
          description,
          userId: session.user.id,
          status: 'ACTIVE', // Auto-approve for demo (In real life: PENDING)
        }
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: { role: 'SELLER' }
      })
    ]);

  } catch (e) {
    console.error(e);
    return { error: "Failed to create store." };
  }

  // 3. Force Sign Out to refresh session token (Crucial step for Role update)
  // The user must re-login to see the Vendor Dashboard
  await signOut({ redirectTo: '/login' });
}