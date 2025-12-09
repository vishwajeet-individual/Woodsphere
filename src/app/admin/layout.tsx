'use client';

import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Avatar, Stack } from '@mui/material';
import { Dashboard, Inventory, ShoppingCart, Person, Logout, Store } from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const DRAWER_WIDTH = 260;

const MENU_ITEMS = [
  { text: 'Overview', icon: <Dashboard />, href: '/admin' },
  { text: 'Products', icon: <Inventory />, href: '/admin/products' },
  { text: 'Orders', icon: <ShoppingCart />, href: '/admin/orders' },
  { text: 'Customers', icon: <Person />, href: '/admin/customers' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
           <Box sx={{ width: 32, height: 32, bgcolor: '#0071e3', borderRadius: 1 }} />
           <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: '-0.5px' }}>
             Woodsphere
           </Typography>
        </Box>
        
        <Divider />

        {/* Menu */}
        <List sx={{ px: 2, py: 2 }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ px: 2, mb: 1, display: 'block' }}>
            DASHBOARD
          </Typography>
          {MENU_ITEMS.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton 
                component={Link} 
                href={item.href}
                selected={pathname === item.href}
                sx={{ 
                  borderRadius: 2, 
                  '&.Mui-selected': { bgcolor: 'rgba(0,113,227, 0.08)', color: '#0071e3' },
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                }}
              >
                <ListItemIcon sx={{ color: pathname === item.href ? '#0071e3' : 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500, fontSize: '0.95rem' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Bottom Actions */}
        <Box sx={{ mt: 'auto', p: 2 }}>
           <ListItemButton component={Link} href="/" sx={{ borderRadius: 2, mb: 1, color: 'text.secondary' }}>
              <ListItemIcon sx={{ minWidth: 40 }}><Store /></ListItemIcon>
              <ListItemText primary="Back to Shop" primaryTypographyProps={{ fontSize: '0.9rem' }} />
           </ListItemButton>
           
           <Divider sx={{ my: 1 }} />
           
           <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#1d1d1f', fontSize: '0.8rem' }}>A</Avatar>
              <Box>
                 <Typography variant="body2" fontWeight={600}>Administrator</Typography>
                 <Typography 
                    variant="caption" 
                    color="error" 
                    sx={{ cursor: 'pointer', fontWeight: 500 }} 
                    onClick={() => signOut()}
                 >
                   Log Out
                 </Typography>
              </Box>
           </Stack>
        </Box>
      </Drawer>

      {/* Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        {children}
      </Box>
    </Box>
  );
}