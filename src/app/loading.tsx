'use client';

import { Box, CircularProgress, Typography, keyframes } from '@mui/material';

// Gentle pulse animation for the text
const pulse = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`;

export default function Loading() {
  return (
    <Box 
      sx={{ 
        height: '100vh', 
        width: '100vw', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        bgcolor: '#ffffff',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999
      }}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        {/* Background Circle */}
        <CircularProgress 
           variant="determinate" 
           value={100} 
           size={60} 
           thickness={4} 
           sx={{ color: '#f5f5f7' }} 
        />
        {/* Active Spinner */}
        <CircularProgress 
           variant="indeterminate" 
           disableShrink 
           size={60} 
           thickness={4} 
           sx={{ 
             color: 'primary.main',
             position: 'absolute',
             left: 0,
             [`& .MuiCircularProgress-circle`]: {
                strokeLinecap: 'round',
             },
           }} 
        />
      </Box>

      <Typography 
        variant="h6" 
        fontWeight={700} 
        sx={{ 
          mt: 3, 
          letterSpacing: '-0.5px', 
          color: '#1d1d1f',
          animation: `${pulse} 1.5s ease-in-out infinite` 
        }}
      >
        Woodsphere.
      </Typography>
    </Box>
  );
}