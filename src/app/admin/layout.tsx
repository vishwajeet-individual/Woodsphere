'use client';

import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Avatar, Stack } from '@mui/material';
import { Dashboard, Inventory, ShoppingCart, Store, Logout } from '@mui/icons-material'; // Removed 'Person' (Customers) as sellers don't own users
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const DRAWER_WIDTH = 260;

const MENU_ITEMS = [
  { text: 'Overview', icon: <Dashboard />, href: '/admin' },
  { text: 'My Products', icon: <Inventory />, href: '/admin/products' },
  { text: 'Store Orders', icon: <ShoppingCart />, href: '/admin/orders' },
  // Removed Customers/Users - Sellers shouldn't manage global users
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f7' }}>
      
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0,0,0,0.08)',
            bgcolor: '#ffffff',
          },
        }}
      >
        {/* Brand */}
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
           <Box sx={{ width: 32, height: 32, bgcolor: '#ff9500', borderRadius: 1 }} /> {/* Orange for Seller */}
           <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: '-0.5px' }}>
             Seller Center
           </Typography>
        </Box>
        
        <Divider />

        {/* Menu */}
        <List sx={{ px: 2, py: 2 }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ px: 2, mb: 1, display: 'block' }}>
            STORE MANAGEMENT
          </Typography>
          {MENU_ITEMS.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton 
                component={Link} 
                href={item.href}
                selected={pathname === item.href}
                sx={{ 
                  borderRadius: 2, 
                  '&.Mui-selected': { bgcolor: 'rgba(255,149,0, 0.08)', color: '#e08400' },
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                }}
              >
                <ListItemIcon sx={{ color: pathname === item.href ? '#e08400' : 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500, fontSize: '0.95rem' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* User Profile */}
        <Box sx={{ mt: 'auto', p: 2 }}>
           {/* ⚠️ UPDATED LINK HERE */}
           <ListItemButton 
             component={Link} 
             href="/admin/redirect-store" 
             target="_blank" // Optional: Opens in new tab so they don't lose admin context
             sx={{ borderRadius: 2, mb: 1, color: 'text.secondary' }}
           >
              <ListItemIcon sx={{ minWidth: 40 }}><Store /></ListItemIcon>
              <ListItemText primary="View My Store" primaryTypographyProps={{ fontSize: '0.9rem' }} />
           </ListItemButton>
           
           <Divider sx={{ my: 1 }} />
           
           <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 1 }}>
              <Avatar src={session?.user?.image || undefined} sx={{ width: 32, height: 32, bgcolor: '#1d1d1f', fontSize: '0.8rem' }}>
                {session?.user?.name?.[0] || 'S'}
              </Avatar>
              <Box>
                 <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 120 }}>
                    {session?.user?.name}
                 </Typography>
                 <Typography 
                    variant="caption" 
                    color="error" 
                    sx={{ cursor: 'pointer', fontWeight: 500 }} 
                    onClick={() => signOut({ callbackUrl: '/' })}
                 >
                   Log Out
                 </Typography>
              </Box>
           </Stack>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        {children}
      </Box>
    </Box>
  );
}