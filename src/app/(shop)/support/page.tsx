import { Box, Container, Typography, Grid, Card } from '@mui/material';
import Link from 'next/link';
import { Help, LocalShipping, AssignmentReturn } from '@mui/icons-material';

export default function SupportPage() {
  return (
    <Box sx={{ py: 8, bgcolor: '#f5f5f7', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight={700} align="center" mb={6}>How can we help?</Typography>
        
        <Grid container spacing={4}>
           {[
             { title: "Track Order", icon: <LocalShipping sx={{ fontSize: 40 }} />, link: "/orders" },
             { title: "Returns", icon: <AssignmentReturn sx={{ fontSize: 40 }} />, link: "/returns" },
             { title: "FAQs", icon: <Help sx={{ fontSize: 40 }} />, link: "/faqs" },
           ].map((item) => (
             <Grid item xs={12} md={4} key={item.title}>
                <Link href={item.link} style={{ textDecoration: 'none' }}>
                   <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, transition: '0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
                      <Box sx={{ color: 'primary.main', mb: 2 }}>{item.icon}</Box>
                      <Typography variant="h6" fontWeight={700} color="text.primary">{item.title}</Typography>
                   </Card>
                </Link>
             </Grid>
           ))}
        </Grid>
      </Container>
    </Box>
  );
}