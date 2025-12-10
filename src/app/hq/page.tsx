import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Box, Typography, Card, Stack } from '@mui/material';
import Grid from '@mui/material/Grid'; // Classic Grid
import { AttachMoney, Store, ShoppingCart, TrendingUp } from '@mui/icons-material';
import { redirect } from 'next/navigation';
import RevenueChart from '@/components/hq/RevenueChart';

export const dynamic = 'force-dynamic';

async function getHQStats() {
  const totalStores = await prisma.store.count();
  const totalOrders = await prisma.order.count();
  
  // Calculate Platform Revenue (Commission only)
  // In V2, we stored 'commission' in OrderItem. We need to sum that up.
  // Note: This query assumes OrderItems have been populated correctly in V2 orders.
  // For V1 orders, this might be 0.
  const items = await prisma.orderItem.findMany({ select: { commission: true } });
  const platformRevenue = items.reduce((acc, item) => acc + Number(item.commission), 0);

  // Calculate Total Gross Merchandise Value (GMV) - Total money flowed through platform
  const orders = await prisma.order.findMany({ select: { total: true } });
  const gmv = orders.reduce((acc, order) => acc + Number(order.total), 0);

  return { totalStores, totalOrders, platformRevenue, gmv };
}

// Reusable Card
function StatCard({ title, value, subValue, icon, color }: any) {
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
            {subValue && (
                <Typography variant="caption" color="text.secondary" mt={1} display="block">
                    {subValue}
                </Typography>
            )}
         </Box>
         <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: `${color}15`, color: color }}>
            {icon}
         </Box>
      </Stack>
    </Card>
  );
}

export default async function HQDashboard() {
  const session = await auth();
  // @ts-ignore
  if (session?.user?.role !== 'SUPER_ADMIN') redirect('/login');

  const stats = await getHQStats();

  // Mock Data for Chart (Ideally this comes from a complex groupBy query)
  const chartData = [
    { date: 'Mon', value: stats.gmv * 0.1 },
    { date: 'Tue', value: stats.gmv * 0.3 },
    { date: 'Wed', value: stats.gmv * 0.2 },
    { date: 'Thu', value: stats.gmv * 0.5 },
    { date: 'Fri', value: stats.gmv * 0.8 },
    { date: 'Sat', value: stats.gmv * 0.9 },
    { date: 'Sun', value: stats.gmv },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1, letterSpacing: '-0.02em' }}>
        Platform Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Global metrics for Woodsphere.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
           <StatCard 
             title="Net Revenue (Commissions)" 
             value={`₹${stats.platformRevenue.toLocaleString('en-IN')}`} 
             icon={<AttachMoney />} 
             color="#34c759" // Green
           />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
           <StatCard 
             title="Gross Volume (GMV)" 
             value={`₹${stats.gmv.toLocaleString('en-IN')}`} 
             icon={<TrendingUp />} 
             color="#0071e3" // Blue
           />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
           <StatCard 
             title="Active Sellers" 
             value={stats.totalStores} 
             icon={<Store />} 
             color="#ff9500" // Orange
           />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
           <StatCard 
             title="Total Orders" 
             value={stats.totalOrders} 
             icon={<ShoppingCart />} 
             color="#af52de" // Purple
           />
        </Grid>
      </Grid>
      <Box mt={4}>
         <RevenueChart data={chartData} />
      </Box>
    </Box>
  );
}