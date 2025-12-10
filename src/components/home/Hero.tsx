'use client';

import { Box, Container, Typography, Button, Stack, keyframes } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import Link from 'next/link';
import { styled, alpha } from '@mui/material/styles';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- ROBUST DEFAULTS (Used if DB is empty) ---
const DEFAULT_HERO = {
  heading: "Crafting the future of your home.",
  subHeading: "Discover a world where sustainable materials meet timeless design. Premium furniture, curated for clarity and comfort.",
  imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=2070&auto=format&fit=crop",
  ctaText: "Shop Collection",
  ctaLink: "/search"
};

// Pass image via props to style
const HeroSection = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgImage', 
})<{ bgImage: string }>(({ theme, bgImage }) => ({
  position: 'relative',
  height: '85vh',
  minHeight: '600px',
  maxHeight: '900px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  color: '#fff',
  overflow: 'hidden',
  backgroundImage: `url('${bgImage}')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  [theme.breakpoints.down('md')]: {
    backgroundAttachment: 'scroll',
    height: '70vh',
  }
}));

const Overlay = styled(Box)({
  position: 'absolute', inset: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.3) 100%)',
  zIndex: 1,
});

const ContentBox = styled(Container)(({ theme }) => ({
  position: 'relative', zIndex: 2,
  animation: `${fadeUp} 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`,
}));

// Accept Data Prop (Optional)
export default function Hero({ data }: { data?: any }) {
  // ⚠️ Safety Check: Use DB data, otherwise use Default
  const content = data || DEFAULT_HERO;

  return (
    <HeroSection bgImage={content.imageUrl}>
      <Overlay />
      <ContentBox maxWidth="lg">
        
        <Box sx={{ display: 'inline-block', py: 0.5, px: 2, mb: 3, borderRadius: 2, border: '1px solid rgba(255,255,255,0.3)', bgcolor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}>
          <Typography variant="caption" fontWeight={700} letterSpacing={1} textTransform="uppercase">
            New Collection 2025
          </Typography>
        </Box>

        <Stack spacing={2} mb={6} alignItems="center">
          <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '5.5rem' }, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
            {content.heading}
          </Typography>
          
          <Typography variant="h5" sx={{ fontWeight: 400, color: 'rgba(255,255,255,0.9)', maxWidth: '700px', fontSize: { xs: '1rem', md: '1.35rem' }, lineHeight: 1.6, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
             {content.subHeading}
          </Typography>
        </Stack>

        <Button 
          component={Link} 
          href={content.ctaLink || '/search'}
          endIcon={<ArrowForward />}
          sx={{
            bgcolor: '#ffffff', color: '#000000', borderRadius: 2, padding: '12px 36px', fontSize: '1.1rem', fontWeight: 600, textTransform: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            '&:hover': { bgcolor: '#f5f5f7', transform: 'translateY(-2px)' }
          }}
        >
          {content.ctaText}
        </Button>

      </ContentBox>
    </HeroSection>
  );
}