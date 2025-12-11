'use client';

import { useState, useEffect } from 'react';
import { Box, Button, TextField, Card, Typography, Stack, IconButton, MenuItem, Grid, Switch, FormControlLabel, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import { Save, Add, Delete, ExpandMore, Image as ImageIcon } from '@mui/icons-material';
import { getHeaderSettings, updateHeaderSettings } from '@/lib/actions/settings';
import { toast } from 'sonner';
import ImageUpload from '@/components/ui/ImageUpload';

// Available Icons for Dropdown
const ICONS = ['Weekend', 'Bed', 'TableBar', 'Chair', 'ChildCare', 'LocalFlorist', 'LocalOffer', 'MoreHoriz', 'Star', 'Home'];

export default function HeaderEditor() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({ logoText: 'Woodsphere.', logoImage: '', navigation: [] });

  useEffect(() => {
    getHeaderSettings().then((fetched) => {
      if (fetched && Object.keys(fetched).length > 0) setData(fetched);
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const res = await updateHeaderSettings(data);
    setLoading(false);
    if (res.error) toast.error(res.error);
    else toast.success("Header updated!");
  };

  // --- Handlers ---
  const updateField = (field: string, val: string) => setData({ ...data, [field]: val });

  // Navigation Logic
  const addMenuItem = () => {
    setData({
      ...data,
      navigation: [...(data.navigation || []), { label: 'New Menu', slug: 'new', icon: 'Weekend', subs: [], isSale: false }]
    });
  };

  const removeMenuItem = (idx: number) => {
    const newNav = [...data.navigation];
    newNav.splice(idx, 1);
    setData({ ...data, navigation: newNav });
  };

  const updateMenuItem = (idx: number, field: string, val: any) => {
    const newNav = [...data.navigation];
    newNav[idx][field] = val;
    setData({ ...data, navigation: newNav });
  };

  // Sub-Menu Logic
  const addSubItem = (parentIdx: number) => {
    const newNav = [...data.navigation];
    if (!newNav[parentIdx].subs) newNav[parentIdx].subs = [];
    newNav[parentIdx].subs.push({ label: 'New Sub', slug: 'sub' });
    setData({ ...data, navigation: newNav });
  };

  const removeSubItem = (parentIdx: number, subIdx: number) => {
    const newNav = [...data.navigation];
    newNav[parentIdx].subs.splice(subIdx, 1);
    setData({ ...data, navigation: newNav });
  };

  const updateSubItem = (parentIdx: number, subIdx: number, field: string, val: string) => {
    const newNav = [...data.navigation];
    newNav[parentIdx].subs[subIdx][field] = val;
    setData({ ...data, navigation: newNav });
  };

  return (
    <Stack spacing={4} maxWidth="md">
      
      {/* 1. Branding */}
      <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>Branding</Typography>
        <Stack spacing={3}>
           <Box>
              <Typography variant="caption" fontWeight={600} mb={1} display="block">Logo Image (Optional)</Typography>
              <ImageUpload 
                  value={data.logoImage} 
                  onChange={(url) => updateField('logoImage', url)}
                  onRemove={() => updateField('logoImage', '')}
              />
           </Box>
           <TextField 
             label="Logo Text" 
             value={data.logoText} 
             onChange={(e) => updateField('logoText', e.target.value)}
             helperText="Displayed if no image is provided"
           />
        </Stack>
      </Card>

      {/* 2. Navigation Menu */}
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
           <Typography variant="h6" fontWeight={700}>Navigation Menu</Typography>
           <Button startIcon={<Add />} onClick={addMenuItem} variant="outlined" sx={{ borderRadius: 50 }}>
              Add Menu Item
           </Button>
        </Stack>

        <Stack spacing={2}>
           {data.navigation?.map((item: any, idx: number) => (
             <Accordion key={idx} sx={{ borderRadius: 3, '&:before': {display:'none'}, border: '1px solid #eee', boxShadow: 'none' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                   <Stack direction="row" alignItems="center" spacing={2} width="100%">
                      <Typography fontWeight={600}>{item.label || 'Untitled'}</Typography>
                      {item.isSale && <Typography variant="caption" color="error" fontWeight={700}>SALE ITEM</Typography>}
                   </Stack>
                </AccordionSummary>
                
                <AccordionDetails>
                   <Grid container spacing={2} mb={3}>
                      <Grid item xs={6}>
                         <TextField label="Label" size="small" fullWidth value={item.label} onChange={(e) => updateMenuItem(idx, 'label', e.target.value)} />
                      </Grid>
                      <Grid item xs={6}>
                         <TextField label="Slug" size="small" fullWidth value={item.slug} onChange={(e) => updateMenuItem(idx, 'slug', e.target.value)} />
                      </Grid>
                      <Grid item xs={6}>
                         <TextField select label="Icon" size="small" fullWidth value={item.icon} onChange={(e) => updateMenuItem(idx, 'icon', e.target.value)}>
                            {ICONS.map((i) => <MenuItem key={i} value={i}>{i}</MenuItem>)}
                         </TextField>
                      </Grid>
                      <Grid item xs={6} display="flex" alignItems="center">
                         <FormControlLabel 
                            control={<Switch checked={item.isSale || false} onChange={(e) => updateMenuItem(idx, 'isSale', e.target.checked)} />} 
                            label="Is Sale Item?" 
                         />
                      </Grid>
                   </Grid>
                   
                   <Divider sx={{ mb: 2 }} />
                   
                   <Typography variant="subtitle2" fontWeight={700} mb={2}>Sub-Menus</Typography>
                   <Stack spacing={1}>
                      {item.subs?.map((sub: any, subIdx: number) => (
                         <Stack key={subIdx} direction="row" spacing={2} alignItems="center">
                            <TextField size="small" label="Label" value={sub.label} onChange={(e) => updateSubItem(idx, subIdx, 'label', e.target.value)} />
                            <TextField size="small" label="Slug" fullWidth value={sub.slug} onChange={(e) => updateSubItem(idx, subIdx, 'slug', e.target.value)} />
                            <IconButton size="small" color="error" onClick={() => removeSubItem(idx, subIdx)}><Delete fontSize="small" /></IconButton>
                         </Stack>
                      ))}
                      <Button startIcon={<Add />} size="small" onClick={() => addSubItem(idx)} sx={{ width: 'fit-content' }}>Add Sub-Item</Button>
                   </Stack>
                   
                   <Box mt={2} display="flex" justifyContent="flex-end">
                      <Button color="error" startIcon={<Delete />} onClick={() => removeMenuItem(idx)}>Remove Menu</Button>
                   </Box>
                </AccordionDetails>
             </Accordion>
           ))}
        </Stack>
      </Box>

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
           {loading ? "Saving..." : "Publish Header"}
        </Button>
      </Box>

    </Stack>
  );
}