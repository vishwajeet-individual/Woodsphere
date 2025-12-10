import { prisma } from '@/lib/prisma';
import FilterSidebar from '@/components/shop/FilterSidebar';
import ProductCard from '@/components/ui/ProductCard';
import { Box, Container, Typography, Breadcrumbs } from '@mui/material';
import Grid from '@mui/material/Grid2'; // ⚠️ Using Grid2
import Link from 'next/link';

// Helper to fetch data
async function getData(searchParams: { [key: string]: string | string[] | undefined }) {
  const categorySlug = searchParams.category as string;
  const subCategorySlug = searchParams.sub as string;
  const searchTerm = searchParams.q as string;
  const minPrice = searchParams.min ? Number(searchParams.min) : 0;
  const maxPrice = searchParams.max ? Number(searchParams.max) : 1000000;
  const isSale = searchParams.sale === 'true';
  const sort = searchParams.sort as string; // <--- Get Sort

  // 1. Build Sort Object
  let orderBy: any = { createdAt: 'desc' }; // Default
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };

  // ... (keep existing 'where' logic) ...
  const where: any = {
    price: { gte: minPrice, lte: maxPrice },
  };
  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } },
    ];
  }
  if (categorySlug) where.subCategory = { category: { slug: categorySlug } };
  if (subCategorySlug) {
      where.subCategory = { ...where.subCategory, slug: subCategorySlug };
  }
  if (isSale) where.isSale = true;

  // 2. Fetch Products
  const products = await prisma.product.findMany({
    where,
    include: { subCategory: true },
    orderBy, // <--- Apply Sort
  });

  const categories = await prisma.category.findMany({
    include: { subCategories: true },
    orderBy: { name: 'asc' }
  });

  return { products, categories };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolved = await searchParams;
  const { products, categories } = await getData(resolved);

  return (
    <Box sx={{ bgcolor: '#fbfbfd', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Breadcrumbs sx={{ mb: 4 }}>
          <Link href="/" style={{ color: '#86868b', textDecoration: 'none' }}>Home</Link>
          <Typography color="text.primary">Shop</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 3, lg: 2 }}>
            <FilterSidebar categories={categories} />
          </Grid>
          <Grid size={{ xs: 12, md: 9, lg: 10 }}>
            <Box mb={2}>
               <Typography variant="h5" fontWeight={700}>{resolved.q ? `Results for "${resolved.q}"` : 'All Products'}</Typography>
               <Typography variant="body2" color="text.secondary">{products.length} items found</Typography>
            </Box>
            <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                    <ProductCard product={{ ...product, price: Number(product.price) }} />
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}