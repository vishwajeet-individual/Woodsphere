'use client';

import { Box, Button, TextField, MenuItem, Switch, FormControlLabel, Card, Typography, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { createProduct, updateProduct } from '@/lib/actions/product';
import { toast } from 'sonner';
import { useState } from 'react';
import ImageUpload from '@/components/ui/ImageUpload'; // <--- Import

type ProductData = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  subCategoryId: string;
  images: string[];
  isFeatured: boolean;
  subCategory: { categoryId: string };
};

export default function ProductForm({ categories, initialData }: { categories: any[], initialData?: ProductData }) {
  const [selectedCat, setSelectedCat] = useState(initialData?.subCategory.categoryId || '');
  const [selectedSubCat, setSelectedSubCat] = useState(initialData?.subCategoryId || '');
  // 1. Image State
  const [imageUrl, setImageUrl] = useState(initialData?.images[0] || '');
  const [loading, setLoading] = useState(false);

  const subCategories = categories.find(c => c.id === selectedCat)?.subCategories || [];

  const handleCatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCat(e.target.value);
    setSelectedSubCat('');
  };

  const handleSubmit = async (formData: FormData) => {
    if (!imageUrl) {
        toast.error("Please upload an image");
        return;
    }

    setLoading(true);
    let res;
    if (initialData) {
      res = await updateProduct(initialData.id, formData);
    } else {
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
          
          <TextField name="name" label="Product Name" fullWidth required defaultValue={initialData?.name} />
          <TextField name="description" label="Description" multiline rows={4} fullWidth required defaultValue={initialData?.description} />
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
               <TextField name="price" label="Price (₹)" type="number" fullWidth required defaultValue={initialData ? Number(initialData.price) : ''} />
            </Grid>
            <Grid size={{ xs: 6 }}>
               <TextField name="stock" label="Stock Quantity" type="number" fullWidth required defaultValue={initialData?.stock} />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
               <TextField select label="Parent Category" fullWidth value={selectedCat} onChange={handleCatChange} helperText="Select this first" required>
                 {categories.map((c) => (<MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>))}
               </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
               <TextField select name="subCategoryId" label="Sub-Category" fullWidth required disabled={!selectedCat} value={selectedSubCat} onChange={(e) => setSelectedSubCat(e.target.value)}>
                 {subCategories.map((s: any) => (<MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>))}
               </TextField>
            </Grid>
          </Grid>

          {/* 2. Image Upload Component */}
          <Box>
             <Typography variant="body2" color="text.secondary" gutterBottom>Product Image</Typography>
             <ImageUpload 
                value={imageUrl} 
                onChange={(url) => setImageUrl(url)}
                onRemove={() => setImageUrl('')}
             />
             {/* 3. Hidden Input to send data to Server Action */}
             <input type="hidden" name="imageUrl" value={imageUrl} />
          </Box>

          <FormControlLabel 
            control={<Switch name="isFeatured" defaultChecked={initialData?.isFeatured} />} 
            label="Feature this product on Homepage" 
          />

          <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ borderRadius: 8, py: 1.5 }}>
            {loading ? 'Saving...' : (initialData ? 'Update Product' : 'Create Product')}
          </Button>

        </Stack>
      </Box>
    </Card>
  );
}