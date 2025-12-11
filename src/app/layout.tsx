import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { Toaster } from 'sonner';
import SessionProvider from '@/components/providers/SessionProvider';
import { CartProvider } from '@/context/CartContext';
import NextTopLoader from 'nextjs-toploader'; // ⚠️ Ensure this is installed

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
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
         
         {/* ⚠️ GLOBAL LOADER: Works on Login, Register, Home, Admin */}
         <NextTopLoader 
            color="#0071e3"   // Apple Blue
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #0071e3,0 0 5px #0071e3"
         />

         <SessionProvider>
           <CartProvider>
             <AppRouterCacheProvider>
               <ThemeProvider theme={theme}>
                 <CssBaseline />
                 
                 {/* This renders the specific page (Login, Home, etc.) */}
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