// src/lib/actions/auth.ts
'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function registerAction(values: any) {
  const validated = RegisterSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  const { email, password, name } = validated.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "Email already taken" };

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, password: hashedPassword, role: 'USER' }
  });

  return { success: true };
}

export async function loginAction(values: any) {
  try {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirectTo: '/',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") return { error: "Invalid credentials" };
      return { error: "Something went wrong" };
    }
    throw error;
  }
}