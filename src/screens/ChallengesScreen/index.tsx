import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  Platform,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import { styles } from './ChallengesScreen.styles';
import { BottomNavBar } from '../../components/BottomNavBar';

const { width } = Dimensions.get('window');
const TAB_WIDTH = (width - 32 - 8) / 3; // screen - horizontal padding - switcher padding

// ── Data ─────────────────────────────────────────────────────────────────────
type TabKey = 'active' | 'completed' | 'missed';

type Challenge = {
  id: string;
  title: string;
  difficulty: string;
  difficultyColor: string;
  difficultyBg: string;
  difficultyBorder: string;
  status: string;
  statusColor: string;
  xp: number;
  hint: string;
  hasActions: boolean;
  category?: string;
};

const CHALLENGES: Record<TabKey, Challenge[]> = {
  active: [
    {
      id: 'a1',
      title: 'Scale-up Database Sharding',
      category: 'System Design',
      difficulty: 'Expert',
      difficultyColor: '#A855F7',
      difficultyBg: 'rgba(168,85,247,0.1)',
      difficultyBorder: 'rgba(168,85,247,0.25)',
      status: 'ONGOING',
      statusColor: '#22D3EE',
      xp: 450,
      hint: '"Think about horizontal partitioning strategies. Consider how a consistent hash ring handles node failures gracefully."',
      hasActions: true,
    },
    {
      id: 'a2',
      title: 'Consistent Hashing Logic',
      category: 'System Design',
      difficulty: 'Intermediate',
      difficultyColor: '#60A5FA',
      difficultyBg: 'rgba(96,165,250,0.1)',
      difficultyBorder: 'rgba(96,165,250,0.25)',
      status: 'NOT STARTED',
      statusColor: 'rgba(100,116,139,0.7)',
      xp: 300,
      hint: '"Think about how data is distributed when a new node is added. Does the hashing function minimize movement?"',
      hasActions: true,
    },
    {
      id: 'a3',
      title: 'Design a Rate Limiter',
      category: 'Algorithms',
      difficulty: 'Intermediate',
      difficultyColor: '#60A5FA',
      difficultyBg: 'rgba(96,165,250,0.1)',
      difficultyBorder: 'rgba(96,165,250,0.25)',
      status: 'NOT STARTED',
      statusColor: 'rgba(100,116,139,0.7)',
      xp: 280,
      hint: '"Consider token bucket vs sliding window algorithms. What are the tradeoffs at massive scale?"',
      hasActions: true,
    },
    {
      id: 'a4',
      title: 'WebSocket Real-time Chat',
      category: 'Algorithms',
      difficulty: 'Beginner',
      difficultyColor: '#34D399',
      difficultyBg: 'rgba(52,211,153,0.1)',
      difficultyBorder: 'rgba(52,211,153,0.25)',
      status: 'NOT STARTED',
      statusColor: 'rgba(100,116,139,0.7)',
      xp: 180,
      hint: '"Focus on the handshake protocol first. Then think about how rooms and presence work in Socket.IO."',
      hasActions: true,
    },
  ],
  completed: [
    {
      id: 'c1',
      title: 'REST API Design Patterns',
      difficulty: 'Beginner',
      difficultyColor: '#34D399',
      difficultyBg: 'rgba(52,211,153,0.1)',
      difficultyBorder: 'rgba(52,211,153,0.25)',
      status: 'COMPLETED',
      statusColor: '#34D399',
      xp: 200,
      hint: '',
      hasActions: false,
    },
    {
      id: 'c2',
      title: 'Git Branching Strategy',
      difficulty: 'Beginner',
      difficultyColor: '#34D399',
      difficultyBg: 'rgba(52,211,153,0.1)',
      difficultyBorder: 'rgba(52,211,153,0.25)',
      status: 'COMPLETED',
      statusColor: '#34D399',
      xp: 150,
      hint: '',
      hasActions: false,
    },
    {
      id: 'c3',
      title: 'SQL Query Optimization',
      difficulty: 'Intermediate',
      difficultyColor: '#60A5FA',
      difficultyBg: 'rgba(96,165,250,0.1)',
      difficultyBorder: 'rgba(96,165,250,0.25)',
      status: 'COMPLETED',
      statusColor: '#34D399',
      xp: 320,
      hint: '',
      hasActions: false,
    },
  ],
  missed: [
    {
      id: 'm1',
      title: 'Event Sourcing Patterns',
      difficulty: 'Expert',
      difficultyColor: '#A855F7',
      difficultyBg: 'rgba(168,85,247,0.1)',
      difficultyBorder: 'rgba(168,85,247,0.25)',
      status: 'MISSED',
      statusColor: '#F87171',
      xp: 500,
      hint: '"Focus on event streams and how to rebuild state by replaying events."',
      hasActions: true,
    },
    {
      id: 'm2',
      title: 'CQRS Implementation',
      difficulty: 'Expert',
      difficultyColor: '#A855F7',
      difficultyBg: 'rgba(168,85,247,0.1)',
      difficultyBorder: 'rgba(168,85,247,0.25)',
      status: 'MISSED',
      statusColor: '#F87171',
      xp: 420,
      hint: '',
      hasActions: true,
    },
  ],
};

const CATEGORIES = ['All Challenges', 'System Design', 'Algorithms', 'UX Strategy'];

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner({ cyan = false }: { cyan?: boolean }) {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 700, useNativeDriver: true })
    ).start();
  }, []);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <Animated.View
      style={[styles.spinnerRing, cyan && styles.spinnerRingCyan, { transform: [{ rotate }] }]}
    />
  );
}

// ── Hint Panel ────────────────────────────────────────────────────────────────
function HintPanel({ hint, visible, onClose }: { hint: string; visible: boolean; onClose: () => void }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: 280,
      useNativeDriver: false,
    }).start();
  }, [visible]);

  const maxH = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 160] });
  const opacity = anim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 0, 1] });

  return (
    <Animated.View style={[styles.hintPanel, { maxHeight: maxH, opacity }]}>
      <View style={styles.hintPanelInner}>
        <View style={styles.hintPanelHeader}>
          <View style={styles.hintPanelHeaderLeft}>
            <View style={styles.hintIconWrap}>
              <MaterialIcons name="auto-awesome" size={16} color="#22D3EE" />
            </View>
            <Text style={styles.hintPanelTitle}>AI Suggestion</Text>
          </View>
          <Pressable style={styles.hintCloseBtn} onPress={onClose} hitSlop={10}>
            <MaterialIcons name="close" size={16} color="rgba(34,211,238,0.5)" />
          </Pressable>
        </View>
        <Text style={styles.hintText}>{hint}</Text>
        <View style={styles.hintProgressTrack}>
          <LinearGradient
            colors={['#A855F7', '#22D3EE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.hintProgressFill, { width: '33%' }]}
          />
        </View>
      </View>
    </Animated.View>
  );
}

// ── Challenge Card ────────────────────────────────────────────────────────────
function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const [hintVisible, setHintVisible] = useState(false);
  const [arrowLoading, setArrowLoading] = useState(false);
  const [startLoading, setStartLoading] = useState(false);

  const isOngoing = challenge.status === 'ONGOING';
  const isMissed = challenge.status === 'MISSED';
  const isCompleted = challenge.status === 'COMPLETED';

  function handleArrow() {
    if (arrowLoading) return;
    setArrowLoading(true);
    setTimeout(() => setArrowLoading(false), 1500);
  }

  function handleStart() {
    if (startLoading) return;
    setStartLoading(true);
    setTimeout(() => setStartLoading(false), 1500);
  }

  return (
    <View style={styles.challengeCard}>
      <View style={styles.challengeCardTop}>
        <View style={styles.challengeCardLeft}>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <View style={styles.challengeBadgeRow}>
            <View style={[styles.difficultyBadge, {
              backgroundColor: challenge.difficultyBg,
              borderColor: challenge.difficultyBorder,
            }]}>
              <Text style={[styles.difficultyText, { color: challenge.difficultyColor }]}>
                {challenge.difficulty}
              </Text>
            </View>
            <View style={styles.statusDot} />
            <Text style={[styles.statusText, { color: challenge.statusColor }]}>
              {challenge.status}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
          <Text style={styles.challengeXp}>{challenge.xp}</Text>
          <Text style={styles.challengeXpLabel}>XP</Text>
        </View>
      </View>

      {/* Action row */}
      {challenge.hasActions && (
        <View style={styles.challengeActions}>
          {isOngoing ? (
            <>
              {/* Get Hint */}
              <Pressable
                style={[styles.hintBtn, hintVisible && styles.hintBtnActive]}
                onPress={() => setHintVisible(v => !v)}
                android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)' } : undefined}
              >
                <MaterialIcons
                  name="lightbulb"
                  size={16}
                  color={hintVisible ? '#22D3EE' : 'rgba(226,232,240,0.7)'}
                />
                <Text style={[styles.hintBtnText, hintVisible && styles.hintBtnTextActive]}>
                  {hintVisible ? 'Hide Hint' : 'Get Hint'}
                </Text>
              </Pressable>
              {/* Continue arrow */}
              <Pressable
                style={styles.arrowBtn}
                onPress={handleArrow}
                hitSlop={6}
                android_ripple={Platform.OS === 'android' ? { color: 'rgba(34,211,238,0.1)', borderless: true } : undefined}
              >
                {arrowLoading ? <Spinner cyan /> : <MaterialIcons name="arrow-forward" size={20} color="#22D3EE" />}
              </Pressable>
            </>
          ) : isMissed ? (
            <>
              {/* Retry */}
              <Pressable
                style={[styles.startBtn, { backgroundColor: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.25)' }]}
                onPress={handleStart}
                android_ripple={Platform.OS === 'android' ? { color: 'rgba(248,113,113,0.1)' } : undefined}
              >
                {startLoading ? <Spinner /> : <MaterialIcons name="refresh" size={16} color="#F87171" />}
                <Text style={[styles.startBtnText, { color: '#F87171' }]}>
                  {startLoading ? 'Loading...' : 'Retry Challenge'}
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              {/* Get Hint (NOT STARTED) */}
              <Pressable
                style={[styles.hintBtn, hintVisible && styles.hintBtnActive]}
                onPress={() => setHintVisible(v => !v)}
                android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)' } : undefined}
              >
                <MaterialIcons name="lightbulb" size={16} color={hintVisible ? '#22D3EE' : 'rgba(226,232,240,0.7)'} />
                <Text style={[styles.hintBtnText, hintVisible && styles.hintBtnTextActive]}>
                  {hintVisible ? 'Hide Hint' : 'Get Hint'}
                </Text>
              </Pressable>
              {/* Start */}
              <Pressable
                style={styles.arrowBtn}
                onPress={handleStart}
                hitSlop={6}
                android_ripple={Platform.OS === 'android' ? { color: 'rgba(168,85,247,0.1)', borderless: true } : undefined}
              >
                {startLoading
                  ? <Spinner cyan />
                  : <MaterialIcons name="arrow-forward" size={20} color="#22D3EE" />}
              </Pressable>
            </>
          )}
        </View>
      )}

      {/* Hint panel */}
      {challenge.hint ? (
        <HintPanel hint={challenge.hint} visible={hintVisible} onClose={() => setHintVisible(false)} />
      ) : null}
    </View>
  );
}

// ── Completed card (simpler) ──────────────────────────────────────────────────
function CompletedCard({ challenge }: { challenge: Challenge }) {
  return (
    <View style={[styles.challengeCard, { borderColor: 'rgba(52,211,153,0.15)' }]}>
      <View style={styles.challengeCardTop}>
        <View style={styles.challengeCardLeft}>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <View style={styles.challengeBadgeRow}>
            <View style={[styles.difficultyBadge, { backgroundColor: challenge.difficultyBg, borderColor: challenge.difficultyBorder }]}>
              <Text style={[styles.difficultyText, { color: challenge.difficultyColor }]}>{challenge.difficulty}</Text>
            </View>
            <View style={styles.statusDot} />
            <Text style={[styles.statusText, { color: '#34D399' }]}>COMPLETED</Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
          <Text style={[styles.challengeXp, { color: '#34D399' }]}>+{challenge.xp}</Text>
          <Text style={styles.challengeXpLabel}>XP EARNED</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <MaterialIcons name="check-circle" size={16} color="#34D399" />
        <Text style={{ fontSize: 12, color: 'rgba(52,211,153,0.8)', fontWeight: '600' }}>
          Challenge completed successfully
        </Text>
      </View>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
const TABS: { key: TabKey; label: string }[] = [
  { key: 'active',    label: 'Active'    },
  { key: 'completed', label: 'Completed' },
  { key: 'missed',    label: 'Missed'    },
];

export default function ChallengesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [activeTab, setActiveTab] = useState<TabKey>('active');
  const [activeCategory, setActiveCategory] = useState(0);
  const [startLoading, setStartLoading] = useState(false);
  const [startDone, setStartDone] = useState(false);

  // Tab slider animation
  const tabSliderX = useRef(new Animated.Value(0)).current;

  // Entrance animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 120, friction: 12 }),
    ]).start();
  }, []);

  function switchTab(tab: TabKey, index: number) {
    setActiveTab(tab);
    Animated.spring(tabSliderX, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
      speed: 24,
      bounciness: 4,
    }).start();
  }

  function handleStartNow() {
    if (startLoading) return;
    setStartLoading(true);
    setStartDone(false);
    setTimeout(() => {
      setStartLoading(false);
      setStartDone(true);
      setTimeout(() => setStartDone(false), 2500);
    }, 2000);
  }

  const challenges = useMemo(() => {
    const list = CHALLENGES[activeTab];
    if (activeTab !== 'active' || activeCategory === 0) return list;
    const cat = CATEGORIES[activeCategory];
    return list.filter(c => c.category === cat);
  }, [activeTab, activeCategory]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Orbs */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={[styles.orb1, { opacity: 0.06 }]} />
        <View style={[styles.orb2, { opacity: 0.04 }]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <LinearGradient
            colors={['#A855F7', '#22D3EE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerAvatar}
          >
            <Text style={styles.headerAvatarText}>AR</Text>
          </LinearGradient>
          <Text style={styles.headerBrand}>
            Hire<Text style={styles.headerBrandAccent}>lith</Text>
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable
            style={styles.headerSettingsBtn}
            android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)', borderless: true } : undefined}
            onPress={() => navigation.navigate('Notifications')}
          >
            <MaterialIcons name="notifications-none" size={18} color="rgba(148,163,184,0.7)" />
            <View style={styles.notifDot} />
          </Pressable>
          <Pressable
            style={styles.headerSettingsBtn}
            android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)', borderless: true } : undefined}
            hitSlop={6}
          >
            <MaterialIcons name="settings" size={18} color="rgba(148,163,184,0.7)" />
          </Pressable>
        </View>
      </View>

      {/* Scrollable content */}
      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Tab switcher */}
        <View style={styles.tabSwitcherWrap}>
          {/* Sliding indicator */}
          <Animated.View
            style={[
              styles.tabSlider,
              { width: TAB_WIDTH, transform: [{ translateX: tabSliderX }] },
            ]}
          />
          {TABS.map((tab, i) => (
            <Pressable
              key={tab.key}
              style={styles.tabBtn}
              onPress={() => switchTab(tab.key, i)}
              android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)' } : undefined}
            >
              <Text style={[styles.tabBtnText, activeTab === tab.key && styles.tabBtnTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Daily Challenge (only on Active tab) */}
        {activeTab === 'active' && (
          <View style={styles.dailyCard}>
            <View style={styles.dailyGlow} pointerEvents="none" />
            <Text style={styles.dailyMissionLabel}>Daily Mission</Text>
            <Text>
              <Text style={styles.dailyTitlePurple}>Master Microservices{'\n'}</Text>
              <Text style={styles.dailyTitleCyan}>Auth Flow</Text>
            </Text>
            <Text style={styles.dailyDesc}>
              Design a secure JWT-based authentication system for a distributed architecture. High complexity, high reward.
            </Text>
            <View style={styles.dailyMetaRow}>
              <View style={styles.dailyXpRow}>
                <MaterialIcons name="bolt" size={16} color="#22D3EE" />
                <Text style={styles.dailyXpText}>850 XP</Text>
              </View>
              <View style={styles.dailyTimerRow}>
                <MaterialIcons name="schedule" size={14} color="rgba(148,163,184,0.6)" />
                <Text style={styles.dailyTimerText}>4h left</Text>
              </View>
            </View>
            <Pressable
              style={styles.startNowBtn}
              onPress={handleStartNow}
              android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.15)' } : undefined}
            >
              <LinearGradient
                colors={startDone ? ['#22C55E', '#16A34A'] : ['#A855F7', '#22D3EE']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startNowBtnInner}
              >
                {startLoading ? (
                  <>
                    <Spinner />
                    <Text style={styles.startNowBtnText}>Loading Challenge...</Text>
                  </>
                ) : startDone ? (
                  <>
                    <MaterialIcons name="check-circle" size={18} color="white" />
                    <Text style={styles.startNowBtnText}>Challenge Started!</Text>
                  </>
                ) : (
                  <Text style={styles.startNowBtnText}>Start Now</Text>
                )}
              </LinearGradient>
            </Pressable>
          </View>
        )}

        {/* Category filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {CATEGORIES.map((cat, i) => (
            <Pressable
              key={cat}
              style={[styles.categoryChip, activeCategory === i && styles.categoryChipActive]}
              onPress={() => setActiveCategory(i)}
              android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)' } : undefined}
            >
              <Text style={[styles.categoryChipText, activeCategory === i && styles.categoryChipTextActive]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Challenge list */}
        {challenges.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <MaterialIcons name="inbox" size={28} color="rgba(100,116,139,0.5)" />
            </View>
            <Text style={styles.emptyTitle}>Nothing here</Text>
            <Text style={styles.emptyText}>No challenges in this category yet.</Text>
          </View>
        ) : (
          challenges.map(ch =>
            ch.status === 'COMPLETED'
              ? <CompletedCard key={ch.id} challenge={ch} />
              : <ChallengeCard key={ch.id} challenge={ch} />
          )
        )}
      </Animated.ScrollView>

      {/* AI Career Copilot bar */}
      <Pressable
        style={styles.copilotBar}
        onPress={() => Alert.alert('AI Career Copilot', 'Ask me anything about your career roadmap, salary benchmarks, or how to approach your next challenge.\n\nFull AI chat coming soon!')}
        android_ripple={Platform.OS === 'android' ? { color: 'rgba(168,85,247,0.1)' } : undefined}
      >
        <LinearGradient
          colors={['#7C3AED', '#4F46E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.copilotIconWrap]}
        >
          <MaterialIcons name="chat-bubble" size={18} color="white" />
        </LinearGradient>
        <View style={styles.copilotTextWrap}>
          <Text style={styles.copilotLabel}>Ask AI Career Copilot</Text>
          <Text style={styles.copilotSub} numberOfLines={1}>Ask about career roadmaps...</Text>
        </View>
        <MaterialIcons name="north-east" size={18} color="rgba(100,116,139,0.6)" />
      </Pressable>

      <BottomNavBar activeTab="activity" activeColor="#22D3EE" activeBg="rgba(34,211,238,0.12)" />
    </View>
  );
}
