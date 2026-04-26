import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import type { ParsedResume } from '../../types/resume';
import { api } from '../../services/api';
import { styles } from './ResumeReviewScreen.styles';

const { width } = Dimensions.get('window');
const PROGRESS_TRACK_WIDTH = width - 40;

// ─── Types ────────────────────────────────────────────────────────────────────

interface EditContact {
  fullName: string;
  email: string;
  phone: string;
  locationCity: string;
  locationState: string;
  locationCountry: string;
  linkedin: string;
  github: string;
  website: string;
}

interface EditExperience {
  _id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  highlightsText: string;
}

interface EditEducation {
  _id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface EditProject {
  _id: string;
  name: string;
  description: string;
  technologiesText: string;
  githubUrl: string;
}

interface EditCertification {
  _id: string;
  name: string;
  issuer: string;
  issueYear: string;
}

interface EditLanguage {
  _id: string;
  language: string;
  proficiency: string;
}

const uid = () => Math.random().toString(36).slice(2);

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  iconBg,
  title,
  onAdd,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  iconBg: string;
  title: string;
  onAdd?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderLeft}>
        <LinearGradient colors={[iconBg, iconBg + '80']} style={styles.sectionIconWrap}>
          <MaterialIcons name={icon} size={16} color="white" />
        </LinearGradient>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {onAdd && (
        <Pressable style={styles.addBtn} onPress={onAdd}>
          <MaterialIcons name="add" size={13} color="#cfbcff" />
          <Text style={styles.addBtnText}>Add</Text>
        </Pressable>
      )}
    </View>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: React.ComponentProps<typeof TextInput>['keyboardType'];
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, multiline && styles.fieldInputMultiline]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
        placeholderTextColor="rgba(255,255,255,0.2)"
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        keyboardType={keyboardType}
      />
    </View>
  );
}

// ─── ResumeReviewScreen ───────────────────────────────────────────────────────

type Props = NativeStackScreenProps<RootStackParamList, 'ResumeReview'>;

export default function ResumeReviewScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<Props['route']>();
  const { parsedResume, userId } = route.params;

  // ── Editable state ─────────────────────────────────────────────────────────
  const [contact, setContact] = useState<EditContact>({
    fullName: parsedResume.contact.fullName ?? '',
    email: parsedResume.contact.email ?? '',
    phone: parsedResume.contact.phone ?? '',
    locationCity: parsedResume.contact.location.city ?? '',
    locationState: parsedResume.contact.location.state ?? '',
    locationCountry: parsedResume.contact.location.country ?? '',
    linkedin: parsedResume.contact.profiles.linkedin ?? '',
    github: parsedResume.contact.profiles.github ?? '',
    website: parsedResume.contact.profiles.website ?? '',
  });

  const [headline, setHeadline] = useState(parsedResume.headline ?? '');
  const [summary, setSummary] = useState(parsedResume.summary ?? '');

  const [skills, setSkills] = useState<string[]>(parsedResume.skills.all);
  const [skillInput, setSkillInput] = useState('');

  const [experience, setExperience] = useState<EditExperience[]>(
    parsedResume.experience
      .filter(e => e.title?.trim() || e.company?.trim())
      .map(e => ({
        _id: uid(),
        title: e.title,
        company: e.company,
        startDate: e.startDate ?? '',
        endDate: e.endDate ?? '',
        current: e.current,
        location: e.location ?? '',
        highlightsText: e.highlights.join('\n'),
      }))
  );

  const [education, setEducation] = useState<EditEducation[]>(
    parsedResume.education
      .filter(e => e.institution?.trim())
      .map(e => ({
        _id: uid(),
        institution: e.institution,
        degree: e.degree ?? '',
        field: e.field ?? '',
        startDate: e.startDate ?? '',
        endDate: e.endDate ?? '',
        gpa: e.gpa ?? '',
      }))
  );

  const [projects, setProjects] = useState<EditProject[]>(
    parsedResume.projects
      .filter(p => p.name?.trim())
      .map(p => ({
        _id: uid(),
        name: p.name,
        description: p.description ?? '',
        technologiesText: p.technologies.join(', '),
        githubUrl: p.githubUrl ?? '',
      }))
  );

  const [certifications, setCertifications] = useState<EditCertification[]>(
    parsedResume.certifications
      .filter(c => c.name?.trim())
      .map(c => ({
        _id: uid(),
        name: c.name,
        issuer: c.issuer ?? '',
        issueYear: c.issueYear ?? '',
      }))
  );

  const [languages, setLanguages] = useState<EditLanguage[]>(
    parsedResume.languages
      .filter(l => l.language?.trim())
      .map(l => ({
        _id: uid(),
        language: l.language,
        proficiency: l.proficiency ?? '',
      }))
  );

  const [isSaving, setIsSaving] = useState(false);

  // ── Animations ─────────────────────────────────────────────────────────────
  const headerOp   = useRef(new Animated.Value(0)).current;
  const progressOp = useRef(new Animated.Value(0)).current;
  const progressFill = useRef(new Animated.Value(0)).current;
  const contentOp  = useRef(new Animated.Value(0)).current;
  const contentY   = useRef(new Animated.Value(20)).current;
  const btnScale   = useRef(new Animated.Value(1)).current;
  const shimmerX   = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerOp, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(progressOp, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(progressFill, { toValue: PROGRESS_TRACK_WIDTH * 0.75, duration: 700, useNativeDriver: false }),
      ]),
      Animated.parallel([
        Animated.spring(contentY, { toValue: 0, useNativeDriver: true, tension: 60, friction: 12 }),
        Animated.timing(contentOp, { toValue: 1, duration: 380, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  // ── Skill handlers ─────────────────────────────────────────────────────────
  const addSkill = useCallback(() => {
    const s = skillInput.trim();
    if (!s || skills.includes(s)) return;
    setSkills(prev => [...prev, s]);
    setSkillInput('');
  }, [skillInput, skills]);

  const removeSkill = useCallback((skill: string) => {
    setSkills(prev => prev.filter(s => s !== skill));
  }, []);

  // ── Array item updaters ────────────────────────────────────────────────────
  const updateExperience = useCallback((id: string, field: keyof EditExperience, value: string | boolean) => {
    setExperience(prev => prev.map(e => e._id === id ? { ...e, [field]: value } : e));
  }, []);

  const updateEducation = useCallback((id: string, field: keyof EditEducation, value: string) => {
    setEducation(prev => prev.map(e => e._id === id ? { ...e, [field]: value } : e));
  }, []);

  const updateProject = useCallback((id: string, field: keyof EditProject, value: string) => {
    setProjects(prev => prev.map(p => p._id === id ? { ...p, [field]: value } : p));
  }, []);

  const updateCert = useCallback((id: string, field: keyof EditCertification, value: string) => {
    setCertifications(prev => prev.map(c => c._id === id ? { ...c, [field]: value } : c));
  }, []);

  const updateLanguage = useCallback((id: string, field: keyof EditLanguage, value: string) => {
    setLanguages(prev => prev.map(l => l._id === id ? { ...l, [field]: value } : l));
  }, []);

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await api.post('/api/v1/resume/save', {
        userId,
        contact: {
          fullName: contact.fullName || null,
          firstName: contact.fullName.split(' ')[0] || null,
          lastName: contact.fullName.split(' ').slice(1).join(' ') || null,
          email: contact.email || null,
          phone: contact.phone || null,
          alternatePhone: null,
          location: {
            full: [contact.locationCity, contact.locationState, contact.locationCountry].filter(Boolean).join(', ') || null,
            city: contact.locationCity || null,
            state: contact.locationState || null,
            country: contact.locationCountry || null,
            zip: null,
          },
          profiles: {
            linkedin: contact.linkedin || null,
            github: contact.github || null,
            website: contact.website || null,
            twitter: null,
            stackoverflow: null,
            kaggle: null,
            behance: null,
            dribbble: null,
            medium: null,
          },
        },
        headline: headline || null,
        summary: summary || null,
        totalExperienceYears: null,
        skills: {
          all: skills,
          byCategory: {
            languages: parsedResume.skills.byCategory.languages,
            frameworks: parsedResume.skills.byCategory.frameworks,
            databases: parsedResume.skills.byCategory.databases,
            cloud: parsedResume.skills.byCategory.cloud,
            devops: parsedResume.skills.byCategory.devops,
            aiMl: parsedResume.skills.byCategory.aiMl,
            testing: parsedResume.skills.byCategory.testing,
            tools: parsedResume.skills.byCategory.tools,
            other: parsedResume.skills.byCategory.other,
          },
        },
        experience: experience.map(e => ({
          title: e.title,
          company: e.company,
          employmentType: null,
          location: e.location || null,
          remote: false,
          startDate: e.startDate || null,
          endDate: e.current ? null : (e.endDate || null),
          current: e.current,
          durationMonths: null,
          durationFormatted: null,
          description: null,
          highlights: e.highlightsText.split('\n').map(h => h.trim()).filter(Boolean),
          technologiesMentioned: [],
        })),
        education: education.map(e => ({
          institution: e.institution,
          degree: e.degree || null,
          field: e.field || null,
          startDate: e.startDate || null,
          endDate: e.endDate || null,
          durationYears: null,
          gpa: e.gpa || null,
          maxGpa: null,
          honors: null,
          courses: [],
          activities: [],
        })),
        certifications: certifications.map(c => ({
          name: c.name,
          issuer: c.issuer || null,
          issueYear: c.issueYear || null,
          expiryDate: null,
          credentialId: null,
          url: null,
        })),
        projects: projects.map(p => ({
          name: p.name,
          description: p.description || null,
          role: null,
          technologies: p.technologiesText.split(',').map(t => t.trim()).filter(Boolean),
          url: null,
          githubUrl: p.githubUrl || null,
          demoUrl: null,
          highlights: [],
        })),
        awards: [],
        languages: languages.map(l => ({
          language: l.language,
          proficiency: l.proficiency || null,
        })),
      });
      navigation.navigate('Onboarding4');
    } catch {
      Alert.alert('Error', 'Failed to save resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [userId, contact, headline, summary, skills, experience, education, certifications, projects, languages, parsedResume, navigation]);

  const handleBtnPressIn = useCallback(() => {
    Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true, tension: 300, friction: 8 }).start();
    shimmerX.setValue(-width);
    Animated.timing(shimmerX, { toValue: width * 1.5, duration: 900, useNativeDriver: true }).start();
  }, []);

  const handleBtnPressOut = useCallback(() => {
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 8 }).start();
  }, []);

  const confidencePct = Math.round((parsedResume.meta?.confidence ?? 0) * 100);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <SafeAreaView style={{ flex: 1 }}>

        {/* ── Header ── */}
        <Animated.View style={[styles.header, { opacity: headerOp }]}>
          <View style={styles.headerLeft}>
            <Pressable
              style={styles.headerIconBtn}
              onPress={() => navigation.goBack()}
              android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.1)', borderless: true } : undefined}
            >
              <MaterialIcons name="arrow-back" size={22} color="rgba(148,163,184,0.8)" />
            </Pressable>
            <Text style={styles.headerTitle}>Review Resume</Text>
          </View>
          <View style={styles.confidenceBadge}>
            <MaterialIcons name="auto-awesome" size={12} color="#cfbcff" />
            <Text style={styles.confidenceText}>{confidencePct}% parsed</Text>
          </View>
        </Animated.View>

        {/* ── Progress ── */}
        <Animated.View style={[styles.progressSection, { opacity: progressOp }]}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressStep}>Step 03 of 04</Text>
            <Text style={styles.progressLabel}>Review & Edit</Text>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View style={{ width: progressFill }}>
              <LinearGradient
                colors={['#6750A4', '#cfbcff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.progressFill}
              />
            </Animated.View>
          </View>
        </Animated.View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={{ opacity: contentOp, transform: [{ translateY: contentY }], gap: 16 }}>

            {/* ── Hero ── */}
            <View>
              <Text style={styles.heroTitle}>
                Your resume,{' '}
                <Text style={styles.heroAccent}>AI-extracted.</Text>
              </Text>
              <Text style={styles.heroSub}>
                Review and correct any fields below, then save to continue.
              </Text>
            </View>

            {/* ── Contact ── */}
            <View style={styles.sectionCard}>
              <SectionHeader icon="person" iconBg="rgba(103,80,164,0.6)" title="Contact Info" />
              <View style={styles.sectionBody}>
                <FieldInput label="Full Name" value={contact.fullName} onChange={v => setContact(c => ({ ...c, fullName: v }))} />
                <View style={styles.fieldRow}>
                  <View style={styles.fieldHalf}>
                    <FieldInput label="Email" value={contact.email} onChange={v => setContact(c => ({ ...c, email: v }))} keyboardType="email-address" />
                  </View>
                  <View style={styles.fieldHalf}>
                    <FieldInput label="Phone" value={contact.phone} onChange={v => setContact(c => ({ ...c, phone: v }))} keyboardType="phone-pad" />
                  </View>
                </View>
                <View style={styles.fieldRow}>
                  <View style={styles.fieldHalf}>
                    <FieldInput label="City" value={contact.locationCity} onChange={v => setContact(c => ({ ...c, locationCity: v }))} />
                  </View>
                  <View style={styles.fieldHalf}>
                    <FieldInput label="State" value={contact.locationState} onChange={v => setContact(c => ({ ...c, locationState: v }))} />
                  </View>
                </View>
                <FieldInput label="Country" value={contact.locationCountry} onChange={v => setContact(c => ({ ...c, locationCountry: v }))} />
                <FieldInput label="LinkedIn URL" value={contact.linkedin} onChange={v => setContact(c => ({ ...c, linkedin: v }))} placeholder="https://linkedin.com/in/..." />
                <FieldInput label="GitHub URL" value={contact.github} onChange={v => setContact(c => ({ ...c, github: v }))} placeholder="https://github.com/..." />
                <FieldInput label="Website" value={contact.website} onChange={v => setContact(c => ({ ...c, website: v }))} placeholder="https://..." />
              </View>
            </View>

            {/* ── Professional ── */}
            <View style={styles.sectionCard}>
              <SectionHeader icon="work" iconBg="rgba(201,167,77,0.6)" title="Professional" />
              <View style={styles.sectionBody}>
                <FieldInput label="Headline" value={headline} onChange={setHeadline} placeholder="e.g. Senior Software Engineer" />
                <FieldInput label="Summary" value={summary} onChange={setSummary} multiline placeholder="Brief professional summary..." />
              </View>
            </View>

            {/* ── Skills ── */}
            <View style={styles.sectionCard}>
              <SectionHeader icon="code" iconBg="rgba(52,211,153,0.5)" title="Skills" />
              <View style={styles.sectionBody}>
                {skills.length > 0 ? (
                  <View style={styles.chipsWrap}>
                    {skills.map(skill => (
                      <View key={skill} style={styles.chip}>
                        <Text style={styles.chipText}>{skill}</Text>
                        <Pressable style={styles.chipDelete} onPress={() => removeSkill(skill)}>
                          <MaterialIcons name="close" size={10} color="rgba(255,255,255,0.6)" />
                        </Pressable>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No skills detected yet</Text>
                  </View>
                )}
                <View style={styles.chipInputRow}>
                  <TextInput
                    style={styles.chipInput}
                    value={skillInput}
                    onChangeText={setSkillInput}
                    placeholder="Add a skill…"
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    onSubmitEditing={addSkill}
                    returnKeyType="done"
                  />
                  <Pressable style={styles.chipAddBtn} onPress={addSkill}>
                    <MaterialIcons name="add" size={18} color="#cfbcff" />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* ── Experience ── */}
            <View style={styles.sectionCard}>
              <SectionHeader
                icon="business-center"
                iconBg="rgba(99,179,237,0.5)"
                title="Experience"
                onAdd={() => setExperience(prev => [...prev, {
                  _id: uid(), title: '', company: '', startDate: '', endDate: '',
                  current: false, location: '', highlightsText: '',
                }])}
              />
              <View style={styles.sectionBody}>
                {experience.length === 0 && (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No experience detected</Text>
                  </View>
                )}
                {experience.map((exp, i) => (
                  <View key={exp._id} style={styles.itemCard}>
                    <View style={styles.itemCardHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemCardTitle} numberOfLines={1}>
                          {exp.title || 'Untitled Role'}{exp.company ? ` @ ${exp.company}` : ''}
                        </Text>
                        {(exp.startDate || exp.endDate) && (
                          <Text style={styles.itemCardSubtitle}>
                            {exp.startDate || '?'} – {exp.current ? 'Present' : (exp.endDate || '?')}
                          </Text>
                        )}
                      </View>
                      <Pressable style={styles.deleteBtn} onPress={() => setExperience(prev => prev.filter(e => e._id !== exp._id))}>
                        <MaterialIcons name="delete-outline" size={17} color="#ffb4ab" />
                      </Pressable>
                    </View>
                    <View style={styles.itemCardBody}>
                      <View style={styles.fieldRow}>
                        <View style={styles.fieldHalf}>
                          <FieldInput label="Job Title" value={exp.title} onChange={v => updateExperience(exp._id, 'title', v)} />
                        </View>
                        <View style={styles.fieldHalf}>
                          <FieldInput label="Company" value={exp.company} onChange={v => updateExperience(exp._id, 'company', v)} />
                        </View>
                      </View>
                      <View style={styles.fieldRow}>
                        <View style={styles.fieldHalf}>
                          <FieldInput label="Start Date" value={exp.startDate} onChange={v => updateExperience(exp._id, 'startDate', v)} placeholder="e.g. Jan 2022" />
                        </View>
                        <View style={styles.fieldHalf}>
                          <FieldInput label="End Date" value={exp.current ? 'Present' : exp.endDate} onChange={v => updateExperience(exp._id, 'endDate', v)} placeholder="e.g. Dec 2023" />
                        </View>
                      </View>
                      <View style={styles.currentToggle}>
                        <Switch
                          value={exp.current}
                          onValueChange={v => updateExperience(exp._id, 'current', v)}
                          trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(103,80,164,0.6)' }}
                          thumbColor={exp.current ? '#cfbcff' : 'rgba(255,255,255,0.4)'}
                        />
                        <Text style={styles.currentToggleText}>Currently working here</Text>
                      </View>
                      <FieldInput label="Location" value={exp.location} onChange={v => updateExperience(exp._id, 'location', v)} placeholder="City, Country" />
                      <FieldInput
                        label="Key Highlights (one per line)"
                        value={exp.highlightsText}
                        onChange={v => updateExperience(exp._id, 'highlightsText', v)}
                        multiline
                        placeholder="• Led a team of 5 engineers..."
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* ── Education ── */}
            <View style={styles.sectionCard}>
              <SectionHeader
                icon="school"
                iconBg="rgba(245,158,11,0.5)"
                title="Education"
                onAdd={() => setEducation(prev => [...prev, {
                  _id: uid(), institution: '', degree: '', field: '',
                  startDate: '', endDate: '', gpa: '',
                }])}
              />
              <View style={styles.sectionBody}>
                {education.length === 0 && (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No education detected</Text>
                  </View>
                )}
                {education.map(edu => (
                  <View key={edu._id} style={styles.itemCard}>
                    <View style={styles.itemCardHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemCardTitle} numberOfLines={1}>
                          {edu.institution || 'Institution'}
                        </Text>
                        {(edu.degree || edu.field) && (
                          <Text style={styles.itemCardSubtitle}>
                            {[edu.degree, edu.field].filter(Boolean).join(', ')}
                          </Text>
                        )}
                      </View>
                      <Pressable style={styles.deleteBtn} onPress={() => setEducation(prev => prev.filter(e => e._id !== edu._id))}>
                        <MaterialIcons name="delete-outline" size={17} color="#ffb4ab" />
                      </Pressable>
                    </View>
                    <View style={styles.itemCardBody}>
                      <FieldInput label="Institution" value={edu.institution} onChange={v => updateEducation(edu._id, 'institution', v)} />
                      <View style={styles.fieldRow}>
                        <View style={styles.fieldHalf}>
                          <FieldInput label="Degree" value={edu.degree} onChange={v => updateEducation(edu._id, 'degree', v)} placeholder="B.S., M.S., Ph.D." />
                        </View>
                        <View style={styles.fieldHalf}>
                          <FieldInput label="Field" value={edu.field} onChange={v => updateEducation(edu._id, 'field', v)} placeholder="Computer Science" />
                        </View>
                      </View>
                      <View style={styles.fieldRow}>
                        <View style={styles.fieldHalf}>
                          <FieldInput label="Start Year" value={edu.startDate} onChange={v => updateEducation(edu._id, 'startDate', v)} placeholder="2018" />
                        </View>
                        <View style={styles.fieldHalf}>
                          <FieldInput label="End Year" value={edu.endDate} onChange={v => updateEducation(edu._id, 'endDate', v)} placeholder="2022" />
                        </View>
                      </View>
                      <FieldInput label="GPA" value={edu.gpa} onChange={v => updateEducation(edu._id, 'gpa', v)} placeholder="3.8" keyboardType="decimal-pad" />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* ── Projects ── */}
            {(projects.length > 0) && (
              <View style={styles.sectionCard}>
                <SectionHeader
                  icon="rocket-launch"
                  iconBg="rgba(167,139,250,0.5)"
                  title="Projects"
                  onAdd={() => setProjects(prev => [...prev, {
                    _id: uid(), name: '', description: '', technologiesText: '', githubUrl: '',
                  }])}
                />
                <View style={styles.sectionBody}>
                  {projects.map(proj => (
                    <View key={proj._id} style={styles.itemCard}>
                      <View style={styles.itemCardHeader}>
                        <Text style={styles.itemCardTitle} numberOfLines={1}>
                          {proj.name || 'Untitled Project'}
                        </Text>
                        <Pressable style={styles.deleteBtn} onPress={() => setProjects(prev => prev.filter(p => p._id !== proj._id))}>
                          <MaterialIcons name="delete-outline" size={17} color="#ffb4ab" />
                        </Pressable>
                      </View>
                      <View style={styles.itemCardBody}>
                        <FieldInput label="Project Name" value={proj.name} onChange={v => updateProject(proj._id, 'name', v)} />
                        <FieldInput label="Description" value={proj.description} onChange={v => updateProject(proj._id, 'description', v)} multiline />
                        <FieldInput label="Technologies (comma-separated)" value={proj.technologiesText} onChange={v => updateProject(proj._id, 'technologiesText', v)} placeholder="React, Node.js, PostgreSQL" />
                        <FieldInput label="GitHub URL" value={proj.githubUrl} onChange={v => updateProject(proj._id, 'githubUrl', v)} placeholder="https://github.com/..." />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* ── Certifications ── */}
            {(certifications.length > 0) && (
              <View style={styles.sectionCard}>
                <SectionHeader
                  icon="verified"
                  iconBg="rgba(52,211,153,0.4)"
                  title="Certifications"
                  onAdd={() => setCertifications(prev => [...prev, {
                    _id: uid(), name: '', issuer: '', issueYear: '',
                  }])}
                />
                <View style={styles.sectionBody}>
                  {certifications.map(cert => (
                    <View key={cert._id} style={styles.itemCard}>
                      <View style={styles.itemCardHeader}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.itemCardTitle} numberOfLines={1}>{cert.name || 'Certification'}</Text>
                          {cert.issuer && <Text style={styles.itemCardSubtitle}>{cert.issuer}</Text>}
                        </View>
                        <Pressable style={styles.deleteBtn} onPress={() => setCertifications(prev => prev.filter(c => c._id !== cert._id))}>
                          <MaterialIcons name="delete-outline" size={17} color="#ffb4ab" />
                        </Pressable>
                      </View>
                      <View style={styles.itemCardBody}>
                        <FieldInput label="Certification Name" value={cert.name} onChange={v => updateCert(cert._id, 'name', v)} />
                        <View style={styles.fieldRow}>
                          <View style={styles.fieldHalf}>
                            <FieldInput label="Issuer" value={cert.issuer} onChange={v => updateCert(cert._id, 'issuer', v)} />
                          </View>
                          <View style={styles.fieldHalf}>
                            <FieldInput label="Year" value={cert.issueYear} onChange={v => updateCert(cert._id, 'issueYear', v)} keyboardType="number-pad" />
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* ── Languages ── */}
            {(languages.length > 0) && (
              <View style={styles.sectionCard}>
                <SectionHeader
                  icon="translate"
                  iconBg="rgba(251,146,60,0.5)"
                  title="Languages"
                  onAdd={() => setLanguages(prev => [...prev, { _id: uid(), language: '', proficiency: '' }])}
                />
                <View style={styles.sectionBody}>
                  {languages.map(lang => (
                    <View key={lang._id} style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
                      <View style={[styles.fieldHalf, { flex: 2 }]}>
                        <FieldInput label="Language" value={lang.language} onChange={v => updateLanguage(lang._id, 'language', v)} />
                      </View>
                      <View style={[styles.fieldHalf, { flex: 2 }]}>
                        <FieldInput label="Proficiency" value={lang.proficiency} onChange={v => updateLanguage(lang._id, 'proficiency', v)} placeholder="Fluent / Native" />
                      </View>
                      <Pressable style={[styles.deleteBtn, { marginBottom: 2 }]} onPress={() => setLanguages(prev => prev.filter(l => l._id !== lang._id))}>
                        <MaterialIcons name="delete-outline" size={17} color="#ffb4ab" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            )}

          </Animated.View>
        </ScrollView>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Animated.View style={[styles.saveBtn, { transform: [{ scale: btnScale }], opacity: isSaving ? 0.6 : 1 }]}>
            <Pressable
              onPressIn={handleBtnPressIn}
              onPressOut={handleBtnPressOut}
              onPress={handleSave}
              disabled={isSaving}
              style={{ borderRadius: 14, overflow: 'hidden' }}
              android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.1)' } : undefined}
            >
              <LinearGradient
                colors={['#6750A4', '#9C4DCC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveBtnGradient}
              >
                <Animated.View style={[
                  { position: 'absolute', top: 0, bottom: 0, width: 80, left: 0 },
                  { transform: [{ translateX: shimmerX }] },
                ]}>
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(255,255,255,0.25)', 'rgba(0,0,0,0)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ flex: 1 }}
                  />
                </Animated.View>
                {isSaving
                  ? <ActivityIndicator color="white" size="small" />
                  : <MaterialIcons name="check-circle-outline" size={18} color="white" />
                }
                <Text style={styles.saveBtnText}>{isSaving ? 'Saving…' : 'Save & Continue'}</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => navigation.navigate('Onboarding4')}
            activeOpacity={0.6}
            disabled={isSaving}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}
