'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerAction, loginAction } from '@/lib/actions/auth';
import { useTransition, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Box, Button, Paper, TextField, Typography, Link as MuiLink, ToggleButton, ToggleButtonGroup, Stack } from '@mui/material';
import { Person, Store } from '@mui/icons-material';
import Link from 'next/link';

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [accountType, setAccountType] = useState<'buyer' | 'seller'>('buyer');

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(async () => {
      // 1. Create Account
      const res = await registerAction(values);
      
      if (res.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Account created! Logging you in...");

      // 2. Auto Login
      // We catch the redirect error because NextAuth throws a redirect as an error
      try {
          await loginAction(values); // This will redirect to '/'
      } catch (e) {
          // If we are a seller, we want to intercept and go to /sell
          if (accountType === 'seller') {
             // Force client-side redirect to store setup
             window.location.href = '/sell'; 
             return;
          }
          // Otherwise allow standard redirect behavior
          throw e;
      }
    });
  };

  return (
    <Paper 
      elevation={0}
      sx={{ p: 4, borderRadius: 4, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
    >
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Join Woodsphere
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Create an account to get started.
      </Typography>

      {/* Account Type Toggle */}
      <ToggleButtonGroup
        value={accountType}
        exclusive
        onChange={(_, val) => val && setAccountType(val)}
        fullWidth
        sx={{ mb: 3 }}
      >
        <ToggleButton value="buyer" sx={{ borderRadius: 4, textTransform: 'none', py: 1 }}>
           <Person sx={{ mr: 1, fontSize: 20 }} /> Customer
        </ToggleButton>
        <ToggleButton value="seller" sx={{ borderRadius: 4, textTransform: 'none', py: 1 }}>
           <Store sx={{ mr: 1, fontSize: 20 }} /> Seller
        </ToggleButton>
      </ToggleButtonGroup>

      <Box component="form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <TextField
          margin="normal"
          fullWidth
          label={accountType === 'seller' ? "Business / Owner Name" : "Full Name"}
          {...form.register("name")}
          error={!!form.formState.errors.name}
          helperText={form.formState.errors.name?.message}
          disabled={isPending}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Email Address"
          {...form.register("email")}
          error={!!form.formState.errors.email}
          helperText={form.formState.errors.email?.message}
          disabled={isPending}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          {...form.register("password")}
          error={!!form.formState.errors.password}
          helperText={form.formState.errors.password?.message}
          disabled={isPending}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3, mb: 2, borderRadius: 8, py: 1.5 }}
          disabled={isPending}
        >
          {isPending ? "Creating..." : (accountType === 'seller' ? "Continue to Store Setup" : "Sign Up")}
        </Button>
        
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <MuiLink component={Link} href="/login" underline="hover" fontWeight={600}>
            Sign in
          </MuiLink>
        </Typography>
      </Box>
    </Paper>
  );
}