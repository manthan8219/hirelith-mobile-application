import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

const IOS_API_KEY = 'test_YmRTAFybCMYVVQzlCRPUmyFPpSw';
const ANDROID_API_KEY = 'test_YmRTAFybCMYVVQzlCRPUmyFPpSw';
const PRO_ENTITLEMENT = 'Hirehilth Pro';

interface RevenueCatContextType {
  isPro: boolean;
  isLoading: boolean;
  presentPaywall: () => Promise<boolean>;
  refreshEntitlements: () => Promise<void>;
}

const RevenueCatContext = createContext<RevenueCatContextType | null>(null);

export function RevenueCatProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Configure SDK once on mount
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    Purchases.configure({
      apiKey: Platform.OS === 'ios' ? IOS_API_KEY : ANDROID_API_KEY,
    });

    // Sync purchase identity whenever Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          // Tie RevenueCat purchases to this Firebase user
          await Purchases.logIn(fbUser.uid);
        } else {
          await Purchases.logOut();
        }
        const info = await Purchases.getCustomerInfo();
        setIsPro(typeof info.entitlements.active[PRO_ENTITLEMENT] !== 'undefined');
      } catch (err) {
        console.warn('[RevenueCat] Failed to sync user:', err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const refreshEntitlements = useCallback(async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      setIsPro(typeof info.entitlements.active[PRO_ENTITLEMENT] !== 'undefined');
    } catch (err) {
      console.warn('[RevenueCat] Failed to refresh entitlements:', err);
    }
  }, []);

  const presentPaywall = useCallback(async (): Promise<boolean> => {
    try {
      const result = await RevenueCatUI.presentPaywall();
      switch (result) {
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          await refreshEntitlements();
          return true;
        case PAYWALL_RESULT.NOT_PRESENTED:
        case PAYWALL_RESULT.ERROR:
        case PAYWALL_RESULT.CANCELLED:
        default:
          return false;
      }
    } catch (err) {
      console.warn('[RevenueCat] Paywall error:', err);
      return false;
    }
  }, [refreshEntitlements]);

  return (
    <RevenueCatContext.Provider value={{ isPro, isLoading, presentPaywall, refreshEntitlements }}>
      {children}
    </RevenueCatContext.Provider>
  );
}

export function useRevenueCat(): RevenueCatContextType {
  const ctx = useContext(RevenueCatContext);
  if (!ctx) throw new Error('useRevenueCat must be used within RevenueCatProvider');
  return ctx;
}
