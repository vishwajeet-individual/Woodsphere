'use client';

import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import Link from 'next/link';
import { styled } from '@mui/material/styles';

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '70vh',
  minHeight: '600px',
  maxHeight: '800px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  backgroundColor: '#f5f5f7', // Apple Light Grey
  overflow: 'hidden',
}));

export default function Hero() {
  return (
    <HeroSection>
      <Container maxWidth="md">
        <Stack spacing={3} alignItems="center">
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '3rem', md: '5rem' },
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#1d1d1f'
            }}
          >
            Designed for living.
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 400, 
              color: '#86868b', 
              maxWidth: '600px',
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              lineHeight: 1.4
            }}
          >
             Elevate your space with furniture that blends timeless aesthetics with modern comfort.
          </Typography>

          <Button 
            component={Link} 
            href="/search"
            variant="contained" 
            size="large"
            endIcon={<ArrowForward />}
            sx={{ 
              mt: 4, 
              px: 4, 
              py: 1.5, 
              fontSize: '1.1rem',
              bgcolor: '#0071e3', // Apple Blue
              borderRadius: 50
            }}
          >
            Shop Collection
          </Button>
        </Stack>
      </Container>
    </HeroSection>
  );
}