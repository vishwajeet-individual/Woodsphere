'use client';

import { Box, Button, Stack, Typography, IconButton } from '@mui/material';
import { Add, Remove, ShoppingBag } from '@mui/icons-material';
import { useState } from 'react';
import { useCart } from '@/context/CartContext'; // <--- Import Hook

export default function AddToCart({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart(); // <--- Use Hook

  const handleIncrement = () => {
    if (quantity < product.stock) setQuantity(q => q + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity); // <--- Use Real Logic
  };

  // ... Rest of the JSX remains the same
  return (
    // ... Copy existing JSX
    <Box sx={{ mt: 4 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
            Quantity:
        </Typography>
        <Stack direction="row" alignItems="center" sx={{ border: '1px solid #e5e5e5', borderRadius: 50, px: 1 }}>
            <IconButton size="small" onClick={handleDecrement} disabled={quantity <= 1}>
                <Remove fontSize="small" />
            </IconButton>
            <Typography variant="body2" fontWeight={600} sx={{ mx: 2, minWidth: '20px', textAlign: 'center' }}>
                {quantity}
            </Typography>
            <IconButton size="small" onClick={handleIncrement} disabled={quantity >= product.stock}>
                <Add fontSize="small" />
            </IconButton>
        </Stack>
      </Stack>

      <Button 
          variant="contained" 
          fullWidth 
          size="large"
          startIcon={<ShoppingBag />}
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          sx={{ py: 1.8, fontSize: '1rem', borderRadius: 50 }}
      >
          {product.stock > 0 ? 'Add to Bag' : 'Out of Stock'}
      </Button>
      
      {product.stock < 5 && product.stock > 0 && (
         <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block', fontWeight: 600 }}>
            Only {product.stock} items left!
         </Typography>
      )}
    </Box>
  );
}