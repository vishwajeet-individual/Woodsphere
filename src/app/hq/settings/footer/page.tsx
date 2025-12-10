'use client';

import { useState, useEffect } from 'react';
import { Box, Button, TextField, Card, Typography, Stack, IconButton, Divider, Grid } from '@mui/material';
import { Add, Delete, Save } from '@mui/icons-material';
import { getFooterSettings, updateFooterSettings } from '@/lib/actions/settings';
import { toast } from 'sonner';

export default function FooterSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({ social: {}, columns: [] });

  // Load initial data
  useEffect(() => {
    getFooterSettings().then(setData);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const res = await updateFooterSettings(data);
    setLoading(false);
    if (res.error) toast.error(res.error);
    else toast.success("Footer updated successfully!");
  };

  // --- Helpers for State Mutation ---
  
  const updateSocial = (key: string, val: string) => {
    setData({ ...data, social: { ...data.social, [key]: val } });
  };

  const addColumn = () => {
    setData({
      ...data,
      columns: [...data.columns, { title: 'New Column', links: [] }]
    });
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

  if (!data.columns) return <Typography>Loading...</Typography>;

  return (
    <Box maxWidth="lg">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight={700}>Footer Configuration</Typography>
        <Button 
            variant="contained" 
            startIcon={<Save />} 
            onClick={handleSave}
            disabled={loading}
            sx={{ borderRadius: 8 }}
        >
            {loading ? "Saving..." : "Save Changes"}
        </Button>
      </Stack>

      <Stack spacing={4}>
        
        {/* 1. Social Media Links */}
        <Card sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Social Media Links</Typography>
            <Grid container spacing={2}>
                {['facebook', 'instagram', 'twitter', 'youtube'].map((platform) => (
                    <Grid item xs={12} md={6} key={platform}>
                        <TextField 
                            label={platform.charAt(0).toUpperCase() + platform.slice(1)} 
                            fullWidth 
                            size="small"
                            value={data.social[platform] || ''}
                            onChange={(e) => updateSocial(platform, e.target.value)}
                            placeholder="https://..."
                        />
                    </Grid>
                ))}
            </Grid>
        </Card>

        {/* 2. Footer Columns */}
        {data.columns.map((col: any, colIdx: number) => (
            <Card key={colIdx} sx={{ p: 4, borderRadius: 4, border: '1px solid #eee', boxShadow: 'none' }}>
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
                                label="Label" 
                                size="small" 
                                value={link.label}
                                onChange={(e) => updateLink(colIdx, linkIdx, 'label', e.target.value)}
                            />
                            <TextField 
                                label="URL" 
                                size="small" 
                                fullWidth
                                value={link.url}
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
            Add New Footer Column
        </Button>

      </Stack>
    </Box>
  );
}