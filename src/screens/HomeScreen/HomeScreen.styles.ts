import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#020617',
  },

  // ── Ambient orbs ──────────────────────────────────────────────────────────
  orb1: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: '#7C3AED',
  },
  orb2: {
    position: 'absolute',
    bottom: -80,
    right: -60,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: '#06B6D4',
  },
  orb3: {
    position: 'absolute',
    top: height * 0.4,
    left: width * 0.3,
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: '#3B82F6',
  },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 100,
    alignItems: 'center',
  },

  // ── Logo / Brand ──────────────────────────────────────────────────────────
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoGlowWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: 220,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7C3AED',
    // Blur achieved via shadow
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
  },
  brandText: {
    fontSize: 56,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -1.5,
    lineHeight: 60,
  },
  brandAccent: {
    color: '#A78BFA',
  },

  // ── Headline ──────────────────────────────────────────────────────────────
  headlineSection: {
    alignItems: 'center',
    marginBottom: 40,
    maxWidth: 340,
  },
  headline: {
    fontSize: 34,
    fontWeight: '700',
    color: '#F1F5F9',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 42,
    marginBottom: 16,
  },
  headlineAccent: {
    color: '#A78BFA',
  },
  subtext: {
    fontSize: 15,
    color: 'rgba(203,196,210,0.7)',
    textAlign: 'center',
    lineHeight: 24,
  },

  // ── Bento cards ───────────────────────────────────────────────────────────
  cardsSection: {
    width: '100%',
    gap: 12,
    marginBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(17,24,39,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 16,
    padding: 20,
    // iOS glass shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHighlight: {
    borderColor: 'rgba(167,139,250,0.25)',
    backgroundColor: 'rgba(124,58,237,0.08)',
  },
  cardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: 'rgba(203,196,210,0.65)',
    lineHeight: 19,
  },

  // ── CTA section ───────────────────────────────────────────────────────────
  ctaSection: {
    alignItems: 'center',
    gap: 16,
  },
  ctaBtnOuter: {
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  ctaBtn: {
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.2,
  },
  ctaHint: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(100,116,139,0.8)',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },

  // ── Bottom badge (SYSTEMS NOMINAL) ────────────────────────────────────────
  badge: {
    position: 'absolute',
    bottom: 32,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(17,24,39,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  badgeDotWrap: {
    width: 8,
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDotRing: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#06B6D4',
  },
  badgeDotCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#06B6D4',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(203,196,210,0.5)',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },

  // ── Bottom avatars ────────────────────────────────────────────────────────
  avatarsSection: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarStack: {
    flexDirection: 'row',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
  },
  avatarText: {
    fontSize: 8,
    fontWeight: '700',
    color: 'white',
  },
  avatarCount: {
    backgroundColor: 'rgba(17,24,39,0.9)',
    borderColor: '#020617',
  },
  avatarsLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(100,116,139,0.7)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    maxWidth: 80,
    textAlign: 'right',
  },

  // ── Shimmer overlay ───────────────────────────────────────────────────────
  shimmerStrip: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 80,
    zIndex: 2,
  },
});
