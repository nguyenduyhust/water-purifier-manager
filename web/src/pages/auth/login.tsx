import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppLogo } from '@/components/app-logo';
import { rememberReturnTo, takeReturnTo } from '@/lib/return-to';
import { useAuth } from '@/contexts/auth-context';
import { LoginForm } from '@/components/auth/login-form';

export function LoginPage() {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    rememberReturnTo(location);
  }, [location]);

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to={takeReturnTo(location)} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex items-center gap-2">
        <AppLogo className="h-10 w-10" />
        <h1 className="text-2xl font-bold">Water Purifier Manager</h1>
      </div>
      <LoginForm />
    </div>
  );
}
