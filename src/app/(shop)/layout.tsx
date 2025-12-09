import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Box } from "@mui/material";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" flexGrow={1}>
         {children}
      </Box>
      <Footer />
    </Box>
  );
}