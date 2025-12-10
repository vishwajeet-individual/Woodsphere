import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ui/ProductCard';
import { Box, Container, Typography, Stack, Button, Breadcrumbs } from '@mui/material';
import Grid from '@mui/material/Grid2'; // Using Grid v6
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowForward } from '@mui/icons-material';

export const dynamic = 'force-dynamic';

// --- 1. Static Images for Categories ---
const CATEGORY_COVERS: Record<string, string> = {
  'living-room': 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1600&q=80',
  'bedroom': 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1600&q=80',
  'dining-kitchen': 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1600&q=80',
  'office': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80',
  'kids-outdoor': 'https://images.unsplash.com/photo-1596178060841-591574347714?auto=format&fit=crop&w=1600&q=80',
  'decor': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=80',
};

async function getCategoryData(slug: string) {
  // 1. Fetch Category & SubCategories
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      subCategories: true, // Valid relation
    }
  });

  if (!category) return null;

  // 2. Fetch Products indirectly (Where subCategory.categoryId == this.id)
  const products = await prisma.product.findMany({
    where: {
      subCategory: {
        categoryId: category.id
      }
    },
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: { subCategory: true }
  });

  return { category, products };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const data = await getCategoryData(resolvedParams.slug);

  if (!data) notFound();

  const { category, products } = data;
  const coverImage = CATEGORY_COVERS[category.slug] || CATEGORY_COVERS['living-room'];

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', pb: 10 }}>
      
      {/* 1. Immersive Hero Banner */}
      <Box 
        sx={{ 
          position: 'relative', 
          height: { xs: 200, md: 400 }, 
          width: '100%',
          backgroundImage: `url(${coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 6
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', inset: 0, 
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))' 
          }} 
        />
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, color: 'white', textAlign: 'center' }}>
           <Typography variant="h2" fontWeight={800} sx={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)', letterSpacing: '-0.02em' }}>
             {category.name}
           </Typography>
           <Typography variant="h6" fontWeight={500} sx={{ opacity: 0.9, mt: 1 }}>
             Explore our premium collection of {category.name.toLowerCase()}.
           </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl">
        
        {/* 2. Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 4 }}>
            <Link href="/" style={{ textDecoration: 'none', color: '#86868b' }}>Home</Link>
            <Typography color="text.primary" fontWeight={600}>{category.name}</Typography>
        </Breadcrumbs>

        {/* 3. Sub-Category Navigation (Pills) */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="subtitle2" fontWeight={700} color="text.secondary" textTransform="uppercase" letterSpacing={1} mb={2}>
            Browse by Type
          </Typography>
          
          <Stack 
            direction="row" 
            spacing={1.5} 
            sx={{ 
              overflowX: 'auto', 
              pb: 2, // Added extra padding bottom to prevent scrollbar from hiding content
              // Hide scrollbar for cleaner look (optional)
              '::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
             {category.subCategories.map((sub) => (
               <Button
                 key={sub.id}
                 component={Link}
                 href={`/search?category=${category.slug}&sub=${sub.slug}`} 
                 variant="outlined"
                 sx={{ 
                   borderRadius: 50, 
                   whiteSpace: 'nowrap', 
                   flexShrink: 0, // ⚠️ CRITICAL FIX: Prevents overlapping/squishing
                   borderColor: '#e0e0e0', 
                   color: 'text.primary',
                   '&:hover': { bgcolor: '#f5f5f7', borderColor: '#d0d0d0' }
                 }}
               >
                 {sub.name}
               </Button>
             ))}
             <Button 
                component={Link} 
                href={`/search?category=${category.slug}`}
                endIcon={<ArrowForward />}
                sx={{ 
                  borderRadius: 50, 
                  color: 'primary.main',
                  whiteSpace: 'nowrap',
                  flexShrink: 0 // ⚠️ Apply here too
                }}
             >
               View All
             </Button>
          </Stack>
        </Box>

        {/* 4. Product Grid */}
        <Box mb={4} display="flex" justifyContent="space-between" alignItems="end">
           <Typography variant="h4" fontWeight={700}>Trending in {category.name}</Typography>
        </Box>

        {products.length > 0 ? (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={product.id}>
                <ProductCard 
                  product={{
                    ...product,
                    price: Number(product.price),
                  }} 
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ py: 10, textAlign: 'center', bgcolor: '#f9f9f9', borderRadius: 4 }}>
             <Typography color="text.secondary">No products found in this category yet.</Typography>
          </Box>
        )}

      </Container>
    </Box>
  );
}