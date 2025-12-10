'use client';

import { Box, Typography, Rating, Avatar, Stack, TextField, Button, Divider, Alert } from '@mui/material';
import { useState, useTransition } from 'react';
import { addReviewAction } from '@/lib/actions/shop';
import { toast } from 'sonner';

interface ProductReviewsProps {
  productId: string;
  reviews: any[];
  canReview: boolean;   // <--- New Prop
  reviewStatus: string; // 'guest' | 'purchased' | 'reviewed' | 'not-purchased'
}

export default function ProductReviews({ productId, reviews, canReview, reviewStatus }: ProductReviewsProps) {
  const [rating, setRating] = useState<number | null>(5);
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!rating) return;
    startTransition(async () => {
      const res = await addReviewAction(productId, rating, comment);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Review added!");
        setComment('');
        // Refresh handled by server action revalidate
      }
    });
  };

  return (
    <Box mt={8}>
      <Typography variant="h5" fontWeight={700} gutterBottom>Customer Reviews</Typography>
      
      {/* 1. Review List */}
      <Stack spacing={3} mb={6} divider={<Divider />}>
        {reviews.length === 0 ? (
            <Typography color="text.secondary">No reviews yet. Be the first!</Typography>
        ) : (
            reviews.map((review) => (
                <Box key={review.id}>
                    <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>{review.user.name?.[0]}</Avatar>
                        <Typography fontWeight={600} variant="body2">{review.user.name}</Typography>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary">
                            {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">{review.comment}</Typography>
                </Box>
            ))
        )}
      </Stack>

      {/* 2. Conditional Form Visibility */}
      {canReview ? (
        <Box sx={{ bgcolor: '#f9f9f9', p: 3, borderRadius: 3 }}>
          <Typography fontWeight={600} mb={2}>Write a Review</Typography>
          <Stack spacing={2}>
              <Box>
                  <Typography component="legend" variant="caption">Rating</Typography>
                  <Rating value={rating} onChange={(_, v) => setRating(v)} />
              </Box>
              <TextField 
                  placeholder="Share your thoughts..." 
                  multiline rows={3} 
                  fullWidth 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{ bgcolor: '#fff' }}
              />
              <Button 
                  variant="contained" 
                  onClick={handleSubmit} 
                  disabled={isPending}
                  sx={{ width: 'fit-content', borderRadius: 8 }}
              >
                  Submit Review
              </Button>
          </Stack>
        </Box>
      ) : (
        // Optional Message explaining why they can't review
        <Box mt={4}>
           {reviewStatus === 'reviewed' && (
             <Alert severity="success" variant="outlined">You have already reviewed this product.</Alert>
           )}
           {reviewStatus === 'not-purchased' && (
             <Alert severity="info" variant="outlined">Only verified purchasers can write reviews.</Alert>
           )}
           {/* If guest, show nothing or login prompt */}
        </Box>
      )}
    </Box>
  );
}