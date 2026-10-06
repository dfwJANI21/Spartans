import { createStitches } from '@stitches/react';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  theme,
  createTheme,
  config
} = createStitches({
  theme: {
    colors: {
      bgObsidian: '#090C15',
      bgCard: 'rgba(13, 17, 30, 0.72)',
      bgGlass: 'rgba(20, 26, 45, 0.55)',
      bgGlassHover: 'rgba(30, 41, 69, 0.65)',
      borderGlass: 'rgba(0, 242, 254, 0.22)',
      borderGlassHover: 'rgba(0, 242, 254, 0.65)',
      accentCyan: '#00F2FE',
      accentBlue: '#4FACFE',
      accentGlow: 'rgba(0, 242, 254, 0.4)',
      accentEmerald: '#10B981',
      accentAmber: '#F59E0B',
      accentRose: '#F43F5E',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      modeIndicator: '#00F2FE',
      hudGlow: '0 0 25px rgba(0, 242, 254, 0.35)',
      cardBorderRadius: '12px',
      transitionSpeed: '0.2s'
    },
    fonts: {
      sans: "'Plus Jakarta Sans', sans-serif",
      display: "'Syne', sans-serif",
      mono: "'JetBrains Mono', monospace"
    },
    shadows: {
      cyberGlow: '0 0 30px rgba(0, 242, 254, 0.25)',
      emeraldGlow: '0 0 30px rgba(16, 185, 129, 0.35)',
      cardShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      buttonGlow: '0 0 16px rgba(0, 242, 254, 0.5)'
    }
  },
  utils: {
    glassmorphism: () => ({
      backgroundColor: '$bgGlass',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid $borderGlass',
      boxShadow: '$cardShadow'
    })
  }
});

// Frustration-Reactive "Calm" Theme: Warm, soothing, organic breathing curve
export const calmTheme = createTheme('calm-mode', {
  colors: {
    bgObsidian: '#0E0D14',
    bgCard: 'rgba(26, 20, 32, 0.78)',
    bgGlass: 'rgba(38, 28, 48, 0.65)',
    bgGlassHover: 'rgba(50, 38, 62, 0.75)',
    borderGlass: 'rgba(255, 158, 100, 0.35)',
    borderGlassHover: 'rgba(255, 158, 100, 0.75)',
    accentCyan: '#FF9E64',
    accentBlue: '#70A288',
    accentGlow: 'rgba(255, 158, 100, 0.4)',
    accentEmerald: '#34D399',
    accentAmber: '#FBBF24',
    accentRose: '#FB7185',
    textPrimary: '#FFF7ED',
    textSecondary: '#E2D5C3',
    textMuted: '#A89989',
    modeIndicator: '#FF9E64',
    hudGlow: '0 0 40px rgba(255, 158, 100, 0.45)',
    cardBorderRadius: '24px',
    transitionSpeed: '0.65s'
  },
  shadows: {
    cyberGlow: '0 0 35px rgba(255, 158, 100, 0.35)',
    emeraldGlow: '0 0 35px rgba(52, 211, 153, 0.4)',
    cardShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.55)',
    buttonGlow: '0 0 20px rgba(255, 158, 100, 0.5)'
  }
});

// Keyframe Animations & Physics
export const pulseGlow = keyframes({
  '0%, 100%': { opacity: 0.7, transform: 'scale(1)' },
  '50%': { opacity: 1, transform: 'scale(1.02)' }
});

export const floatAnim = keyframes({
  '0%, 100%': { transform: 'translateY(0px)' },
  '50%': { transform: 'translateY(-4px)' }
});

export const shimmer = keyframes({
  '0%': { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' }
});

export const beamFlow = keyframes({
  '0%': { strokeDashoffset: '100' },
  '100%': { strokeDashoffset: '0' }
});

export const borderRotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' }
});

/**
 * Artisan Physics-based Motion Tokens
 * Calibrated for instant responsiveness and tactile human feel (anti-AI slop).
 */
export const MOTION_TOKENS = {
  // Micro-interactions: buttons, pills, toggles, icon states (<150ms settle)
  snappy: { type: 'spring' as const, stiffness: 520, damping: 36, mass: 0.6 },
  
  // Spatial transitions: modals, drawer reveals, tab glides
  spatial: { type: 'spring' as const, stiffness: 260, damping: 26, mass: 0.8 },
  
  // Organic & continuous: theme morphs, DAG node transitions, canvas smoothing
  smooth: { type: 'spring' as const, stiffness: 170, damping: 28, mass: 1.0 },

  // Elastic pop for completions
  elasticPop: { type: 'spring' as const, stiffness: 400, damping: 18, mass: 0.7 },
  
  // Bezier curves for CSS transitions
  easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)'
};

