import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Box, Container, Typography, Card, Chip, Button, Stack } from '@mui/material';
import Grid from '@mui/material/Grid'; // Classic Grid
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getOrders(userId: string) {
  // ⚠️ V2 QUERY: Fetch Master Order + SubOrders (Shipments)
  return await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { 
      subOrders: { 
        include: { items: true } 
      } 
    }
  });
}

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const orders = await getOrders(session.user.id);

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight={700} sx={{ mb: 6 }}>
          My Orders.
        </Typography>

        {orders.length === 0 ? (
          <Box textAlign="center" py={10}>
             <Typography variant="h6" color="text.secondary">No orders found.</Typography>
             <Button component={Link} href="/search" variant="contained" sx={{ mt: 2, borderRadius: 8 }}>
                Start Shopping
             </Button>
          </Box>
        ) : (
          <Stack spacing={3}>
            {orders.map((order) => {
              // Calculate total items across all shipments
              const totalItems = order.subOrders.reduce((acc, sub) => acc + sub.items.length, 0);
              
              return (
                <Card key={order.id} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} md={4}>
                       <Typography variant="caption" color="text.secondary" display="block">ORDER ID</Typography>
                       <Typography fontWeight={600}>#{order.id.slice(-8).toUpperCase()}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                       <Typography variant="caption" color="text.secondary" display="block">DATE</Typography>
                       <Typography fontWeight={500}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN')}
                       </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                       <Typography variant="caption" color="text.secondary" display="block">TOTAL</Typography>
                       <Typography fontWeight={700}>₹{Number(order.total).toLocaleString('en-IN')}</Typography>
                    </Grid>
                    <Grid item xs={12} md={2} textAlign={{ md: 'right' }}>
                       <Button 
                          component={Link} 
                          href={`/orders/${order.id}`}
                          variant="outlined" 
                          size="small"
                          sx={{ borderRadius: 8 }}
                       >
                          View Details
                       </Button>
                    </Grid>
                  </Grid>
                  
                  <Box mt={2} display="flex" alignItems="center" gap={1}>
                     <Chip 
                       label={order.status} 
                       size="small" 
                       color={order.status === 'DELIVERED' ? 'success' : 'primary'} 
                     />
                     <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                        {order.subOrders.length} Shipment(s) &bull; {totalItems} Item(s)
                     </Typography>
                  </Box>
                </Card>
              );
            })}
          </Stack>
        )}
      </Container>
    </Box>
  );
}