'use client';

import { Box, Container, Typography, Card, Avatar, Stack, Rating } from '@mui/material';
import Grid from '@mui/material/Grid2'; 
import { FormatQuote } from '@mui/icons-material';

// Accept real data as props
export default function Testimonials({ reviews }: { reviews: any[] }) {
  if (reviews.length === 0) return null; // Don't show if empty

  return (
    <Box sx={{ py: 6, bgcolor: '#f9f9f9' }}>
      <Container maxWidth="xl">
        <Stack alignItems="center" mb={4} textAlign="center">
          <Typography variant="caption" fontWeight={700} letterSpacing={1.5} color="primary" textTransform="uppercase">Community Stories</Typography>
          <Typography variant="h3" fontWeight={800} sx={{ mt: 1 }}>Loved by Buyers.</Typography>
        </Stack>
        <Grid container spacing={3}>
           {reviews.map((review, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card sx={{ p: 3, height: '100%', borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.02)', position: 'relative', overflow: 'visible' }}>
                 <Box sx={{ position: 'absolute', top: -15, left: 32, bgcolor: 'primary.main', color: '#fff', borderRadius: '50%', p: 1 }}>
                   <FormatQuote fontSize="small" />
                 </Box>
                 
                 <Stack spacing={2} height="100%" justifyContent="space-between">
                   <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#444', lineHeight: 1.6 }}>
                      "{review.comment}"
                   </Typography>
                   <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32, fontSize: '0.8rem' }}>
                         {review.user.name?.[0]}
                      </Avatar>
                      <Box>
                         <Typography fontWeight={700} variant="subtitle2">{review.user.name}</Typography>
                         <Typography variant="caption" color="text.secondary">Verified Buyer</Typography>
                      </Box>
                      <Box sx={{ ml: 'auto !important' }}><Rating value={review.rating} readOnly size="small" /></Box>
                   </Stack>
                </Stack>
              </Card>
            </Grid>
           ))}
        </Grid>
      </Container>
    </Box>
  );
}