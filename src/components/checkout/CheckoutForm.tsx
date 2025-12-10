'use client';

import { Box, Button, Card, Radio, Typography, Stack, TextField, Modal, IconButton, Divider } from '@mui/material';
import Grid from '@mui/material/Grid2'; 
import { useState, useTransition } from 'react';
import { addAddressAction, placeOrderAction } from '@/lib/actions/checkout';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Close, Add, EditNote } from '@mui/icons-material';
import Script from 'next/script';

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
  
  // ⚠️ NEW: Note State
  const [note, setNote] = useState('');

  const handleAddAddress = async (formData: FormData) => {
    const res = await addAddressAction(formData);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Address saved");
      setIsModalOpen(false);
      router.refresh(); 
    }
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: cartTotal }),
        });
        
        const order = await response.json();
        
        if (order.error) {
          toast.error("Payment initialization failed");
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
          amount: order.amount, 
          currency: "INR",
          name: "Woodsphere",
          description: "Furniture Marketplace",
          order_id: order.id, 
          handler: async function (response: any) {
            const toastId = toast.loading("Verifying payment...");
            try {
              // ⚠️ Pass Note here
              const res = await placeOrderAction(selectedAddress, items, {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }, note);

              toast.dismiss(toastId);

              if (res?.error) {
                toast.error(res.error);
              } else if (res?.orderId) {
                toast.success("Payment Successful!");
                clearCart();
                router.push(`/orders/${res.orderId}`);
              }
            } catch (error) {
              toast.dismiss(toastId);
              toast.error("Verification failed");
            }
          },
          theme: { color: "#0071e3" },
        };

        // @ts-ignore
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } catch (e) {
         toast.error("Something went wrong");
      }
    });
  };

  const handlePlaceOrderCOD = () => {
    startTransition(async () => {
      // ⚠️ Pass Note here
      const res = await placeOrderAction(selectedAddress, items, undefined, note);
      if (res?.error) {
        toast.error(res.error);
      } else if (res?.orderId) {
        toast.success("Order placed successfully!");
        clearCart();
        router.push(`/orders/${res.orderId}`);
      }
    });
  };

  return (
    <Grid container spacing={8}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      {/* LEFT: Address Selection */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
           <Typography variant="h5" fontWeight={700}>Shipping Address</Typography>
           <Button startIcon={<Add />} onClick={() => setIsModalOpen(true)}>Add New</Button>
        </Stack>

        {addresses.length === 0 ? (
          <Typography color="text.secondary">No addresses found. Please add one to continue.</Typography>
        ) : (
          <Stack spacing={2}>
            {addresses.map((addr) => (
              <Card 
                key={addr.id} 
                variant="outlined"
                sx={{ 
                  p: 2, 
                  borderColor: selectedAddress === addr.id ? 'primary.main' : 'rgba(0,0,0,0.12)',
                  borderWidth: selectedAddress === addr.id ? 2 : 1,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: selectedAddress === addr.id ? 'rgba(0,113,227,0.04)' : 'transparent',
                  borderRadius: 2
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

        {/* ⚠️ NEW: Note to Maker Section */}
        <Box mt={6}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <EditNote color="action" />
                <Typography variant="h6" fontWeight={700}>Note to the Maker</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={2}>
               Share a personal message with the artisan who crafted your items (e.g. specialized delivery instructions or a thank you note).
            </Typography>
            <TextField 
               placeholder="e.g. I can't wait to place this in my new study!"
               fullWidth
               multiline
               rows={3}
               value={note}
               onChange={(e) => setNote(e.target.value)}
               sx={{ 
                   bgcolor: '#fff',
                   '& .MuiOutlinedInput-root': { borderRadius: 3 }
               }}
            />
        </Box>
      </Grid>

      {/* RIGHT: Summary */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Card variant="outlined" sx={{ p: 3, position: 'sticky', top: 100, borderRadius: 3, bgcolor: '#f5f5f7', border: 'none' }}>
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

          <Stack spacing={2}>
            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              disabled={!selectedAddress || items.length === 0}
              onClick={handlePayment} 
              sx={{ borderRadius: 2, py: 1.5 }}
            >
              Pay Online (Razorpay)
            </Button>
            
            <Button 
              variant="outlined" 
              fullWidth 
              size="large"
              disabled={!selectedAddress || items.length === 0 || isPending}
              onClick={handlePlaceOrderCOD} 
              sx={{ borderRadius: 2, py: 1.5 }}
            >
              Cash on Delivery
            </Button>
          </Stack>
        </Card>
      </Grid>

      {/* Add Address Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={{ 
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
          width: { xs: '90%', sm: 400 }, bgcolor: 'background.paper', p: 4, borderRadius: 4, boxShadow: 24 
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
                 <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 2, borderRadius: 2 }}>
                   Save Address
                 </Button>
              </Stack>
           </form>
        </Box>
      </Modal>

    </Grid>
  );
}