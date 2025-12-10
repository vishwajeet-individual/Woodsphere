'use client';

import { Box, Container, Grid, Typography, TextField, Button, Card, Stack } from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';

export default function ContactPage() {
  return (
    <Box sx={{ bgcolor: '#f5f5f7', py: 8, minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          
          {/* Info */}
          <Grid item xs={12} md={5}>
            <Typography variant="h3" fontWeight={700} gutterBottom>Get in touch</Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Have questions about a product or order? We're here to help.
            </Typography>

            <Stack spacing={3}>
               <Box display="flex" gap={2}>
                  <Email color="primary" />
                  <Box>
                     <Typography fontWeight={600}>Email</Typography>
                     <Typography color="text.secondary">support@woodsphere.com</Typography>
                  </Box>
               </Box>
               <Box display="flex" gap={2}>
                  <Phone color="primary" />
                  <Box>
                     <Typography fontWeight={600}>Phone</Typography>
                     <Typography color="text.secondary">+91 99999 00000</Typography>
                  </Box>
               </Box>
               <Box display="flex" gap={2}>
                  <LocationOn color="primary" />
                  <Box>
                     <Typography fontWeight={600}>HQ</Typography>
                     <Typography color="text.secondary">123, Tech Park, Bangalore, India</Typography>
                  </Box>
               </Box>
            </Stack>
          </Grid>

          {/* Form */}
          <Grid item xs={12} md={7}>
            <Card sx={{ p: 4, borderRadius: 4 }}>
               <Stack spacing={3}>
                  <TextField label="Your Name" fullWidth />
                  <TextField label="Email Address" fullWidth />
                  <TextField label="Message" multiline rows={4} fullWidth />
                  <Button variant="contained" size="large" sx={{ borderRadius: 8, py: 1.5 }}>
                    Send Message
                  </Button>
               </Stack>
            </Card>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}