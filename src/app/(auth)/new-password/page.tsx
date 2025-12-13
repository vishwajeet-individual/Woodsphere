'use client';

import { useState, useTransition, Suspense } from 'react'; // Added Suspense
import { Button, Paper, TextField, Typography, Alert } from '@mui/material';
import { newPasswordAction } from '@/lib/actions/auth';
import { useSearchParams, useRouter } from 'next/navigation';

function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: 'success'|'error', text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
        setMsg({ type: 'error', text: "Missing token!" });
        return;
    }

    startTransition(async () => {
      const res = await newPasswordAction(token, password);
      if (res.error) {
        setMsg({ type: 'error', text: res.error });
      } else {
        setMsg({ type: 'success', text: "Password Reset Successfully!" });
        setTimeout(() => router.push('/login'), 2000);
      }
    });
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', maxWidth: 400, width: '100%' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>Reset Password</Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>Enter your new password below.</Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="New Password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
          required
          type="password"
        />

        {msg && <Alert severity={msg.type} sx={{ mb: 3 }}>{msg.text}</Alert>}

        <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            size="large" 
            disabled={isPending}
            sx={{ borderRadius: 50, py: 1.5 }}
        >
            {isPending ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </Paper>
  );
}

// ⚠️ Must wrap in Suspense because we use useSearchParams
export default function NewPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewPasswordForm />
        </Suspense>
    );
}