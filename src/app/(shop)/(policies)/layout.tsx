import { Box, Container } from '@mui/material';

export default function PolicyLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '80vh', py: 8 }}>
      <Container maxWidth="md">
        {children}
      </Container>
    </Box>
  );
}