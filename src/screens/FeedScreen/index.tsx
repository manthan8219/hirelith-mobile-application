import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import { styles } from './FeedScreen.styles';
import { BottomNavBar } from '../../components/BottomNavBar';
import { useGithubTrending } from '../../hooks/useGithubTrending';
import type { GithubTrendingRepoDto } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useStarredRepos } from '../../hooks/useStarredRepos';

// ── Types ─────────────────────────────────────────────────────────────────────
type Article = {
  id: string;
  hasHero: boolean;
  heroColors: readonly [string, string, string];
  heroIconName: React.ComponentProps<typeof MaterialIcons>['name'];
  tags: { label: string; color: string; bg: string; border: string }[];
  title: string;
  excerpt: string;
  fullText: string;
  impactText: string;
  impactColor: string;
  impactBg: string;
  impactBorder: string;
  time: string;
  readTime: string;
  personalized: boolean;
};

type Since = 'daily' | 'weekly' | 'monthly' | 'starred';

// ── Data ─────────────────────────────────────────────────────────────────────
const ARTICLES: Article[] = [
  {
    id: '1',
    hasHero: true,
    heroColors: ['#4F46E5', '#7C3AED', '#0B0F1A'],
    heroIconName: 'auto-awesome',
    tags: [
      { label: 'AI', color: '#A5B4FC', bg: 'rgba(99,102,241,0.2)', border: 'rgba(99,102,241,0.35)' },
      { label: 'Frontend', color: '#22D3EE', bg: 'rgba(34,211,238,0.15)', border: 'rgba(34,211,238,0.3)' },
    ],
    title: 'Vercel Introduces AI-driven Component Streaming',
    excerpt: 'A new paradigm in web development allows LLMs to generate and stream UI components in real-time based on user intent, reducing bundle size by 60%.',
    fullText: `A new paradigm in web development allows LLMs to generate and stream UI components in real-time based on user intent, reducing bundle size by 60% and enabling hyper-personalized interfaces. Early adopters include major SaaS companies like Figma and Linear.\n\nThe technology uses a new protocol called Component Streaming Protocol (CSP) that enables real-time UI generation at the edge. Teams at Vercel report 3× faster time-to-interactive for AI-powered dashboards.\n\nFor developers, the shift means understanding how LLM output maps to React component trees — a skill that's now listed in 28% of new senior frontend job descriptions.`,
    impactText: `This technology prioritizes "Prompt Engineering for UI" over manual CSS. Learning this now positions you as a Lead Engineer for next-gen SaaS.`,
    impactColor: '#E7C365',
    impactBg: 'rgba(231,195,101,0.08)',
    impactBorder: 'rgba(231,195,101,0.2)',
    time: '2h ago',
    readTime: '4 min read',
    personalized: true,
  },
  {
    id: '2',
    hasHero: false,
    heroColors: ['#0E7490', '#06B6D4', '#0B0F1A'],
    heroIconName: 'trending-up',
    tags: [
      { label: 'Market Analysis', color: '#E7C365', bg: 'rgba(231,195,101,0.12)', border: 'rgba(231,195,101,0.25)' },
    ],
    title: 'Global Developer Shortage Shifts to AI Specialists',
    excerpt: 'Recent data shows a 150% increase in job postings requiring LLM integration skills, while traditional full-stack roles are seeing a cooling period.',
    fullText: `Recent data from LinkedIn and Glassdoor shows a 150% increase in job postings requiring LLM integration skills over the past 12 months, while traditional full-stack roles are seeing a 22% cooling period.\n\nThe most in-demand specializations are: LLM fine-tuning engineers ($220K avg), AI infra architects ($240K avg), and ML product designers ($185K avg). Companies like Anthropic, OpenAI, and Cohere are competing aggressively for this talent.\n\nAnalysts predict the gap will persist for at least 3 years, making this the best window for upskilling.`,
    impactText: `Your current React expertise is a great foundation. Adding Pinecone or LangChain knowledge will increase your market value by approx. $35k/year.`,
    impactColor: '#22D3EE',
    impactBg: 'rgba(34,211,238,0.08)',
    impactBorder: 'rgba(34,211,238,0.2)',
    time: '5h ago',
    readTime: '3 min read',
    personalized: false,
  },
  {
    id: '3',
    hasHero: true,
    heroColors: ['#0F766E', '#14B8A6', '#0B0F1A'],
    heroIconName: 'psychology',
    tags: [
      { label: 'Research', color: '#34D399', bg: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.3)' },
      { label: 'LLMs', color: '#A5B4FC', bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.3)' },
    ],
    title: 'OpenAI Launches GPT-5 with Multimodal Reasoning',
    excerpt: 'GPT-5 demonstrates PhD-level reasoning across math, code, and visual tasks — the biggest capability leap since GPT-4, with a 70% reduction in hallucinations.',
    fullText: `OpenAI has officially launched GPT-5, showcasing PhD-level reasoning across mathematics, code generation, and complex visual tasks. Independent benchmarks place it ahead of all existing models on MMLU, HumanEval, and MathBench.\n\nKey capabilities include: real-time multimodal reasoning, self-verification loops that reduce hallucinations by 70%, and a 200K context window that can process entire codebases in a single prompt.\n\nFor developers, the most significant change is the model's ability to autonomously plan and execute multi-step engineering tasks — raising the bar for what "AI engineer assist" means in practice.`,
    impactText: `Companies are rapidly re-evaluating their AI tooling stack. Familiarity with GPT-5's API and prompt patterns will be a core differentiator for engineers in Q1 2025.`,
    impactColor: '#34D399',
    impactBg: 'rgba(52,211,153,0.08)',
    impactBorder: 'rgba(52,211,153,0.2)',
    time: '1d ago',
    readTime: '5 min read',
    personalized: true,
  },
  {
    id: '4',
    hasHero: false,
    heroColors: ['#7C3AED', '#8B5CF6', '#0B0F1A'],
    heroIconName: 'work',
    tags: [
      { label: 'Career', color: '#F472B6', bg: 'rgba(244,114,182,0.12)', border: 'rgba(244,114,182,0.25)' },
    ],
    title: 'Remote AI Roles Now Outnumber In-Office Positions 3:1',
    excerpt: 'The latest State of Remote Work report finds that AI and ML roles are uniquely resistant to return-to-office mandates, with median salaries 18% higher for distributed teams.',
    fullText: `The 2024 State of Remote Work report reveals that AI and ML positions are uniquely resistant to return-to-office mandates. 73% of AI roles advertised in Q3 are fully remote or hybrid, compared to 40% of traditional engineering roles.\n\nMedian salaries for fully remote AI positions are 18% higher than equivalent in-office roles — a premium attributed to the global talent pool and cost-of-living flexibility. Companies in NYC and SF are losing talent to remote-first startups at unprecedented rates.\n\nThe report also highlights that async communication tools, AI code assistants, and virtual collaboration hubs have matured enough to fully support deep-work engineering tasks remotely.`,
    impactText: `Your profile is well-aligned for remote-first companies. Highlighting async communication and autonomous work style in your applications can unlock 40+ additional companies in your target list.`,
    impactColor: '#F472B6',
    impactBg: 'rgba(244,114,182,0.08)',
    impactBorder: 'rgba(244,114,182,0.2)',
    time: '2d ago',
    readTime: '3 min read',
    personalized: true,
  },
];

const TRENDING_TOPICS = [
  { num: '01', label: 'LLM Optimization for Edge Devices', count: '4.2k' },
  { num: '02', label: 'The Rise of AI Product Designers', count: '3.8k' },
  { num: '03', label: 'Rust vs Python in AI Infra', count: '2.9k' },
  { num: '04', label: 'Vector DBs replacing SQL', count: '2.1k' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatNum(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

function formatDate(d: string): string {
  const date = new Date(d + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - date.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner() {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 700, useNativeDriver: true })
    ).start();
  }, []);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return <Animated.View style={[styles.spinnerRing, { transform: [{ rotate }] }]} />;
}

// ── Pulsing dot ───────────────────────────────────────────────────────────────
function PulseDot({ delay = 0 }: { delay?: number }) {
  const pulse = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(pulse, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.3, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[styles.loadingDot, { opacity: pulse }]} />;
}

// ── NewsCard ──────────────────────────────────────────────────────────────────
function NewsCard({ article, isExpanded, onToggle }: {
  article: Article;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const expandAnim = useRef(new Animated.Value(0)).current;
  const [bookmarked, setBookmarked] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    Animated.timing(expandAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 320,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const expandedOpacity = expandAnim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 0, 1] });
  const expandedMaxHeight = expandAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 600] });

  function handleAction(id: string) {
    if (actionLoading) return;
    setActionLoading(id);
    setTimeout(() => setActionLoading(null), 1800);
  }

  const ACTIONS = [
    { id: 'explain', label: 'Explain Simply', icon: 'auto-fix-high' as const, primary: true },
    { id: 'dive',    label: 'Deep Dive',      icon: 'search' as const,        primary: false },
    { id: 'task',    label: 'Add to Tasks',   icon: 'checklist' as const,     primary: false },
  ];

  return (
    <View style={[styles.cardWrap, isExpanded && styles.cardWrapExpanded]}>
      {article.hasHero && (
        <Pressable onPress={onToggle} style={styles.cardHero}>
          <LinearGradient
            colors={article.heroColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardHeroGrad}
          >
            <MaterialIcons name={article.heroIconName} size={72} color="white" style={styles.cardHeroIcon} />
          </LinearGradient>
          <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(11,15,26,0.9)']} style={styles.cardHeroOverlay} />
          <View style={styles.cardHeroTags}>
            {article.tags.map(tag => (
              <View key={tag.label} style={[styles.heroTag, { backgroundColor: tag.bg, borderColor: tag.border }]}>
                <Text style={[styles.heroTagText, { color: tag.color }]}>{tag.label}</Text>
              </View>
            ))}
          </View>
        </Pressable>
      )}

      <Pressable
        style={styles.cardBody}
        onPress={onToggle}
        android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.03)' } : undefined}
      >
        {!article.hasHero && article.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {article.tags.map(tag => (
              <View key={tag.label} style={[styles.inlineTag, { backgroundColor: tag.bg, borderColor: tag.border }]}>
                <Text style={[styles.inlineTagText, { color: tag.color }]}>{tag.label}</Text>
              </View>
            ))}
          </View>
        )}
        <Text style={[styles.cardTitle, isExpanded && styles.cardTitleExpanded]}>{article.title}</Text>
        <Text style={styles.cardExcerpt} numberOfLines={isExpanded ? undefined : 2}>{article.excerpt}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardMetaText}>{article.time}</Text>
          <View style={styles.cardMetaDot} />
          <Text style={styles.cardMetaText}>{article.readTime}</Text>
        </View>
        {!isExpanded && (
          <View style={styles.cardExpandHint}>
            <MaterialIcons name="expand-more" size={14} color="rgba(99,102,241,0.7)" />
            <Text style={styles.cardExpandHintText}>Tap to read full story</Text>
          </View>
        )}
      </Pressable>

      <Animated.View style={[styles.expandedSection, { maxHeight: expandedMaxHeight, opacity: expandedOpacity }]}>
        <View style={styles.expandedInner}>
          <View style={styles.fullTextBox}>
            <Text style={styles.fullText}>{article.fullText}</Text>
          </View>
          <View style={[styles.impactPanel, { backgroundColor: article.impactBg, borderColor: article.impactBorder }]}>
            <View style={styles.impactHeader}>
              <MaterialIcons name="trending-up" size={14} color={article.impactColor} />
              <Text style={[styles.impactLabel, { color: article.impactColor }]}>Impact on Your Career</Text>
            </View>
            <Text style={styles.impactText}>{article.impactText}</Text>
          </View>
          <View style={styles.actionsRow}>
            {ACTIONS.map(action => (
              <Pressable
                key={action.id}
                style={[styles.actionBtn, action.primary && styles.actionBtnPrimary, actionLoading === action.id && styles.actionBtnLoading]}
                onPress={() => handleAction(action.id)}
                android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)' } : undefined}
              >
                {actionLoading === action.id ? (
                  <Spinner />
                ) : (
                  <MaterialIcons name={action.icon} size={14} color={action.primary ? '#A5B4FC' : 'rgba(226,232,240,0.7)'} />
                )}
                <Text style={[styles.actionBtnText, action.primary && styles.actionBtnTextPrimary]}>
                  {actionLoading === action.id ? '...' : action.label}
                </Text>
              </Pressable>
            ))}
            <Pressable
              style={[styles.bookmarkBtn, bookmarked && { backgroundColor: 'rgba(231,195,101,0.12)', borderColor: 'rgba(231,195,101,0.3)' }]}
              onPress={() => setBookmarked(v => !v)}
              hitSlop={8}
            >
              <MaterialIcons name={bookmarked ? 'bookmark' : 'bookmark-border'} size={18} color={bookmarked ? '#E7C365' : 'rgba(100,116,139,0.7)'} />
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

// ── RepoDetailModal ──────────────────────────────────────────────────────────
function RepoDetailModal({ repo, visible, onClose }: {
  repo: GithubTrendingRepoDto;
  visible: boolean;
  onClose: () => void;
}) {
  const slideAnim = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(600); // always start from off-screen
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 100, friction: 14 }).start();
    } else {
      Animated.timing(slideAnim, { toValue: 600, duration: 220, useNativeDriver: true }).start();
    }
  }, [visible]);

  const isHot = repo.starsToday >= 100;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={modalStyles.backdrop}>
          <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
        </View>
      </TouchableWithoutFeedback>

      <Animated.View style={[modalStyles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        {/* Handle */}
        <View style={modalStyles.handle} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={modalStyles.scroll}>
          {/* Header */}
          <View style={modalStyles.header}>
            <View style={modalStyles.headerLeft}>
              <View style={modalStyles.iconWrap}>
                <MaterialIcons name="code" size={24} color="#22D3EE" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={modalStyles.owner}>{repo.owner}</Text>
                <Text style={modalStyles.repoName}>{repo.name}</Text>
              </View>
            </View>
            <Pressable style={modalStyles.closeBtn} onPress={onClose} hitSlop={10}>
              <MaterialIcons name="close" size={20} color="rgba(148,163,184,0.7)" />
            </Pressable>
          </View>

          {/* Badges */}
          <View style={modalStyles.badgeRow}>
            {isHot && (
              <View style={[modalStyles.badge, { borderColor: 'rgba(251,191,36,0.4)', backgroundColor: 'rgba(251,191,36,0.1)' }]}>
                <Text style={[modalStyles.badgeText, { color: '#FBBF24' }]}>🔥 {formatNum(repo.starsToday)} stars today</Text>
              </View>
            )}
            {repo.language ? (
              <View style={modalStyles.badge}>
                <View style={[modalStyles.langDot, { backgroundColor: repo.languageColor ?? '#64748B' }]} />
                <Text style={modalStyles.badgeText}>{repo.language}</Text>
              </View>
            ) : null}
          </View>

          {/* Stats row */}
          <View style={modalStyles.statsRow}>
            <View style={modalStyles.statBox}>
              <MaterialIcons name="star" size={18} color="#E7C365" />
              <Text style={modalStyles.statValue}>{formatNum(repo.totalStars)}</Text>
              <Text style={modalStyles.statLabel}>Stars</Text>
            </View>
            <View style={modalStyles.statDivider} />
            <View style={modalStyles.statBox}>
              <MaterialIcons name="call-split" size={18} color="#22D3EE" />
              <Text style={modalStyles.statValue}>{formatNum(repo.totalForks)}</Text>
              <Text style={modalStyles.statLabel}>Forks</Text>
            </View>
            <View style={modalStyles.statDivider} />
            <View style={modalStyles.statBox}>
              <MaterialIcons name="trending-up" size={18} color="#34D399" />
              <Text style={[modalStyles.statValue, { color: '#34D399' }]}>+{formatNum(repo.starsToday)}</Text>
              <Text style={modalStyles.statLabel}>Today</Text>
            </View>
          </View>

          {/* Description */}
          {repo.description ? (
            <View style={modalStyles.section}>
              <Text style={modalStyles.sectionTitle}>About</Text>
              <Text style={modalStyles.description}>{repo.description}</Text>
            </View>
          ) : null}

          {/* Contributors */}
          {repo.contributors.length > 0 && (
            <View style={modalStyles.section}>
              <Text style={modalStyles.sectionTitle}>Contributors</Text>
              <View style={modalStyles.contributorRow}>
                {repo.contributors.map((c) => (
                  <View key={c} style={modalStyles.contributorChip}>
                    <MaterialIcons name="person-outline" size={12} color="#A78BFA" />
                    <Text style={modalStyles.contributorName}>{c}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Scraped date */}
          <View style={modalStyles.section}>
            <Text style={modalStyles.sectionTitle}>Trending on</Text>
            <Text style={modalStyles.metaText}>{formatDate(repo.scrapedDate)} · {repo.since}</Text>
          </View>
        </ScrollView>

        {/* Go to GitHub CTA */}
        <View style={modalStyles.footer}>
          <Pressable
            style={modalStyles.githubBtn}
            onPress={() => { Linking.openURL(repo.url).catch(() => {}); onClose(); }}
            android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.08)' } : undefined}
          >
            <MaterialIcons name="open-in-new" size={18} color="#0B0F1A" />
            <Text style={modalStyles.githubBtnText}>Open on GitHub</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
}

// ── LiveRepoCard ──────────────────────────────────────────────────────────────
function LiveRepoCard({ repo, starredIds, onToggleStar, onShowToast }: {
  repo: GithubTrendingRepoDto;
  starredIds?: Set<string>;
  onToggleStar?: (repo: GithubTrendingRepoDto) => void;
  onShowToast?: (msg: string) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  // Local star state flips immediately — not waiting on parent Set propagation
  const [isStarred, setIsStarred] = useState(() => starredIds?.has(repo.fullName) ?? false);
  const isHot = repo.starsToday >= 100;

  // Sync when external starredIds loads from server on mount
  useEffect(() => {
    setIsStarred(starredIds?.has(repo.fullName) ?? false);
  }, [starredIds, repo.fullName]);

  function handleStarPress() {
    const next = !isStarred;
    setIsStarred(next);
    onToggleStar?.(repo);
    if (next) onShowToast?.(`Starred ${repo.name}`);
  }

  return (
    <>
      <Pressable
        style={styles.repoCard}
        onPress={() => setModalOpen(true)}
        android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.03)' } : undefined}
      >
        {/* Top row */}
        <View style={styles.repoTopRow}>
          <View style={styles.repoIconWrap}>
            <MaterialIcons name="code" size={22} color="#22D3EE" />
          </View>
          <View style={styles.repoMeta}>
            <Text style={styles.repoOwner}>{repo.owner}</Text>
            <Text style={styles.repoName}>{repo.name}</Text>
          </View>
          {isHot ? (
            <View style={styles.trendBadge}>
              <Text style={styles.trendBadgeText}>🔥 {formatNum(repo.starsToday)}</Text>
            </View>
          ) : null}
          {/* Star button — uses onStartShouldSetResponder to block outer card press */}
          <View
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => { e.stopPropagation(); handleStarPress(); }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{ padding: 6 }}
          >
            <MaterialIcons
              name={isStarred ? 'star' : 'star-border'}
              size={20}
              color={isStarred ? '#FBBF24' : 'rgba(100,116,139,0.4)'}
            />
          </View>
        </View>

        {/* Language + stats */}
        <View style={styles.repoStatsRow}>
          {repo.language ? (
            <View style={styles.repoLangDot}>
              <View style={[styles.langDot, { backgroundColor: repo.languageColor ?? '#64748B' }]} />
              <Text style={styles.repoLangText}>{repo.language}</Text>
            </View>
          ) : null}
          <View style={styles.repoStatItem}>
            <MaterialIcons name="star-border" size={14} color="rgba(100,116,139,0.7)" />
            <Text style={styles.repoStatText}>{formatNum(repo.totalStars)}</Text>
          </View>
          <View style={styles.repoStatItem}>
            <MaterialIcons name="call-split" size={14} color="rgba(100,116,139,0.7)" />
            <Text style={styles.repoStatText}>{formatNum(repo.totalForks)}</Text>
          </View>
          <View style={{ flex: 1 }} />
        </View>

        {/* Description preview */}
        {repo.description ? (
          <Text style={styles.repoDesc} numberOfLines={2}>{repo.description}</Text>
        ) : null}
      </Pressable>

      <RepoDetailModal repo={repo} visible={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

// ── RepoSkeleton ──────────────────────────────────────────────────────────────
function RepoSkeleton() {
  const pulse = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.8, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={[styles.repoCard, { opacity: pulse }]}>
      <View style={styles.repoTopRow}>
        <View style={[styles.repoIconWrap, { backgroundColor: 'rgba(255,255,255,0.05)' }]} />
        <View style={{ flex: 1, gap: 6 }}>
          <View style={{ height: 10, width: '40%', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.06)' }} />
          <View style={{ height: 13, width: '60%', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.06)' }} />
        </View>
      </View>
      <View style={{ height: 10, width: '80%', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.05)', marginTop: 12 }} />
      <View style={{ height: 10, width: '60%', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.04)', marginTop: 6 }} />
    </Animated.View>
  );
}

// ── FeedScreen ────────────────────────────────────────────────────────────────
export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<'news' | 'github'>('news');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'latest' | 'personalized'>('latest');
  const [since, setSince] = useState<Since>('daily');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    toastAnim.setValue(0);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.delay(1600),
      Animated.timing(toastAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => setToastMsg(null));
  }, [toastAnim]);

  const { firebaseUser } = useAuth();
  const { starredIds, repos: starredRepos, loading: starredLoading, toggleStar, loadStarredRepos } = useStarredRepos(firebaseUser?.uid);

  const trendingSince = (since === 'starred' ? 'daily' : since) as 'daily' | 'weekly' | 'monthly';
  const { repos, meta, loading, loadingMore, error, availableDates, activeDate, refresh, loadMore, selectDate } = useGithubTrending(trendingSince);

  const tabAnim = useRef(new Animated.Value(0)).current;

  const filteredArticles = useMemo(
    () => activeFilter === 'personalized' ? ARTICLES.filter(a => a.personalized) : ARTICLES,
    [activeFilter],
  );

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 120, friction: 12 }),
    ]).start();
  }, []);

  function switchTab(tab: 'news' | 'github') {
    setActiveTab(tab);
    Animated.spring(tabAnim, {
      toValue: tab === 'news' ? 0 : 1,
      useNativeDriver: false,
      tension: 160,
      friction: 16,
    }).start();
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Orbs */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={[styles.orb1, { opacity: 0.05 }]} />
        <View style={[styles.orb2, { opacity: 0.04 }]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerBrand}>
          Hire<Text style={styles.headerBrandAccent}>lith</Text>
        </Text>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.headerBtn}
            onPress={() => navigation.navigate('Notifications')}
            android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)', borderless: true } : undefined}
          >
            <MaterialIcons name="notifications-none" size={20} color="rgba(148,163,184,0.7)" />
            <View style={styles.notifDot} />
          </Pressable>
          <Pressable
            style={styles.headerBtn}
            onPress={() => Alert.alert('AI News Digest', 'Get a personalized summary of the top career and industry news.\n\nFull AI digest coming soon!')}
            android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)', borderless: true } : undefined}
          >
            <MaterialIcons name="smart-toy" size={18} color="#818CF8" />
          </Pressable>
        </View>
      </View>

      {/* Sub-tab bar */}
      <View style={styles.subTabBar}>
        <Pressable
          style={[styles.subTabItem, activeTab === 'news' && styles.subTabItemActive]}
          onPress={() => switchTab('news')}
        >
          <MaterialIcons name="newspaper" size={14} color={activeTab === 'news' ? '#22D3EE' : 'rgba(100,116,139,0.6)'} style={{ marginRight: 5 }} />
          <Text style={[styles.subTabText, activeTab === 'news' && styles.subTabTextActive]}>
            Industry News
          </Text>
        </Pressable>
        <Pressable
          style={[styles.subTabItem, activeTab === 'github' && styles.subTabItemActiveGithub]}
          onPress={() => switchTab('github')}
        >
          <MaterialIcons name="code" size={14} color={activeTab === 'github' ? '#A78BFA' : 'rgba(100,116,139,0.6)'} style={{ marginRight: 5 }} />
          <Text style={[styles.subTabText, activeTab === 'github' && styles.subTabTextActiveGithub]}>
            Trending GitHub
          </Text>
        </Pressable>
      </View>

      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        key={activeTab}
      >
        {activeTab === 'news' ? (
          <>
            {/* Trending topics strip */}
            <View style={styles.trendingSection}>
              <Text style={styles.trendingLabel}>Trending in AI</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingScroll}>
                {TRENDING_TOPICS.map(t => (
                  <Pressable
                    key={t.num}
                    style={styles.trendingChip}
                    onPress={() => Alert.alert(`#${t.num} Trending`, `"${t.label}"\n\n${t.count} readers this week.`)}
                  >
                    <Text style={styles.trendingChipNum}>{t.num}</Text>
                    <Text style={styles.trendingChipText} numberOfLines={1}>{t.label}</Text>
                    <Text style={[styles.cardMetaText, { marginLeft: 4 }]}>{t.count}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Career Insight banner */}
            <View style={styles.insightBanner}>
              <View style={styles.insightBannerGlow} pointerEvents="none" />
              <View style={styles.insightIconWrap}>
                <MaterialIcons name="auto-awesome" size={18} color="#22D3EE" />
              </View>
              <View style={styles.insightBannerContent}>
                <Text style={styles.insightBannerLabel}>Career Insight</Text>
                <Text style={styles.insightBannerText}>
                  <Text style={styles.insightBannerBold}>"Generative UI" skills </Text>
                  are increasing in demand by 40% in your target companies.
                </Text>
              </View>
            </View>

            {/* Feed heading + filter */}
            <View style={[styles.sectionHeaderRow, styles.feedHeading]}>
              <Text style={styles.sectionTitle}>News Feed</Text>
              <View style={styles.filterRow}>
                {(['latest', 'personalized'] as const).map(f => (
                  <Pressable
                    key={f}
                    style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
                    onPress={() => setActiveFilter(f)}
                  >
                    <Text style={[styles.filterTabText, activeFilter === f && styles.filterTabTextActive]}>
                      {f === 'latest' ? 'Latest' : 'For You'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {filteredArticles.map(article => (
              <NewsCard
                key={article.id}
                article={article}
                isExpanded={expandedId === article.id}
                onToggle={() => setExpandedId(prev => prev === article.id ? null : article.id)}
              />
            ))}
          </>
        ) : (
          <>
            {/* GitHub tab header */}
            <View style={styles.githubHeader}>
              <Text style={styles.githubHeaderTitle}>Trending Repositories</Text>
              <Text style={styles.githubHeaderSub}>
                What the dev world is building — mapped to your career path.
              </Text>
            </View>

            {/* Since filter */}
            <View style={inlineStyles.sinceRow}>
              {(['daily', 'weekly', 'monthly', 'starred'] as const).map(s => (
                <Pressable
                  key={s}
                  style={[inlineStyles.sinceTab, since === s && inlineStyles.sinceTabActive, s === 'starred' && inlineStyles.sinceTabStarred, since === 'starred' && s === 'starred' && inlineStyles.sinceTabStarredActive]}
                  onPress={() => {
                    setSince(s);
                    if (s === 'starred') loadStarredRepos();
                  }}
                >
                  {s === 'starred'
                    ? <MaterialIcons name="star" size={14} color={since === 'starred' ? '#FBBF24' : 'rgba(100,116,139,0.7)'} />
                    : <Text style={[inlineStyles.sinceTabText, since === s && inlineStyles.sinceTabTextActive]}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </Text>
                  }
                </Pressable>
              ))}
            </View>

            {/* Repo list */}
            {since === 'starred' ? (
              starredLoading ? (
                <><RepoSkeleton /><RepoSkeleton /></>
              ) : starredRepos.length === 0 ? (
                <View style={inlineStyles.errorBox}>
                  <MaterialIcons name="star-border" size={32} color="rgba(100,116,139,0.5)" />
                  <Text style={inlineStyles.errorText}>No starred repos yet. Tap ★ on any repo to save it.</Text>
                </View>
              ) : (
                starredRepos.map(repo => <LiveRepoCard key={repo.id} repo={repo} starredIds={starredIds} onToggleStar={toggleStar} onShowToast={showToast} />)
              )
            ) : (
              loading ? (
                <>
                  <RepoSkeleton />
                  <RepoSkeleton />
                  <RepoSkeleton />
                </>
              ) : error ? (
                <View style={inlineStyles.errorBox}>
                  <MaterialIcons name="cloud-off" size={32} color="rgba(248,113,113,0.6)" />
                  <Text style={inlineStyles.errorText}>Could not load repositories</Text>
                  <Pressable style={inlineStyles.retryBtn} onPress={refresh}>
                    <Text style={inlineStyles.retryText}>Retry</Text>
                  </Pressable>
                </View>
              ) : repos.length === 0 ? (
                <View style={inlineStyles.errorBox}>
                  <MaterialIcons name="inbox" size={32} color="rgba(100,116,139,0.5)" />
                  <Text style={inlineStyles.errorText}>No repos yet — check back after the next scrape.</Text>
                </View>
              ) : (
                repos.map(repo => <LiveRepoCard key={repo.id} repo={repo} starredIds={starredIds} onToggleStar={toggleStar} onShowToast={showToast} />)
              )
            )}

            {/* Load more */}
            {since !== 'starred' && !loading && !error && meta?.hasNextPage && (
              <Pressable style={inlineStyles.loadMoreBtn} onPress={loadMore} disabled={loadingMore}>
                {loadingMore
                  ? <ActivityIndicator size="small" color="#A78BFA" />
                  : <Text style={inlineStyles.loadMoreText}>Load more</Text>}
              </Pressable>
            )}

            {/* End of list — date picker */}
            {since !== 'starred' && !loading && !error && repos.length > 0 && !meta?.hasNextPage && (
              <View style={inlineStyles.endCard}>
                <View style={inlineStyles.endCardTop}>
                  <MaterialIcons name="check-circle-outline" size={18} color="rgba(167,139,250,0.7)" />
                  <Text style={inlineStyles.endCardTitle}>You've seen all repos for this day</Text>
                </View>
                {availableDates.length > 1 && (
                  <>
                    <Text style={inlineStyles.endCardSub}>Browse another date:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
                      {availableDates.map(d => (
                        <Pressable
                          key={d}
                          style={[inlineStyles.dateChip, activeDate === d && inlineStyles.dateChipActive]}
                          onPress={() => selectDate(d)}
                        >
                          <Text style={[inlineStyles.dateChipText, activeDate === d && inlineStyles.dateChipTextActive]}>
                            {formatDate(d)}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </>
                )}
              </View>
            )}
          </>
        )}

        {/* Footer — only show while loading */}
        {(loading || loadingMore) && activeTab === 'news' && (
          <View style={styles.loadingFooter}>
            <View style={styles.loadingDots}>
              <PulseDot delay={0} />
              <PulseDot delay={200} />
              <PulseDot delay={400} />
            </View>
            <Text style={styles.loadingText}>AI is curating more updates...</Text>
          </View>
        )}
      </Animated.ScrollView>

      <BottomNavBar activeTab="feed" activeColor="#22D3EE" activeBg="rgba(34,211,238,0.12)" />

      {/* Toast */}
      {toastMsg ? (
        <Animated.View
          pointerEvents="none"
          style={[
            inlineStyles.toast,
            {
              opacity: toastAnim,
              transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
            },
          ]}
        >
          <MaterialIcons name="star" size={15} color="#FBBF24" />
          <Text style={inlineStyles.toastText}>{toastMsg}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

// ── Inline styles for new elements ────────────────────────────────────────────
const inlineStyles = StyleSheet.create({
  sinceRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    paddingHorizontal: 2,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  sinceTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(100,116,139,0.2)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  sinceTabActive: {
    borderColor: 'rgba(167,139,250,0.5)',
    backgroundColor: 'rgba(167,139,250,0.1)',
  },
  sinceTabText: {
    fontSize: 12,
    color: 'rgba(148,163,184,0.7)',
    fontWeight: '500',
  },
  sinceTabTextActive: {
    color: '#A78BFA',
  },
  sinceTabStarred: {
    paddingHorizontal: 10,
  },
  sinceTabStarredActive: {
    borderColor: 'rgba(251,191,36,0.5)',
    backgroundColor: 'rgba(251,191,36,0.08)',
  },
  errorBox: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 40,
  },
  errorText: {
    color: 'rgba(148,163,184,0.6)',
    fontSize: 13,
    textAlign: 'center',
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.3)',
    backgroundColor: 'rgba(248,113,113,0.08)',
  },
  retryText: {
    color: '#F87171',
    fontSize: 13,
    fontWeight: '600',
  },
  loadMoreBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.2)',
    backgroundColor: 'rgba(167,139,250,0.05)',
  },
  loadMoreText: {
    color: '#A78BFA',
    fontSize: 14,
    fontWeight: '600',
  },
  endCard: {
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.15)',
    backgroundColor: 'rgba(167,139,250,0.05)',
    gap: 10,
  },
  endCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  endCardTitle: {
    color: 'rgba(167,139,250,0.8)',
    fontSize: 13,
    fontWeight: '600',
  },
  endCardSub: {
    color: 'rgba(148,163,184,0.6)',
    fontSize: 12,
  },
  dateChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(100,116,139,0.25)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  dateChipActive: {
    borderColor: 'rgba(167,139,250,0.6)',
    backgroundColor: 'rgba(167,139,250,0.12)',
  },
  dateChipText: {
    fontSize: 12,
    color: 'rgba(148,163,184,0.7)',
    fontWeight: '500',
  },
  dateChipTextActive: {
    color: '#A78BFA',
    fontWeight: '700',
  },
  toast: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(17,24,39,0.96)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.35)',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  toastText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.92)',
  },
});

// ── Modal styles ──────────────────────────────────────────────────────────────
const modalStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0F1623',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    maxHeight: '88%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  scroll: {
    padding: 20,
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(34,211,238,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  owner: {
    fontSize: 12,
    color: 'rgba(148,163,184,0.6)',
    fontWeight: '500',
  },
  repoName: {
    fontSize: 18,
    color: '#E2E8F0',
    fontWeight: '700',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(100,116,139,0.25)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  badgeText: {
    fontSize: 12,
    color: 'rgba(226,232,240,0.7)',
    fontWeight: '500',
  },
  langDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  statValue: {
    fontSize: 16,
    color: '#E2E8F0',
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(100,116,139,0.7)',
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    color: 'rgba(100,116,139,0.6)',
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: 'rgba(226,232,240,0.8)',
    lineHeight: 22,
  },
  contributorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  contributorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.2)',
    backgroundColor: 'rgba(167,139,250,0.07)',
  },
  contributorName: {
    fontSize: 12,
    color: '#A78BFA',
    fontWeight: '500',
  },
  metaText: {
    fontSize: 13,
    color: 'rgba(148,163,184,0.6)',
    textTransform: 'capitalize',
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  githubBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 14,
  },
  githubBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B0F1A',
  },
});
