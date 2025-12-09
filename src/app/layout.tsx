import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { Toaster } from 'sonner';
import SessionProvider from '@/components/providers/SessionProvider';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: "Woodsphere",
  description: "Designed for living.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
         <SessionProvider>
           <CartProvider>
             <AppRouterCacheProvider>
               <ThemeProvider theme={theme}>
                 <CssBaseline />
                 {children}
                 <Toaster position="top-center" richColors />
               </ThemeProvider>
             </AppRouterCacheProvider>
           </CartProvider>
         </SessionProvider>
      </body>
    </html>
  );
}