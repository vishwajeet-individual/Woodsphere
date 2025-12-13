import { Box, Container, Typography, Grid, Paper, Stack } from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';

export default function ContactUsPage() {
  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '80vh', py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          
          {/* Left: Info */}
          <Grid item xs={12} md={5}>
             <Typography variant="h3" fontWeight={800} gutterBottom>Get in touch.</Typography>
             <Typography variant="body1" color="text.secondary" mb={6} lineHeight={1.8}>
                Have a question about your order, or just want to say hello? 
                Our team is available Mon-Sat, 9am - 7pm.
             </Typography>

             <Stack spacing={4}>
                <Box display="flex" gap={2}>
                   <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Email color="primary" />
                   </Box>
                   <Box>
                      <Typography variant="subtitle2" fontWeight={700}>Email Us</Typography>
                      <Typography variant="body2" color="text.secondary">support@woodsphere.com</Typography>
                   </Box>
                </Box>

                <Box display="flex" gap={2}>
                   <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Phone color="primary" />
                   </Box>
                   <Box>
                      <Typography variant="subtitle2" fontWeight={700}>Call Us</Typography>
                      <Typography variant="body2" color="text.secondary">+91 98765 43210</Typography>
                   </Box>
                </Box>

                <Box display="flex" gap={2}>
                   <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <LocationOn color="primary" />
                   </Box>
                   <Box>
                      <Typography variant="subtitle2" fontWeight={700}>Headquarters</Typography>
                      <Typography variant="body2" color="text.secondary">123 Furniture Lane, Design District<br />New Delhi, India</Typography>
                   </Box>
                </Box>
             </Stack>
          </Grid>

          {/* Right: Map or Form (Static for now) */}
          <Grid item xs={12} md={7}>
             <Paper sx={{ height: '100%', bgcolor: '#f5f5f7', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <Typography color="text.secondary">Contact Form Placeholder</Typography>
             </Paper>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}