export function detectInputType(value: string): 'email' | 'phone' | 'invalid' {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Allows 10 digits (India/US)
  const phoneRegex = /^[6-9]\d{9}$/; 

  if (emailRegex.test(value)) return 'email';
  if (phoneRegex.test(value)) return 'phone';
  return 'invalid';
}