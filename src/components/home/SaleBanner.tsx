'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function SaleBanner() {
  return (
    // ⚠️ CHANGED: Removed py: 4 wrapper. Just the content.
    <Box 
      sx={{ 
        borderRadius: 4, 
        background: 'linear-gradient(135deg, #ff3b30 0%, #ff9500 100%)',
        p: { xs: 3, md: 5 }, // Reduced internal padding
        color: 'white',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(255, 59, 48, 0.25)'
      }}
    >
        {/* ... content ... */}
        <Typography variant="caption" fontWeight={700} textTransform="uppercase" letterSpacing={2}>Limited Time Offer</Typography>
        <Typography variant="h3" fontWeight={900} sx={{ my: 1, fontSize: { xs: '1.8rem', md: '3rem' } }}>End of Season Sale</Typography>
        <Typography variant="h6" fontWeight={500} sx={{ mb: 3, opacity: 0.9 }}>Up to 50% OFF</Typography>
        <Button component={Link} href="/search?sale=true" variant="contained" size="large" sx={{ bgcolor: 'white', color: '#ff3b30', borderRadius: 50, px: 4, fontWeight: 800, '&:hover': { bgcolor: '#f0f0f0' } }}>
          Shop Now
        </Button>
    </Box>
  );
}