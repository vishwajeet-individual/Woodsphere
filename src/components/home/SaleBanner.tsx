'use client';

import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

// ⚠️ Accepts Data Props
export default function SaleBanner({ data }: { data: any }) {
  if (!data) return null;

  return (
    <Box sx={{ py: 4 }}>
      <Box 
        sx={{ 
          borderRadius: 4, 
          // Default to Orange/Red gradient if not specified
          background: 'linear-gradient(135deg, #ff3b30 0%, #ff9500 100%)',
          p: { xs: 3, md: 5 },
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(255, 59, 48, 0.25)'
        }}
      >
        <Typography variant="caption" fontWeight={700} textTransform="uppercase" letterSpacing={2} sx={{ opacity: 0.8 }}>
          Limited Time Offer
        </Typography>
        
        <Typography variant="h3" fontWeight={900} sx={{ my: 1, fontSize: { xs: '1.8rem', md: '3rem' } }}>
          {data.title}
        </Typography>
        
        <Typography variant="h6" fontWeight={500} sx={{ mb: 3, opacity: 0.95 }}>
          {data.subtitle}
        </Typography>
        
        <Button 
          component={Link} 
          href={data.link || '/search'} 
          variant="contained" 
          size="large" 
          sx={{ 
            bgcolor: 'white', color: '#ff3b30', borderRadius: 50, px: 4, fontWeight: 800, 
            '&:hover': { bgcolor: '#f0f0f0', transform: 'scale(1.05)' } 
          }}
        >
          {data.buttonText}
        </Button>
      </Box>
    </Box>
  );
}