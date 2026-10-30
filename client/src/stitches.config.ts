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
      // Google Brand & Material Design 3 Palette
      bgObsidian: '#f8f9fa',
      bgLinen: '#f8f9fa',
      bgCard: '#ffffff',
      bgGlass: 'rgba(255, 255, 255, 0.96)',
      bgGlassHover: 'rgba(241, 243, 244, 0.95)',
      borderGlass: '#dadce0',
      borderGlassHover: '#1a73e8',
      
      // Google Core 4 Colors
      accentBlue: '#1a73e8',       // Google Blue
      accentBlueHover: '#1557b0',
      accentBlueSubtle: '#e8f0fe',
      accentRed: '#ea4335',        // Google Red
      accentAmber: '#fbbc04',      // Google Yellow
      accentGold: '#fbbc04',
      accentEmerald: '#34a853',    // Google Green
      accentGreen: '#34a853',
      
      // Gemini AI Multi-Tone Accents
      accentCyan: '#1a73e8',
      accentSage: '#1a73e8',
      accentSageDeep: '#1557b0',
      accentGlow: 'rgba(26, 115, 232, 0.22)',
      accentRose: '#ea4335',
      accentWalnut: '#b06000',
      accentEucalyptus: '#1e8e3e',
      geminiPurple: '#9b72cb',
      
      // Google Workspace App Specific
      googleDocs: '#4285f4',
      googleForms: '#7248b9',
      googleDrive: '#34a853',
      googleMeet: '#00ac47',
      
      // Google Typography
      textPrimary: '#202124',
      textSecondary: '#5f6368',
      textMuted: '#80868b',
      
      modeIndicator: '#1a73e8',
      hudGlow: '0 0 24px rgba(26, 115, 232, 0.2)',
      cardBorderRadius: '16px',
      transitionSpeed: '0.2s'
    },
    fonts: {
      sans: "'Google Sans Text', 'Google Sans', 'Roboto', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      display: "'Google Sans', 'Roboto', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'Roboto Mono', 'SFMono-Regular', Consolas, monospace"
    },
    shadows: {
      cyberGlow: '0 4px 16px rgba(26, 115, 232, 0.25)',
      emeraldGlow: '0 4px 16px rgba(52, 168, 83, 0.25)',
      cardShadow: '0 1px 3px 0 rgba(60, 64, 67, 0.12), 0 2px 6px 2px rgba(60, 64, 67, 0.08)',
      shadowOrganic: '0 2px 8px 0 rgba(60, 64, 67, 0.16), 0 1px 3px 1px rgba(60, 64, 67, 0.1)',
      shadowSoft: '0 1px 2px 0 rgba(60, 64, 67, 0.15)',
      buttonGlow: '0 2px 6px rgba(26, 115, 232, 0.35)'
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

// Adaptive Mindful Mode (Soft Google Indigo / Green Palette)
export const calmTheme = createTheme('calm-mode', {
  colors: {
    bgObsidian: '#f1f3f4',
    bgCard: '#ffffff',
    bgGlass: 'rgba(255, 255, 255, 0.95)',
    bgGlassHover: 'rgba(232, 240, 254, 0.9)',
    borderGlass: '#dadce0',
    borderGlassHover: '#34a853',
    accentCyan: '#34a853',
    accentBlue: '#1a73e8',
    accentGlow: 'rgba(52, 168, 83, 0.22)',
    accentEmerald: '#34a853',
    accentAmber: '#fbbc04',
    accentRose: '#ea4335',
    textPrimary: '#202124',
    textSecondary: '#5f6368',
    textMuted: '#80868b',
    modeIndicator: '#34a853',
    hudGlow: '0 0 24px rgba(52, 168, 83, 0.2)',
    cardBorderRadius: '16px',
    transitionSpeed: '0.4s'
  },
  shadows: {
    cyberGlow: '0 4px 16px rgba(52, 168, 83, 0.25)',
    emeraldGlow: '0 4px 16px rgba(52, 168, 83, 0.25)',
    cardShadow: '0 1px 3px 0 rgba(60, 64, 67, 0.12), 0 2px 6px 2px rgba(60, 64, 67, 0.08)',
    buttonGlow: '0 2px 6px rgba(52, 168, 83, 0.35)'
  }
});

// Google 4-Color Beam & Elevation Animations
export const pulseGlow = keyframes({
  '0%, 100%': { opacity: 0.8, transform: 'scale(1)' },
  '50%': { opacity: 1, transform: 'scale(1.02)' }
});

export const floatAnim = keyframes({
  '0%, 100%': { transform: 'translateY(0px)' },
  '50%': { transform: 'translateY(-3px)' }
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
 * Google Material Design 3 Motion Tokens
 */
export const MOTION_TOKENS = {
  // Micro-interactions: buttons, pills, toggles (<150ms settle)
  snappy: { type: 'spring' as const, stiffness: 450, damping: 32, mass: 0.5 },
  
  // Spatial transitions: modals, drawer reveals, tab glides
  spatial: { type: 'spring' as const, stiffness: 280, damping: 28, mass: 0.7 },
  
  // Smooth continuous: theme morphs, DAG node transitions
  smooth: { type: 'spring' as const, stiffness: 200, damping: 26, mass: 0.9 },

  // Elastic pop for celebrations
  elasticPop: { type: 'spring' as const, stiffness: 350, damping: 20, mass: 0.6 },
  
  // Material Design 3 Easing
  easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)'
};
