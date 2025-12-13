'use client';

import { Box, Button, Container, Typography, Stack } from '@mui/material';
import Grid from '@mui/material/Grid'; // Classic Grid
import { Storefront, ArrowForward } from '@mui/icons-material';
import Link from 'next/link';

export default function SellerCTA() {
  return (
    // ⚠️ Updated padding and added background decorative element
    <Box sx={{ bgcolor: '#1d1d1f', color: 'white', py: 8, mt: 0, position: 'relative', overflow: 'hidden' }}>
      
      {/* Decorative Circle Background */}
      <Box sx={{ 
        position: 'absolute', top: -100, right: -100, width: 400, height: 400, 
        borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)', zIndex: 0 
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            {/* ⚠️ Enhanced: Subtitle stack with icon */}
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <Box sx={{ p: 1, bgcolor: 'primary.main', borderRadius: 2, display: 'flex' }}>
                <Storefront />
              </Box>
              <Typography variant="subtitle1" fontWeight={700} color="primary.main" textTransform="uppercase" letterSpacing={1}>
                Partner with Woodsphere
              </Typography>
            </Stack>
            
            {/* ⚠️ Enhanced: Large promotional heading */}
            <Typography variant="h3" fontWeight={800} sx={{ mb: 2, maxWidth: 600 }}>
              Sell your furniture to millions of customers.
            </Typography>
            
            {/* ⚠️ Enhanced: Clearer value proposition subheading */}
            <Typography variant="h6" sx={{ opacity: 0.8, maxWidth: 600, fontWeight: 400 }}>
              Zero listing fees. Secure payments. Powerful tools to manage your business.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
             {/* ⚠️ Enhanced: Button with icon and larger size */}
             <Button 
                component={Link} 
                href="/sell" 
                variant="contained" 
                size="large"
                endIcon={<ArrowForward />}
                sx={{ 
                  bgcolor: 'white', color: 'black', borderRadius: 2, 
                  px: 4, py: 1.5, fontSize: '1.1rem', fontWeight: 700,
                  '&:hover': { bgcolor: '#f0f0f0' }
                }}
              >
                Start Selling
              </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}