import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getData(productId: string) {
  const categories = await prisma.category.findMany({
    include: { subCategories: true },
    orderBy: { name: 'asc' }
  });

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { subCategory: true } // Needed to find parent category ID
  });

  return { categories, product };
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { categories, product } = await getData(resolvedParams.id);

  if (!product) notFound();

  // Convert Decimal to Number for the form
  const formattedProduct = {
    ...product,
    price: Number(product.price)
  };

  return (
    <Box>
      <Button startIcon={<ArrowBack />} component={Link} href="/admin/products" sx={{ mb: 2 }}>
        Back to Products
      </Button>
      
      <ProductForm categories={categories} initialData={formattedProduct} />
    </Box>
  );
}