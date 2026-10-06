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
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid $borderGlass',
  borderRadius: '9999px',
  padding: '9px 18px',
  fontSize: '0.85rem',
  fontFamily: '$sans',
  fontWeight: 600,
  color: '$textPrimary',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
  transition: 'border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease',

  '&:hover': {
    borderColor: '$borderGlassHover',
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    color: '$accentCyan',
    boxShadow: '$cyberGlow'
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
          borderColor: '$accentAmber',
          color: '$accentAmber',
          backgroundColor: 'rgba(245, 158, 11, 0.1)'
        }
      },
      debate: {
        '&:hover': {
          borderColor: '$accentRose',
          color: '$accentRose',
          backgroundColor: 'rgba(244, 63, 94, 0.1)'
        }
      },
      simple: {
        '&:hover': {
          borderColor: '$accentEmerald',
          color: '$accentEmerald',
          backgroundColor: 'rgba(16, 185, 129, 0.1)'
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
