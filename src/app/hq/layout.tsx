'use client';

import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Avatar, Stack } from '@mui/material';
import { Dashboard, Store, People, Settings, Logout, Language } from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const DRAWER_WIDTH = 260;

const MENU = [
  { text: 'Platform Overview', icon: <Dashboard />, href: '/hq' },
  { text: 'Manage Stores', icon: <Store />, href: '/hq/stores' },
  { text: 'Users', icon: <People />, href: '/hq/users' },
  { text: 'Settings', icon: <Settings />, href: '/hq/settings' },
];

export default function HQLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f7' }}>
      
      {/* Sidebar - Dark Theme for HQ */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: '#1a1a1a', // Dark background
            color: '#fff',
            borderRight: 'none',
          },
        }}
      >
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
           <Language sx={{ color: '#0071e3' }} />
           <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: '-0.5px' }}>
             Woodsphere HQ
           </Typography>
        </Box>
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        <List sx={{ px: 2, py: 2 }}>
          <Typography variant="caption" fontWeight={700} color="rgba(255,255,255,0.5)" sx={{ px: 2, mb: 1, display: 'block' }}>
            SUPER ADMIN
          </Typography>
          {MENU.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton 
                component={Link} 
                href={item.href}
                selected={pathname === item.href}
                sx={{ 
                  borderRadius: 2, 
                  color: 'rgba(255,255,255,0.7)',
                  '&.Mui-selected': { bgcolor: '#0071e3', color: '#fff' },
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: '#fff' }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 'auto', p: 2 }}>
           <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#0071e3', fontSize: '0.8rem' }}>HQ</Avatar>
              <Box>
                 <Typography variant="body2" fontWeight={600}>Platform Admin</Typography>
                 <Typography 
                    variant="caption" 
                    color="error.main" 
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