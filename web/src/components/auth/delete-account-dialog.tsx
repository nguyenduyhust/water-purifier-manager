import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FirebaseError } from 'firebase/app';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import { toast } from '@/hooks/use-toast';
import { signInMethodOf, UnsupportedSignInMethodError } from '@/services/account-service';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountDialog({ open, onOpenChange }: DeleteAccountDialogProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, deleteAccount } = useAuth();
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const method = user ? signInMethodOf(user) : 'unknown';
  const canDeleteHere = method === 'password' || method === 'google';

  const handleOpenChange = (next: boolean) => {
    if (isDeleting) return;
    if (!next) {
      setPassword('');
      setError(null);
    }
    onOpenChange(next);
  };

  const errorMessage = (err: unknown): string | null => {
    if (err instanceof UnsupportedSignInMethodError) return t('account.deleteUseIos');
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case 'auth/popup-closed-by-user':
        case 'auth/cancelled-popup-request':
          return null;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
        case 'auth/missing-password':
          return t('auth.errors.invalidCredential');
        case 'auth/user-mismatch':
          return t('account.deleteWrongAccount');
        case 'auth/too-many-requests':
          return t('auth.errors.tooManyRequests');
      }
    }
    return t('account.deleteFailed');
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteAccount(method === 'password' ? password : undefined);
      toast({ title: t('account.deleted') });
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Delete account error:', err);
      setError(errorMessage(err));
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('account.deleteTitle')}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              <p>{t('account.deleteDescription')}</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>{t('account.deleteOwned')}</li>
                <li>{t('account.deleteShared')}</li>
              </ul>
              <p className="font-medium text-destructive">{t('account.deleteIrreversible')}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {method === 'password' && (
          <div className="space-y-2">
            <Label htmlFor="delete-account-password">{t('account.deletePasswordLabel')}</Label>
            <Input
              id="delete-account-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isDeleting}
            />
          </div>
        )}
        {method === 'google' && <p className="text-sm text-muted-foreground">{t('account.deleteGoogleHint')}</p>}
        {!canDeleteHere && <p className="text-sm text-muted-foreground">{t('account.deleteUseIos')}</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>{t('common.cancel')}</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!canDeleteHere || isDeleting || (method === 'password' && !password)}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('account.deleteConfirm')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
