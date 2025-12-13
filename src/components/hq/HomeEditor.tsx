'use client';

import { useState, useEffect } from 'react';
import { Box, TextField, Card, Typography, Stack, Button, Grid, Chip, Divider, Skeleton, Alert } from '@mui/material';
import { Save, Image as ImageIcon, Category, AutoAwesome, Warning } from '@mui/icons-material';
import { getSiteSettings, updateHomeSettings, getHeaderSettings } from '@/lib/actions/settings';
import { toast } from 'sonner';
import ImageUpload from '@/components/ui/ImageUpload';

export default function HomeEditor() {
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Form State
  const [hero, setHero] = useState<any>({});
  const [banner, setBanner] = useState<any>({});
  
  // Category Grid State
  const [menuItems, setMenuItems] = useState<any[]>([]); 
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({}); 

  useEffect(() => {
    async function loadData() {
        try {
            const [siteData, headerData] = await Promise.all([
                getSiteSettings(),
                getHeaderSettings()
            ]);

            // 1. Populate Site Settings (Hero/Banner)
            // @ts-ignore
            setHero(siteData?.heroConfig || siteData?.hero || {});
            // @ts-ignore
            setBanner(siteData?.promoBannerConfig || siteData?.banner || {});
            
            // 2. Populate Category Images
            // @ts-ignore
            const savedImages = siteData?.categoryGridConfig || siteData?.categoryImages || {};
            setCategoryImages(savedImages);

            // 3. ⚠️ ROBUST NAVIGATION FETCHING
            // Checks multiple possible paths for navigation data
            // @ts-ignore
            const nav = headerData?.navigation || headerData?.headerConfig?.navigation || [];
            
            console.log("Loaded Navigation Items:", nav); // Debug log to browser console
            setMenuItems(nav);
            
            setIsLoaded(true);
        } catch (error) {
            console.error("Failed to load settings:", error);
            toast.error("Failed to load settings");
        }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const res = await updateHomeSettings(hero, banner, categoryImages);
    setLoading(false);
    
    if (res?.error) {
        toast.error(res.error);
    } else {
        toast.success("Homepage & Categories updated!");
    }
  };

  const updateHero = (key: string, val: string) => setHero({ ...hero, [key]: val });
  const updateBanner = (key: string, val: string) => setBanner({ ...banner, [key]: val });
  
  const updateCategoryImage = (slug: string, url: string) => {
      setCategoryImages(prev => ({ ...prev, [slug]: url }));
  };

  if (!isLoaded) return <Box p={4}><Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} /></Box>;

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
                <Typography variant="caption" fontWeight={600} mb={1} display="block">Background Image</Typography>
                <ImageUpload 
                    value={hero.imageUrl || ''} 
                    onChange={(url) => updateHero('imageUrl', url)}
                    onRemove={() => updateHero('imageUrl', '')}
                />
            </Box>
            <TextField label="Main Heading" value={hero.heading || ''} onChange={(e) => updateHero('heading', e.target.value)} multiline rows={2} fullWidth />
            <TextField label="Sub-Heading" value={hero.subHeading || ''} onChange={(e) => updateHero('subHeading', e.target.value)} multiline rows={2} fullWidth />
            <Stack direction="row" spacing={2}>
                <TextField label="Button Text" fullWidth value={hero.ctaText || ''} onChange={(e) => updateHero('ctaText', e.target.value)} />
                <TextField label="Button Link" fullWidth value={hero.ctaLink || ''} onChange={(e) => updateHero('ctaLink', e.target.value)} />
            </Stack>
        </Stack>
      </Card>

      {/* 2. CATEGORY GRID IMAGES */}
      <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
         <Stack direction="row" alignItems="center" gap={1} mb={1}>
            <Category color="secondary" />
            <Typography variant="h6" fontWeight={700}>Category Grid Images</Typography>
         </Stack>
         
         <Typography variant="body2" color="text.secondary" mb={4}>
            These items are pulled from your <b>Header Menu</b>. Upload an image for each to show them on the Homepage.
         </Typography>

         {menuItems.length === 0 && (
             <Alert severity="warning" icon={<Warning />} sx={{ mb: 2 }}>
                 No menu items found! Go to the <b>Header</b> tab first and add links (e.g., Living Room, Bedroom).
             </Alert>
         )}

         <Grid container spacing={3}>
            {menuItems.map((item, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                    <Box p={2} border="1px solid #eee" borderRadius={3} bgcolor="#fafafa">
                        <Stack direction="row" justifyContent="space-between" mb={2} alignItems="center">
                            <Typography fontWeight={700}>{item.label}</Typography>
                            <Chip label={`/${item.slug}`} size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
                        </Stack>
                        
                        <Typography variant="caption" display="block" mb={1} fontWeight={600} color="text.secondary">
                            Cover Image
                        </Typography>
                        
                        <ImageUpload 
                            value={categoryImages[item.slug] || ''}
                            onChange={(url) => updateCategoryImage(item.slug, url)}
                            onRemove={() => updateCategoryImage(item.slug, '')}
                        />
                    </Box>
                </Grid>
            ))}
         </Grid>
      </Card>

      {/* 3. PROMO BANNER */}
      <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>Promotional Strip</Typography>
        <Stack spacing={3}>
            <TextField label="Title" value={banner.title || ''} onChange={(e) => updateBanner('title', e.target.value)} fullWidth />
            <TextField label="Subtitle" value={banner.subtitle || ''} onChange={(e) => updateBanner('subtitle', e.target.value)} fullWidth />
            <Stack direction="row" spacing={2}>
                <TextField label="Button Text" fullWidth value={banner.buttonText || ''} onChange={(e) => updateBanner('buttonText', e.target.value)} />
                <TextField label="Button Link" fullWidth value={banner.link || ''} onChange={(e) => updateBanner('link', e.target.value)} />
            </Stack>
        </Stack>
      </Card>

      <Box sx={{ position: 'sticky', bottom: 20, zIndex: 10 }}>
        <Button 
            variant="contained" size="large" startIcon={<Save />} 
            onClick={handleSave} disabled={loading}
            sx={{ borderRadius: 50, float: 'right', px: 4, py: 1.5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
        >
           {loading ? "Publishing..." : "Publish Homepage"}
        </Button>
      </Box>

    </Stack>
  );
}