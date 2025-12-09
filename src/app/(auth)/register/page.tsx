'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerAction } from '@/lib/actions/auth'; // Ensure this action exists
import { useTransition } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Box, Button, Paper, TextField, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      registerAction(values).then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("Account created! Please sign in.");
          router.push('/login');
        }
      });
    });
  };

  return (
    <Paper 
      elevation={0}
      sx={{ p: 4, borderRadius: 4, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
    >
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Create Account
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Join Woodsphere today.
      </Typography>

      <Box component="form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <TextField
          margin="normal"
          fullWidth
          label="Full Name"
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
          sx={{ mt: 3, mb: 2, borderRadius: 50, py: 1.5 }}
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Sign Up"}
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