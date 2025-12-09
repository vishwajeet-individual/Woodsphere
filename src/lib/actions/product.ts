'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { redirect } from 'next/navigation';

// Validation Schema
const ProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be longer"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  subCategoryId: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  isFeatured: z.boolean().optional(),
});

// Verify Admin Helper
async function checkAdmin() {
  const session = await auth();
  // @ts-ignore
  if (session?.user?.role !== 'ADMIN') {
    throw new Error("Unauthorized");
  }
}

export async function createProduct(formData: FormData) {
  await checkAdmin(); // Secure check

  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    subCategoryId: formData.get('subCategoryId'),
    imageUrl: formData.get('imageUrl'),
    isFeatured: formData.get('isFeatured') === 'on', // Checkbox returns 'on'
  };

  const validated = ProductSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: "Invalid data: " + validated.error.issues[0].message };
  }

  const { name, description, price, stock, subCategoryId, imageUrl, isFeatured } = validated.data;

  try {
    await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        subCategoryId,
        images: [imageUrl], // Storing single image for simplicity now
        isFeatured: isFeatured || false,
      }
    });
  } catch (e) {
    console.error(e);
    return { error: "Database error: Failed to create product." };
  }

  revalidatePath('/admin/products');
  redirect('/admin/products');
}

// ... existing imports and createProduct

export async function updateProduct(id: string, formData: FormData) {
  await checkAdmin();

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

  if (!validated.success) {
    return { error: "Invalid data" };
  }

  const { name, description, price, stock, subCategoryId, imageUrl, isFeatured } = validated.data;

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        stock,
        subCategoryId,
        images: [imageUrl], // Overwrite image array
        isFeatured: isFeatured || false,
      }
    });
  } catch (e) {
    return { error: "Failed to update product" };
  }

  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function deleteProduct(id: string) {
  try {
    await checkAdmin();
    
    // Check if product is in any order (optional safeguard)
    // For now, we allow deletion but cascading might fail if foreign keys exist
    // Best practice: Delete related cart items first
    await prisma.cartItem.deleteMany({ where: { productId: id } });
    
    await prisma.product.delete({ where: { id } });
    
    revalidatePath('/admin/products');
    return { success: true };
  } catch (e) {
    return { error: "Failed to delete product. It might be part of an existing order." };
  }
}