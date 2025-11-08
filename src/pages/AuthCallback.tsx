import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Exchange the code for a session
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        // Get the redirect path from storage or default to /impact
        const redirectPath = sessionStorage.getItem('auth_redirect') || '/impact';
        sessionStorage.removeItem('auth_redirect');
        
        toast.success('Signed in successfully');
        navigate(redirectPath, { replace: true });
      } catch (error: any) {
        console.error('[AuthCallback] Error:', error);
        setError(error.message || 'Authentication failed');
        toast.error('Authentication failed. Please try again.');
        
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">Authentication Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <h1 className="text-2xl font-bold">Signing you in...</h1>
        <p className="text-muted-foreground">Please wait while we authenticate your session</p>
      </div>
    </div>
  );
}
