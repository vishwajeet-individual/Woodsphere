// src/auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // 1. Protection Middleware Logic
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as any)?.role;

      const isHQ = nextUrl.pathname.startsWith('/hq');     // Super Admin
      const isVendor = nextUrl.pathname.startsWith('/vendor'); // Seller

      // Protect HQ (Super Admin Only)
      if (isHQ) {
        if (isLoggedIn && role === 'SUPER_ADMIN') return true;
        return false; // Redirect to login
      }

      // Protect Vendor Dashboard (Sellers Only)
      if (isVendor) {
        if (isLoggedIn && role === 'SELLER') return true;
        return false;
      }

      return true;
    },
    // 2. Token Augmentation
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role; 
      }
      return token;
    },
    // 3. Session Augmentation
    session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id as string;
        // @ts-ignore
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  providers: [], 
} satisfies NextAuthConfig;