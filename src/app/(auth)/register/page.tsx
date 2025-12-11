'use client';

import { useState, useTransition, useEffect } from 'react';
import { registerAction, loginWithPhoneAction, loginAction } from '@/lib/actions/auth';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { 
  Box, Button, Paper, TextField, Typography, Link as MuiLink, 
  InputAdornment, Divider, Collapse, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import { Google, Person, Store } from '@mui/icons-material';
import Link from 'next/link';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebase';
import { detectInputType } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // Form State
  const [name, setName] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [password, setPassword] = useState('');
  const [inputType, setInputType] = useState<'email' | 'phone' | 'invalid'>('invalid');
  const [accountType, setAccountType] = useState<'buyer' | 'seller'>('buyer');

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmObj, setConfirmObj] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setInputType(detectInputType(val));
  };

  // --- RECAPTCHA ---
  useEffect(() => {
    if (inputType === 'phone' && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-reg-container', {
        'size': 'invisible',
        'callback': () => {}
      });
    }
  }, [inputType]);

  // --- SUBMIT HANDLER ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
        toast.error("Please enter your name");
        return;
    }

    if (otpSent) {
        verifyOtp();
    } else if (inputType === 'email') {
        registerEmail();
    } else if (inputType === 'phone') {
        sendOtp();
    }
  };

  const registerEmail = () => {
    startTransition(async () => {
      // ⚠️ FIX: Don't return toast result directly
      if (password.length < 6) {
         toast.error("Password too short");
         return; 
      }
      
      const res = await registerAction({ name, email: inputValue, password });
      
      if (res?.error) {
         toast.error(res.error);
         return;
      }
      
      toast.success("Account created!");
      // Auto-login
      try {
        await loginAction({ email: inputValue, password });
      } catch (e) {
        if (accountType === 'seller') window.location.href = '/sell';
      }
    });
  };

  const sendOtp = async () => {
    try {
      toast.loading("Sending OTP...");
      const formattedPhone = `+91${inputValue}`;
      const confirmation = await signInWithPhoneNumber(firebaseAuth, formattedPhone, window.recaptchaVerifier);
      toast.dismiss();
      toast.success("OTP Sent!");
      setConfirmObj(confirmation);
      setOtpSent(true);
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      toast.loading("Verifying...");
      const res = await confirmObj.confirm(otp);
      const idToken = await res.user.getIdToken();
      
      // Login/Create via Phone
      await loginWithPhoneAction(idToken);
      
      // Redirect
      if (accountType === 'seller') window.location.href = '/sell';
      else window.location.href = '/';
      
    } catch (err) {
      toast.dismiss();
      toast.error("Invalid OTP");
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', maxWidth: 400, width: '100%' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>Join Woodsphere</Typography>

      <ToggleButtonGroup
        value={accountType}
        exclusive
        onChange={(_, val) => val && setAccountType(val)}
        fullWidth
        sx={{ mb: 3 }}
      >
        <ToggleButton value="buyer" sx={{ borderRadius: 4, textTransform: 'none' }}><Person sx={{ mr: 1 }} /> Customer</ToggleButton>
        <ToggleButton value="seller" sx={{ borderRadius: 4, textTransform: 'none' }}><Store sx={{ mr: 1 }} /> Seller</ToggleButton>
      </ToggleButtonGroup>

      <form onSubmit={handleSubmit}>
        <TextField 
          label="Full Name" 
          fullWidth value={name} 
          onChange={(e) => setName(e.target.value)} 
          sx={{ mb: 2 }} 
          disabled={otpSent}
        />
        
        <TextField
          label="Email or Mobile Number"
          fullWidth
          value={inputValue}
          onChange={handleInputChange}
          disabled={otpSent || isPending}
          sx={{ mb: 2 }}
          InputProps={{
             startAdornment: inputType === 'phone' ? <InputAdornment position="start">+91</InputAdornment> : null
          }}
        />

        <div id="recaptcha-reg-container"></div>

        <Collapse in={inputType === 'email' && !otpSent}>
            <TextField
                label="Create Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
            />
        </Collapse>

        <Collapse in={otpSent}>
            <TextField
                label="Enter OTP"
                fullWidth
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                sx={{ mb: 2 }}
            />
        </Collapse>

        <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            size="large" 
            disabled={inputType === 'invalid' || isPending}
            sx={{ borderRadius: 50, py: 1.5 }}
        >
            {isPending ? "Creating..." : otpSent ? "Verify & Join" : "Continue"}
        </Button>
      </form>

      <Divider sx={{ my: 3 }}>OR</Divider>
      <Button variant="outlined" fullWidth startIcon={<Google />} onClick={() => signIn("google", { callbackUrl: accountType === 'seller' ? '/sell' : '/' })} sx={{ borderRadius: 50, py: 1.5, borderColor: '#ddd', color: 'text.primary' }}>
        Sign up with Google
      </Button>

      <Box mt={3}>
        <Typography variant="body2" color="text.secondary">
          Already have an account? <MuiLink component={Link} href="/login" underline="hover" fontWeight={600}>Sign in</MuiLink>
        </Typography>
      </Box>
    </Paper>
  );
}

// Ensure type augmentation
declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}