'use client';

import { Box, Container, Grid, Typography, Stack, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore, Instagram, Facebook, YouTube, Twitter } from '@mui/icons-material';
import Link from 'next/link';

// Helper for Footer Links
const FooterLinkItem = ({ href, children, color }: any) => (
  <Link href={href} style={{ textDecoration: 'none' }}>
    <Typography 
      variant="body2" 
      sx={{ 
        display: 'block',
        color: color || '#d2d2d7', 
        fontSize: '0.85rem', 
        lineHeight: 2, 
        transition: 'color 0.2s',
        '&:hover': { color: '#ffffff' }
      }}
    >
      {children}
    </Typography>
  </Link>
);

// Helper for Social Icons (Fixes style & aria-label errors)
function SocialIcon({ href, children, label }: { href?: string, children: React.ReactNode, label: string }) {
  const isLink = !!href;
  return (
      <Box
          component="a"
          href={href || '#'}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label} // ⚠️ Fixes "Links must have discernible text"
          sx={{
              color: isLink ? 'inherit' : 'rgba(255,255,255,0.2)',
              cursor: isLink ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              transition: 'color 0.2s',
              '&:hover': { color: isLink ? '#fff' : 'rgba(255,255,255,0.2)' } // ⚠️ Fixes "no inline styles"
          }}
      >
          {children}
      </Box>
  );
}

export default function FooterClient({ data, socials }: { data: any[], socials: any }) {
  const currentYear = new Date().getFullYear();

  return (
    // ⚠️ Fix: Use Box directly with sx to avoid "component" prop type error
    <Box 
      component="footer"
      sx={{ 
        bgcolor: '#111111', 
        color: '#f5f5f7', 
        pt: 8, 
        pb: 4, 
        mt: 'auto' 
      }}
    >
      <Container maxWidth="xl">
        
        {/* --- DESKTOP VIEW --- */}
        <Grid container spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
          {data.map((column, idx) => (
            <Grid item xs={3} key={column.title || idx}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  letterSpacing: '0.05em', 
                  textTransform: 'uppercase', 
                  color: '#86868b', 
                  mb: 2 
                }}
              >
                {column.title}
              </Typography>
              
              {column.links.map((link: any, i: number) => (
                <FooterLinkItem 
                  key={link.name || i} 
                  href={link.href}
                  color={link.color}
                >
                  {link.name}
                </FooterLinkItem>
              ))}
            </Grid>
          ))}
        </Grid>

        {/* --- MOBILE VIEW --- */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          {data.map((column, idx) => (
            <Accordion 
              key={column.title || idx} 
              disableGutters 
              elevation={0}
              sx={{ bgcolor: 'transparent', color: '#fff', borderBottom: '1px solid #333' }}
            >
              <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#fff' }} />}>
                <Typography variant="subtitle2" fontWeight={600}>{column.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {column.links.map((link: any, i: number) => (
                   <FooterLinkItem 
                     key={link.name || i} 
                     href={link.href} 
                     color={link.color}
                   >
                     {link.name}
                   </FooterLinkItem>
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
          <Typography variant="caption" sx={{ color: '#86868b' }}>
            © {currentYear} Woodsphere. All rights reserved.
          </Typography>
          
          <Stack direction="row" spacing={2} sx={{ color: '#86868b' }}>
             <Typography variant="caption" sx={{ border: '1px solid #333', px: 1, borderRadius: 1 }}>UPI</Typography>
             <Typography variant="caption" sx={{ border: '1px solid #333', px: 1, borderRadius: 1 }}>VISA</Typography>
             <Typography variant="caption" sx={{ border: '1px solid #333', px: 1, borderRadius: 1 }}>MASTERCARD</Typography>
          </Stack>

          {/* Socials using the new helper */}
          <Stack direction="row" spacing={1}>
            <SocialIcon href={socials?.instagram} label="Instagram"><Instagram fontSize="small" /></SocialIcon>
            <SocialIcon href={socials?.facebook} label="Facebook"><Facebook fontSize="small" /></SocialIcon>
            <SocialIcon href={socials?.twitter} label="Twitter"><Twitter fontSize="small" /></SocialIcon>
            <SocialIcon href={socials?.youtube} label="YouTube"><YouTube fontSize="small" /></SocialIcon>
          </Stack>
        </Stack>

      </Container>
    </Box>
  );
}