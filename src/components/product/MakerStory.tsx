'use client';

import { Box, Typography, Avatar, Stack, Chip, Rating } from '@mui/material';
import { FormatQuote, LocationOn, VerifiedUser, ArrowForward } from '@mui/icons-material';
import Link from 'next/link';

interface MakerStoryProps {
  sellerName: string;
  storeSlug: string; // ⚠️ NEW: Needed for linking
  story?: string | null;
  origin?: string | null;
  rating: number;      // ⚠️ NEW
  reviewCount: number; // ⚠️ NEW
}

export default function MakerStory({ sellerName, storeSlug, story, origin, rating, reviewCount }: MakerStoryProps) {
  const content = story || `This piece is a testament to the craftsmanship of ${sellerName}. Designed with attention to detail and built to last.`;
  const location = origin || "India";

  return (
    <Box 
      sx={{ 
        bgcolor: '#f9fafb', 
        p: 3, 
        borderRadius: 3, 
        position: 'relative', 
        mt: 4, 
        mb: 4,
        border: '1px solid rgba(0,0,0,0.04)',
        transition: 'all 0.2s',
        '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }
      }}
    >
      {/* Quote Icon */}
      <Box 
        sx={{ 
          position: 'absolute', top: -16, left: 24, 
          bgcolor: 'primary.main', color: 'white', 
          borderRadius: '50%', p: 0.8,
          boxShadow: '0 4px 10px rgba(0,113,227,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
         <FormatQuote fontSize="small" />
      </Box>

      <Stack spacing={2}>
        <Typography 
            variant="body1" 
            sx={{ fontStyle: 'italic', pt: 1, lineHeight: 1.7, color: '#444', fontWeight: 500, fontSize: '0.95rem' }}
        >
          "{content}"
        </Typography>

        {/* ⚠️ CLICKABLE PROFILE SECTION */}
        <Link href={`/store/${storeSlug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={2} 
            sx={{ 
                pt: 2, 
                borderTop: '1px solid rgba(0,0,0,0.05)',
                cursor: 'pointer',
                '&:hover .maker-arrow': { opacity: 1, transform: 'translateX(5px)' }
            }}
          >
            <Avatar sx={{ bgcolor: 'secondary.main', width: 44, height: 44, fontSize: '1rem' }}>
              {sellerName[0]}
            </Avatar>
            
            <Box flexGrow={1}>
              {/* Row 1: Name + Rating */}
              <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2" fontWeight={700} fontSize="1rem">
                      {sellerName}
                  </Typography>
                  <VerifiedUser sx={{ fontSize: 14, color: 'primary.main' }} />
                  
                  {/* Rating Badge */}
                  {reviewCount > 0 && (
                      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ bgcolor: '#fff4e5', px: 0.8, borderRadius: 1 }}>
                        <Typography variant="caption" fontWeight={700} color="warning.dark" lineHeight={1}>
                            {rating.toFixed(1)}
                        </Typography>
                        <Rating value={1} max={1} readOnly size="small" sx={{ fontSize: '0.9rem' }} />
                        <Typography variant="caption" color="text.secondary">
                            ({reviewCount})
                        </Typography>
                      </Stack>
                  )}
              </Stack>

              {/* Row 2: Role + Location */}
              <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      Master Artisan
                  </Typography>
                  <Typography variant="caption" color="text.disabled">•</Typography>
                  <Chip 
                    icon={<LocationOn style={{ fontSize: 12 }} />} 
                    label={location} 
                    size="small" 
                    sx={{ 
                        bgcolor: 'white', 
                        border: '1px solid #e0e0e0', 
                        fontSize: '0.65rem', 
                        height: 20,
                        '& .MuiChip-label': { px: 1 } 
                    }} 
                  />
              </Stack>
            </Box>

            {/* Hover Arrow Hint */}
            <ArrowForward className="maker-arrow" sx={{ fontSize: 18, color: 'text.secondary', opacity: 0, transition: '0.2s' }} />
            
          </Stack>
        </Link>
      </Stack>
    </Box>
  );
}