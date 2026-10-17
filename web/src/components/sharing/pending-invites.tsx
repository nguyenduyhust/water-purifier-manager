import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMyInvites } from '@/hooks/use-my-invites';
import { toast } from '@/hooks/use-toast';
import type { Invite } from '@/types';

/** Email invites waiting for the signed-in user; renders nothing when there are none */
export function PendingInvites() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { invites, accept, decline } = useMyInvites();
  const [busyId, setBusyId] = useState<string | null>(null);

  if (invites.length === 0) return null;

  const handle = async (invite: Invite, action: 'accept' | 'decline') => {
    setBusyId(invite.id);
    try {
      if (action === 'accept') {
        await accept(invite);
        toast({ title: t('sharing.accepted', { name: invite.purifierName }) });
        navigate(`/purifiers/${invite.purifierId}`);
      } else {
        await decline(invite);
      }
    } catch (error) {
      console.error('Invite action error:', error);
      toast({ variant: 'destructive', title: t('common.error'), description: t('sharing.errors.acceptFailed') });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Card className="border-primary/40">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
          {t('sharing.invitesForYou')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {invites.map((invite) => (
            <li key={invite.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm">
                {t('sharing.inviteFrom', {
                  name: invite.createdByName,
                  purifier: invite.purifierName,
                  role: t(`sharing.roles.${invite.role}`),
                })}
              </p>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" onClick={() => handle(invite, 'accept')} disabled={busyId !== null}>
                  {busyId === invite.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('sharing.accept')}
                </Button>
                <Button size="sm" variant="outline" onClick={() => handle(invite, 'decline')} disabled={busyId !== null}>
                  {t('sharing.decline')}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
