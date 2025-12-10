'use client';

import { 
  Box, Button, TextField, Typography, Card, Stack, InputAdornment, 
  Fade, Grow, Avatar, Chip, Tooltip, IconButton, InputBase // <--- Import InputBase
} from '@mui/material';
import { 
  Storefront, ArrowForward, CheckCircle, 
  Language, InfoOutlined, ArrowBack 
} from '@mui/icons-material';
import { registerStoreAction } from '@/lib/actions/vendor';
import { toast } from 'sonner';
import { useState } from 'react';
import Link from 'next/link';

export default function SellForm() {
  // --- State ---
  const [step, setStep] = useState<0 | 1>(0); 
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugEdited, setIsSlugEdited] = useState(false);

  // --- Handlers ---
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    
    if (!isSlugEdited) {
      const generatedSlug = newName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
    setIsSlugEdited(true);
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    formData.set('slug', slug);
    
    const res = await registerStoreAction(formData);
    
    if (res?.error) {
      toast.error(res.error);
      setLoading(false);
    } else {
      toast.success("Store successfully created! Redirecting...");
    }
  };

  // --- STEP 0: CONFIRMATION ---
  const renderConfirmation = () => (
    <Grow in={step === 0} timeout={500}>
      <Box textAlign="center">
        <Avatar 
          sx={{ 
            width: 80, height: 80, 
            bgcolor: 'primary.main', 
            mx: 'auto', mb: 3,
            boxShadow: '0 10px 30px rgba(0,113,227,0.3)' 
          }}
        >
          <Storefront sx={{ fontSize: 40 }} />
        </Avatar>
        
        <Typography variant="h4" fontWeight={800} gutterBottom sx={{ letterSpacing: '-0.5px' }}>
          Launch your store.
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 5, maxWidth: 350, mx: 'auto', lineHeight: 1.6 }}>
          Upgrade your account to Seller status. You're one step away from reaching millions of customers.
        </Typography>

        <Stack spacing={2} sx={{ maxWidth: 400, mx: 'auto', mb: 5, textAlign: 'left', bgcolor: '#f9fafb', p: 3, borderRadius: 4 }}>
           {['Zero setup fees', 'Manage your own inventory', 'Access Seller Dashboard & Analytics'].map((text, i) => (
             <Box key={i} display="flex" gap={2} alignItems="center">
                <CheckCircle color="success" fontSize="small" />
                <Typography fontWeight={500} fontSize="0.95rem">{text}</Typography>
             </Box>
           ))}
        </Stack>

        <Stack spacing={2}>
          <Button 
            variant="contained" 
            size="large" 
            endIcon={<ArrowForward />}
            onClick={() => setStep(1)}
            sx={{ borderRadius: 8, py: 1.5, px: 6, fontSize: '1rem', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
          >
            Get Started
          </Button>
          <Button component={Link} href="/" sx={{ color: 'text.secondary', textTransform: 'none' }}>
            Not now, take me back
          </Button>
        </Stack>
      </Box>
    </Grow>
  );

  // --- STEP 1: FORM ---
  const renderForm = () => (
    <Fade in={step === 1}>
      <Box>
        <Box display="flex" alignItems="center" mb={4}>
           <IconButton onClick={() => setStep(0)} sx={{ mr: 1, border: '1px solid #eee' }}>
              <ArrowBack />
           </IconButton>
           <Box>
             <Typography variant="h6" fontWeight={700}>Store Details</Typography>
             <Typography variant="caption" color="text.secondary">Step 2 of 2</Typography>
           </Box>
        </Box>

        <form action={handleSubmit}>
          <Stack spacing={4}>
            
            <Box>
              <Typography fontWeight={600} mb={1}>Business Name</Typography>
              <TextField 
                name="name" 
                placeholder="e.g. Modern Woodworks" 
                fullWidth 
                required 
                value={name}
                onChange={handleNameChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#fbfbfd' } }}
              />
            </Box>

            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography fontWeight={600}>Store Link</Typography>
                <Tooltip title="This is the unique URL your customers will use to visit your shop.">
                  <InfoOutlined fontSize="small" sx={{ color: 'text.secondary', cursor: 'help' }} />
                </Tooltip>
              </Box>
              
              <Box 
                sx={{ 
                  display: 'flex', alignItems: 'center', 
                  border: '1px solid #c0c0c0', borderRadius: 3, 
                  overflow: 'hidden', bgcolor: '#fff',
                  transition: 'border-color 0.2s',
                  '&:focus-within': { borderColor: 'primary.main', boxShadow: '0 0 0 3px rgba(0,113,227,0.1)' }
                }}
              >
                <Box sx={{ bgcolor: '#f5f5f7', px: 2, py: 2, borderRight: '1px solid #eee', color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                   <Language fontSize="small" />
                   <Typography variant="body2" fontWeight={600} sx={{ display: { xs: 'none', sm: 'block' } }}>
                     woodsphere.com/store/
                   </Typography>
                   <Typography variant="body2" fontWeight={600} sx={{ display: { xs: 'block', sm: 'none' } }}>
                     /
                   </Typography>
                </Box>
                
                {/* ⚠️ FIX: Replaced <input> with MUI <InputBase> */}
                <InputBase
                   name="slug"
                   value={slug}
                   onChange={handleSlugChange}
                   placeholder="your-store-name"
                   fullWidth
                   sx={{ 
                     px: 2, 
                     fontWeight: 600, 
                     fontSize: '1rem',
                     color: '#333'
                   }}
                />

                {slug && (
                  <Chip 
                    label="Available" 
                    color="success" 
                    size="small" 
                    variant="outlined" 
                    sx={{ mr: 2, display: { xs: 'none', sm: 'flex' } }} 
                  />
                )}
              </Box>
            </Box>

            <Box>
              <Typography fontWeight={600} mb={1}>About</Typography>
              <TextField 
                name="description" 
                placeholder="Tell us what makes your furniture special..."
                multiline 
                rows={4} 
                fullWidth 
                required 
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#fbfbfd' } }}
              />
            </Box>
            
            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              disabled={loading || !name || !slug}
              sx={{ borderRadius: 8, py: 1.8, fontSize: '1.1rem', fontWeight: 600, boxShadow: '0 8px 25px rgba(0,113,227,0.25)' }}
            >
              {loading ? 'Creating Store...' : 'Launch Store'}
            </Button>
          </Stack>
        </form>
      </Box>
    </Fade>
  );

  return (
    <Card sx={{ p: { xs: 3, md: 6 }, borderRadius: 6, boxShadow: '0 20px 60px rgba(0,0,0,0.05)', maxWidth: 600, mx: 'auto', bgcolor: '#fff' }}>
      {step === 0 ? renderConfirmation() : renderForm()}
    </Card>
  );
}