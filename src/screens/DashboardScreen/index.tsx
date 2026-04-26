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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from 'react-native-svg';
import { styles } from './DashboardScreen.styles';
import { BottomNavBar } from '../../components/BottomNavBar';

const { width } = Dimensions.get('window');

// ─── Quick actions data ───────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  {
    id: 'jobs',
    icon: 'work' as const,
    title: 'Apply Jobs',
    sub: '12 matches today',
    iconBg: 'rgba(99,102,241,0.12)',
    iconColor: '#818CF8',
    gradColors: ['rgba(99,102,241,0.25)', 'rgba(99,102,241,0.08)'] as const,
  },
  {
    id: 'practice',
    icon: 'psychology' as const,
    title: 'Practice Now',
    sub: 'Mock interviews',
    iconBg: 'rgba(34,211,238,0.1)',
    iconColor: '#22D3EE',
    gradColors: ['rgba(34,211,238,0.18)', 'rgba(34,211,238,0.06)'] as const,
  },
  {
    id: 'email',
    icon: 'mail' as const,
    title: 'Send Emails',
    sub: 'AI networking tools',
    iconBg: 'rgba(167,139,250,0.1)',
    iconColor: '#A78BFA',
    gradColors: ['rgba(167,139,250,0.18)', 'rgba(167,139,250,0.06)'] as const,
  },
] as const;

// ─── News data ────────────────────────────────────────────────────────────────
const NEWS = [
  {
    id: '1',
    category: 'Industry Trends',
    categoryColor: '#22D3EE',
    title: 'How AI is Reshaping Senior Product Management in 2025',
    read: '3 min read',
    trending: 'Trending now',
    trendingColor: '#818CF8',
    thumbColors: ['#1E1B4B', '#312E81'] as const,
    thumbIcon: 'trending-up' as const,
  },
  {
    id: '2',
    category: 'Market Watch',
    categoryColor: '#C084FC',
    title: 'Top 10 High-Growth Startups Hiring Remotely This Month',
    read: '5 min read',
    trending: 'Just posted',
    trendingColor: '#22D3EE',
    thumbColors: ['#1E1F3D', '#2D1B69'] as const,
    thumbIcon: 'query-stats' as const,
  },
] as const;

// ─── AI Suggestions ───────────────────────────────────────────────────────────
const AI_SUGGESTIONS = [
  {
    id: '1',
    dotColor: '#22D3EE',
    shadowColor: 'rgba(34,211,238,0.5)',
    parts: [
      { text: 'Update your ' },
      { text: 'GitHub portfolio', bold: true },
      { text: '. We noticed 3 new repositories that aren\'t featured yet.' },
    ],
  },
  {
    id: '2',
    dotColor: '#818CF8',
    shadowColor: 'rgba(129,140,248,0.5)',
    parts: [
      { text: 'Connect with ' },
      { text: 'Sarah Chen', bold: true },
      { text: ' from OpenUI. She is a 2nd-degree connection at your dream company.' },
    ],
  },
  {
    id: '3',
    dotColor: '#C084FC',
    shadowColor: 'rgba(192,132,252,0.5)',
    parts: [
      { text: 'Refine your ' },
      { text: 'Impact Statements', bold: true },
      { text: '. Adding metrics could increase interview callbacks by 30%.' },
    ],
  },
] as const;

// ─── Circular progress (SVG) ──────────────────────────────────────────────────
function CircularProgress({ progress = 82 }: { progress: number }) {
  const size       = 200;
  const strokeW    = 12;
  const r          = (size - strokeW) / 2;
  const circ       = 2 * Math.PI * r;
  const targetOff  = circ * (1 - progress / 100);

  const [dashOffset, setDashOffset] = useState(circ);
  const anim = useRef(new Animated.Value(circ)).current;

  useEffect(() => {
    anim.addListener(({ value }) => setDashOffset(value));
    const t = setTimeout(() => {
      Animated.timing(anim, {
        toValue: targetOff,
        duration: 2200,
        useNativeDriver: false,
      }).start();
    }, 600);
    return () => { clearTimeout(t); anim.removeAllListeners(); };
  }, []);

  return (
    <View style={[styles.circleWrap, { width: size, height: size }]}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Defs>
          <SvgGradient id="ring_g" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#8B5CF6" />
            <Stop offset="1" stopColor="#22D3EE" />
          </SvgGradient>
        </Defs>
        {/* Track */}
        <Circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeW}
          fill="none"
        />
        {/* Progress arc */}
        <Circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="url(#ring_g)"
          strokeWidth={strokeW}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </Svg>
      {/* Center content */}
      <View style={styles.circleCenter}>
        <Text style={styles.circleScore}>{progress}%</Text>
        <Text style={styles.circleEliteBadge}>ELITE</Text>
      </View>
    </View>
  );
}

// ─── Pulsing green dot ────────────────────────────────────────────────────────
function GreenPulseDot() {
  const s = useRef(new Animated.Value(1)).current;
  const o = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(s, { toValue: 2.4, duration: 1000, useNativeDriver: true }),
          Animated.timing(o, { toValue: 0,   duration: 1000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(s, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(o, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);
  return (
    <View style={{ width: 7, height: 7, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ position: 'absolute', width: 7, height: 7, borderRadius: 4, backgroundColor: '#22C55E', transform: [{ scale: s }], opacity: o }} />
      <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: '#22C55E' }} />
    </View>
  );
}

// ─── DashboardScreen ──────────────────────────────────────────────────────────
interface CareerAnalysis {
  readinessScore?: number;
  marketFitScore?: number;
  breakdown?: {
    technicalDepth: number;
    impactAndAchievements: number;
    careerTrajectory: number;
    marketCompetitiveness: number;
    presentationQuality: number;
    goalAlignment: number;
  };
  verdict?: string;
  strengths?: string[];
  criticalGaps?: string[];
  marketReality?: string;
  actionPlan?: string[];
  honestTimeline?: string;
  salaryPotential?: string;
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { signOut, backendUser } = useAuth();
  const [careerAnalysis, setCareerAnalysis] = useState<CareerAnalysis | null>(null);

  useEffect(() => {
    if (!backendUser?.id) return;
    api.get<CareerAnalysis>(`/api/v1/career-analysis/${backendUser.id}`)
      .then(setCareerAnalysis)
      .catch(() => { /* silent — keep defaults */ });
  }, [backendUser?.id]);

  const [challengeDismissed, setChallengeDismissed] = useState(false);
  const [syncLabel, setSyncLabel] = useState('2 mins ago');
  const [syncing, setSyncing] = useState(false);

  function navigateTab(screen: keyof RootStackParamList) {
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: screen }] }));
  }

  // ── Animated values ──────────────────────────────────────────────────────
  const orb1Op   = useRef(new Animated.Value(0.08)).current;
  const orb2Op   = useRef(new Animated.Value(0.05)).current;
  const headerOp = useRef(new Animated.Value(0)).current;
  const welcomeY = useRef(new Animated.Value(16)).current;
  const welcomeOp= useRef(new Animated.Value(0)).current;
  const challengeY = useRef(new Animated.Value(24)).current;
  const challengeOp= useRef(new Animated.Value(0)).current;
  const readinessY = useRef(new Animated.Value(24)).current;
  const readinessOp= useRef(new Animated.Value(0)).current;
  const floatAnim  = useRef(new Animated.Value(0)).current;
  const actionsOp  = useRef(new Animated.Value(0)).current;
  const actionsY   = useRef(new Animated.Value(16)).current;
  const newsOp     = useRef(new Animated.Value(0)).current;
  const newsY      = useRef(new Animated.Value(16)).current;
  const aiOp       = useRef(new Animated.Value(0)).current;
  const aiY        = useRef(new Animated.Value(16)).current;
  const practiceBtnScale = useRef(new Animated.Value(1)).current;
  const shimmerX   = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    // Orb pulses
    Animated.loop(Animated.sequence([
      Animated.timing(orb1Op, { toValue: 0.14, duration: 4000, useNativeDriver: true }),
      Animated.timing(orb1Op, { toValue: 0.05, duration: 4000, useNativeDriver: true }),
    ])).start();
    setTimeout(() => {
      Animated.loop(Animated.sequence([
        Animated.timing(orb2Op, { toValue: 0.09, duration: 3200, useNativeDriver: true }),
        Animated.timing(orb2Op, { toValue: 0.03, duration: 3200, useNativeDriver: true }),
      ])).start();
    }, 2000);

    // Float animation (job readiness card)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -8, duration: 3000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0,  duration: 3000, useNativeDriver: true }),
      ])
    ).start();

    // Entrance sequence
    Animated.sequence([
      Animated.timing(headerOp, { toValue: 1, duration: 120, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(welcomeY, { toValue: 0, useNativeDriver: true, tension: 120, friction: 12 }),
        Animated.timing(welcomeOp, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(challengeY, { toValue: 0, useNativeDriver: true, tension: 120, friction: 12 }),
        Animated.timing(challengeOp, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(readinessY, { toValue: 0, useNativeDriver: true, tension: 120, friction: 12 }),
        Animated.timing(readinessOp, { toValue: 1, duration: 160, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(actionsY, { toValue: 0, useNativeDriver: true, tension: 120, friction: 12 }),
        Animated.timing(actionsOp, { toValue: 1, duration: 160, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(newsY, { toValue: 0, useNativeDriver: true, tension: 120, friction: 12 }),
        Animated.timing(newsOp, { toValue: 1, duration: 160, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(aiY, { toValue: 0, useNativeDriver: true, tension: 120, friction: 12 }),
        Animated.timing(aiOp, { toValue: 1, duration: 160, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handlePracticeIn = useCallback(() => {
    Animated.spring(practiceBtnScale, { toValue: 0.95, useNativeDriver: true, tension: 300, friction: 8 }).start();
    shimmerX.setValue(-200);
    Animated.timing(shimmerX, { toValue: 400, duration: 900, useNativeDriver: true }).start();
  }, []);
  const handlePracticeOut = useCallback(() => {
    Animated.spring(practiceBtnScale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 8 }).start();
  }, []);

  const readinessScore = careerAnalysis?.readinessScore ?? 82;

  const dynamicSuggestions = careerAnalysis
    ? [
        ...(careerAnalysis.criticalGaps ?? []).slice(0, 2).map((gap, i) => ({
          id: `gap-${i}`,
          dotColor: '#22D3EE',
          shadowColor: 'rgba(34,211,238,0.5)',
          parts: [{ text: gap }] as { text: string; bold?: boolean }[],
        })),
        ...(careerAnalysis.actionPlan ?? []).slice(0, 2).map((action, i) => ({
          id: `action-${i}`,
          dotColor: '#818CF8',
          shadowColor: 'rgba(129,140,248,0.5)',
          parts: [{ text: action }] as { text: string; bold?: boolean }[],
        })),
      ].slice(0, 3)
    : AI_SUGGESTIONS.map(s => ({ ...s, parts: s.parts as { text: string; bold?: boolean }[] }));

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <Animated.View style={[styles.orb1, { opacity: orb1Op }]} />
      <Animated.View style={[styles.orb2, { opacity: orb2Op }]} />

      <View style={{ flex: 1, paddingTop: insets.top }}>
        {/* ── Header ── */}
        <Animated.View style={[styles.header, { opacity: headerOp }]}>
          <View style={styles.headerLeft}>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>A</Text>
            </View>
            <Text style={styles.headerBrand}>
              Hire<Text style={styles.headerBrandAccent}>lith</Text>
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable
              style={styles.headerNotifBtn}
              onPress={() => navigation.navigate('Notifications')}
            >
              <MaterialIcons name="notifications-none" size={22} color="rgba(148,163,184,0.7)" />
              <View style={styles.notifDot} />
            </Pressable>
            <Pressable
              style={styles.headerSettingsBtn}
              onPress={() =>
                Alert.alert('Account', 'What would you like to do?', [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: () => signOut(),
                  },
                ])
              }
            >
              <MaterialIcons name="settings" size={20} color="rgba(148,163,184,0.7)" />
            </Pressable>
          </View>
        </Animated.View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Welcome ── */}
          <Animated.View
            style={[styles.welcomeSection, { opacity: welcomeOp, transform: [{ translateY: welcomeY }] }]}
          >
            <Text style={styles.welcomeTitle}>Welcome back, Alex.</Text>
            <Text style={styles.welcomeSub}>
              Your AI copilot has identified{' '}
              <Text style={styles.welcomeSubAccent}>3 new high-match</Text>
              {' '}opportunities today.
            </Text>
            <View style={styles.welcomeBadgeRow}>
              <View style={styles.headerBadge}>
                <MaterialIcons name="local-fire-department" size={14} color="#FB923C" />
                <Text style={styles.headerBadgeText}>12 Day Streak</Text>
              </View>
              <View style={styles.headerBadge}>
                <MaterialIcons name="military-tech" size={14} color="#818CF8" />
                <Text style={styles.headerBadgeText}>2,450 XP</Text>
              </View>
            </View>
          </Animated.View>

          {/* ── AI Career Audit Card ── */}
          <Animated.View
            style={[styles.dailyChallengeWrap, { opacity: challengeOp, transform: [{ translateY: challengeY }] }]}
          >
            <Pressable
              onPress={() => navigateTab('Audit')}
              style={styles.auditHeroCard}
              android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)' } : undefined}
            >
              <LinearGradient
                colors={['rgba(124,58,237,0.25)', 'rgba(59,130,246,0.15)', 'rgba(6,182,212,0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 24 }}
              />
              {/* top-right glow */}
              <View style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(167,139,250,0.12)' }} />

              <View style={styles.auditHeroInner}>
                {/* Left: text + score ring */}
                <View style={{ flex: 1, gap: 6 }}>
                  <View style={styles.auditHeroTag}>
                    <MaterialIcons name="auto-awesome" size={11} color="#A78BFA" />
                    <Text style={styles.auditHeroTagText}>AI CAREER AUDIT</Text>
                  </View>
                  <Text style={styles.auditHeroTitle}>Your Audit{'\n'}is Ready</Text>
                  <Text style={styles.auditHeroSub}>Based on 142 data points.</Text>
                  <Pressable
                    onPress={() => navigateTab('Audit')}
                    style={{ marginTop: 8, borderRadius: 12, overflow: 'hidden', alignSelf: 'flex-start' }}
                  >
                    <LinearGradient
                      colors={['#7C3AED', '#3B82F6', '#06B6D4']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.auditHeroBtn}
                    >
                      <Text style={styles.auditHeroBtnText}>View Report</Text>
                      <MaterialIcons name="arrow-forward" size={14} color="white" />
                    </LinearGradient>
                  </Pressable>
                </View>

                {/* Right: score ring */}
                <View style={styles.auditScoreRing}>
                  <Svg width={88} height={88} style={{ transform: [{ rotate: '-90deg' }] }}>
                    <Defs>
                      <SvgGradient id="audit_g" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor="#A78BFA" />
                        <Stop offset="1" stopColor="#22D3EE" />
                      </SvgGradient>
                    </Defs>
                    <Circle cx={44} cy={44} r={38} stroke="rgba(255,255,255,0.06)" strokeWidth={7} fill="none" />
                    <Circle
                      cx={44} cy={44} r={38}
                      stroke="url(#audit_g)"
                      strokeWidth={7}
                      fill="none"
                      strokeDasharray={2 * Math.PI * 38}
                      strokeDashoffset={2 * Math.PI * 38 * (1 - (readinessScore / 100))}
                      strokeLinecap="round"
                    />
                  </Svg>
                  <View style={styles.auditScoreCenter}>
                    <Text style={styles.auditScoreNum}>{readinessScore}</Text>
                    <Text style={styles.auditScoreLabel}>%</Text>
                  </View>
                </View>
              </View>
            </Pressable>

            {/* Top 3 Action Items */}
            <View style={styles.auditActionsSection}>
              <View style={styles.auditActionsHeader}>
                <Text style={styles.auditActionsTitle}>Top Action Items</Text>
                <Text style={styles.auditActionsPriority}>Priority High</Text>
              </View>
              {(careerAnalysis?.actionPlan ?? [
                'Rewrite bullet points with XYZ formula',
                'Expand stack depth with certifications',
                'Mock interview prep for Senior roles',
              ]).slice(0, 3).map((item, i) => {
                const ITEM_COLORS = ['#A78BFA', '#60A5FA', '#22D3EE'];
                const ITEM_ICONS = ['edit-note', 'hub', 'chat'] as const;
                return (
                  <Pressable
                    key={i}
                    style={styles.auditActionCard}
                    onPress={() => navigateTab('Audit')}
                    android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.04)' } : undefined}
                  >
                    <View style={[styles.auditActionIconWrap, { backgroundColor: `${ITEM_COLORS[i]}18` }]}>
                      <MaterialIcons name={ITEM_ICONS[i]} size={20} color={ITEM_COLORS[i]} />
                    </View>
                    <Text style={styles.auditActionText} numberOfLines={2}>{item}</Text>
                    <MaterialIcons name="chevron-right" size={18} color="rgba(100,116,139,0.5)" />
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>

          {/* ── Daily Challenge ── */}
          {!challengeDismissed && <Animated.View
            style={[styles.dailyChallengeWrap, { opacity: challengeOp, transform: [{ translateY: challengeY }] }]}
          >
            <View style={styles.dailyChallengeCard}>
              <LinearGradient
                colors={['#0F0C29', '#1a1040', '#0B0F1A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 28 }}
              />
              {/* Decorative glow */}
              <LinearGradient
                colors={['rgba(99,102,241,0.3)', 'rgba(0,0,0,0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 160, borderRadius: 28 }}
              />

              <View style={styles.dailyChallengeInner}>
                <View style={styles.dailyTopRow}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.dailyTag}>
                      <Text style={styles.dailyTagText}>Daily Challenge</Text>
                    </View>
                    <Text style={styles.dailyChallengeTitle}>
                      Simulate a System Design Interview
                    </Text>
                  </View>
                  <View style={styles.dailyTimeCard}>
                    <Text style={styles.dailyTimeLabel}>Est. Time</Text>
                    <Text style={styles.dailyTimeValue}>15</Text>
                    <Text style={[styles.dailyTimeLabel, { marginTop: 0 }]}>MINS</Text>
                  </View>
                </View>

                <Text style={styles.dailyChallengeDesc}>
                  Practice explaining high-level architecture for a real-time messaging app.
                  Improve your technical communication score by{' '}
                  <Text style={styles.dailyChallengeDescAccent}>12%</Text>.
                </Text>

                <View style={styles.dailyActions}>
                  <Animated.View style={[styles.practiceNowBtn, { transform: [{ scale: practiceBtnScale }] }]}>
                    <Pressable
                      onPressIn={handlePracticeIn}
                      onPressOut={handlePracticeOut}
                      onPress={() => navigateTab('Challenges')}
                      style={{ borderRadius: 16, overflow: 'hidden' }}
                      android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.1)' } : undefined}
                    >
                      <LinearGradient
                        colors={['#6366F1', '#22D3EE']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.practiceNowBtnInner}
                      >
                        {/* Shimmer */}
                        <Animated.View style={[{ position: 'absolute', top: 0, bottom: 0, width: 80, zIndex: 2, transform: [{ translateX: shimmerX }] }]}>
                          <LinearGradient
                            colors={['rgba(0,0,0,0)', 'rgba(255,255,255,0.22)', 'rgba(0,0,0,0)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ flex: 1 }}
                          />
                        </Animated.View>
                        <Text style={styles.practiceNowBtnText}>Practice Now</Text>
                        <MaterialIcons name="arrow-forward" size={16} color="white" />
                      </LinearGradient>
                    </Pressable>
                  </Animated.View>
                  <Pressable
                    style={styles.remindBtn}
                    onPress={() => setChallengeDismissed(true)}
                    android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)' } : undefined}
                  >
                    <Text style={styles.remindBtnText}>Remind Later</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Animated.View>}

          {/* ── Job Readiness ── */}
          <Animated.View
            style={[styles.jobReadinessWrap, { opacity: readinessOp, transform: [{ translateY: readinessY }, { translateY: floatAnim }] }]}
          >
            <View style={styles.jobReadinessCard}>
              <Text style={styles.jobReadinessTitle}>Job Readiness</Text>
              <CircularProgress progress={readinessScore} />
              <Text style={styles.jobReadinessSub}>
                You're in the{' '}
                <Text style={styles.jobReadinessSubBold}>top 5%</Text>
                {' '}of applicants for Senior Product Designer roles.
              </Text>
            </View>
          </Animated.View>

          {/* ── Quick Actions ── */}
          <Animated.View
            style={[styles.quickActionsSection, { opacity: actionsOp, transform: [{ translateY: actionsY }] }]}
          >
            {QUICK_ACTIONS.map(action => (
              <Pressable
                key={action.id}
                style={styles.quickActionCard}
                onPress={() => {
                  if (action.id === 'jobs')     navigateTab('Marketplace');
                  else if (action.id === 'practice') navigateTab('Challenges');
                  else if (action.id === 'email')    navigateTab('Feed');
                }}
                android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)' } : undefined}
              >
                <LinearGradient
                  colors={action.gradColors}
                  style={styles.quickActionIconWrap}
                >
                  <MaterialIcons name={action.icon} size={26} color={action.iconColor} />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  <Text style={styles.quickActionSub}>{action.sub}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="rgba(100,116,139,0.5)" style={styles.quickActionChevron} />
              </Pressable>
            ))}
          </Animated.View>

          {/* ── Career Insights ── */}
          <Animated.View style={{ opacity: newsOp, transform: [{ translateY: newsY }] }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Career Insights</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => navigateTab('Feed')}>
                <Text style={styles.sectionViewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.newsSection}>
              {NEWS.map(item => (
                <Pressable
                  key={item.id}
                  style={styles.newsCard}
                  onPress={() => navigateTab('Feed')}
                  android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.04)' } : undefined}
                >
                  <View style={styles.newsThumb}>
                    <LinearGradient
                      colors={item.thumbColors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                    >
                      <MaterialIcons name={item.thumbIcon} size={28} color="rgba(255,255,255,0.3)" />
                    </LinearGradient>
                  </View>
                  <View style={styles.newsContent}>
                    <Text style={[styles.newsCategoryText, { color: item.categoryColor }]}>
                      {item.category}
                    </Text>
                    <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                    <View style={styles.newsMeta}>
                      <Text style={styles.newsMetaText}>{item.read}</Text>
                      <View style={styles.newsMetaDot} />
                      <Text style={[styles.newsTrendText, { color: item.trendingColor }]}>
                        {item.trending}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          {/* ── AI Suggestions ── */}
          <Animated.View
            style={[styles.aiSuggestionsSection, { opacity: aiOp, transform: [{ translateY: aiY }] }]}
          >
            <View style={styles.aiSuggestionsCard}>
              <View style={styles.aiSuggestionsGlow} />

              <View style={styles.aiSuggestionsHeader}>
                <View style={styles.aiIconWrap}>
                  <MaterialIcons name="auto-awesome" size={22} color="#818CF8" />
                </View>
                <Text style={styles.aiSuggestionsTitle}>AI Suggestions</Text>
              </View>

              {dynamicSuggestions.map((s, i) => (
                <View key={s.id} style={[styles.aiSuggestion, i === dynamicSuggestions.length - 1 && { marginBottom: 0 }]}>
                  <View style={styles.aiSuggestionDotWrap}>
                    <View style={[styles.aiSuggestionDot, { backgroundColor: s.dotColor, shadowColor: s.shadowColor, shadowOpacity: 0.8, shadowRadius: 6, shadowOffset: { width: 0, height: 0 }, elevation: 4 }]} />
                  </View>
                  <Text style={styles.aiSuggestionText}>
                    {s.parts.map((p, pi) => (
                      <Text key={pi} style={p.bold ? styles.aiSuggestionBold : undefined}>
                        {p.text}
                      </Text>
                    ))}
                  </Text>
                </View>
              ))}

              <View style={styles.aiSuggestionsFooter}>
                <View style={styles.aiSyncRow}>
                  <GreenPulseDot />
                  <Text style={styles.aiSyncText}>AI Sync: {syncLabel}</Text>
                </View>
                <Pressable
                  onPress={() => {
                    if (syncing) return;
                    setSyncing(true);
                    setSyncLabel('Syncing...');
                    shimmerX.setValue(-200);
                    Animated.timing(shimmerX, { toValue: 400, duration: 900, useNativeDriver: true }).start();
                    setTimeout(() => {
                      setSyncLabel('Just now');
                      setSyncing(false);
                    }, 1200);
                  }}
                >
                  <MaterialIcons name="refresh" size={20} color={syncing ? '#22D3EE' : 'rgba(100,116,139,0.7)'} />
                </Pressable>
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* ── Bottom Navigation ── */}
        <BottomNavBar
          activeTab="dashboard"
          activeColor="#A5B4FC"
          activeBg="rgba(99,102,241,0.2)"
        />
      </View>
    </View>
  );
}
