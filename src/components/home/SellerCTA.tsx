'use client';

import { Box, Button, Container, Typography, Stack } from '@mui/material';
import Grid from '@mui/material/Grid'; // Classic Grid
import { Storefront, ArrowForward } from '@mui/icons-material';
import Link from 'next/link';

export default function SellerCTA() {
  return (
    // ⚠️ CHANGED: Reduced py: 10 -> py: 6. Removed margins.
    <Box sx={{ bgcolor: '#1d1d1f', color: 'white', py: 6, mt: 0, position: 'relative', overflow: 'hidden' }}>
      {/* ... content ... */}
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>Sell on Woodsphere</Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>Zero fees. Secure payments.</Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
             <Button component={Link} href="/sell" variant="contained" size="large" sx={{ bgcolor: 'white', color: 'black', borderRadius: 2, px: 4, fontWeight: 700 }}>
               Start Selling
             </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}