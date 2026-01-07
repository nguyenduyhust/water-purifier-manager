import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth-context';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Toaster } from '@/components/ui/toaster';
import { LoginPage } from '@/pages/auth/login';
import { RegisterPage } from '@/pages/auth/register';
import { ForgotPasswordPage } from '@/pages/auth/forgot-password';
import { DashboardPage } from '@/pages/dashboard';
import { PurifiersPage } from '@/pages/purifiers';
import { NewPurifierPage } from '@/pages/purifiers/new';
import { PurifierDetailPage } from '@/pages/purifiers/detail';
import { EditPurifierPage } from '@/pages/purifiers/edit';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <AuthGuard>
                <DashboardPage />
              </AuthGuard>
            }
          />
          <Route
            path="/purifiers"
            element={
              <AuthGuard>
                <PurifiersPage />
              </AuthGuard>
            }
          />
          <Route
            path="/purifiers/new"
            element={
              <AuthGuard>
                <NewPurifierPage />
              </AuthGuard>
            }
          />
          <Route
            path="/purifiers/:id"
            element={
              <AuthGuard>
                <PurifierDetailPage />
              </AuthGuard>
            }
          />
          <Route
            path="/purifiers/:id/edit"
            element={
              <AuthGuard>
                <EditPurifierPage />
              </AuthGuard>
            }
          />

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
