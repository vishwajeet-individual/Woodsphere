'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { OrderStatus } from '@prisma/client'; // Import Enum

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  const session = await auth();
  
  // Strict Admin Check
  // @ts-ignore
  if (session?.user?.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    });
    
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (e) {
    return { error: "Failed to update status" };
  }
}