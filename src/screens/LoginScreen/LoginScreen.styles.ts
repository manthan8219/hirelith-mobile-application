import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#020617',
  },

  // ── Ambient orbs ──────────────────────────────────────────────────────────
  // Numeric offsets only — negative % strings break new arch (Fabric)
  orb1: {
    position: 'absolute',
    top: -60,
    left: -80,
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: width * 0.375,
    backgroundColor: '#7C3AED',
  },
  orb2: {
    position: 'absolute',
    bottom: -80,
    right: -70,
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: width * 0.325,
    backgroundColor: '#06B6D4',
  },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },

  // ── Logo ──────────────────────────────────────────────────────────────────
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.3,
  },
  brandAccent: {
    color: '#A78BFA',
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  // Glass panel without BlurView — compatible with new arch
  card: {
    borderRadius: 28,
    padding: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    width: '100%',
    backgroundColor: 'rgba(15,23,42,0.82)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 20,
  },
  cardTopLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 6,
    marginTop: 4,
    letterSpacing: 0.2,
  },
  subheading: {
    fontSize: 13,
    color: 'rgba(148,163,184,0.7)',
    textAlign: 'center',
    marginBottom: 26,
    lineHeight: 18,
  },

  // ── Social buttons ────────────────────────────────────────────────────────
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  socialBtn: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    backgroundColor: 'rgba(2,6,23,0.4)',
  },
  socialBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  socialBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },

  // ── Divider ───────────────────────────────────────────────────────────────
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  dividerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(148,163,184,0.35)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // ── Form fields ───────────────────────────────────────────────────────────
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(148,163,184,0.55)',
    letterSpacing: 1.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resetLink: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A78BFA',
    letterSpacing: 1.2,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(2,6,23,0.45)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  inputIcon: {
    paddingLeft: 14,
    paddingRight: 4,
  },
  textInput: {
    flex: 1,
    color: 'white',
    fontSize: 14,
    paddingVertical: 16,
    paddingRight: 14,
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },

  fieldError: {
    color: '#F87171',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    marginLeft: 4,
  },

  // ── Submit button ─────────────────────────────────────────────────────────
  btnOuter: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  btnPressable: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  btn: {
    paddingVertical: 17,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shimmerStrip: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 80,
    zIndex: 2,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  btnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3,
  },

  // ── Card footer ───────────────────────────────────────────────────────────
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    color: 'rgba(148,163,184,0.55)',
    fontSize: 13,
  },
  footerLink: {
    color: '#A78BFA',
    fontWeight: '700',
    fontSize: 13,
    textDecorationLine: 'underline',
  },

  // ── Security badge ────────────────────────────────────────────────────────
  badgeSection: {
    alignItems: 'center',
    marginTop: 32,
    gap: 20,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  pulseDotWrap: {
    width: 8,
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseDotRing: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#06B6D4',
  },
  pulseDotCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#06B6D4',
  },
  securityText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 2,
  },
  bottomLinks: {
    flexDirection: 'row',
    gap: 32,
  },
  bottomLink: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(148,163,184,0.35)',
    letterSpacing: 1.8,
  },
});
