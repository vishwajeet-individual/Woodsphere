import { prisma } from '@/lib/prisma';
import { Box, Typography, Card, Stack } from '@mui/material';
import Grid from '@mui/material/Grid'; // Classic Grid
import { AttachMoney, ShoppingBag, Person, TrendingUp } from '@mui/icons-material';

// Fetch Real Data
async function getStats() {
  const totalOrders = await prisma.order.count();
  const totalCustomers = await prisma.user.count({ where: { role: 'USER' } });
  const totalProducts = await prisma.product.count();
  
  // Calculate Revenue (Sum of Decimal fields needs handling)
  const orders = await prisma.order.findMany({ select: { total: true } });
  const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total), 0);

  return { totalOrders, totalCustomers, totalProducts, totalRevenue };
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

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4, letterSpacing: '-0.02em' }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
           <StatCard 
             title="Total Revenue" 
             value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} 
             icon={<AttachMoney />} 
             color="#34c759" // Green
           />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
           <StatCard 
             title="Total Orders" 
             value={stats.totalOrders} 
             icon={<ShoppingBag />} 
             color="#0071e3" // Blue
           />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
           <StatCard 
             title="Customers" 
             value={stats.totalCustomers} 
             icon={<Person />} 
             color="#ff9500" // Orange
           />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
           <StatCard 
             title="Active Products" 
             value={stats.totalProducts} 
             icon={<TrendingUp />} 
             color="#af52de" // Purple
           />
        </Grid>
      </Grid>
    </Box>
  );
}