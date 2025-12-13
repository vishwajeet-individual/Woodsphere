'use client';

import { Box, Container, Typography, TextField, Button, Paper } from '@mui/material';
import { Search } from '@mui/icons-material';

export default function TrackOrderPage() {
  return (
    <Box sx={{ bgcolor: '#f5f5f7', minHeight: '80vh', py: 8 }}>
      <Container maxWidth="sm">
        <Typography variant="h3" fontWeight={800} textAlign="center" gutterBottom>
          Track Your Order
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" mb={6}>
          Enter your Order ID to see the current status.
        </Typography>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
           <TextField 
              label="Order ID" 
              placeholder="e.g. ORD-123456" 
              fullWidth 
              sx={{ mb: 3 }}
           />
           <Button 
              variant="contained" 
              fullWidth 
              size="large" 
              startIcon={<Search />}
              sx={{ py: 1.5, borderRadius: 50, fontWeight: 700 }}
           >
              Track Status
           </Button>
        </Paper>
      </Container>
    </Box>
  );
}