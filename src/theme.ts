'use client';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { Inter } from 'next/font/google';

const inter = Inter({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
});

let theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: { fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 },
    h2: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h3: { fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 },
    h4: { fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { lineHeight: 1.5 },
    body1: { lineHeight: 1.6 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#0071e3', // Apple Blue
      light: '#47a1ff',
      dark: '#004494',
    },
    secondary: {
      main: '#1d1d1f', // Apple Black
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f7',
    },
    text: {
      primary: '#1d1d1f',
      secondary: '#86868b',
    },
    error: {
      main: '#ff3b30',
    },
    success: {
      main: '#34c759',
    },
    warning: {
      main: '#ff9500',
    },
  },
  // ⬇️ 1. SHARPER GLOBAL SHAPE
  shape: {
    borderRadius: 8, // Standard, professional roundness (was 16)
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '20px',
          paddingRight: '20px',
          '@media (min-width: 600px)': {
            paddingLeft: '32px',
            paddingRight: '32px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // ⬇️ 2. BUTTONS ARE NOW RECTANGLES, NOT PILLS
          borderRadius: 8, 
          boxShadow: 'none',
          padding: '10px 24px',
          fontSize: '0.95rem',
          '&:hover': { 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
            transform: 'translateY(-1px)'
          },
        },
        containedPrimary: { color: '#fff' },
        sizeLarge: { padding: '12px 28px', fontSize: '1rem' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          // ⬇️ 3. CARDS MATCH GLOBAL SHAPE
          borderRadius: 12, // Slightly rounder than buttons for container feel
          backgroundImage: 'none',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // ⬇️ 4. INPUTS MATCH BUTTONS
          borderRadius: 8, 
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          color: '#1d1d1f',
        }
      }
    }
  },
  cssVariables: true, 
});

theme = responsiveFontSizes(theme);

export default theme;