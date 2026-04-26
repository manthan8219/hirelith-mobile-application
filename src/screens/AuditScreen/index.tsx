import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Dimensions,
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop, Polyline, Line, Text as SvgText } from 'react-native-svg';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { BottomNavBar } from '../../components/BottomNavBar';
import { styles } from './AuditScreen.styles';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Breakdown {
  technicalDepth: number;
  impactAndAchievements: number;
  careerTrajectory: number;
  marketCompetitiveness: number;
  presentationQuality: number;
  goalAlignment: number;
}

interface VersionSummary {
  analysis_id: string;
  version: number;
  readiness_score: number;
  verdict: string;
  created_at: string;
}

// ─── Mini SVG line chart ───────────────────────────────────────────────────────
function ScoreProgressChart({ versions }: { versions: VersionSummary[] }) {
  if (versions.length < 2) return null;

  const W = SCREEN_WIDTH - 64;
  const H = 80;
  const PAD = 12;
  const scores = versions.map(v => v.readiness_score);
  const minS = Math.max(0,  Math.min(...scores) - 10);
  const maxS = Math.min(100, Math.max(...scores) + 10);

  const pts = scores.map((s, i) => {
    const x = PAD + (i / (scores.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((s - minS) / (maxS - minS)) * (H - PAD * 2);
    return `${x},${y}`;
  });

  return (
    <Svg width={W} height={H}>
      <Defs>
        <SvgGradient id="line_grad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#7C3AED" />
          <Stop offset="1" stopColor="#22D3EE" />
        </SvgGradient>
      </Defs>
      {/* baseline */}
      <Line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
      {/* score line */}
      <Polyline points={pts.join(' ')} fill="none" stroke="url(#line_grad)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* dots + labels */}
      {scores.map((s, i) => {
        const [x, y] = pts[i].split(',').map(Number);
        const isLast = i === scores.length - 1;
        return (
          <React.Fragment key={i}>
            <Circle cx={x} cy={y} r={isLast ? 5 : 3.5} fill={isLast ? '#22D3EE' : '#7C3AED'} />
            <SvgText x={x} y={y - 8} fill="rgba(255,255,255,0.7)" fontSize={9} textAnchor="middle">{s}</SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

interface CareerAnalysis {
  readinessScore?: number;
  breakdown?: Breakdown;
  verdict?: string;
  strengths?: string[];
  criticalGaps?: string[];
  marketReality?: string;
  actionPlan?: string[];
  honestTimeline?: string;
  salaryPotential?: string;
}

const BREAKDOWN_CONFIG = [
  { label: 'Technical Depth',       color: '#A78BFA', getValue: (b?: Breakdown) => b?.technicalDepth         ?? 75 },
  { label: 'Impact & Achievements', color: '#FF4D4F', getValue: (b?: Breakdown) => b?.impactAndAchievements   ?? 55 },
  { label: 'Career Trajectory',     color: '#60A5FA', getValue: (b?: Breakdown) => b?.careerTrajectory        ?? 70 },
  { label: 'Goal Alignment',        color: '#22D3EE', getValue: (b?: Breakdown) => b?.goalAlignment           ?? 60 },
  { label: 'Market Competitiveness',color: '#FB923C', getValue: (b?: Breakdown) => b?.marketCompetitiveness   ?? 65 },
  { label: 'Presentation Quality',  color: '#34D399', getValue: (b?: Breakdown) => b?.presentationQuality     ?? 72 },
];

const DEFAULT_GAPS = [
  { title: 'Zero quantifiable impact',  desc: 'Resume lacks metric-driven success indicators (revenue, users, latency).' },
  { title: 'Lack of Senior indicators', desc: "Narrative focuses on 'doing tasks' rather than 'solving problems'." },
];

const DEFAULT_ACTION_PLAN = [
  'Apply Google XYZ Formula to all bullet points',
  'Quantify technical work with business ROI metrics',
  'Audit legacy projects for Scale and Impact stories',
  'Draft 3 internal leadership case studies',
  'Identify Critical Path mentorship opportunities',
];

const DEFAULT_MARKET_REALITY =
  'The current market is pivoting from Velocity to Efficiency. AI-augmented engineers are expected to deliver 3x output with 0.5x oversight. Business articulation is now the primary filter for Senior+ roles.';

// ─── Animated progress bar ────────────────────────────────────────────────────
function AnimatedBar({ value, color }: { value: number; color: string }) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: value,
      duration: 900,
      delay: 400,
      useNativeDriver: false,
    }).start();
  }, [value]);

  return (
    <View style={styles.barTrack}>
      <Animated.View
        style={[
          styles.barFill,
          {
            backgroundColor: color,
            width: widthAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
          },
        ]}
      />
    </View>
  );
}

// ─── SVG score ring ───────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const size    = 160;
  const strokeW = 11;
  const r       = (size - strokeW) / 2;
  const circ    = 2 * Math.PI * r;

  const [dashOffset, setDashOffset] = useState(circ);
  const anim = useRef(new Animated.Value(circ)).current;

  useEffect(() => {
    anim.addListener(({ value }) => setDashOffset(value));
    const t = setTimeout(() => {
      Animated.timing(anim, {
        toValue: circ * (1 - score / 100),
        duration: 1400,
        useNativeDriver: false,
      }).start();
    }, 300);
    return () => { clearTimeout(t); anim.removeAllListeners(); };
  }, [score]);

  return (
    <View style={styles.scoreRingWrap}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Defs>
          <SvgGradient id="audit_ring" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#8B5CF6" />
            <Stop offset="1" stopColor="#22D3EE" />
          </SvgGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={strokeW} fill="none" />
        <Circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="url(#audit_ring)"
          strokeWidth={strokeW}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.scoreCenter}>
        <Text style={styles.scoreNum}>{score}</Text>
        <Text style={styles.scoreLabel}>READINESS</Text>
      </View>
    </View>
  );
}

// ─── AuditScreen ──────────────────────────────────────────────────────────────
export default function AuditScreen() {
  const insets = useSafeAreaInsets();
  const { backendUser } = useAuth();

  const [careerAnalysis, setCareerAnalysis] = useState<CareerAnalysis | null>(null);
  const [history, setHistory]               = useState<VersionSummary[]>([]);
  const [checkedItems, setCheckedItems]     = useState<Set<number>>(new Set());
  const [reevaluating, setReevaluating]     = useState(false);

  const headerOp = useRef(new Animated.Value(0)).current;
  const heroY    = useRef(new Animated.Value(24)).current;
  const heroOp   = useRef(new Animated.Value(0)).current;
  const orb1Op   = useRef(new Animated.Value(0.08)).current;
  const orb2Op   = useRef(new Animated.Value(0.05)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  const fetchAnalysis = useCallback(async () => {
    if (!backendUser?.id) return;
    try {
      const result = await api.get<CareerAnalysis>(`/api/v1/career-analysis/${backendUser.id}`);
      setCareerAnalysis(result);
    } catch {
      // show defaults
    }
  }, [backendUser?.id]);

  const fetchHistory = useCallback(async () => {
    if (!backendUser?.id) return;
    try {
      const result = await api.get<{ versions: VersionSummary[] }>(`/api/v1/career-analysis/${backendUser.id}/history`);
      setHistory(result.versions ?? []);
    } catch {
      // history is non-critical — silently skip
    }
  }, [backendUser?.id]);

  useEffect(() => {
    fetchAnalysis();
    fetchHistory();

    Animated.sequence([
      Animated.timing(headerOp, { toValue: 1, duration: 120, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(heroY,  { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }),
        Animated.timing(heroOp, { toValue: 1, duration: 350, useNativeDriver: true }),
      ]),
    ]).start();

    Animated.loop(Animated.sequence([
      Animated.timing(orb1Op, { toValue: 0.14, duration: 4000, useNativeDriver: true }),
      Animated.timing(orb1Op, { toValue: 0.05, duration: 4000, useNativeDriver: true }),
    ])).start();
    setTimeout(() => {
      Animated.loop(Animated.sequence([
        Animated.timing(orb2Op, { toValue: 0.09, duration: 3200, useNativeDriver: true }),
        Animated.timing(orb2Op, { toValue: 0.03, duration: 3200, useNativeDriver: true }),
      ])).start();
    }, 1500);
  }, [fetchAnalysis]);

  const score        = careerAnalysis?.readinessScore ?? 68;
  const verdict      = careerAnalysis?.verdict        ?? '"Feature factory" engineer — needs stronger business value articulation.';
  const marketText   = careerAnalysis?.marketReality  ?? DEFAULT_MARKET_REALITY;
  const gaps         = careerAnalysis?.criticalGaps?.map((desc, i) => ({ title: `Gap ${i + 1}`, desc }))
                       ?? DEFAULT_GAPS;
  const strengths    = careerAnalysis?.strengths ?? [];
  const actionItems  = careerAnalysis?.actionPlan ?? DEFAULT_ACTION_PLAN;

  const toggleCheck = useCallback((i: number) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }, []);

  const handleReEvaluate = useCallback(async () => {
    if (reevaluating || !backendUser?.id) return;
    setReevaluating(true);
    Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true, tension: 300, friction: 8 }).start();
    try {
      const result = await api.post<CareerAnalysis>(`/api/v1/career-analysis/${backendUser.id}/rerun`, {});
      setCareerAnalysis(result);
      fetchHistory();
    } catch {
      Alert.alert('Re-evaluation failed', 'Make sure your resume is uploaded and try again.');
    } finally {
      setReevaluating(false);
      Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 8 }).start();
    }
  }, [reevaluating, backendUser?.id]);

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.orb1, { opacity: orb1Op }]} />
      <Animated.View style={[styles.orb2, { opacity: orb2Op }]} />

      <View style={{ flex: 1, paddingTop: insets.top }}>

        {/* ── Header ── */}
        <Animated.View style={[styles.header, { opacity: headerOp }]}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconWrap}>
              <MaterialIcons name="troubleshoot" size={20} color="#A78BFA" />
            </View>
            <Text style={styles.headerBrand}>
              Career<Text style={styles.headerBrandAccent}>.Audit</Text>
            </Text>
          </View>
          <Pressable
            style={styles.headerRerunBtn}
            onPress={handleReEvaluate}
            disabled={reevaluating}
            android_ripple={Platform.OS === 'android' ? { color: 'rgba(167,139,250,0.1)', borderless: true } : undefined}
          >
            <MaterialIcons name={reevaluating ? 'hourglass-top' : 'refresh'} size={14} color="#A78BFA" />
            <Text style={styles.headerRerunText}>{reevaluating ? 'Running…' : 'Re-run'}</Text>
          </Pressable>
        </Animated.View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Hero card ── */}
          <Animated.View style={{ opacity: heroOp, transform: [{ translateY: heroY }] }}>
            <View style={styles.heroCard}>
              <View style={styles.heroGlow} />
              <View style={styles.heroGlow2} />

              <ScoreRing score={score} />

              <Text style={styles.heroTitle}>Career Readiness</Text>
              <Text style={styles.heroVerdict}>{verdict}</Text>

              {/* Stats row — only render if we have real data */}
              {(careerAnalysis?.salaryPotential || careerAnalysis?.honestTimeline) && (
                <View style={styles.statsRow}>
                  {careerAnalysis.salaryPotential && (
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Salary Range</Text>
                      <Text style={[styles.statValue, styles.statValueAccent2]}>
                        {careerAnalysis.salaryPotential}
                      </Text>
                    </View>
                  )}
                  {careerAnalysis.salaryPotential && careerAnalysis.honestTimeline && (
                    <View style={styles.statDivider} />
                  )}
                  {careerAnalysis.honestTimeline && (
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Honest Timeline</Text>
                      <Text style={[styles.statValue, styles.statValueAccent]}>
                        {careerAnalysis.honestTimeline}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </Animated.View>

          {/* ── Score Progress ── */}
          {history.length >= 2 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Score Progress</Text>
                <MaterialIcons name="trending-up" size={18} color="#22D3EE" />
              </View>

              {/* mini line chart */}
              <View style={{ alignItems: 'center', marginVertical: 8 }}>
                <ScoreProgressChart versions={history} />
              </View>

              {/* version cards — horizontal scroll */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                {history.map((v, i) => {
                  const prev = i > 0 ? history[i - 1].readiness_score : null;
                  const delta = prev !== null ? v.readiness_score - prev : null;
                  const dateStr = v.created_at
                    ? new Date(v.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : `v${v.version}`;
                  const isLatest = i === history.length - 1;
                  return (
                    <View
                      key={v.analysis_id}
                      style={{
                        width: 90,
                        marginRight: 10,
                        padding: 10,
                        borderRadius: 12,
                        backgroundColor: isLatest ? 'rgba(34,211,238,0.1)' : 'rgba(255,255,255,0.04)',
                        borderWidth: 1,
                        borderColor: isLatest ? 'rgba(34,211,238,0.3)' : 'rgba(255,255,255,0.06)',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>{dateStr}</Text>
                      <Text style={{ color: isLatest ? '#22D3EE' : '#A78BFA', fontSize: 22, fontWeight: '700' }}>
                        {v.readiness_score}
                      </Text>
                      {delta !== null && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                          <MaterialIcons
                            name={delta >= 0 ? 'arrow-upward' : 'arrow-downward'}
                            size={10}
                            color={delta >= 0 ? '#34D399' : '#FF4D4F'}
                          />
                          <Text style={{ color: delta >= 0 ? '#34D399' : '#FF4D4F', fontSize: 10, fontWeight: '600' }}>
                            {delta >= 0 ? '+' : ''}{delta}
                          </Text>
                        </View>
                      )}
                      {isLatest && (
                        <Text style={{ color: '#22D3EE', fontSize: 9, opacity: 0.7 }}>latest</Text>
                      )}
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* ── Breakdown ── */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Score Breakdown</Text>
              <MaterialIcons name="analytics" size={18} color="#A78BFA" />
            </View>
            <View style={styles.barsList}>
              {BREAKDOWN_CONFIG.map(bar => {
                const val = bar.getValue(careerAnalysis?.breakdown);
                return (
                  <View key={bar.label} style={styles.barRow}>
                    <View style={styles.barMeta}>
                      <Text style={styles.barLabel}>{bar.label}</Text>
                      <Text style={[styles.barValue, { color: bar.color }]}>{Math.round(val)}</Text>
                    </View>
                    <AnimatedBar value={val} color={bar.color} />
                  </View>
                );
              })}
            </View>
          </View>

          {/* ── Critical Gaps ── */}
          <View style={styles.sectionHeader}>
            <MaterialIcons name="warning" size={18} color="#FF4D4F" />
            <Text style={styles.sectionTitle}>Critical Gaps</Text>
          </View>
          <View style={styles.gapsList}>
            {gaps.slice(0, 4).map((gap, i) => (
              <View key={i} style={styles.gapCard}>
                <View style={styles.gapDot} />
                <View style={styles.gapContent}>
                  <Text style={styles.gapTitle}>{gap.title}</Text>
                  <Text style={styles.gapDesc}>{gap.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* ── Strengths ── */}
          {strengths.length > 0 && (
            <>
              <View style={[styles.sectionHeader, { marginTop: 4 }]}>
                <MaterialIcons name="star" size={18} color="#22D3EE" />
                <Text style={styles.sectionTitle}>Strengths</Text>
              </View>
              <View style={styles.gapsList}>
                {strengths.slice(0, 4).map((s, i) => (
                  <View key={i} style={styles.strengthCard}>
                    <View style={styles.strengthDot} />
                    <View style={styles.gapContent}>
                      <Text style={styles.gapDesc}>{s}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* ── Action Plan ── */}
          <View style={styles.sectionHeader}>
            <MaterialIcons name="checklist" size={18} color="#A78BFA" />
            <Text style={styles.sectionTitle}>Action Plan</Text>
          </View>
          <View style={styles.actionList}>
            {actionItems.map((item, i) => {
              const checked = checkedItems.has(i);
              return (
                <Pressable
                  key={i}
                  style={styles.actionItem}
                  onPress={() => toggleCheck(i)}
                  android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.04)' } : undefined}
                >
                  <View style={[styles.actionCheckbox, checked && styles.actionCheckboxChecked]}>
                    {checked && <MaterialIcons name="check" size={13} color="#A78BFA" />}
                  </View>
                  <Text style={[styles.actionText, checked && styles.actionTextChecked]}>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* ── Market Reality ── */}
          <View style={styles.marketCard}>
            <View style={styles.marketGlow} />
            <View style={styles.marketHeader}>
              <View style={styles.marketIconWrap}>
                <MaterialIcons name="public" size={18} color="#22D3EE" />
              </View>
              <Text style={styles.marketTitle}>2025 Market Reality</Text>
            </View>
            <Text style={styles.marketBody}>{marketText}</Text>
            <View style={styles.marketTagRow}>
              <View style={[styles.marketTag, { borderColor: 'rgba(34,211,238,0.25)' }]}>
                <Text style={[styles.marketTagText, { color: '#22D3EE' }]}>High Saturation</Text>
              </View>
              <View style={[styles.marketTag, { borderColor: 'rgba(167,139,250,0.25)' }]}>
                <Text style={[styles.marketTagText, { color: '#A78BFA' }]}>Domain Authority Req.</Text>
              </View>
            </View>
          </View>

          {/* ── Re-evaluate (full button at bottom) ── */}
          <View style={styles.reEvalSection}>
            <Animated.View style={[styles.reEvalBtnWrap, { transform: [{ scale: btnScale }] }]}>
              <Pressable
                onPress={handleReEvaluate}
                disabled={reevaluating}
                style={{ borderRadius: 20, overflow: 'hidden' }}
                android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.1)' } : undefined}
              >
                <LinearGradient
                  colors={reevaluating ? ['#374151', '#1F2937'] : ['#7C3AED', '#3B82F6', '#06B6D4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.reEvalBtnInner}
                >
                  <MaterialIcons name={reevaluating ? 'hourglass-top' : 'refresh'} size={19} color="white" />
                  <Text style={styles.reEvalBtnText}>
                    {reevaluating ? 'Analyzing… this takes ~1 min' : 'Re-evaluate Assessment'}
                  </Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
            <Text style={styles.reEvalNote}>
              Powered by Gemini · Fresh AI analysis on your latest resume
            </Text>
          </View>

        </ScrollView>

        <BottomNavBar activeTab="audit" activeColor="#A78BFA" activeBg="rgba(167,139,250,0.15)" />
      </View>
    </View>
  );
}
