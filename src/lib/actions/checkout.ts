'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '../../../generated/prisma';
import crypto from 'crypto'; // Native Node.js crypto module

const COMMISSION_RATE = 0.10;

// ... (keep addAddressAction same as before) ...
export async function addAddressAction(formData: FormData) {
  // ... (keep existing code)
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const data = {
    street: formData.get('street') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    zip: formData.get('zip') as string,
  };

  if (!data.street || !data.city) return { error: "Invalid address" };

  try {
    await prisma.address.create({
      data: { ...data, userId: session.user.id }
    });
    return { success: true };
  } catch (e) {
    return { error: "Failed to save address" };
  }
}

// ⚠️ FIXED PLACE ORDER ACTION
export async function placeOrderAction(
  addressId: string, 
  cartItems: any[], 
  paymentDetails?: { razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string },
  buyerNote?: string,
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: "Not authenticated" };

  if (!addressId) return { error: "Please select an address" };
  if (cartItems.length === 0) return { error: "Cart is empty" };

  // 🔒 1. PAYMENT VERIFICATION LOGIC
  if (paymentDetails) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = paymentDetails;
    
    // Ensure Secret exists
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("❌ RAZORPAY_KEY_SECRET is missing in .env");
      return { error: "Server Configuration Error: Payment Secret Missing" };
    }

    const body = razorpayOrderId + "|" + razorpayPaymentId;
    
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      console.error("❌ Signature Mismatch!");
      console.error("Expected:", expectedSignature);
      console.error("Received:", razorpaySignature);
      return { error: "Payment verification failed. Please contact support." };
    }
  }

  // ... (Standard Split Logic) ...
  const storeGroups: Record<string, any> = {};
  let grandTotal = 0;

  for (const cartItem of cartItems) {
    const product = await prisma.product.findUnique({ 
      where: { id: cartItem.id },
      select: { id: true, price: true, stock: true, storeId: true, name: true } 
    });

    if (!product) continue;
    if (product.stock < cartItem.quantity) return { error: `Out of stock: ${product.name}` };

    const price = Number(product.price);
    const lineTotal = price * cartItem.quantity;
    const commission = lineTotal * COMMISSION_RATE;
    const sellerEarnings = lineTotal - commission;

    grandTotal += lineTotal;

    if (!storeGroups[product.storeId]) {
      storeGroups[product.storeId] = { storeId: product.storeId, total: 0, items: [] };
    }

    storeGroups[product.storeId].total += lineTotal;
    storeGroups[product.storeId].items.push({
      productId: product.id,
      quantity: cartItem.quantity,
      price: price,
      commission,
      sellerEarnings
    });
  }

  try {
    const masterOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          total: new Prisma.Decimal(grandTotal),
          status: paymentDetails ? 'PROCESSING' : 'PENDING', // If paid, set to Processing
          shippingAddress: addressId,
          // Only save payment ID if it exists
          paymentId: paymentDetails?.razorpayPaymentId || null, 
          buyerNote: buyerNote || null,
        }
      });

      for (const storeId in storeGroups) {
        const group = storeGroups[storeId];
        await tx.subOrder.create({
          data: {
            orderId: order.id,
            storeId: group.storeId,
            status: 'PENDING',
            total: new Prisma.Decimal(group.total),
            items: {
              create: group.items.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: new Prisma.Decimal(item.price),
                commission: new Prisma.Decimal(item.commission),
                sellerEarnings: new Prisma.Decimal(item.sellerEarnings)
              }))
            }
          }
        });

        for (const item of group.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          });
        }
      }
      return order;
    });

    return { orderId: masterOrder.id };

  } catch (e: any) {
    console.error("Database Transaction Error:", e);
    return { error: "Database transaction failed." };
  }
}