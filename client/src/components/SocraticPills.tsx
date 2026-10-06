/**
 * SocraticPills.tsx
 * Dynamic UI action pills for interactive Socratic prompts:
 * "Hint", "Explain simply", "Spawn Debate Mode", "Real-world Analogy"
 */

import React from 'react';
import { motion } from 'framer-motion';
import { styled, MOTION_TOKENS } from '../stitches.config';
import { Lightbulb, Brain, Swords, Globe2 } from 'lucide-react';

const PillsContainer = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 0'
});

const PillButton = styled(motion.button, {
  background: '#ffffff',
  border: '1px solid #e5dfd3',
  borderRadius: '9999px',
  padding: '10px 20px',
  fontSize: '0.86rem',
  fontFamily: '$sans',
  fontWeight: 600,
  color: '$textPrimary',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  boxShadow: '0 2px 10px rgba(70, 55, 40, 0.05)',
  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',

  '&:hover': {
    borderColor: '$accentSage',
    backgroundColor: 'rgba(124, 154, 109, 0.08)',
    color: '$accentSageDeep',
    boxShadow: '0 4px 14px rgba(124, 154, 109, 0.18)'
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
          borderColor: '$accentGold',
          color: '$accentWalnut',
          backgroundColor: 'rgba(212, 185, 150, 0.15)'
        }
      },
      debate: {
        '&:hover': {
          borderColor: '$accentRose',
          color: '$accentRose',
          backgroundColor: 'rgba(194, 125, 96, 0.12)'
        }
      },
      simple: {
        '&:hover': {
          borderColor: '$accentSage',
          color: '$accentSageDeep',
          backgroundColor: 'rgba(124, 154, 109, 0.12)'
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
      label: '💡 Give Me a Hint',
      intent: 'hint' as const,
      prompt: 'Can you give me a subtle Socratic hint without directly giving me the answer?',
      icon: Lightbulb
    },
    {
      label: '🧠 Explain Simply',
      intent: 'simple' as const,
      prompt: 'Can you deconstruct this concept using a simple intuition pump or everyday analogy?',
      icon: Brain
    },
    {
      label: '⚔️ Spawn Debate Mode',
      intent: 'debate' as const,
      prompt: 'Spawn Socratic Debate Mode! Challenge my perspective and play devil\'s advocate against my reasoning.',
      icon: Swords
    },
    {
      label: '🌍 Real-World Analogy',
      intent: 'simple' as const,
      prompt: 'How does this principle manifest in contemporary real-world technology or daily phenomena?',
      icon: Globe2
    }
  ];

  return (
    <PillsContainer>
      {actions.map((act, i) => {
        const IconComponent = act.icon;
        return (
          <PillButton
            key={i}
            intent={act.intent}
            disabled={disabled}
            onClick={() => onAction(act.prompt)}
            whileHover={{ y: disabled ? 0 : -2, scale: disabled ? 1 : 1.03 }}
            whileTap={{ scale: disabled ? 1 : 0.96 }}
            transition={MOTION_TOKENS.snappy}
          >
            <IconComponent size={15} />
            <span>{act.label}</span>
          </PillButton>
        );
      })}
    </PillsContainer>
  );
};
