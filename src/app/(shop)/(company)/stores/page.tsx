'use client';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button } from '@mui/material';
import { LocationOn, AccessTime } from '@mui/icons-material';

const STORES = [
    { city: 'New Delhi', address: '12, Design District, Hauz Khas', image: 'https://images.unsplash.com/photo-1574632832043-42eb4dc04983?w=800&q=80' },
    { city: 'Bangalore', address: '45, Indiranagar 100ft Road', image: 'https://images.unsplash.com/photo-1556020685-ae79c95eda07?w=800&q=80' },
    { city: 'Mumbai', address: 'Plot 88, Lower Parel', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80' }
];

export default function StoresPage() {
  return (
    <Box sx={{ bgcolor: '#ffffff', py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight={800} gutterBottom>Experience Centres</Typography>
        <Typography variant="body1" color="text.secondary" mb={6} maxWidth="600px">
           Touch, feel, and experience the quality of Woodsphere furniture. 
           Walk in to any of our stores for a personalized consultation.
        </Typography>

        <Grid container spacing={4}>
           {STORES.map((store) => (
              <Grid item xs={12} md={4} key={store.city}>
                 <Card sx={{ borderRadius: 4, boxShadow: 'none', border: '1px solid #f0f0f0' }}>
                    <CardMedia component="img" height="250" image={store.image} alt={store.city} />
                    <CardContent sx={{ p: 3 }}>
                       <Typography variant="h5" fontWeight={700} mb={1}>{store.city}</Typography>
                       <Box display="flex" gap={1} mb={1} color="text.secondary">
                          <LocationOn fontSize="small" />
                          <Typography variant="body2">{store.address}</Typography>
                       </Box>
                       <Box display="flex" gap={1} mb={3} color="text.secondary">
                          <AccessTime fontSize="small" />
                          <Typography variant="body2">Mon-Sun: 10AM - 9PM</Typography>
                       </Box>
                       <Button variant="outlined" fullWidth sx={{ borderRadius: 50 }}>Get Directions</Button>
                    </CardContent>
                 </Card>
              </Grid>
           ))}
        </Grid>
      </Container>
    </Box>
  );
}