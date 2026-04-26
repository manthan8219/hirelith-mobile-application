import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, AntDesign, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../../context/AuthContext';
import { styles } from './LoginScreen.styles';

// Required for OAuth redirect to resolve in Expo Go
WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get('window');

// Map Firebase auth error codes to user-friendly messages
function authErrorMessage(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Invalid email or password.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    default:
      return 'Sign in failed. Please try again.';
  }
}

// ─── Pulsing dot ─────────────────────────────────────────────────────────────
function PulseDot() {
  const scale   = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale,   { toValue: 2.2, duration: 900, useNativeDriver: true }),
          Animated.timing(scale,   { toValue: 1,   duration: 900, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0,   duration: 900, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.8, duration: 900, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.pulseDotWrap}>
      <Animated.View style={[styles.pulseDotRing, { transform: [{ scale }], opacity }]} />
      <View style={styles.pulseDotCore} />
    </View>
  );
}

// ─── Social button ────────────────────────────────────────────────────────────
function SocialButton({ label, icon, onPress, disabled }: { label: string; icon: React.ReactNode; onPress: () => void; disabled?: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn  = () => Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, tension: 300, friction: 10 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, tension: 300, friction: 10 }).start();

  return (
    <Animated.View style={[styles.socialBtn, { transform: [{ scale }], opacity: disabled ? 0.5 : 1 }]}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        disabled={disabled}
        style={styles.socialBtnInner}
        android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.06)' } : undefined}
      >
        {icon}
        <Text style={styles.socialBtnText}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── LoginScreen ──────────────────────────────────────────────────────────────
export default function LoginScreen() {
  const { signInWithEmail, signInWithGoogle, resetPassword } = useAuth();

  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [showPassword,    setShowPassword]    = useState(false);
  const [isLoading,       setIsLoading]       = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [emailFocused,    setEmailFocused]    = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailError,      setEmailError]      = useState('');
  const [passwordError,   setPasswordError]   = useState('');
  const [generalError,    setGeneralError]    = useState('');

  // Google OAuth — Web client ID is used by expo-auth-session in Expo Go
  const [request, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    clientId:        process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId:     process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  // Handle Google OAuth result
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { id_token, access_token } = googleResponse.params;
      setIsGoogleLoading(true);
      signInWithGoogle(id_token ?? null, access_token ?? null)
        .catch((err) => {
          const code = (err as { code?: string }).code ?? '';
          setGeneralError(authErrorMessage(code));
        })
        .finally(() => setIsGoogleLoading(false));
    } else if (googleResponse?.type === 'error') {
      setGeneralError('Google sign in failed. Please try again.');
      setIsGoogleLoading(false);
    }
  }, [googleResponse]);

  // ── Animated values ──────────────────────────────────────────────────────
  const logoFloat    = useRef(new Animated.Value(0)).current;
  const orb1Opacity  = useRef(new Animated.Value(0.08)).current;
  const orb2Opacity  = useRef(new Animated.Value(0.07)).current;
  const cardY        = useRef(new Animated.Value(50)).current;
  const cardOpacity  = useRef(new Animated.Value(0)).current;
  const logoY        = useRef(new Animated.Value(-30)).current;
  const logoOpacity  = useRef(new Animated.Value(0)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale  = useRef(new Animated.Value(1)).current;
  const shimmerX     = useRef(new Animated.Value(-width)).current;
  const emailBorder  = useRef(new Animated.Value(0)).current;
  const pwBorder     = useRef(new Animated.Value(0)).current;

  // ── Mount animations ─────────────────────────────────────────────────────
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoY,       { toValue: 0, useNativeDriver: true, tension: 60, friction: 12 }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(cardY,       { toValue: 0, useNativeDriver: true, tension: 55, friction: 11 }),
        Animated.timing(cardOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(badgeOpacity,  { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, { toValue: -10, duration: 3000, useNativeDriver: true }),
        Animated.timing(logoFloat, { toValue: 0,   duration: 3000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(orb1Opacity, { toValue: 0.18, duration: 2500, useNativeDriver: true }),
        Animated.timing(orb1Opacity, { toValue: 0.06, duration: 2500, useNativeDriver: true }),
      ])
    ).start();

    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(orb2Opacity, { toValue: 0.14, duration: 2200, useNativeDriver: true }),
          Animated.timing(orb2Opacity, { toValue: 0.04, duration: 2200, useNativeDriver: true }),
        ])
      ).start();
    }, 1200);
  }, []);

  // ── Shimmer during loading ────────────────────────────────────────────────
  useEffect(() => {
    if (isLoading) {
      shimmerX.setValue(-width);
      Animated.loop(
        Animated.timing(shimmerX, { toValue: width * 1.5, duration: 1100, useNativeDriver: true })
      ).start();
    } else {
      shimmerX.stopAnimation();
    }
  }, [isLoading]);

  // ── Interpolations ────────────────────────────────────────────────────────
  const emailBorderColor   = emailBorder.interpolate({ inputRange: [0, 1], outputRange: ['rgba(255,255,255,0.06)', 'rgba(139,92,246,0.55)'] });
  const pwBorderColor      = pwBorder.interpolate({    inputRange: [0, 1], outputRange: ['rgba(255,255,255,0.06)', 'rgba(139,92,246,0.55)'] });
  const emailShadowOpacity = emailBorder.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const pwShadowOpacity    = pwBorder.interpolate({    inputRange: [0, 1], outputRange: [0, 1] });

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleEmailFocus = useCallback((v: boolean) => {
    setEmailFocused(v);
    Animated.timing(emailBorder, { toValue: v ? 1 : 0, duration: 250, useNativeDriver: false }).start();
  }, []);

  const handlePwFocus = useCallback((v: boolean) => {
    setPasswordFocused(v);
    Animated.timing(pwBorder, { toValue: v ? 1 : 0, duration: 250, useNativeDriver: false }).start();
  }, []);

  const handlePressIn  = useCallback(() => Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true, tension: 300, friction: 8 }).start(), []);
  const handlePressOut = useCallback(() => Animated.spring(buttonScale, { toValue: 1,    useNativeDriver: true, tension: 300, friction: 8 }).start(), []);

  function isValidEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
  }

  const handleSignIn = useCallback(async () => {
    if (isLoading) return;

    let valid = true;
    setGeneralError('');

    if (!email.trim()) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Enter a valid email address.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;

    setIsLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
      // Navigation is handled automatically by RootNavigator via onAuthStateChanged
    } catch (err) {
      const code = (err as { code?: string }).code ?? '';
      setGeneralError(authErrorMessage(code));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, email, password, signInWithEmail]);

  const handleResetPassword = useCallback(() => {
    if (!email.trim() || !isValidEmail(email)) {
      Alert.alert('Reset Password', 'Enter your email address above first, then tap Reset.');
      return;
    }
    Alert.alert(
      'Reset Password',
      `Send a reset link to ${email.trim()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Link',
          onPress: async () => {
            try {
              await resetPassword(email.trim());
              Alert.alert('Sent!', 'Check your inbox for the reset link.');
            } catch {
              Alert.alert('Error', 'Could not send reset email. Please try again.');
            }
          },
        },
      ],
    );
  }, [email, resetPassword]);

  const handleGoogleSignIn = useCallback(() => {
    if (!request) return;
    setGeneralError('');
    setIsGoogleLoading(true);
    promptGoogleAsync().catch(() => setIsGoogleLoading(false));
  }, [request, promptGoogleAsync]);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      {/* Ambient orbs */}
      <Animated.View style={[styles.orb1, { opacity: orb1Opacity }]} />
      <Animated.View style={[styles.orb2, { opacity: orb2Opacity }]} />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ── Logo ── */}
            <Animated.View
              style={[
                styles.logoSection,
                { opacity: logoOpacity, transform: [{ translateY: logoY }, { translateY: logoFloat }] },
              ]}
            >
              <LinearGradient
                colors={['#7C3AED', '#3B82F6', '#06B6D4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoBox}
              >
                <MaterialIcons name="auto-awesome" size={28} color="white" />
              </LinearGradient>
              <Text style={styles.brandName}>
                {'Hire'}
                <Text style={styles.brandAccent}>lith</Text>
              </Text>
            </Animated.View>

            {/* ── Card ── */}
            <Animated.View style={{ opacity: cardOpacity, transform: [{ translateY: cardY }], width: '100%' }}>
              <View style={styles.card}>
                {/* Top highlight shimmer line */}
                <LinearGradient
                  colors={['rgba(0,0,0,0)', 'rgba(255,255,255,0.18)', 'rgba(0,0,0,0)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.cardTopLine}
                />

                <Text style={styles.heading}>Welcome back</Text>
                <Text style={styles.subheading}>
                  Enter your credentials to access your dashboard
                </Text>

                {/* ── Social auth ── */}
                <View style={styles.socialRow}>
                  <SocialButton
                    label={isGoogleLoading ? 'Signing in…' : 'Google'}
                    icon={isGoogleLoading
                      ? <ActivityIndicator color="white" size="small" />
                      : <AntDesign name="google" size={18} color="white" />
                    }
                    onPress={handleGoogleSignIn}
                    disabled={isGoogleLoading || isLoading}
                  />
                  <SocialButton
                    label="GitHub"
                    icon={<FontAwesome name="github" size={18} color="white" />}
                    onPress={() => Alert.alert('GitHub Sign In', 'GitHub authentication coming soon.')}
                    disabled={isLoading || isGoogleLoading}
                  />
                </View>

                {/* ── Divider ── */}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerLabel}>or continue with email</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* ── General error ── */}
                {!!generalError && (
                  <View style={{ marginBottom: 12, paddingHorizontal: 4 }}>
                    <Text style={{ color: '#EF4444', fontSize: 13, textAlign: 'center' }}>{generalError}</Text>
                  </View>
                )}

                {/* ── Email ── */}
                <View style={styles.field}>
                  <Text style={styles.label}>EMAIL ADDRESS</Text>
                  <Animated.View
                    style={[
                      styles.inputWrap,
                      { borderColor: emailBorderColor, shadowOpacity: emailShadowOpacity, shadowColor: '#7C3AED', shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
                    ]}
                  >
                    <MaterialIcons
                      name="mail-outline"
                      size={19}
                      color={emailFocused ? '#A78BFA' : 'rgba(148,163,184,0.4)'}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="alex@example.com"
                      placeholderTextColor="rgba(255,255,255,0.18)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={email}
                      onChangeText={v => { setEmail(v); if (emailError) setEmailError(''); if (generalError) setGeneralError(''); }}
                      onFocus={() => handleEmailFocus(true)}
                      onBlur={() => handleEmailFocus(false)}
                    />
                  </Animated.View>
                  {!!emailError && <Text style={styles.fieldError}>{emailError}</Text>}
                </View>

                {/* ── Password ── */}
                <View style={styles.field}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>PASSWORD</Text>
                    <TouchableOpacity onPress={handleResetPassword}>
                      <Text style={styles.resetLink}>Reset password</Text>
                    </TouchableOpacity>
                  </View>
                  <Animated.View
                    style={[
                      styles.inputWrap,
                      { borderColor: pwBorderColor, shadowOpacity: pwShadowOpacity, shadowColor: '#7C3AED', shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
                    ]}
                  >
                    <MaterialIcons
                      name="lock-outline"
                      size={19}
                      color={passwordFocused ? '#A78BFA' : 'rgba(148,163,184,0.4)'}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.textInput, { paddingRight: 44 }]}
                      placeholder="••••••••••••"
                      placeholderTextColor="rgba(255,255,255,0.18)"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={v => { setPassword(v); if (passwordError) setPasswordError(''); if (generalError) setGeneralError(''); }}
                      onFocus={() => handlePwFocus(true)}
                      onBlur={() => handlePwFocus(false)}
                    />
                    <TouchableOpacity
                      style={styles.eyeBtn}
                      onPress={() => setShowPassword(v => !v)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <MaterialIcons
                        name={showPassword ? 'visibility' : 'visibility-off'}
                        size={18}
                        color="rgba(148,163,184,0.45)"
                      />
                    </TouchableOpacity>
                  </Animated.View>
                  {!!passwordError && <Text style={styles.fieldError}>{passwordError}</Text>}
                </View>

                {/* ── Submit ── */}
                <Animated.View style={[styles.btnOuter, { transform: [{ scale: buttonScale }] }]}>
                  <Pressable
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={handleSignIn}
                    disabled={isLoading || isGoogleLoading}
                    style={styles.btnPressable}
                    android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
                  >
                    <LinearGradient
                      colors={['#7C3AED', '#3B82F6', '#06B6D4']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.btn}
                    >
                      {/* Shimmer sweep */}
                      <Animated.View
                        style={[styles.shimmerStrip, { transform: [{ translateX: shimmerX }], pointerEvents: 'none' }]}
                      >
                        <LinearGradient
                          colors={['rgba(0,0,0,0)', 'rgba(255,255,255,0.3)', 'rgba(0,0,0,0)']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={{ flex: 1 }}
                        />
                      </Animated.View>

                      {isLoading ? (
                        <View style={styles.btnContent}>
                          <ActivityIndicator color="white" size="small" />
                          <Text style={[styles.btnText, { marginLeft: 10 }]}>Authenticating...</Text>
                        </View>
                      ) : (
                        <View style={styles.btnContent}>
                          <Text style={styles.btnText}>Sign in to Dashboard</Text>
                          <MaterialIcons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
                        </View>
                      )}
                    </LinearGradient>
                  </Pressable>
                </Animated.View>

                {/* ── Footer ── */}
                <View style={styles.cardFooter}>
                  <Text style={styles.footerText}>New to Hirelith? </Text>
                  <TouchableOpacity onPress={() => Alert.alert('Get Started', 'Account registration is coming soon. Please sign in if you already have an account.')}>
                    <Text style={styles.footerLink}>Get started</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>

            {/* ── Security badge ── */}
            <Animated.View style={[styles.badgeSection, { opacity: badgeOpacity }]}>
              <View style={styles.securityBadge}>
                <PulseDot />
                <Text style={styles.securityText}>NEURAL SECURITY ACTIVE</Text>
              </View>
              <View style={styles.bottomLinks}>
                {['Legal', 'Privacy', 'Support'].map(link => (
                  <TouchableOpacity key={link} onPress={() => Alert.alert(link, `${link} details will be available soon.`)}>
                    <Text style={styles.bottomLink}>{link.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
