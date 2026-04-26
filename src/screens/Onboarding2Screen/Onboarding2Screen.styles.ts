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
    right: -100,
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: width * 0.425,
    backgroundColor: '#3B82F6',
  },
  orb2: {
    position: 'absolute',
    bottom: -120,
    left: -80,
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: width * 0.375,
    backgroundColor: '#06B6D4',
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
    paddingTop: 32,
    paddingBottom: 40,
  },

  // ── Progress ──────────────────────────────────────────────────────────────
  progressSection: {
    marginBottom: 36,
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
    color: '#22D3EE',
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
    alignItems: 'center',
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.8,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 42,
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(148,163,184,0.75)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 290,
  },

  // ── Domain grid ───────────────────────────────────────────────────────────
  domainsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  domainCard: {
    width: (width - 40 - 12) / 2,
    backgroundColor: 'rgba(17,24,39,0.8)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    overflow: 'hidden',
  },
  domainCardSelected: {
    borderColor: 'rgba(34,211,238,0.5)',
    backgroundColor: 'rgba(34,211,238,0.06)',
    shadowColor: '#06B6D4',
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  domainCardTopLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  domainCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  domainIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  domainIconWrapDefault: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: 'rgba(100,116,139,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#22D3EE',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22D3EE',
  },
  domainName: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
    letterSpacing: -0.1,
    marginBottom: 4,
  },
  domainTag: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: 'rgba(100,116,139,0.6)',
  },
  domainTagSelected: {
    color: '#22D3EE',
  },

  // ── Skill slider section ───────────────────────────────────────────────────
  sliderSection: {
    backgroundColor: 'rgba(17,24,39,0.75)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 24,
    marginBottom: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  sliderSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(148,163,184,0.6)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 20,
  },

  // Track
  sliderTrackWrap: {
    height: 48,
    justifyContent: 'center',
    marginBottom: 8,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 999,
    overflow: 'visible',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 999,
  },
  sliderThumb: {
    position: 'absolute',
    top: -14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0B0F1A',
    borderWidth: 2.5,
    borderColor: '#22D3EE',
    shadowColor: '#22D3EE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderThumbInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22D3EE',
  },

  // Labels row
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(100,116,139,0.6)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // Feedback card
  feedbackCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.2)',
    padding: 14,
    overflow: 'hidden',
  },
  feedbackCardBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(34,211,238,0.05)',
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  feedbackIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackTextWrap: {
    flex: 1,
  },
  feedbackLevel: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
    letterSpacing: -0.1,
    marginBottom: 2,
  },
  feedbackDesc: {
    fontSize: 11,
    color: 'rgba(148,163,184,0.65)',
    lineHeight: 16,
  },

  // ── Footer actions ────────────────────────────────────────────────────────
  footerActions: {
    gap: 12,
    paddingBottom: 20,
  },
  continueBtnOuter: {
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  continueBtnDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtn: {
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.3,
  },
  skipBtn: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(148,163,184,0.65)',
    letterSpacing: 0.5,
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
