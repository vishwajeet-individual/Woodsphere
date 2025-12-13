import { prisma } from '@/lib/prisma';
import { Box, Container, Typography, Breadcrumbs, Divider } from '@mui/material';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ContentPageLayout({ slug }: { slug: string }) {
  // 1. Fetch Content
  const page = await prisma.contentPage.findUnique({
    where: { slug }
  });

  if (!page) notFound();

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '80vh', py: 6 }}>
      <Container maxWidth="md">
        
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 4, fontSize: '0.9rem' }}>
          <Link href="/" style={{ color: '#86868b', textDecoration: 'none' }}>Home</Link>
          <Typography color="text.secondary" textTransform="capitalize">
            {page.category.toLowerCase()}
          </Typography>
          <Typography color="text.primary" fontWeight={500}>{page.title}</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Typography variant="h3" fontWeight={800} gutterBottom sx={{ letterSpacing: '-1px' }}>
          {page.title}
        </Typography>
        <Divider sx={{ mb: 6, borderColor: '#f0f0f0' }} />

        {/* Content Body (Render HTML) */}
        <Box 
          sx={{ 
            '& h2': { fontSize: '1.75rem', fontWeight: 700, mt: 4, mb: 2, color: '#1d1d1f' },
            '& h3': { fontSize: '1.25rem', fontWeight: 600, mt: 3, mb: 1.5, color: '#1d1d1f' },
            '& p': { fontSize: '1.05rem', lineHeight: 1.7, mb: 2, color: '#424245' },
            '& ul': { mb: 3, pl: 3 },
            '& li': { mb: 1, color: '#424245' },
            '& strong': { fontWeight: 600, color: '#1d1d1f' }
          }}
          dangerouslySetInnerHTML={{ __html: page.content }} 
        />

        <Box sx={{ mt: 8, p: 3, bgcolor: '#f5f5f7', borderRadius: 4, textAlign: 'center' }}>
           <Typography variant="body2" color="text.secondary">
              Need more help? <Link href="/help-support/contact-us" style={{ color: '#0071e3', fontWeight: 600, textDecoration: 'none' }}>Contact Support</Link>
           </Typography>
        </Box>

      </Container>
    </Box>
  );
}