import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { actorFromUser } from '@/lib/sharing';
import { sharingService } from '@/services/sharing-service';
import type { Invite } from '@/types';

interface UseMyInvitesReturn {
  invites: Invite[];
  accept: (invite: Invite) => Promise<void>;
  decline: (invite: Invite) => Promise<void>;
}

/** Pending email invites sent to the signed-in user */
export function useMyInvites(): UseMyInvitesReturn {
  const { user } = useAuth();
  const [invites, setInvites] = useState<Invite[]>([]);
  const email = user?.emailVerified ? user.email : null;

  useEffect(() => {
    if (!email) {
      setInvites([]);
      return;
    }
    return sharingService.subscribeToMyInvites(email, setInvites);
  }, [email]);

  const accept = useCallback(
    async (invite: Invite) => {
      if (!user) throw new Error('User not authenticated');
      await sharingService.acceptInvite(invite, { ...actorFromUser(user), email: user.email });
    },
    [user]
  );

  const decline = useCallback((invite: Invite) => sharingService.declineInvite(invite.id), []);

  return { invites, accept, decline };
}
