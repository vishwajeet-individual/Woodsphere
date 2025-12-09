import { prisma } from '@/lib/prisma';
import AddToCart from '@/components/product/AddToCart';
import { Box, Container, Typography, Chip, Breadcrumbs, Divider } from '@mui/material';
import Grid from '@mui/material/Grid2'; // Using Grid v6
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

async function getProduct(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: { subCategory: true },
  });
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params;
  const product = await getProduct(resolved.id);

  if (!product) {
    notFound();
  }

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="xl">
        
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 4 }}>
          <Link href="/" style={{ color: '#86868b', textDecoration: 'none' }}>Home</Link>
          <Link href="/search" style={{ color: '#86868b', textDecoration: 'none' }}>Shop</Link>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={8}>
          
          {/* Left: Images */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box 
              sx={{ 
                position: 'relative', 
                width: '100%', 
                aspectRatio: '1', 
                borderRadius: 4, 
                overflow: 'hidden', 
                bgcolor: '#f5f5f7' 
              }}
            >
               {product.images[0] && (
                 <Image 
                   src={product.images[0]} 
                   alt={product.name} 
                   fill 
                   style={{ objectFit: 'cover' }}
                   priority 
                 />
               )}
            </Box>
          </Grid>

          {/* Right: Details */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              
              {product.subCategory && (
                <Chip 
                  label={product.subCategory.name} 
                  size="small" 
                  sx={{ mb: 2, bgcolor: '#f5f5f7' }} 
                />
              )}

              <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                {product.name}
              </Typography>

              <Typography variant="h4" fontWeight={500} sx={{ mb: 3 }}>
                ₹{Number(product.price).toLocaleString('en-IN')}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {product.description}
              </Typography>

              {/* ⚠️ FIX: Convert Decimal to Number before passing to Client Component */}
              <AddToCart 
                product={{
                  ...product,
                  price: Number(product.price)
                }} 
              />

            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}