'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend'; // 👈 Import Resend

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY); // 👈 Initialize Resend Client

// --- Schemas ---
const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

// --- Auth Actions ---

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

// --- Password Reset Actions ---

// --- 1. GENERATE TOKEN & SEND EMAIL ---
export async function forgotPasswordAction(email: string) {
  // 1. Check if user exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "Email not found" };

  // 2. Generate Token
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

  // 3. Save to DB (Delete old tokens first)
  await prisma.passwordResetToken.deleteMany({ where: { email } });
  await prisma.passwordResetToken.create({
    data: { email, token, expires }
  });

  // 4. Construct Link
  const domain = process.env.AUTH_URL || 'http://localhost:3000';
  const resetLink = `${domain}/new-password?token=${token}`;

  // 5. ⚠️ SEND REAL EMAIL (Replaces console.log mock)
  try {
    await resend.emails.send({
      // Use 'onboarding@resend.dev' for testing if you haven't verified a domain yet
      from: 'Woodsphere <onboarding@resend.dev>', 
      to: email,
      subject: 'Reset your Woodsphere Password',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Reset Your Password</h2>
          <p>You requested a password reset for your Woodsphere account. Click the link below to set a new password:</p>
          <a href="${resetLink}" style="background: #0071e3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            If you didn't request this, please ignore this email. Link expires in 1 hour.
          </p>
        </div>
      `
    });
    // 6. Return success message
    return { success: "Reset email sent! Check your inbox." };
  } catch (error) {
    console.error("Email failed:", error);
    // 7. Return user-friendly error on failure
    return { error: "Failed to send email. Try again later." };
  }
}

// --- 2. VERIFY TOKEN & UPDATE PASSWORD ---
export async function newPasswordAction(token: string, newPassword: string) {
  if (!token) return { error: "Missing token" };

  // 1. Check Token existence
  const existingToken = await prisma.passwordResetToken.findUnique({ 
    where: { token } 
  });

  if (!existingToken) return { error: "Invalid token" };

  // 2. Check Expiry
  const hasExpired = new Date() > existingToken.expires;
  if (hasExpired) return { error: "Token has expired" };

  // 3. Find User
  const existingUser = await prisma.user.findUnique({ 
    where: { email: existingToken.email } 
  });
  if (!existingUser) return { error: "User does not exist" };

  // 4. Hash New Password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 5. Update User & Delete Token
  await prisma.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword }
  });

  await prisma.passwordResetToken.delete({ where: { id: existingToken.id } });

  return { success: "Password updated!" };
}