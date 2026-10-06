/**
 * ExecutionDAG.tsx
 * Live interactive Directed Acyclic Graph (DAG) Pipeline.
 * Features an SVG animated energy conduit connecting nodes, elastic micro-settles,
 * and kinetic multi-agent telemetry indicators.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styled, keyframes, MOTION_TOKENS } from '../stitches.config';
import { 
  UploadCloud, 
  Sparkles, 
  Search, 
  Layers, 
  Headphones, 
  CheckCircle2, 
  Zap,
  Activity
} from 'lucide-react';

export interface DAGStep {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

export const DAG_STEPS: DAGStep[] = [
  {
    id: 'UPLOAD',
    label: 'Multimodal Ingestion',
    description: 'Raw documents, images & curriculum specs',
    icon: UploadCloud
  },
  {
    id: 'IMAGEN',
    label: 'Gemini 3 Pro Image',
    description: 'Studio-quality visual asset synthesis',
    icon: Sparkles
  },
  {
    id: 'GROUNDING',
    label: 'Google Search Grounding',
    description: 'Vertex AI factual verification & citations',
    icon: Search
  },
  {
    id: 'WORKSPACE',
    label: 'Workspace Orchestrator',
    description: 'Drive folder, Google Doc & Graded Form',
    icon: Layers
  },
  {
    id: 'LIVE_READY',
    label: 'Live Agent Ready',
    description: '16kHz Socratic Voice HUD initialized',
    icon: Headphones
  }
];

const conicGlow = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' }
});

const DAGContainer = styled('div', {
  width: '100%',
  padding: '28px 24px',
  borderRadius: '$cardBorderRadius',
  backgroundColor: '$bgCard',
  border: '1px solid $borderGlass',
  backdropFilter: 'blur(20px)',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '$cardShadow'
});

const HeaderRow = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
  zIndex: 2
});

const Title = styled('h3', {
  fontFamily: '$display',
  fontSize: '1.05rem',
  color: '$textPrimary',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  letterSpacing: '0.03em'
});

const StepBadge = styled('div', {
  fontFamily: '$sans',
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.03em',
  padding: '6px 16px',
  borderRadius: '9999px',
  backgroundColor: 'rgba(124, 154, 109, 0.12)',
  color: '$accentSageDeep',
  border: '1px solid rgba(124, 154, 109, 0.3)',
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
});

const NodesTrack = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
  gap: '14px',
  position: 'relative',
  zIndex: 1
});

const ConduitLine = styled('div', {
  position: 'absolute',
  top: '32px',
  left: '5%',
  right: '5%',
  height: '2px',
  background: '#e5dfd3',
  zIndex: 0,
  pointerEvents: 'none',

  '@media (max-width: 900px)': {
    display: 'none'
  }
});

const ActiveConduitBeam = styled(motion.div, {
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  background: 'linear-gradient(90deg, #7c9a6d 0%, #d4b996 50%, #5f7d52 100%)',
  boxShadow: '0 0 14px rgba(124, 154, 109, 0.45)'
});

const NodeCardWrapper = styled(motion.div, {
  position: 'relative',
  borderRadius: '16px',
  padding: '1px',
  overflow: 'hidden'
});

const ActiveGlowBorder = styled('div', {
  position: 'absolute',
  inset: '-50%',
  background: 'conic-gradient(from 0deg, transparent 0deg, #7c9a6d 90deg, transparent 180deg, #d4b996 270deg, transparent 360deg)',
  animation: `${conicGlow} 3s linear infinite`,
  zIndex: 0
});

const NodeCard = styled('div', {
  padding: '18px',
  borderRadius: '15px',
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  position: 'relative',
  zIndex: 1,
  height: '100%',
  border: '1px solid #e5dfd3',
  boxShadow: '0 4px 14px rgba(70, 55, 40, 0.04)',
  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',

  variants: {
    state: {
      pending: {
        opacity: 0.55,
        backgroundColor: '#fbf9f4',
        borderColor: '#ede8df'
      },
      active: {
        opacity: 1,
        backgroundColor: '#ffffff',
        borderColor: '$accentSage',
        boxShadow: '0 8px 24px rgba(124, 154, 109, 0.2)'
      },
      complete: {
        opacity: 1,
        backgroundColor: 'rgba(124, 154, 109, 0.06)',
        borderColor: '$accentSageDeep',
        boxShadow: '0 4px 16px rgba(124, 154, 109, 0.15)'
      }
    }
  }
});

const NodeHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
});

const IconWrapper = styled('div', {
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f3efe8',
  color: '$textSecondary',
  transition: 'all 0.3s ease',

  variants: {
    state: {
      pending: { color: '$textMuted' },
      active: { 
        backgroundColor: 'rgba(124, 154, 109, 0.16)', 
        color: '$accentSageDeep',
        boxShadow: '0 0 14px rgba(124, 154, 109, 0.25)'
      },
      complete: { 
        backgroundColor: 'rgba(124, 154, 109, 0.2)', 
        color: '$accentSageDeep',
        boxShadow: '0 0 12px rgba(124, 154, 109, 0.2)'
      }
    }
  }
});

const NodeTitle = styled('div', {
  fontSize: '0.88rem',
  fontWeight: 700,
  color: '$textPrimary',
  letterSpacing: '-0.01em'
});

const NodeDesc = styled('div', {
  fontSize: '0.74rem',
  color: '$textSecondary',
  lineHeight: 1.45
});

interface ExecutionDAGProps {
  currentStepIndex: number;
  isProcessing: boolean;
}

export const ExecutionDAG: React.FC<ExecutionDAGProps> = ({
  currentStepIndex,
  isProcessing
}) => {
  const conduitProgress = isProcessing 
    ? ((currentStepIndex + 0.5) / DAG_STEPS.length) * 100 
    : currentStepIndex === DAG_STEPS.length - 1 
      ? 100 
      : 0;

  return (
    <DAGContainer>
      <HeaderRow>
        <Title>
          <Sparkles size={18} color="#7c9a6d" />
          <span>Mindful Execution Sanctuary (DAG Pipeline)</span>
        </Title>
        <StepBadge>
          {isProcessing ? (
            <>
              <Activity size={12} className="animate-pulse" />
              <span>Step {Math.min(currentStepIndex + 1, DAG_STEPS.length)} of {DAG_STEPS.length} Synthesizing</span>
            </>
          ) : (
            <>
              <Zap size={12} />
              <span>Pipeline Fully Synchronized</span>
            </>
          )}
        </StepBadge>
      </HeaderRow>

      <div style={{ position: 'relative' }}>
        {/* SVG Energy Conduit connecting nodes */}
        <ConduitLine>
          <ActiveConduitBeam
            initial={{ width: '0%' }}
            animate={{ width: `${conduitProgress}%` }}
            transition={MOTION_TOKENS.smooth}
          />
        </ConduitLine>

        <NodesTrack>
          {DAG_STEPS.map((step, idx) => {
            let nodeState: 'pending' | 'active' | 'complete' = 'pending';
            if (idx < currentStepIndex) {
              nodeState = 'complete';
            } else if (idx === currentStepIndex && isProcessing) {
              nodeState = 'active';
            } else if (idx === currentStepIndex && !isProcessing && currentStepIndex === DAG_STEPS.length - 1) {
              nodeState = 'complete';
            }

            const IconComponent = step.icon;

            return (
              <NodeCardWrapper
                key={step.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: nodeState === 'complete' ? [0.97, 1.02, 1] : 1
                }}
                transition={{
                  delay: idx * 0.06,
                  scale: MOTION_TOKENS.elasticPop
                }}
                whileHover={{ y: -3, transition: MOTION_TOKENS.snappy }}
              >
                {nodeState === 'active' && <ActiveGlowBorder />}
                
                <NodeCard state={nodeState}>
                  <NodeHeader>
                    <IconWrapper state={nodeState}>
                      <IconComponent size={18} />
                    </IconWrapper>

                    <AnimatePresence mode="wait">
                      {nodeState === 'complete' && (
                        <motion.div
                          key="complete"
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={MOTION_TOKENS.elasticPop}
                        >
                          <CheckCircle2 size={18} color="#5f7d52" />
                        </motion.div>
                      )}
                      {nodeState === 'active' && (
                        <motion.div
                          key="active"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.2 }}
                        >
                          <Zap size={16} color="#7c9a6d" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </NodeHeader>

                  <div>
                    <NodeTitle>{step.label}</NodeTitle>
                    <NodeDesc>{step.description}</NodeDesc>
                  </div>
                </NodeCard>
              </NodeCardWrapper>
            );
          })}
        </NodesTrack>
      </div>
    </DAGContainer>
  );
};

