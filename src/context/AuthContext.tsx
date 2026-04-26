import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithCredential,
  User as FirebaseUser,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../config/firebase';
import { api, setTokenProvider } from '../services/api';

const ONBOARDING_KEY = '@hirelith:onboarded';

export interface BackendUser {
  id: string;
  firebaseUid: string;
  email: string | null;
  displayName: string | null;
  photoUrl: string | null;
  onboardingComplete: boolean;
}

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  backendUser: BackendUser | null;
  isAuthLoading: boolean;
  isOnboarded: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (idToken: string | null, accessToken?: string | null) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  markOnboarded: () => Promise<void>;
  refreshBackendUser: () => Promise<BackendUser | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [backendUser,  setBackendUser]  = useState<BackendUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isOnboarded,   setIsOnboarded]   = useState(false);

  // POST to backend to create/get user and check onboarding state
  const syncWithBackend = useCallback(async (fbUser: FirebaseUser) => {
    try {
      const user = await api.post<BackendUser>('/api/v1/users/sync', {
        firebaseUid: fbUser.uid,
        email:       fbUser.email,
        displayName: fbUser.displayName,
        photoUrl:    fbUser.photoURL,
      });
      setBackendUser(user);
      if (user.onboardingComplete) {
        await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
        setIsOnboarded(true);
      } else {
        setIsOnboarded(false);
      }
    } catch (err) {
      console.warn('[Auth] Backend sync failed, falling back to local cache:', err);
      const cached = await AsyncStorage.getItem(ONBOARDING_KEY);
      setIsOnboarded(cached === 'true');
    }
  }, []);

  useEffect(() => {
    // Inject Firebase ID token into every API request automatically
    setTokenProvider(() => auth.currentUser?.getIdToken() ?? Promise.resolve(null));

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        await syncWithBackend(fbUser);
      } else {
        setBackendUser(null);
        setIsOnboarded(false);
      }
      setIsAuthLoading(false);
    });

    return () => {
      unsubscribe();
      setTokenProvider(() => Promise.resolve(null));
    };
  }, [syncWithBackend]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will pick up the new user and call syncWithBackend
  }, []);

  const signInWithGoogle = useCallback(async (idToken: string | null, accessToken?: string | null) => {
    const credential = GoogleAuthProvider.credential(idToken, accessToken ?? undefined);
    await signInWithCredential(auth, credential);
  }, []);

  const signOut = useCallback(async () => {
    await fbSignOut(auth);
    await AsyncStorage.removeItem(ONBOARDING_KEY);
    setBackendUser(null);
    setIsOnboarded(false);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  const refreshBackendUser = useCallback(async (): Promise<BackendUser | null> => {
    const fbUser = auth.currentUser;
    if (!fbUser) return null;
    try {
      const user = await api.post<BackendUser>('/api/v1/users/sync', {
        firebaseUid: fbUser.uid,
        email:       fbUser.email,
        displayName: fbUser.displayName,
        photoUrl:    fbUser.photoURL,
      });
      setBackendUser(user);
      return user;
    } catch {
      return null;
    }
  }, []);

  const markOnboarded = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    setIsOnboarded(true);
    // Best-effort backend sync — requires backendUser to be populated
    if (backendUser?.id) {
      try {
        await api.patch(`/api/v1/onboarding/${backendUser.id}/complete`, {});
      } catch (err) {
        console.warn('[Auth] Failed to mark onboarding complete on backend:', err);
      }
    }
  }, [backendUser]);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        backendUser,
        isAuthLoading,
        isOnboarded,
        signInWithEmail,
        signInWithGoogle,
        signOut,
        resetPassword,
        markOnboarded,
        refreshBackendUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
