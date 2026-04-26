import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { styles } from './OnboardingScreen.styles';

const { width } = Dimensions.get('window');
const PROGRESS_TRACK_WIDTH = width - 40; // paddingHorizontal * 2

// ─── Options data ─────────────────────────────────────────────────────────────
const OPTIONS = [
  {
    id: 'job',
    icon: 'work' as const,
    title: 'Get a new job',
    desc: 'Optimize your resume and get AI-matched with high-paying roles.',
    featured: true,
  },
  {
    id: 'freelance',
    icon: 'laptop-mac' as const,
    title: 'Freelance projects',
    desc: 'Find high-intent clients and automate your proposal workflows.',
    featured: false,
  },
  {
    id: 'startup',
    icon: 'rocket-launch' as const,
    title: 'Launch a startup',
    desc: 'Validate ideas, build MVPs, and navigate early-stage growth.',
    featured: false,
  },
  {
    id: 'skill',
    icon: 'school' as const,
    title: 'Skill up',
    desc: 'Master new technologies with personalized learning roadmaps.',
    featured: false,
  },
] as const;

// ─── Header icon button ───────────────────────────────────────────────────────
function HeaderIconBtn({
  icon,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  onPress?: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn  = () => Animated.spring(scale, { toValue: 0.88, useNativeDriver: true, tension: 300, friction: 8 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, tension: 300, friction: 8 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        style={styles.headerIconBtn}
        android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.1)', borderless: true } : undefined}
      >
        <MaterialIcons name={icon} size={22} color="rgba(148,163,184,0.8)" />
      </Pressable>
    </Animated.View>
  );
}

// ─── Selection card ───────────────────────────────────────────────────────────
function SelectionCard({
  option,
  isSelected,
  onPress,
  animY,
  animOpacity,
}: {
  option: (typeof OPTIONS)[number];
  isSelected: boolean;
  onPress: () => void;
  animY: Animated.Value;
  animOpacity: Animated.Value;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, tension: 300, friction: 10 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, tension: 300, friction: 10 }).start();

  return (
    <Animated.View
      style={{
        opacity: animOpacity,
        transform: [{ translateY: animY }, { scale }],
      }}
    >
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        style={[styles.card, isSelected && styles.cardSelected]}
        android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)' } : undefined}
      >
        {/* Top highlight line on selected */}
        {isSelected && (
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(167,139,250,0.5)', 'rgba(0,0,0,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cardTopLine}
          />
        )}

        {/* Icon container */}
        {isSelected || option.featured ? (
          <LinearGradient
            colors={['#6750A4', '#00BCD4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconWrapGradient}
          >
            <MaterialIcons name={option.icon} size={24} color="white" />
          </LinearGradient>
        ) : (
          <View style={styles.iconWrapDefault}>
            <MaterialIcons name={option.icon} size={24} color="rgba(203,196,210,0.7)" />
          </View>
        )}

        <Text style={styles.cardTitle}>{option.title}</Text>
        <Text style={styles.cardDesc}>{option.desc}</Text>

        {/* Card footer */}
        <View style={styles.cardFooter}>
          <Text style={[styles.cardAction, isSelected && styles.cardActionSelected]}>
            {isSelected ? 'Selected' : 'Select'}
          </Text>
          <MaterialIcons
            name={isSelected ? 'check-circle' : 'chevron-right'}
            size={14}
            color={isSelected ? '#A78BFA' : 'rgba(100,116,139,0.6)'}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── OnboardingScreen ─────────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { backendUser, refreshBackendUser } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ── Animated values ──────────────────────────────────────────────────────
  const orb1Opacity  = useRef(new Animated.Value(0.12)).current;
  const orb2Opacity  = useRef(new Animated.Value(0.08)).current;
  const headerOp     = useRef(new Animated.Value(0)).current;
  const progressOp   = useRef(new Animated.Value(0)).current;
  const progressFill = useRef(new Animated.Value(0)).current;
  const heroY        = useRef(new Animated.Value(24)).current;
  const heroOp       = useRef(new Animated.Value(0)).current;
  const footerOp     = useRef(new Animated.Value(0)).current;
  const btnScale     = useRef(new Animated.Value(1)).current;
  const shimmerX     = useRef(new Animated.Value(-width)).current;

  const cardAnims = useRef(
    OPTIONS.map(() => ({
      y:  new Animated.Value(32),
      op: new Animated.Value(0),
    }))
  ).current;

  // ── Mount animations ─────────────────────────────────────────────────────
  useEffect(() => {
    Animated.sequence([
      // Header fade
      Animated.timing(headerOp, { toValue: 1, duration: 300, useNativeDriver: true }),
      // Progress bar
      Animated.parallel([
        Animated.timing(progressOp,   { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(progressFill, { toValue: PROGRESS_TRACK_WIDTH * 0.25, duration: 600, useNativeDriver: false }),
      ]),
      // Hero
      Animated.parallel([
        Animated.spring(heroY, { toValue: 0, useNativeDriver: true, tension: 60, friction: 12 }),
        Animated.timing(heroOp, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      // Cards staggered
      Animated.stagger(100,
        cardAnims.map(a =>
          Animated.parallel([
            Animated.spring(a.y,  { toValue: 0, useNativeDriver: true, tension: 65, friction: 12 }),
            Animated.timing(a.op, { toValue: 1, duration: 300, useNativeDriver: true }),
          ])
        )
      ),
      // Footer
      Animated.timing(footerOp, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    // Orb pulses
    Animated.loop(
      Animated.sequence([
        Animated.timing(orb1Opacity, { toValue: 0.18, duration: 3000, useNativeDriver: true }),
        Animated.timing(orb1Opacity, { toValue: 0.08, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(orb2Opacity, { toValue: 0.14, duration: 2500, useNativeDriver: true }),
          Animated.timing(orb2Opacity, { toValue: 0.05, duration: 2500, useNativeDriver: true }),
        ])
      ).start();
    }, 1200);
  }, []);

  // ── Button press ──────────────────────────────────────────────────────────
  const handleBtnPressIn = useCallback(() => {
    Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true, tension: 300, friction: 8 }).start();
    shimmerX.setValue(-width);
    Animated.timing(shimmerX, { toValue: width * 1.5, duration: 900, useNativeDriver: true }).start();
  }, []);

  const handleBtnPressOut = useCallback(() => {
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 8 }).start();
  }, []);

  const handleContinue = useCallback(async () => {
    if (!selectedId || isSaving) return;
    const user = backendUser ?? await refreshBackendUser();
    if (!user) { navigation.navigate('Onboarding2'); return; }
    setIsSaving(true);
    try {
      await api.patch(`/api/v1/onboarding/${user.id}/step1`, { careerGoal: selectedId });
    } catch {
      // non-blocking — still navigate
    } finally {
      setIsSaving(false);
    }
    navigation.navigate('Onboarding2');
  }, [selectedId, isSaving, backendUser, refreshBackendUser, navigation]);

  const handleBack = useCallback(() => navigation.goBack(), []);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      {/* Ambient orbs */}
      <Animated.View style={[styles.orb1, { opacity: orb1Opacity }]} />
      <Animated.View style={[styles.orb2, { opacity: orb2Opacity }]} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* ── Header ── */}
        <Animated.View style={[styles.header, { opacity: headerOp }]}>
          <View style={styles.headerLeft}>
            <HeaderIconBtn icon="arrow-back" onPress={handleBack} />
            <Text style={styles.headerTitle}>Hirelith</Text>
          </View>
          <HeaderIconBtn icon="close" onPress={handleBack} />
        </Animated.View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Progress bar ── */}
          <Animated.View style={[styles.progressSection, { opacity: progressOp }]}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressStep}>Step 01 of 04</Text>
              <Text style={styles.progressLabel}>Personalization</Text>
            </View>
            <View style={styles.progressTrack}>
              <Animated.View style={{ width: progressFill }}>
                <LinearGradient
                  colors={['#6750A4', '#00BCD4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.progressFill}
                />
              </Animated.View>
            </View>
          </Animated.View>

          {/* ── Hero ── */}
          <Animated.View
            style={[styles.heroSection, { opacity: heroOp, transform: [{ translateY: heroY }] }]}
          >
            <Text style={styles.heroTitle}>What is your focus?</Text>
            <Text style={styles.heroSub}>
              Select your primary career goal to help us tailor your AI-powered journey.
            </Text>
          </Animated.View>

          {/* ── Selection cards ── */}
          <View style={styles.cardsGrid}>
            {OPTIONS.map((option, i) => (
              <SelectionCard
                key={option.id}
                option={option}
                isSelected={selectedId === option.id}
                onPress={() => setSelectedId(option.id)}
                animY={cardAnims[i].y}
                animOpacity={cardAnims[i].op}
              />
            ))}
          </View>

          {/* ── Footer actions ── */}
          <Animated.View style={[styles.footerActions, { opacity: footerOp }]}>
            {/* Continue button */}
            <Animated.View
              style={[
                styles.continueBtnOuter,
                !selectedId && styles.continueBtnDisabled,
                { transform: [{ scale: btnScale }] },
              ]}
            >
              <Pressable
                onPressIn={handleBtnPressIn}
                onPressOut={handleBtnPressOut}
                onPress={handleContinue}
                style={{ borderRadius: 999, overflow: 'hidden' }}
                android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.1)' } : undefined}
              >
                <LinearGradient
                  colors={['#6750A4', '#3B82F6', '#00BCD4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.continueBtn}
                >
                  {/* Shimmer sweep */}
                  <Animated.View
                    style={[styles.shimmerStrip, { transform: [{ translateX: shimmerX }], pointerEvents: 'none' }]}
                  >
                    <LinearGradient
                      colors={['rgba(0,0,0,0)', 'rgba(255,255,255,0.28)', 'rgba(0,0,0,0)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ flex: 1 }}
                    />
                  </Animated.View>
                  <Text style={styles.continueBtnText}>Continue Journey</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>

            {/* Skip */}
            <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.navigate('Dashboard')} activeOpacity={0.6}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
