import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0F1A',
  },

  orb1: {
    position: 'absolute',
    top: -120,
    left: -80,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: '#6366F1',
  },
  orb2: {
    position: 'absolute',
    bottom: -100,
    right: -100,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: '#22D3EE',
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(17,24,39,0.88)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexShrink: 0,
  },
  headerTitleWrap: {
    flex: 1,
    minWidth: 0,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.2,
  },
  headerSub: {
    fontSize: 11,
    color: 'rgba(148,163,184,0.7)',
    marginTop: 1,
  },
  headerSaveBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(99,102,241,0.15)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.3)',
    flexShrink: 0,
  },
  headerSaveBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#818CF8',
    letterSpacing: 0.3,
  },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scrollView: {
    flex: 1,
  },
  scroll: {
    paddingTop: 20,
    paddingBottom: 48,
    paddingHorizontal: 16,
  },

  // ── Job Info Card ─────────────────────────────────────────────────────────
  jobInfoCard: {
    backgroundColor: 'rgba(17,24,39,0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
    marginBottom: 14,
  },
  jobInfoTopLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  jobIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(13,18,31,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  jobInfoContent: {
    flex: 1,
    minWidth: 0,
  },
  jobInfoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  jobInfoCompany: {
    fontSize: 12,
    color: 'rgba(148,163,184,0.75)',
    marginBottom: 8,
  },
  jobInfoBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  jobBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  jobBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // ── Section card ──────────────────────────────────────────────────────────
  sectionCard: {
    backgroundColor: 'rgba(17,24,39,0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 18,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(148,163,184,0.6)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 16,
  },

  // ── Composer fields ───────────────────────────────────────────────────────
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(148,163,184,0.6)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  fieldInput: {
    backgroundColor: 'rgba(13,18,31,0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: 'white',
    marginBottom: 14,
  },

  // Tone selector
  toneRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  toneBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(13,18,31,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  toneBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(148,163,184,0.6)',
    letterSpacing: 0.3,
  },

  // Update Draft button
  updateDraftBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  updateDraftBtnInner: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  updateDraftBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  // ── Resume Tailoring ──────────────────────────────────────────────────────
  tailoringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  tailoringTextWrap: {
    flex: 1,
  },
  tailoringLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  tailoringSub: {
    fontSize: 11,
    color: 'rgba(148,163,184,0.6)',
    marginTop: 2,
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 3,
    flexShrink: 0,
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'white',
  },
  skillTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(99,102,241,0.12)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.25)',
  },
  skillTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A5B4FC',
  },
  skillTagsDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    flexShrink: 0,
  },

  // ── Application Letter ────────────────────────────────────────────────────
  letterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  letterHeaderLeft: {
    flex: 1,
  },
  letterActions: {
    flexDirection: 'row',
    gap: 6,
    flexShrink: 0,
  },
  letterActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(99,102,241,0.15)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.3)',
    marginBottom: 12,
  },
  aiBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#818CF8',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  letterBox: {
    backgroundColor: 'rgba(13,18,31,0.7)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 14,
    marginBottom: 14,
  },
  letterText: {
    fontSize: 13,
    color: 'rgba(226,232,240,0.85)',
    lineHeight: 22,
  },
  letterTextInput: {
    fontSize: 13,
    color: 'white',
    lineHeight: 22,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  manualEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignSelf: 'flex-start',
  },
  manualEditBtnActive: {
    backgroundColor: 'rgba(34,211,238,0.1)',
    borderColor: 'rgba(34,211,238,0.25)',
  },
  manualEditBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(148,163,184,0.7)',
  },
  manualEditBtnTextActive: {
    color: '#22D3EE',
  },

  // ── Analysis widgets ──────────────────────────────────────────────────────
  analysisRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  analysisCard: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.85)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14,
    overflow: 'hidden',
    minWidth: 0,
  },
  analysisCardTitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  analysisCardValue: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 38,
  },
  analysisCardSub: {
    fontSize: 10,
    color: 'rgba(148,163,184,0.65)',
    marginTop: 4,
    lineHeight: 15,
  },
  suggestionText: {
    fontSize: 12,
    color: 'rgba(148,163,184,0.8)',
    lineHeight: 18,
  },
  suggestionBold: {
    color: 'white',
    fontWeight: '700',
  },

  // ── Finalize button ───────────────────────────────────────────────────────
  finalizeBtn: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'white',
    borderRadius: 18,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
  finalizeBtnLoading: {
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  finalizeBtnSuccess: {
    backgroundColor: '#22C55E',
    shadowColor: '#22C55E',
  },
  finalizeBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0B0F1A',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  finalizeBtnTextSuccess: {
    color: 'white',
  },

  // ── Spinner ───────────────────────────────────────────────────────────────
  spinnerRing: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: 'rgba(11,15,26,0.15)',
    borderTopColor: '#0B0F1A',
    flexShrink: 0,
  },
  spinnerRingLight: {
    borderColor: 'rgba(255,255,255,0.2)',
    borderTopColor: 'white',
  },
});
