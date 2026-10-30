/**
 * SocraticPills.tsx
 * Google Material Design 3 Interactive Prompt Chips
 * Provides quick Socratic interactions: Hint, Simplify, Debate Mode, and Analogy.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { styled, MOTION_TOKENS } from '../stitches.config';
import { Lightbulb, Brain, Swords, Globe2 } from 'lucide-react';

const PillsContainer = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 0'
});

const PillButton = styled(motion.button, {
  background: '#ffffff',
  border: '1px solid #dadce0',
  borderRadius: '20px',
  padding: '8px 16px',
  fontSize: '0.82rem',
  fontFamily: '$sans',
  fontWeight: 500,
  color: '$textPrimary',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  boxShadow: '0 1px 2px rgba(60, 64, 67, 0.08)',
  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',

  '&:hover': {
    borderColor: '#1a73e8',
    backgroundColor: '#e8f0fe',
    color: '#1a73e8',
    boxShadow: '0 1px 3px rgba(60, 64, 67, 0.16)'
  },

  '&:disabled': {
    opacity: 0.45,
    cursor: 'not-allowed',
    transform: 'none !important'
  },

  variants: {
    intent: {
      hint: {
        '&:hover': {
          borderColor: '#fbbc04',
          color: '#b06000',
          backgroundColor: '#fef7e0'
        }
      },
      debate: {
        '&:hover': {
          borderColor: '#ea4335',
          color: '#c5221f',
          backgroundColor: '#fce8e6'
        }
      },
      simple: {
        '&:hover': {
          borderColor: '#1a73e8',
          color: '#1a73e8',
          backgroundColor: '#e8f0fe'
        }
      },
      analogy: {
        '&:hover': {
          borderColor: '#34a853',
          color: '#137333',
          backgroundColor: '#e6f4ea'
        }
      }
    }
  }
});

interface SocraticPillsProps {
  onAction: (prompt: string) => void;
  disabled?: boolean;
}

export const SocraticPills: React.FC<SocraticPillsProps> = ({ onAction, disabled = false }) => {
  const actions = [
    {
      label: 'Give Me a Hint',
      intent: 'hint' as const,
      prompt: 'Can you give me a subtle Socratic hint without directly giving me the answer?',
      icon: Lightbulb,
      color: '#fbbc04'
    },
    {
      label: 'Explain Simply',
      intent: 'simple' as const,
      prompt: 'Can you deconstruct this concept using a simple intuition pump or everyday analogy?',
      icon: Brain,
      color: '#1a73e8'
    },
    {
      label: 'Spawn Debate Mode',
      intent: 'debate' as const,
      prompt: 'Spawn Socratic Debate Mode! Challenge my perspective and play devil\'s advocate against my reasoning.',
      icon: Swords,
      color: '#ea4335'
    },
    {
      label: 'Real-World Analogy',
      intent: 'analogy' as const,
      prompt: 'Can you connect this concept to a concrete real-world engineering or scientific scenario?',
      icon: Globe2,
      color: '#34a853'
    }
  ];

  return (
    <PillsContainer>
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <PillButton
            key={act.label}
            intent={act.intent}
            disabled={disabled}
            onClick={() => onAction(act.prompt)}
            whileHover={{ y: -1, scale: disabled ? 1 : 1.01 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            transition={MOTION_TOKENS.snappy}
          >
            <Icon size={14} color={act.color} />
            <span>{act.label}</span>
          </PillButton>
        );
      })}
    </PillsContainer>
  );
};
