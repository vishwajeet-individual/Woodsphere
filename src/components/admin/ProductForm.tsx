'use client';

import { Box, Button, TextField, MenuItem, Switch, FormControlLabel, Card, Typography, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2'; 
import { createProduct, updateProduct } from '@/lib/actions/product'; // Import update
import { toast } from 'sonner';
import { useState } from 'react';

// New Prop Type
type ProductData = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  subCategoryId: string;
  images: string[];
  isFeatured: boolean;
  subCategory: { categoryId: string }; // Needed to auto-select parent category
};

export default function ProductForm({ categories, initialData }: { categories: any[], initialData?: ProductData }) {
  // Initialize state with existing data or defaults
  const [selectedCat, setSelectedCat] = useState(initialData?.subCategory.categoryId || '');
  const [selectedSubCat, setSelectedSubCat] = useState(initialData?.subCategoryId || '');
  const [loading, setLoading] = useState(false);

  // Filter subcategories
  const subCategories = categories.find(c => c.id === selectedCat)?.subCategories || [];

  const handleCatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCat(e.target.value);
    setSelectedSubCat('');
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    
    let res;
    if (initialData) {
      // Update Mode
      res = await updateProduct(initialData.id, formData);
    } else {
      // Create Mode
      res = await createProduct(formData);
    }
    
    if (res?.error) {
      toast.error(res.error);
      setLoading(false);
    } else {
      toast.success(initialData ? "Product updated" : "Product created");
    }
  };

  return (
    <Card sx={{ p: 4, borderRadius: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {initialData ? 'Edit Product' : 'New Product'}
      </Typography>
      
      <Box component="form" action={handleSubmit}>
        <Stack spacing={3}>
          
          <TextField 
            name="name" 
            label="Product Name" 
            fullWidth 
            required 
            defaultValue={initialData?.name}
          />
          <TextField 
            name="description" 
            label="Description" 
            multiline 
            rows={4} 
            fullWidth 
            required 
            defaultValue={initialData?.description}
          />
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
               <TextField 
                 name="price" 
                 label="Price (₹)" 
                 type="number" 
                 fullWidth 
                 required 
                 defaultValue={initialData ? Number(initialData.price) : ''}
               />
            </Grid>
            <Grid size={{ xs: 6 }}>
               <TextField 
                 name="stock" 
                 label="Stock Quantity" 
                 type="number" 
                 fullWidth 
                 required 
                 defaultValue={initialData?.stock}
               />
            </Grid>
          </Grid>

          {/* Categorization */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
               <TextField 
                 select 
                 label="Parent Category" 
                 fullWidth 
                 value={selectedCat}
                 onChange={handleCatChange}
                 helperText="Select this first"
                 required
               >
                 {categories.map((c) => (
                   <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                 ))}
               </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
               <TextField 
                 select 
                 name="subCategoryId" 
                 label="Sub-Category" 
                 fullWidth 
                 required
                 disabled={!selectedCat}
                 value={selectedSubCat}
                 onChange={(e) => setSelectedSubCat(e.target.value)}
               >
                 {subCategories.map((s: any) => (
                   <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                 ))}
               </TextField>
            </Grid>
          </Grid>

          <TextField 
            name="imageUrl" 
            label="Image URL" 
            placeholder="https://images.unsplash.com/..." 
            fullWidth 
            required 
            helperText="Paste a direct image link"
            defaultValue={initialData?.images[0]}
          />

          <FormControlLabel 
            control={<Switch name="isFeatured" defaultChecked={initialData?.isFeatured} />} 
            label="Feature this product on Homepage" 
          />

          <Button 
            type="submit" 
            variant="contained" 
            size="large" 
            disabled={loading}
            sx={{ borderRadius: 50, py: 1.5 }}
          >
            {loading ? 'Saving...' : (initialData ? 'Update Product' : 'Create Product')}
          </Button>

        </Stack>
      </Box>
    </Card>
  );
}