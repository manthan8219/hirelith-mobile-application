import type { ParsedResume } from './resume';

// Navigation
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Onboarding: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  ResumeReview: {
    parsedResume: ParsedResume;
    userId: string;
  };
  Onboarding4: undefined;
  Dashboard: undefined;
  Marketplace: undefined;
  Feed: undefined;
  Profile: undefined;
  Challenges: undefined;
  Audit: undefined;
  Notifications: undefined;
  Application: {
    jobTitle: string;
    company: string;
    location: string;
    salary: string;
    matchScore: number;
    accentColor: string;
    iconName: string;
  };
};

// Legacy alias kept for backward compatibility
export interface User {
  id: string;
  name: string;
  email: string;
}

// Backend user returned from /api/users/sync
export interface BackendUser {
  id: string;
  firebaseUid: string;
  email: string | null;
  displayName: string | null;
  photoUrl: string | null;
  onboardingComplete: boolean;
}

// API Response
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
