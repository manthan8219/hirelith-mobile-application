import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import Onboarding2Screen from '../screens/Onboarding2Screen';
import Onboarding3Screen from '../screens/Onboarding3Screen';
import ResumeReviewScreen from '../screens/ResumeReviewScreen';
import Onboarding4Screen from '../screens/Onboarding4Screen';
import DashboardScreen from '../screens/DashboardScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import FeedScreen from '../screens/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import ApplicationScreen from '../screens/ApplicationScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import AuditScreen from '../screens/AuditScreen';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function SplashScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0B0F1A', alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color="#7C3AED" size="large" />
    </View>
  );
}

export default function RootNavigator() {
  const { firebaseUser, isAuthLoading, isOnboarded } = useAuth();

  // While Firebase resolves persisted session, show splash
  if (isAuthLoading) return <SplashScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!firebaseUser ? (
          // ── Auth stack ──────────────────────────────────────────────────────
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : !isOnboarded ? (
          // ── Onboarding stack ────────────────────────────────────────────────
          <>
            <Stack.Screen name="Onboarding"  component={OnboardingScreen}  />
            <Stack.Screen name="Onboarding2" component={Onboarding2Screen} />
            <Stack.Screen name="Onboarding3" component={Onboarding3Screen} />
            <Stack.Screen name="ResumeReview" component={ResumeReviewScreen} />
            <Stack.Screen name="Onboarding4" component={Onboarding4Screen} />
          </>
        ) : (
          // ── Main app stack ───────────────────────────────────────────────────
          <>
            <Stack.Screen name="Dashboard"     component={DashboardScreen}     />
            <Stack.Screen name="Home"          component={HomeScreen}          />
            <Stack.Screen name="Marketplace"   component={MarketplaceScreen}   />
            <Stack.Screen name="Feed"          component={FeedScreen}          />
            <Stack.Screen name="Profile"       component={ProfileScreen}       />
            <Stack.Screen name="Challenges"    component={ChallengesScreen}    />
            <Stack.Screen name="Audit"         component={AuditScreen}         />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Application"   component={ApplicationScreen}   />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
