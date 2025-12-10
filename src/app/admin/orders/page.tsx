import { prisma } from '@/lib/prisma';
import OrderStatusSelect from '@/components/admin/OrderStatusSelect';
import { 
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow 
} from '@mui/material';

async function getOrders() {
  return await prisma.order.findMany({
    include: { 
      user: { select: { name: true, email: true } },
      _count: { select: { subOrders: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
        Orders
      </Typography>

      <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f9fafb' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>ORDER ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>CUSTOMER</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>DATE</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>TOTAL</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>SHIPMENTS</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                    #{order.id.slice(-6).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>{order.user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{order.user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </TableCell>
                  
                  {/* ⚠️ FIX: fontWeight moved to sx */}
                  <TableCell sx={{ fontWeight: 600 }}>
                    ₹{Number(order.total).toLocaleString('en-IN')}
                  </TableCell>
                  
                  <TableCell>
                    {order._count.subOrders}
                  </TableCell>
                  <TableCell>
                     {/* For Master Orders, just show text since vendors manage sub-orders */}
                     <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                       MANAGED BY VENDORS
                     </Typography>
                  </TableCell>
                </TableRow>
              ))}
              
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                    No orders found
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