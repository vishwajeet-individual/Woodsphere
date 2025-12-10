'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { OrderStatus } from '@prisma/client';

export async function updateOrderStatus(subOrderId: string, newStatus: OrderStatus) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: "Unauthorized" };

  try {
    // 1. Verify Vendor Owns this SubOrder
    const subOrder = await prisma.subOrder.findUnique({
      where: { id: subOrderId },
      include: { store: true }
    });

    if (!subOrder || subOrder.store.userId !== userId) {
      return { error: "You can only manage your own orders" };
    }

    // 2. Update SubOrder Status
    await prisma.subOrder.update({
      where: { id: subOrderId },
      data: { status: newStatus }
    });
    
    // Optional: Logic to update Master Order status if all sub-orders are shipped
    
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (e) {
    return { error: "Failed to update status" };
  }
}