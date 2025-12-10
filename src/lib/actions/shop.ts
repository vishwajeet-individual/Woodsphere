'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addReviewAction(productId: string, rating: number, comment: string) {
  const session = await auth();
  const userId = session?.user?.id;
  
  if (!userId) return { error: "Please login to review" };
  if (rating < 1 || rating > 5) return { error: "Invalid rating" };

  try {
    // 1. Check if User has already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

    if (existingReview) {
      return { error: "You have already reviewed this product." };
    }

    // 2. Check if User has actually purchased this product
    // We look for an OrderItem inside a SubOrder inside an Order belonging to this User
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId: productId,
        subOrder: {
          order: {
            userId: userId
          }
        }
      }
    });

    if (!hasPurchased) {
      return { error: "You can only review products you have purchased." };
    }

    // 3. Create Review
    await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment
      }
    });
    
    revalidatePath(`/product/${productId}`);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to submit review" };
  }
}