import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ui/ProductCard';
import { Box, Container, Grid, Typography, Avatar, Card, Divider } from '@mui/material';
import { Store as StoreIcon, Verified } from '@mui/icons-material';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getStore(slug: string) {
  return await prisma.store.findUnique({
    where: { slug },
    include: {
      products: {
        include: { subCategory: true },
        orderBy: { createdAt: 'desc' }
      },
      _count: { select: { products: true, subOrders: true } }
    }
  });
}

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const store = await getStore(resolvedParams.slug);

  if (!store) notFound();

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="xl">
        
        {/* Store Header / Banner */}
        <Card sx={{ p: 4, borderRadius: 4, mb: 6, bgcolor: '#f5f5f7', border: 'none', boxShadow: 'none' }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item>
               <Avatar 
                 src={store.logoUrl || undefined} 
                 sx={{ width: 100, height: 100, bgcolor: '#fff', fontSize: '3rem', color: '#1d1d1f', border: '1px solid rgba(0,0,0,0.05)' }}
               >
                 {store.name[0]}
               </Avatar>
            </Grid>
            <Grid item xs>
               <Box display="flex" alignItems="center" gap={1} mb={1}>
                 <Typography variant="h3" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>
                   {store.name}
                 </Typography>
                 {store.status === 'ACTIVE' && <Verified color="primary" />}
               </Box>
               
               <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mb: 2 }}>
                 {store.description}
               </Typography>

               <Box display="flex" gap={3}>
                  <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                     <StoreIcon fontSize="small" />
                     <Typography variant="caption" fontWeight={600}>Est. {new Date(store.createdAt).getFullYear()}</Typography>
                  </Box>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                     {store._count.products} Products listed
                  </Typography>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                     {store._count.subOrders} Sales completed
                  </Typography>
               </Box>
            </Grid>
          </Grid>
        </Card>

        <Divider sx={{ mb: 6 }} />

        <Typography variant="h5" fontWeight={700} sx={{ mb: 4 }}>
          Latest from {store.name}
        </Typography>

        {store.products.length > 0 ? (
          <Grid container spacing={3}>
            {store.products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={3}>
                <ProductCard 
                  product={{
                    ...product,
                    price: Number(product.price)
                  }} 
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box py={10} textAlign="center">
            <Typography color="text.secondary">This seller hasn't listed any products yet.</Typography>
          </Box>
        )}

      </Container>
    </Box>
  );
}