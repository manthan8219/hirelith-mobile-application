export const APP_NAME = 'Hirelith';

export const COLORS = {
  // Backgrounds
  background: '#0B0F1A',
  surface: '#111827',
  surfaceElevated: '#1F2937',

  // Accent gradient stops
  gradientStart: '#7C3AED',  // purple
  gradientMid: '#3B82F6',    // blue
  gradientEnd: '#06B6D4',    // cyan

  // Accent (primary interactive)
  primary: '#7C3AED',
  primaryLight: '#A78BFA',

  // Text
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textMuted: '#4B5563',

  // Status
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',

  // Borders
  border: '#1F2937',
  borderLight: '#374151',
};

export const GRADIENT = {
  accent: ['#7C3AED', '#3B82F6', '#06B6D4'] as const,
  subtle: ['#111827', '#0B0F1A'] as const,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
