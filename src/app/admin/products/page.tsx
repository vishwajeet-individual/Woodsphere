import { prisma } from '@/lib/prisma';
import ProductList from '@/components/admin/ProductList';
import { Box, Typography, Button, Stack } from '@mui/material';
import { Add } from '@mui/icons-material';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getProducts() {
  return await prisma.product.findMany({
    include: { subCategory: true },
    orderBy: { createdAt: 'desc' }
  });
}

export default async function AdminProductsPage() {
  const rawProducts = await getProducts();

  // ⚠️ FIX: Convert Decimal to Number for Client Component
  const products = rawProducts.map((product) => ({
    ...product,
    price: Number(product.price),
  }));

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Products
        </Typography>
        <Button 
          component={Link} 
          href="/admin/products/new" 
          variant="contained" 
          startIcon={<Add />}
          sx={{ borderRadius: 50 }}
        >
          Add Product
        </Button>
      </Stack>

      <ProductList products={products} />
    </Box>
  );
}