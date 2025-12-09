'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { Prisma } from '../../../generated/prisma'; // Import types from your custom output

// --- Schema ---
const AddressSchema = z.object({
  street: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  zip: z.string().min(6),
  country: z.string().default("India"),
});

// --- Actions ---

export async function addAddressAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const data = {
    street: formData.get('street') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    zip: formData.get('zip') as string,
  };

  const validated = AddressSchema.safeParse(data);
  if (!validated.success) return { error: "Invalid address data" };

  try {
    await prisma.address.create({
      data: {
        ...validated.data,
        userId: session.user.id,
      }
    });
    revalidatePath('/checkout');
    return { success: true };
  } catch (e) {
    return { error: "Failed to save address" };
  }
}

export async function placeOrderAction(addressId: string, cartItems: any[]) {
  const session = await auth();
  
  // 1. Capture User ID securely outside transaction to satisfy TypeScript
  const userId = session?.user?.id;
  if (!userId) return { error: "Not authenticated" };

  if (!addressId) return { error: "Please select an address" };
  if (cartItems.length === 0) return { error: "Cart is empty" };

  let total = 0;
  
  // 2. Define strict type for the items array
  type OrderItemInput = {
    productId: string;
    quantity: number;
    price: Prisma.Decimal;
  };
  
  const orderItemsData: OrderItemInput[] = [];

  // 3. Validate Stock & Calculate Price
  for (const item of cartItems) {
    const product = await prisma.product.findUnique({ where: { id: item.id } });
    if (!product) continue;
    
    if (product.stock < item.quantity) {
      return { error: `Not enough stock for ${product.name}` };
    }

    const itemTotal = Number(product.price) * item.quantity;
    total += itemTotal;

    orderItemsData.push({
      productId: product.id,
      quantity: item.quantity,
      price: product.price 
    });
  }

  // 4. Transaction
  try {
    const order = await prisma.$transaction(async (tx) => {
      // A. Create Order
      const newOrder = await tx.order.create({
        data: {
          userId: userId, // Use the captured variable
          total: new Prisma.Decimal(total),
          status: 'PENDING',
          shippingAddress: addressId,
          items: {
            create: orderItemsData // Types now match
          }
        }
      });

      // B. Decrement Stock
      for (const item of orderItemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      return newOrder;
    });

    return { orderId: order.id };
  } catch (e) {
    console.error(e);
    return { error: "Transaction failed" };
  }
}