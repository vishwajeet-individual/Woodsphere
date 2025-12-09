'use client';

import { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, IconButton, Badge, Menu, MenuItem, 
  Container, Box, Stack, Divider, Drawer, List, ListItem, ListItemButton, ListItemText
} from '@mui/material';
import { 
  ShoppingBagOutlined, Search as SearchIcon, Menu as MenuIcon, 
  PersonOutline, Logout, Login
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

// --- Menu Data ---
const MENU_ITEMS = [
  { label: 'Living Room', slug: 'living-room' },
  { label: 'Bedroom', slug: 'bedroom' },
  { label: 'Dining', slug: 'dining-kitchen' },
  { label: 'Office', slug: 'office' },
  { label: 'Kids', slug: 'kids-outdoor' },
  { label: 'Décor', slug: 'decor' },
];

// --- Styled Components ---
const GlassAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: alpha('#ffffff', 0.8),
  backdropFilter: 'blur(20px)',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(0,0,0,0.05)',
  color: '#1d1d1f',
}));

const NavButton = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: '#424245',
  fontSize: '0.9rem',
  fontWeight: 500,
  padding: '8px 16px',
  borderRadius: 50,
  transition: 'all 0.2s',
  '&:hover': {
    color: '#000',
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
}));

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount } = useCart();
  
  // Handlers
  const handleProfileOpen = (event: React.MouseEvent<HTMLElement>) => setProfileAnchor(event.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  
  const handleLogout = () => {
    handleProfileClose();
    signOut({ callbackUrl: '/' });
  };

  const handleLoginNav = () => {
    handleProfileClose();
    router.push('/login');
  };

  const handleRegisterNav = () => {
    handleProfileClose();
    router.push('/register');
  };

  return (
    <>
    <GlassAppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 64 }}>
          
          {/* 1. Mobile Menu Icon */}
          <IconButton 
            edge="start" 
            color="inherit" 
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* 2. Logo */}
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h6" sx={{ fontFamily: 'Inter', fontWeight: 700, letterSpacing: '-0.5px' }}>
              Woodsphere.
            </Typography>
          </Link>

          {/* 3. Desktop Navigation (Centered) */}
          <Stack 
            direction="row" 
            spacing={0.5} 
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              position: 'absolute', 
              left: '50%', 
              transform: 'translateX(-50%)' 
            }}
          >
            {MENU_ITEMS.map((item) => (
              <NavButton key={item.slug} href={`/search?category=${item.slug}`}>
                {item.label}
              </NavButton>
            ))}
          </Stack>

          {/* 4. Right Actions */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton color="inherit" onClick={() => router.push('/search')}>
                <SearchIcon />
            </IconButton>
            
            <IconButton color="inherit" onClick={() => router.push('/cart')}>
              <Badge badgeContent={cartCount} color="error">
                <ShoppingBagOutlined />
              </Badge>
            </IconButton>
            
            {/* 5. Profile Icon (Always Visible) */}
            <IconButton onClick={handleProfileOpen} color="inherit">
                <PersonOutline />
            </IconButton>
            
            {/* 6. Profile Dropdown Menu */}
            <Menu
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={handleProfileClose}
              PaperProps={{ 
                sx: { 
                    mt: 1.5, 
                    width: 200, 
                    borderRadius: 3, 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                } 
              }}
            >
              {session ? (
                // LOGGED IN MENU
                <Box>
                  <MenuItem onClick={() => { handleProfileClose(); router.push('/profile'); }}>Profile</MenuItem>
                  <MenuItem onClick={() => { handleProfileClose(); router.push('/orders'); }}>My Orders</MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <Logout fontSize="small" sx={{ mr: 1 }}/> Logout
                  </MenuItem>
                </Box>
              ) : (
                // LOGGED OUT MENU
                <Box>
                  <MenuItem onClick={handleLoginNav}>
                    <Login fontSize="small" sx={{ mr: 1 }}/> Sign In
                  </MenuItem>
                  <MenuItem onClick={handleRegisterNav}>
                    Create Account
                  </MenuItem>
                </Box>
              )}
            </Menu>
          </Stack>
        </Toolbar>
      </Container>
    </GlassAppBar>

    {/* Mobile Drawer */}
    <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
    >
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold">Woodsphere.</Typography>
        </Box>
        <Divider />
        <List>
            {MENU_ITEMS.map((item) => (
                <ListItem key={item.slug} disablePadding>
                    <ListItemButton component={Link} href={`/search?category=${item.slug}`}>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            {!session && (
                 <ListItem disablePadding>
                    <ListItemButton component={Link} href="/login">
                        <ListItemText primary="Sign In / Register" />
                    </ListItemButton>
                </ListItem>
            )}
        </List>
    </Drawer>
    </>
  );
}