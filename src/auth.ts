import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { firebaseAdmin } from '@/lib/firebaseAdmin';

const LoginSchema = z.object({
  email: z.string().optional(),
  password: z.string().optional(),
  idToken: z.string().optional(),
});

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  // ❌ REMOVED: allowDangerousEmailAccountLinking: true, (Not allowed here in v5)
  
  providers: [
    // 1. GOOGLE PROVIDER
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      // ✅ KEPT: This is the correct place for it
      allowDangerousEmailAccountLinking: true,
    }),

    // 2. CREDENTIALS PROVIDER
    Credentials({
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);

        if (!parsed.success) {
          console.error('❌ Auth validation failed:', parsed.error);
          return null;
        }

        const { email, password, idToken } = parsed.data;

        // --- OPTION A: PHONE LOGIN (via Firebase) ---
        if (idToken) {
          try {
            console.log('🔐 Verifying Firebase token...');
            
            // Verify Token using Admin SDK
            const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
            const phone = decoded.phone_number;

            console.log('✅ Token Verified. Phone:', phone);

            if (!phone) throw new Error('No phone number in token');

            // Find or Create User
            let user = await prisma.user.findFirst({ where: { phone } });

            if (!user) {
              console.log('👤 Creating new Phone User...');
              user = await prisma.user.create({
                data: {
                  phone,
                  name: `User ${phone.slice(-4)}`,
                  role: 'USER',
                  // Email is optional in your schema now
                },
              });
              console.log('🎉 Created user id=', user.id);
            } else {
              console.log('👋 Found existing user id=', user.id);
            }

            return user;
          } catch (err: any) {
            console.error('❌ Firebase verification failed:', err.message || err);
            return null;
          }
        }

        // --- OPTION B: EMAIL LOGIN ---
        if (email && password) {
          try {
            const user = await prisma.user.findUnique({ where: { email } });
            
            if (!user || !user.password) return null;

            const passwordsMatch = await bcrypt.compare(password, user.password);
            if (passwordsMatch) return user;
            
            return null;
          } catch (err) {
            console.error('❌ Email login error:', err);
            return null;
          }
        }

        return null;
      },
    }),
  ],
});