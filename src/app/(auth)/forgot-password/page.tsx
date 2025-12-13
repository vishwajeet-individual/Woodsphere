'use client';

import { useState, useTransition } from 'react';
import { Box, Button, Paper, TextField, Typography, Alert } from '@mui/material';
import { forgotPasswordAction } from '@/lib/actions/auth';
import Link from 'next/link';
import { ArrowBack } from '@mui/icons-material';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: 'success'|'error', text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    
    startTransition(async () => {
      const res = await forgotPasswordAction(email);
      if (res.error) setMsg({ type: 'error', text: res.error });
      else setMsg({ type: 'success', text: res.success || "Check your email!" });
    });
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', maxWidth: 400, width: '100%' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>Forgot Password?</Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Enter your email address and we'll send you a link to reset your password.
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email Address"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
          required
          type="email"
        />

        {msg && (
            <Alert severity={msg.type} sx={{ mb: 3, textAlign: 'left' }}>{msg.text}</Alert>
        )}

        <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            size="large" 
            disabled={isPending}
            sx={{ borderRadius: 50, py: 1.5 }}
        >
            {isPending ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <Button component={Link} href="/login" startIcon={<ArrowBack />} sx={{ mt: 3, textTransform: 'none' }}>
        Back to Login
      </Button>
    </Paper>
  );
}