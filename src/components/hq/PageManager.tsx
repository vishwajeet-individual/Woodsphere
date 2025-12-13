'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Paper, Typography, List, ListItemButton, ListItemText, 
  TextField, Button, Chip, Stack, IconButton, Dialog, DialogTitle, 
  DialogContent, DialogActions, MenuItem, Tooltip, Divider, FormControl, InputLabel, Select,
  ListSubheader
} from '@mui/material';
import { Save, Add, Delete, OpenInNew, Article, Web, ViewColumn, MenuBook, Link as LinkIcon, DynamicFeed } from '@mui/icons-material';
import { getAllContentPages, updateContentPage, createContentPage, deleteContentPage, getContentPageDetails } from '@/lib/actions/pages';
import { getHeaderSettings, getFooterSettings } from '@/lib/actions/settings';
import { toast } from 'sonner';
import RichTextEditor from '@/components/ui/RichTextEditor';
import Link from 'next/link';

// Base System Placements
const SYSTEM_PLACEMENTS = [
  { value: 'PAGE', label: 'Hidden (Link Only)', group: 'System' },
  { value: 'HEADER', label: 'Header (Main Menu)', group: 'System' }, // Root level header
  { value: 'FOOTER_HELP', label: 'Help & Support', group: 'System Footer' },
  { value: 'FOOTER_COMPANY', label: 'Company', group: 'System Footer' },
  { value: 'FOOTER_LEGAL', label: 'Legal', group: 'System Footer' },
];

export default function PageManager() {
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Dynamic Placements State
  const [customPlacements, setCustomPlacements] = useState<any[]>([]);

  // Editor State
  const [editorTitle, setEditorTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorCategory, setEditorCategory] = useState('PAGE'); 

  // Create State
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newCategory, setNewCategory] = useState('PAGE');

  useEffect(() => { 
      loadPages(); 
      loadPlacements(); // Load dynamic options
  }, []);

  const loadPages = async () => {
    const data = await getAllContentPages();
    setPages(data);
    if (data.length > 0 && !selectedPage) handleSelectPage(data[0]);
  };

  // 🧠 FETCH CUSTOM HEADER/FOOTER STRUCTURE
  const loadPlacements = async () => {
      const [header, footer] = await Promise.all([getHeaderSettings(), getFooterSettings()]);
      
      const dynamicOptions: any[] = [];

      // 1. Header Menus (as Sub-menu parents)
      // Guard: ensure header is an object and has a navigation array
      if (header && typeof header === 'object' && 'navigation' in header) {
        const nav = (header as any).navigation;
        if (Array.isArray(nav)) {
          nav.forEach((navItem: any) => {
              dynamicOptions.push({
                  value: `HEADER_SUB:${navItem.slug}`,
                  label: `Header > ${navItem.label}`,
                  group: 'Custom Header Menus'
              });
          });
        }
      }

      // 2. Custom Footer Columns
      // Guard: ensure footer is an object and has a columns array
      if (footer && typeof footer === 'object' && 'columns' in footer) {
        const cols = (footer as any).columns;
        if (Array.isArray(cols)) {
          cols.forEach((col: any) => {
              dynamicOptions.push({
                  value: `FOOTER_COL:${col.title}`,
                  label: `Footer > ${col.title}`,
                  group: 'Custom Footer Columns'
              });
          });
        }
      }

      setCustomPlacements(dynamicOptions);
  };

  const handleSelectPage = async (pageSummary: any) => {
    const fullPage = await getContentPageDetails(pageSummary.slug);
    if (!fullPage) return;

    setSelectedPage(fullPage);
    setEditorTitle(fullPage.title);
    setEditorContent(fullPage.content);
    
    // Normalize Category for UI (Handle old system categories)
    let cat = fullPage.category;
    if (cat === 'HELP') cat = 'FOOTER_HELP';
    if (cat === 'COMPANY') cat = 'FOOTER_COMPANY';
    if (cat === 'LEGAL') cat = 'FOOTER_LEGAL';
    setEditorCategory(cat);
  };

  const handleSave = async () => {
    if (!selectedPage) return;
    setLoading(true);
    const res = await updateContentPage(selectedPage.slug, editorContent, editorTitle, editorCategory);
    setLoading(false);
    if (res.error) toast.error(res.error);
    else {
        toast.success("Saved!");
        loadPages(); 
    }
  };

  const handleCreate = async () => {
    const res = await createContentPage({ title: newTitle, slug: newSlug, category: newCategory });
    if (res.error) toast.error(res.error);
    else {
        toast.success("Page Created");
        setCreateOpen(false); setNewTitle(''); setNewSlug('');
        loadPages();
    }
  };

  const handleDelete = async () => {
    if (!selectedPage || !confirm("Delete this page?")) return;
    await deleteContentPage(selectedPage.slug);
    setSelectedPage(null);
    loadPages();
    toast.success("Deleted");
  };

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewTitle(e.target.value);
      setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  // Combine placements for Dropdown
  const allPlacements = [...SYSTEM_PLACEMENTS, ...customPlacements];

  return (
    <>
    <Grid container spacing={3} sx={{ height: '72vh' }}>
      
      {/* List */}
      <Grid item xs={12} md={3} sx={{ height: '100%' }}>
        <Paper sx={{ height: '100%', overflowY: 'auto', borderRadius: 3, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
            <Box p={2} bgcolor="#f9fafb" borderBottom="1px solid #e0e0e0" display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" fontWeight={700} color="text.secondary">PAGES</Typography>
                <IconButton size="small" onClick={() => setCreateOpen(true)}><Add /></IconButton>
            </Box>
            <List disablePadding>
                {pages.map((page) => (
                    <ListItemButton 
                        key={page.id} 
                        selected={selectedPage?.id === page.id}
                        onClick={() => handleSelectPage(page)}
                        sx={{ '&.Mui-selected': { bgcolor: '#f0f7ff', borderLeft: '4px solid #0071e3' } }}
                    >
                        <ListItemText 
                            primary={page.title} 
                            secondary={page.slug}
                            primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                            secondaryTypographyProps={{ fontSize: '0.75rem', noWrap: true }}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Paper>
      </Grid>

      {/* Editor */}
      <Grid item xs={12} md={9} sx={{ height: '100%' }}>
         {selectedPage ? (
             <Paper sx={{ p: 4, height: '100%', borderRadius: 3, display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Grid container spacing={3} mb={2} alignItems="center">
                    <Grid item xs={8}>
                        <TextField 
                            variant="standard" value={editorTitle} onChange={(e) => setEditorTitle(e.target.value)} fullWidth
                            InputProps={{ style: { fontSize: '1.5rem', fontWeight: 800 } }}
                        />
                        <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                             <Chip label={`/${selectedPage.slug}`} size="small" />
                             <Tooltip title="Preview">
                                <IconButton size="small" component={Link} href={`/pages/${selectedPage.slug}`} target="_blank"><OpenInNew fontSize="small" /></IconButton>
                             </Tooltip>
                        </Stack>
                    </Grid>
                    <Grid item xs={4}>
                         <FormControl fullWidth size="small">
                            <InputLabel>Placement</InputLabel>
                            <Select 
                                value={editorCategory} 
                                label="Placement" 
                                onChange={(e: any) => setEditorCategory(e.target.value)}
                                MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                            >
                                {/* Grouped Options */}
                                <ListSubheader sx={{ fontWeight: 700, color: 'primary.main' }}>System Default</ListSubheader>
                                {SYSTEM_PLACEMENTS.map(p => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
                                
                                {customPlacements.length > 0 && (
                                    <ListSubheader sx={{ fontWeight: 700, color: 'secondary.main', bgcolor: '#f5f5f7' }}>Custom Areas</ListSubheader>
                                )}
                                {customPlacements.map(p => <MenuItem key={p.value} value={p.value}><DynamicFeed fontSize="small" sx={{ mr: 1, opacity: 0.5 }}/> {p.label}</MenuItem>)}
                            </Select>
                         </FormControl>
                    </Grid>
                </Grid>
                
                <Divider sx={{ mb: 2 }} />
                
                <Box flexGrow={1} mb={2} sx={{ overflowY: 'auto' }}>
                    <RichTextEditor value={editorContent} onChange={setEditorContent} />
                </Box>

                <Box pt={2} borderTop="1px solid #f0f0f0" display="flex" justifyContent="space-between">
                    <Button onClick={handleDelete} color="error" startIcon={<Delete />}>Delete</Button>
                    <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={loading} sx={{ borderRadius: 50, px: 4 }}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </Box>
             </Paper>
         ) : (
             <Box height="100%" display="flex" alignItems="center" justifyContent="center" flexDirection="column" color="text.secondary">
                 <Article sx={{ fontSize: 60, opacity: 0.2, mb: 2 }} />
                 <Typography>Select a page or create new</Typography>
             </Box>
         )}
      </Grid>
    </Grid>

    <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Create Page</DialogTitle>
        <DialogContent>
            <Stack spacing={2} pt={1}>
                <TextField label="Title" fullWidth value={newTitle} onChange={onTitleChange} />
                <TextField label="Slug" fullWidth value={newSlug} onChange={(e) => setNewSlug(e.target.value)} />
                <FormControl fullWidth>
                    <InputLabel>Placement</InputLabel>
                    <Select value={newCategory} label="Placement" onChange={(e: any) => setNewCategory(e.target.value)}>
                         <ListSubheader>System</ListSubheader>
                         {SYSTEM_PLACEMENTS.map((p) => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
                         <ListSubheader>Custom</ListSubheader>
                         {customPlacements.map((p) => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
                    </Select>
                </FormControl>
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} variant="contained">Create</Button>
        </DialogActions>
    </Dialog>
    </>
  );
}
