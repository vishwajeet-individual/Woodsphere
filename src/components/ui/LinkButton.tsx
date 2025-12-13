'use client';

import { Button, ButtonProps } from '@mui/material';
import Link from 'next/link';

// Extends MUI Button props but requires 'href'
interface LinkButtonProps extends ButtonProps {
  href: string;
}

export default function LinkButton(props: LinkButtonProps) {
  // ⚠️ Inside this Client Component, passing functions (Link) is allowed
  return <Button component={Link} {...props} />;
}