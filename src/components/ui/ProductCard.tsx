'use client';

import { Box, Card, CardContent, Typography, IconButton, Chip } from '@mui/material';
import { AddShoppingCart, FavoriteBorder } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { styled } from '@mui/material/styles';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    subCategory?: { name: string };
    stock: number;
    isSale?: boolean;
  };
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  borderRadius: 16,
  boxShadow: 'none', // Cleaner look
  backgroundColor: 'transparent', // Let it blend
  transition: 'all 0.3s ease',
  '&:hover': {
    '& .MuiTypography-subtitle1': { color: theme.palette.primary.main }, // Highlight title on hover
    '& .image-wrapper': { transform: 'scale(1.02)' } // Zoom image only
  },
}));

const ImageWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
  aspectRatio: '1 / 1', // ⚠️ STRICT SQUARE
  backgroundColor: '#f5f5f7', // Grey background matching Categories
  borderRadius: 20, // Rounded corners on image
  overflow: 'hidden',
  marginBottom: '12px',
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
});

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <StyledCard elevation={0}>
      {/* 1. Image Area (Square) */}
      <Link href={`/product/${product.id}`}>
        <ImageWrapper className="image-wrapper">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          ) : (
             <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                No Image
             </Box>
          )}
          
          {product.isSale && (
            <Chip 
              label="SALE" 
              size="small" 
              sx={{ position: 'absolute', top: 12, left: 12, bgcolor: '#ff3b30', color: '#fff', fontWeight: 700, fontSize: '0.7rem' }} 
            />
          )}

          <IconButton
            sx={{
              position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.9)',
              '&:hover': { bgcolor: '#fff' }
            }}
            size="small"
          >
            <FavoriteBorder fontSize="small" />
          </IconButton>
        </ImageWrapper>
      </Link>

      {/* 2. Content Area */}
      <CardContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* SubCategory */}
        {product.subCategory && (
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 0.5, textTransform: 'uppercase', fontSize: '0.7rem' }}>
            {product.subCategory.name}
            </Typography>
        )}

        {/* Title - Fixed Height for alignment */}
        <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography 
            variant="subtitle1" 
            fontWeight={600} 
            sx={{ 
                lineHeight: 1.3,
                minHeight: '2.6em', // ⚠️ Force height for 2 lines
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
            }}
          >
            {product.name}
          </Typography>
        </Link>
        
        {/* Price & Cart */}
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body1" fontWeight={700}>
            ₹{product.price.toLocaleString('en-IN')}
          </Typography>
          
          <IconButton 
            color="primary" 
            size="small"
            sx={{ bgcolor: '#f5f5f7', '&:hover': { bgcolor: '#0071e3', color: '#fff' } }}
            disabled={product.stock <= 0}
          >
            <AddShoppingCart fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </StyledCard>
  );
}