import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Box, Container, Typography, Card, Divider, Chip, Stack, Button } from '@mui/material';
import Grid from '@mui/material/Grid'; // Classic Grid
import { CheckCircle, LocalShipping } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import PrintButton from '@/components/ui/PrintButton'; // <--- Import the new component

// Fetch Order Data
async function getOrder(orderId: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  if (!order || order.userId !== userId) return null;

  const address = await prisma.address.findUnique({
    where: { id: order.shippingAddress }
  });

  return { order, address };
}

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const resolvedParams = await params;
  const data = await getOrder(resolvedParams.id, session.user.id);

  if (!data) notFound();

  const { order, address } = data;

  return (
    <Box sx={{ bgcolor: '#f5f5f7', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="md">
        
        {/* Success Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
           <CheckCircle sx={{ fontSize: 64, color: '#34c759', mb: 2 }} />
           <Typography variant="h3" fontWeight={700} gutterBottom>
             Order Confirmed.
           </Typography>
           <Typography variant="body1" color="text.secondary">
             Thank you for your purchase. Your order ID is <b>#{order.id.slice(-8).toUpperCase()}</b>.
           </Typography>
        </Box>

        <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          
          {/* Status Bar */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
               <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={700}>
                  Order Date
               </Typography>
               <Typography fontWeight={500}>
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
               </Typography>
            </Box>
            <Chip 
               icon={<LocalShipping fontSize="small" />} 
               label={order.status} 
               color="primary" 
               sx={{ fontWeight: 600 }}
            />
          </Stack>

          <Divider sx={{ mb: 4 }} />

          {/* Items List */}
          <Stack spacing={3}>
             {order.items.map((item) => (
               <Box key={item.id}>
                 <Grid container spacing={2} alignItems="center">
                   <Grid item xs={3} sm={2}>
                      <Box sx={{ position: 'relative', aspectRatio: '1', bgcolor: '#f5f5f7', borderRadius: 2, overflow: 'hidden' }}>
                         {item.product.images[0] && (
                           <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
                         )}
                      </Box>
                   </Grid>
                   <Grid item xs={9} sm={6}>
                      <Typography fontWeight={600}>{item.product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">Qty: {item.quantity}</Typography>
                   </Grid>
                   <Grid item xs={12} sm={4} sx={{ textAlign: { sm: 'right' } }}>
                      <Typography fontWeight={600}>₹{Number(item.price).toLocaleString('en-IN')}</Typography>
                   </Grid>
                 </Grid>
               </Box>
             ))}
          </Stack>

          <Divider sx={{ my: 4 }} />

          {/* Address & Total */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>Shipping Address</Typography>
              {address ? (
                <Box color="text.secondary" fontSize="0.9rem">
                  <Typography variant="body2">{address.street}</Typography>
                  <Typography variant="body2">{address.city}, {address.state}</Typography>
                  <Typography variant="body2">{address.zip}</Typography>
                  <Typography variant="body2">{address.country}</Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="error">Address data unavailable</Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
               <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: 2 }}>
                  <Stack direction="row" justifyContent="space-between" mb={1}>
                     <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                     <Typography variant="body2" fontWeight={600}>₹{Number(order.total).toLocaleString('en-IN')}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" mb={2}>
                     <Typography variant="body2" color="text.secondary">Shipping</Typography>
                     <Typography variant="body2" color="success.main" fontWeight={600}>Free</Typography>
                  </Stack>
                  <Divider sx={{ mb: 1 }} />
                  <Stack direction="row" justifyContent="space-between">
                     <Typography variant="h6" fontWeight={700}>Total</Typography>
                     <Typography variant="h6" fontWeight={700}>₹{Number(order.total).toLocaleString('en-IN')}</Typography>
                  </Stack>
               </Box>
            </Grid>
          </Grid>
          
          {/* Actions */}
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Button 
              component={Link} 
              href="/" 
              variant="outlined" 
              sx={{ borderRadius: 50, mr: 2 }}
            >
              Continue Shopping
            </Button>
            
            {/* ⚠️ Fixed: Using Client Component here */}
            <PrintButton />
            
          </Box>

        </Card>
      </Container>
    </Box>
  );
}