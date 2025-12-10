import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { 
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar, Button 
} from '@mui/material';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getStores() {
  return await prisma.store.findMany({
    include: {
        user: { select: { email: true } },
        _count: { select: { products: true, subOrders: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export default async function HQStoresPage() {
  const session = await auth();
  // @ts-ignore
  if (session?.user?.role !== 'SUPER_ADMIN') redirect('/login');

  const stores = await getStores();

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
        Manage Sellers
      </Typography>

      <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f9fafb' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>STORE NAME</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>OWNER EMAIL</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>PRODUCTS</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>ORDERS</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>JOINED</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar variant="rounded" sx={{ width: 32, height: 32, bgcolor: '#e0e0e0', color: '#000', fontSize: '0.8rem' }}>
                            {store.name[0]}
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight={600}>{store.name}</Typography>
                            <Typography variant="caption" color="text.secondary">/{store.slug}</Typography>
                        </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{store.user.email}</TableCell>
                  <TableCell>
                    <Chip 
                        label={store.status} 
                        size="small" 
                        color={store.status === 'ACTIVE' ? 'success' : 'warning'} 
                        variant="outlined" 
                    />
                  </TableCell>
                  <TableCell>{store._count.products}</TableCell>
                  <TableCell>{store._count.subOrders}</TableCell>
                  <TableCell>
                    {new Date(store.createdAt).toLocaleDateString('en-IN')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}