import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import ProductList from '@/components/admin/ProductList';
import { Box, Typography, Button, Stack } from '@mui/material';
import { Add } from '@mui/icons-material';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getVendorProducts(userId: string) {
  // 1. Find Store ID
  const store = await prisma.store.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!store) return [];

  // 2. Fetch Products for THIS store only
  return await prisma.product.findMany({
    where: { storeId: store.id }, // <--- FILTER BY STORE
    include: { subCategory: true },
    orderBy: { createdAt: 'desc' }
  });
}

export default async function VendorProductsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const rawProducts = await getVendorProducts(session.user.id);

  // Formatting for Client Component
  const products = rawProducts.map((product) => ({
    ...product,
    price: Number(product.price),
  }));

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          My Inventory
        </Typography>
        <Button 
          component={Link} 
          href="/admin/products/new" 
          variant="contained" 
          startIcon={<Add />}
          sx={{ borderRadius: 8 }}
        >
          Add Product
        </Button>
      </Stack>

      <ProductList products={products} />
    </Box>
  );
}