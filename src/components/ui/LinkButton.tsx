// src/components/ui/LinkButton.tsx
'use client';

import { Button, ButtonProps } from '@mui/material';
import Link from 'next/link';

// Extends MUI Button props but adds 'href'
interface LinkButtonProps extends ButtonProps {
  href: string;
}

export default function LinkButton({ href, ...props }: LinkButtonProps) {
  return (
    <Button 
      component={Link} 
      href={href} 
      {...props} 
    />
  );
}