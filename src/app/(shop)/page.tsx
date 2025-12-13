import { prisma } from '@/lib/prisma';
import Hero from '@/components/home/Hero';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductGridSection from '@/components/product/ProductGridSection';
import SellerCTA from '@/components/home/SellerCTA';
import SaleBanner from '@/components/home/SaleBanner';
import Testimonials from '@/components/home/Testimonials';
import { Box, Container, Stack } from '@mui/material';
import { getSiteSettings, getHeaderSettings } from '@/lib/actions/settings'; 

export const dynamic = 'force-dynamic';

const serializeProduct = (product: any) => ({
  ...product,
  price: Number(product.price),
});

function mergeCategoryData(headerSettings: any, siteSettings: any) {
  const menuItems = headerSettings?.navigation || [];
  // Use 'any' cast to handle potential schema naming variations safely
  const settings = siteSettings as any;
  const images = settings?.categoryGridConfig || settings?.categoryImages || {};

  return menuItems
    .filter((item: any) => images[item.slug]) 
    .map((item: any) => ({
        id: item.slug,   
        name: item.label, 
        slug: item.slug,  
        image: images[item.slug] 
    }));
}

async function getHomepageData() {
  const [
    headerSettings, 
    siteSettingsRaw, // Renamed for clarity
    bestSellers, 
    saleItems, 
    reviews
  ] = await Promise.all([
    getHeaderSettings(), 
    getSiteSettings(),
    prisma.product.findMany({ where: { isFeatured: true }, take: 4, include: { subCategory: true } }),
    prisma.product.findMany({ 
      where: { OR: [{ isSale: true }, { price: { lte: 25000 } }] },
      take: 4, include: { subCategory: true }, orderBy: { price: 'asc' }
    }),
    prisma.review.findMany({
      where: { rating: 5, comment: { not: "" } },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, image: true } } }
    }),
  ]);

  const siteSettings = siteSettingsRaw as any; // ⚠️ Cast to any to bypass TS Strictness for JSON fields

  // Merge header navigation with site settings image data
  const categories = mergeCategoryData(headerSettings, siteSettings);

  const serializableBestSellers = bestSellers.map(serializeProduct);
  const serializableSaleItems = saleItems.map(serializeProduct);

  const serializableReviews = reviews.map(review => ({
      ...review,
      createdAt: review.createdAt.toISOString(),
  }));

  return { 
    categories, 
    bestSellers: serializableBestSellers,
    saleItems: serializableSaleItems,
    reviews: serializableReviews,
    // ⚠️ FIX: Check for both naming conventions to be safe
    heroConfig: siteSettings?.hero || siteSettings?.heroConfig || {},
    bannerConfig: siteSettings?.banner || siteSettings?.promoBannerConfig || {}
  };
}

export default async function Home() {
  const data = await getHomepageData();

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', pb: 0 }}>
      
      {/* 1. Dynamic Hero */}
      <Hero data={data.heroConfig} />

      <Stack spacing={6} sx={{ mt: 6, mb: 0 }}>
        
        {/* 2. Promotional Banner */}
        <Container maxWidth="xl">
           <SaleBanner data={data.bannerConfig} />
        </Container>

        <Container maxWidth="xl">
           <ProductGridSection title="Flash Deals" products={data.saleItems} viewAllLink="/search?sale=true" />
        </Container>

        {/* 3. Categories Grid */}
        <CategoryGrid categories={data.categories} />

        {/* 4. Best Sellers */}
        <Container maxWidth="xl">
           <ProductGridSection title="Best Sellers" products={data.bestSellers} viewAllLink="/search?sort=popular" />
        </Container>

        {/* 5. Testimonials */}
        <Testimonials reviews={data.reviews} />

        <SellerCTA />

      </Stack>
    </Box>
  );
}