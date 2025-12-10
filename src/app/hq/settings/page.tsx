'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Card, Stack, TextField, Button, Switch, FormControlLabel, Tabs, Tab, IconButton, Grid } from '@mui/material';
import { Save, Add, Delete } from '@mui/icons-material';
import { getFooterSettings, updateFooterSettings } from '@/lib/actions/settings';
import { toast } from 'sonner';

function FooterEditor() {
  const [data, setData] = useState<any>({ social: {}, columns: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFooterSettings().then(setData);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const res = await updateFooterSettings(data);
    setLoading(false);
    if (res.error) toast.error(res.error);
    else toast.success("Footer updated!");
  };

  // --- Helpers ---
  const updateSocial = (key: string, val: string) => setData({ ...data, social: { ...data.social, [key]: val } });
  
  const addColumn = () => setData({ ...data, columns: [...data.columns, { title: 'New Column', links: [] }] });
  
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
    <Stack spacing={4}>
      <Card sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>Social Media</Typography>
        <Grid container spacing={2}>
            {['facebook', 'instagram', 'twitter', 'youtube'].map((platform) => (
                <Grid item xs={12} md={6} key={platform}>
                    <TextField 
                        label={platform.charAt(0).toUpperCase() + platform.slice(1)} 
                        fullWidth size="small"
                        value={data.social[platform] || ''}
                        onChange={(e) => updateSocial(platform, e.target.value)}
                        placeholder="https://..."
                    />
                </Grid>
            ))}
        </Grid>
      </Card>

      {data.columns.map((col: any, colIdx: number) => (
        <Card key={colIdx} sx={{ p: 4, borderRadius: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <TextField 
                    label={`Column ${colIdx + 1}`}
                    value={col.title}
                    onChange={(e) => updateColumnTitle(colIdx, e.target.value)}
                    size="small" sx={{ fontWeight: 700 }}
                />
                <IconButton color="error" onClick={() => removeColumn(colIdx)}><Delete /></IconButton>
            </Stack>
            <Stack spacing={2} ml={2}>
                {col.links.map((link: any, linkIdx: number) => (
                    <Stack direction="row" spacing={2} key={linkIdx} alignItems="center">
                        <TextField label="Label" size="small" value={link.label} onChange={(e) => updateLink(colIdx, linkIdx, 'label', e.target.value)} />
                        <TextField label="URL" size="small" fullWidth value={link.url} onChange={(e) => updateLink(colIdx, linkIdx, 'url', e.target.value)} />
                        <IconButton size="small" color="error" onClick={() => removeLink(colIdx, linkIdx)}><Delete fontSize="small" /></IconButton>
                    </Stack>
                ))}
                <Button startIcon={<Add />} onClick={() => addLink(colIdx)} sx={{ width: 'fit-content' }}>Add Link</Button>
            </Stack>
        </Card>
      ))}

      <Button variant="outlined" startIcon={<Add />} onClick={addColumn} sx={{ py: 2, borderStyle: 'dashed' }}>Add Column</Button>
      
      <Box sx={{ position: 'sticky', bottom: 20, zIndex: 10 }}>
        <Button variant="contained" size="large" startIcon={<Save />} onClick={handleSave} disabled={loading} sx={{ borderRadius: 8, float: 'right' }}>
           {loading ? "Saving..." : "Save Footer Settings"}
        </Button>
      </Box>
    </Stack>
  );
}

function GeneralSettings() {
  return (
    <Stack spacing={4}>
      <Card sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>General</Typography>
        <Stack spacing={3}>
           <TextField label="Platform Name" defaultValue="Woodsphere" fullWidth />
           <TextField label="Commission Rate (%)" defaultValue="10" fullWidth />
           <FormControlLabel control={<Switch defaultChecked />} label="Allow Vendor Registration" />
        </Stack>
      </Card>
      <Card sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>Payments</Typography>
        <TextField label="Provider" defaultValue="Razorpay" disabled fullWidth />
      </Card>
      <Button variant="contained" size="large" disabled sx={{ borderRadius: 8, width: 'fit-content' }}>Save General Settings</Button>
    </Stack>
  );
}

export default function HQSettingsPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box maxWidth="lg">
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>Platform Settings</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="General" />
          <Tab label="Footer & Socials" />
        </Tabs>
      </Box>

      {tab === 0 && <GeneralSettings />}
      {tab === 1 && <FooterEditor />}
    </Box>
  );
}