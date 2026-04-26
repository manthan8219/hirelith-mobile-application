import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import { styles } from './HomeScreen.styles';

const { width } = Dimensions.get('window');

// ─── Card data ────────────────────────────────────────────────────────────────
const CARDS = [
  {
    icon: 'auto-awesome' as const,
    label: 'AI MATCHING',
    color: '#A78BFA',
    iconBg: 'rgba(167,139,250,0.12)',
    desc: 'Precision job fits based on your unique skill graph.',
    highlight: false,
  },
  {
    icon: 'insights' as const,
    label: 'SMART PATHS',
    color: '#22D3EE',
    iconBg: 'rgba(34,211,238,0.12)',
    desc: 'Real-time market insights and roadmap generation.',
    highlight: true,
  },
  {
    icon: 'work' as const,
    label: 'GLOBAL NETWORK',
    color: '#C084FC',
    iconBg: 'rgba(192,132,252,0.12)',
    desc: 'Connect with over 10k verified enterprise partners.',
    highlight: false,
  },
] as const;

// ─── Avatar placeholder colors ────────────────────────────────────────────────
const AVATAR_COLORS = ['#7C3AED', '#3B82F6', '#06B6D4'];

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
    <View style={styles.badgeDotWrap}>
      <Animated.View style={[styles.badgeDotRing, { transform: [{ scale }], opacity }]} />
      <View style={styles.badgeDotCore} />
    </View>
  );
}

// ─── Bento card ───────────────────────────────────────────────────────────────
function BentoCard({
  icon, label, color, iconBg, desc, highlight,
  animY, animOpacity,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  color: string;
  iconBg: string;
  desc: string;
  highlight: boolean;
  animY: Animated.Value;
  animOpacity: Animated.Value;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, tension: 300, friction: 10 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, tension: 300, friction: 10 }).start();

  return (
    <Animated.View
      style={[
        { opacity: animOpacity, transform: [{ translateY: animY }, { scale }] },
      ]}
    >
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[styles.card, highlight && styles.cardHighlight]}
        android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)' } : undefined}
      >
        {/* Card highlight top line */}
        {highlight && (
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(167,139,250,0.35)', 'rgba(0,0,0,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }}
          />
        )}
        <View style={[styles.cardIconWrap, { backgroundColor: iconBg }]}>
          <MaterialIcons name={icon} size={22} color={color} />
        </View>
        <Text style={[styles.cardLabel, { color }]}>{label}</Text>
        <Text style={styles.cardDesc}>{desc}</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // ── Animated values ──────────────────────────────────────────────────────
  const orb1Opacity   = useRef(new Animated.Value(0.08)).current;
  const orb2Opacity   = useRef(new Animated.Value(0.07)).current;
  const orb3Opacity   = useRef(new Animated.Value(0.05)).current;
  const logoY         = useRef(new Animated.Value(-24)).current;
  const logoOpacity   = useRef(new Animated.Value(0)).current;
  const logoFloat     = useRef(new Animated.Value(0)).current;
  const headlineY     = useRef(new Animated.Value(30)).current;
  const headlineOp    = useRef(new Animated.Value(0)).current;
  const ctaY          = useRef(new Animated.Value(30)).current;
  const ctaOp         = useRef(new Animated.Value(0)).current;
  const badgeOp       = useRef(new Animated.Value(0)).current;
  const btnScale      = useRef(new Animated.Value(1)).current;
  const shimmerX      = useRef(new Animated.Value(-width)).current;

  // Per-card animated values
  const cardAnims = useRef(
    CARDS.map(() => ({
      y:  new Animated.Value(40),
      op: new Animated.Value(0),
    }))
  ).current;

  // ── Mount animations ─────────────────────────────────────────────────────
  useEffect(() => {
    // Entrance sequence
    Animated.sequence([
      // 1. Logo
      Animated.parallel([
        Animated.spring(logoY,       { toValue: 0, useNativeDriver: true, tension: 60, friction: 12 }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      // 2. Headline
      Animated.parallel([
        Animated.spring(headlineY, { toValue: 0, useNativeDriver: true, tension: 55, friction: 12 }),
        Animated.timing(headlineOp, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      // 3. Cards staggered
      Animated.stagger(120,
        cardAnims.map(a =>
          Animated.parallel([
            Animated.spring(a.y,  { toValue: 0, useNativeDriver: true, tension: 60, friction: 12 }),
            Animated.timing(a.op, { toValue: 1, duration: 350, useNativeDriver: true }),
          ])
        )
      ),
      // 4. CTA
      Animated.parallel([
        Animated.spring(ctaY, { toValue: 0, useNativeDriver: true, tension: 55, friction: 12 }),
        Animated.timing(ctaOp, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      // 5. Badge
      Animated.timing(badgeOp, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    // Logo float loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, { toValue: -8, duration: 3000, useNativeDriver: true }),
        Animated.timing(logoFloat, { toValue: 0,  duration: 3000, useNativeDriver: true }),
      ])
    ).start();

    // Orb pulses
    Animated.loop(
      Animated.sequence([
        Animated.timing(orb1Opacity, { toValue: 0.15, duration: 3000, useNativeDriver: true }),
        Animated.timing(orb1Opacity, { toValue: 0.06, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(orb2Opacity, { toValue: 0.12, duration: 2500, useNativeDriver: true }),
          Animated.timing(orb2Opacity, { toValue: 0.04, duration: 2500, useNativeDriver: true }),
        ])
      ).start();
    }, 1000);
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(orb3Opacity, { toValue: 0.10, duration: 2800, useNativeDriver: true }),
          Animated.timing(orb3Opacity, { toValue: 0.03, duration: 2800, useNativeDriver: true }),
        ])
      ).start();
    }, 1800);
  }, []);

  // ── Button shimmer on hover/focus ─────────────────────────────────────────
  const startShimmer = useCallback(() => {
    shimmerX.setValue(-width);
    Animated.timing(shimmerX, { toValue: width * 1.5, duration: 900, useNativeDriver: true }).start();
  }, []);

  const handlePressIn  = useCallback(() => {
    Animated.spring(btnScale, { toValue: 0.95, useNativeDriver: true, tension: 300, friction: 8 }).start();
    startShimmer();
  }, []);
  const handlePressOut = useCallback(() => {
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 8 }).start();
  }, []);

  const handleGetStarted = useCallback(() => {
    navigation.navigate('Onboarding');
  }, [navigation]);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      {/* Ambient orbs */}
      <Animated.View style={[styles.orb1, { opacity: orb1Opacity }]} />
      <Animated.View style={[styles.orb2, { opacity: orb2Opacity }]} />
      <Animated.View style={[styles.orb3, { opacity: orb3Opacity }]} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Logo ── */}
          <Animated.View
            style={[
              styles.logoSection,
              { opacity: logoOpacity, transform: [{ translateY: logoY }, { translateY: logoFloat }] },
            ]}
          >
            <View style={styles.logoGlowWrap}>
              <View style={styles.logoGlow} />
              <Text style={styles.brandText}>
                Career
                <Text style={styles.brandAccent}>.AI</Text>
              </Text>
            </View>
          </Animated.View>

          {/* ── Headline ── */}
          <Animated.View
            style={[styles.headlineSection, { opacity: headlineOp, transform: [{ translateY: headlineY }] }]}
          >
            <Text style={styles.headline}>
              Welcome to the{'\n'}
              <Text style={styles.headlineAccent}>future of work</Text>
            </Text>
            <Text style={styles.subtext}>
              Experience the first AI-powered career ecosystem designed to bridge the gap between your potential and your professional peak.
            </Text>
          </Animated.View>

          {/* ── Bento cards ── */}
          <View style={styles.cardsSection}>
            {CARDS.map((card, i) => (
              <BentoCard
                key={card.label}
                icon={card.icon}
                label={card.label}
                color={card.color}
                iconBg={card.iconBg}
                desc={card.desc}
                highlight={card.highlight}
                animY={cardAnims[i].y}
                animOpacity={cardAnims[i].op}
              />
            ))}
          </View>

          {/* ── CTA ── */}
          <Animated.View
            style={[styles.ctaSection, { opacity: ctaOp, transform: [{ translateY: ctaY }] }]}
          >
            <Animated.View style={[styles.ctaBtnOuter, { transform: [{ scale: btnScale }] }]}>
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleGetStarted}
                style={{ borderRadius: 999, overflow: 'hidden' }}
                android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.1)' } : undefined}
              >
                <LinearGradient
                  colors={['#7C3AED', '#3B82F6', '#06B6D4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ctaBtn}
                >
                  {/* Shimmer */}
                  <Animated.View
                    style={[styles.shimmerStrip, { transform: [{ translateX: shimmerX }], pointerEvents: 'none' }]}
                  >
                    <LinearGradient
                      colors={['rgba(0,0,0,0)', 'rgba(255,255,255,0.25)', 'rgba(0,0,0,0)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ flex: 1 }}
                    />
                  </Animated.View>
                  <Text style={styles.ctaBtnText}>Get Started</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="white" />
                </LinearGradient>
              </Pressable>
            </Animated.View>
            <Text style={styles.ctaHint}>PRESS ANY KEY TO CONTINUE</Text>
          </Animated.View>
        </ScrollView>

        {/* ── Systems nominal badge (bottom-left) ── */}
        <Animated.View style={[styles.badge, { opacity: badgeOp }]}>
          <PulseDot />
          <Text style={styles.badgeText}>SYSTEMS NOMINAL</Text>
        </Animated.View>

        {/* ── Avatars (bottom-right) ── */}
        <Animated.View style={[styles.avatarsSection, { opacity: badgeOp }]}>
          <View style={styles.avatarStack}>
            {AVATAR_COLORS.map((color, i) => (
              <View
                key={i}
                style={[
                  styles.avatar,
                  { backgroundColor: color, marginLeft: i === 0 ? 0 : -10 },
                ]}
              />
            ))}
            <View style={[styles.avatar, styles.avatarCount, { marginLeft: -10 }]}>
              <Text style={styles.avatarText}>12k+</Text>
            </View>
          </View>
          <Text style={styles.avatarsLabel}>JOINING{'\n'}THIS WEEK</Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
