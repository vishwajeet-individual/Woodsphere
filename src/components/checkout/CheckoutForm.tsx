'use client';

import { Box, Button, Card, Radio, Typography, Stack, TextField, Modal, IconButton, Divider } from '@mui/material';
import Grid from '@mui/material/Grid'; // Classic Grid
import { useState, useTransition } from 'react';
import { addAddressAction, placeOrderAction } from '@/lib/actions/checkout';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Close, Add, Home } from '@mui/icons-material';

type Address = {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
};

export default function CheckoutForm({ addresses }: { addresses: Address[] }) {
  const [selectedAddress, setSelectedAddress] = useState<string>(addresses[0]?.id || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();

  // Handle Add Address
  const handleAddAddress = async (formData: FormData) => {
    const res = await addAddressAction(formData);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Address saved");
      setIsModalOpen(false);
      // In a real app, we'd optimistically update UI, here revalidatePath handles it
    }
  };

  // Handle Order Placement
  const handlePlaceOrder = () => {
    startTransition(async () => {
      const res = await placeOrderAction(selectedAddress, items);
      
      if (res?.error) {
        toast.error(res.error);
        return;
      }

      if (res?.orderId) {
        toast.success("Order placed successfully!");
        clearCart();
        router.push(`/orders/${res.orderId}`); // Redirect to Order Details (We will build this next)
      }
    });
  };

  return (
    <Grid container spacing={8}>
      
      {/* LEFT: Address Selection */}
      <Grid item xs={12} md={8}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
           <Typography variant="h5" fontWeight={700}>Shipping Address</Typography>
           <Button startIcon={<Add />} onClick={() => setIsModalOpen(true)}>
             Add New
           </Button>
        </Stack>

        {addresses.length === 0 ? (
          <Typography color="text.secondary">No addresses found. Please add one.</Typography>
        ) : (
          <Stack spacing={2}>
            {addresses.map((addr) => (
              <Card 
                key={addr.id} 
                variant="outlined"
                sx={{ 
                  p: 2, 
                  borderColor: selectedAddress === addr.id ? 'primary.main' : 'divider',
                  borderWidth: selectedAddress === addr.id ? 2 : 1,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => setSelectedAddress(addr.id)}
              >
                <Radio checked={selectedAddress === addr.id} />
                <Box ml={2}>
                  <Typography fontWeight={600}>{addr.street}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {addr.city}, {addr.state} - {addr.zip}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Stack>
        )}
      </Grid>

      {/* RIGHT: Summary & Pay */}
      <Grid item xs={12} md={4}>
        <Card variant="outlined" sx={{ p: 3, position: 'sticky', top: 100, borderRadius: 4, bgcolor: '#f5f5f7', border: 'none' }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>Order Summary</Typography>
          
          <Stack spacing={2} sx={{ my: 3 }}>
             {items.map(item => (
                <Stack key={item.id} direction="row" justifyContent="space-between" fontSize="0.9rem">
                   <Typography noWrap sx={{ maxWidth: '60%' }}>{item.quantity} x {item.name}</Typography>
                   <Typography fontWeight={500}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</Typography>
                </Stack>
             ))}
          </Stack>
          
          <Divider sx={{ my: 2 }} />
          
          <Stack direction="row" justifyContent="space-between" mb={4}>
            <Typography variant="h6" fontWeight={700}>Total</Typography>
            <Typography variant="h6" fontWeight={700}>₹{cartTotal.toLocaleString('en-IN')}</Typography>
          </Stack>

          <Button 
            variant="contained" 
            fullWidth 
            size="large"
            disabled={!selectedAddress || items.length === 0 || isPending}
            onClick={handlePlaceOrder}
            sx={{ borderRadius: 50, py: 1.5 }}
          >
            {isPending ? 'Processing...' : 'Place Order (COD)'}
          </Button>
          <Typography variant="caption" display="block" align="center" mt={2} color="text.secondary">
             Note: Payment gateway simulation.
          </Typography>
        </Card>
      </Grid>

      {/* Add Address Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={{ 
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
          width: 400, bgcolor: 'background.paper', p: 4, borderRadius: 4, boxShadow: 24 
        }}>
           <Stack direction="row" justifyContent="space-between" mb={2}>
              <Typography variant="h6" fontWeight={700}>New Address</Typography>
              <IconButton onClick={() => setIsModalOpen(false)}><Close /></IconButton>
           </Stack>
           
           <form action={handleAddAddress}>
              <Stack spacing={2}>
                 <TextField name="street" label="Street Address" fullWidth required />
                 <Stack direction="row" spacing={2}>
                    <TextField name="city" label="City" fullWidth required />
                    <TextField name="zip" label="Zip Code" fullWidth required />
                 </Stack>
                 <TextField name="state" label="State" fullWidth required />
                 <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 2, borderRadius: 50 }}>
                   Save Address
                 </Button>
              </Stack>
           </form>
        </Box>
      </Modal>

    </Grid>
  );
}