'use client';

import { Box, Container, Typography, Card, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2'; 
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import { ArrowForward } from '@mui/icons-material';

// ⚠️ Updated Type to match what we pass from page.tsx
type CategoryItem = { 
  id: string; 
  name: string; 
  slug: string; 
  image?: string; // Optional because user might not have uploaded one yet
};

// --- Styled Components (Kept exactly as you provided) ---
const CardRoot = styled(Card)(({ theme }) => ({
  position: 'relative',
  height: '320px', 
  borderRadius: 24,
  overflow: 'hidden',
  cursor: 'pointer',
  boxShadow: 'none',
  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    '& .bg-image': { transform: 'scale(1.1)' },
    '& .arrow-icon': { opacity: 1, transform: 'translateX(0)' }
  },
}));

const BackgroundImage = styled(Box)<{ src: string }>(({ src }) => ({
  position: 'absolute',
  top: 0, left: 0, width: '100%', height: '100%',
  backgroundImage: `url(${src})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
}));

const GradientOverlay = styled(Box)({
  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
  background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)',
  zIndex: 1,
});

const ContentBox = styled(Box)({
  position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '24px',
  zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
});

const ArrowBox = styled(Box)(({ theme }) => ({
  width: 40, height: 40, borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#fff', opacity: 0, transform: 'translateX(-10px)', transition: 'all 0.3s ease',
}));

export default function CategoryGrid({ categories }: { categories: CategoryItem[] }) {
  // Guard: If no categories have images, hide the section entirely
  if (!categories || categories.length === 0) return null;

  return (
    <Box sx={{ bgcolor: '#ffffff', py: 8 }}>
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" alignItems="end" mb={4}>
           <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>
             Shop by Category
           </Typography>
           {/* Link to a generic search or collections page */}
           <Typography component={Link} href="/search" variant="body1" sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 600 }}>
             View All
           </Typography>
        </Stack>

        <Grid container spacing={3}>
          {categories.map((cat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cat.slug + index}>
              {/* Navigate to Dynamic Category Page */}
              <Link href={`/category/${cat.slug}`} passHref style={{ textDecoration: 'none' }}>
                <CardRoot>
                  {/* 🧠 SMART FALLBACK: Use uploaded image OR a grey placeholder */}
                  <BackgroundImage 
                    className="bg-image" 
                    src={cat.image || 'https://via.placeholder.com/600x800?text=No+Image'} 
                  />
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