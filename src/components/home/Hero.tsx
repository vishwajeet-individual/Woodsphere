'use client';

import { Box, Container, Typography, Button, Stack, keyframes } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import Link from 'next/link';
import { styled, alpha } from '@mui/material/styles';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const DEFAULT_HERO = {
  heading: "Crafting the future of your home.",
  subHeading: "Discover a world where sustainable materials meet timeless design.",
  imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=2070&auto=format&fit=crop",
  ctaText: "Shop Collection",
  ctaLink: "/search"
};

// 1. Container (No longer handles the image directly)
const HeroContainer = styled(Box)(({ theme }) => ({
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
  backgroundColor: '#000', // Fallback color
  [theme.breakpoints.down('md')]: {
    height: '70vh',
  }
}));

// 2. The Media Layer (Handles Image or Video positioning)
const MediaLayer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
  '& video, & img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
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

export default function Hero({ data }: { data?: any }) {
  const content = data || DEFAULT_HERO;
  const mediaUrl = content.imageUrl;

  // 🧠 Smart Detection: Is it a video?
  const isVideo = mediaUrl?.match(/\.(mp4|webm|ogg)$/i) || mediaUrl?.includes('/video/upload');

  return (
    <HeroContainer>
      
      {/* ⚠️ BACKGROUND MEDIA LAYER */}
      <MediaLayer>
        {isVideo ? (
          <video 
            src={mediaUrl} 
            autoPlay 
            muted 
            loop 
            playsInline 
            poster={DEFAULT_HERO.imageUrl} // Fallback image while loading
          />
        ) : (
          // Use standard img tag or div background for parallax support
          <Box 
            sx={{
               width: '100%', height: '100%',
               backgroundImage: `url('${mediaUrl}')`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundAttachment: 'fixed', // Parallax (Desktop only)
               '@media (max-width: 900px)': { backgroundAttachment: 'scroll' }
            }} 
          />
        )}
      </MediaLayer>

      <Overlay />
      
      <ContentBox maxWidth="lg">
        <Box sx={{ display: 'inline-block', py: 0.5, px: 2, mb: 3, borderRadius: 2, border: '1px solid rgba(255,255,255,0.3)', bgcolor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}>
          <Typography variant="caption" fontWeight={700} letterSpacing={1} textTransform="uppercase">
            Welcome to Woodsphere.
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
    </HeroContainer>
  );
}