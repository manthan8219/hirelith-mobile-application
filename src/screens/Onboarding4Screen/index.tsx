import React, { useRef, useEffect, useState, useCallback } from 'react';
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
import { useAuth } from '../../context/AuthContext';
import { styles } from './Onboarding4Screen.styles';

const { width } = Dimensions.get('window');
const PROGRESS_TRACK_WIDTH = width - 40;

// ─── Analysis stages ──────────────────────────────────────────────────────────
const STAGES = [
  {
    title: 'Extracting Skills',
    desc: '24 core competencies identified from resume',
    icon: 'psychology' as const,
  },
  {
    title: 'Market Comparison',
    desc: 'Matching profile with 1.2M job data points',
    icon: 'query-stats' as const,
  },
  {
    title: 'Generating Roadmap',
    desc: 'Calculating high-impact career pivots',
    icon: 'alt-route' as const,
  },
] as const;

// stage: completed cards = all indices < stage, active = stage, pending = > stage
// stage 0 = all pending (initial), 1 = card0 active, 2 = card1 active, 3 = card2 active, 4 = done

// ─── Status card ──────────────────────────────────────────────────────────────
function StatusCard({
  stageInfo,
  index,
  currentStage,
  animOp,
  animY,
}: {
  stageInfo: (typeof STAGES)[number];
  index: number;
  currentStage: number;
  animOp: Animated.Value;
  animY: Animated.Value;
}) {
  const isComplete = index < currentStage - 1;
  const isActive   = index === currentStage - 1;
  const isPending  = index > currentStage - 1;

  const dotAnim1 = useRef(new Animated.Value(index < 2 ? 1 : 0)).current;
  const dotAnim2 = useRef(new Animated.Value(index < 1 ? 1 : 0)).current;

  return (
    <Animated.View
      style={[
        styles.statusCard,
        isActive  && styles.statusCardActive,
        isPending && styles.statusCardPending,
        { opacity: animOp, transform: [{ translateY: animY }] },
      ]}
    >
      {/* Active shimmer line */}
      {isActive && (
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(207,188,255,0.18)', 'rgba(0,0,0,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }}
        />
      )}

      {/* Icon */}
      <View style={[
        styles.statusIconWrap,
        isComplete ? styles.statusIconWrapComplete
          : isActive ? styles.statusIconWrapActive
          : styles.statusIconWrapPending,
      ]}>
        {isComplete
          ? <MaterialIcons name="check-circle" size={20} color="#34D399" />
          : isActive
          ? <MaterialIcons name={stageInfo.icon} size={20} color="#cfbcff" />
          : <MaterialIcons name={stageInfo.icon} size={20} color="rgba(100,116,139,0.6)" />
        }
      </View>

      {/* Content */}
      <View style={styles.statusContent}>
        <View style={styles.statusTitleRow}>
          <Text style={styles.statusTitle}>{stageInfo.title}</Text>
          {isActive && (
            <View style={styles.processingBadge}>
              <Text style={styles.processingBadgeText}>Processing</Text>
            </View>
          )}
        </View>
        <Text style={styles.statusDesc}>{stageInfo.desc}</Text>

        {/* Mini progress dots for active card */}
        {isActive && (
          <View style={styles.miniProgressDots}>
            <Animated.View style={[styles.miniDot, { backgroundColor: 'rgba(207,188,255,0.5)' }]} />
            <Animated.View style={[styles.miniDot, { backgroundColor: dotAnim1.interpolate({ inputRange: [0,1], outputRange: ['rgba(207,188,255,0.15)', 'rgba(207,188,255,0.5)'] }) }]} />
            <Animated.View style={[styles.miniDot, { backgroundColor: dotAnim2.interpolate({ inputRange: [0,1], outputRange: ['rgba(255,255,255,0.08)', 'rgba(207,188,255,0.5)'] }) }]} />
          </View>
        )}
      </View>
    </Animated.View>
  );
}

// ─── Pulsing dot ─────────────────────────────────────────────────────────────
function PulsingDot() {
  const scale   = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale,   { toValue: 2.4, duration: 1100, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0,   duration: 1100, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scale,   { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);
  return (
    <View style={{ width: 8, height: 8, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{
        position: 'absolute', width: 8, height: 8, borderRadius: 4,
        backgroundColor: '#cfbcff', transform: [{ scale }], opacity,
      }} />
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#cfbcff' }} />
    </View>
  );
}

// ─── Header icon button ───────────────────────────────────────────────────────
function HeaderIconBtn({
  icon, onPress,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  onPress?: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={() => Animated.spring(scale, { toValue: 0.88, useNativeDriver: true, tension: 300, friction: 8 }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 8 }).start()}
        onPress={onPress}
        style={styles.headerIconBtn}
        android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.1)', borderless: true } : undefined}
      >
        <MaterialIcons name={icon} size={22} color="rgba(148,163,184,0.8)" />
      </Pressable>
    </Animated.View>
  );
}

// ─── Onboarding4Screen ────────────────────────────────────────────────────────
export default function Onboarding4Screen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { markOnboarded } = useAuth();

  // ── Analysis stage state (1 = card0 active, 2 = card1 active, 3 = card2 active, 4 = done)
  const [currentStage, setCurrentStage] = useState(1);

  // ── Animated values ──────────────────────────────────────────────────────
  const orb1Opacity    = useRef(new Animated.Value(0.10)).current;
  const orb2Opacity    = useRef(new Animated.Value(0.06)).current;
  const headerOp       = useRef(new Animated.Value(0)).current;
  const heroOp         = useRef(new Animated.Value(0)).current;
  const heroY          = useRef(new Animated.Value(20)).current;
  const globalProgress = useRef(new Animated.Value(0)).current;
  const scanPanelOp    = useRef(new Animated.Value(0)).current;
  const scanPanelY     = useRef(new Animated.Value(20)).current;
  const footerOp       = useRef(new Animated.Value(0)).current;
  const spinAnim       = useRef(new Animated.Value(0)).current;
  const auraScale      = useRef(new Animated.Value(1)).current;
  const auraOpacity    = useRef(new Animated.Value(0.2)).current;
  const skipBtnScale   = useRef(new Animated.Value(1)).current;
  const shimmerX       = useRef(new Animated.Value(-width)).current;

  const cardAnims = useRef(
    STAGES.map(() => ({ op: new Animated.Value(0), y: new Animated.Value(16) }))
  ).current;

  // ── Mount animations ─────────────────────────────────────────────────────
  useEffect(() => {
    // Spinning ring
    Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 12000, useNativeDriver: true })
    ).start();

    // Pulsing aura
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(auraScale,   { toValue: 1.5, duration: 1400, useNativeDriver: true }),
          Animated.timing(auraOpacity, { toValue: 0,   duration: 1400, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(auraScale,   { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(auraOpacity, { toValue: 0.2, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();

    // Orb pulses
    Animated.loop(Animated.sequence([
      Animated.timing(orb1Opacity, { toValue: 0.18, duration: 3500, useNativeDriver: true }),
      Animated.timing(orb1Opacity, { toValue: 0.06, duration: 3500, useNativeDriver: true }),
    ])).start();
    setTimeout(() => {
      Animated.loop(Animated.sequence([
        Animated.timing(orb2Opacity, { toValue: 0.10, duration: 2800, useNativeDriver: true }),
        Animated.timing(orb2Opacity, { toValue: 0.03, duration: 2800, useNativeDriver: true }),
      ])).start();
    }, 1500);

    // Entrance sequence
    Animated.sequence([
      Animated.timing(headerOp, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(heroY, { toValue: 0, useNativeDriver: true, tension: 60, friction: 12 }),
        Animated.timing(heroOp, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.stagger(100, cardAnims.map(a =>
        Animated.parallel([
          Animated.spring(a.y,  { toValue: 0, useNativeDriver: true, tension: 65, friction: 12 }),
          Animated.timing(a.op, { toValue: 1, duration: 280, useNativeDriver: true }),
        ])
      )),
      Animated.parallel([
        Animated.spring(scanPanelY, { toValue: 0, useNativeDriver: true, tension: 60, friction: 12 }),
        Animated.timing(scanPanelOp, { toValue: 1, duration: 350, useNativeDriver: true }),
      ]),
      Animated.timing(footerOp, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    // Progress to 33% on mount
    Animated.timing(globalProgress, { toValue: PROGRESS_TRACK_WIDTH * 0.33, duration: 900, useNativeDriver: false }).start();

    // Stage progression timeline
    const t1 = setTimeout(() => {
      setCurrentStage(2);
      Animated.timing(globalProgress, { toValue: PROGRESS_TRACK_WIDTH * 0.65, duration: 900, useNativeDriver: false }).start();
    }, 2200);

    const t2 = setTimeout(() => {
      setCurrentStage(3);
      Animated.timing(globalProgress, { toValue: PROGRESS_TRACK_WIDTH * 0.88, duration: 900, useNativeDriver: false }).start();
    }, 4800);

    const t3 = setTimeout(() => {
      setCurrentStage(4);
      Animated.timing(globalProgress, { toValue: PROGRESS_TRACK_WIDTH, duration: 700, useNativeDriver: false }).start();
    }, 6800);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  // ── Complete onboarding → RootNavigator auto-routes to Dashboard ──────────
  const handleSkip = useCallback(async () => {
    await markOnboarded();
    // RootNavigator re-renders to main app stack when isOnboarded becomes true
  }, [markOnboarded]);

  const handleSkipPressIn = useCallback(() => {
    Animated.spring(skipBtnScale, { toValue: 0.96, useNativeDriver: true, tension: 300, friction: 8 }).start();
    shimmerX.setValue(-width);
    Animated.timing(shimmerX, { toValue: width * 1.5, duration: 900, useNativeDriver: true }).start();
  }, []);
  const handleSkipPressOut = useCallback(() => {
    Animated.spring(skipBtnScale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 8 }).start();
  }, []);

  const handleBack = useCallback(() => navigation.goBack(), []);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <Animated.View style={[styles.orb1, { opacity: orb1Opacity }]} />
      <Animated.View style={[styles.orb2, { opacity: orb2Opacity }]} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* ── Header ── */}
        <Animated.View style={[styles.header, { opacity: headerOp }]}>
          <View style={styles.headerLeft}>
            <HeaderIconBtn icon="arrow-back" onPress={handleBack} />
            <Text style={styles.headerTitle}>Hirelith</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerStep}>Step 4 of 4</Text>
            <HeaderIconBtn icon="close" onPress={handleBack} />
          </View>
        </Animated.View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero / icon ── */}
          <Animated.View
            style={[styles.heroSection, { opacity: heroOp, transform: [{ translateY: heroY }] }]}
          >
            {/* Icon with spin ring + aura */}
            <View style={styles.iconArea}>
              {/* Pulsing aura */}
              <Animated.View style={[styles.iconAura, { transform: [{ scale: auraScale }], opacity: auraOpacity }]} />
              {/* Spinning ring */}
              <Animated.View style={[styles.spinRing, { transform: [{ rotate: spin }] }]} />
              {/* Core circle */}
              <View style={styles.iconCircle}>
                <MaterialIcons name="auto-awesome" size={38} color="#cfbcff" />
              </View>
            </View>

            <Text style={styles.heroTitle}>AI Career Analysis</Text>
            <Text style={styles.heroSub}>
              Our neural engine is deconstructing your professional DNA to find the optimal path in today's market.
            </Text>

            {/* Global progress */}
            <View style={styles.globalProgressTrack}>
              <Animated.View style={{ width: globalProgress }}>
                <LinearGradient
                  colors={['#6750A4', '#cfbcff', '#e7c365']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.globalProgressFill}
                />
              </Animated.View>
            </View>
          </Animated.View>

          {/* ── Status cards ── */}
          <View style={styles.statusCards}>
            {STAGES.map((stage, i) => (
              <StatusCard
                key={stage.title}
                stageInfo={stage}
                index={i}
                currentStage={currentStage}
                animOp={cardAnims[i].op}
                animY={cardAnims[i].y}
              />
            ))}
          </View>

          {/* ── Scan panel ── */}
          <Animated.View
            style={[styles.scanPanel, { opacity: scanPanelOp, transform: [{ translateY: scanPanelY }] }]}
          >
            <LinearGradient
              colors={['rgba(103,80,164,0.08)', 'rgba(0,0,0,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ position: 'absolute', inset: 0, borderRadius: 20 }}
            />
            <View style={styles.scanLeft}>
              <View style={styles.scanAvatarWrap}>
                <View style={styles.scanAvatar}>
                  <MaterialIcons name="person" size={28} color="rgba(207,188,255,0.7)" />
                </View>
              </View>
              <View style={styles.scanTextWrap}>
                <Text style={styles.scanLabel}>Current Scan</Text>
                <Text style={styles.scanName} numberOfLines={1} ellipsizeMode="tail">Alex Rivera — Sr. Product Designer</Text>
              </View>
            </View>
            <View style={styles.scanStats}>
              <View style={styles.scanStat}>
                <Text style={styles.scanStatValue}>84%</Text>
                <Text style={styles.scanStatLabel}>Market Fit</Text>
              </View>
              <View style={styles.scanStat}>
                <Text style={[styles.scanStatValue, styles.scanStatGold]}>$165k</Text>
                <Text style={styles.scanStatLabel}>Potential</Text>
              </View>
            </View>
          </Animated.View>

          {/* ── Footer ── */}
          <Animated.View style={[styles.footer, { opacity: footerOp }]}>
            <Animated.View style={{ transform: [{ scale: skipBtnScale }] }}>
              <Pressable
                style={styles.skipBtn}
                onPressIn={handleSkipPressIn}
                onPressOut={handleSkipPressOut}
                onPress={handleSkip}
                android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)', borderless: false } : undefined}
              >
                <Text style={styles.skipBtnText}>
                  {currentStage >= 4 ? 'Proceed to Dashboard' : 'Skip to Dashboard'}
                </Text>
                <MaterialIcons name="arrow-forward" size={18} color="#cfbcff" />
              </Pressable>
            </Animated.View>

            {currentStage < 4 && (
              <View style={styles.analysisNote}>
                <PulsingDot />
                <Text style={styles.analysisNoteText}>Analysis will continue in the background</Text>
              </View>
            )}
          </Animated.View>
        </ScrollView>

        {/* ── Bottom status pill ── */}
        <Animated.View style={[styles.bottomPill, { opacity: footerOp }]}>
          <PulsingDot />
          <Text style={styles.bottomPillText}>Analyzing work history patterns...</Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
