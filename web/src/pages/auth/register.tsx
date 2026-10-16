import { Navigate } from 'react-router-dom';
import { Droplets } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { RegisterForm } from '@/components/auth/register-form';

export function RegisterPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex items-center gap-2">
        <Droplets className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">Water Purifier Manager</h1>
      </div>
      <RegisterForm />
    </div>
  );
}
