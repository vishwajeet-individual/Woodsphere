import { Typography, Box } from '@mui/material';

export default function PrivacyPage() {
  return (
    <Box>
      <Typography variant="h3" fontWeight={700} gutterBottom>Privacy Policy</Typography>
      <Typography color="text.secondary" mb={4}>Last updated: December 2025</Typography>
      
      <Typography variant="h6" fontWeight={700} mt={4} gutterBottom>Your Privacy Matters</Typography>
      <Typography paragraph color="text.secondary">
        At Woodsphere, we are committed to protecting your personal information. We use the data we collect to provide you with a rich and personalized shopping experience.
      </Typography>

      <Typography variant="h6" fontWeight={700} mt={4} gutterBottom>Data Collection</Typography>
      <Typography paragraph color="text.secondary">
        We collect information you provide directly to us, such as when you create an account, update your profile, place an order, or sign up for our newsletter.
      </Typography>
    </Box>
  );
}