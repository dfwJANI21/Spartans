/**
 * Navbar.tsx
 * Glassmorphic Cyber-Noir navigation bar with live status telemetry
 */

import React from 'react';
import { motion } from 'framer-motion';
import { styled, MOTION_TOKENS } from '../stitches.config';
import { Zap, Radio, Layers } from 'lucide-react';

const NavHeader = styled('header', {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  width: '100%',
  padding: '14px 32px',
  backgroundColor: 'rgba(9, 12, 21, 0.88)',
  borderBottom: '1px solid $borderGlass',
  backdropFilter: 'blur(20px)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)'
});

const BrandGroup = styled(motion.div, {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer'
});

const BrandLogo = styled(motion.div, {
  width: '38px',
  height: '38px',
  borderRadius: '10px',
  background: 'linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 0 24px rgba(0, 242, 254, 0.5)'
});

const BrandName = styled('h1', {
  fontFamily: '$display',
  fontSize: '1.2rem',
  fontWeight: 800,
  letterSpacing: '0.04em',
  color: '$textPrimary',
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
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
  borderRadius: '10px',
  padding: '9px 18px',
  color: '$textSecondary',
  fontSize: '0.86rem',
  fontFamily: '$sans',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'color 0.2s ease',
  zIndex: 1,

  variants: {
    active: {
      true: {
        color: '$accentCyan'
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
  borderRadius: '10px',
  backgroundColor: 'rgba(0, 242, 254, 0.12)',
  border: '1px solid rgba(0, 242, 254, 0.4)',
  boxShadow: '0 0 16px rgba(0, 242, 254, 0.2)',
  zIndex: -1
});

const StatusPill = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 14px',
  borderRadius: '20px',
  backgroundColor: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid rgba(16, 185, 129, 0.3)',
  color: '$accentEmerald',
  fontSize: '0.75rem',
  fontFamily: '$mono'
});

const PulseDot = styled(motion.span, {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: '$accentEmerald',
  boxShadow: '0 0 8px $accentEmerald'
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
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={MOTION_TOKENS.snappy}
      >
        <BrandLogo
          whileHover={{ rotate: 10 }}
          transition={MOTION_TOKENS.snappy}
        >
          <Zap size={22} color="#090C15" />
        </BrandLogo>
        <BrandName>
          <span>OMNI-TEACH</span>
          <span style={{ color: '#00F2FE', fontWeight: 400 }}>LIVE</span>
        </BrandName>
      </BrandGroup>

      <NavActions>
        <StatusPill>
          <PulseDot
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <Radio size={12} />
          <span>Gemini Multimodal Live WS: Active</span>
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
          <Layers size={16} />
          <span>Teacher Command Center</span>
        </NavButton>

        <NavButton
          active={currentView === 'tutor'}
          onClick={() => onNavigate('tutor')}
          disabled={!activeLessonId}
          style={{ opacity: !activeLessonId ? 0.35 : 1, cursor: !activeLessonId ? 'not-allowed' : 'pointer' }}
          whileTap={{ scale: !activeLessonId ? 1 : 0.96 }}
        >
          {currentView === 'tutor' && (
            <ActiveNavGlider
              layoutId="activeNavPill"
              transition={MOTION_TOKENS.spatial}
            />
          )}
          <Radio size={16} />
          <span>Student Voice HUD {activeLessonId ? `(${activeLessonId.slice(0, 8)})` : ''}</span>
        </NavButton>
      </NavActions>
    </NavHeader>
  );
};
