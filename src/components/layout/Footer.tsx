'use client';

import { Box, Container, Grid, Typography, Link as MuiLink, Stack, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore, Instagram, Facebook, YouTube, Twitter } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';

// --- Styled Components ---
const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#111111', // Deep Black/Grey
  color: '#f5f5f7',           // Off-white text
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(4),
  marginTop: 'auto',          // Pushes footer to bottom
}));

const FooterHeader = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: '#86868b',           // Muted text for headers
  marginBottom: theme.spacing(2),
}));

const FooterLink = styled(Link)(({ theme }) => ({
  display: 'block',
  color: '#d2d2d7',
  textDecoration: 'none',
  fontSize: '0.85rem',
  lineHeight: 2,
  transition: 'color 0.2s',
  '&:hover': {
    color: '#ffffff',
  },
}));

// --- Data Structure for Columns ---
const FOOTER_LINKS = [
  {
    title: "Shop",
    links: [
      { name: "Living Room", href: "/search?category=living-room" },
      { name: "Bedroom", href: "/search?category=bedroom" },
      { name: "Dining & Kitchen", href: "/search?category=dining-kitchen" },
      { name: "Office", href: "/search?category=office" },
      { name: "Kids & Outdoor", href: "/search?category=kids-outdoor" },
      { name: "Décor", href: "/search?category=decor" },
      { name: "Sale", href: "/search?sale=true", color: "#ff3b30" } // Red for Sale
    ]
  },
  {
    title: "Help & Support",
    links: [
      { name: "Customer Support", href: "/support" },
      { name: "Track Order", href: "/orders" },
      { name: "Returns & Refunds", href: "/returns" },
      { name: "Shipping & Delivery", href: "/shipping" },
      { name: "Warranty & Assembly", href: "/warranty" },
      { name: "FAQs", href: "/faqs" },
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Stores", href: "/stores" },
      { name: "Sustainability", href: "/sustainability" },
      { name: "Blog", href: "/blog" },
    ]
  },
  {
    title: "Legal",
    links: [
      { name: "Terms & Conditions", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Cancellation Policy", href: "/cancellation" },
      { name: "Cookie Policy", href: "/cookies" },
    ]
  }
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer component="footer">
      <Container maxWidth="xl">
        
        {/* --- DESKTOP VIEW (Grid) --- */}
        <Grid container spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
          {FOOTER_LINKS.map((column) => (
            <Grid item xs={3} key={column.title}>
              <FooterHeader>{column.title}</FooterHeader>
              {column.links.map((link) => (
                <FooterLink 
                  key={link.name} 
                  href={link.href}
                  style={{ color: link.color }} // Apply override color if exists (Sale)
                >
                  {link.name}
                </FooterLink>
              ))}
            </Grid>
          ))}
        </Grid>

        {/* --- MOBILE VIEW (Accordion) --- */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          {FOOTER_LINKS.map((column) => (
            <Accordion 
              key={column.title} 
              disableGutters 
              elevation={0}
              sx={{ bgcolor: 'transparent', color: '#fff', borderBottom: '1px solid #333' }}
            >
              <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#fff' }} />}>
                <Typography variant="subtitle2" fontWeight={600}>{column.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {column.links.map((link) => (
                   <FooterLink 
                     key={link.name} 
                     href={link.href} 
                     style={{ marginBottom: '8px', color: link.color }}
                   >
                     {link.name}
                   </FooterLink>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 4 }} />

        {/* --- BOTTOM BAR --- */}
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          justifyContent="space-between" 
          alignItems="center" 
          spacing={3}
        >
          {/* Copyright */}
          <Typography variant="caption" sx={{ color: '#86868b' }}>
            © {currentYear} Woodsphere. All rights reserved.
          </Typography>
          
          {/* Trust Badges (Text/Icon Representation) */}
          <Stack direction="row" spacing={2} sx={{ color: '#86868b' }}>
             <Typography variant="caption" sx={{ border: '1px solid #333', px: 1, borderRadius: 1 }}>UPI</Typography>
             <Typography variant="caption" sx={{ border: '1px solid #333', px: 1, borderRadius: 1 }}>VISA</Typography>
             <Typography variant="caption" sx={{ border: '1px solid #333', px: 1, borderRadius: 1 }}>MASTERCARD</Typography>
          </Stack>

          {/* Socials */}
          <Stack direction="row" spacing={1}>
            <Instagram fontSize="small" sx={{ color: '#86868b', cursor: 'pointer', '&:hover': { color: '#fff' } }} />
            <Facebook fontSize="small" sx={{ color: '#86868b', cursor: 'pointer', '&:hover': { color: '#fff' } }} />
            <Twitter fontSize="small" sx={{ color: '#86868b', cursor: 'pointer', '&:hover': { color: '#fff' } }} />
            <YouTube fontSize="small" sx={{ color: '#86868b', cursor: 'pointer', '&:hover': { color: '#fff' } }} />
          </Stack>
        </Stack>

      </Container>
    </FooterContainer>
  );
}