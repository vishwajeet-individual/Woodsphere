import { Typography, Box } from '@mui/material';

export default function ShippingPage() {
  return (
    <Box>
      <Typography variant="h3" fontWeight={700} gutterBottom>Shipping & Delivery</Typography>
      
      <Typography variant="h6" fontWeight={700} mt={4} gutterBottom>Delivery Timelines</Typography>
      <Typography paragraph color="text.secondary">
        Standard delivery time is 5-7 business days for metro cities and 7-10 business days for other locations.
      </Typography>

      <Typography variant="h6" fontWeight={700} mt={4} gutterBottom>Shipping Charges</Typography>
      <Typography paragraph color="text.secondary">
        We offer FREE shipping on all orders above ₹5,000. For orders below this value, a nominal fee of ₹150 applies.
      </Typography>
    </Box>
  );
}