'use client';

import { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Card, Typography, Stack, Grid, Divider, 
  Accordion, AccordionSummary, AccordionDetails, IconButton, Autocomplete, 
  Tooltip
} from '@mui/material';
import { 
  Save, Add, Delete, ExpandMore, Link as LinkIcon, AutoAwesome, 
  Pages 
} from '@mui/icons-material';
import { getFooterSettings, updateFooterSettings } from '@/lib/actions/settings';
import { getAllContentPages } from '@/lib/actions/pages';
import { toast } from 'sonner';

export default function FooterEditor() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({ 
    social: {}, columns: [] 
  });
  
  // DB Pages for Smart Autocomplete
  const [dbPages, setDbPages] = useState<any[]>([]);

  useEffect(() => {
    getFooterSettings().then((res: any) => setData({ social: res?.social || {}, columns: res?.columns || [] }));
    getAllContentPages().then((pages) => setDbPages(pages));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const res = await updateFooterSettings(data);
    setLoading(false);
    if (res.error) toast.error(res.error);
    else toast.success("Saved!");
  };

  // --- Handlers ---
  const updateSocial = (k: string, v: string) => setData({ ...data, social: { ...data.social, [k]: v } });

  // Column Ops
  const addColumn = () => setData({ ...data, columns: [...data.columns, { title: 'New Column', links: [] }] });
  const removeColumn = (i: number) => {
      const nc = [...data.columns]; nc.splice(i, 1); setData({ ...data, columns: nc });
  };
  const updateColTitle = (i: number, v: string) => {
      const nc = [...data.columns]; nc[i].title = v; setData({ ...data, columns: nc });
  };

  // Link Ops
  const addLink = (ci: number) => {
      const nc = [...data.columns]; nc[ci].links.push({ label: '', url: '' }); setData({ ...data, columns: nc });
  };
  const removeLink = (ci: number, li: number) => {
      const nc = [...data.columns]; nc[ci].links.splice(li, 1); setData({ ...data, columns: nc });
  };
  const updateLink = (ci: number, li: number, field: string, val: string) => {
      const nc = [...data.columns]; nc[ci].links[li][field] = val; setData({ ...data, columns: nc });
  };

  // 🧠 SMART LINK SELECTOR
  const handleSmartSelect = (ci: number, li: number, page: any) => {
      const nc = [...data.columns];
      if (page) {
          // Auto-fill Title and URL
          nc[ci].links[li].label = nc[ci].links[li].label || page.title;
          nc[ci].links[li].url = `/pages/${page.slug}`;
      }
      setData({ ...data, columns: nc });
  };

  return (
    <Stack spacing={4}>
      
      {/* 1. SOCIALS */}
      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>Social Media</Typography>
        <Grid container spacing={2}>
            {['facebook', 'instagram', 'twitter', 'youtube'].map((p) => (
                <Grid item xs={12} md={6} key={p}>
                    <TextField 
                        label={p.charAt(0).toUpperCase() + p.slice(1)} fullWidth size="small"
                        value={data.social?.[p] || ''} onChange={(e) => updateSocial(p, e.target.value)}
                    />
                </Grid>
            ))}
        </Grid>
      </Card>

      {/* 2. AUTO-GENERATED PREVIEW */}
      <Accordion sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid #eee', '&:before':{display:'none'} }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
           <Stack direction="row" spacing={1} alignItems="center">
              <AutoAwesome color="warning" fontSize="small" />
              <Typography fontWeight={700}>System Auto-Generated Columns</Typography>
           </Stack>
        </AccordionSummary>
        <AccordionDetails>
           <Typography variant="body2" color="text.secondary" mb={2}>
              These columns are managed automatically via the <b>Page Content</b> tab placements.
           </Typography>
           <Grid container spacing={2}>
              {['FOOTER_HELP', 'FOOTER_COMPANY', 'FOOTER_LEGAL'].map(cat => (
                 <Grid item xs={4} key={cat}>
                    <Typography variant="caption" fontWeight={700}>{cat.replace('FOOTER_', '')}</Typography>
                    <Stack mt={1} spacing={0.5}>
                       {dbPages.filter(p => p.category === cat || p.category === cat.replace('FOOTER_', '')).map(p => (
                          <Typography key={p.id} variant="body2">• {p.title}</Typography>
                       ))}
                    </Stack>
                 </Grid>
              ))}
           </Grid>
        </AccordionDetails>
      </Accordion>

      <Divider />

      {/* 3. MANUAL COLUMNS */}
      <Box>
         <Stack direction="row" justifyContent="space-between" mb={2}>
             <Typography variant="h6" fontWeight={700}>Custom Columns</Typography>
             <Button variant="outlined" startIcon={<Add />} onClick={addColumn}>Add Column</Button>
         </Stack>

         <Stack spacing={3}>
            {data.columns.map((col: any, ci: number) => (
                <Card key={ci} sx={{ p: 3, borderRadius: 3, border: '1px solid #eee', boxShadow: 'none' }}>
                    <Stack direction="row" justifyContent="space-between" mb={2}>
                        <TextField 
                            label="Column Title" size="small" sx={{ fontWeight: 700 }}
                            value={col.title} onChange={(e) => updateColTitle(ci, e.target.value)}
                        />
                        <IconButton color="error" onClick={() => removeColumn(ci)}><Delete /></IconButton>
                    </Stack>

                    <Stack spacing={2}>
                        {col.links.map((link: any, li: number) => (
                            <Grid container spacing={2} key={li} alignItems="center">
                                <Grid item xs={4}>
                                    <TextField 
                                        label="Label" size="small" fullWidth
                                        value={link.label} onChange={(e) => updateLink(ci, li, 'label', e.target.value)}
                                    />
                                </Grid>
                                {/* SMART AUTOCOMPLETE URL */}
                                <Grid item xs={7}>
                                    <Autocomplete
                                        freeSolo
                                        options={dbPages}
                                        getOptionLabel={(o) => typeof o === 'string' ? o : o.title}
                                        inputValue={link.url}
                                        onInputChange={(_, v) => updateLink(ci, li, 'url', v)}
                                        onChange={(_, v) => handleSmartSelect(ci, li, v)}
                                        renderInput={(params) => (
                                            <TextField 
                                                {...params} label="URL / Select Page" size="small" 
                                                InputProps={{ ...params.InputProps, startAdornment: <Pages color="action" sx={{ mr: 1, opacity: 0.5 }} fontSize="small" /> }}
                                            />
                                        )}
                                        renderOption={(props, option) => (
                                            <li {...props} key={option.id}>
                                                <Stack><Typography variant="body2">{option.title}</Typography><Typography variant="caption" color="text.secondary">/pages/{option.slug}</Typography></Stack>
                                            </li>
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <IconButton size="small" onClick={() => removeLink(ci, li)}><Delete fontSize="small" /></IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button startIcon={<Add />} onClick={() => addLink(ci)} size="small" sx={{ width: 'fit-content' }}>Add Link</Button>
                    </Stack>
                </Card>
            ))}
         </Stack>
      </Box>

      <Box sx={{ position: 'sticky', bottom: 20, zIndex: 10, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" size="large" startIcon={<Save />} onClick={handleSave} disabled={loading} sx={{ borderRadius: 50, px: 4 }}>
           {loading ? "Saving..." : "Save Settings"}
        </Button>
      </Box>

    </Stack>
  );
}