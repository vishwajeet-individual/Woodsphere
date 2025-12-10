import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { auth } from '@/auth';

const instance = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { amount } = await req.json();

  const options = {
    amount: Math.round(amount * 100), // Amount in paise (₹1 = 100 paise)
    currency: "INR",
    receipt: `order_${Date.now()}`,
  };

  try {
    const order = await instance.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}