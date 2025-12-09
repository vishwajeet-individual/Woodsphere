'use client';

import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, IconButton, Avatar, Typography, Chip 
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { deleteProduct } from '@/lib/actions/product';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function ProductList({ products }: { products: any[] }) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const res = await deleteProduct(id);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Product deleted");
    }
  };

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 3 }}>
      <Table>
        <TableHead sx={{ bgcolor: '#f9fafb' }}>
          <TableRow>
            <TableCell>IMAGE</TableCell>
            <TableCell>NAME</TableCell>
            <TableCell>CATEGORY</TableCell>
            <TableCell>PRICE</TableCell>
            <TableCell>STOCK</TableCell>
            <TableCell align="right">ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} hover>
              <TableCell>
                <Avatar 
                  src={product.images[0]} 
                  variant="rounded" 
                  sx={{ width: 48, height: 48, bgcolor: '#f5f5f7' }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={600}>{product.name}</Typography>
                {product.isFeatured && (
                   <Chip label="Featured" size="small" color="secondary" sx={{ height: 20, fontSize: '0.65rem' }} />
                )}
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {product.subCategory?.name || 'N/A'}
                </Typography>
              </TableCell>
              
              {/* ⚠️ FIX: Use sx prop for fontWeight */}
              <TableCell sx={{ fontWeight: 600 }}>
                ₹{Number(product.price).toLocaleString('en-IN')}
              </TableCell>
              
              <TableCell>
                <Chip 
                  label={product.stock} 
                  size="small" 
                  color={product.stock < 5 ? 'error' : 'default'} 
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => router.push(`/admin/products/${product.id}`)}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(product.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {products.length === 0 && (
            <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>No products found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}