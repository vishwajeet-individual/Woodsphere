'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginAction } from '@/lib/actions/auth';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { Box, Button, Paper, TextField, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(async () => {
      const res = await loginAction(values);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Welcome back!");
      }
    });
  };

  return (
    <Paper 
      elevation={0}
      sx={{ p: 4, borderRadius: 4, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
    >
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Welcome Back
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Login to manage your orders or store.
      </Typography>

      <Box component="form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
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
          {isPending ? "Authenticating..." : "Sign In"}
        </Button>
        
        <Typography variant="body2" color="text.secondary">
          New to Woodsphere?{' '}
          <MuiLink component={Link} href="/register" underline="hover" fontWeight={600}>
            Create an account
          </MuiLink>
        </Typography>
      </Box>
    </Paper>
  );
}