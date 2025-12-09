import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getData() {
  return await prisma.category.findMany({
    include: { subCategories: true },
    orderBy: { name: 'asc' }
  });
}

export default async function NewProductPage() {
  const categories = await getData();

  return (
    <Box>
      <Button startIcon={<ArrowBack />} component={Link} href="/admin/products" sx={{ mb: 2 }}>
        Back to Products
      </Button>
      
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
        Add New Product
      </Typography>

      <ProductForm categories={categories} />
    </Box>
  );
}