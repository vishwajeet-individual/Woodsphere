'use client';

import { useState, useTransition, useEffect } from 'react';
import { loginAction, loginWithPhoneAction } from '@/lib/actions/auth';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { 
  Box, Button, Paper, TextField, Typography, Link as MuiLink, 
  InputAdornment, Divider, Collapse 
} from '@mui/material';
import { Google, ArrowForward } from '@mui/icons-material';
import Link from 'next/link';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebase';
import { detectInputType } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [password, setPassword] = useState('');
  const [inputType, setInputType] = useState<'email' | 'phone' | 'invalid'>('invalid');
  const [isPending, startTransition] = useTransition();
  
  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmObj, setConfirmObj] = useState<any>(null);

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setInputType(detectInputType(val));
  };

  // --- FLOW A: Email + Password ---
  const handleEmailLogin = () => {
    startTransition(async () => {
      const res = await loginAction({ email: inputValue, password });
      if (res?.error) toast.error(res.error);
      else toast.success("Welcome back!");
    });
  };

  // --- FLOW B: Phone + OTP ---
  useEffect(() => {
    // Only init if phone mode active
    if (inputType === 'phone') {
      try {
        // 1. CLEANUP: If an old verifier exists, destroy it first
        if (window.recaptchaVerifier) {
          try {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = undefined;
          } catch (e) {
            console.warn("Recaptcha cleanup warning", e);
          }
        }

        // 2. CHECK: Ensure DOM element exists before attaching
        const container = document.getElementById('recaptcha-container');
        if (container) {
          window.recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': () => {
               // Captcha solved
            },
            'expired-callback': () => {
               toast.error("Captcha expired. Please try again.");
            }
          });
        }
      } catch (e) {
        console.error("Recaptcha Init Error", e);
      }
    }

    // 3. UNMOUNT: Cleanup when user leaves page or switches input type
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = undefined;
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [inputType]); // Re-run only when input type changes

  const handleSendOtp = async () => {
    try {
      toast.loading("Sending OTP...");
      const formattedPhone = `+91${inputValue}`;
      const confirmation = await signInWithPhoneNumber(firebaseAuth, formattedPhone, window.recaptchaVerifier);
      toast.dismiss();
      toast.success("OTP Sent to " + formattedPhone);
      setConfirmObj(confirmation);
      setOtpSent(true);
    } catch (err: any) {
      toast.dismiss();
      console.error(err);
      toast.error(err.message || "Failed to send OTP. Try again.");
      // Reset captcha if failed
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    }
  };

  // ⚠️ FIXED VERIFICATION LOGIC
  const handleVerifyOtp = async () => {
    const toastId = toast.loading("Verifying...");
    
    try {
      // 1. Verify with Firebase Client
      const res = await confirmObj.confirm(otp);
      const idToken = await res.user.getIdToken();

      // 2. Login with NextAuth Server Action
      const actionRes = await loginWithPhoneAction(idToken);
      
      // 3. Handle Fallback (If server didn't redirect automatically)
      toast.dismiss(toastId);

      if (actionRes?.error) {
        toast.error(actionRes.error);
      } else {
        // Force client-side redirect if server action finished without error
        toast.success("Login Successful!");
        // Use router.push('/') if inside a transition/action, but window.location.href 
        // is often required to break out of nested authentication logic flow.
        window.location.href = '/'; 
      }

    } catch (err: any) {
      toast.dismiss(toastId);
      
      // ⚠️ CATCH REDIRECT ERROR: This is actually a SUCCESS
      if (err.message === 'NEXT_REDIRECT' || err.message.includes('NEXT_REDIRECT')) {
          window.location.href = '/';
          return;
      }

      console.error(err);
      toast.error("Invalid OTP or Login Failed");
    }
  };
  
  // --- Main Submit Logic ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpSent) return handleVerifyOtp();
    if (inputType === 'email') return handleEmailLogin();
    if (inputType === 'phone') return handleSendOtp();
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', maxWidth: 400, width: '100%' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>Welcome Back</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>Enter your email or mobile number to continue.</Typography>

      <form onSubmit={handleSubmit}>
        
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

        <div id="recaptcha-container"></div>

        {/* Case 1: Email -> Show Password and Forgot Link */}
        <Collapse in={inputType === 'email'}>
            <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 1 }} // Reduced margin to make space for the link
            />
            {/* ⚠️ ADDED: Forgot password link */}
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button component={Link} href="/forgot-password" size="small" sx={{ textTransform: 'none', fontSize: '0.8rem' }}>
                    Forgot password?
                </Button>
            </Box>
        </Collapse>

        {/* Case 2: Phone -> Show OTP Input after sending */}
        <Collapse in={otpSent}>
            <TextField
                label="Enter OTP"
                fullWidth
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                sx={{ mb: 2 }}
                autoFocus
            />
        </Collapse>

        <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            size="large" 
            disabled={inputType === 'invalid' || isPending}
            sx={{ borderRadius: 50, py: 1.5 }}
            endIcon={!otpSent ? <ArrowForward /> : null}
        >
            {isPending ? "Processing..." : 
              otpSent ? "Verify & Login" : 
              inputType === 'email' ? "Sign In with Password" : 
              inputType === 'phone' ? "Get OTP" : "Continue"}
        </Button>

      </form>

      <Divider sx={{ my: 3 }}>OR</Divider>

      <Button 
        variant="outlined" fullWidth startIcon={<Google />} 
        onClick={() => signIn("google", { callbackUrl: "/" })}
        sx={{ borderRadius: 50, py: 1.5, borderColor: '#ddd', color: 'text.primary' }}
      >
        Continue with Google
      </Button>

      <Box mt={3}>
        <Typography variant="body2" color="text.secondary">
          New here? <MuiLink component={Link} href="/register" underline="hover" fontWeight={600}>Create account</MuiLink>
        </Typography>
      </Box>
    </Paper>
  );
}

declare global { interface Window { recaptchaVerifier: any; } }