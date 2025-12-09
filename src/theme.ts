// src/theme.ts
'use client';

import { createTheme } from '@mui/material/styles';
import { Inter } from 'next/font/google';

// 1. Initialize the Google Font
const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// 2. Create the Theme
const theme = createTheme({
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 500 }, // No ALL CAPS buttons
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#0071e3', // Apple Blue
    },
    secondary: {
      main: '#86868b', // Tech Grey
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f7', // Light Grey Background for cards
    },
    text: {
      primary: '#1d1d1f', // Soft Black (not pure #000)
      secondary: '#86868b',
    },
    error: {
      main: '#ff3b30', // Apple Red
    },
    success: {
      main: '#34c759', // Apple Green
    }
  },
  shape: {
    borderRadius: 12, // Softer corners globally
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50, // Pill shapes for all buttons
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
           color: '#fff',
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' }, // Remove default MUI overlay
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(20px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          color: '#1d1d1f',
        }
      }
    }
  },
  cssVariables: true, // Enable CSS variables for easier custom styling
});

export default theme;