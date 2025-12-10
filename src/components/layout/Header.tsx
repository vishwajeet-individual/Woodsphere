'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, IconButton, Badge, Menu, MenuItem, 
  Container, Box, Stack, Divider, Drawer, List, ListItem, ListItemButton, ListItemText,
  useScrollTrigger, Avatar, InputBase, Paper, Collapse
} from '@mui/material';
import { 
  ShoppingBagOutlined, Search, Menu as MenuIcon, 
  Logout, Close,  ExpandLess, ExpandMore,
  Weekend, Bed, TableBar, Chair, ChildCare, LocalFlorist, LocalOffer, MoreHoriz
} from '@mui/icons-material';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const NAV_TREE = [
  { label: 'Living', slug: 'living-room', icon: <Weekend />, subs: [{ label: 'Sofas', slug: 'sofas-seating' }, { label: 'Coffee Tables', slug: 'coffee-side-tables' }, { label: 'TV Units', slug: 'tv-units' }, { label: 'Storage', slug: 'storage' }] },
  { label: 'Bedroom', slug: 'bedroom', icon: <Bed />, subs: [{ label: 'Beds', slug: 'beds' }, { label: 'Mattresses', slug: 'mattresses' }, { label: 'Wardrobes', slug: 'wardrobes' }, { label: 'Bedside Tables', slug: 'bedside-tables' }] },
  { label: 'Dining', slug: 'dining-kitchen', icon: <TableBar />, subs: [{ label: 'Dining Sets', slug: 'dining-sets' }, { label: 'Chairs', slug: 'chairs-benches' }, { label: 'Bar Furniture', slug: 'bar-furniture' }] },
  { label: 'Office', slug: 'office', icon: <Chair />, subs: [{ label: 'Office Chairs', slug: 'office-chairs' }, { label: 'Desks', slug: 'office-desks' }, { label: 'Study Tables', slug: 'study-tables' }] },
  { label: 'Kids', slug: 'kids-outdoor', icon: <ChildCare />, subs: [{ label: 'Kids Beds', slug: 'kids-beds-storage' }, { label: 'Study for Kids', slug: 'study-for-kids' }] },
  { label: 'Décor', slug: 'decor', icon: <LocalFlorist />, subs: [{ label: 'Lighting', slug: 'lighting' }, { label: 'Rugs', slug: 'rugs-carpets' }, { label: 'Wall Decor', slug: 'wall-decor-mirrors' }] },
  { 
    label: 'More', 
    slug: 'more', 
    icon: <MoreHoriz />, 
    subs: [
      { label: 'Pet Furniture', slug: 'pet-furniture' },
      { label: 'Entryway', slug: 'entryway' },
      { label: 'About Us', slug: 'about', href: '/about' },
      { label: 'Contact', slug: 'contact', href: '/contact' },
      { label: 'Support Center', slug: 'support', href: '/support' }
    ] 
  },
  { label: 'Sale', slug: 'sale', icon: <LocalOffer />, isSale: true, subs: [] },
];

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const { cartCount } = useCart();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const desktopSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  const isScrolled = useScrollTrigger({ disableHysteresis: true, threshold: 10 });

  useEffect(() => {
    if (isSearchOpen && desktopSearchRef.current) setTimeout(() => desktopSearchRef.current?.focus(), 100);
  }, [isSearchOpen]);

  useEffect(() => {
    if (mobileOpen && mobileSearchRef.current) setTimeout(() => mobileSearchRef.current?.focus(), 300);
  }, [mobileOpen]);

  const handleProfileOpen = (event: React.MouseEvent<HTMLElement>) => setProfileAnchor(event.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);
  const handleLogout = () => { handleProfileClose(); signOut({ callbackUrl: '/' }); };
  const handleMobileExpand = (slug: string) => setMobileExpanded(mobileExpanded === slug ? null : slug);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('q');
    if (query) {
      router.push(`/search?q=${query}`);
      setIsSearchOpen(false);
      setMobileOpen(false);
    }
  };

  // Robust link resolver for mixed navigation types (Sub-menu items)
  const getSubLink = (parentSlug: string, sub: any) => sub.href || `/search?category=${parentSlug}&sub=${sub.slug}`;
  
  // Standard category link resolver (Main menu items)
  const getCategoryLink = (slug: string) => slug === 'sale' ? '/search?sale=true' : `/category/${slug}`;

  return (
    <>
    <AppBar 
      position="sticky"
      sx={{ 
        bgcolor: isScrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(20px)',
        boxShadow: isScrolled ? '0 1px 0 rgba(0,0,0,0.05)' : 'none',
        borderBottom: '1px solid',
        borderColor: isScrolled ? 'transparent' : 'rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        color: '#1d1d1f',
        py: 0.5
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 64 }}>
          
          <Box display="flex" alignItems="center">
            <IconButton 
              edge="start" 
              color="inherit" 
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: 'none' }, mr: 1 }}
            >
              <MenuIcon />
            </IconButton>

            <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontFamily: 'Inter', fontWeight: 800, letterSpacing: '-0.5px' }}>
                Woodsphere.
              </Typography>
            </Link>
          </Box>

          {/* CENTER: Desktop Mega Menu */}
          <Stack 
            direction="row" 
            spacing={1} 
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              position: 'absolute', left: '50%', transform: 'translateX(-50%)',
              height: '100%', alignItems: 'center'
            }}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            {NAV_TREE.map((item) => (
              <Box key={item.slug} onMouseEnter={() => setHoveredMenu(item.slug)} sx={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
                
                {/* ⚠️ ROBUST DESKTOP BUTTON LOGIC (Fixes Hydration) */}
                {item.isSale ? (
                  // Case 1: Sale (Direct Link)
                  <Button
                    component={Link}
                    href={getCategoryLink(item.slug)}
                    sx={{
                      color: '#d32f2f',
                      bgcolor: 'rgba(211, 47, 47, 0.04)',
                      textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 2,
                      '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.08)', color: '#d32f2f' }
                    }}
                  >
                    {item.label}
                  </Button>
                ) : (
                  // Case 2: Category Trigger (Button, opens popover/drawer)
                  <Button
                    sx={{
                      color: '#424245',
                      bgcolor: 'transparent',
                      textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 2,
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.04)', color: '#000' }
                    }}
                  >
                    {item.label}
                  </Button>
                )}

                {/* Mega Menu Popover */}
                {!item.isSale && hoveredMenu === item.slug && (
                  <Paper elevation={4} sx={{ position: 'absolute', top: '60px', left: '50%', transform: 'translateX(-50%)', minWidth: 240, borderRadius: 3, p: 1, zIndex: 1300, animation: 'fadeIn 0.2s ease-out', '@keyframes fadeIn': { '0%': { opacity: 0, transform: 'translateX(-50%) translateY(10px)' }, '100%': { opacity: 1, transform: 'translateX(-50%) translateY(0)' } } }}>
                    
                    {/* Sub Menu Links */}
                    {item.subs.map((sub) => (
                      <MenuItem key={sub.slug} component={Link} href={getSubLink(item.slug, sub)} onClick={() => setHoveredMenu(null)} sx={{ borderRadius: 2, fontSize: '0.9rem', color: '#424245', mb: 0.5 }}>{sub.label}</MenuItem>
                    ))}
                    
                    {/* View All Link (Points to Category Landing Page) */}
                    {item.slug !== 'more' && (
                        <>
                            <Divider sx={{ my: 1 }} />
                            <MenuItem component={Link} href={getCategoryLink(item.slug)} onClick={() => setHoveredMenu(null)} sx={{ borderRadius: 2, fontSize: '0.85rem', fontWeight: 700, color: 'primary.main' }}>View All {item.label}</MenuItem>
                        </>
                    )}
                  </Paper>
                )}
              </Box>
            ))}
          </Stack>

          {/* RIGHT: Actions */}
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <IconButton color="inherit" onClick={() => setMobileOpen(true)} sx={{ display: { xs: 'flex', sm: 'none' } }}><Search /></IconButton>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                {isSearchOpen ? (
                   <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f5f5f7', px: 2, py: 0.5, borderRadius: 2, width: 240, border: '1px solid rgba(0,0,0,0.05)' }}>
                     <Search sx={{ fontSize: 20, color: 'text.secondary', mr: 1 }} />
                     <InputBase inputRef={desktopSearchRef} name="q" placeholder="Search..." sx={{ flex: 1, fontSize: '0.9rem' }} />
                     <IconButton size="small" onClick={() => setIsSearchOpen(false)}><Close fontSize="small" /></IconButton>
                   </Box>
                ) : (
                   <IconButton color="inherit" onClick={() => setIsSearchOpen(true)}><Search /></IconButton>
                )}
            </Box>
            <IconButton color="inherit" onClick={() => router.push('/cart')}><Badge badgeContent={cartCount} color="error"><ShoppingBagOutlined /></Badge></IconButton>
            {session ? (
              <>
                <IconButton onClick={handleProfileOpen} sx={{ p: 0.5 }}><Avatar src={session.user?.image || undefined} sx={{ width: 32, height: 32, bgcolor: '#0071e3', fontSize: '0.9rem' }}>{session.user?.name?.[0] || 'U'}</Avatar></IconButton>
                <Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={handleProfileClose} PaperProps={{ sx: { mt: 1.5, width: 220, borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } }} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                  <MenuItem onClick={() => router.push('/profile')}>Profile</MenuItem>
                  <MenuItem onClick={() => router.push('/orders')}>My Orders</MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}><Logout fontSize="small" sx={{ mr: 1 }}/> Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button component={Link} href="/login" variant="contained" sx={{ borderRadius: 2, textTransform: 'none', boxShadow: 'none', bgcolor: '#1d1d1f', display: { xs: 'none', md: 'flex' } }}>Sign In</Button>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>

    {/* --- MOBILE DRAWER --- */}
    <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: '85%', maxWidth: 320, bgcolor: '#ffffff', overflow: 'visible' } }}
    >
        {/* Floating Close Button */}
        {mobileOpen && (
          <IconButton 
             onClick={() => setMobileOpen(false)}
             sx={{ 
                position: 'absolute', top: 10, right: -50, color: 'white', bgcolor: 'rgba(0,0,0,0.5)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
             }}
          >
             <Close />
          </IconButton>
        )}

        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center' }}>
            <Link href="/" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>
               <Typography variant="h6" fontWeight={800}>Woodsphere.</Typography>
            </Link>
        </Box>

        <Box px={2} mb={2}>
           <form onSubmit={handleSearchSubmit}>
             <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f5f5f7', px: 2, py: 1.5, borderRadius: 2 }}>
                <Search sx={{ color: 'text.secondary', mr: 1 }} />
                <InputBase inputRef={mobileSearchRef} name="q" placeholder="Search..." fullWidth sx={{ fontSize: '0.95rem' }} />
             </Box>
           </form>
        </Box>

        <Divider />

        <List sx={{ px: 1, overflowY: 'auto', height: '100%' }}>
            {NAV_TREE.map((item) => (
                <Box key={item.slug}>
                    <ListItem disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton 
                          // MOBILE: Category Title links to Category Page
                          component={Link}
                          href={getCategoryLink(item.slug)}
                          onClick={item.isSale ? undefined : () => handleMobileExpand(item.slug)}
                          sx={{ 
                              borderRadius: 2, 
                              color: item.isSale ? '#d32f2f' : 'inherit',
                              bgcolor: item.isSale ? 'rgba(211, 47, 47, 0.04)' : 'transparent' 
                          }}
                        >
                            <Box sx={{ mr: 2, color: item.isSale ? 'inherit' : 'text.secondary', display: 'flex' }}>{item.icon}</Box>
                            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
                            {!item.isSale && (mobileExpanded === item.slug ? <ExpandLess color="action" /> : <ExpandMore color="action" />)}
                        </ListItemButton>
                    </ListItem>
                    {!item.isSale && (
                        <Collapse in={mobileExpanded === item.slug} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pl: 2, ml: 2, borderLeft: '2px solid #f0f0f0' }}>
                                {item.subs.map((sub) => (
                                    <ListItemButton key={sub.slug} component={Link} href={getSubLink(item.slug, sub)} onClick={() => setMobileOpen(false)} sx={{ borderRadius: 2, py: 1 }}>
                                        <ListItemText primary={sub.label} primaryTypographyProps={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                                    </ListItemButton>
                                ))}
                                {item.slug !== 'more' && (
                                    <ListItemButton component={Link} href={getCategoryLink(item.slug)} onClick={() => setMobileOpen(false)} sx={{ borderRadius: 2, py: 1 }}>
                                        <ListItemText primary="View All" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 700, color: 'primary.main' }} />
                                    </ListItemButton>
                                )}
                            </List>
                        </Collapse>
                    )}
                </Box>
            ))}
        </List>

        <Box sx={{ p: 3, bgcolor: '#f9fafb', mt: 'auto' }}>
          {!session ? (
             <Button fullWidth component={Link} href="/login" variant="contained" size="large" sx={{ borderRadius: 2, py: 1.5, bgcolor: '#1d1d1f' }}>Sign In / Register</Button>
          ) : (
             <Button fullWidth variant="outlined" color="error" onClick={handleLogout} sx={{ borderRadius: 2 }}>Sign Out</Button>
          )}
        </Box>
    </Drawer>
    </>
  );
}