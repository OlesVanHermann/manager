/**
 * DESIGN TOKENS - OLD MANAGER
 * Constantes TypeScript pour utilisation dans le code
 * Primary: #0050D7 (Science Blue - OVH Classic)
 */

// === COLORS ===
export const colors = {
  primary: {
    '000': '#F0F5FF',
    '100': '#D6E4FF',
    '200': '#ADC6FF',
    '300': '#85A5FF',
    '400': '#597EF7',
    '500': '#0050D7',
    '600': '#003DA8',
    '700': '#002B7A',
    '800': '#122844',
    '900': '#0A1929',
  },
  success: {
    '100': '#D4EDDA',
    '500': '#28A745',
    '700': '#1E7E34',
  },
  warning: {
    '100': '#FFF3CD',
    '500': '#FFC107',
    '700': '#D39E00',
  },
  critical: {
    '100': '#F8D7DA',
    '500': '#DC3545',
    '700': '#BD2130',
  },
  info: {
    '100': '#D1ECF1',
    '500': '#17A2B8',
    '700': '#117A8B',
  },
  neutral: {
    '000': '#FFFFFF',
    '050': '#F8F9FA',
    '100': '#E9ECEF',
    '200': '#DEE2E6',
    '300': '#CED4DA',
    '400': '#ADB5BD',
    '500': '#6C757D',
    '600': '#495057',
    '700': '#343A40',
    '800': '#212529',
    '900': '#000000',
  },
  text: {
    default: '#212529',
    muted: '#6C757D',
    light: '#ADB5BD',
    inverse: '#FFFFFF',
  },
  background: {
    default: '#FFFFFF',
    muted: '#F8F9FA',
    hover: '#E9ECEF',
  },
  border: {
    default: '#DEE2E6',
    hover: '#ADB5BD',
    focus: '#0050D7',
    error: '#DC3545',
  },
} as const;

// === TYPOGRAPHY ===
export const typography = {
  fontFamily: {
    sans: '"Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"Source Code Pro", SFMono-Regular, Menlo, Monaco, monospace',
  },
  fontSize: {
    '2xs': '0.625rem',
    'xs': '0.75rem',
    'sm': '0.875rem',
    'md': '1rem',
    'lg': '1.125rem',
    'xl': '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// === SPACING ===
export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
} as const;

// === BORDERS ===
export const borders = {
  radius: {
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.5rem',
    xl: '1rem',
    full: '9999px',
  },
  width: {
    sm: '1px',
    md: '2px',
    lg: '4px',
  },
} as const;

// === SHADOWS ===
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const;

// === BREAKPOINTS ===
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// === Z-INDEX ===
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// === TRANSITIONS ===
export const transitions = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// === EXPORT ALL ===
export const tokens = {
  colors,
  typography,
  spacing,
  borders,
  shadows,
  breakpoints,
  zIndex,
  transitions,
} as const;

export default tokens;
