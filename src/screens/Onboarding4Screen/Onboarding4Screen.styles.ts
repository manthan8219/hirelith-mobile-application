import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0F1A',
  },

  orb1: {
    position: 'absolute',
    top: -100,
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
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerStep: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(148,163,184,0.7)',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 100,
  },

  // ── Hero section ──────────────────────────────────────────────────────────
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconArea: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  iconAura: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(103,80,164,0.2)',
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(103,80,164,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(207,188,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  spinRing: {
    position: 'absolute',
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 1,
    borderColor: 'rgba(103,80,164,0.28)',
    borderStyle: 'dashed',
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    letterSpacing: -0.8,
    marginBottom: 10,
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(148,163,184,0.7)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
    marginBottom: 28,
  },

  // Global progress bar
  globalProgressTrack: {
    width: '100%',
    maxWidth: 340,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  globalProgressFill: {
    height: '100%',
    borderRadius: 999,
    shadowColor: '#cfbcff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },

  // ── Status cards ──────────────────────────────────────────────────────────
  statusCards: {
    gap: 12,
    marginBottom: 24,
  },
  statusCard: {
    backgroundColor: 'rgba(17,24,39,0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    overflow: 'hidden',
  },
  statusCardActive: {
    borderColor: 'rgba(207,188,255,0.4)',
    backgroundColor: 'rgba(103,80,164,0.08)',
  },
  statusCardPending: {
    opacity: 0.38,
  },
  statusIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  statusIconWrapComplete: {
    backgroundColor: 'rgba(52,211,153,0.12)',
    borderColor: 'rgba(52,211,153,0.3)',
  },
  statusIconWrapActive: {
    backgroundColor: 'rgba(207,188,255,0.12)',
    borderColor: 'rgba(207,188,255,0.4)',
  },
  statusIconWrapPending: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statusContent: {
    flex: 1,
  },
  statusTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    letterSpacing: -0.1,
  },
  statusDesc: {
    fontSize: 12,
    color: 'rgba(148,163,184,0.65)',
    lineHeight: 17,
  },
  processingBadge: {
    backgroundColor: 'rgba(103,80,164,0.25)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  processingBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#cfbcff',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  miniProgressDots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  miniDot: {
    flex: 1,
    height: 3,
    borderRadius: 999,
  },

  // ── Scan panel ────────────────────────────────────────────────────────────
  scanPanel: {
    backgroundColor: 'rgba(17,24,39,0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    overflow: 'hidden',
  },
  scanLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  scanTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  scanAvatarWrap: {
    position: 'relative',
  },
  scanAvatar: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: 'rgba(103,80,164,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(207,188,255,0.2)',
  },
  scanAvatarOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: 12,
    backgroundColor: 'rgba(103,80,164,0.15)',
  },
  scanLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#cfbcff',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  scanName: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
    letterSpacing: -0.1,
  },
  scanStats: {
    flexDirection: 'row',
    gap: 20,
  },
  scanStat: {
    alignItems: 'center',
  },
  scanStatValue: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.5,
  },
  scanStatGold: {
    color: '#e7c365',
  },
  scanStatLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: 'rgba(100,116,139,0.8)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    alignItems: 'center',
    gap: 16,
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  skipBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.2,
  },
  analysisNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  analysisNoteDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#cfbcff',
  },
  analysisNoteText: {
    fontSize: 11,
    color: 'rgba(148,163,184,0.5)',
  },

  // ── Bottom pill ───────────────────────────────────────────────────────────
  bottomPill: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: 'rgba(17,24,39,0.9)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  bottomPillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cfbcff',
  },
  bottomPillText: {
    fontSize: 12,
    color: 'rgba(203,196,210,0.8)',
  },
});
