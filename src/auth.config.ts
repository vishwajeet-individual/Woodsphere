// src/auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login', // Redirect here if user needs to login
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdminPanel = nextUrl.pathname.startsWith('/admin');
      const isOnAuthPage = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');

      // 1. Protect Admin Routes
      if (isOnAdminPanel) {
        // @ts-ignore
        if (isLoggedIn && auth.user.role === 'ADMIN') return true;
        return false; // Redirect to login
      }

      // 2. Redirect logged-in users away from Login/Register pages
      if (isOnAuthPage && isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl));
      }

      return true;
    },
    // Add User ID and Role to the Session (so we can use it in the Header)
    jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
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
  providers: [], // Providers are configured in auth.ts
} satisfies NextAuthConfig;