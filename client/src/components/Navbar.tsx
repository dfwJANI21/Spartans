/**
 * Navbar.tsx
 * Google Workspace for Education Navigation Header
 * Features Google 4-Color Identity, Material Design 3 Navigation Tabs,
 * and Gemini Live Telemetry Status.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { styled, MOTION_TOKENS } from '../stitches.config';
import { Sparkles, Radio, LayoutGrid, Compass, Headphones } from 'lucide-react';

const NavHeader = styled('header', {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  width: '100%',
  padding: '12px 28px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderBottom: '1px solid #dadce0',
  backdropFilter: 'blur(16px)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 1px 2px 0 rgba(60, 64, 67, 0.08)'
});

const BrandGroup = styled(motion.div, {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer'
});

const GoogleLogoWrapper = styled(motion.div, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const BrandTitleContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
});

const GoogleWordmark = styled('div', {
  fontFamily: '$display',
  fontSize: '1.3rem',
  fontWeight: 500,
  letterSpacing: '-0.02em',
  display: 'flex',
  alignItems: 'center'
});

const EducationBadge = styled('span', {
  color: '$textSecondary',
  fontFamily: '$sans',
  fontSize: '1rem',
  fontWeight: 400,
  letterSpacing: '-0.01em',
  marginLeft: '4px'
});

const GeminiPill = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '2px 8px',
  borderRadius: '6px',
  background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.12) 0%, rgba(155, 114, 203, 0.14) 100%)',
  border: '1px solid rgba(66, 133, 244, 0.25)',
  color: '#1a73e8',
  fontSize: '0.74rem',
  fontWeight: 600,
  letterSpacing: '0.02em'
});

const NavActions = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
});

const NavButton = styled(motion.button, {
  position: 'relative',
  background: 'transparent',
  border: 'none',
  borderRadius: '24px',
  padding: '8px 18px',
  color: '$textSecondary',
  fontSize: '0.85rem',
  fontFamily: '$sans',
  fontWeight: 500,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'color 0.2s ease, background-color 0.2s ease',
  zIndex: 1,

  variants: {
    active: {
      true: {
        color: '#1a73e8',
        fontWeight: 600
      }
    }
  },

  '&:hover': {
    color: '#202124',
    backgroundColor: '#f1f3f4'
  }
});

const ActiveNavGlider = styled(motion.div, {
  position: 'absolute',
  inset: 0,
  borderRadius: '24px',
  backgroundColor: '#e8f0fe',
  border: '1px solid rgba(26, 115, 232, 0.25)',
  zIndex: -1
});

const StatusPill = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 14px',
  borderRadius: '20px',
  backgroundColor: '#e6f4ea',
  border: '1px solid rgba(52, 168, 83, 0.3)',
  color: '#137333',
  fontSize: '0.75rem',
  fontFamily: '$sans',
  fontWeight: 500
});

const PulseDot = styled(motion.span, {
  width: '7px',
  height: '7px',
  borderRadius: '50%',
  backgroundColor: '#34a853',
  boxShadow: '0 0 6px rgba(52, 168, 83, 0.6)'
});

const GoogleAppsIcon = styled(motion.button, {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#5f6368',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',

  '&:hover': {
    backgroundColor: '#f1f3f4',
    color: '#202124'
  }
});

const AvatarCircle = styled('div', {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #4285f4 0%, #1a73e8 100%)',
  color: '#ffffff',
  fontSize: '0.85rem',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 1px 3px rgba(60, 64, 67, 0.2)'
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
        <GoogleLogoWrapper>
          <svg width="26" height="26" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
        </GoogleLogoWrapper>
        <BrandTitleContainer>
          <GoogleWordmark>
            <span style={{ color: '#4285F4' }}>G</span>
            <span style={{ color: '#EA4335' }}>o</span>
            <span style={{ color: '#FBBC05' }}>o</span>
            <span style={{ color: '#4285F4' }}>g</span>
            <span style={{ color: '#34A853' }}>l</span>
            <span style={{ color: '#EA4335' }}>e</span>
            <EducationBadge>for Education</EducationBadge>
          </GoogleWordmark>
          <GeminiPill>
            <Sparkles size={11} />
            <span>Omni-Teach</span>
          </GeminiPill>
        </BrandTitleContainer>
      </BrandGroup>

      <NavActions>
        <StatusPill>
          <PulseDot
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <Radio size={12} />
          <span>Gemini Live API • Active</span>
        </StatusPill>

        <NavButton
          active={currentView === 'dashboard'}
          onClick={() => onNavigate('dashboard')}
          whileTap={{ scale: 0.97 }}
        >
          {currentView === 'dashboard' && (
            <ActiveNavGlider
              layoutId="activeNavPill"
              transition={MOTION_TOKENS.spatial}
            />
          )}
          <Compass size={16} />
          <span>Curriculum Studio</span>
        </NavButton>

        <NavButton
          active={currentView === 'tutor'}
          onClick={() => onNavigate('tutor')}
          disabled={!activeLessonId}
          style={{ opacity: !activeLessonId ? 0.45 : 1, cursor: !activeLessonId ? 'not-allowed' : 'pointer' }}
          whileTap={{ scale: !activeLessonId ? 1 : 0.97 }}
        >
          {currentView === 'tutor' && (
            <ActiveNavGlider
              layoutId="activeNavPill"
              transition={MOTION_TOKENS.spatial}
            />
          )}
          <Headphones size={16} />
          <span>Live Socratic Room {activeLessonId ? `(${activeLessonId.slice(0, 6)})` : ''}</span>
        </NavButton>

        {/* Google Apps launcher grid icon */}
        <GoogleAppsIcon title="Google Apps" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <LayoutGrid size={18} />
        </GoogleAppsIcon>

        <AvatarCircle title="Google Account">
          G
        </AvatarCircle>
      </NavActions>
    </NavHeader>
  );
};
