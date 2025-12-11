'use client';

import { useState, useEffect } from 'react';
import { Box, TextField, Card, Typography, Stack, Button } from '@mui/material';
import { Save, Image as ImageIcon } from '@mui/icons-material';
import { getSiteSettings, updateHomeSettings } from '@/lib/actions/settings';
import { toast } from 'sonner';
import ImageUpload from '@/components/ui/ImageUpload'; 

export default function HomeEditor() {
  const [loading, setLoading] = useState(false);
  const [hero, setHero] = useState<any>({});
  const [banner, setBanner] = useState<any>({});

  useEffect(() => {
    getSiteSettings().then((data) => {
        // @ts-ignore
        setHero(data.hero || {});
        // @ts-ignore
        setBanner(data.banner || {});
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const res = await updateHomeSettings(hero, banner);
    setLoading(false);
    if (res?.error) toast.error(res.error);
    else toast.success("Homepage updated!");
  };

  const updateHero = (key: string, val: string) => setHero({ ...hero, [key]: val });
  const updateBanner = (key: string, val: string) => setBanner({ ...banner, [key]: val });

  return (
    <Stack spacing={4} maxWidth="md">
      
      {/* 1. HERO SECTION */}
      <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Stack direction="row" alignItems="center" gap={1} mb={3}>
            <ImageIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>Hero Banner</Typography>
        </Stack>
        
        <Stack spacing={3}>
            <Box>
                <Typography variant="caption" fontWeight={600} mb={1} display="block">Background Image or Video Preview</Typography>
                <ImageUpload 
                    value={hero.imageUrl || ''} 
                    onChange={(url) => updateHero('imageUrl', url)}
                    onRemove={() => updateHero('imageUrl', '')}
                />
            </Box>
            
            <TextField 
                label="Main Heading" 
                value={hero.heading || ''} 
                onChange={(e) => updateHero('heading', e.target.value)} 
                multiline
                rows={2}
                fullWidth
            />
            <TextField 
                label="Sub-Heading" 
                value={hero.subHeading || ''} 
                onChange={(e) => updateHero('subHeading', e.target.value)} 
                multiline
                rows={2}
                fullWidth
            />
            <Stack direction="row" spacing={2}>
                <TextField 
                    label="Button Text" fullWidth 
                    value={hero.ctaText || ''} 
                    onChange={(e) => updateHero('ctaText', e.target.value)} 
                />
                <TextField 
                    label="Button Link" fullWidth 
                    value={hero.ctaLink || ''} 
                    onChange={(e) => updateHero('ctaLink', e.target.value)} 
                />
            </Stack>
        </Stack>
      </Card>

      {/* 2. PROMO BANNER SECTION */}
      <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>Promotional Strip</Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>The colored banner in the middle of the homepage.</Typography>
        
        <Stack spacing={3}>
            <TextField 
                label="Title" 
                value={banner.title || ''} 
                onChange={(e) => updateBanner('title', e.target.value)} 
                fullWidth
            />
            <TextField 
                label="Subtitle" 
                value={banner.subtitle || ''} 
                onChange={(e) => updateBanner('subtitle', e.target.value)} 
                fullWidth
            />
            <Stack direction="row" spacing={2}>
                <TextField 
                    label="Button Text" fullWidth 
                    value={banner.buttonText || ''} 
                    onChange={(e) => updateBanner('buttonText', e.target.value)} 
                />
                <TextField 
                    label="Button Link" fullWidth 
                    value={banner.link || ''} 
                    onChange={(e) => updateBanner('link', e.target.value)} 
                />
            </Stack>
        </Stack>
      </Card>

      {/* Save Action */}
      <Box sx={{ position: 'sticky', bottom: 20, zIndex: 10 }}>
        <Button 
            variant="contained" 
            size="large" 
            startIcon={<Save />} 
            onClick={handleSave} 
            disabled={loading}
            sx={{ borderRadius: 50, float: 'right', px: 4 }}
        >
           {loading ? "Publishing..." : "Publish Homepage"}
        </Button>
      </Box>

    </Stack>
  );
}