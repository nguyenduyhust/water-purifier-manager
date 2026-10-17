import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { INVITE_TTL_DAYS } from '@/lib/sharing';
import type { Actor, Invite, MemberRole, Purifier } from '@/types';

const INVITES_COLLECTION = 'invites';
const DAY_MS = 24 * 60 * 60 * 1000;

export type InviteProblem = 'notFound' | 'expired' | 'used' | 'declined' | 'wrongEmail' | 'unverifiedEmail' | 'ownPurifier';

function byNewest(a: Invite, b: Invite) {
  return b.createdAt.toMillis() - a.createdAt.toMillis();
}

export const sharingService = {
  async createInvite(purifier: Purifier, role: MemberRole, email: string | null, owner: Actor): Promise<string> {
    // Members have no other way to see who owns the purifier.
    if (purifier.ownerName !== owner.name) {
      await updateDoc(doc(db, 'purifiers', purifier.id), { ownerName: owner.name });
    }

    const ref = doc(collection(db, INVITES_COLLECTION));
    await setDoc(ref, {
      purifierId: purifier.id,
      purifierName: purifier.name,
      role,
      email: email ? email.trim().toLowerCase() : null,
      status: 'pending',
      createdBy: owner.id,
      createdByName: owner.name,
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromMillis(Date.now() + INVITE_TTL_DAYS * DAY_MS),
    });
    return ref.id;
  },

  async revokeInvite(inviteId: string): Promise<void> {
    await deleteDoc(doc(db, INVITES_COLLECTION, inviteId));
  },

  /** Pending invites the owner created for a purifier */
  subscribeToPurifierInvites(purifierId: string, ownerId: string, callback: (invites: Invite[]) => void): () => void {
    const q = query(
      collection(db, INVITES_COLLECTION),
      where('createdBy', '==', ownerId),
      where('purifierId', '==', purifierId),
      where('status', '==', 'pending')
    );
    return onSnapshot(q, (snapshot) => {
      const invites = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Invite);
      callback(invites.sort(byNewest));
    });
  },

  /** Pending invites addressed to the signed-in user's email */
  subscribeToMyInvites(email: string, callback: (invites: Invite[]) => void): () => void {
    const q = query(
      collection(db, INVITES_COLLECTION),
      where('email', '==', email.toLowerCase()),
      where('status', '==', 'pending')
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const now = Date.now();
        const invites = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }) as Invite)
          .filter((invite) => invite.expiresAt.toMillis() > now);
        callback(invites.sort(byNewest));
      },
      (error) => {
        console.error('My invites subscription error:', error);
        callback([]);
      }
    );
  },

  async getInvite(inviteId: string): Promise<Invite | null> {
    const snapshot = await getDoc(doc(db, INVITES_COLLECTION, inviteId));
    return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Invite) : null;
  },

  /** Why the user cannot accept this invite, if anything */
  inviteProblem(
    invite: Invite | null,
    user: { uid: string; email: string | null; emailVerified: boolean }
  ): InviteProblem | null {
    if (!invite) return 'notFound';
    if (invite.createdBy === user.uid) return 'ownPurifier';
    if (invite.status === 'accepted') return 'used';
    if (invite.status === 'declined') return 'declined';
    if (invite.expiresAt.toMillis() <= Date.now()) return 'expired';
    if (invite.email) {
      if (!user.email || user.email.toLowerCase() !== invite.email) return 'wrongEmail';
      if (!user.emailVerified) return 'unverifiedEmail';
    }
    return null;
  },

  /**
   * Joins the purifier and marks the invite used in one batch; the security
   * rules check each write against the other.
   */
  async acceptInvite(invite: Invite, member: Actor & { email: string | null }): Promise<void> {
    const batch = writeBatch(db);
    batch.update(doc(db, 'purifiers', invite.purifierId), {
      memberIds: arrayUnion(member.id),
      [`roles.${member.id}`]: invite.role,
      [`memberProfiles.${member.id}`]: { name: member.name, email: member.email, joinedAt: Timestamp.now() },
      lastInviteId: invite.id,
    });
    batch.update(doc(db, INVITES_COLLECTION, invite.id), {
      status: 'accepted',
      acceptedBy: member.id,
      acceptedAt: serverTimestamp(),
    });
    await batch.commit();
  },

  async declineInvite(inviteId: string): Promise<void> {
    await updateDoc(doc(db, INVITES_COLLECTION, inviteId), { status: 'declined' });
  },

  async changeRole(purifierId: string, memberId: string, role: MemberRole): Promise<void> {
    await updateDoc(doc(db, 'purifiers', purifierId), { [`roles.${memberId}`]: role });
  },

  /** Owner removing a member, or a member leaving */
  async removeMember(purifierId: string, memberId: string): Promise<void> {
    await updateDoc(doc(db, 'purifiers', purifierId), {
      memberIds: arrayRemove(memberId),
      [`roles.${memberId}`]: deleteField(),
      [`memberProfiles.${memberId}`]: deleteField(),
    });
  },
};
