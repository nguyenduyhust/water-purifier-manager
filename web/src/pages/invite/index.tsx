import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader2, Users } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { toast } from '@/hooks/use-toast';
import { actorFromUser, getAccessRole } from '@/lib/sharing';
import { purifierService } from '@/services/purifier-service';
import { sharingService, type InviteProblem } from '@/services/sharing-service';
import type { Invite } from '@/types';

type Problem = InviteProblem | 'alreadyMember';

export function InvitePage() {
  const { t } = useTranslation();
  const { inviteId } = useParams<{ inviteId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [invite, setInvite] = useState<Invite | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user || !inviteId) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      const loaded = await sharingService.getInvite(inviteId).catch(() => null);
      // Readable only once the user already has access.
      const purifier = loaded ? await purifierService.getById(loaded.purifierId).catch(() => null) : null;
      if (cancelled) return;

      setInvite(loaded);
      const role = purifier ? getAccessRole(purifier, user.uid) : null;
      setProblem(
        role && role !== 'owner'
          ? 'alreadyMember'
          : sharingService.inviteProblem(loaded, { uid: user.uid, email: user.email, emailVerified: user.emailVerified })
      );
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user, inviteId]);

  const handleAccept = async () => {
    if (!invite || !user) return;
    setBusy(true);
    try {
      await sharingService.acceptInvite(invite, { ...actorFromUser(user), email: user.email });
      toast({ title: t('sharing.accepted', { name: invite.purifierName }) });
      navigate(`/purifiers/${invite.purifierId}`, { replace: true });
    } catch (error) {
      console.error('Accept invite error:', error);
      toast({ variant: 'destructive', title: t('common.error'), description: t('sharing.errors.acceptFailed') });
      setBusy(false);
    }
  };

  const handleDecline = async () => {
    if (!invite) return;
    setBusy(true);
    try {
      await sharingService.declineInvite(invite.id);
    } catch (error) {
      console.error('Decline invite error:', error);
    }
    navigate('/', { replace: true });
  };

  const role = invite ? t(`sharing.roles.${invite.role}`) : '';

  return (
    <AppLayout>
      <div className="mx-auto max-w-md py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="h-5 w-5" aria-hidden="true" />
              </div>
              <CardTitle>{t('sharing.invitePageTitle')}</CardTitle>
              {invite && (
                <CardDescription>
                  {t('sharing.invitePageDescription', { name: invite.createdByName, purifier: invite.purifierName })}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {problem ? (
                <p className="text-sm">{t(`sharing.problems.${problem}`, { email: invite?.email ?? '' })}</p>
              ) : (
                invite && (
                  <p className="text-sm">
                    {t('sharing.joinAs', { role, description: t(`sharing.roleDescriptions.${invite.role}`).toLowerCase() })}
                  </p>
                )
              )}
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              {problem === 'alreadyMember' || problem === 'ownPurifier' ? (
                <Button asChild>
                  <Link to={`/purifiers/${invite?.purifierId}`}>{t('sharing.openPurifier')}</Link>
                </Button>
              ) : problem ? (
                <Button asChild variant="outline">
                  <Link to="/">{t('sharing.backToDashboard')}</Link>
                </Button>
              ) : (
                <>
                  <Button onClick={handleAccept} disabled={busy}>
                    {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('sharing.accept')}
                  </Button>
                  {/* Link invites can't be declined; leaving the page is enough. */}
                  {invite?.email ? (
                    <Button variant="outline" onClick={handleDecline} disabled={busy}>
                      {t('sharing.decline')}
                    </Button>
                  ) : (
                    <Button asChild variant="outline">
                      <Link to="/">{t('common.cancel')}</Link>
                    </Button>
                  )}
                </>
              )}
            </CardFooter>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
