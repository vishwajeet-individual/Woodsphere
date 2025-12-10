import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'; // MUI v6
import ProductCard from '@/components/ui/ProductCard';
import Link from 'next/link';

interface ProductGridSectionProps {
  title: string;
  products: any[];
  viewAllLink?: string;
  bgColor?: string; // Add background color support
}

export default function ProductGridSection({ title, products, viewAllLink, bgColor }: ProductGridSectionProps) {
  if (products.length === 0) return null;

  return (
    // ⚠️ CHANGED: Removed py: 6. 
    <Box sx={{ bgcolor: bgColor || 'transparent' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: '-0.01em' }}>
          {title}
        </Typography>
        {/* ... link ... */}
        {viewAllLink && (
           <Typography component={Link} href={viewAllLink} variant="body2" fontWeight={600} color="primary" sx={{ textDecoration: 'none' }}>
             View All
           </Typography>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* ... product mapping ... */}
        {products.map((product) => (
          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={product.id}>
            <ProductCard product={{ ...product, price: Number(product.price) }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}