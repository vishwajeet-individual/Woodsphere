import { prisma } from '@/lib/prisma';
import Hero from '@/components/home/Hero';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductGridSection from '@/components/product/ProductGridSection';
import SellerCTA from '@/components/home/SellerCTA';
import SaleBanner from '@/components/home/SaleBanner';
import Testimonials from '@/components/home/Testimonials';
import { Box, Container, Stack } from '@mui/material';

export const dynamic = 'force-dynamic';

// --- DATA FETCHING ---
async function getHomepageData() {
  const [categories, bestSellers, saleItems, reviews, settings] = await Promise.all([
    // 1. Categories (Now with images)
    prisma.category.findMany({ take: 6, orderBy: { name: 'asc' } }),
    
    // 2. Best Sellers
    prisma.product.findMany({ where: { isFeatured: true }, take: 4, include: { subCategory: true } }),
    
    // 3. Sale Items
    prisma.product.findMany({ 
      where: { OR: [{ isSale: true }, { price: { lte: 25000 } }] },
      take: 4, include: { subCategory: true }, orderBy: { price: 'asc' }
    }),

    // 4. Top Reviews (5 Stars, recent)
    prisma.review.findMany({
      where: { rating: 5, comment: { not: "" } }, // Only with comments
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, image: true } } }
    }),

    // 5. Hero Config
    prisma.siteSettings.findUnique({ where: { id: 'config' } })
  ]);

  return { 
    categories, bestSellers, saleItems, reviews, 
    heroConfig: settings?.heroConfig,
    bannerConfig: settings?.promoBannerConfig
  };
}

export default async function Home() {
  const data = await getHomepageData();

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', pb: 0 }}>
      
      {/* 1. Dynamic Hero */}
      <Hero data={data.heroConfig} />

      <Stack spacing={6} sx={{ mt: 6, mb: 0 }}>
        
        {/* 4. Promotional Banner (Dynamic) */}
        <Container maxWidth="xl">
           <SaleBanner data={data.bannerConfig} />
        </Container>

        <Container maxWidth="xl">
           <ProductGridSection title="Flash Deals" products={data.saleItems} viewAllLink="/search?sale=true" />
        </Container>

        {/* Categories (Real Images) */}
        <CategoryGrid categories={data.categories} />

        {/* Best Sellers */}
        <Container maxWidth="xl">
           <ProductGridSection title="Best Sellers" products={data.bestSellers} viewAllLink="/search?sort=popular" />
        </Container>

        {/* Real Testimonials */}
        <Testimonials reviews={data.reviews} />

        <SellerCTA />

      </Stack>
    </Box>
  );
}