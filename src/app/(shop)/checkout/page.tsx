import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { Box, Container, Typography } from '@mui/material';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getUserAddresses(userId: string) {
  return await prisma.address.findMany({
    where: { userId },
    orderBy: { id: 'desc' }
  });
}

export default async function CheckoutPage() {
  const session = await auth();
  
  // If not logged in, force login then return to checkout
  if (!session?.user?.id) {
    redirect('/login?redirect=/checkout');
  }

  const addresses = await getUserAddresses(session.user.id);

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="xl">
        <Typography variant="h3" fontWeight={700} sx={{ mb: 6 }}>
          Checkout.
        </Typography>
        
        {/* Pass addresses to the Client Form */}
        <CheckoutForm addresses={addresses} />
      </Container>
    </Box>
  );
}