import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Box, Container, Typography, Card, Stack, Rating, Button, Avatar, Divider } from '@mui/material';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { ArrowBack } from '@mui/icons-material';

export const dynamic = 'force-dynamic';

async function getUserReviews(userId: string) {
  return await prisma.review.findMany({
    where: { userId },
    include: {
      product: {
        select: { id: true, name: true, images: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export default async function MyReviewsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const reviews = await getUserReviews(session.user.id);

  return (
    <Box sx={{ bgcolor: '#f5f5f7', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="md">
        
        <Button startIcon={<ArrowBack />} component={Link} href="/profile" sx={{ mb: 2 }}>
           Back to Profile
        </Button>

        <Typography variant="h3" fontWeight={700} sx={{ mb: 4 }}>
          My Reviews
        </Typography>

        {reviews.length === 0 ? (
          <Box textAlign="center" py={10}>
             <Typography variant="h6" color="text.secondary">You haven't written any reviews yet.</Typography>
          </Box>
        ) : (
          <Stack spacing={3}>
            {reviews.map((review) => (
              <Card key={review.id} sx={{ p: 3, borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  
                  {/* Product Thumbnail */}
                  <Link href={`/product/${review.product.id}`} style={{ textDecoration: 'none' }}>
                    <Box sx={{ position: 'relative', width: 80, height: 80, borderRadius: 2, overflow: 'hidden', bgcolor: '#f0f0f0' }}>
                       {review.product.images[0] && (
                         <Image src={review.product.images[0]} alt={review.product.name} fill style={{ objectFit: 'cover' }} />
                       )}
                    </Box>
                  </Link>

                  {/* Review Details */}
                  <Box flexGrow={1}>
                     <Link href={`/product/${review.product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography fontWeight={700} sx={{ '&:hover': { color: 'primary.main' } }}>
                           {review.product.name}
                        </Typography>
                     </Link>
                     
                     <Stack direction="row" alignItems="center" spacing={1} my={1}>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary">
                           {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                     </Stack>
                     
                     <Typography variant="body2" color="text.secondary">
                        {review.comment}
                     </Typography>
                  </Box>

                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}