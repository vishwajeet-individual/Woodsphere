'use client';

import { useCart } from '@/context/CartContext';
import { Box, Container, Typography, IconButton, Button, Divider, Stack, Breadcrumbs, TextField, InputAdornment } from '@mui/material';
import Grid from '@mui/material/Grid'; // Classic Grid for stability
import { Add, Remove, DeleteOutline, ArrowBack, LocalOffer, Lock, ShoppingBag } from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import LinkButton from '@/components/ui/LinkButton';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();

  // --- VIEW 1: EMPTY STATE (Robust UX) ---
  if (items.length === 0) {
    return (
      <Box sx={{ bgcolor: '#f5f5f7', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Box 
            sx={{ 
                width: 100, height: 100, borderRadius: '50%', 
                bgcolor: '#fff', display: 'inline-flex', 
                alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)', mb: 4
            }}
          >
            <ShoppingBag sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
          </Box>
          <Typography variant="h4" fontWeight={800} gutterBottom letterSpacing="-0.02em">
            Your bag is empty.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 5, maxWidth: 400, mx: 'auto' }}>
            Looks like you haven't found the perfect piece yet. Explore our collection to find something you love.
          </Typography>
          <LinkButton href="/search" variant="contained" size="large" sx={{ px: 6, py: 1.5, borderRadius: 8 }}>
            Start Shopping
          </LinkButton>
        </Container>
      </Box>
    );
  }

  // --- VIEW 2: CART WITH ITEMS ---
  return (
    <Box sx={{ bgcolor: '#f5f5f7', minHeight: '100vh', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="xl">
        
        {/* Header Navigation */}
        <Stack direction="row" alignItems="center" spacing={1} mb={4}>
           <Link href="/" style={{ textDecoration: 'none', color: '#86868b', display: 'flex', alignItems: 'center' }}>
              <ArrowBack sx={{ fontSize: 18, mr: 0.5 }} /> Continue Shopping
           </Link>
        </Stack>

        <Typography variant="h3" fontWeight={800} sx={{ mb: 4, letterSpacing: '-0.02em' }}>
          Shopping Bag <Typography component="span" variant="h4" color="text.secondary" fontWeight={500}>({items.length} items)</Typography>
        </Typography>

        <Grid container spacing={4}>
          
          {/* LEFT: Cart Items List */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={2}>
              {items.map((item) => (
                <Box 
                    key={item.id} 
                    sx={{ 
                        bgcolor: '#fff', 
                        p: { xs: 2, sm: 3 }, 
                        borderRadius: 4,
                        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}
                >
                  <Grid container spacing={2} alignItems="center">
                    
                    {/* 1. Image Thumbnail */}
                    <Grid item xs={4} sm={2}>
                      <Box sx={{ position: 'relative', aspectRatio: '1', bgcolor: '#f9f9f9', borderRadius: 3, overflow: 'hidden' }}>
                        <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                      </Box>
                    </Grid>

                    {/* 2. Product Info */}
                    <Grid item xs={8} sm={5}>
                      <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2, mb: 0.5 }}>
                         {item.name}
                      </Typography>
                      <Typography variant="body2" color="success.main" fontWeight={600} sx={{ mb: 1, fontSize: '0.8rem' }}>
                         In Stock
                      </Typography>
                      
                      {/* Mobile Actions (Visible only on XS) */}
                      <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                         <Stack direction="row" alignItems="center" sx={{ border: '1px solid #e0e0e0', borderRadius: 8 }}>
                             <IconButton size="small" onClick={() => updateQuantity(item.id, -1)}><Remove fontSize="small" /></IconButton>
                             <Typography variant="body2" fontWeight={600} sx={{ px: 1 }}>{item.quantity}</Typography>
                             <IconButton size="small" onClick={() => updateQuantity(item.id, 1)}><Add fontSize="small" /></IconButton>
                         </Stack>
                         <IconButton size="small" color="error" onClick={() => removeFromCart(item.id)}>
                            <DeleteOutline />
                         </IconButton>
                      </Box>
                    </Grid>

                    {/* 3. Quantity (Desktop) */}
                    <Grid item xs={12} sm={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Stack direction="row" alignItems="center" sx={{ border: '1px solid #e0e0e0', borderRadius: 8, width: 'fit-content' }}>
                            <IconButton onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1}>
                                <Remove fontSize="small" />
                            </IconButton>
                            <Typography fontWeight={600} sx={{ px: 1.5 }}>{item.quantity}</Typography>
                            <IconButton onClick={() => updateQuantity(item.id, 1)} disabled={item.quantity >= item.maxStock}>
                                <Add fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Grid>

                    {/* 4. Price & Remove (Desktop) */}
                    <Grid item xs={12} sm={2} sx={{ textAlign: { xs: 'left', sm: 'right' }, mt: { xs: 2, sm: 0 } }}>
                       <Typography variant="h6" fontWeight={800}>
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                       </Typography>
                       <Button 
                         color="error" 
                         size="small" 
                         startIcon={<DeleteOutline />}
                         onClick={() => removeFromCart(item.id)} 
                         sx={{ display: { xs: 'none', sm: 'inline-flex' }, mt: 1, textTransform: 'none', opacity: 0.7, '&:hover': { opacity: 1 } }}
                       >
                         Remove
                       </Button>
                    </Grid>

                  </Grid>
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* RIGHT: Order Summary */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ position: 'sticky', top: 100 }}>
                <Box sx={{ bgcolor: '#fff', p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>Summary</Typography>
                
                <Stack spacing={2} sx={{ my: 3 }}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">Subtotal</Typography>
                        <Typography fontWeight={600}>₹{cartTotal.toLocaleString('en-IN')}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">Shipping</Typography>
                        <Typography fontWeight={600} color="success.main">Free</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">Tax (Included)</Typography>
                        <Typography fontWeight={600}>₹{(cartTotal * 0.18).toLocaleString('en-IN')}</Typography>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 3 }} />

                {/* Promo Code Input (Visual) */}
                <Box mb={3}>
                    <TextField 
                        placeholder="Promo Code" 
                        size="small" 
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button size="small" disabled sx={{ borderRadius: 20 }}>Apply</Button>
                                </InputAdornment>
                            ),
                            startAdornment: (
                                <InputAdornment position="start"><LocalOffer fontSize="small" sx={{ color: '#ccc' }} /></InputAdornment>
                            )
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f9f9f9' } }}
                    />
                </Box>
                
                <Stack direction="row" justifyContent="space-between" mb={4} alignItems="flex-end">
                    <Typography variant="body1" fontWeight={600}>Total</Typography>
                    <Typography variant="h4" fontWeight={800} color="primary.main">₹{cartTotal.toLocaleString('en-IN')}</Typography>
                </Stack>

                <LinkButton 
                    href="/checkout" 
                    variant="contained" 
                    fullWidth 
                    size="large"
                    sx={{ py: 2, borderRadius: 8, fontSize: '1.1rem', fontWeight: 700, mb: 2 }}
                >
                    Proceed to Checkout
                </LinkButton>

                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} color="text.secondary">
                    <Lock fontSize="small" sx={{ fontSize: 16 }} />
                    <Typography variant="caption" fontWeight={500}>Secure Checkout powered by Razorpay</Typography>
                </Stack>
                </Box>
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}