'use client';

import { Box, Button, TextField, Typography, Card, Stack, InputAdornment } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import { registerStoreAction } from '@/lib/actions/vendor';
import { toast } from 'sonner';
import { useState } from 'react';

export default function SellForm() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugEdited, setIsSlugEdited] = useState(false);

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
      toast.success("Store Created! Redirecting...");
    }
  };

  return (
    <Card sx={{ p: 4, borderRadius: 5, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
      <Box mb={3} display="flex" alignItems="center" gap={1}>
         <AutoAwesome color="warning" />
         <Typography variant="h6" fontWeight={700}>Let's get started</Typography>
      </Box>

      <form action={handleSubmit}>
        <Stack spacing={3}>
          <TextField 
            name="name" 
            label="Business Name" 
            placeholder="e.g. Modern Woodworks" 
            fullWidth required 
            value={name}
            onChange={handleNameChange}
            InputLabelProps={{ shrink: true }}
          />

          <Box>
            <TextField 
              name="slug" 
              label="Your Web Address" 
              fullWidth required 
              value={slug}
              onChange={handleSlugChange}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: <InputAdornment position="start" sx={{ bgcolor: '#f5f5f7', px: 1, py: 2.5, mr: 0, borderRight: '1px solid #ddd', maxHeight: '100%' }}>woodsphere.com/store/</InputAdornment>,
              }}
              sx={{ '& .MuiOutlinedInput-input': { pl: 1 } }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', px: 1 }}>
               This is the link you will share with your customers.
            </Typography>
          </Box>

          <TextField 
            name="description" 
            label="About Your Business" 
            multiline rows={4} fullWidth required 
            InputLabelProps={{ shrink: true }}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            size="large" 
            disabled={loading || !name || !slug}
            sx={{ borderRadius: 8, py: 1.8, fontSize: '1rem', fontWeight: 600, mt: 1 }}
          >
            {loading ? 'Creating Store...' : 'Launch My Store'}
          </Button>
        </Stack>
      </form>
    </Card>
  );
}