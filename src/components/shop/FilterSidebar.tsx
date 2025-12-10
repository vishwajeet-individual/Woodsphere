'use client';

import { 
  Box, Typography, List, ListItemButton, ListItemText, Divider, Slider, Button, 
  FormControl, RadioGroup, FormControlLabel, Radio, Drawer, IconButton, 
  Accordion, AccordionSummary, AccordionDetails, Stack, Chip, useMediaQuery, Theme 
} from '@mui/material';
import { ExpandMore, FilterList, Close, RestartAlt } from '@mui/icons-material';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

type Category = {
  id: string;
  name: string;
  slug: string;
  subCategories: { name: string, slug: string }[];
};

export default function FilterSidebar({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  
  // -- State --
  const [mobileOpen, setMobileOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([0, 200000]);

  // -- Current Filters --
  const activeCategory = searchParams.get('category');
  const activeSub = searchParams.get('sub');
  const activeSort = searchParams.get('sort') || 'newest';
  const minParam = searchParams.get('min');
  const maxParam = searchParams.get('max');

  // Sync Slider with URL
  useEffect(() => {
    if (minParam && maxParam) {
      setPriceRange([Number(minParam), Number(maxParam)]);
    }
  }, [minParam, maxParam]);

  // -- Logic --
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    
    // Reset page on filter change
    params.delete('page'); 
    
    router.push(`/search?${params.toString()}`);
    if (isMobile) setMobileOpen(false); // Close drawer on selection
  };

  const applyPrice = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('min', priceRange[0].toString());
    params.set('max', priceRange[1].toString());
    router.push(`/search?${params.toString()}`);
    if (isMobile) setMobileOpen(false);
  };

  const clearFilters = () => {
    router.push('/search');
    setPriceRange([0, 200000]);
    if (isMobile) setMobileOpen(false);
  };

  // --- REUSABLE FILTER CONTENT (Used in both Desktop Sidebar & Mobile Drawer) ---
  const FilterContent = () => (
    <Box sx={{ p: isMobile ? 3 : 0, pb: isMobile ? 10 : 0 }}>
      
      {/* Header for Mobile */}
      {isMobile && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={700}>Filters</Typography>
          <IconButton onClick={() => setMobileOpen(false)}><Close /></IconButton>
        </Stack>
      )}

      {/* 1. SORTING */}
      <Accordion defaultExpanded elevation={0} sx={{ '&:before': { display: 'none' }, bgcolor: 'transparent' }} disableGutters>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight={600}>Sort By</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          <FormControl component="fieldset">
            <RadioGroup value={activeSort} onChange={(e) => updateFilter('sort', e.target.value)}>
              <FormControlLabel value="newest" control={<Radio size="small" />} label={<Typography fontSize="0.9rem">Newest Arrivals</Typography>} />
              <FormControlLabel value="price_asc" control={<Radio size="small" />} label={<Typography fontSize="0.9rem">Price: Low to High</Typography>} />
              <FormControlLabel value="price_desc" control={<Radio size="small" />} label={<Typography fontSize="0.9rem">Price: High to Low</Typography>} />
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 1 }} />

      {/* 2. PRICE SLIDER */}
      <Accordion defaultExpanded elevation={0} sx={{ '&:before': { display: 'none' }, bgcolor: 'transparent' }} disableGutters>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight={600}>Price Range</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          <Slider
            value={priceRange}
            onChange={(_, v) => setPriceRange(v as number[])}
            valueLabelDisplay="auto"
            min={0}
            max={200000}
            step={1000}
            sx={{ color: 'primary.main', mb: 2 }}
          />
          <Stack direction="row" justifyContent="space-between" mb={2}>
             <Box sx={{ border: '1px solid #ddd', borderRadius: 1, px: 1, py: 0.5 }}>
               <Typography variant="caption" color="text.secondary">Min</Typography>
               <Typography fontWeight={600}>₹{priceRange[0].toLocaleString()}</Typography>
             </Box>
             <Box sx={{ border: '1px solid #ddd', borderRadius: 1, px: 1, py: 0.5 }}>
               <Typography variant="caption" color="text.secondary">Max</Typography>
               <Typography fontWeight={600}>₹{priceRange[1].toLocaleString()}</Typography>
             </Box>
          </Stack>
          <Button variant="outlined" fullWidth onClick={applyPrice} size="small" sx={{ borderRadius: 8 }}>
            Apply Price
          </Button>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 1 }} />

      {/* 3. CATEGORIES */}
      <Accordion defaultExpanded elevation={0} sx={{ '&:before': { display: 'none' }, bgcolor: 'transparent' }} disableGutters>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight={600}>Categories</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0, px: 0 }}>
          <List disablePadding>
            <ListItemButton 
              component={Link} 
              href="/search" 
              selected={!activeCategory} 
              sx={{ borderRadius: 2, mb: 0.5, py: 0.5 }}
            >
              <ListItemText primary="All Products" primaryTypographyProps={{ fontSize: '0.9rem' }} />
            </ListItemButton>
            
            {categories.map((cat) => (
              <Box key={cat.id}>
                <ListItemButton 
                  component={Link} 
                  href={`/search?category=${cat.slug}`} 
                  selected={activeCategory === cat.slug}
                  sx={{ borderRadius: 2, py: 0.5 }}
                >
                  <ListItemText primary={cat.name} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }} />
                </ListItemButton>
                
                {/* Subcategories */}
                {(activeCategory === cat.slug || activeSub) && (
                   <List disablePadding sx={{ pl: 2, borderLeft: '2px solid #eee', ml: 2 }}>
                     {cat.subCategories.map((sub) => (
                       <ListItemButton 
                         key={sub.slug}
                         component={Link} 
                         href={`/search?category=${cat.slug}&sub=${sub.slug}`}
                         selected={activeSub === sub.slug}
                         sx={{ borderRadius: 2, py: 0.2 }}
                       >
                         <ListItemText primary={sub.name} primaryTypographyProps={{ fontSize: '0.85rem', color: activeSub === sub.slug ? 'primary.main' : 'text.secondary' }} />
                       </ListItemButton>
                     ))}
                   </List>
                )}
              </Box>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Reset Button */}
      <Button 
        startIcon={<RestartAlt />} 
        color="error" 
        fullWidth 
        onClick={clearFilters}
        sx={{ mt: 2, textTransform: 'none' }}
      >
        Clear All Filters
      </Button>

    </Box>
  );

  // --- RENDER ---
  return (
    <>
      {/* 1. Mobile Trigger Button */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 3 }}>
        <Button 
          variant="outlined" 
          startIcon={<FilterList />} 
          fullWidth 
          onClick={() => setMobileOpen(true)}
          sx={{ 
            bgcolor: '#fff', 
            color: 'text.primary', 
            borderColor: '#e0e0e0',
            justifyContent: 'space-between',
            py: 1.5,
            borderRadius: 2
          }}
        >
          Filters & Sort
          <ExpandMore fontSize="small" />
        </Button>
      </Box>

      {/* 2. Mobile Drawer */}
      <Drawer
        anchor="bottom"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            height: '85vh', // Almost full screen
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }
        }}
      >
        <FilterContent />
        {/* Sticky Apply Button for Mobile */}
        <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2, bgcolor: '#fff', borderTop: '1px solid #eee' }}>
           <Button variant="contained" fullWidth size="large" onClick={() => setMobileOpen(false)} sx={{ borderRadius: 8 }}>
              Show Results
           </Button>
        </Box>
      </Drawer>

      {/* 3. Desktop Sidebar (Sticky) */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'sticky', top: 100, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
        <FilterContent />
      </Box>
    </>
  );
}