import { Box, Container, Grid, Typography, Card, Avatar } from '@mui/material';
import { Store, People, Public } from '@mui/icons-material';

export default function AboutPage() {
  return (
    <Box>
      {/* Hero */}
      <Box sx={{ bgcolor: '#1d1d1f', color: 'white', py: 12, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={700} gutterBottom>Crafting Homes.</Typography>
          <Typography variant="h5" sx={{ opacity: 0.8, maxWidth: 600, mx: 'auto' }}>
            Woodsphere is India's first multi-vendor marketplace dedicated exclusively to premium furniture.
          </Typography>
        </Container>
      </Box>

      {/* Stats */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
             <Card sx={{ p: 4, textAlign: 'center', height: '100%', borderRadius: 4 }}>
                <Store sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" fontWeight={700}>500+</Typography>
                <Typography color="text.secondary">Verified Artisans & Sellers</Typography>
             </Card>
          </Grid>
          <Grid item xs={12} md={4}>
             <Card sx={{ p: 4, textAlign: 'center', height: '100%', borderRadius: 4 }}>
                <People sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" fontWeight={700}>10k+</Typography>
                <Typography color="text.secondary">Happy Customers</Typography>
             </Card>
          </Grid>
          <Grid item xs={12} md={4}>
             <Card sx={{ p: 4, textAlign: 'center', height: '100%', borderRadius: 4 }}>
                <Public sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" fontWeight={700}>25+</Typography>
                <Typography color="text.secondary">Cities Covered</Typography>
             </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}