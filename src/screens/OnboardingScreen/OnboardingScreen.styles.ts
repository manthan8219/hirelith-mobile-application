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
    top: -60,
    left: -120,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: '#6750A4',
  },
  orb2: {
    position: 'absolute',
    bottom: -100,
    right: -100,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: '#00BCD4',
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
    backgroundColor: 'rgba(255,255,255,0.0)',
  },
  headerIconBtnPressed: {
    backgroundColor: 'rgba(255,255,255,0.08)',
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
    color: '#A78BFA',
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
    marginBottom: 36,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.8,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 44,
  },
  heroSub: {
    fontSize: 15,
    color: 'rgba(148,163,184,0.75)',
    textAlign: 'center',
    lineHeight: 23,
    maxWidth: 300,
  },

  // ── Selection cards ───────────────────────────────────────────────────────
  cardsGrid: {
    gap: 14,
    marginBottom: 36,
  },
  card: {
    backgroundColor: 'rgba(17,24,39,0.75)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: 'rgba(167,139,250,0.5)',
    backgroundColor: 'rgba(103,80,164,0.12)',
    shadowColor: '#7C3AED',
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  cardTopLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  iconWrapDefault: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconWrapGradient: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#6750A4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: 'white',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  cardDesc: {
    fontSize: 13,
    color: 'rgba(148,163,184,0.65)',
    lineHeight: 19,
    marginBottom: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardAction: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(100,116,139,0.7)',
  },
  cardActionSelected: {
    color: '#A78BFA',
  },

  // ── Footer actions ────────────────────────────────────────────────────────
  footerActions: {
    alignItems: 'center',
    gap: 16,
    paddingBottom: 20,
  },
  continueBtnOuter: {
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#6750A4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
    width: '100%',
  },
  continueBtn: {
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.3,
  },
  continueBtnDisabled: {
    opacity: 0.45,
  },
  skipBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(100,116,139,0.65)',
    letterSpacing: 3,
    textTransform: 'uppercase',
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
