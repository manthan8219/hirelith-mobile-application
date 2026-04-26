import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0F1A',
  },

  // ── Ambient orbs ──────────────────────────────────────────────────────────
  orb1: {
    position: 'absolute',
    top: -80,
    left: -100,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: '#6750A4',
  },
  orb2: {
    position: 'absolute',
    bottom: -120,
    right: -80,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: '#e7c365',
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(11,15,26,0.85)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
  },

  // ── Progress ──────────────────────────────────────────────────────────────
  progressSection: {
    marginBottom: 32,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  progressStep: {
    fontSize: 10,
    fontWeight: '700',
    color: '#cfbcff',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(148,163,184,0.6)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  heroSection: {
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.8,
    lineHeight: 38,
    marginBottom: 10,
  },
  heroAccent: {
    color: '#cfbcff',
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(148,163,184,0.75)',
    lineHeight: 22,
  },

  // ── Feature cards ─────────────────────────────────────────────────────────
  featureCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  featureCard: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
    letterSpacing: -0.1,
    marginBottom: 2,
  },
  featureSub: {
    fontSize: 10,
    color: 'rgba(148,163,184,0.65)',
    lineHeight: 14,
  },

  // ── Upload card ───────────────────────────────────────────────────────────
  uploadCard: {
    backgroundColor: 'rgba(17,24,39,0.8)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 28,
  },

  // Dropzone
  dropzone: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginBottom: 20,
    overflow: 'hidden',
  },
  dropzoneIconWrap: {
    position: 'relative',
    width: 80,
    height: 80,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropzoneIconGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(103,80,164,0.25)',
  },
  dropzoneIconInner: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#0D121F',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropzoneTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  dropzoneSub: {
    fontSize: 13,
    color: 'rgba(148,163,184,0.65)',
    textAlign: 'center',
    marginBottom: 24,
  },
  selectFileBtn: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: '#6750A4',
    borderRadius: 12,
    shadowColor: '#6750A4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  selectFileBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.3,
  },

  // OR divider
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  orText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(100,116,139,0.6)',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // Import buttons
  importButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  importBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(17,24,39,0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  importBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },

  // File preview
  filePreview: {
    backgroundColor: 'rgba(15,19,30,0.9)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filePreviewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  fileIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(147,0,10,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
    marginBottom: 3,
  },
  fileMeta: {
    fontSize: 11,
    color: 'rgba(148,163,184,0.6)',
  },
  fileActions: {
    flexDirection: 'row',
    gap: 4,
  },
  fileActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Footer actions ────────────────────────────────────────────────────────
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  skipBtn: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(148,163,184,0.6)',
  },
  continueBtnOuter: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#6750A4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 10,
  },
  continueBtn: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.2,
  },

  // ── Shimmer overlay ───────────────────────────────────────────────────────
  shimmerStrip: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
    zIndex: 2,
  },
});
