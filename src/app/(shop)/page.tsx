import { prisma } from '@/lib/prisma';
import Hero from '@/components/home/Hero';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductCard from '@/components/ui/ProductCard';
import LinkButton from '@/components/ui/LinkButton';
import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'; // ⚠️ Using Grid2
import { ArrowForward } from '@mui/icons-material';

export const dynamic = 'force-dynamic';

async function getCategories() {
  return await prisma.category.findMany({ take: 6, orderBy: { name: 'asc' } });
}

async function getFeaturedProducts() {
  return await prisma.product.findMany({
    where: { isFeatured: true },
    take: 4,
    include: { subCategory: true },
  });
}

export default async function Home() {
  const categories = await getCategories();
  const featuredProducts = await getFeaturedProducts();

  return (
    <Box>
      <Hero />
      <CategoryGrid categories={categories} />
      <Box sx={{ py: 8, bgcolor: '#f5f5f7' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 4 }}>
             <Box>
                <Typography variant="h3" fontWeight={700} gutterBottom>Featured Collection.</Typography>
                <Typography variant="body1" color="text.secondary">Hand-picked favorites.</Typography>
             </Box>
             <LinkButton href="/search" endIcon={<ArrowForward />}>View All</LinkButton>
          </Box>

          <Grid container spacing={3}>
            {featuredProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                <ProductCard product={{ ...product, price: Number(product.price) }} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}