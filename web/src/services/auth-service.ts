import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/config/firebase';

const googleProvider = new GoogleAuthProvider();

// Detect embedded webviews that block signInWithPopup
function isEmbeddedWebview(): boolean {
  const ua = navigator.userAgent || '';
  // Common embedded webview indicators: Facebook, Instagram, Zalo, LINE, etc.
  return /FBAN|FBAV|Instagram|Zalo|Line\/|MicroMessenger|WebView|wv\)/i.test(ua);
}

// Handle redirect result on page load (for embedded webview flow)
getRedirectResult(auth).catch(() => {
  // Silently ignore — if there's no redirect result, this is a normal page load
});

export const authService = {
  async signUp(email: string, password: string, displayName?: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }

    return userCredential.user;
  },

  async signIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  async signInWithGoogle(): Promise<User | null> {
    if (isEmbeddedWebview()) {
      // Redirect flow for embedded webviews (Zalo, Facebook, etc.)
      await signInWithRedirect(auth, googleProvider);
      // This won't return — the page will redirect to Google
      return null as unknown as User;
    }

    const userCredential = await signInWithPopup(auth, googleProvider);
    return userCredential.user;
  },

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  },

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  },
};
