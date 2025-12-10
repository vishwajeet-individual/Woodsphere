'use client';

import { Box, Button, Stack, Typography, IconButton } from '@mui/material';
import { Add, Remove, Home, FlashOn } from '@mui/icons-material';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function AddToCart({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleIncrement = () => {
    if (quantity < product.stock) setQuantity(q => q + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleReserve = () => {
    addToCart(product, quantity);
    toast.success(`Reserved ${product.name} for your home`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout'); 
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <Box sx={{ mt: 4 }}>
      
      {/* Quantity & Stock Status */}
      <Stack direction="row" alignItems="center" spacing={3} mb={3}>
        <Stack direction="row" alignItems="center" sx={{ border: '1px solid #ddd', borderRadius: 2 }}>
            <IconButton onClick={handleDecrement} disabled={quantity <= 1 || isOutOfStock} size="small">
                <Remove fontSize="small" />
            </IconButton>
            <Typography variant="body1" fontWeight={600} sx={{ px: 2, minWidth: 40, textAlign: 'center' }}>
                {quantity}
            </Typography>
            <IconButton onClick={handleIncrement} disabled={quantity >= product.stock || isOutOfStock} size="small">
                <Add fontSize="small" />
            </IconButton>
        </Stack>

        <Typography variant="body2" color={isOutOfStock ? "error" : "success.main"} fontWeight={600}>
           {isOutOfStock ? "Out of Stock" : (product.stock < 5 ? `Only ${product.stock} left!` : "In Stock")}
        </Typography>
      </Stack>

      {/* Action Buttons (Full Width Stack) */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button 
              variant="contained" 
              fullWidth 
              size="large"
              startIcon={<Home />} 
              onClick={handleReserve}
              disabled={isOutOfStock}
              sx={{ 
                py: 1.8, 
                fontSize: '1rem', 
                borderRadius: 50, 
                textTransform: 'none',
                fontWeight: 700,
                bgcolor: '#1d1d1f',
                '&:hover': { bgcolor: '#000' }
              }} 
          >
              {isOutOfStock ? 'Notify Me' : 'Reserve'}
          </Button>

          <Button 
              variant="contained" 
              fullWidth 
              size="large"
              startIcon={<FlashOn />} 
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              sx={{ 
                py: 1.8, 
                fontSize: '1rem', 
                borderRadius: 50, 
                textTransform: 'none',
                fontWeight: 700,
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' }
              }} 
          >
              Buy Now
          </Button>
      </Stack>
      
    </Box>
  );
}