import { auth, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Box, Container, Typography, Card, Avatar, Stack, Button, Divider } from '@mui/material';
import Grid from '@mui/material/Grid'; // Classic Grid
import { ShoppingBag, LocationOn, Settings, Logout } from '@mui/icons-material';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const user = session.user;

  // Get stats
  const orderCount = await prisma.order.count({ where: { userId: user.id } });

  return (
    <Box sx={{ bgcolor: '#f5f5f7', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight={700} sx={{ mb: 6 }}>
          Account.
        </Typography>

        <Card sx={{ p: 4, borderRadius: 4, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} alignItems="center">
            <Avatar 
              src={user.image || undefined} 
              sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: '2.5rem' }}
            >
              {user.name?.[0] || 'U'}
            </Avatar>
            <Box textAlign={{ xs: 'center', sm: 'left' }}>
              <Typography variant="h5" fontWeight={700}>{user.name}</Typography>
              <Typography color="text.secondary">{user.email}</Typography>
              <Chip label={user.role || 'USER'} size="small" sx={{ mt: 1 }} />
            </Box>
            
            <Box sx={{ ml: { sm: 'auto' } }}>
               <form action={async () => {
                 'use server';
                 await signOut({ redirectTo: '/' });
               }}>
                 <Button type="submit" variant="outlined" color="error" startIcon={<Logout />} sx={{ borderRadius: 50 }}>
                   Sign Out
                 </Button>
               </form>
            </Box>
          </Stack>
        </Card>

        <Grid container spacing={3}>
          {/* Orders Card */}
          <Grid item xs={12} md={4}>
            <Link href="/orders" style={{ textDecoration: 'none' }}>
              <Card sx={{ p: 3, borderRadius: 3, height: '100%', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <ShoppingBag color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h6" fontWeight={700}>My Orders</Typography>
                <Typography variant="body2" color="text.secondary">
                  {orderCount} orders placed
                </Typography>
              </Card>
            </Link>
          </Grid>

          {/* Addresses Card (Placeholder link for now) */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, borderRadius: 3, height: '100%', opacity: 0.7 }}>
              <LocationOn color="action" sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6" fontWeight={700}>Addresses</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage shipping details
              </Typography>
            </Card>
          </Grid>

          {/* Settings Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, borderRadius: 3, height: '100%', opacity: 0.7 }}>
              <Settings color="action" sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6" fontWeight={700}>Settings</Typography>
              <Typography variant="body2" color="text.secondary">
                Password & Security
              </Typography>
            </Card>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
}

// Helper Chip component if missing import
function Chip({ label, ...props }: any) {
    return <Box sx={{ display: 'inline-block', bgcolor: '#e0e0e0', px: 1, borderRadius: 1, fontSize: '0.75rem', fontWeight: 600, ...props.sx }}>{label}</Box>
}