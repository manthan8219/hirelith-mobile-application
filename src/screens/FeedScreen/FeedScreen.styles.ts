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
    right: -80,
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: width * 0.375,
    backgroundColor: '#6366F1',
  },
  orb2: {
    position: 'absolute',
    bottom: -80,
    left: -60,
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  },

  // ── Section header ────────────────────────────────────────────────────────
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.3,
  },

  // ── Filter tabs ───────────────────────────────────────────────────────────
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  filterTabActive: {
    backgroundColor: 'rgba(99,102,241,0.2)',
    borderColor: 'rgba(99,102,241,0.35)',
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(100,116,139,0.7)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  filterTabTextActive: {
    color: '#A5B4FC',
  },

  // ── Trending horizontal strip ──────────────────────────────────────────────
  trendingSection: {
    marginBottom: 24,
  },
  trendingLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(100,116,139,0.6)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  trendingScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  trendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: 'rgba(17,24,39,0.85)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  trendingChipNum: {
    fontSize: 10,
    fontWeight: '800',
    color: '#22D3EE',
    letterSpacing: 0.5,
  },
  trendingChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(226,232,240,0.85)',
    maxWidth: 140,
  },

  // ── Career Insight banner ──────────────────────────────────────────────────
  insightBanner: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: 'rgba(99,102,241,0.08)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.2)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    overflow: 'hidden',
  },
  insightBannerGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(99,102,241,0.1)',
  },
  insightIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(34,211,238,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  insightBannerContent: {
    flex: 1,
  },
  insightBannerLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#22D3EE',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  insightBannerText: {
    fontSize: 12,
    color: 'rgba(148,163,184,0.85)',
    lineHeight: 18,
  },
  insightBannerBold: {
    color: 'white',
    fontWeight: '700',
  },

  // ── Feed heading ──────────────────────────────────────────────────────────
  feedHeading: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  // ── News card ─────────────────────────────────────────────────────────────
  cardWrap: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: 'rgba(17,24,39,0.85)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  cardWrapExpanded: {
    borderColor: 'rgba(99,102,241,0.35)',
  },

  // Card image hero
  cardHero: {
    width: '100%',
    height: 160,
    overflow: 'hidden',
  },
  cardHeroGrad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeroIcon: {
    opacity: 0.25,
  },
  cardHeroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  cardHeroTags: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    flexDirection: 'row',
    gap: 6,
  },
  heroTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  heroTagText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  // Card body
  cardBody: {
    padding: 16,
  },

  // Tags row (no-image cards)
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  inlineTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  inlineTagText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.3,
    lineHeight: 22,
    marginBottom: 8,
  },
  cardTitleExpanded: {
    color: '#A5B4FC',
  },
  cardExcerpt: {
    fontSize: 13,
    color: 'rgba(148,163,184,0.8)',
    lineHeight: 20,
    marginBottom: 10,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardMetaText: {
    fontSize: 11,
    color: 'rgba(100,116,139,0.7)',
    fontWeight: '500',
  },
  cardMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(100,116,139,0.4)',
  },
  cardExpandHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  cardExpandHintText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(99,102,241,0.7)',
  },

  // ── Expanded section ──────────────────────────────────────────────────────
  expandedSection: {
    overflow: 'hidden',
  },
  expandedInner: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  fullTextBox: {
    backgroundColor: 'rgba(13,18,31,0.6)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 14,
    marginBottom: 14,
  },
  fullText: {
    fontSize: 13,
    color: 'rgba(226,232,240,0.85)',
    lineHeight: 22,
  },

  // Impact panel
  impactPanel: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
    overflow: 'hidden',
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  impactLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  impactText: {
    fontSize: 13,
    color: 'rgba(148,163,184,0.85)',
    lineHeight: 20,
  },
  impactBold: {
    color: 'white',
    fontWeight: '700',
  },

  // Action buttons row
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  actionBtnPrimary: {
    backgroundColor: 'rgba(99,102,241,0.2)',
    borderColor: 'rgba(99,102,241,0.3)',
  },
  actionBtnLoading: {
    opacity: 0.7,
  },
  actionBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(226,232,240,0.75)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  actionBtnTextPrimary: {
    color: '#A5B4FC',
  },
  bookmarkBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginLeft: 'auto' as any,
  },

  // ── Loading footer ────────────────────────────────────────────────────────
  loadingFooter: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 6,
  },
  loadingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#22D3EE',
  },
  loadingText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(100,116,139,0.6)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // ── Spinner ───────────────────────────────────────────────────────────────
  spinnerRing: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'rgba(99,102,241,0.2)',
    borderTopColor: '#818CF8',
    flexShrink: 0,
  },

  // ── Sub-tab bar ───────────────────────────────────────────────────────────
  subTabBar: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(17,24,39,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  subTabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  subTabItemActive: {
    backgroundColor: 'rgba(34,211,238,0.1)',
    borderColor: 'rgba(34,211,238,0.3)',
  },
  subTabItemActiveGithub: {
    backgroundColor: 'rgba(167,139,250,0.1)',
    borderColor: 'rgba(167,139,250,0.3)',
  },
  subTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(100,116,139,0.6)',
    letterSpacing: 0.2,
  },
  subTabTextActive: {
    color: '#22D3EE',
  },
  subTabTextActiveGithub: {
    color: '#A78BFA',
  },
  subTabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#22D3EE',
  },

  // ── GitHub tab ────────────────────────────────────────────────────────────
  githubHeader: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  githubHeaderTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  githubHeaderSub: {
    fontSize: 13,
    color: 'rgba(148,163,184,0.7)',
    lineHeight: 19,
  },

  // Market signal row
  marketSignalRow: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  marketSignal: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.2)',
    padding: 14,
  },
  marketSignalLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#A78BFA',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  marketSignalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#34D399',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  marketSignalDesc: {
    fontSize: 10,
    color: 'rgba(148,163,184,0.65)',
    lineHeight: 14,
  },

  // Repo card
  repoCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: 'rgba(17,24,39,0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 18,
  },
  repoTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  repoIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(34,211,238,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  repoMeta: {
    flex: 1,
  },
  repoOwner: {
    fontSize: 11,
    color: 'rgba(100,116,139,0.7)',
    fontWeight: '600',
    marginBottom: 2,
  },
  repoName: {
    fontSize: 15,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.2,
  },
  trendBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(34,211,238,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.25)',
    flexShrink: 0,
  },
  trendBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#22D3EE',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  repoStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  repoLangDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  langDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  repoLangText: {
    fontSize: 11,
    color: 'rgba(148,163,184,0.75)',
    fontWeight: '600',
  },
  repoStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  repoStatText: {
    fontSize: 11,
    color: 'rgba(100,116,139,0.7)',
    fontWeight: '600',
  },
  repoDesc: {
    fontSize: 13,
    color: 'rgba(203,213,225,0.8)',
    lineHeight: 20,
    marginBottom: 14,
  },
  repoSummaryToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(167,139,250,0.07)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  repoSummaryToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  repoSummaryToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A78BFA',
    letterSpacing: 0.3,
  },
  repoSummaryBox: {
    marginTop: 10,
    backgroundColor: 'rgba(13,18,31,0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.1)',
    padding: 14,
  },
  repoSummaryText: {
    fontSize: 12,
    color: 'rgba(148,163,184,0.85)',
    lineHeight: 19,
  },

  // Skill gap card
  skillGapCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(17,24,39,0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.2)',
    padding: 18,
  },
  skillGapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  skillGapTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.2,
  },
  skillGapSub: {
    fontSize: 12,
    color: 'rgba(148,163,184,0.7)',
    marginBottom: 14,
    lineHeight: 18,
  },
  skillGapTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillGapTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  skillGapTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(226,232,240,0.8)',
    letterSpacing: 0.4,
  },
});
