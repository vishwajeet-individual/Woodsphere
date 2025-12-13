import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Box } from "@mui/material";
import { getHeaderSettings } from '@/lib/actions/settings';
import { prisma } from '@/lib/prisma'; // Import Prisma

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  // 1. Fetch Header Settings AND Dynamic Header Pages
  const [headerSettings, headerPages] = await Promise.all([
     getHeaderSettings(),
     prisma.contentPage.findMany({ where: { category: 'HEADER' } }) // Fetch Header pages
  ]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Pass both settings and pages */}
      <Header settings={headerSettings as any} dynamicPages={headerPages} />
      
      <Box component="main" flexGrow={1}>
         {children}
      </Box>
      <Footer />
    </Box>
  );
}