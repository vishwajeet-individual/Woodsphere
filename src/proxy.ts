// src/middleware.ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // Pattern to ignore static files (images, css) and api routes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};