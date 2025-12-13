'use client';

import { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Card, Typography, Stack, IconButton, MenuItem, 
  Grid, Switch, FormControlLabel, Accordion, AccordionSummary, AccordionDetails, 
  Divider, Autocomplete, Tooltip 
} from '@mui/material';
import { 
  Save, Add, Delete, ExpandMore, Image as ImageIcon, AutoAwesome, 
  Pages, Link as LinkIcon 
} from '@mui/icons-material';
import { getHeaderSettings, updateHeaderSettings } from '@/lib/actions/settings';
import { getAllContentPages } from '@/lib/actions/pages';
import { toast } from 'sonner';
import ImageUpload from '@/components/ui/ImageUpload';

// Available Icons
const ICONS = ['Weekend', 'Bed', 'TableBar', 'Chair', 'ChildCare', 'LocalFlorist', 'LocalOffer', 'MoreHoriz', 'Star', 'Home', 'Article'];

export default function HeaderEditor() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({ logoText: 'Woodsphere.', logoImage: '', navigation: [] });
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Database Pages for Smart Autocomplete
  const [dbPages, setDbPages] = useState<any[]>([]);

  useEffect(() => {
    // 1. Load Settings
    getHeaderSettings().then((fetched) => {
      if (fetched && Object.keys(fetched).length > 0) setData(fetched);
      setIsLoaded(true);
    });

    // 2. Load Pages for Dropdown
    getAllContentPages().then((pages) => setDbPages(pages));
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

  // Navigation CRUD
  const addMenuItem = () => {
    setData({
      ...data,
      navigation: [...(data.navigation || []), { label: 'New Menu', slug: '', icon: 'Weekend', subs: [], isSale: false }]
    });
  };

  const removeMenuItem = (idx: number) => {
    if (!confirm("Remove this menu item?")) return;
    const newNav = [...data.navigation];
    newNav.splice(idx, 1);
    setData({ ...data, navigation: newNav });
  };

  const updateMenuItem = (idx: number, field: string, val: any) => {
    const newNav = [...data.navigation];
    newNav[idx][field] = val;
    setData({ ...data, navigation: newNav });
  };

  // Sub-Menu CRUD
  const addSubItem = (parentIdx: number) => {
    const newNav = [...data.navigation];
    if (!newNav[parentIdx].subs) newNav[parentIdx].subs = [];
    newNav[parentIdx].subs.push({ label: '', slug: '' });
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

  // 🧠 SMART LINK SELECTOR (For Main Menu)
  const handleSmartSelectMain = (idx: number, page: any) => {
    const newNav = [...data.navigation];
    if (page) {
        newNav[idx].label = newNav[idx].label === 'New Menu' || !newNav[idx].label ? page.title : newNav[idx].label;
        newNav[idx].slug = page.slug; // Store slug
        newNav[idx].icon = 'Article'; // Default icon for pages
    }
    setData({ ...data, navigation: newNav });
  };

  // 🧠 SMART LINK SELECTOR (For Sub Menu)
  const handleSmartSelectSub = (parentIdx: number, subIdx: number, page: any) => {
    const newNav = [...data.navigation];
    if (page) {
        newNav[parentIdx].subs[subIdx].label = newNav[parentIdx].subs[subIdx].label || page.title;
        newNav[parentIdx].subs[subIdx].slug = page.slug;
    }
    setData({ ...data, navigation: newNav });
  };

  if (!isLoaded) return <Typography sx={{ p: 4 }}>Loading Header Settings...</Typography>;

  return (
    <Stack spacing={4} maxWidth="md">
      
      {/* 1. BRANDING */}
      <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>Branding</Typography>
        <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} alignItems="flex-start">
           <Box flex={1} width="100%">
              <Typography variant="caption" fontWeight={600} mb={1} display="block">Logo Image</Typography>
              <ImageUpload 
                  value={data.logoImage} 
                  onChange={(url) => updateField('logoImage', url)}
                  onRemove={() => updateField('logoImage', '')}
              />
           </Box>
           <Box flex={1} width="100%">
              <TextField 
                label="Logo Text" fullWidth
                value={data.logoText} 
                onChange={(e) => updateField('logoText', e.target.value)}
                helperText="Displayed if no image is provided"
              />
           </Box>
        </Stack>
      </Card>

      {/* 2. AUTO-GENERATED PREVIEW */}
      <Accordion sx={{ borderRadius: 4, border: '1px solid #e0e0e0', boxShadow: 'none', '&:before':{display:'none'} }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
           <Stack direction="row" spacing={1} alignItems="center">
              <AutoAwesome color="warning" fontSize="small" />
              <Typography fontWeight={700}>System Auto-Generated Menus</Typography>
           </Stack>
        </AccordionSummary>
        <AccordionDetails>
           <Typography variant="body2" color="text.secondary" mb={2}>
              These items are added to the <b>Main Menu</b> automatically because their Placement is set to "Header" in the Page Manager.
           </Typography>
           <Stack spacing={1} direction="row" flexWrap="wrap" gap={1}>
                {dbPages.filter(p => p.category === 'HEADER').map(p => (
                    <Box key={p.id} sx={{ px: 1.5, py: 0.5, bgcolor: '#f5f5f7', borderRadius: 2, border: '1px solid #ddd', fontSize: '0.85rem' }}>
                        {p.title}
                    </Box>
                ))}
                {dbPages.filter(p => p.category === 'HEADER').length === 0 && <Typography variant="caption" color="text.disabled">No auto-generated items found.</Typography>}
           </Stack>
        </AccordionDetails>
      </Accordion>

      <Divider />

      {/* 3. NAVIGATION MENU EDITOR */}
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
           <Box>
               <Typography variant="h6" fontWeight={700}>Navigation Menu</Typography>
               <Typography variant="body2" color="text.secondary">Customize the main navigation bar.</Typography>
           </Box>
           <Button startIcon={<Add />} onClick={addMenuItem} variant="outlined" sx={{ borderRadius: 50 }}>
              Add Item
           </Button>
        </Stack>

        <Stack spacing={2}>
           {data.navigation?.map((item: any, idx: number) => (
             <Accordion key={idx} sx={{ borderRadius: 3, '&:before': {display:'none'}, border: '1px solid #eee', boxShadow: 'none' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                   <Stack direction="row" alignItems="center" spacing={2} width="100%">
                      <Box display="flex" alignItems="center" gap={1}>
                          <Typography fontWeight={600}>{item.label || 'Untitled'}</Typography>
                          {item.slug && <Typography variant="caption" color="text.secondary">({item.slug})</Typography>}
                      </Box>
                      {item.isSale && <Typography variant="caption" sx={{ bgcolor: '#ffebee', color: '#d32f2f', px: 1, borderRadius: 1, fontWeight: 700 }}>SALE</Typography>}
                   </Stack>
                </AccordionSummary>
                
                <AccordionDetails>
                   <Grid container spacing={2} mb={3}>
                      <Grid item xs={12} md={6}>
                         <TextField label="Label" size="small" fullWidth value={item.label} onChange={(e) => updateMenuItem(idx, 'label', e.target.value)} />
                      </Grid>
                      
                      {/* SMART SLUG SELECTOR */}
                      <Grid item xs={12} md={6}>
                         <Autocomplete
                            freeSolo
                            options={dbPages}
                            getOptionLabel={(o) => typeof o === 'string' ? o : o.title}
                            inputValue={item.slug}
                            onInputChange={(_, v) => updateMenuItem(idx, 'slug', v)}
                            onChange={(_, v) => handleSmartSelectMain(idx, v)}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} label="Slug / Page" size="small" 
                                    helperText="Type a category slug OR select a page"
                                    InputProps={{ ...params.InputProps, startAdornment: <LinkIcon color="action" sx={{ mr: 1, opacity: 0.5 }} fontSize="small" /> }}
                                />
                            )}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    <Stack><Typography variant="body2">{option.title}</Typography><Typography variant="caption" color="text.secondary">Page Slug: {option.slug}</Typography></Stack>
                                </li>
                            )}
                         />
                      </Grid>

                      <Grid item xs={6}>
                         <TextField select label="Icon" size="small" fullWidth value={item.icon} onChange={(e) => updateMenuItem(idx, 'icon', e.target.value)}>
                            {ICONS.map((i) => <MenuItem key={i} value={i} sx={{ display: 'flex', gap: 1 }}>{i}</MenuItem>)}
                         </TextField>
                      </Grid>
                      <Grid item xs={6} display="flex" alignItems="center">
                         <FormControlLabel 
                            control={<Switch checked={item.isSale || false} onChange={(e) => updateMenuItem(idx, 'isSale', e.target.checked)} />} 
                            label="Highlight as Sale?" 
                         />
                      </Grid>
                   </Grid>
                   
                   <Divider sx={{ mb: 2 }} />
                   
                   {/* SUB MENUS */}
                   <Typography variant="subtitle2" fontWeight={700} mb={2} color="text.secondary">SUB-MENUS</Typography>
                   <Stack spacing={2} pl={2} borderLeft="2px solid #f0f0f0">
                      {item.subs?.map((sub: any, subIdx: number) => (
                         <Grid container spacing={2} key={subIdx} alignItems="center">
                            <Grid item xs={4}>
                                <TextField size="small" label="Label" fullWidth value={sub.label} onChange={(e) => updateSubItem(idx, subIdx, 'label', e.target.value)} />
                            </Grid>
                            
                            {/* SMART SUB-ITEM SELECTOR */}
                            <Grid item xs={7}>
                                <Autocomplete
                                    freeSolo
                                    options={dbPages}
                                    getOptionLabel={(o) => typeof o === 'string' ? o : o.title}
                                    inputValue={sub.slug}
                                    onInputChange={(_, v) => updateSubItem(idx, subIdx, 'slug', v)}
                                    onChange={(_, v) => handleSmartSelectSub(idx, subIdx, v)}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Slug / Page" size="small" fullWidth placeholder="Category slug or Page" />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            <Stack><Typography variant="body2">{option.title}</Typography><Typography variant="caption" color="text.secondary">{option.slug}</Typography></Stack>
                                        </li>
                                    )}
                                />
                            </Grid>

                            <Grid item xs={1}>
                                <IconButton size="small" color="error" onClick={() => removeSubItem(idx, subIdx)}><Delete fontSize="small" /></IconButton>
                            </Grid>
                         </Grid>
                      ))}
                      <Button startIcon={<Add />} size="small" onClick={() => addSubItem(idx)} sx={{ width: 'fit-content' }}>Add Sub-Item</Button>
                   </Stack>
                   
                   <Box mt={2} display="flex" justifyContent="flex-end">
                      <Button color="error" size="small" startIcon={<Delete />} onClick={() => removeMenuItem(idx)}>Remove Section</Button>
                   </Box>
                </AccordionDetails>
             </Accordion>
           ))}
        </Stack>
      </Box>

      {/* Save Action */}
      <Box sx={{ position: 'sticky', bottom: 20, zIndex: 10, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
            variant="contained" 
            size="large" 
            startIcon={<Save />} 
            onClick={handleSave} 
            disabled={loading}
            sx={{ borderRadius: 50, px: 4 }}
        >
           {loading ? "Saving..." : "Publish Header"}
        </Button>
      </Box>

    </Stack>
  );
}