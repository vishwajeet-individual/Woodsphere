import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { 
  Box, Typography, Card, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Avatar, Chip 
} from '@mui/material';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getUsers() {
  return await prisma.user.findMany({
    where: { role: 'USER' }, // Only show buyers, not sellers/admins
    include: { 
      _count: { select: { orders: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export default async function HQUsersPage() {
  const session = await auth();
  // @ts-ignore
  if (session?.user?.role !== 'SUPER_ADMIN') redirect('/login');

  const users = await getUsers();

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
        Platform Users
      </Typography>

      <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f9fafb' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>USER</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>EMAIL</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>ROLE</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>ORDERS</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>JOINED</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
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
                    <Chip label="BUYER" size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                  </TableCell>
                  <TableCell>{user._count.orders}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('en-IN')}
                  </TableCell>
                </TableRow>
              ))}
              
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                    No users found.
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