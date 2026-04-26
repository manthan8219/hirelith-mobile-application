import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  Platform,
  PanResponder,
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
import { styles } from './Onboarding2Screen.styles';

const { width } = Dimensions.get('window');
const PROGRESS_TRACK_WIDTH = width - 40;
const SLIDER_TRACK_WIDTH = width - 40 - 48; // paddingHorizontal + section padding

// ─── Domain data ──────────────────────────────────────────────────────────────
const DOMAINS = [
  {
    id: 'frontend',
    icon: 'desktop-windows' as const,
    name: 'Frontend',
    tag: 'UI / UX',
    color: '#A78BFA',
    gradientColors: ['#7C3AED', '#A78BFA'] as const,
  },
  {
    id: 'backend',
    icon: 'storage' as const,
    name: 'Backend',
    tag: 'APIs / DBs',
    color: '#22D3EE',
    gradientColors: ['#0891B2', '#22D3EE'] as const,
  },
  {
    id: 'aiml',
    icon: 'psychology' as const,
    name: 'AI / ML',
    tag: 'Machine Learning',
    color: '#F472B6',
    gradientColors: ['#DB2777', '#F472B6'] as const,
  },
  {
    id: 'data',
    icon: 'analytics' as const,
    name: 'Data Science',
    tag: 'Analytics',
    color: '#34D399',
    gradientColors: ['#059669', '#34D399'] as const,
  },
  {
    id: 'design',
    icon: 'auto-awesome' as const,
    name: 'Product Design',
    tag: 'UX Research',
    color: '#FB923C',
    gradientColors: ['#EA580C', '#FB923C'] as const,
  },
  {
    id: 'pm',
    icon: 'dashboard' as const,
    name: 'Product Mgmt',
    tag: 'Strategy',
    color: '#FBBF24',
    gradientColors: ['#D97706', '#FBBF24'] as const,
  },
] as const;

// ─── Skill level config ───────────────────────────────────────────────────────
function getSkillLevel(value: number): { label: string; desc: string; icon: string } {
  if (value < 20) return { label: 'Beginner',          desc: 'Just starting out. Building foundational knowledge.',         icon: 'spa' };
  if (value < 40) return { label: 'Junior',             desc: 'Some experience. Working on core concepts.',                  icon: 'trending_up' };
  if (value < 60) return { label: 'Mid-Level',          desc: 'Solid grasp. Delivering independently on most tasks.',        icon: 'star_half' };
  if (value < 80) return { label: 'Advanced Mid-Level', desc: 'Strong skills. Leading features and mentoring juniors.',      icon: 'star' };
  return              { label: 'Expert',              desc: 'Top-tier mastery. Driving architecture and innovation.',      icon: 'military_tech' };
}

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

// ─── Domain card ──────────────────────────────────────────────────────────────
function DomainCard({
  domain,
  isSelected,
  onPress,
  animY,
  animOpacity,
}: {
  domain: (typeof DOMAINS)[number];
  isSelected: boolean;
  onPress: () => void;
  animY: Animated.Value;
  animOpacity: Animated.Value;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn  = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, tension: 300, friction: 10 }).start();
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
        style={[styles.domainCard, isSelected && styles.domainCardSelected]}
        android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)' } : undefined}
      >
        {/* Top highlight line */}
        {isSelected && (
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(34,211,238,0.5)', 'rgba(0,0,0,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.domainCardTopLine}
          />
        )}

        <View style={styles.domainCardHeader}>
          {/* Icon */}
          {isSelected ? (
            <LinearGradient
              colors={domain.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.domainIconWrap, { shadowColor: domain.color, shadowOpacity: 0.6, shadowRadius: 12, shadowOffset: { width: 0, height: 0 } }]}
            >
              <MaterialIcons name={domain.icon} size={22} color="white" />
            </LinearGradient>
          ) : (
            <View style={[styles.domainIconWrap, styles.domainIconWrapDefault]}>
              <MaterialIcons name={domain.icon} size={22} color="rgba(148,163,184,0.6)" />
            </View>
          )}

          {/* Radio */}
          <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
            {isSelected && <View style={styles.radioDot} />}
          </View>
        </View>

        <Text style={styles.domainName}>{domain.name}</Text>
        <Text style={[styles.domainTag, isSelected && styles.domainTagSelected]}>{domain.tag}</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Skill slider ─────────────────────────────────────────────────────────────
function SkillSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const thumbX = useRef(new Animated.Value((value / 100) * SLIDER_TRACK_WIDTH)).current;
  const thumbScale = useRef(new Animated.Value(1)).current;
  const lastX = useRef((value / 100) * SLIDER_TRACK_WIDTH);

  const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Animated.spring(thumbScale, { toValue: 1.25, useNativeDriver: true, tension: 300, friction: 8 }).start();
        thumbX.stopAnimation(v => { lastX.current = v; });
      },
      onPanResponderMove: (_, gs) => {
        const newX = clamp(lastX.current + gs.dx, 0, SLIDER_TRACK_WIDTH);
        thumbX.setValue(newX);
        onChange(Math.round((newX / SLIDER_TRACK_WIDTH) * 100));
      },
      onPanResponderRelease: (_, gs) => {
        Animated.spring(thumbScale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 8 }).start();
        const newX = clamp(lastX.current + gs.dx, 0, SLIDER_TRACK_WIDTH);
        lastX.current = newX;
      },
    })
  ).current;

  const fillWidth = thumbX.interpolate({
    inputRange: [0, SLIDER_TRACK_WIDTH],
    outputRange: [0, SLIDER_TRACK_WIDTH],
    extrapolate: 'clamp',
  });

  const thumbLeft = thumbX.interpolate({
    inputRange: [0, SLIDER_TRACK_WIDTH],
    outputRange: [0, SLIDER_TRACK_WIDTH],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.sliderTrackWrap} {...panResponder.panHandlers}>
      <View style={styles.sliderTrack}>
        <Animated.View style={{ width: fillWidth }}>
          <LinearGradient
            colors={['#3B82F6', '#22D3EE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.sliderFill}
          />
        </Animated.View>
      </View>
      <Animated.View
        style={[
          styles.sliderThumb,
          {
            left: thumbLeft,
            transform: [{ scale: thumbScale }],
          },
        ]}
      >
        <View style={styles.sliderThumbInner} />
      </Animated.View>
    </View>
  );
}

// ─── Onboarding2Screen ────────────────────────────────────────────────────────
export default function Onboarding2Screen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { backendUser, refreshBackendUser } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [skillValue, setSkillValue] = useState(65);
  const [isSaving, setIsSaving] = useState(false);

  const skillInfo = getSkillLevel(skillValue);

  // ── Animated values ──────────────────────────────────────────────────────
  const orb1Opacity  = useRef(new Animated.Value(0.07)).current;
  const orb2Opacity  = useRef(new Animated.Value(0.06)).current;
  const headerOp     = useRef(new Animated.Value(0)).current;
  const progressOp   = useRef(new Animated.Value(0)).current;
  const progressFill = useRef(new Animated.Value(0)).current;
  const heroY        = useRef(new Animated.Value(24)).current;
  const heroOp       = useRef(new Animated.Value(0)).current;
  const sliderSectionOp = useRef(new Animated.Value(0)).current;
  const sliderSectionY  = useRef(new Animated.Value(24)).current;
  const footerOp     = useRef(new Animated.Value(0)).current;
  const btnScale     = useRef(new Animated.Value(1)).current;
  const shimmerX     = useRef(new Animated.Value(-width)).current;

  const cardAnims = useRef(
    DOMAINS.map(() => ({
      y:  new Animated.Value(32),
      op: new Animated.Value(0),
    }))
  ).current;

  // ── Mount animations ─────────────────────────────────────────────────────
  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerOp, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(progressOp,   { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(progressFill, { toValue: PROGRESS_TRACK_WIDTH * 0.5, duration: 700, useNativeDriver: false }),
      ]),
      Animated.parallel([
        Animated.spring(heroY, { toValue: 0, useNativeDriver: true, tension: 60, friction: 12 }),
        Animated.timing(heroOp, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.stagger(80,
        cardAnims.map(a =>
          Animated.parallel([
            Animated.spring(a.y,  { toValue: 0, useNativeDriver: true, tension: 65, friction: 12 }),
            Animated.timing(a.op, { toValue: 1, duration: 280, useNativeDriver: true }),
          ])
        )
      ),
      Animated.parallel([
        Animated.spring(sliderSectionY, { toValue: 0, useNativeDriver: true, tension: 60, friction: 12 }),
        Animated.timing(sliderSectionOp, { toValue: 1, duration: 350, useNativeDriver: true }),
      ]),
      Animated.timing(footerOp, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    // Orb pulses
    Animated.loop(
      Animated.sequence([
        Animated.timing(orb1Opacity, { toValue: 0.14, duration: 3200, useNativeDriver: true }),
        Animated.timing(orb1Opacity, { toValue: 0.05, duration: 3200, useNativeDriver: true }),
      ])
    ).start();
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(orb2Opacity, { toValue: 0.12, duration: 2700, useNativeDriver: true }),
          Animated.timing(orb2Opacity, { toValue: 0.04, duration: 2700, useNativeDriver: true }),
        ])
      ).start();
    }, 1400);
  }, []);

  // ── Button ────────────────────────────────────────────────────────────────
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
    if (!user) { navigation.navigate('Onboarding3'); return; }
    setIsSaving(true);
    try {
      await api.patch(`/api/v1/onboarding/${user.id}/step2`, {
        domain: selectedId,
        experienceLevel: skillValue,
      });
    } catch {
      // non-blocking — still navigate
    } finally {
      setIsSaving(false);
    }
    navigation.navigate('Onboarding3');
  }, [selectedId, skillValue, isSaving, backendUser, refreshBackendUser, navigation]);

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
              <Text style={styles.progressStep}>Step 02 of 04</Text>
              <Text style={styles.progressLabel}>Domain</Text>
            </View>
            <View style={styles.progressTrack}>
              <Animated.View style={{ width: progressFill }}>
                <LinearGradient
                  colors={['#3B82F6', '#22D3EE']}
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
            <Text style={styles.heroTitle}>What is your domain?</Text>
            <Text style={styles.heroSub}>
              Pick the technical area that best defines your expertise or target role.
            </Text>
          </Animated.View>

          {/* ── Domain grid ── */}
          <View style={styles.domainsGrid}>
            {DOMAINS.map((domain, i) => (
              <DomainCard
                key={domain.id}
                domain={domain}
                isSelected={selectedId === domain.id}
                onPress={() => setSelectedId(domain.id)}
                animY={cardAnims[i].y}
                animOpacity={cardAnims[i].op}
              />
            ))}
          </View>

          {/* ── Skill level slider ── */}
          <Animated.View
            style={[
              styles.sliderSection,
              { opacity: sliderSectionOp, transform: [{ translateY: sliderSectionY }] },
            ]}
          >
            <Text style={styles.sliderSectionTitle}>Experience Level</Text>

            <SkillSlider value={skillValue} onChange={setSkillValue} />

            {/* Labels */}
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>Beginner</Text>
              <Text style={styles.sliderLabel}>Mid-Level</Text>
              <Text style={styles.sliderLabel}>Expert</Text>
            </View>

            {/* Feedback card */}
            <View style={styles.feedbackCard}>
              <View style={styles.feedbackCardBg} />
              <View style={styles.feedbackRow}>
                <LinearGradient
                  colors={['#3B82F6', '#22D3EE']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.feedbackIconWrap}
                >
                  <MaterialIcons
                    name={skillInfo.icon as React.ComponentProps<typeof MaterialIcons>['name']}
                    size={18}
                    color="white"
                  />
                </LinearGradient>
                <View style={styles.feedbackTextWrap}>
                  <Text style={styles.feedbackLevel}>{skillInfo.label}</Text>
                  <Text style={styles.feedbackDesc}>{skillInfo.desc}</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* ── Footer actions ── */}
          <Animated.View style={[styles.footerActions, { opacity: footerOp }]}>
            {/* Continue button */}
            <Animated.View
              style={[styles.continueBtnOuter, !selectedId && styles.continueBtnDisabled, { transform: [{ scale: btnScale }] }]}
            >
              <Pressable
                onPressIn={selectedId ? handleBtnPressIn : undefined}
                onPressOut={selectedId ? handleBtnPressOut : undefined}
                onPress={selectedId ? handleContinue : undefined}
                disabled={!selectedId}
                style={{ borderRadius: 999, overflow: 'hidden' }}
                android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.1)' } : undefined}
              >
                <LinearGradient
                  colors={['#3B82F6', '#06B6D4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.continueBtn}
                >
                  {/* Shimmer */}
                  <Animated.View
                    style={[styles.shimmerStrip, { transform: [{ translateX: shimmerX }] }]}
                  >
                    <LinearGradient
                      colors={['rgba(0,0,0,0)', 'rgba(255,255,255,0.28)', 'rgba(0,0,0,0)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ flex: 1 }}
                    />
                  </Animated.View>
                  <Text style={styles.continueBtnText}>Continue to Step 3</Text>
                  <MaterialIcons name="arrow-forward" size={18} color="white" />
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
