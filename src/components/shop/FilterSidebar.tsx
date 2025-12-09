'use client';

import { Box, Typography, List, ListItemButton, ListItemText, Divider, Slider, Button } from '@mui/material';
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
  
  // Get current active filters
  const activeCategory = searchParams.get('category');
  const activeSub = searchParams.get('sub');
  
  // Price State
  const [priceRange, setPriceRange] = useState<number[]>([0, 200000]);

  // Handle Price Apply
  const applyPrice = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('min', priceRange[0].toString());
    params.set('max', priceRange[1].toString());
    router.push(`/search?${params.toString()}`);
  };

  return (
    <Box sx={{ width: '100%', pr: { md: 4 }, mb: 4 }}>
      {/* 1. Categories */}
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        Categories
      </Typography>
      <List disablePadding>
        <ListItemButton 
          component={Link} 
          href="/search" 
          selected={!activeCategory}
          sx={{ borderRadius: 2, mb: 0.5 }}
        >
          <ListItemText primary="All Products" />
        </ListItemButton>
        
        {categories.map((cat) => (
          <Box key={cat.id}>
            <ListItemButton 
              component={Link} 
              href={`/search?category=${cat.slug}`}
              selected={activeCategory === cat.slug}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemText primary={cat.name} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
            
            {/* Subcategories (Show only if parent is active) */}
            {activeCategory === cat.slug && (
               <List disablePadding sx={{ pl: 2 }}>
                 {cat.subCategories.map((sub) => (
                   <ListItemButton 
                     key={sub.slug}
                     component={Link} 
                     href={`/search?category=${cat.slug}&sub=${sub.slug}`}
                     selected={activeSub === sub.slug}
                     sx={{ borderRadius: 2, py: 0.5 }}
                   >
                     <ListItemText primary={sub.name} primaryTypographyProps={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                   </ListItemButton>
                 ))}
               </List>
            )}
          </Box>
        ))}
      </List>

      <Divider sx={{ my: 3 }} />

      {/* 2. Price Filter */}
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        Price Range
      </Typography>
      <Box sx={{ px: 1 }}>
        <Slider
          value={priceRange}
          onChange={(_, newValue) => setPriceRange(newValue as number[])}
          valueLabelDisplay="auto"
          min={0}
          max={200000}
          step={1000}
        />
        <Box display="flex" justifyContent="space-between" mb={2}>
           <Typography variant="caption">₹{priceRange[0]}</Typography>
           <Typography variant="caption">₹{priceRange[1]}</Typography>
        </Box>
        <Button variant="outlined" fullWidth onClick={applyPrice} size="small" sx={{ borderRadius: 4 }}>
            Apply
        </Button>
      </Box>
    </Box>
  );
}