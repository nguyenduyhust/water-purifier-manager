import type { User } from 'firebase/auth';
import type { AccessRole, Actor, Purifier } from '@/types';

export const INVITE_TTL_DAYS = 7;

export function getAccessRole(purifier: Purifier, userId: string | undefined): AccessRole | null {
  if (!userId) return null;
  if (purifier.userId === userId) return 'owner';
  if (purifier.memberIds?.includes(userId)) return purifier.roles?.[userId] ?? null;
  return null;
}

export function canEdit(role: AccessRole | null): boolean {
  return role === 'owner' || role === 'editor';
}

export function actorFromUser(user: User): Actor {
  return { id: user.uid, name: user.displayName || user.email || '' };
}

export function inviteLink(inviteId: string): string {
  return `${window.location.origin}/invite/${inviteId}`;
}
