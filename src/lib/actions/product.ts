'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// --- Schema ---
const ProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be longer"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  subCategoryId: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  isFeatured: z.boolean().optional(),
});

// --- Helper: Get Current Vendor's Store ID ---
async function getVendorStore() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const store = await prisma.store.findUnique({
    where: { userId: session.user.id },
    select: { id: true }
  });

  if (!store) throw new Error("You do not have a store yet.");
  return store;
}

// --- ACTIONS ---

export async function createProduct(formData: FormData) {
  try {
    const store = await getVendorStore(); // 🔒 Security Check

    const rawData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: formData.get('price'),
      stock: formData.get('stock'),
      subCategoryId: formData.get('subCategoryId'),
      imageUrl: formData.get('imageUrl'),
      isFeatured: formData.get('isFeatured') === 'on',
    };

    const validated = ProductSchema.safeParse(rawData);
    if (!validated.success) return { error: validated.error.issues[0].message };

    const { name, description, price, stock, subCategoryId, imageUrl, isFeatured } = validated.data;

    await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        subCategoryId,
        images: [imageUrl],
        isFeatured: isFeatured || false,
        storeId: store.id, // ⚠️ LINK TO VENDOR STORE
      }
    });

  } catch (e: any) {
    return { error: e.message || "Failed to create product" };
  }

  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const store = await getVendorStore();

    // 🔒 Verify Ownership: Ensure this product belongs to this store
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing || existing.storeId !== store.id) {
      return { error: "You cannot edit products that are not yours." };
    }

    const rawData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: formData.get('price'),
      stock: formData.get('stock'),
      subCategoryId: formData.get('subCategoryId'),
      imageUrl: formData.get('imageUrl'),
      isFeatured: formData.get('isFeatured') === 'on',
    };

    const validated = ProductSchema.safeParse(rawData);
    if (!validated.success) return { error: validated.error.issues[0].message };

    const { name, description, price, stock, subCategoryId, imageUrl, isFeatured } = validated.data;

    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        stock,
        subCategoryId,
        images: [imageUrl],
        isFeatured: isFeatured || false,
      }
    });

  } catch (e: any) {
    return { error: e.message || "Failed to update product" };
  }

  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function deleteProduct(id: string) {
  try {
    const store = await getVendorStore();

    // 🔒 Verify Ownership
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing || existing.storeId !== store.id) {
      return { error: "Unauthorized deletion." };
    }

    // Optional: Check if product is in pending orders before deleting
    await prisma.cartItem.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });
    
    revalidatePath('/admin/products');
    return { success: true };
  } catch (e: any) {
    return { error: e.message || "Failed to delete product." };
  }
}