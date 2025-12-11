'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';

// ... (RegisterSchema remains the same)
const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function loginWithPhoneAction(idToken: string) {
  try {
    await signIn("credentials", {
      idToken,
      redirectTo: '/',
    });
  } catch (error) {
    if (error instanceof AuthError) {
       return { error: "Verification failed" };
    }
    throw error;
  }
}

export async function registerAction(values: any) {
  const validated = RegisterSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  const { email, password, name } = validated.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "Email already taken" };

  const hashedPassword = await bcrypt.hash(password, 10);

  // Default role is USER. 
  // If they want to be a seller, we handle that flow on the client side after registration (redirect to /sell)
  await prisma.user.create({
    data: { name, email, password: hashedPassword, role: 'USER' }
  });

  return { success: true };
}

export async function loginAction(values: any) {
  const { email, password } = values;

  // 1. Check User Role manually to determine redirect destination
  const user = await prisma.user.findUnique({ where: { email } });
  
  // We let signIn handle the password validation, but we prepare the destination
  let destination = '/';
  
  if (user) {
    if (user.role === 'SELLER') destination = '/admin';
    else if (user.role === 'SUPER_ADMIN') destination = '/hq';
    else destination = '/'; // USER
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: destination, // ⚠️ Smart Redirect
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") return { error: "Invalid credentials" };
      return { error: "Something went wrong" };
    }
    throw error;
  }
}