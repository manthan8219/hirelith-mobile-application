import React, { useRef, useEffect, useState } from 'react';
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
  Linking,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { ParsedResume } from '../../types/resume';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import Svg, {
  Circle,
  Polygon,
  Line,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles, STAT_BAR_WIDTH } from './ProfileScreen.styles';
import { BottomNavBar } from '../../components/BottomNavBar';

const { width } = Dimensions.get('window');

// ── Skill Radar data ─────────────────────────────────────────────────────────
const SKILLS = [
  { name: 'UI/UX',   value: 0.90, angle: 0   },
  { name: 'SYSTEMS', value: 0.75, angle: 72  },
  { name: 'AI/ML',   value: 0.80, angle: 144 },
  { name: 'PRODUCT', value: 0.85, angle: 216 },
  { name: 'DEV',     value: 0.70, angle: 288 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function polarPoint(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function pentagonPoints(cx: number, cy: number, r: number) {
  return SKILLS.map(s => {
    const p = polarPoint(cx, cy, r, s.angle);
    return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
  }).join(' ');
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

// ── Circular Score ────────────────────────────────────────────────────────────
function CircularScore({ score }: { score: number }) {
  const R = 70;
  const C = 2 * Math.PI * R;
  const [dashOffset, setDashOffset] = useState(C);
  const progressAnim = useRef(new Animated.Value(C)).current;

  useEffect(() => {
    const targetOffset = C * (1 - score / 100);
    const listenerId = progressAnim.addListener(({ value }) => setDashOffset(value));
    Animated.timing(progressAnim, {
      toValue: targetOffset,
      duration: 2200,
      useNativeDriver: false,
    }).start();
    return () => progressAnim.removeListener(listenerId);
  }, []);

  return (
    <View style={styles.scoreCircleWrap}>
      <Svg width={160} height={160} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Defs>
          <SvgGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#8B5CF6" />
            <Stop offset="100%" stopColor="#22D3EE" />
          </SvgGradient>
        </Defs>
        <Circle cx={80} cy={80} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
        <Circle
          cx={80}
          cy={80}
          r={R}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth={13}
          strokeDasharray={C}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.scoreCenter}>
        <Text style={styles.scoreNumber}>{score}</Text>
        <Text style={styles.scoreLabel}>OPTIMAL</Text>
      </View>
    </View>
  );
}

// ── Skill Radar ───────────────────────────────────────────────────────────────
function SkillRadar() {
  const SIZE = width - 80; // fits within card padding
  const MAX_SIZE = 240;
  const svgSize = Math.min(SIZE, MAX_SIZE);
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const maxR = svgSize / 2 - 28; // room for labels

  const skillPolygon = SKILLS.map(s => {
    const p = polarPoint(cx, cy, maxR * s.value, s.angle);
    return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
  }).join(' ');

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <View style={styles.radarWrap}>
      <Svg width={svgSize} height={svgSize}>
        {/* Grid rings */}
        {gridLevels.map((level, i) => (
          <Polygon
            key={`grid-${i}`}
            points={pentagonPoints(cx, cy, maxR * level)}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        {SKILLS.map((s, i) => {
          const p = polarPoint(cx, cy, maxR, s.angle);
          return (
            <Line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={1}
            />
          );
        })}

        {/* Skill fill polygon */}
        <Polygon
          points={skillPolygon}
          fill="rgba(99,102,241,0.18)"
          stroke="rgba(129,140,248,0.65)"
          strokeWidth={1.5}
        />

        {/* Skill dots */}
        {SKILLS.map((s, i) => {
          const p = polarPoint(cx, cy, maxR * s.value, s.angle);
          return (
            <Circle key={`dot-${i}`} cx={p.x} cy={p.y} r={3.5} fill="#818CF8" />
          );
        })}

        {/* Labels */}
        {SKILLS.map((s, i) => {
          const p = polarPoint(cx, cy, maxR + 18, s.angle);
          return (
            <SvgText
              key={`label-${i}`}
              x={p.x}
              y={p.y + 4}
              textAnchor="middle"
              fill="rgba(148,163,184,0.8)"
              fontSize={9}
              fontWeight="700"
            >
              {s.name}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

// ── Animated stat bar ─────────────────────────────────────────────────────────
function StatBar({
  label,
  displayValue,
  fraction,
  delay = 0,
}: {
  label: string;
  displayValue: string;
  fraction: number;
  delay?: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: fraction,
      duration: 1200,
      delay,
      useNativeDriver: false,
    }).start();
  }, []);

  const barW = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, STAT_BAR_WIDTH],
  });

  return (
    <View style={styles.statRow}>
      <View style={styles.statHeader}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{displayValue}</Text>
      </View>
      <View style={styles.statTrack}>
        <Animated.View style={[styles.statFillWrap, { width: barW }]}>
          <LinearGradient
            colors={['#6366F1', '#22D3EE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, borderRadius: 2 }}
          />
        </Animated.View>
      </View>
    </View>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getLatestTitle(experience: ParsedResume['experience']): string {
  if (!experience || experience.length === 0) return '';
  const current = experience.find(e => e.current);
  return (current ?? experience[0]).title ?? '';
}

interface ResumeProfileData {
  resumeUrl: string | null;
  parsedResume: ParsedResume | null;
  parseMeta: { parsedAt?: string } | null;
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { signOut, backendUser } = useAuth();

  const [resumeProfile, setResumeProfile] = useState<ResumeProfileData | null>(null);
  const [readinessScore, setReadinessScore] = useState<number | null>(null);

  useEffect(() => {
    if (!backendUser?.id) return;
    api.get<ResumeProfileData>(`/api/v1/resume/profile?userId=${backendUser.id}`)
      .then(setResumeProfile)
      .catch(() => { /* silent — fallback to displayName */ });
    api.get<{ readinessScore: number }>(`/api/v1/career-analysis/${backendUser.id}/latest`)
      .then(data => setReadinessScore(data.readinessScore))
      .catch(() => { /* no analysis yet — keep null */ });
  }, [backendUser?.id]);

  const parsed = resumeProfile?.parsedResume ?? null;
  const displayName = parsed?.contact?.fullName ?? backendUser?.displayName ?? '';
  const initials = getInitials(displayName);
  const latestTitle = getLatestTitle(parsed?.experience ?? []);
  const locationText =
    parsed?.contact?.location?.full ??
    [parsed?.contact?.location?.city, parsed?.contact?.location?.state]
      .filter(Boolean).join(', ') ?? '';

  function handleLogout() {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => signOut(),
      },
    ]);
  }

  const [reuploadLoading, setReuploadLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfDone, setPdfDone] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 120, friction: 12 }),
    ]).start();
  }, []);

  async function handleReupload() {
    if (reuploadLoading || !backendUser?.id) return;
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf',
             'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
             'text/plain'],
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    setReuploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri:  asset.uri,
        name: asset.name,
        type: asset.mimeType ?? 'application/pdf',
      } as unknown as Blob);
      formData.append('userId', backendUser.id);
      const data = await api.uploadFile<{ resumeUrl: string; parsedResume: ParsedResume }>(
        '/api/v1/resume/upload-and-parse',
        formData,
      );
      setResumeProfile({ resumeUrl: data.resumeUrl, parsedResume: data.parsedResume, parseMeta: { parsedAt: new Date().toISOString() } });
    } catch (err) {
      Alert.alert('Upload failed', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setReuploadLoading(false);
    }
  }

  async function handleDownloadPdf() {
    if (pdfLoading || !backendUser?.id) return;
    setPdfLoading(true);
    try {
      const { url } = await api.get<{ url: string }>(
        `/api/v1/resume/download?userId=${backendUser.id}`,
      );
      await Linking.openURL(url);
      setPdfDone(true);
      setTimeout(() => setPdfDone(false), 2200);
    } catch {
      Alert.alert('Error', 'Could not open PDF.');
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Orbs */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={[styles.orb1, { opacity: 0.06 }]} />
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
            android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)', borderless: true } : undefined}
            onPress={() => navigation.navigate('Notifications')}
          >
            <MaterialIcons name="notifications-none" size={20} color="rgba(148,163,184,0.7)" />
            <View style={styles.notifDot} />
          </Pressable>
          <Pressable
            style={styles.headerBtn}
            android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)', borderless: true } : undefined}
            onPress={() =>
              Alert.alert('Account', 'What would you like to do?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log Out', style: 'destructive', onPress: handleLogout },
              ])
            }
          >
            <MaterialIcons name="smart-toy" size={18} color="#818CF8" />
          </Pressable>
        </View>
      </View>

      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Identity + Score card ─────────────────────────────── */}
        <View style={styles.card}>
          {/* Avatar + name row */}
          <View style={styles.heroTop}>
            <LinearGradient
              colors={['#8B5CF6', '#6366F1', '#22D3EE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarRingWrap}
            >
              <View style={styles.avatarInner}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            </LinearGradient>

            <View style={styles.heroIdentity}>
              <Text style={styles.heroName}>{displayName || '—'}</Text>
              {!!latestTitle && (
                <Text style={styles.heroRole}>{latestTitle}</Text>
              )}
              <View style={styles.heroBadgesRow}>
                {!!locationText && (
                  <View style={styles.heroBadge}>
                    <MaterialIcons name="location-on" size={11} color="rgba(148,163,184,0.7)" />
                    <Text style={styles.heroBadgeText}>{locationText}</Text>
                  </View>
                )}
                <View style={[styles.heroBadge, { borderColor: 'rgba(34,211,238,0.3)', backgroundColor: 'rgba(34,211,238,0.08)' }]}>
                  <MaterialIcons name="verified" size={11} color="#22D3EE" />
                  <Text style={[styles.heroBadgeText, { color: '#22D3EE' }]}>AI Certified</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.heroDivider} />

          {/* Job readiness score */}
          <View style={styles.scoreSection}>
            <Text style={styles.scoreSectionLabel}>Job Readiness Score</Text>
            <CircularScore score={readinessScore ?? 0} />
            <Text style={styles.scoreSub}>
              {readinessScore !== null
                ? readinessScore >= 80
                  ? 'You are in the top 5% of candidates for your target roles.'
                  : readinessScore >= 60
                  ? 'Good progress — keep improving your resume to stand out.'
                  : 'Run a Career Audit to get your detailed readiness analysis.'
                : 'Run a Career Audit to generate your readiness score.'}
            </Text>
          </View>
        </View>

        {/* ── Skill Radar ───────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <Text style={styles.cardTitle}>Skill Radar</Text>
            <MaterialIcons name="insights" size={20} color="#818CF8" />
          </View>
          <SkillRadar />
        </View>

        {/* ── Application Flow ──────────────────────────────────── */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={styles.cardTitle}>Application Flow</Text>
            <MaterialIcons name="send" size={20} color="#22D3EE" />
          </View>

          <StatBar label="INTERVIEW RATE"    displayValue="68%"    fraction={0.68} delay={100} />
          <StatBar label="RESPONSE TIME"     displayValue="2.4 Days" fraction={0.85} delay={300} />
          <StatBar label="OFFER CONVERSION"  displayValue="12%"    fraction={0.12} delay={500} />

          <View style={styles.statDivider} />
          <View style={styles.countersRow}>
            {[
              { val: '24', lbl: 'APPLIED' },
              { val: '8',  lbl: 'ACTIVE'  },
              { val: '2',  lbl: 'OFFERS'  },
            ].map(item => (
              <View key={item.lbl} style={styles.counterItem}>
                <Text style={styles.counterValue}>{item.val}</Text>
                <Text style={styles.counterLabel}>{item.lbl}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Learning Growth ───────────────────────────────────── */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <Text style={styles.cardTitle}>Learning Growth</Text>
            <MaterialIcons name="auto-awesome" size={20} color="#E7C365" />
          </View>

          {/* Item 1 — completed */}
          <View style={styles.timelineItem}>
            <View style={styles.timelineDotCol}>
              <View style={[styles.timelineDot, { backgroundColor: '#22D3EE', shadowColor: '#22D3EE', shadowOpacity: 0.4, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } }]} />
              <View style={styles.timelineLine} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Generative AI for Designers</Text>
              <Text style={[styles.timelineMeta, { color: '#22D3EE' }]}>COMPLETED · 2 DAYS AGO</Text>
            </View>
          </View>

          {/* Item 2 — in progress */}
          <View style={styles.timelineItem}>
            <View style={styles.timelineDotCol}>
              <View style={[styles.timelineDot, { backgroundColor: '#A5B4FC', shadowColor: '#A5B4FC', shadowOpacity: 0.4, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } }]} />
              <View style={styles.timelineLine} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Advanced Systems Thinking</Text>
              <Text style={[styles.timelineMeta, { color: '#A5B4FC' }]}>IN PROGRESS</Text>
              <View style={styles.progressChip}>
                <Text style={styles.progressChipText}>75% complete</Text>
              </View>
            </View>
          </View>

          {/* Item 3 — queued */}
          <View style={[styles.timelineItem, { marginBottom: 0 }]}>
            <View style={styles.timelineDotCol}>
              <View style={[styles.timelineDot, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitle, styles.timelineTitleDim]}>Leadership in Tech</Text>
              <Text style={[styles.timelineMeta, { color: 'rgba(100,116,139,0.6)' }]}>QUEUED</Text>
            </View>
          </View>
        </View>

        {/* ── Resume Hub ────────────────────────────────────────── */}
        <View style={styles.card}>
          {/* Header + buttons */}
          <View style={styles.resumeHeader}>
            <View style={styles.resumeHeaderLeft}>
              <Text style={styles.resumeHeaderTitle}>Resume Hub</Text>
              <Text style={styles.resumeHeaderSub}>
                {resumeProfile?.parseMeta?.parsedAt
                  ? `Last updated: ${new Date(resumeProfile.parseMeta.parsedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                  : 'Last updated: —'}
              </Text>
            </View>
            <View style={styles.resumeBtns}>
              {/* Re-upload */}
              <Pressable
                style={styles.resumeBtn}
                onPress={handleReupload}
                android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)' } : undefined}
              >
                {reuploadLoading ? (
                  <Spinner />
                ) : (
                  <MaterialIcons name="upload-file" size={14} color="rgba(226,232,240,0.7)" />
                )}
                <Text style={styles.resumeBtnText}>
                  {reuploadLoading ? 'Uploading…' : 'Re-upload'}
                </Text>
              </Pressable>

              {/* PDF */}
              <Pressable
                style={[styles.resumeBtn, styles.resumeBtnPrimary]}
                onPress={handleDownloadPdf}
                android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.1)' } : undefined}
              >
                <LinearGradient
                  colors={pdfDone ? ['#22C55E', '#16A34A'] : ['#6366F1', '#22D3EE']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
                {pdfLoading ? (
                  <Spinner />
                ) : pdfDone ? (
                  <MaterialIcons name="check-circle" size={14} color="white" />
                ) : (
                  <MaterialIcons name="download" size={14} color="white" />
                )}
                <Text style={styles.resumeBtnTextPrimary}>
                  {pdfDone ? 'Done!' : 'PDF'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Document preview */}
          <View style={styles.resumeDoc}>
            {/* Name + headline */}
            <Text style={styles.resumeDocName}>{displayName || '—'}</Text>
            {!!(parsed?.headline) && (
              <Text style={styles.resumeDocRole}>{parsed.headline}</Text>
            )}

            {/* Contact */}
            {(parsed?.contact?.email || parsed?.contact?.profiles?.linkedin || parsed?.contact?.profiles?.website) && (
              <View style={styles.resumeDocContact}>
                {!!parsed.contact.email && (
                  <Text style={styles.resumeDocContactText}>{parsed.contact.email}</Text>
                )}
                {!!parsed.contact.email && !!parsed.contact.profiles?.linkedin && (
                  <Text style={[styles.resumeDocContactText, { color: 'rgba(100,116,139,0.3)' }]}>·</Text>
                )}
                {!!parsed.contact.profiles?.linkedin && (
                  <Text style={styles.resumeDocContactText}>{parsed.contact.profiles.linkedin}</Text>
                )}
                {!!(parsed.contact.profiles?.linkedin || parsed.contact.email) && !!parsed.contact.profiles?.website && (
                  <Text style={[styles.resumeDocContactText, { color: 'rgba(100,116,139,0.3)' }]}>·</Text>
                )}
                {!!parsed.contact.profiles?.website && (
                  <Text style={styles.resumeDocContactText}>{parsed.contact.profiles.website}</Text>
                )}
              </View>
            )}

            {!!(parsed?.summary) && (
              <>
                <View style={styles.resumeDivider} />
                <Text style={styles.resumeSectionLabel}>Summary</Text>
                <Text style={styles.resumeBodyText}>{parsed.summary}</Text>
              </>
            )}

            {!!(parsed?.experience?.length) && (
              <>
                <View style={styles.resumeDivider} />
                <Text style={styles.resumeSectionLabel}>Experience</Text>
                {parsed.experience.slice(0, 3).map((exp, i) => {
                  const dateEnd = exp.current ? 'NOW' : (exp.endDate ?? '');
                  const dateStr = [exp.startDate, dateEnd].filter(Boolean).join(' – ');
                  const titleLine = [exp.title, exp.company].filter(Boolean).join(' · ');
                  return (
                    <View key={i} style={[styles.resumeExpItem, i === 0 && styles.resumeExpItemActive, i === parsed.experience.length - 1 && { marginBottom: 0 }]}>
                      <View style={[styles.resumeExpDot, { backgroundColor: i === 0 ? '#818CF8' : 'rgba(255,255,255,0.2)' }]} />
                      <View style={styles.resumeExpRow}>
                        <Text style={styles.resumeExpTitle} numberOfLines={1}>{titleLine}</Text>
                        {!!dateStr && <Text style={styles.resumeExpDate}>{dateStr}</Text>}
                      </View>
                      {!!(exp.highlights?.length) && (
                        <Text style={styles.resumeExpDesc} numberOfLines={2}>
                          {exp.highlights[0]}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </>
            )}
          </View>
        </View>

        {/* ── Log Out ───────────────────────────────────────────── */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialIcons name="logout" size={18} color="#F87171" />
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </Pressable>

      </Animated.ScrollView>

      <BottomNavBar activeTab="profile" activeColor="#22D3EE" activeBg="rgba(34,211,238,0.12)" />
    </View>
  );
}
