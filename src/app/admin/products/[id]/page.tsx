import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';
import { Box, Typography } from '@mui/material'; // ❌ Remove Button
import { ArrowBack } from '@mui/icons-material';
// ❌ Remove Link import
import { notFound } from 'next/navigation';
import LinkButton from '@/components/ui/LinkButton'; // 👈 1. IMPORT THIS

export const dynamic = 'force-dynamic';

async function getData(productId: string) {
  const categories = await prisma.category.findMany({
    include: { subCategories: true },
    orderBy: { name: 'asc' }
  });

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { subCategory: true } 
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
      {/* ⚠️ FIX: Use LinkButton instead of Button + component={Link} */}
      <LinkButton 
        startIcon={<ArrowBack />} 
        href="/admin/products" 
        sx={{ mb: 2 }}
      >
        Back to Products
      </LinkButton>
      
      <ProductForm categories={categories} initialData={formattedProduct} />
    </Box>
  );
}