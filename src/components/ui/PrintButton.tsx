// src/components/ui/PrintButton.tsx
'use client';

import { Button } from '@mui/material';
import { Print } from '@mui/icons-material';

export default function PrintButton() {
  return (
    <Button 
      startIcon={<Print />} 
      sx={{ borderRadius: 50 }}
      onClick={() => window.print()} 
    >
      Print Invoice
    </Button>
  );
}