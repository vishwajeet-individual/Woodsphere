import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Box, Container, Typography, Card, Divider, Chip, Stack, Button } from '@mui/material';
import Grid from '@mui/material/Grid'; 
import { CheckCircle, LocalShipping, Store, CreditCard, Money } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import PrintButton from '@/components/ui/PrintButton';

async function getOrder(orderId: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      // ⚠️ CORRECT V2 QUERY: Fetch SubOrders, not direct Items
      subOrders: {
        include: {
          store: true, 
          items: {
            include: { product: true }
          }
        }
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
  const isOnlinePayment = !!order.paymentId;

  return (
    <Box sx={{ bgcolor: '#f5f5f7', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="md">
        
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
           <CheckCircle sx={{ fontSize: 64, color: '#34c759', mb: 2 }} />
           <Typography variant="h3" fontWeight={700} gutterBottom>
             Order Confirmed
           </Typography>
           <Typography variant="body1" color="text.secondary">
             Order ID: #{order.id.slice(-8).toUpperCase()}
           </Typography>
        </Box>

        {/* Shipping & Payment Details */}
        <Card sx={{ p: 4, borderRadius: 4, mb: 4, boxShadow: 'none', border: '1px solid rgba(0,0,0,0.05)' }}>
          <Grid container spacing={4}>
            {/* Address */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>Shipping Address</Typography>
              {address ? (
                <Box color="text.secondary" fontSize="0.9rem">
                  <Typography variant="body2">{address.street}</Typography>
                  <Typography variant="body2">{address.city}, {address.state} - {address.zip}</Typography>
                  <Typography variant="body2">{address.country}</Typography>
                </Box>
              ) : (
                <Typography color="error">Address missing</Typography>
              )}
            </Grid>

            {/* Payment Info */}
            <Grid item xs={12} md={6}>
               <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography color="text.secondary">Total Paid</Typography>
                  <Typography fontWeight={700} fontSize="1.2rem">₹{Number(order.total).toLocaleString('en-IN')}</Typography>
               </Stack>
               
               <Box 
                 sx={{ 
                   display: 'flex', 
                   alignItems: 'center', 
                   gap: 1, 
                   bgcolor: isOnlinePayment ? 'rgba(52, 199, 89, 0.1)' : 'rgba(0,0,0,0.05)',
                   p: 1, 
                   borderRadius: 2,
                   width: 'fit-content',
                   mt: 1
                 }}
               >
                 {isOnlinePayment ? <CreditCard color="success" fontSize="small"/> : <Money color="action" fontSize="small"/>}
                 <Typography variant="caption" fontWeight={600} color={isOnlinePayment ? "success.main" : "text.secondary"}>
                   {isOnlinePayment ? `Paid Online` : "Cash on Delivery"}
                 </Typography>
               </Box>
               
               {isOnlinePayment && (
                 <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                   Ref: {order.paymentId}
                 </Typography>
               )}
            </Grid>
          </Grid>
        </Card>

        {/* Shipments (Loop through SubOrders) */}
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          Shipments ({order.subOrders.length})
        </Typography>

        <Stack spacing={3}>
          {order.subOrders.map((subOrder) => (
            <Card key={subOrder.id} sx={{ p: 3, borderRadius: 3, overflow: 'hidden' }}>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '1px solid #f0f0f0' }}>
                 <Stack direction="row" alignItems="center" spacing={1}>
                    <Store color="action" />
                    <Typography fontWeight={600}>
                      Sold by {subOrder.store.name}
                    </Typography>
                 </Stack>
                 <Chip 
                    label={subOrder.status} 
                    color={subOrder.status === 'DELIVERED' ? 'success' : 'primary'}
                    size="small"
                    variant="outlined"
                 />
              </Box>

              <Stack spacing={2}>
                {subOrder.items.map((item) => (
                  <Grid container spacing={2} alignItems="center" key={item.id}>
                    <Grid item xs={3} sm={2}>
                       <Box sx={{ position: 'relative', aspectRatio: '1', bgcolor: '#f5f5f7', borderRadius: 2, overflow: 'hidden' }}>
                          {item.product.images[0] && (
                            <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
                          )}
                       </Box>
                    </Grid>
                    <Grid item xs={9} sm={7}>
                       <Typography fontWeight={600} variant="body2">{item.product.name}</Typography>
                       <Typography variant="caption" color="text.secondary">Qty: {item.quantity}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3} textAlign={{ sm: 'right' }}>
                       <Typography fontWeight={600}>₹{Number(item.price).toLocaleString('en-IN')}</Typography>
                    </Grid>
                  </Grid>
                ))}
              </Stack>

            </Card>
          ))}
        </Stack>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
           <Button component={Link} href="/" sx={{ mr: 2 }}>Continue Shopping</Button>
           <PrintButton />
        </Box>

      </Container>
    </Box>
  );
}