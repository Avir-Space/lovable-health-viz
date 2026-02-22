import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Mail, KeyRound } from 'lucide-react';

const DEMO_EMAIL = 'demo@avir.space';
const DEMO_PASSWORD = 'avir-demo-2025';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'password' | 'magic'>('password');
  const [emailSent, setEmailSent] = useState(false);

  const redirect = () => {
    const dest = sessionStorage.getItem('auth_redirect') || '/';
    sessionStorage.removeItem('auth_redirect');
    navigate(dest, { replace: true });
  };

  const handlePasswordSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !email.includes('@')) { setError('Please enter a valid email address'); return; }
    if (!password) { setError('Please enter your password'); return; }

    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        // Auto-create/confirm demo account on first use
        if (email === DEMO_EMAIL && (signInError.message.includes('Invalid login credentials') || signInError.message.includes('Email not confirmed'))) {
          await supabase.functions.invoke('ensure-demo-user');
          const { error: retryError } = await supabase.auth.signInWithPassword({ email, password });
          if (retryError) throw retryError;
        } else {
          throw signInError;
        }
      }

      toast.success('Signed in successfully');
      redirect();
    } catch (err: any) {
      console.error('[Login] Error:', err);
      setError(err.message || 'Failed to sign in');
      toast.error('Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !email.includes('@')) { setError('Please enter a valid email address'); return; }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
      setEmailSent(true);
      toast.success('Check your email for the sign-in link');
    } catch (err: any) {
      console.error('[Login] Error:', err);
      setError(err.message || 'Failed to send sign-in link');
      toast.error('Failed to send sign-in link');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setMode('password');
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Check Your Email</h1>
            <p className="text-muted-foreground">
              We've sent a sign-in link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Click the link in the email to sign in. You can close this window.
            </p>
          </div>
          <Button variant="outline" onClick={() => { setEmailSent(false); setEmail(''); }} className="w-full">
            Use a different email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-muted-foreground">
            {mode === 'password' ? 'Enter your email and password' : 'Enter your email to receive a sign-in link'}
          </p>
        </div>

        <form onSubmit={mode === 'password' ? handlePasswordSignIn : handleMagicLink} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              autoFocus
              autoComplete="email"
            />
          </div>

          {mode === 'password' && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                autoComplete="current-password"
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive" role="alert">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading || !email}>
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
            ) : mode === 'password' ? (
              <><KeyRound className="mr-2 h-4 w-4" /> Sign In</>
            ) : (
              <><Mail className="mr-2 h-4 w-4" /> Send Magic Link</>
            )}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'password' ? 'magic' : 'password')}
            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
          >
            {mode === 'password' ? 'Sign in with magic link instead' : 'Sign in with password instead'}
          </button>
        </div>

        {/* Demo credentials hint */}
        <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Demo Account</p>
          <div className="text-sm space-y-1">
            <p><span className="text-muted-foreground">Email:</span> <code className="text-foreground">{DEMO_EMAIL}</code></p>
            <p><span className="text-muted-foreground">Password:</span> <code className="text-foreground">{DEMO_PASSWORD}</code></p>
          </div>
          <Button variant="outline" size="sm" onClick={fillDemo} className="w-full mt-2">
            Use Demo Account
          </Button>
        </div>
      </div>
    </div>
  );
}
