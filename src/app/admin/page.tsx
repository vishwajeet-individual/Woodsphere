import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Box, Typography, Card, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2'; // Grid v6
import { AttachMoney, ShoppingBag, Inventory, Star } from '@mui/icons-material';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getVendorStats(userId: string) {
  // 1. Get the Vendor's Store ID
  const store = await prisma.store.findUnique({
    where: { userId },
    select: { id: true, name: true }
  });

  if (!store) return null;

  // 2. Fetch Metrics scoped to this Store
  const totalProducts = await prisma.product.count({
    where: { storeId: store.id }
  });

  // Calculate Revenue from SubOrders (The V2 split logic)
  const subOrders = await prisma.subOrder.findMany({
    where: { storeId: store.id },
    select: { total: true }
  });
  
  const totalRevenue = subOrders.reduce((acc, order) => acc + Number(order.total), 0);
  const totalOrders = subOrders.length;

  return { storeName: store.name, totalProducts, totalRevenue, totalOrders };
}

// Reusable Stat Card
function StatCard({ title, value, icon, color }: any) {
  return (
    <Card sx={{ p: 3, borderRadius: 4, height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="start">
         <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom textTransform="uppercase" fontSize="0.75rem">
               {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} color="#1d1d1f">
               {value}
            </Typography>
         </Box>
         <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: `${color}15`, color: color }}>
            {icon}
         </Box>
      </Stack>
    </Card>
  );
}

export default async function VendorDashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const stats = await getVendorStats(session.user.id);

  if (!stats) {
    return (
      <Box p={4}>
        <Typography variant="h5">No Store Found.</Typography>
        <Typography color="text.secondary">You need to register as a seller first.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1, letterSpacing: '-0.02em' }}>
        Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back, <b>{stats.storeName}</b>. Here is what's happening today.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
           <StatCard 
             title="My Revenue" 
             value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} 
             icon={<AttachMoney />} 
             color="#34c759" // Green
           />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
           <StatCard 
             title="Orders" 
             value={stats.totalOrders} 
             icon={<ShoppingBag />} 
             color="#0071e3" // Blue
           />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
           <StatCard 
             title="Products" 
             value={stats.totalProducts} 
             icon={<Inventory />} 
             color="#ff9500" // Orange
           />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
           <StatCard 
             title="Store Rating" 
             value="4.9" // Placeholder until we build reviews
             icon={<Star />} 
             color="#af52de" // Purple
           />
        </Grid>
      </Grid>
    </Box>
  );
}