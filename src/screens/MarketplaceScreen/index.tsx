import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  Platform,
  Alert,
  Linking,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import { BottomNavBar } from '../../components/BottomNavBar';
import { styles } from './MarketplaceScreen.styles';
import {
  api,
  fetchLiveJobs,
  fetchStartups,
  fetchMidSizeCompanies,
  fetchEnterpriseCompanies,
  generateColdEmail,
  sendAutoEmail,
  type ApiJob,
  type ScrapedCompany,
} from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import type { ParsedResume } from '../../types/resume';

const { height } = Dimensions.get('window');

// Jobs displayed per "page" in the infinite scroll
const DISPLAY_CHUNK = 15;
// Per-source scrape limit sent to backend
const SCRAPE_LIMIT = 50;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim();
}

function formatSalary(salary?: ApiJob['salary']): string | null {
  if (!salary) return null;
  if (salary.raw) return salary.raw;
  if (salary.min || salary.max) {
    const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`;
    if (salary.min && salary.max) return `${fmt(salary.min)}–${fmt(salary.max)}`;
    if (salary.min) return `${fmt(salary.min)}+`;
    if (salary.max) return `up to ${fmt(salary.max)}`;
  }
  return null;
}

function extractDomain(website?: string): string | null {
  if (!website) return null;
  try {
    return website.replace(/https?:\/\//, '').replace(/www\./, '').split('/')[0];
  } catch {
    return null;
  }
}

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

const FUNDING_COLORS: Record<string, string> = {
  pre_seed: '#6366F1', seed: '#8B5CF6', angel: '#A78BFA',
  series_a: '#22D3EE', series_b: '#06B6D4', series_c: '#10B981',
  growth: '#34D399', ipo: '#F59E0B', public: '#FBB040',
};

const SOURCE_COLORS: Record<string, string> = {
  remotive: '#34D399', arbeitnow: '#22D3EE', remoteok: '#F59E0B',
  themuse: '#EC4899', jobicy: '#8B5CF6', himalayas: '#06B6D4',
  weworkremotely: '#6366F1', adzuna: '#F97316', reed: '#EF4444',
  findwork: '#A78BFA',
};

// ─── Remote toggle ────────────────────────────────────────────────────────────
function RemoteToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  const anim = useRef(new Animated.Value(on ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: on ? 1 : 0, useNativeDriver: false, tension: 200, friction: 10 }).start();
  }, [on]);
  const thumbLeft = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 20] });
  const trackColor = anim.interpolate({ inputRange: [0, 1], outputRange: ['rgba(100,116,139,0.3)', '#6750A4'] });
  return (
    <Pressable style={styles.toggleChip} onPress={onToggle}>
      <Text style={styles.toggleLabel}>Remote Only</Text>
      <Animated.View style={[styles.toggleTrack, { backgroundColor: trackColor }]}>
        <Animated.View style={[styles.toggleThumb, { position: 'absolute', left: thumbLeft }]} />
      </Animated.View>
    </Pressable>
  );
}

// ─── Job skeleton card ────────────────────────────────────────────────────────
function JobSkeletonCard() {
  const pulse = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.8, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={[styles.jobCard, { opacity: pulse }]}>
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
        <View style={[styles.jobIconWrap, { backgroundColor: 'rgba(255,255,255,0.06)' }]} />
        <View style={{ flex: 1, gap: 8 }}>
          <View style={{ height: 14, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.08)', width: '70%' }} />
          <View style={{ height: 11, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.05)', width: '45%' }} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 14 }}>
        {[55, 80, 65].map((w, i) => (
          <View key={i} style={{ height: 22, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.05)', width: w }} />
        ))}
      </View>
      <View style={{ height: 11, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.05)', width: '90%', marginBottom: 6 }} />
      <View style={{ height: 11, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.04)', width: '60%' }} />
    </Animated.View>
  );
}

// ─── Real job card ────────────────────────────────────────────────────────────
function JobCard({ job }: { job: ApiJob }) {
  const cardScale = useRef(new Animated.Value(1)).current;
  const accentColor = SOURCE_COLORS[job.source] ?? '#6366F1';
  const salaryStr = formatSalary(job.salary);

  const tags: string[] = [
    ...(job.jobType ? [job.jobType] : []),
    ...(salaryStr ? [salaryStr] : []),
    ...(job.remote ? ['Remote'] : []),
    ...job.tags.slice(0, 3),
  ].filter(Boolean).slice(0, 5);

  const description = useMemo(() =>
    job.description ? stripHtml(job.description).slice(0, 140) : null,
    [job.description]
  );

  const handleApply = useCallback(() => {
    if (job.url) Linking.openURL(job.url).catch(() => Alert.alert('Cannot open link'));
  }, [job.url]);

  return (
    <Animated.View style={{ transform: [{ scale: cardScale }] }}>
      <Pressable
        style={styles.jobCard}
        onPressIn={() => Animated.spring(cardScale, { toValue: 0.985, useNativeDriver: true, tension: 300, friction: 10 }).start()}
        onPressOut={() => Animated.spring(cardScale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }).start()}
        onPress={handleApply}
        android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.03)' } : undefined}
      >
        {/* Accent top line */}
        <LinearGradient
          colors={['rgba(0,0,0,0)', `${accentColor}70`, 'rgba(0,0,0,0)']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.jobCardTopLine}
        />

        {/* Header */}
        <View style={styles.jobCardHeader}>
          <View style={styles.jobCardLeft}>
            <View style={[styles.jobIconWrap, { backgroundColor: `${accentColor}15`, borderColor: `${accentColor}30` }]}>
              <Text style={{ fontSize: 22, fontWeight: '900', color: accentColor }}>
                {getInitial(job.company)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.jobTitle} numberOfLines={2}>{job.title}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <Text style={styles.jobCompany} numberOfLines={1}>{job.company}</Text>
                {job.location ? (
                  <>
                    <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(100,116,139,0.5)' }} />
                    <Text style={[styles.jobCompany, { flex: 1 }]} numberOfLines={1}>{job.location}</Text>
                  </>
                ) : null}
              </View>
            </View>
          </View>
          {/* Source badge */}
          <View style={[styles.liveJobSourceBadge, { borderColor: `${accentColor}40`, backgroundColor: `${accentColor}15` }]}>
            <Text style={[styles.liveJobSourceText, { color: accentColor }]}>{job.source}</Text>
          </View>
        </View>

        {/* Tags */}
        {tags.length > 0 && (
          <View style={styles.tagsRow}>
            {tags.map((tag, i) => (
              <View key={i} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
            ))}
          </View>
        )}

        {/* Description snippet */}
        {description ? (
          <Text style={styles.jobSnippet} numberOfLines={2}>{description}</Text>
        ) : null}

        {/* Footer */}
        <View style={styles.jobCardFooter}>
          <View style={styles.footerLeft}>
            {job.postedAt ? (
              <View style={styles.footerMeta}>
                <MaterialIcons name="schedule" size={12} color="rgba(100,116,139,0.6)" />
                <Text style={styles.footerMetaText}>
                  {new Date(job.postedAt).toLocaleDateString()}
                </Text>
              </View>
            ) : null}
            {job.remote && (
              <View style={styles.directHireRow}>
                <MaterialIcons name="public" size={13} color="#34D399" />
                <Text style={[styles.directHireText, { color: '#34D399' }]}>Remote</Text>
              </View>
            )}
          </View>
          <Pressable
            style={[styles.optimizeBtn, { shadowColor: accentColor }]}
            onPress={handleApply}
          >
            <LinearGradient
              colors={[accentColor, `${accentColor}BB`]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.optimizeBtnInner}
            >
              <Text style={styles.optimizeBtnText}>Apply Now</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Cold Email Composer ──────────────────────────────────────────────────────
// Flow: (1) ready (recipient + tone only) → (2) generating → (3) preview → (4) sending → (5) done
type ComposerStep = 'ready' | 'generating' | 'preview' | 'sending' | 'done';

interface ResumeProfileData {
  resumeUrl: string | null;
  parsedResume: ParsedResume | null;
}

function buildSenderBackground(parsed: ParsedResume): string {
  const parts: string[] = [];
  if (parsed.headline) parts.push(parsed.headline);
  if (parsed.summary) parts.push(parsed.summary);
  if (parsed.totalExperienceYears) parts.push(`${parsed.totalExperienceYears}+ years of experience`);
  const topSkills = parsed.skills.all.slice(0, 8);
  if (topSkills.length) parts.push(`Top skills: ${topSkills.join(', ')}`);
  if (parsed.experience.length) {
    const latest = parsed.experience[0];
    parts.push(`Most recently ${latest.title} at ${latest.company}`);
  }
  return parts.filter(Boolean).join('. ');
}

interface ColdEmailComposerProps {
  company: ScrapedCompany | null;
  visible: boolean;
  onClose: () => void;
}

function ColdEmailComposer({ company, visible, onClose }: ColdEmailComposerProps) {
  const insets = useSafeAreaInsets();
  const { backendUser, firebaseUser } = useAuth();
  const domain = extractDomain(company?.website);

  const [step, setStep] = useState<ComposerStep>('ready');
  const [toAddress, setToAddress] = useState('');
  const [tone, setTone] = useState<'formal' | 'friendly' | 'concise'>('formal');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [genError, setGenError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [resumeProfile, setResumeProfile] = useState<ResumeProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Reset state + fetch resume profile on open
  useEffect(() => {
    if (!company || !visible) return;
    setStep('ready');
    setToAddress(domain ? `careers@${domain}` : '');
    setTone('formal');
    setSubject('');
    setBody('');
    setGenError(null);
    setSendError(null);

    if (!backendUser?.id) return;
    setProfileLoading(true);
    api.get<ResumeProfileData>(`/api/v1/resume/profile?userId=${backendUser.id}`)
      .then(data => setResumeProfile(data))
      .catch(() => setResumeProfile(null))
      .finally(() => setProfileLoading(false));
  }, [company?.name, visible, backendUser?.id]);

  // Derived from resume — no manual input needed
  const senderName = resumeProfile?.parsedResume?.contact.fullName
    ?? firebaseUser?.displayName
    ?? '';
  const senderBackground = resumeProfile?.parsedResume
    ? buildSenderBackground(resumeProfile.parsedResume)
    : '';
  const resumeLink = resumeProfile?.resumeUrl ?? undefined;
  const headline = resumeProfile?.parsedResume?.headline
    ?? resumeProfile?.parsedResume?.experience[0]?.title
    ?? null;

  const handleGenerate = useCallback(async () => {
    if (!toAddress.trim()) { Alert.alert('Required', 'Enter the recipient email.'); return; }
    setStep('generating');
    setGenError(null);
    try {
      const result = await generateColdEmail({
        companyName: company!.name,
        companyDescription: company!.description,
        industry: company!.industry,
        fundingStage: company!.fundingStage,
        location: company!.location,
        funding: company!.funding,
        employeeCount: company!.employeeCount,
        foundedYear: company!.foundedYear,
        size: company!.size,
        tags: company!.tags,
        batch: company!.batch,
        userId: backendUser?.id,
        senderName,
        senderBackground,
        tone,
        resumeLink,
        recipientEmail: toAddress.trim(),
      });
      setSubject(result.subject);
      setBody(result.body);
      setStep('preview');
    } catch (err: any) {
      setGenError(err?.message ?? 'AI agent failed. Is Hirelith-agents running?');
      setStep('ready');
    }
  }, [company, senderName, senderBackground, toAddress, tone, resumeLink, backendUser?.id]);

  const handleSend = useCallback(async () => {
    setStep('sending');
    setSendError(null);
    try {
      const result = await sendAutoEmail({
        to: toAddress.trim(),
        subject: subject.trim(),
        body: body.trim(),
        resumeUrl: resumeLink,
      });
      if (result.success) {
        setStep('done');
      } else {
        setSendError(result.error ?? 'Send failed. Check GMAIL_SENDER and GMAIL_APP_PASSWORD in backend .env');
        setStep('preview');
      }
    } catch (err: any) {
      setSendError(err?.message ?? 'Request failed.');
      setStep('preview');
    }
  }, [toAddress, subject, body, resumeLink]);

  if (!company) return null;

  const stageColor = company.fundingStage ? FUNDING_COLORS[company.fundingStage] ?? '#8B5CF6' : '#8B5CF6';

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.composerOverlay}>
            <Pressable style={styles.composerBackdrop} onPress={onClose} />
            <View style={[styles.composerSheet, { paddingBottom: insets.bottom + 16 }]}>
              <View style={styles.sheetHandle} />

              {/* Header */}
              <View style={styles.composerHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.composerTitle}>
                    {step === 'ready' && 'Cold Email'}
                    {step === 'generating' && 'Generating…'}
                    {step === 'preview' && 'Review Email'}
                    {step === 'sending' && 'Sending…'}
                    {step === 'done' && 'Sent!'}
                  </Text>
                  <Text style={styles.composerSub}>to {company.name}</Text>
                </View>
                <Pressable style={styles.composerCloseBtn} onPress={onClose}>
                  <MaterialIcons name="close" size={18} color="rgba(148,163,184,0.7)" />
                </Pressable>
              </View>

              {/* ── Step 1: Ready ── */}
              {step === 'ready' && (
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                  {genError && (
                    <View style={styles.errorBanner}>
                      <MaterialIcons name="error-outline" size={14} color="#F87171" />
                      <Text style={styles.errorBannerText}>{genError}</Text>
                    </View>
                  )}

                  {/* Sender profile card — auto-populated from resume */}
                  <View style={styles.senderCard}>
                    <View style={styles.senderCardLeft}>
                      {profileLoading ? (
                        <ActivityIndicator size="small" color="#8B5CF6" />
                      ) : (
                        <View style={[styles.senderAvatar, { backgroundColor: `${stageColor}22`, borderColor: `${stageColor}55` }]}>
                          <Text style={[styles.senderAvatarText, { color: stageColor }]}>
                            {senderName ? senderName.charAt(0).toUpperCase() : '?'}
                          </Text>
                        </View>
                      )}
                      <View style={{ flex: 1 }}>
                        <Text style={styles.senderName} numberOfLines={1}>
                          {profileLoading ? 'Loading profile…' : (senderName || 'Your Name')}
                        </Text>
                        {headline ? (
                          <Text style={styles.senderHeadline} numberOfLines={1}>{headline}</Text>
                        ) : null}
                        <View style={styles.senderBadgeRow}>
                          {resumeLink ? (
                            <View style={styles.senderBadge}>
                              <MaterialIcons name="description" size={10} color="#34D399" />
                              <Text style={[styles.senderBadgeText, { color: '#34D399' }]}>Resume attached</Text>
                            </View>
                          ) : (
                            <View style={[styles.senderBadge, { borderColor: 'rgba(251,191,36,0.3)' }]}>
                              <MaterialIcons name="warning" size={10} color="#FBBF24" />
                              <Text style={[styles.senderBadgeText, { color: '#FBBF24' }]}>No resume uploaded</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                    <View style={styles.senderCardAutoTag}>
                      <MaterialIcons name="auto-awesome" size={10} color="#8B5CF6" />
                      <Text style={styles.senderCardAutoText}>Auto</Text>
                    </View>
                  </View>

                  {/* Recipient */}
                  <Text style={styles.fieldLabel}>Recipient Email</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={toAddress}
                    onChangeText={setToAddress}
                    placeholder={`careers@${domain ?? 'company.com'}`}
                    placeholderTextColor="rgba(100,116,139,0.5)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  {/* Tone */}
                  <Text style={styles.fieldLabel}>Tone</Text>
                  <View style={styles.toneRow}>
                    {(['formal', 'friendly', 'concise'] as const).map(t => (
                      <Pressable
                        key={t}
                        style={[styles.toneChip, tone === t && styles.toneChipActive]}
                        onPress={() => setTone(t)}
                      >
                        <Text style={[styles.toneChipText, tone === t && styles.toneChipTextActive]}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  <Pressable style={styles.generateBtn} onPress={handleGenerate} disabled={profileLoading}>
                    <LinearGradient
                      colors={profileLoading ? ['#374151', '#374151'] : ['#7C3AED', '#6366F1']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={styles.generateBtnInner}
                    >
                      <MaterialIcons name="auto-awesome" size={16} color="white" />
                      <Text style={styles.generateBtnText}>Generate AI Email</Text>
                    </LinearGradient>
                  </Pressable>
                  <View style={{ height: 16 }} />
                </ScrollView>
              )}

              {/* ── Step 2: Generating ── */}
              {step === 'generating' && (
                <View style={styles.generatingWrap}>
                  <View style={styles.generatingOrb} />
                  <ActivityIndicator size="large" color="#8B5CF6" />
                  <Text style={styles.generatingTitle}>AI is writing your email…</Text>
                  <Text style={styles.generatingHint}>
                    Crafting a personalised outreach for {company.name} using your resume and profile.
                  </Text>
                </View>
              )}

              {/* ── Step 3: Preview ── */}
              {step === 'preview' && (
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                  {sendError && (
                    <View style={styles.errorBanner}>
                      <MaterialIcons name="error-outline" size={14} color="#F87171" />
                      <Text style={styles.errorBannerText}>{sendError}</Text>
                    </View>
                  )}

                  <View style={styles.previewMeta}>
                    <MaterialIcons name="send" size={12} color="rgba(100,116,139,0.6)" />
                    <Text style={styles.previewMetaText}>To: {toAddress}</Text>
                  </View>

                  <Text style={styles.fieldLabel}>Subject</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={subject}
                    onChangeText={setSubject}
                    placeholderTextColor="rgba(100,116,139,0.5)"
                  />

                  <Text style={styles.fieldLabel}>Message</Text>
                  <TextInput
                    style={[styles.fieldInput, styles.fieldInputMultiline]}
                    value={body}
                    onChangeText={setBody}
                    multiline
                    numberOfLines={12}
                    textAlignVertical="top"
                    placeholderTextColor="rgba(100,116,139,0.5)"
                  />

                  <View style={styles.previewActions}>
                    <Pressable style={styles.regenerateBtn} onPress={() => setStep('ready')}>
                      <MaterialIcons name="refresh" size={14} color="#A78BFA" />
                      <Text style={styles.regenerateBtnText}>Regenerate</Text>
                    </Pressable>
                    <Pressable style={styles.sendBtn} onPress={handleSend}>
                      <LinearGradient
                        colors={['#7C3AED', '#6366F1']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={styles.sendBtnInner}
                      >
                        <MaterialIcons name="send" size={14} color="white" />
                        <Text style={styles.sendBtnText}>Send Email</Text>
                      </LinearGradient>
                    </Pressable>
                  </View>
                  <View style={{ height: 16 }} />
                </ScrollView>
              )}

              {/* ── Step 4: Sending ── */}
              {step === 'sending' && (
                <View style={styles.generatingWrap}>
                  <ActivityIndicator size="large" color="#22D3EE" />
                  <Text style={styles.generatingTitle}>Sending your email…</Text>
                  <Text style={styles.generatingHint}>Delivering to {toAddress}</Text>
                </View>
              )}

              {/* ── Step 5: Done ── */}
              {step === 'done' && (
                <View style={styles.generatingWrap}>
                  <View style={styles.doneIcon}>
                    <MaterialIcons name="check-circle" size={56} color="#34D399" />
                  </View>
                  <Text style={[styles.generatingTitle, { color: '#34D399' }]}>Email Sent!</Text>
                  <Text style={styles.generatingHint}>Your cold email was delivered to {toAddress}</Text>
                  <Pressable style={styles.doneCloseBtn} onPress={onClose}>
                    <Text style={styles.doneCloseBtnText}>Close</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Company Detail Modal ─────────────────────────────────────────────────────
function CompanyDetailModal({
  company, visible, onClose, onSendEmail,
}: {
  company: ScrapedCompany | null;
  visible: boolean;
  onClose: () => void;
  onSendEmail: () => void;
}) {
  const insets = useSafeAreaInsets();
  if (!company) return null;

  const stageColor = company.fundingStage ? FUNDING_COLORS[company.fundingStage] ?? '#6366F1' : '#6366F1';

  const infoRows: { icon: React.ComponentProps<typeof MaterialIcons>['name']; label: string; value: string }[] = [
    ...(company.industry ? [{ icon: 'category' as const, label: 'Industry', value: company.industry }] : []),
    ...(company.location ? [{ icon: 'location-on' as const, label: 'Location', value: company.location }] : []),
    ...(company.employeeCount ? [{ icon: 'people' as const, label: 'Team size', value: `${company.employeeCount} employees` }] : []),
    ...(company.foundedYear ? [{ icon: 'event' as const, label: 'Founded', value: String(company.foundedYear) }] : []),
    ...(company.funding ? [{ icon: 'attach-money' as const, label: 'Total funding', value: company.funding }] : []),
    ...(company.fundingStage ? [{ icon: 'trending-up' as const, label: 'Stage', value: company.fundingStage.replace(/_/g, ' ') }] : []),
    ...(company.source ? [{ icon: 'source' as const, label: 'Source', value: company.source }] : []),
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.detailOverlay}>
        <Pressable style={styles.composerBackdrop} onPress={onClose} />
        <View style={[styles.detailSheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.sheetHandle} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <LinearGradient colors={[`${stageColor}18`, 'rgba(11,15,26,0)']} style={styles.detailHero}>
              <View style={[styles.detailInitialBadge, { backgroundColor: `${stageColor}22`, borderColor: `${stageColor}55` }]}>
                <Text style={[styles.detailInitialText, { color: stageColor }]}>{getInitial(company.name)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailCompanyName}>{company.name}</Text>
                {company.batch && (
                  <View style={styles.batchBadgeInline}>
                    <Text style={styles.batchBadgeText}>{company.batch}</Text>
                  </View>
                )}
              </View>
              <Pressable style={styles.detailCloseBtn} onPress={onClose}>
                <MaterialIcons name="close" size={18} color="rgba(148,163,184,0.7)" />
              </Pressable>
            </LinearGradient>

            {company.description ? (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>About</Text>
                <Text style={styles.detailDescriptionText}>{company.description}</Text>
              </View>
            ) : null}

            {company.tags && company.tags.length > 0 && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Focus Areas</Text>
                <View style={styles.companyTagsRow}>
                  {company.tags.slice(0, 10).map((tag, i) => (
                    <View key={i} style={styles.companyTag}>
                      <Text style={styles.companyTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {infoRows.length > 0 && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Details</Text>
                <View style={styles.infoRowsWrap}>
                  {infoRows.map((row, i) => (
                    <View key={i} style={styles.infoRow}>
                      <MaterialIcons name={row.icon} size={14} color={stageColor} />
                      <Text style={styles.infoRowLabel}>{row.label}</Text>
                      <Text style={styles.infoRowValue} numberOfLines={1}>{row.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={[styles.detailSection, styles.detailLinksRow]}>
              {company.website && (
                <Pressable style={styles.detailLinkBtn} onPress={() => Linking.openURL(company.website!).catch(() => {})}>
                  <MaterialIcons name="language" size={14} color="rgba(148,163,184,0.7)" />
                  <Text style={styles.detailLinkText}>Website</Text>
                </Pressable>
              )}
              {company.sourceUrl && (
                <Pressable style={styles.detailLinkBtn} onPress={() => Linking.openURL(company.sourceUrl).catch(() => {})}>
                  <MaterialIcons name="open-in-new" size={14} color="rgba(148,163,184,0.7)" />
                  <Text style={styles.detailLinkText}>View on {company.source}</Text>
                </Pressable>
              )}
            </View>

            <View style={styles.detailCtaRow}>
              <Pressable style={styles.detailColdEmailBtn} onPress={onSendEmail}>
                <LinearGradient colors={['#7C3AED', '#8B5CF6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.detailColdEmailBtnInner}>
                  <MaterialIcons name="mail-outline" size={16} color="white" />
                  <Text style={styles.detailColdEmailBtnText}>Send Cold Email + Resume</Text>
                </LinearGradient>
              </Pressable>
            </View>
            <View style={{ height: 8 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── Company card ─────────────────────────────────────────────────────────────
function CompanyCard({
  company, onPress, onEmailPress,
}: {
  company: ScrapedCompany;
  onPress: () => void;
  onEmailPress: () => void;
}) {
  const stageColor = company.fundingStage ? FUNDING_COLORS[company.fundingStage] ?? '#6366F1' : '#6366F1';

  return (
    <Pressable style={styles.companyCard} onPress={onPress}>
      <LinearGradient colors={['rgba(0,0,0,0)', `${stageColor}50`, 'rgba(0,0,0,0)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.jobCardTopLine} />
      <View style={styles.companyCardHeader}>
        <View style={[styles.companyInitialBadge, { backgroundColor: `${stageColor}22`, borderColor: `${stageColor}44` }]}>
          <Text style={[styles.companyInitialText, { color: stageColor }]}>{getInitial(company.name)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.companyName} numberOfLines={1}>{company.name}</Text>
          {company.location && (
            <View style={styles.companyMetaRow}>
              <MaterialIcons name="location-on" size={11} color="rgba(100,116,139,0.6)" />
              <Text style={styles.companyMetaText} numberOfLines={1}>{company.location}</Text>
            </View>
          )}
        </View>
        {company.batch && <View style={styles.batchBadge}><Text style={styles.batchBadgeText}>{company.batch}</Text></View>}
        <MaterialIcons name="chevron-right" size={18} color="rgba(100,116,139,0.4)" />
      </View>
      {company.description ? <Text style={styles.companyDescription} numberOfLines={2}>{company.description}</Text> : null}
      <View style={styles.companyTagsRow}>
        {company.industry && <View style={styles.companyTag}><Text style={styles.companyTagText}>{company.industry}</Text></View>}
        {company.fundingStage && (
          <View style={[styles.companyTag, { borderColor: `${stageColor}44`, backgroundColor: `${stageColor}11` }]}>
            <Text style={[styles.companyTagText, { color: stageColor }]}>{company.fundingStage.replace(/_/g, ' ')}</Text>
          </View>
        )}
        {company.funding && (
          <View style={styles.companyTag}>
            <MaterialIcons name="attach-money" size={10} color="rgba(34,211,238,0.7)" />
            <Text style={[styles.companyTagText, { color: 'rgba(34,211,238,0.85)' }]}>{company.funding}</Text>
          </View>
        )}
        {company.employeeCount && (
          <View style={styles.companyTag}>
            <MaterialIcons name="people-outline" size={10} color="rgba(148,163,184,0.5)" />
            <Text style={styles.companyTagText}>{company.employeeCount} emp.</Text>
          </View>
        )}
      </View>
      <View style={styles.companyActions}>
        <Pressable style={styles.coldEmailBtn} onPress={onEmailPress}>
          <MaterialIcons name="mail-outline" size={14} color="#A78BFA" />
          <Text style={styles.coldEmailBtnText}>Send Cold Email</Text>
        </Pressable>
        {(company.website || company.sourceUrl) && (
          <Pressable style={styles.visitBtn} onPress={() => Linking.openURL(company.website ?? company.sourceUrl).catch(() => {})}>
            <MaterialIcons name="open-in-new" size={14} color="rgba(148,163,184,0.6)" />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

// ─── Companies tab ────────────────────────────────────────────────────────────
type CompanyType = 'startups' | 'mid-size' | 'enterprise';

const COMPANY_TABS: {
  key: CompanyType;
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}[] = [
  { key: 'startups', label: 'Startups', icon: 'rocket-launch', color: '#8B5CF6' },
  { key: 'mid-size', label: 'Mid-size', icon: 'business', color: '#22D3EE' },
  { key: 'enterprise', label: 'Enterprise', icon: 'domain', color: '#F59E0B' },
];

const COMPANY_PAGE_SIZE = 10;

function CompaniesTab() {
  const [activeType, setActiveType] = useState<CompanyType>('startups');
  const [companies, setCompanies] = useState<ScrapedCompany[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<ScrapedCompany | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [emailVisible, setEmailVisible] = useState(false);

  const fetchPage = useCallback(async (type: CompanyType, pageNum: number, append: boolean) => {
    if (pageNum === 1) setLoading(true); else setLoadingMore(true);
    setError(null);
    try {
      const params = { limit: COMPANY_PAGE_SIZE, page: pageNum };
      let result: ScrapedCompany[];
      if (type === 'startups') result = await fetchStartups(params);
      else if (type === 'mid-size') result = await fetchMidSizeCompanies(params);
      else result = await fetchEnterpriseCompanies(params);
      setCompanies(prev => append ? [...prev, ...result] : result);
      setHasMore(result.length === COMPANY_PAGE_SIZE);
      setPage(pageNum);
    } catch {
      setError('Could not load companies. Check your connection or backend.');
      if (!append) setCompanies([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setCompanies([]); setPage(1); setHasMore(true);
    fetchPage(activeType, 1, false);
  }, [activeType]);

  const activeTabInfo = COMPANY_TABS.find(t => t.key === activeType)!;

  return (
    <>
      <View style={styles.companyTabBar}>
        {COMPANY_TABS.map(tab => {
          const active = tab.key === activeType;
          return (
            <Pressable key={tab.key} style={[styles.companyTab, active && { borderBottomColor: tab.color, borderBottomWidth: 2 }]} onPress={() => setActiveType(tab.key)}>
              <MaterialIcons name={tab.icon} size={14} color={active ? tab.color : 'rgba(100,116,139,0.55)'} />
              <Text style={[styles.companyTabText, active && { color: tab.color }]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.companiesSectionHeader}>
        <Text style={styles.companiesSectionTitle}>{activeTabInfo.label}</Text>
        <Text style={styles.companiesSectionSub}>
          {activeType === 'startups' && 'Seed to Series B — tap to view & send cold email'}
          {activeType === 'mid-size' && '50–500 employees — growing fast'}
          {activeType === 'enterprise' && 'Fortune 500 & Global 2000'}
        </Text>
      </View>
      <View style={styles.companiesList}>
        {loading && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={activeTabInfo.color} />
            <Text style={styles.loadingText}>Fetching companies...</Text>
          </View>
        )}
        {!loading && error && (
          <View style={styles.errorWrap}>
            <MaterialIcons name="cloud-off" size={40} color="rgba(100,116,139,0.35)" />
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryBtn} onPress={() => fetchPage(activeType, 1, false)}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </Pressable>
          </View>
        )}
        {!loading && !error && companies.length === 0 && (
          <View style={styles.errorWrap}>
            <MaterialIcons name="search-off" size={40} color="rgba(100,116,139,0.35)" />
            <Text style={styles.errorText}>No companies found</Text>
          </View>
        )}
        {!loading && !error && companies.map((company, i) => (
          <CompanyCard
            key={`${company.name}-${i}`}
            company={company}
            onPress={() => { setSelectedCompany(company); setDetailVisible(true); }}
            onEmailPress={() => { setSelectedCompany(company); setEmailVisible(true); }}
          />
        ))}
        {!loading && !error && companies.length > 0 && (
          <View style={styles.loadMoreWrap}>
            {loadingMore ? (
              <ActivityIndicator size="small" color={activeTabInfo.color} />
            ) : hasMore ? (
              <Pressable style={[styles.loadMoreBtn, { borderColor: `${activeTabInfo.color}40` }]} onPress={() => fetchPage(activeType, page + 1, true)}>
                <Text style={[styles.loadMoreBtnText, { color: activeTabInfo.color }]}>Load More</Text>
                <MaterialIcons name="expand-more" size={14} color={activeTabInfo.color} />
              </Pressable>
            ) : (
              <Text style={styles.endOfListText}>All companies loaded</Text>
            )}
          </View>
        )}
      </View>
      <CompanyDetailModal
        company={selectedCompany}
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        onSendEmail={() => { setDetailVisible(false); setTimeout(() => setEmailVisible(true), 300); }}
      />
      <ColdEmailComposer
        company={selectedCompany}
        visible={emailVisible}
        onClose={() => setEmailVisible(false)}
      />
    </>
  );
}

// ─── Jobs tab ─────────────────────────────────────────────────────────────────
function JobsTab({
  onRegisterLoadMore,
}: {
  onRegisterLoadMore: (fn: () => void) => void;
}) {
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [regionIdx, setRegionIdx] = useState(0);
  const REGIONS = ['All Regions', 'North America', 'Europe', 'Asia'];
  const [expIdx, setExpIdx] = useState(0);
  const EXP = ['All Levels', 'Junior', 'Mid-Level', 'Senior'];

  // All jobs fetched from backend (can be 100–500+)
  const [allJobs, setAllJobs] = useState<ApiJob[]>([]);
  // How many to actually show (grows with scroll)
  const [displayCount, setDisplayCount] = useState(DISPLAY_CHUNK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [sourceMeta, setSourceMeta] = useState<Record<string, { count: number; success: boolean }>>({});

  const filterOp = useRef(new Animated.Value(0)).current;
  const filterY = useRef(new Animated.Value(12)).current;

  // Filtered slice shown to user
  const filteredJobs = useMemo(() => {
    let result = allJobs;
    if (remoteOnly) result = result.filter(j => j.remote);
    if (regionIdx !== 0) {
      const region = REGIONS[regionIdx].toLowerCase();
      result = result.filter(j => j.location?.toLowerCase().includes(region));
    }
    return result;
  }, [allJobs, remoteOnly, regionIdx]);

  const displayedJobs = useMemo(
    () => filteredJobs.slice(0, displayCount),
    [filteredJobs, displayCount]
  );

  const hasMore = displayCount < filteredJobs.length;

  // Register load-more with parent for scroll detection
  const loadMore = useCallback(() => {
    if (displayCount < filteredJobs.length) {
      setDisplayCount(c => c + DISPLAY_CHUNK);
    }
  }, [displayCount, filteredJobs.length]);

  useEffect(() => {
    onRegisterLoadMore(loadMore);
  }, [loadMore, onRegisterLoadMore]);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(false);
    setAllJobs([]);
    setDisplayCount(DISPLAY_CHUNK);
    try {
      const res = await fetchLiveJobs({ limit: SCRAPE_LIMIT });
      setAllJobs(res.jobs ?? []);
      setSourceMeta(res.meta?.sources ?? {});
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(filterY, { toValue: 0, useNativeDriver: true, tension: 60, friction: 12 }),
      Animated.timing(filterOp, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
    loadJobs();
  }, []);

  const successfulSources = useMemo(
    () => Object.entries(sourceMeta).filter(([, v]) => v.success && v.count > 0),
    [sourceMeta]
  );

  return (
    <>
      {/* Hero */}
      <View style={styles.heroSection}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heroTitle}>Live Jobs</Text>
          <Text style={styles.heroSub}>
            {loading
              ? 'Scraping job boards...'
              : allJobs.length > 0
              ? `${allJobs.length} jobs from ${successfulSources.length} sources`
              : 'Real-time jobs from across the web'}
          </Text>
        </View>
        {allJobs.length > 0 && (
          <View style={styles.matchBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.matchBadgeText}>Live</Text>
          </View>
        )}
      </View>

      {/* Source chips */}
      {!loading && successfulSources.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sourceChipsRow}
        >
          {successfulSources.map(([source, meta]) => {
            const color = SOURCE_COLORS[source] ?? '#6366F1';
            return (
              <View key={source} style={[styles.sourceChip, { borderColor: `${color}40`, backgroundColor: `${color}12` }]}>
                <View style={[styles.sourceChipDot, { backgroundColor: color }]} />
                <Text style={[styles.sourceChipText, { color }]}>{source}</Text>
                <Text style={styles.sourceChipCount}>{meta.count}</Text>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Filters */}
      <Animated.View style={[styles.filterBar, { opacity: filterOp, transform: [{ translateY: filterY }] }]}>
        <Pressable style={styles.filterChip} onPress={() => setRegionIdx(i => (i + 1) % REGIONS.length)}>
          <MaterialIcons name="public" size={14} color="rgba(100,116,139,0.7)" />
          <Text style={styles.filterChipText} numberOfLines={1}>{REGIONS[regionIdx]}</Text>
          <MaterialIcons name="expand-more" size={14} color="rgba(100,116,139,0.6)" />
        </Pressable>
        <Pressable style={styles.filterChip} onPress={() => setExpIdx(i => (i + 1) % EXP.length)}>
          <MaterialIcons name="stars" size={14} color="rgba(100,116,139,0.7)" />
          <Text style={styles.filterChipText} numberOfLines={1}>{EXP[expIdx]}</Text>
          <MaterialIcons name="expand-more" size={14} color="rgba(100,116,139,0.6)" />
        </Pressable>
        <RemoteToggle on={remoteOnly} onToggle={() => setRemoteOnly(v => !v)} />
        <Pressable style={styles.resetBtn} onPress={() => { setRegionIdx(0); setExpIdx(0); setRemoteOnly(false); }}>
          <Text style={styles.resetBtnText}>Reset</Text>
        </Pressable>
      </Animated.View>

      {/* Job cards */}
      <View style={styles.jobsList}>
        {/* Skeleton loading */}
        {loading && [1, 2, 3, 4].map(i => <JobSkeletonCard key={i} />)}

        {/* Error */}
        {!loading && error && (
          <View style={styles.errorWrap}>
            <MaterialIcons name="cloud-off" size={40} color="rgba(100,116,139,0.35)" />
            <Text style={styles.errorText}>Backend not reachable.{'\n'}Start your server at {'{'}EXPO_PUBLIC_API_URL{'}'}.</Text>
            <Pressable style={styles.retryBtn} onPress={loadJobs}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {/* Empty */}
        {!loading && !error && allJobs.length === 0 && (
          <View style={styles.errorWrap}>
            <MaterialIcons name="inbox" size={40} color="rgba(100,116,139,0.35)" />
            <Text style={styles.errorText}>No jobs returned from scrapers.</Text>
            <Pressable style={styles.retryBtn} onPress={loadJobs}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {/* No results after filter */}
        {!loading && !error && allJobs.length > 0 && filteredJobs.length === 0 && (
          <View style={styles.errorWrap}>
            <MaterialIcons name="search-off" size={40} color="rgba(100,116,139,0.35)" />
            <Text style={styles.errorText}>No jobs match these filters.</Text>
          </View>
        )}

        {/* Real job cards */}
        {displayedJobs.map(job => <JobCard key={job.id} job={job} />)}

        {/* Scroll footer */}
        {!loading && displayedJobs.length > 0 && (
          <View style={styles.loadMoreWrap}>
            {hasMore ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <ActivityIndicator size="small" color="rgba(99,102,241,0.5)" />
                <Text style={styles.loadingText}>Scroll for more jobs…</Text>
              </View>
            ) : (
              <Text style={styles.endOfListText}>
                All {filteredJobs.length} jobs shown
              </Text>
            )}
          </View>
        )}
      </View>
    </>
  );
}

// ─── MarketplaceScreen ────────────────────────────────────────────────────────
type MainTab = 'jobs' | 'companies';

export default function MarketplaceScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<MainTab>('jobs');

  const orb1Op   = useRef(new Animated.Value(0.07)).current;
  const orb2Op   = useRef(new Animated.Value(0.05)).current;
  const headerOp = useRef(new Animated.Value(0)).current;

  // Jobs infinite scroll: JobsTab registers its load-more fn here
  const loadMoreRef = useRef<() => void>(() => {});
  const isNearBottomRef = useRef(false);

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (activeTab !== 'jobs') return;
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
    const nearBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 350;
    if (nearBottom && !isNearBottomRef.current) {
      isNearBottomRef.current = true;
      loadMoreRef.current();
    } else if (!nearBottom) {
      isNearBottomRef.current = false;
    }
  }, [activeTab]);

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(orb1Op, { toValue: 0.13, duration: 3800, useNativeDriver: true }),
      Animated.timing(orb1Op, { toValue: 0.05, duration: 3800, useNativeDriver: true }),
    ])).start();
    setTimeout(() => {
      Animated.loop(Animated.sequence([
        Animated.timing(orb2Op, { toValue: 0.10, duration: 3000, useNativeDriver: true }),
        Animated.timing(orb2Op, { toValue: 0.03, duration: 3000, useNativeDriver: true }),
      ])).start();
    }, 1500);
    Animated.timing(headerOp, { toValue: 1, duration: 280, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Animated.View style={[styles.orb1, { opacity: orb1Op }]} />
      <Animated.View style={[styles.orb2, { opacity: orb2Op }]} />

      <View style={{ flex: 1 }}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: headerOp }]}>
          <Text style={styles.headerBrand}>
            Hire<Text style={styles.headerBrandAccent}>lith</Text>
          </Text>
          <View style={styles.headerActions}>
            <Pressable style={styles.headerBtn} onPress={() => navigation.navigate('Notifications')}>
              <MaterialIcons name="notifications-none" size={20} color="rgba(148,163,184,0.7)" />
              <View style={styles.notifDot} />
            </Pressable>
            <Pressable style={styles.headerBtn} onPress={() => Alert.alert('AI Career Copilot', 'Get personalized job recommendations and resume tips.\n\nFull AI chat coming soon!')}>
              <MaterialIcons name="smart-toy" size={18} color="#A78BFA" />
            </Pressable>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>A</Text>
            </View>
          </View>
        </Animated.View>

        {/* Main tabs */}
        <View style={styles.mainTabBar}>
          {(['jobs', 'companies'] as MainTab[]).map(tab => {
            const active = tab === activeTab;
            return (
              <Pressable
                key={tab}
                style={[styles.mainTab, active && styles.mainTabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <MaterialIcons
                  name={tab === 'jobs' ? 'work' : 'domain'}
                  size={16}
                  color={active ? '#0B0F1A' : 'rgba(148,163,184,0.6)'}
                />
                <Text style={[styles.mainTabText, active && styles.mainTabTextActive]}>
                  {tab === 'jobs' ? 'Jobs' : 'Companies'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={200}
        >
          {activeTab === 'jobs' ? (
            <JobsTab onRegisterLoadMore={(fn) => { loadMoreRef.current = fn; }} />
          ) : (
            <CompaniesTab />
          )}
        </ScrollView>

        <BottomNavBar activeTab="marketplace" activeColor="#22D3EE" activeBg="rgba(34,211,238,0.12)" />
      </View>
    </View>
  );
}
