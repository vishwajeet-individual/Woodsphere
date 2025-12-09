'use client';
import { Box, Container, Typography, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid2'; // ⚠️ Using Grid2
import Link from 'next/link';
import { styled } from '@mui/material/styles';

type Category = { id: string; name: string; slug: string; };

const CategoryCard = styled(Card)(({ theme }) => ({
  height: '100%', width: '100%', aspectRatio: '1 / 1',
  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
  textAlign: 'center', backgroundColor: '#f5f5f7', boxShadow: 'none', borderRadius: 24,
  transition: 'all 0.3s', textDecoration: 'none', cursor: 'pointer',
  '&:hover': { transform: 'scale(1.02)', backgroundColor: '#ffffff', boxShadow: '0 12px 30px rgba(0,0,0,0.08)' },
}));

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <Box sx={{ py: 8, bgcolor: '#ffffff' }}>
      <Container maxWidth="xl">
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6, fontWeight: 700 }}>
          Explore by Category.
        </Typography>
        <Grid container spacing={3}>
          {categories.map((cat) => (
            <Grid size={{ xs: 6, sm: 4, md: 4 }} key={cat.id}>
              <Link href={`/search?category=${cat.slug}`} passHref style={{ textDecoration: 'none' }}>
                <CategoryCard elevation={0}>
                  <CardContent>
                    <Typography variant="h5" fontWeight={600} color="text.primary">{cat.name}</Typography>
                    <Typography variant="body2" color="primary" sx={{ mt: 1, fontWeight: 500 }}>Shop Now</Typography>
                  </CardContent>
                </CategoryCard>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}