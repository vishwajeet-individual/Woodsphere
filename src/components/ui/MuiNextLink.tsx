'use client';

import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material';
import NextLink from 'next/link';

// Extends MUI Link props but requires 'href'
interface MuiNextLinkProps extends MuiLinkProps {
  href: string;
}

export default function MuiNextLink(props: MuiNextLinkProps) {
  // ⚠️ Inside this Client Component, passing NextLink is allowed
  return <MuiLink component={NextLink} {...props} />;
}