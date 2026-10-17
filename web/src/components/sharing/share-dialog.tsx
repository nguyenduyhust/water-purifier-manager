import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { Copy, Link2, Loader2, Mail, Trash2, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/auth-context';
import { useSharing } from '@/hooks/use-sharing';
import { toast } from '@/hooks/use-toast';
import { inviteLink } from '@/lib/sharing';
import type { MemberRole, Purifier } from '@/types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ShareDialogProps {
  purifier: Purifier;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDialog({ purifier, open, onOpenChange }: ShareDialogProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'vi' ? vi : enUS;
  const { user } = useAuth();
  const { invites, createInvite, revokeInvite, changeRole, removeMember } = useSharing(purifier);

  const [role, setRole] = useState<MemberRole>('editor');
  const [email, setEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  const trimmedEmail = email.trim();
  const emailValid = trimmedEmail === '' || EMAIL_PATTERN.test(trimmedEmail);
  const memberIds = purifier.memberIds ?? [];
  const profileName = (memberId: string) =>
    purifier.memberProfiles?.[memberId]?.name || purifier.memberProfiles?.[memberId]?.email || memberId;

  const showError = (description: string) =>
    toast({ variant: 'destructive', title: t('common.error'), description });

  const copy = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast({ title: t('sharing.linkCopied') });
    } catch {
      showError(t('sharing.errors.generic'));
    }
  };

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const id = await createInvite(role, trimmedEmail || null);
      setCreatedLink(inviteLink(id));
      setEmail('');
    } catch (error) {
      console.error('Create invite error:', error);
      showError(t('sharing.errors.inviteFailed'));
    } finally {
      setIsCreating(false);
    }
  };

  const run = async (action: () => Promise<void>, successTitle?: string) => {
    try {
      await action();
      if (successTitle) toast({ title: successTitle });
    } catch (error) {
      console.error('Sharing action error:', error);
      showError(t('sharing.errors.generic'));
    }
  };

  const roleLabel = (value: string) => t(`sharing.roles.${value}`);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) setCreatedLink(null);
          onOpenChange(next);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('sharing.shareTitle', { name: purifier.name })}</DialogTitle>
            <DialogDescription>{t('sharing.shareDescription')}</DialogDescription>
          </DialogHeader>

          {/* Invite */}
          <section className="space-y-3">
            <h3 className="text-sm font-medium">{t('sharing.invitePeople')}</h3>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="space-y-1.5">
                <Label htmlFor="invite-email">{t('sharing.emailOptional')}</Label>
                <Input
                  id="invite-email"
                  type="email"
                  autoComplete="off"
                  placeholder={t('sharing.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!emailValid}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="invite-role">{t('sharing.role')}</Label>
                <Select value={role} onValueChange={(value) => setRole(value as MemberRole)}>
                  <SelectTrigger id="invite-role" className="sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">{roleLabel('editor')}</SelectItem>
                    <SelectItem value="viewer">{roleLabel('viewer')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {t(`sharing.roleDescriptions.${role}`)}. {t('sharing.emailHint')}
            </p>
            <Button onClick={handleCreate} disabled={isCreating || !emailValid} className="w-full sm:w-auto">
              {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Link2 className="mr-2 h-4 w-4" />}
              {t('sharing.createInvite')}
            </Button>

            {createdLink && (
              <div className="rounded-md border bg-muted/50 p-3 space-y-2">
                <p className="text-sm font-medium">{t('sharing.inviteCreated')}</p>
                <p className="text-xs text-muted-foreground">{t('sharing.inviteCreatedDescription')}</p>
                <div className="flex gap-2">
                  <Input readOnly value={createdLink} onFocus={(e) => e.target.select()} aria-label={t('sharing.copyLink')} />
                  <Button variant="outline" size="icon" onClick={() => copy(createdLink)} aria-label={t('sharing.copyLink')}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </section>

          {/* Pending invites */}
          {invites.length > 0 && (
            <>
              <Separator />
              <section className="space-y-3">
                <h3 className="text-sm font-medium">{t('sharing.pendingInvites')}</h3>
                <ul className="space-y-2">
                  {invites.map((invite) => (
                    <li key={invite.id} className="flex items-center gap-3">
                      {invite.email ? (
                        <Mail className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      ) : (
                        <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">{invite.email ?? t('sharing.linkInvite')}</p>
                        <p className="text-xs text-muted-foreground">
                          {roleLabel(invite.role)} ·{' '}
                          {t('sharing.expiresOn', { date: format(invite.expiresAt.toDate(), 'd MMM', { locale }) })}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => copy(inviteLink(invite.id))} aria-label={t('sharing.copyLink')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => run(() => revokeInvite(invite.id), t('sharing.inviteRevoked'))}
                        aria-label={t('sharing.revoke')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}

          {/* Members */}
          <Separator />
          <section className="space-y-3">
            <h3 className="text-sm font-medium">{t('sharing.members')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    {user?.displayName || user?.email} ({t('sharing.you')})
                  </p>
                  {user?.displayName && user.email && (
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  )}
                </div>
                <Badge variant="secondary">{roleLabel('owner')}</Badge>
              </li>
              {memberIds.map((memberId) => (
                <li key={memberId} className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{profileName(memberId)}</p>
                    {purifier.memberProfiles?.[memberId]?.email && (
                      <p className="truncate text-xs text-muted-foreground">
                        {purifier.memberProfiles[memberId].email}
                      </p>
                    )}
                  </div>
                  <Select
                    value={purifier.roles?.[memberId] ?? 'viewer'}
                    onValueChange={(value) => run(() => changeRole(memberId, value as MemberRole))}
                  >
                    <SelectTrigger className="w-36" aria-label={t('sharing.role')}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="editor">{roleLabel('editor')}</SelectItem>
                      <SelectItem value="viewer">{roleLabel('viewer')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMemberToRemove(memberId)}
                    aria-label={t('sharing.remove')}
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        </DialogContent>
      </Dialog>

      <AlertDialog open={memberToRemove !== null} onOpenChange={(next) => !next && setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('sharing.removeMemberTitle', { name: memberToRemove ? profileName(memberToRemove) : '' })}
            </AlertDialogTitle>
            <AlertDialogDescription>{t('sharing.removeMemberDescription')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (memberToRemove) run(() => removeMember(memberToRemove), t('sharing.memberRemoved'));
                setMemberToRemove(null);
              }}
            >
              {t('sharing.remove')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
