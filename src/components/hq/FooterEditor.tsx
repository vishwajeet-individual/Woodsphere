'use client';

import { useState, useEffect } from 'react';
import { Box, Button, TextField, Card, Typography, Stack, IconButton, Grid } from '@mui/material';
import { Add, Delete, Save } from '@mui/icons-material';
import { getFooterSettings, updateFooterSettings } from '@/lib/actions/settings';
import { toast } from 'sonner';

export default function FooterEditor() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({ 
    social: { facebook: '', instagram: '', twitter: '', youtube: '' }, 
    columns: [] 
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // ⚠️ FIX: Cast response to 'any' to handle Prisma Json type
    getFooterSettings().then((fetchedData: any) => {
        setData({
            social: fetchedData?.social || {},
            columns: fetchedData?.columns || []
        });
        setIsLoaded(true);
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const res = await updateFooterSettings(data);
    setLoading(false);
    if (res.error) toast.error(res.error);
    else toast.success("Footer settings saved!");
  };

  // --- Helpers ---
  const updateSocial = (key: string, val: string) => {
    setData({ ...data, social: { ...data.social, [key]: val } });
  };

  const addColumn = () => {
    setData({ ...data, columns: [...data.columns, { title: 'New Column', links: [] }] });
  };

  const removeColumn = (idx: number) => {
    const newCols = [...data.columns];
    newCols.splice(idx, 1);
    setData({ ...data, columns: newCols });
  };

  const updateColumnTitle = (idx: number, val: string) => {
    const newCols = [...data.columns];
    newCols[idx].title = val;
    setData({ ...data, columns: newCols });
  };

  const addLink = (colIdx: number) => {
    const newCols = [...data.columns];
    newCols[colIdx].links.push({ label: 'New Link', url: '/' });
    setData({ ...data, columns: newCols });
  };

  const removeLink = (colIdx: number, linkIdx: number) => {
    const newCols = [...data.columns];
    newCols[colIdx].links.splice(linkIdx, 1);
    setData({ ...data, columns: newCols });
  };

  const updateLink = (colIdx: number, linkIdx: number, field: 'label' | 'url', val: string) => {
    const newCols = [...data.columns];
    newCols[colIdx].links[linkIdx][field] = val;
    setData({ ...data, columns: newCols });
  };

  if (!isLoaded) return <Typography sx={{ p: 4 }}>Loading Footer Settings...</Typography>;

  return (
    <Stack spacing={4}>
      
      {/* 1. Social Media Links */}
      <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>Social Media Links</Typography>
        <Grid container spacing={2}>
            {['facebook', 'instagram', 'twitter', 'youtube'].map((platform) => (
                <Grid item xs={12} md={6} key={platform}>
                    <TextField 
                        label={platform.charAt(0).toUpperCase() + platform.slice(1)} 
                        fullWidth 
                        size="small"
                        value={data.social?.[platform] || ''}
                        onChange={(e) => updateSocial(platform, e.target.value)}
                        placeholder="https://..."
                    />
                </Grid>
            ))}
        </Grid>
      </Card>

      {/* 2. Footer Columns */}
      {data.columns.map((col: any, colIdx: number) => (
        <Card key={colIdx} sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <TextField 
                    label={`Column ${colIdx + 1} Title`}
                    value={col.title}
                    onChange={(e) => updateColumnTitle(colIdx, e.target.value)}
                    size="small"
                    sx={{ fontWeight: 700 }}
                />
                <IconButton color="error" onClick={() => removeColumn(colIdx)}>
                    <Delete />
                </IconButton>
            </Stack>

            <Stack spacing={2} ml={2}>
                {col.links.map((link: any, linkIdx: number) => (
                    <Stack direction="row" spacing={2} key={linkIdx} alignItems="center">
                        <TextField 
                            label="Label" size="small" value={link.label} 
                            onChange={(e) => updateLink(colIdx, linkIdx, 'label', e.target.value)}
                        />
                        <TextField 
                            label="URL" size="small" fullWidth value={link.url} 
                            onChange={(e) => updateLink(colIdx, linkIdx, 'url', e.target.value)}
                        />
                        <IconButton size="small" color="error" onClick={() => removeLink(colIdx, linkIdx)}>
                            <Delete fontSize="small" />
                        </IconButton>
                    </Stack>
                ))}
                <Button startIcon={<Add />} onClick={() => addLink(colIdx)} sx={{ width: 'fit-content' }}>
                    Add Link
                </Button>
            </Stack>
        </Card>
      ))}

      <Button variant="outlined" startIcon={<Add />} onClick={addColumn} sx={{ py: 2, borderStyle: 'dashed' }}>
          Add New Column
      </Button>

      <Box sx={{ position: 'sticky', bottom: 20, zIndex: 10 }}>
        <Button 
            variant="contained" 
            size="large" 
            startIcon={<Save />} 
            onClick={handleSave} 
            disabled={loading}
            sx={{ borderRadius: 50, float: 'right', px: 4 }}
        >
           {loading ? "Saving..." : "Publish Footer & Socials"}
        </Button>
      </Box>

    </Stack>
  );
}