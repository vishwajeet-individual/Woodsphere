import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Box } from "@mui/material";
import { getHeaderSettings } from '@/lib/actions/settings'; // Import fetcher

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  // 1. Fetch Header Data on Server
  const headerSettings = await getHeaderSettings();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 2. Pass Data to Client Component */}
      <Header settings={headerSettings as any} />
      
      <Box component="main" flexGrow={1}>
         {children}
      </Box>
      <Footer />
    </Box>
  );
}