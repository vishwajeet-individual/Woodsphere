'use client';

import { useCart } from '@/context/CartContext';
import { Box, Container, Typography, IconButton, Button, Divider, Stack, Breadcrumbs } from '@mui/material';
import Grid from '@mui/material/Grid'; // Classic Grid
import { Add, Remove, DeleteOutline, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import LinkButton from '@/components/ui/LinkButton';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>Your bag is empty.</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Looks like you haven't added any furniture yet.
        </Typography>
        <LinkButton href="/search" variant="contained" size="large">
          Start Shopping
        </LinkButton>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="xl">
        <Breadcrumbs sx={{ mb: 4 }}>
          <Link href="/" style={{ color: '#86868b', textDecoration: 'none' }}>Home</Link>
          <Typography color="text.primary">Shopping Bag</Typography>
        </Breadcrumbs>

        <Typography variant="h3" fontWeight={700} sx={{ mb: 4 }}>
          Review your bag.
        </Typography>

        <Grid container spacing={8}>
          
          {/* LEFT: Cart Items */}
          <Grid item xs={12} md={8}>
            <Stack spacing={4}>
              {items.map((item) => (
                <Box key={item.id}>
                  <Grid container spacing={3}>
                    {/* Image */}
                    <Grid item xs={4} sm={3}>
                      <Box sx={{ position: 'relative', aspectRatio: '1', bgcolor: '#f5f5f7', borderRadius: 3, overflow: 'hidden' }}>
                        <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                      </Box>
                    </Grid>

                    {/* Details */}
                    <Grid item xs={8} sm={9}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', height: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>{item.name}</Typography>
                            <Typography variant="body2" color="text.secondary">In Stock</Typography>
                          </Box>
                          
                          {/* Quantity Controls */}
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                             <Typography variant="body2" fontWeight={600} sx={{ mr: 1 }}>Qty</Typography>
                             <IconButton 
                               size="small" 
                               onClick={() => updateQuantity(item.id, -1)}
                               sx={{ border: '1px solid #e5e5e5' }}
                             >
                                <Remove fontSize="small" />
                             </IconButton>
                             <Typography sx={{ minWidth: 20, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</Typography>
                             <IconButton 
                               size="small" 
                               onClick={() => updateQuantity(item.id, 1)}
                               sx={{ border: '1px solid #e5e5e5' }}
                             >
                                <Add fontSize="small" />
                             </IconButton>
                          </Stack>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                          <Typography variant="h6" fontWeight={600}>
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </Typography>
                          
                          <Button 
                            startIcon={<DeleteOutline />} 
                            color="error" 
                            size="small"
                            onClick={() => removeFromCart(item.id)}
                            sx={{ textTransform: 'none' }}
                          >
                            Remove
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                  <Divider sx={{ mt: 4 }} />
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* RIGHT: Summary */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 100, p: 4, bgcolor: '#f5f5f7', borderRadius: 4 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>Summary</Typography>
              
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography fontWeight={600}>₹{cartTotal.toLocaleString('en-IN')}</Typography>
              </Stack>
              
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography fontWeight={600} color="success.main">Free</Typography>
              </Stack>

              <Divider sx={{ my: 2 }} />
              
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight={700}>Total</Typography>
                <Typography variant="h6" fontWeight={700}>₹{cartTotal.toLocaleString('en-IN')}</Typography>
              </Stack>

              <LinkButton 
                href="/checkout" 
                variant="contained" 
                fullWidth 
                size="large"
                sx={{ py: 1.5, borderRadius: 50 }}
              >
                Checkout
              </LinkButton>
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}