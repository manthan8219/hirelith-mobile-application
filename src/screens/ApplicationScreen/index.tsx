import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Animated,
  Platform,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import { styles } from './ApplicationScreen.styles';

type AppRoute = RouteProp<RootStackParamList, 'Application'>;
type AppNav = NativeStackNavigationProp<RootStackParamList>;

// ── Spinner ─────────────────────────────────────────────────────────────────
function Spinner({ light = false }: { light?: boolean }) {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 700, useNativeDriver: true })
    ).start();
  }, []);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <Animated.View
      style={[styles.spinnerRing, light && styles.spinnerRingLight, { transform: [{ rotate }] }]}
    />
  );
}

// ── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      speed: 20,
      bounciness: 6,
    }).start();
  }, [value]);
  const thumbX = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 22] });
  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(100,116,139,0.3)', 'rgba(34,211,238,0.7)'],
  });
  return (
    <Pressable onPress={() => onChange(!value)} hitSlop={8}>
      <Animated.View style={[styles.toggleTrack, { backgroundColor: trackColor }]}>
        <Animated.View style={[styles.toggleThumb, { transform: [{ translateX: thumbX }] }]} />
      </Animated.View>
    </Pressable>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────
export default function ApplicationScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<AppNav>();
  const route = useRoute<AppRoute>();
  const params = route.params ?? {} as RootStackParamList['Application'];
  const { jobTitle = 'Product Designer', company = 'Company', location = 'Remote', salary = 'Competitive', matchScore = 90, accentColor = '#22D3EE', iconName = 'work' } = params;

  const [companyField, setCompanyField] = useState(company);
  const [roleField, setRoleField] = useState(jobTitle);
  const [tone, setTone] = useState<'formal' | 'friendly' | 'confident'>('confident');
  const [tailoringOn, setTailoringOn] = useState(true);
  const [manualEdit, setManualEdit] = useState(false);

  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateDone, setUpdateDone] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [copyDone, setCopyDone] = useState(false);
  const [finalizeState, setFinalizeState] = useState<'idle' | 'loading' | 'success'>('idle');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, speed: 16, bounciness: 3 }),
    ]).start();
  }, []);

  const [letterText, setLetterText] = useState(`Dear Hiring Team at ${company},

I am writing to express my strong interest in the ${jobTitle} position. With my background in advanced system architecture and AI integration, I believe I am uniquely positioned to contribute to your team's mission.

My experience spans designing high-throughput distributed systems, leading cross-functional engineering teams, and shipping products used by millions. I'm particularly excited by ${company}'s work at the frontier of human-computer interaction.

I would welcome the opportunity to discuss how my skills align with your needs.

Best regards,
Alex Rivera`);

  function handleUpdateDraft() {
    if (updateLoading) return;
    setUpdateLoading(true);
    setUpdateDone(false);
    setTimeout(() => {
      setUpdateLoading(false);
      setUpdateDone(true);
      setTimeout(() => setUpdateDone(false), 2000);
    }, 1600);
  }

  function handleRefresh() {
    if (refreshLoading) return;
    setRefreshLoading(true);
    setTimeout(() => setRefreshLoading(false), 1500);
  }

  async function handleCopy() {
    if (copyDone) return;
    try {
      await Share.share({ message: letterText, title: `Cover Letter — ${jobTitle} at ${company}` });
    } catch {
      // share cancelled or not supported — silent
    }
    setCopyDone(true);
    setTimeout(() => setCopyDone(false), 1800);
  }

  function handleFinalize() {
    if (finalizeState !== 'idle') return;
    setFinalizeState('loading');
    setTimeout(() => {
      setFinalizeState('success');
      setTimeout(() => setFinalizeState('idle'), 3000);
    }, 2500);
  }

  const TONES: { id: 'formal' | 'friendly' | 'confident'; label: string; color: string }[] = [
    { id: 'formal',    label: 'Formal',    color: '#818CF8' },
    { id: 'friendly',  label: 'Friendly',  color: '#34D399' },
    { id: 'confident', label: 'Confident', color: '#F59E0B' },
  ];

  const SKILL_TAGS = ['Python', 'ML Ops', 'System Design', 'Leadership', 'AWS'];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Orbs — behind everything */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={[styles.orb1, { opacity: 0.06 }]} />
        <View style={[styles.orb2, { opacity: 0.05 }]} />
      </View>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)', borderless: true } : undefined}
          hitSlop={8}
        >
          <MaterialIcons name="arrow-back" size={20} color="rgba(226,232,240,0.8)" />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>Optimize &amp; Apply</Text>
          <Text style={styles.headerSub} numberOfLines={1}>{company} · {jobTitle}</Text>
        </View>
        <Pressable
          style={styles.headerSaveBtn}
          onPress={() => Alert.alert('Draft Saved', 'Your application draft has been saved.')}
          android_ripple={Platform.OS === 'android' ? { color: 'rgba(99,102,241,0.2)' } : undefined}
        >
          <Text style={styles.headerSaveBtnText}>Save Draft</Text>
        </Pressable>
      </View>

      {/* ── Scrollable content ──────────────────────────────────────── */}
      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Job Info */}
        <View style={styles.jobInfoCard}>
          <LinearGradient
            colors={[accentColor + '99', 'rgba(0,0,0,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.jobInfoTopLine}
          />
          <View style={[styles.jobIconWrap, { borderColor: accentColor + '40' }]}>
            <MaterialIcons name={iconName as any} size={24} color={accentColor} />
          </View>
          <View style={styles.jobInfoContent}>
            <Text style={styles.jobInfoTitle} numberOfLines={1}>{jobTitle}</Text>
            <Text style={styles.jobInfoCompany} numberOfLines={1}>{company} · {location}</Text>
            <View style={styles.jobInfoBadges}>
              <View style={[styles.jobBadge, { backgroundColor: accentColor + '18', borderColor: accentColor + '40' }]}>
                <MaterialIcons name="verified" size={10} color={accentColor} />
                <Text style={[styles.jobBadgeText, { color: accentColor }]}>
                  HIGH MATCH {matchScore}%
                </Text>
              </View>
              <View style={[styles.jobBadge, { backgroundColor: 'rgba(34,197,94,0.12)', borderColor: 'rgba(34,197,94,0.3)' }]}>
                <MaterialIcons name="payments" size={10} color="#22C55E" />
                <Text style={[styles.jobBadgeText, { color: '#22C55E' }]}>{salary}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Email Composer */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Email Composer</Text>

          <Text style={styles.fieldLabel}>Company</Text>
          <TextInput
            style={styles.fieldInput}
            value={companyField}
            onChangeText={setCompanyField}
            placeholderTextColor="rgba(100,116,139,0.5)"
            selectionColor="#818CF8"
          />

          <Text style={styles.fieldLabel}>Role</Text>
          <TextInput
            style={styles.fieldInput}
            value={roleField}
            onChangeText={setRoleField}
            placeholderTextColor="rgba(100,116,139,0.5)"
            selectionColor="#818CF8"
          />

          <Text style={[styles.fieldLabel, { marginBottom: 10 }]}>Tone</Text>
          <View style={styles.toneRow}>
            {TONES.map(t => {
              const active = tone === t.id;
              return (
                <Pressable
                  key={t.id}
                  style={[
                    styles.toneBtn,
                    active && {
                      backgroundColor: t.color + '20',
                      borderColor: t.color + '55',
                    },
                  ]}
                  onPress={() => setTone(t.id)}
                  android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)' } : undefined}
                >
                  <Text style={[styles.toneBtnText, active && { color: t.color }]}>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            style={styles.updateDraftBtn}
            onPress={handleUpdateDraft}
            android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.1)' } : undefined}
          >
            <LinearGradient
              colors={updateDone ? ['#22C55E', '#16A34A'] : ['#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.updateDraftBtnInner}
            >
              {updateLoading ? (
                <Spinner light />
              ) : updateDone ? (
                <>
                  <MaterialIcons name="check-circle" size={16} color="white" />
                  <Text style={styles.updateDraftBtnText}>Draft Updated!</Text>
                </>
              ) : (
                <>
                  <MaterialIcons name="auto-fix-high" size={16} color="white" />
                  <Text style={styles.updateDraftBtnText}>Update Draft</Text>
                </>
              )}
            </LinearGradient>
          </Pressable>
        </View>

        {/* Resume Tailoring */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Resume Tailoring</Text>
          <View style={styles.tailoringRow}>
            <View style={styles.tailoringTextWrap}>
              <Text style={styles.tailoringLabel}>Auto-tailor resume</Text>
              <Text style={styles.tailoringSub}>Match skills to job requirements</Text>
            </View>
            <Toggle value={tailoringOn} onChange={setTailoringOn} />
          </View>
          {tailoringOn && (
            <View style={styles.skillTagsRow}>
              {SKILL_TAGS.map(skill => (
                <View key={skill} style={styles.skillTag}>
                  <View style={styles.skillTagsDot} />
                  <Text style={styles.skillTagText}>{skill}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Application Letter */}
        <View style={styles.sectionCard}>
          <View style={styles.letterHeader}>
            <View style={styles.letterHeaderLeft}>
              <Text style={styles.sectionTitle}>Application Letter</Text>
            </View>
            <View style={styles.letterActions}>
              <Pressable
                style={styles.letterActionBtn}
                onPress={handleCopy}
                hitSlop={8}
                android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)', borderless: true } : undefined}
              >
                <MaterialIcons
                  name={copyDone ? 'check' : 'content-copy'}
                  size={16}
                  color={copyDone ? '#22C55E' : 'rgba(226,232,240,0.7)'}
                />
              </Pressable>
              <Pressable
                style={styles.letterActionBtn}
                onPress={handleRefresh}
                hitSlop={8}
                android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)', borderless: true } : undefined}
              >
                {refreshLoading ? (
                  <Spinner />
                ) : (
                  <MaterialIcons name="refresh" size={16} color="rgba(226,232,240,0.7)" />
                )}
              </Pressable>
            </View>
          </View>

          <View style={styles.aiBadge}>
            <MaterialIcons name="auto-awesome" size={10} color="#818CF8" />
            <Text style={styles.aiBadgeText}>AI Optimized Draft</Text>
          </View>

          <View style={styles.letterBox}>
            {manualEdit ? (
              <TextInput
                style={styles.letterTextInput}
                value={letterText}
                onChangeText={setLetterText}
                multiline
                selectionColor="#818CF8"
                textAlignVertical="top"
                autoFocus
              />
            ) : (
              <Text style={styles.letterText}>{letterText}</Text>
            )}
          </View>

          <Pressable
            style={[styles.manualEditBtn, manualEdit && styles.manualEditBtnActive]}
            onPress={() => setManualEdit(v => !v)}
            android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)' } : undefined}
          >
            <MaterialIcons
              name={manualEdit ? 'lock-open' : 'edit'}
              size={14}
              color={manualEdit ? '#22D3EE' : 'rgba(148,163,184,0.7)'}
            />
            <Text style={[styles.manualEditBtnText, manualEdit && styles.manualEditBtnTextActive]}>
              {manualEdit ? 'Editing Mode On' : 'Manual Edit'}
            </Text>
          </Pressable>
        </View>

        {/* Analysis */}
        <View style={styles.analysisRow}>
          <View style={[styles.analysisCard, { borderColor: 'rgba(99,102,241,0.25)' }]}>
            <Text style={[styles.analysisCardTitle, { color: '#818CF8' }]}>AI Suggestion</Text>
            <Text style={styles.suggestionText}>
              <Text style={styles.suggestionBold}>Add "LLM fine-tuning" </Text>
              to your letter — this role requires it.
            </Text>
          </View>
          <View style={[styles.analysisCard, { borderColor: accentColor + '33' }]}>
            <Text style={[styles.analysisCardTitle, { color: accentColor }]}>Match Score</Text>
            <Text style={[styles.analysisCardValue, { color: accentColor }]}>{matchScore}</Text>
            <Text style={styles.analysisCardSub}>Out of 100{'\n'}Top 2% match</Text>
          </View>
        </View>

        {/* Finalize & Send */}
        <Pressable
          onPress={handleFinalize}
          android_ripple={Platform.OS === 'android' ? { color: 'rgba(0,0,0,0.1)' } : undefined}
        >
          <View
            style={[
              styles.finalizeBtn,
              finalizeState === 'loading' && styles.finalizeBtnLoading,
              finalizeState === 'success' && styles.finalizeBtnSuccess,
            ]}
          >
            {finalizeState === 'loading' ? (
              <>
                <Spinner />
                <Text style={styles.finalizeBtnText}>Sending Application...</Text>
              </>
            ) : finalizeState === 'success' ? (
              <>
                <MaterialIcons name="check-circle" size={22} color="white" />
                <Text style={[styles.finalizeBtnText, styles.finalizeBtnTextSuccess]}>
                  Application Sent!
                </Text>
              </>
            ) : (
              <>
                <MaterialIcons name="send" size={20} color="#0B0F1A" />
                <Text style={styles.finalizeBtnText}>Finalize &amp; Send Application</Text>
              </>
            )}
          </View>
        </Pressable>
      </Animated.ScrollView>
    </View>
  );
}
