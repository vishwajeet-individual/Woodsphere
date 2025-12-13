import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import AddToCart from '@/components/product/AddToCart';
import ProductReviews from '@/components/product/ProductReviews';
import ProductGallery from '@/components/product/ProductGallery';
import ProductGridSection from '@/components/product/ProductGridSection';
import MakerStory from '@/components/product/MakerStory';
import { Box, Container, Typography, Chip, Breadcrumbs, Divider, Stack, Rating } from '@mui/material'; // Added Rating
import Grid from '@mui/material/Grid2'; 
import { Store, LocalShipping, VerifiedUser, AssignmentReturn, Star } from '@mui/icons-material';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// ⚠️ FIX: Helper to convert Prisma Decimal types to serializable Number
const serializeProduct = (product: any) => {
    if (!product) return product;
    
    // Convert price
    const serializedProduct = {
        ...product,
        price: Number(product.price),
    };

    // Convert store commissionRate if store exists
    if (serializedProduct.store) {
        serializedProduct.store.commissionRate = Number(serializedProduct.store.commissionRate);
    }

    // Convert review dates if necessary (though usually not an issue if review component is client-side)
    if (serializedProduct.reviews) {
        serializedProduct.reviews = serializedProduct.reviews.map((review: any) => ({
            ...review,
            createdAt: review.createdAt.toISOString(),
            updatedAt: review.updatedAt?.toISOString() || null,
        }));
    }

    return serializedProduct;
};


// --- DATA FETCHING ---
async function getData(id: string) {
  // 1. Fetch Main Product
  const productRaw = await prisma.product.findUnique({
    where: { id },
    include: { 
      subCategory: true,
      store: true,
      reviews: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      }
    },
  });

  if (!productRaw) return null;

  // 2. Fetch Store Stats (Rating)
  const storeStats = await prisma.review.aggregate({
    where: { product: { storeId: productRaw.storeId } },
    _avg: { rating: true },
    _count: true
  });

  // 3. Fetch Related
  const relatedRaw = await prisma.product.findMany({
    where: { subCategoryId: productRaw.subCategoryId, id: { not: id } },
    take: 4,
    include: { subCategory: true } 
  });

  // 4. Fetch More From Seller
  const moreFromStoreRaw = await prisma.product.findMany({
    where: { storeId: productRaw.storeId, id: { not: id } },
    take: 4,
    include: { subCategory: true }
  });
  
  // ⚠️ FIX: Serialize ALL data before returning
  const product = serializeProduct(productRaw);
  const related = relatedRaw.map(serializeProduct);
  const moreFromStore = moreFromStoreRaw.map(serializeProduct);

  return { product, related, moreFromStore, storeStats };
}

async function checkReviewEligibility(userId: string, productId: string) {
  const hasPurchased = await prisma.orderItem.findFirst({
    where: { productId, subOrder: { order: { userId } } }
  });
  if (!hasPurchased) return 'not-purchased';
  const hasReviewed = await prisma.review.findUnique({
    where: { userId_productId: { userId, productId } }
  });
  if (hasReviewed) return 'reviewed';
  return 'can-review';
}

const TrustBadge = ({ icon, title, subtitle }: any) => (
  <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2, border: '1px solid #f0f0f0', borderRadius: 2 }}>
     <Box sx={{ color: 'primary.main' }}>{icon}</Box>
     <Box>
        <Typography variant="subtitle2" fontWeight={700}>{title}</Typography>
        <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
     </Box>
  </Stack>
);

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const resolvedParams = await params;
  
  const data = await getData(resolvedParams.id);
  if (!data) notFound();

  // Data is now serialized and ready to use
  const { product, related, moreFromStore, storeStats } = data;
  const storeRating = storeStats._avg.rating || 0;
  const storeReviewCount = storeStats._count;

  // Review Logic
  let reviewStatus = 'guest';
  let canReview = false;
  if (session?.user?.id) {
    const status = await checkReviewEligibility(session.user.id, product.id);
    reviewStatus = status;
    canReview = status === 'can-review';
  }

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        
        <Breadcrumbs sx={{ mb: 4, fontSize: '0.85rem' }}>
          <Link href="/" style={{ color: '#86868b', textDecoration: 'none' }}>Home</Link>
          <Link href="/search" style={{ color: '#86868b', textDecoration: 'none' }}>Shop</Link>
          <Typography color="text.primary" fontWeight={500}>{product.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={{ xs: 4, md: 8 }}>
          
          {/* LEFT: VISUAL GALLERY */}
          <Grid size={{ xs: 12, md: 7 }}>
             <ProductGallery images={product.images} name={product.name} />
          </Grid>

          {/* RIGHT: PRODUCT INFO */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              
              {/* ⚠️ VENDOR INFO & RATING */}
              <Link href={`/store/${product.store.slug}`} style={{ textDecoration: 'none' }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                   <Store fontSize="small" sx={{ color: 'primary.main' }} />
                   <Typography variant="caption" fontWeight={700} color="primary.main" textTransform="uppercase">
                      {product.store.name}
                   </Typography>
                   {product.store.status === 'ACTIVE' && <VerifiedUser fontSize="inherit" color="success" />}
                     
                     {/* Rating Badge */}
                     {storeReviewCount > 0 && (
                       <Stack direction="row" alignItems="center" spacing={0.5} sx={{ bgcolor: '#fff4e5', px: 0.8, py: 0.2, borderRadius: 1 }}>
                          <Star sx={{ fontSize: 12, color: 'warning.main' }} />
                          <Typography variant="caption" fontWeight={700} color="warning.dark">
                             {storeRating.toFixed(1)} ({storeReviewCount})
                          </Typography>
                       </Stack>
                     )}
                </Stack>
              </Link>

              <Typography variant="h3" fontWeight={800} sx={{ mb: 1, lineHeight: 1.2 }}>
                {product.name}
              </Typography>
              
              {product.subCategory && (
                <Chip label={product.subCategory.name} size="small" sx={{ bgcolor: '#f5f5f7', fontWeight: 600, mb: 3 }} />
              )}

              <Stack direction="row" alignItems="baseline" spacing={2} mb={4}>
                 <Typography variant="h3" fontWeight={700} color="#1d1d1f">
                    ₹{product.price.toLocaleString('en-IN')}
                 </Typography>
                 {product.isSale && (
                   <>
                    <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                       {/* Assuming the original price calculation was for display only */}
                        ₹{(product.price * 1.2).toLocaleString('en-IN')} 
                    </Typography>
                    <Chip label="20% OFF" color="error" size="small" sx={{ fontWeight: 700, borderRadius: 1 }} />
                   </>
                 )}
              </Stack>

              <Divider sx={{ mb: 4 }} />

              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 4 }}>
                {product.description}
              </Typography>

              {/* ⚠️ MAKER STORY (Data is now correctly serialized) */}
              <MakerStory 
                 sellerName={product.store.name}
                 storeSlug={product.store.slug}
                 story={product.story} 
                 origin={product.materialOrigin}
                 rating={storeRating || 0}
                 reviewCount={storeReviewCount}
              />

              <Stack spacing={2} mb={4}>
                 <TrustBadge icon={<LocalShipping />} title="Free Delivery" subtitle="On all orders above ₹5000" />
                 <TrustBadge icon={<AssignmentReturn />} title="7 Day Returns" subtitle="Change of mind? No problem." />
              </Stack>

              {/* ⚠️ AddToCart: Now receives Number types */}
              <AddToCart 
                 product={product} 
              />

            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 10 }} />

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          // ⚠️ Data is now correctly serialized
              <ProductGridSection title="Similar Items" products={related} viewAllLink={`/search?sub=${product.subCategory?.slug}`} />
        )}

        {/* MORE FROM SELLER */}
        {moreFromStore.length > 0 && (
          // ⚠️ Data is now correctly serialized
              <ProductGridSection title={`More from ${product.store.name}`} products={moreFromStore} viewAllLink={`/store/${product.store.slug}`} />
        )}

        <Divider sx={{ my: 10 }} />

        {/* REVIEWS */}
        {/* Reviews are also serialized via the main product object */}
        <ProductReviews productId={product.id} reviews={product.reviews} canReview={canReview} reviewStatus={reviewStatus} />

      </Container>
    </Box>
  );
}