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
      // Serenity Wellness Spa Core Palette (Alabaster Linen, Sage Green, Champagne Gold, Walnut)
      bgObsidian: '#fbf9f4',
      bgLinen: '#fbf9f4',
      bgCard: '#ffffff',
      bgGlass: 'rgba(255, 255, 255, 0.88)',
      bgGlassHover: 'rgba(248, 246, 241, 0.95)',
      borderGlass: '#e5dfd3',
      borderGlassHover: '#d4b996',
      accentCyan: '#7c9a6d', // Serenity Sage
      accentSage: '#7c9a6d',
      accentBlue: '#5f7d52', // Deep Forest Sage
      accentSageDeep: '#5f7d52',
      accentGlow: 'rgba(124, 154, 109, 0.25)',
      accentEmerald: '#5f7d52',
      accentAmber: '#d4b996', // Champagne Gold
      accentGold: '#d4b996',
      accentRose: '#c27d60', // Terracotta Warmth
      accentWalnut: '#8b6b4a',
      accentEucalyptus: '#9ab88d',
      textPrimary: '#2e2a24', // Charcoal Espresso
      textSecondary: '#6b6357', // Muted Earth
      textMuted: '#968c7e',
      modeIndicator: '#7c9a6d',
      hudGlow: '0 0 30px rgba(124, 154, 109, 0.2)',
      cardBorderRadius: '20px',
      transitionSpeed: '0.3s'
    },
    fonts: {
      sans: "'Inter', system-ui, -apple-system, sans-serif",
      display: "'Cormorant Garamond', Georgia, serif",
      mono: "'JetBrains Mono', monospace"
    },
    shadows: {
      cyberGlow: '0 10px 30px -10px rgba(124, 154, 109, 0.35)',
      emeraldGlow: '0 10px 30px -10px rgba(95, 125, 82, 0.35)',
      cardShadow: '0 20px 40px -15px rgba(70, 55, 40, 0.12)',
      shadowOrganic: '0 30px 60px -30px rgba(70, 55, 40, 0.22), 0 18px 36px -28px rgba(70, 55, 40, 0.16)',
      shadowSoft: '0 10px 30px -12px rgba(70, 55, 40, 0.12)',
      buttonGlow: '0 6px 20px rgba(124, 154, 109, 0.35)'
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

// Frustration-Reactive "Calm Mindful" Theme: Warm Golden Hour & Sandstone Retreat
export const calmTheme = createTheme('calm-mode', {
  colors: {
    bgObsidian: '#f6f1e7',
    bgCard: '#fcfbf8',
    bgGlass: 'rgba(255, 252, 245, 0.92)',
    bgGlassHover: 'rgba(250, 244, 232, 0.95)',
    borderGlass: 'rgba(212, 185, 150, 0.55)',
    borderGlassHover: 'rgba(212, 185, 150, 0.95)',
    accentCyan: '#d4b996', // Champagne Gold
    accentBlue: '#8b6b4a', // Walnut
    accentGlow: 'rgba(212, 185, 150, 0.35)',
    accentEmerald: '#7c9a6d',
    accentAmber: '#d4b996',
    accentRose: '#c27d60',
    textPrimary: '#26201a',
    textSecondary: '#6b6357',
    textMuted: '#9e9486',
    modeIndicator: '#d4b996',
    hudGlow: '0 0 35px rgba(212, 185, 150, 0.35)',
    cardBorderRadius: '24px',
    transitionSpeed: '0.65s'
  },
  shadows: {
    cyberGlow: '0 12px 35px rgba(212, 185, 150, 0.35)',
    emeraldGlow: '0 12px 35px rgba(124, 154, 109, 0.3)',
    cardShadow: '0 24px 50px rgba(70, 55, 40, 0.14)',
    buttonGlow: '0 6px 24px rgba(212, 185, 150, 0.4)'
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

