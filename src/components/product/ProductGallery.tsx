'use client';

import { useState } from 'react';
import { Box, Stack, IconButton, Tooltip } from '@mui/material';
import { FavoriteBorder, Favorite, Share, ContentCopy } from '@mui/icons-material';
import Image from 'next/image';
import { toast } from 'sonner';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // --- Handlers ---
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from Wishlist" : "Added to Wishlist");
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    const url = window.location.href;
    
    // Use Native Share if available (Mobile), else Copy Link (Desktop)
    if (navigator.share) {
      try {
        await navigator.share({ title: name, url });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <Stack spacing={2}>
      {/* Main Large Image */}
      <Box 
        sx={{ 
          position: 'relative', 
          width: '100%', 
          aspectRatio: '1 / 1', 
          bgcolor: '#f5f5f7', 
          borderRadius: 4, // ⚠️ Modern rounded corners
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        {/* ⚠️ NEW: Floating Action Buttons */}
        <Stack 
            spacing={1.5} 
            sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                zIndex: 10 
            }}
        >
            {/* Wishlist Button */}
            <Tooltip title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"} arrow placement="left">
                <IconButton 
                    onClick={handleWishlist}
                    sx={{ 
                        bgcolor: 'rgba(255,255,255,0.9)', 
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        width: 44, height: 44,
                        color: isWishlisted ? '#ff3b30' : 'text.primary',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': { bgcolor: '#fff', transform: 'scale(1.1)' }
                    }}
                >
                    {isWishlisted ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
            </Tooltip>

            {/* Share Button */}
            <Tooltip title="Share Product" arrow placement="left">
                <IconButton 
                    onClick={handleShare}
                    sx={{ 
                        bgcolor: 'rgba(255,255,255,0.9)', 
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        width: 44, height: 44,
                        color: 'text.primary',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': { bgcolor: '#fff', transform: 'scale(1.1)' }
                    }}
                >
                    <Share fontSize="small" />
                </IconButton>
            </Tooltip>
        </Stack>

        {/* The Image */}
        {selectedImage ? (
          <Image 
            src={selectedImage} 
            alt={name} 
            fill 
            style={{ objectFit: 'cover' }} 
            priority
          />
        ) : (
          <Box display="flex" alignItems="center" justifyContent="center" height="100%" color="text.secondary">
            No Image
          </Box>
        )}
      </Box>

      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1, '::-webkit-scrollbar': { display: 'none' } }}>
          {images.map((img, index) => (
            <Box
              key={index}
              onClick={() => setSelectedImage(img)}
              sx={{
                position: 'relative',
                width: 80,
                height: 80,
                borderRadius: 3, 
                overflow: 'hidden',
                cursor: 'pointer',
                border: selectedImage === img ? '2px solid #0071e3' : '2px solid transparent',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
            >
              <Image src={img} alt={`${name} ${index}`} fill style={{ objectFit: 'cover' }} />
            </Box>
          ))}
        </Stack>
      )}
    </Stack>
  );
}