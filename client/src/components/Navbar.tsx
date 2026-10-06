/**
 * Navbar.tsx
 * Serenity Luxury Wellness & Mindful Pedagogy Navigation Header
 */

import React from 'react';
import { motion } from 'framer-motion';
import { styled, MOTION_TOKENS } from '../stitches.config';
import { Sparkles, Radio, Layers, Compass } from 'lucide-react';

const NavHeader = styled('header', {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  width: '100%',
  padding: '16px 36px',
  backgroundColor: 'rgba(251, 249, 244, 0.94)',
  borderBottom: '1px solid #e5dfd3',
  backdropFilter: 'blur(16px)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 6px 30px -12px rgba(70, 55, 40, 0.08)'
});

const BrandGroup = styled(motion.div, {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  cursor: 'pointer'
});

const BrandLogo = styled(motion.div, {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #7c9a6d 0%, #5f7d52 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  boxShadow: '0 6px 18px rgba(124, 154, 109, 0.35)',
  border: '1px solid rgba(212, 185, 150, 0.5)'
});

const BrandName = styled('h1', {
  fontFamily: '$display',
  fontSize: '1.45rem',
  fontWeight: 600,
  letterSpacing: '-0.01em',
  color: '$textPrimary',
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',

  '& em': {
    fontStyle: 'italic',
    background: 'linear-gradient(135deg, #b89066, #d4b996)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 500
  }
});

const NavActions = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '14px'
});

const NavButton = styled(motion.button, {
  position: 'relative',
  background: 'transparent',
  border: 'none',
  borderRadius: '9999px',
  padding: '10px 20px',
  color: '$textSecondary',
  fontSize: '0.82rem',
  fontFamily: '$sans',
  fontWeight: 500,
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'color 0.25s ease',
  zIndex: 1,

  variants: {
    active: {
      true: {
        color: '$accentSageDeep',
        fontWeight: 600
      }
    }
  },

  '&:hover': {
    color: '$textPrimary'
  }
});

const ActiveNavGlider = styled(motion.div, {
  position: 'absolute',
  inset: 0,
  borderRadius: '9999px',
  backgroundColor: 'rgba(124, 154, 109, 0.14)',
  border: '1px solid rgba(124, 154, 109, 0.35)',
  boxShadow: '0 4px 15px rgba(124, 154, 109, 0.15)',
  zIndex: -1
});

const StatusPill = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 14px',
  borderRadius: '9999px',
  backgroundColor: 'rgba(124, 154, 109, 0.1)',
  border: '1px solid rgba(124, 154, 109, 0.25)',
  color: '$accentSageDeep',
  fontSize: '0.72rem',
  fontFamily: '$sans',
  fontWeight: 500,
  letterSpacing: '0.04em',
  textTransform: 'uppercase'
});

const PulseDot = styled(motion.span, {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: '$accentSage',
  boxShadow: '0 0 8px rgba(124, 154, 109, 0.6)'
});

interface NavbarProps {
  currentView: 'dashboard' | 'tutor';
  onNavigate: (view: 'dashboard' | 'tutor') => void;
  activeLessonId?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, activeLessonId }) => {
  return (
    <NavHeader>
      <BrandGroup
        onClick={() => onNavigate('dashboard')}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={MOTION_TOKENS.snappy}
      >
        <BrandLogo
          whileHover={{ rotate: 12, scale: 1.05 }}
          transition={MOTION_TOKENS.snappy}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6"/>
          </svg>
        </BrandLogo>
        <BrandName>
          <span>Serenity</span>
          <em>Sanctuary AI</em>
        </BrandName>
      </BrandGroup>

      <NavActions>
        <StatusPill>
          <PulseDot
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <Radio size={12} />
          <span>Gemini Live Sanctuary: Active</span>
        </StatusPill>

        <NavButton
          active={currentView === 'dashboard'}
          onClick={() => onNavigate('dashboard')}
          whileTap={{ scale: 0.96 }}
        >
          {currentView === 'dashboard' && (
            <ActiveNavGlider
              layoutId="activeNavPill"
              transition={MOTION_TOKENS.spatial}
            />
          )}
          <Compass size={15} />
          <span>Curriculum Studio</span>
        </NavButton>

        <NavButton
          active={currentView === 'tutor'}
          onClick={() => onNavigate('tutor')}
          disabled={!activeLessonId}
          style={{ opacity: !activeLessonId ? 0.45 : 1, cursor: !activeLessonId ? 'not-allowed' : 'pointer' }}
          whileTap={{ scale: !activeLessonId ? 1 : 0.96 }}
        >
          {currentView === 'tutor' && (
            <ActiveNavGlider
              layoutId="activeNavPill"
              transition={MOTION_TOKENS.spatial}
            />
          )}
          <Radio size={15} />
          <span>Voice Sanctuary {activeLessonId ? `(${activeLessonId.slice(0, 8)})` : ''}</span>
        </NavButton>
      </NavActions>
    </NavHeader>
  );
};
