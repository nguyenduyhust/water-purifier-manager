import {
  deleteUser,
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  type User,
} from 'firebase/auth';
import { collection, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { purifierService } from './purifier-service';
import { sharingService } from './sharing-service';

// Firestore batches hold at most 500 writes.
const BATCH_LIMIT = 450;

export class UnsupportedSignInMethodError extends Error {
  constructor() {
    super('Re-authentication for this sign-in method is not available on the web');
    this.name = 'UnsupportedSignInMethodError';
  }
}

export type SignInMethod = 'password' | 'google' | 'apple' | 'unknown';

export function signInMethodOf(user: User): SignInMethod {
  const providers = user.providerData.map((p) => p.providerId);
  if (providers.includes('password')) return 'password';
  if (providers.includes('google.com')) return 'google';
  if (providers.includes('apple.com')) return 'apple';
  return 'unknown';
}

async function deleteWhere(collectionName: string, field: string, userId: string): Promise<void> {
  const snapshot = await getDocs(query(collection(db, collectionName), where(field, '==', userId)));
  for (let i = 0; i < snapshot.docs.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    snapshot.docs.slice(i, i + BATCH_LIMIT).forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
}

export const accountService = {
  /** Firebase only deletes accounts that signed in recently, so confirm the user first. */
  async reauthenticate(user: User, password?: string): Promise<void> {
    switch (signInMethodOf(user)) {
      case 'password':
        await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email ?? '', password ?? ''));
        return;
      case 'google':
        await reauthenticateWithPopup(user, new GoogleAuthProvider());
        return;
      default:
        // Sign in with Apple is only set up in the iOS app.
        throw new UnsupportedSignInMethodError();
    }
  },

  /**
   * Deletes everything the user owns, removes them from purifiers shared with
   * them, then deletes the Firebase account. Call reauthenticate() first.
   */
  async deleteAccount(user: User): Promise<void> {
    const purifiers = await purifierService.getAll(user.uid);
    for (const purifier of purifiers) {
      if (purifier.userId === user.uid) {
        await purifierService.delete(purifier.id, user.uid);
      } else {
        await sharingService.removeMember(purifier.id, user.uid);
      }
    }
    // Invites whose purifier is already gone, and history from before sharing.
    await deleteWhere('invites', 'createdBy', user.uid);
    await deleteWhere('activityLogs', 'userId', user.uid);

    await deleteUser(user);
  },
};
