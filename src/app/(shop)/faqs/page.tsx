import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const FAQS = [
  { q: "How do I track my order?", a: "You can track your order by visiting the 'My Orders' section in your profile." },
  { q: "What is the return policy?", a: "We offer a 7-day return policy for damaged or defective items." },
  { q: "Can I cancel my order?", a: "Yes, orders can be cancelled within 24 hours of placement." },
  { q: "Do you ship internationally?", a: "Currently, we only ship within India." },
];

export default function FAQPage() {
  return (
    <Box sx={{ py: 8, bgcolor: '#fff', minHeight: '80vh' }}>
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight={700} align="center" mb={6}>Frequently Asked Questions</Typography>
        
        {FAQS.map((faq, i) => (
          <Accordion key={i} sx={{ mb: 1, borderRadius: 2, '&:before': { display: 'none' }, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography fontWeight={600}>{faq.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">{faq.a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
}