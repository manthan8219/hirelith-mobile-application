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
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as DocumentPicker from 'expo-document-picker';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { RootStackParamList } from '../../types';
import type { ParsedResume } from '../../types/resume';
import { styles } from './Onboarding3Screen.styles';

const { width } = Dimensions.get('window');
const PROGRESS_TRACK_WIDTH = width - 40;

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

interface UploadResult {
  resumeUrl:     string;
  fileName:      string;
  fileSizeBytes: number;
  parsedResume:  ParsedResume;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

// ─── Onboarding3Screen ────────────────────────────────────────────────────────
export default function Onboarding3Screen() {
  const navigation    = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { backendUser, refreshBackendUser } = useAuth();

  // ── File + upload state ────────────────────────────────────────────────────
  const [hasFile,       setHasFile]       = useState(false);
  const [isUploading,   setIsUploading]   = useState(false);
  const [uploadResult,  setUploadResult]  = useState<UploadResult | null>(null);
  const [uploadError,   setUploadError]   = useState('');
  const [pickedName,    setPickedName]    = useState('');
  const [pickedSize,    setPickedSize]    = useState(0);

  const dropzoneAnim   = useRef(new Animated.Value(1)).current;
  const dropzoneScale  = useRef(new Animated.Value(1)).current;
  const previewAnim    = useRef(new Animated.Value(0)).current;
  const previewY       = useRef(new Animated.Value(10)).current;
  const selectBtnScale = useRef(new Animated.Value(1)).current;

  const showFilePreview = useCallback(() => {
    Animated.parallel([
      Animated.timing(dropzoneAnim,  { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.spring(dropzoneScale, { toValue: 0.96, useNativeDriver: true, tension: 200, friction: 8 }),
    ]).start(() => {
      setHasFile(true);
      Animated.parallel([
        Animated.timing(previewAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(previewY,    { toValue: 0, useNativeDriver: true, tension: 65, friction: 12 }),
      ]).start();
    });
  }, []);

  const handleRemoveFile = useCallback(() => {
    Animated.parallel([
      Animated.timing(previewAnim,   { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.spring(dropzoneScale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 8 }),
    ]).start(() => {
      setHasFile(false);
      setUploadResult(null);
      setUploadError('');
      setPickedName('');
      setPickedSize(0);
      previewY.setValue(10);
      Animated.timing(dropzoneAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    });
  }, []);

  const handleSelectFile = useCallback(async () => {
    Animated.sequence([
      Animated.spring(selectBtnScale, { toValue: 0.94, useNativeDriver: true, tension: 300, friction: 8 }),
      Animated.spring(selectBtnScale, { toValue: 1,    useNativeDriver: true, tension: 300, friction: 8 }),
    ]).start();

    let result: DocumentPicker.DocumentPickerResult;
    try {
      result = await DocumentPicker.getDocumentAsync({
        type: ALLOWED_MIME_TYPES,
        copyToCacheDirectory: true,
      });
    } catch {
      Alert.alert('Error', 'Could not open file picker. Please try again.');
      return;
    }

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];

    if (asset.size && asset.size > 10 * 1024 * 1024) {
      Alert.alert('File too large', 'Resume must be under 10 MB.');
      return;
    }

    setPickedName(asset.name);
    setPickedSize(asset.size ?? 0);
    setUploadError('');
    showFilePreview();

    const user = backendUser ?? await refreshBackendUser();
    if (!user) {
      setUploadError('Could not reach server. Check your connection and try again.');
      return;
    }

    // Build multipart form
    const formData = new FormData();
    formData.append('file', {
      uri:  asset.uri,
      name: asset.name,
      type: asset.mimeType ?? 'application/pdf',
    } as unknown as Blob);
    formData.append('userId', user.id);

    setIsUploading(true);
    try {
      const res = await api.uploadFile<UploadResult>('/api/v1/resume/upload-and-parse', formData);
      setUploadResult(res);
      // Strip rawText (can be large) before passing through navigation
      const { rawText: _raw, ...resumeWithoutRaw } = res.parsedResume;
      navigation.navigate('ResumeReview', {
        parsedResume: resumeWithoutRaw as ParsedResume,
        userId: user.id,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed.';
      setUploadError(`Upload failed: ${msg}`);
    } finally {
      setIsUploading(false);
    }
  }, [backendUser, refreshBackendUser, showFilePreview]);

  // ── Entrance animated values ──────────────────────────────────────────────
  const orb1Opacity   = useRef(new Animated.Value(0.07)).current;
  const orb2Opacity   = useRef(new Animated.Value(0.05)).current;
  const headerOp      = useRef(new Animated.Value(0)).current;
  const progressOp    = useRef(new Animated.Value(0)).current;
  const progressFill  = useRef(new Animated.Value(0)).current;
  const heroY         = useRef(new Animated.Value(24)).current;
  const heroOp        = useRef(new Animated.Value(0)).current;
  const featureCardOp = useRef([new Animated.Value(0), new Animated.Value(0)]).current;
  const featureCardY  = useRef([new Animated.Value(16), new Animated.Value(16)]).current;
  const uploadCardOp  = useRef(new Animated.Value(0)).current;
  const uploadCardY   = useRef(new Animated.Value(24)).current;
  const footerOp      = useRef(new Animated.Value(0)).current;
  const btnScale      = useRef(new Animated.Value(1)).current;
  const shimmerX      = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerOp, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(progressOp,   { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(progressFill, { toValue: PROGRESS_TRACK_WIDTH * 0.75, duration: 700, useNativeDriver: false }),
      ]),
      Animated.parallel([
        Animated.spring(heroY, { toValue: 0, useNativeDriver: true, tension: 60, friction: 12 }),
        Animated.timing(heroOp, { toValue: 1, duration: 380, useNativeDriver: true }),
      ]),
      Animated.stagger(100, [
        Animated.parallel([
          Animated.spring(featureCardY[0], { toValue: 0, useNativeDriver: true, tension: 65, friction: 12 }),
          Animated.timing(featureCardOp[0], { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.spring(featureCardY[1], { toValue: 0, useNativeDriver: true, tension: 65, friction: 12 }),
          Animated.timing(featureCardOp[1], { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
      ]),
      Animated.parallel([
        Animated.spring(uploadCardY, { toValue: 0, useNativeDriver: true, tension: 55, friction: 12 }),
        Animated.timing(uploadCardOp, { toValue: 1, duration: 380, useNativeDriver: true }),
      ]),
      Animated.timing(footerOp, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(orb1Opacity, { toValue: 0.14, duration: 3500, useNativeDriver: true }),
        Animated.timing(orb1Opacity, { toValue: 0.05, duration: 3500, useNativeDriver: true }),
      ])
    ).start();
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(orb2Opacity, { toValue: 0.09, duration: 2800, useNativeDriver: true }),
          Animated.timing(orb2Opacity, { toValue: 0.03, duration: 2800, useNativeDriver: true }),
        ])
      ).start();
    }, 1600);
  }, []);

  const handleBtnPressIn = useCallback(() => {
    Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true, tension: 300, friction: 8 }).start();
    shimmerX.setValue(-width);
    Animated.timing(shimmerX, { toValue: width * 1.5, duration: 900, useNativeDriver: true }).start();
  }, []);

  const handleBtnPressOut = useCallback(() => {
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 8 }).start();
  }, []);

  const handleContinue = useCallback(() => {
    if (isUploading) return;
    navigation.navigate('Onboarding4');
  }, [isUploading, navigation]);

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
              <Text style={styles.progressStep}>Step 03 of 04</Text>
              <Text style={styles.progressLabel}>Resume</Text>
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

          {/* ── Hero ── */}
          <Animated.View style={[styles.heroSection, { opacity: heroOp, transform: [{ translateY: heroY }] }]}>
            <Text style={styles.heroTitle}>
              Power your profile with{'\n'}
              <Text style={styles.heroAccent}>Career Intelligence.</Text>
            </Text>
            <Text style={styles.heroSub}>
              Upload your resume to let our AI analyze your expertise and match you with premium global opportunities instantly.
            </Text>
          </Animated.View>

          {/* ── Feature cards ── */}
          <View style={styles.featureCards}>
            <Animated.View style={[styles.featureCard, { opacity: featureCardOp[0], transform: [{ translateY: featureCardY[0] }] }]}>
              <LinearGradient colors={['rgba(103,80,164,0.25)', 'rgba(103,80,164,0.1)']} style={styles.featureIconWrap}>
                <MaterialIcons name="auto-awesome" size={18} color="#cfbcff" />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>AI Extraction</Text>
                <Text style={styles.featureSub}>We'll auto-fill your profile details.</Text>
              </View>
            </Animated.View>

            <Animated.View style={[styles.featureCard, { opacity: featureCardOp[1], transform: [{ translateY: featureCardY[1] }] }]}>
              <LinearGradient colors={['rgba(201,167,77,0.2)', 'rgba(201,167,77,0.08)']} style={styles.featureIconWrap}>
                <MaterialIcons name="security" size={18} color="#e7c365" />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>Privacy First</Text>
                <Text style={styles.featureSub}>Your data is encrypted and secure.</Text>
              </View>
            </Animated.View>
          </View>

          {/* ── Upload card ── */}
          <Animated.View style={[styles.uploadCard, { opacity: uploadCardOp, transform: [{ translateY: uploadCardY }] }]}>

            {/* Dropzone */}
            {!hasFile && (
              <Animated.View style={{ opacity: dropzoneAnim, transform: [{ scale: dropzoneScale }] }}>
                <View style={styles.dropzone}>
                  <View style={styles.dropzoneIconWrap}>
                    <Animated.View style={[styles.dropzoneIconGlow, { transform: [{ scale: dropzoneAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] }]} />
                    <View style={styles.dropzoneIconInner}>
                      <MaterialIcons name="cloud-upload" size={34} color="#cfbcff" />
                    </View>
                  </View>

                  <Text style={styles.dropzoneTitle}>Drop your resume here</Text>
                  <Text style={styles.dropzoneSub}>PDF or DOCX, up to 10 MB</Text>

                  <Animated.View style={{ transform: [{ scale: selectBtnScale }] }}>
                    <Pressable
                      style={styles.selectFileBtn}
                      onPress={handleSelectFile}
                      android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.1)' } : undefined}
                    >
                      <Text style={styles.selectFileBtnText}>Select File</Text>
                    </Pressable>
                  </Animated.View>
                </View>
              </Animated.View>
            )}

            {/* File preview */}
            {hasFile && (
              <Animated.View style={{ opacity: previewAnim, transform: [{ translateY: previewY }], marginBottom: 20 }}>
                <View style={styles.filePreview}>
                  <View style={styles.filePreviewLeft}>
                    <View style={styles.fileIconWrap}>
                      {isUploading
                        ? <ActivityIndicator color="#cfbcff" size="small" />
                        : <MaterialIcons
                            name={uploadError ? 'error-outline' : 'description'}
                            size={22}
                            color={uploadError ? '#EF4444' : uploadResult ? '#34D399' : '#ffb4ab'}
                          />
                      }
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">{pickedName}</Text>
                      <Text style={styles.fileMeta}>
                        {pickedSize > 0 ? formatBytes(pickedSize) : ''}
                        {isUploading ? ' • Uploading...' : uploadError ? ' • Upload failed' : uploadResult ? ' • Uploaded ✓' : ' • Ready to analyze'}
                      </Text>
                      {!!uploadError && (
                        <Text style={{ color: '#EF4444', fontSize: 11, marginTop: 2 }}>{uploadError}</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.fileActions}>
                    {!isUploading && uploadError ? (
                      <Pressable
                        style={styles.fileActionBtn}
                        onPress={handleSelectFile}
                        android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)', borderless: true } : undefined}
                      >
                        <MaterialIcons name="refresh" size={20} color="#cfbcff" />
                      </Pressable>
                    ) : null}
                    <Pressable
                      style={styles.fileActionBtn}
                      onPress={handleRemoveFile}
                      disabled={isUploading}
                      android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,100,100,0.1)', borderless: true } : undefined}
                    >
                      <MaterialIcons name="delete" size={20} color={isUploading ? 'rgba(255,180,171,0.3)' : '#ffb4ab'} />
                    </Pressable>
                  </View>
                </View>
              </Animated.View>
            )}

            {/* OR divider */}
            <View style={styles.orDivider}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.orLine} />
            </View>

            {/* Import buttons */}
            <View style={styles.importButtons}>
              <Pressable
                style={styles.importBtn}
                onPress={() => Alert.alert('LinkedIn Import', 'LinkedIn import integration is coming soon.')}
                android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)' } : undefined}
              >
                <MaterialIcons name="link" size={18} color="#0077b5" />
                <Text style={styles.importBtnText}>Import LinkedIn</Text>
              </Pressable>
              <Pressable
                style={styles.importBtn}
                onPress={() => Alert.alert('Google Drive', 'Google Drive import integration is coming soon.')}
                android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.05)' } : undefined}
              >
                <MaterialIcons name="grid-view" size={18} color="rgba(255,255,255,0.8)" />
                <Text style={styles.importBtnText}>Google Drive</Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* ── Footer actions ── */}
          <Animated.View style={[styles.footerActions, { opacity: footerOp }]}>
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={() => navigation.navigate('Onboarding4')}
              activeOpacity={0.6}
              disabled={isUploading}
            >
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>

            <Animated.View style={[styles.continueBtnOuter, { transform: [{ scale: btnScale }], opacity: isUploading ? 0.5 : 1 }]}>
              <Pressable
                onPressIn={handleBtnPressIn}
                onPressOut={handleBtnPressOut}
                onPress={handleContinue}
                disabled={isUploading}
                style={{ borderRadius: 14, overflow: 'hidden' }}
                android_ripple={Platform.OS === 'android' ? { color: 'rgba(255,255,255,0.1)' } : undefined}
              >
                <LinearGradient
                  colors={['#6750A4', '#9C4DCC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.continueBtn}
                >
                  <Animated.View style={[styles.shimmerStrip, { transform: [{ translateX: shimmerX }] }]}>
                    <LinearGradient
                      colors={['rgba(0,0,0,0)', 'rgba(255,255,255,0.25)', 'rgba(0,0,0,0)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ flex: 1 }}
                    />
                  </Animated.View>
                  {isUploading
                    ? <ActivityIndicator color="white" size="small" style={{ marginRight: 8 }} />
                    : null
                  }
                  <Text style={styles.continueBtnText}>{isUploading ? 'Uploading…' : 'Continue'}</Text>
                  {!isUploading && <MaterialIcons name="arrow-forward" size={18} color="white" />}
                </LinearGradient>
              </Pressable>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
