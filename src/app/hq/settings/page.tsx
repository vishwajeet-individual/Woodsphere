'use client';

import { useState } from 'react';
import { Box, Typography, Card, Stack, TextField, Button, Switch, FormControlLabel, Tabs, Tab } from '@mui/material';
import HomeEditor from '@/components/hq/HomeEditor';
import FooterEditor from '@/components/hq/FooterEditor'; // ⚠️ Imported Component
import HeaderEditor from '@/components/hq/HeaderEditor';
import PageManager from '@/components/hq/PageManager';

// General Settings Component (Inline)
function GeneralSettings() {
  return (
    <Stack spacing={4}>
      <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>General Information</Typography>
        <Stack spacing={3}>
           <TextField label="Platform Name" defaultValue="Woodsphere" fullWidth />
           <TextField label="Support Email" defaultValue="support@woodsphere.com" fullWidth />
           <TextField label="Default Commission Rate (%)" defaultValue="10" fullWidth />
           <FormControlLabel control={<Switch defaultChecked />} label="Allow New Vendor Registrations" />
        </Stack>
      </Card>
      
      <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>Payment Gateway</Typography>
        <Stack spacing={3}>
           <TextField label="Active Provider" defaultValue="Razorpay" disabled fullWidth />
           <TextField label="Environment" defaultValue="Test Mode" disabled fullWidth />
        </Stack>
      </Card>
      
      <Box>
        <Button variant="contained" size="large" sx={{ borderRadius: 50 }}>Save General Settings</Button>
      </Box>
    </Stack>
  );
}

export default function HQSettingsPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box maxWidth="md">
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>Platform Settings</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="General" />
          <Tab label="Header" />
          <Tab label="Homepage" />
          <Tab label="Footer & Socials" />
          <Tab label="Page Content" />
        </Tabs>
      </Box>

      {/* ⚠️ CLEAN TAB RENDERING */}
      <Box hidden={tab !== 0}>
         <GeneralSettings />
      </Box>
      <Box hidden={tab!==1}>
        <HeaderEditor />
      </Box>
      <Box hidden={tab !== 2}>
         <HomeEditor />
      </Box>
      <Box hidden={tab !== 3}>
         <FooterEditor />
      </Box>
      <Box hidden={tab !== 4}>
         <PageManager />
      </Box>
    </Box>
  );
}