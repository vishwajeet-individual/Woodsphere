import { Typography, Box, Divider } from '@mui/material';

export default function TermsPage() {
  return (
    <Box>
      <Typography variant="h3" fontWeight={700} gutterBottom>Terms of Service</Typography>
      <Typography color="text.secondary" mb={4}>Last updated: December 2025</Typography>
      
      <Typography variant="h6" fontWeight={700} mt={4} gutterBottom>1. Introduction</Typography>
      <Typography paragraph color="text.secondary">
        Welcome to Woodsphere. By accessing our website, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
      </Typography>

      <Typography variant="h6" fontWeight={700} mt={4} gutterBottom>2. Use License</Typography>
      <Typography paragraph color="text.secondary">
        Permission is granted to temporarily download one copy of the materials (information or software) on Woodsphere's website for personal, non-commercial transitory viewing only.
      </Typography>

      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h6" fontWeight={700} mt={4} gutterBottom>3. Disclaimer</Typography>
      <Typography paragraph color="text.secondary">
        The materials on Woodsphere's website are provided on an 'as is' basis. Woodsphere makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.
      </Typography>
    </Box>
  );
}