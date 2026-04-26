import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Progress bar fill max width: screen - outer padding(32) - card padding(36) = screen - 68
export const STAT_BAR_WIDTH = width - 72;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0F1A',
  },

  orb1: {
    position: 'absolute',
    top: -100,
    left: -80,
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: width * 0.425,
    backgroundColor: '#6750A4',
  },
  orb2: {
    position: 'absolute',
    bottom: -80,
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
    backgroundColor: 'rgba(17,24,39,0.88)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerBrand: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
    color: '#8B5CF6',
  },
  headerBrandAccent: {
    color: '#22D3EE',
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F87171',
  },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scrollView: {
    flex: 1,
  },
  scroll: {
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.3)',
    backgroundColor: 'rgba(248,113,113,0.08)',
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F87171',
    letterSpacing: 0.3,
  },

  // ── Card base ─────────────────────────────────────────────────────────────
  card: {
    backgroundColor: 'rgba(17,24,39,0.85)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.3,
    marginBottom: 20,
  },

  // ── Hero / Identity ───────────────────────────────────────────────────────
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  avatarRingWrap: {
    padding: 3,
    borderRadius: 52,
    flexShrink: 0,
  },
  avatarInner: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#5E35B1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(11,15,26,0.9)',
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: '900',
    color: 'white',
    letterSpacing: -0.5,
  },
  heroIdentity: {
    flex: 1,
    minWidth: 0,
  },
  heroName: {
    fontSize: 24,
    fontWeight: '900',
    color: 'white',
    letterSpacing: -0.8,
    marginBottom: 2,
  },
  heroRole: {
    fontSize: 13,
    fontWeight: '700',
    color: '#A5B4FC',
    marginBottom: 10,
  },
  heroBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(148,163,184,0.8)',
    letterSpacing: 0.3,
  },

  // ── Score section ─────────────────────────────────────────────────────────
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 20,
  },
  scoreSection: {
    alignItems: 'center',
  },
  scoreSectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(100,116,139,0.7)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  scoreCircleWrap: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  scoreCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 52,
    fontWeight: '900',
    color: 'white',
    letterSpacing: -2,
    lineHeight: 56,
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#22D3EE',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  scoreSub: {
    fontSize: 12,
    color: 'rgba(148,163,184,0.7)',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },

  // ── Skill Radar ───────────────────────────────────────────────────────────
  radarWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Application Flow ──────────────────────────────────────────────────────
  statRow: {
    marginBottom: 18,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(100,116,139,0.7)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '800',
    color: 'white',
  },
  statTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  statFillWrap: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  statDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginTop: 20,
    marginBottom: 20,
  },
  countersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  counterItem: {
    alignItems: 'center',
  },
  counterValue: {
    fontSize: 26,
    fontWeight: '900',
    color: 'white',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  counterLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(100,116,139,0.6)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  // ── Learning Timeline ─────────────────────────────────────────────────────
  timelineItem: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 24,
  },
  timelineDotCol: {
    alignItems: 'center',
    width: 14,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 2,
  },
  timelineLine: {
    flex: 1,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    minWidth: 0,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    marginBottom: 3,
  },
  timelineTitleDim: {
    color: 'rgba(148,163,184,0.6)',
  },
  timelineMeta: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  progressChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: 'rgba(99,102,241,0.15)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.3)',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressChipFill: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: 'rgba(99,102,241,0.15)',
  },
  progressChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A5B4FC',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  // ── Resume Hub ────────────────────────────────────────────────────────────
  resumeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  resumeHeaderLeft: {
    flex: 1,
  },
  resumeHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  resumeHeaderSub: {
    fontSize: 11,
    color: 'rgba(100,116,139,0.7)',
  },
  resumeBtns: {
    flexDirection: 'row',
    gap: 8,
    flexShrink: 0,
  },
  resumeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  resumeBtnPrimary: {
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  resumeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(226,232,240,0.8)',
  },
  resumeBtnTextPrimary: {
    color: 'white',
  },

  // Resume document preview
  resumeDoc: {
    backgroundColor: 'rgba(13,18,31,0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 20,
  },
  resumeDocName: {
    fontSize: 20,
    fontWeight: '900',
    color: 'white',
    letterSpacing: -0.5,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  resumeDocRole: {
    fontSize: 13,
    fontWeight: '700',
    color: '#A5B4FC',
    textAlign: 'center',
    marginBottom: 12,
  },
  resumeDocContact: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  resumeDocContactText: {
    fontSize: 10,
    color: 'rgba(100,116,139,0.7)',
  },
  resumeDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 16,
  },
  resumeSectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#22D3EE',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(34,211,238,0.2)',
    alignSelf: 'flex-start',
  },
  resumeBodyText: {
    fontSize: 12,
    color: 'rgba(203,196,210,0.85)',
    lineHeight: 20,
    marginBottom: 16,
  },
  resumeExpItem: {
    marginBottom: 14,
    paddingLeft: 14,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.08)',
  },
  resumeExpItemActive: {
    borderLeftColor: 'rgba(99,102,241,0.5)',
  },
  resumeExpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 8,
  },
  resumeExpTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
    flex: 1,
  },
  resumeExpDate: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(100,116,139,0.7)',
    letterSpacing: 0.5,
    flexShrink: 0,
  },
  resumeExpDesc: {
    fontSize: 12,
    color: 'rgba(148,163,184,0.75)',
    lineHeight: 18,
  },
  resumeExpDot: {
    position: 'absolute',
    left: -4,
    top: 5,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },

  // ── Spinner ───────────────────────────────────────────────────────────────
  spinnerRing: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderTopColor: 'white',
    flexShrink: 0,
  },
});
