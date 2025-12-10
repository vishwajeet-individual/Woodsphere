'use client';

import { Box, Container, Typography, Card, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2'; // MUI v6
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import { ArrowForward } from '@mui/icons-material';

type Category = { id: string; name: string; slug: string; };

// --- 2. Styled Components ---
const CardRoot = styled(Card)(({ theme }) => ({
  position: 'relative',
  height: '320px', // Tall, premium look
  borderRadius: 24,
  overflow: 'hidden',
  cursor: 'pointer',
  boxShadow: 'none',
  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    '& .bg-image': {
      transform: 'scale(1.1)', // Zoom effect
    },
    '& .arrow-icon': {
      opacity: 1,
      transform: 'translateX(0)',
    }
  },
}));

const BackgroundImage = styled(Box)<{ src: string }>(({ src }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: `url(${src})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
}));

const GradientOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)',
  zIndex: 1,
});

const ContentBox = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  padding: '24px',
  zIndex: 2,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
});

const ArrowBox = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.2)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  opacity: 0, // Hidden by default
  transform: 'translateX(-10px)',
  transition: 'all 0.3s ease',
}));

export default function CategoryGrid({ categories }: { categories: any[] }) {
  return (
    <Box sx={{ bgcolor: '#ffffff' }}>
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" alignItems="end" mb={4}>
           <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>Shop by Category</Typography>
           <Typography component={Link} href="/search" variant="body1" sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 600 }}>View All</Typography>
        </Stack>

        <Grid container spacing={2}>
          {categories.map((cat) => (
            <Grid size={{ xs: 6, sm: 4, md: 4 }} key={cat.id}>
              <Link href={`/category/${cat.slug}`} passHref style={{ textDecoration: 'none' }}>
                <CardRoot>
                  {/* ⚠️ USE DB IMAGE */}
                  <BackgroundImage className="bg-image" src={cat.image || '/placeholder.jpg'} />
                  <GradientOverlay />
                  <ContentBox>
                    <Box>
                      <Typography variant="h6" fontWeight={700} color="white" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                        {cat.name}
                      </Typography>
                    </Box>
                    <ArrowBox className="arrow-icon"><ArrowForward /></ArrowBox>
                  </ContentBox>
                </CardRoot>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}