import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0F1A',
  },
  orb1: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: '#6750A4',
  },
  orb2: {
    position: 'absolute',
    bottom: -100,
    right: -60,
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: width * 0.325,
    backgroundColor: '#22D3EE',
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(11,15,26,0.88)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerBrand: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    color: '#8B5CF6',
  },
  headerBrandAccent: {
    color: '#22D3EE',
  },
  headerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(167,139,250,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRerunBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(167,139,250,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.25)',
  },
  headerRerunText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A78BFA',
    letterSpacing: 0.5,
  },

  scroll: {
    paddingTop: 24,
    paddingBottom: 32,
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  heroCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(17,24,39,0.85)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.2)',
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(167,139,250,0.08)',
  },
  heroGlow2: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(34,211,238,0.05)',
  },

  // Score ring
  scoreRingWrap: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  scoreCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNum: {
    fontSize: 48,
    fontWeight: '900',
    color: 'white',
    letterSpacing: -2,
    lineHeight: 52,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(167,139,250,0.8)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 2,
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroVerdict: {
    fontSize: 13,
    color: 'rgba(148,163,184,0.85)',
    fontStyle: 'italic',
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 8,
    marginBottom: 20,
  },

  // Stats row (salary | divider | timeline)
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(100,116,139,0.7)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.2,
  },
  statValueAccent: {
    color: '#22D3EE',
  },
  statValueAccent2: {
    color: '#A78BFA',
  },

  // ── Section header ────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.3,
    flex: 1,
  },

  // ── Breakdown card ────────────────────────────────────────────────────────
  card: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(17,24,39,0.85)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.3,
  },

  barsList: {
    gap: 14,
  },
  barRow: {
    gap: 8,
  },
  barMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(148,163,184,0.75)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  barValue: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  barTrack: {
    height: 7,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: 7,
    borderRadius: 4,
  },

  // ── Gaps & Strengths ──────────────────────────────────────────────────────
  gapsList: {
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  gapCard: {
    backgroundColor: 'rgba(17,24,39,0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,77,79,0.15)',
    borderLeftWidth: 3,
    borderLeftColor: '#FF4D4F',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  gapDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4D4F',
    marginTop: 4,
    flexShrink: 0,
  },
  gapContent: {
    flex: 1,
  },
  gapTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  gapDesc: {
    fontSize: 12,
    color: 'rgba(148,163,184,0.8)',
    lineHeight: 18,
  },

  strengthCard: {
    backgroundColor: 'rgba(17,24,39,0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.15)',
    borderLeftWidth: 3,
    borderLeftColor: '#22D3EE',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  strengthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22D3EE',
    marginTop: 4,
    flexShrink: 0,
  },

  // ── Action Plan ────────────────────────────────────────────────────────────
  actionList: {
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  actionItem: {
    backgroundColor: 'rgba(17,24,39,0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  actionCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'rgba(167,139,250,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  actionCheckboxChecked: {
    backgroundColor: 'rgba(167,139,250,0.18)',
    borderColor: '#A78BFA',
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(230,224,233,0.9)',
    lineHeight: 21,
  },
  actionTextChecked: {
    textDecorationLine: 'line-through',
    color: 'rgba(100,116,139,0.6)',
  },
  actionIndex: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(100,116,139,0.5)',
    marginTop: 4,
    width: 14,
    flexShrink: 0,
  },

  // ── Market Reality ────────────────────────────────────────────────────────
  marketCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(17,24,39,0.85)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.18)',
    padding: 20,
    overflow: 'hidden',
  },
  marketGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(34,211,238,0.06)',
  },
  marketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  marketIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(34,211,238,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marketTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.3,
  },
  marketBody: {
    fontSize: 13,
    color: 'rgba(203,213,225,0.85)',
    lineHeight: 21,
    marginBottom: 16,
  },
  marketTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  marketTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
  },
  marketTagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  // ── Re-evaluate ───────────────────────────────────────────────────────────
  reEvalSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  reEvalBtnWrap: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  reEvalBtnInner: {
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  reEvalBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  reEvalNote: {
    fontSize: 11,
    color: 'rgba(100,116,139,0.65)',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 16,
  },
});
