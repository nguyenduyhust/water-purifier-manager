import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { actorFromUser } from '@/lib/sharing';
import { sharingService } from '@/services/sharing-service';
import type { Invite, MemberRole, Purifier } from '@/types';

interface UseSharingReturn {
  invites: Invite[];
  createInvite: (role: MemberRole, email: string | null) => Promise<string>;
  revokeInvite: (inviteId: string) => Promise<void>;
  changeRole: (memberId: string, role: MemberRole) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  leave: () => Promise<void>;
}

/** Sharing actions for one purifier; pending invites are only loaded for its owner */
export function useSharing(purifier: Purifier | null): UseSharingReturn {
  const { user } = useAuth();
  const [invites, setInvites] = useState<Invite[]>([]);
  const isOwner = !!user && purifier?.userId === user.uid;
  const purifierId = purifier?.id;

  useEffect(() => {
    if (!user || !purifierId || !isOwner) {
      setInvites([]);
      return;
    }
    return sharingService.subscribeToPurifierInvites(purifierId, user.uid, setInvites);
  }, [user, purifierId, isOwner]);

  const createInvite = useCallback(
    async (role: MemberRole, email: string | null) => {
      if (!user || !purifier) throw new Error('User not authenticated');
      return sharingService.createInvite(purifier, role, email, actorFromUser(user));
    },
    [user, purifier]
  );

  const revokeInvite = useCallback((inviteId: string) => sharingService.revokeInvite(inviteId), []);

  const changeRole = useCallback(
    async (memberId: string, role: MemberRole) => {
      if (!purifierId) return;
      await sharingService.changeRole(purifierId, memberId, role);
    },
    [purifierId]
  );

  const removeMember = useCallback(
    async (memberId: string) => {
      if (!purifierId) return;
      await sharingService.removeMember(purifierId, memberId);
    },
    [purifierId]
  );

  const leave = useCallback(async () => {
    if (!user || !purifierId) return;
    await sharingService.removeMember(purifierId, user.uid);
  }, [user, purifierId]);

  return { invites, createInvite, revokeInvite, changeRole, removeMember, leave };
}
