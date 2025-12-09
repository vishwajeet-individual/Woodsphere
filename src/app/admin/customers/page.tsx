import { prisma } from '@/lib/prisma';
import { 
  Box, Typography, Card, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Avatar, Chip 
} from '@mui/material';

export const dynamic = 'force-dynamic';

async function getCustomers() {
  return await prisma.user.findMany({
    where: { role: 'USER' },
    include: { 
      _count: { select: { orders: true } },
      orders: { 
        take: 1, 
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
        Customers
      </Typography>

      <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f9fafb' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>CUSTOMER</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>EMAIL</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>JOINED</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>TOTAL ORDERS</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>LAST ACTIVE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={user.image || undefined} sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.8rem' }}>
                        {user.name?.[0] || 'U'}
                      </Avatar>
                      <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <Chip label={`${user._count.orders} Orders`} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    {user.orders[0] 
                      ? new Date(user.orders[0].createdAt).toLocaleDateString('en-IN')
                      : 'Never'}
                  </TableCell>
                </TableRow>
              ))}
              
              {customers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                    No customers yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}