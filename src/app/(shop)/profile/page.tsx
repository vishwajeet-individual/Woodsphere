import { auth, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Box, Container, Typography, Card, Avatar, Stack, Button, Chip } from '@mui/material';
import Grid from '@mui/material/Grid'; // Classic Grid
import { ShoppingBag, LocationOn, Settings, Logout, Star } from '@mui/icons-material';
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
              
              {/* ⚠️ FIX: Cast user to 'any' to access custom role */}
              <Chip 
                label={(user as any).role || 'USER'} 
                size="small" 
                sx={{ mt: 1, fontWeight: 600 }} 
                variant="outlined"
              />
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

          {/* ⚠️ Reviews Card (Added from previous step) */}
          <Grid item xs={12} md={4}>
            <Link href="/profile/reviews" style={{ textDecoration: 'none' }}>
              <Card sx={{ p: 3, borderRadius: 3, height: '100%', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <Star color="warning" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h6" fontWeight={700}>My Reviews</Typography>
                <Typography variant="body2" color="text.secondary">
                  Rate your purchases
                </Typography>
              </Card>
            </Link>
          </Grid>

          {/* Addresses Card (Placeholder link) */}
          <Grid item xs={12} md={4}>
            <Link href="/checkout" style={{ textDecoration: 'none' }}>
              <Card sx={{ p: 3, borderRadius: 3, height: '100%', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <LocationOn color="action" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h6" fontWeight={700}>Addresses</Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage shipping details
                </Typography>
              </Card>
            </Link>
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