/**
 * ExecutionDAG.tsx
 * Google Vertex AI Live Pipeline Execution DAG
 * Features Google 4-Color Conduit Beam, Material Design 3 Node Cards,
 * and live agent orchestration telemetry.
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
    description: 'Ingest raw documents, slides & lecture notes',
    icon: UploadCloud
  },
  {
    id: 'IMAGEN',
    label: 'Gemini 3 Pro Studio',
    description: 'High-fidelity pedagogical visual synthesis',
    icon: Sparkles
  },
  {
    id: 'GROUNDING',
    label: 'Google Search Grounding',
    description: 'Vertex AI factual verification & live citations',
    icon: Search
  },
  {
    id: 'WORKSPACE',
    label: 'Workspace Orchestrator',
    description: 'Deploy Google Doc, Graded Form & Drive folder',
    icon: Layers
  },
  {
    id: 'LIVE_READY',
    label: 'Gemini Live Agent',
    description: '16kHz Socratic Voice Classroom ready',
    icon: Headphones
  }
];

const conicGlow = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' }
});

const DAGContainer = styled('div', {
  width: '100%',
  padding: '24px 22px',
  borderRadius: '20px',
  backgroundColor: '$bgCard',
  border: '1px solid #dadce0',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 1px 3px 0 rgba(60, 64, 67, 0.12), 0 2px 6px 2px rgba(60, 64, 67, 0.06)'
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
  fontWeight: 600
});

const StepBadge = styled('div', {
  fontFamily: '$sans',
  fontSize: '0.78rem',
  fontWeight: 600,
  padding: '4px 14px',
  borderRadius: '16px',
  backgroundColor: '#e8f0fe',
  color: '#1a73e8',
  border: '1px solid rgba(26, 115, 232, 0.25)',
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
});

const NodesTrack = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
  gap: '12px',
  position: 'relative',
  zIndex: 1
});

const ConduitLine = styled('div', {
  position: 'absolute',
  top: '32px',
  left: '5%',
  right: '5%',
  height: '3px',
  background: '#e8eaed',
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
  background: 'linear-gradient(90deg, #4285F4 0%, #EA4335 33%, #FBBC05 66%, #34A853 100%)',
  boxShadow: '0 0 10px rgba(66, 133, 244, 0.5)'
});

const NodeCardWrapper = styled(motion.div, {
  position: 'relative',
  borderRadius: '14px',
  padding: '1px',
  overflow: 'hidden'
});

const ActiveGlowBorder = styled('div', {
  position: 'absolute',
  inset: '-50%',
  background: 'conic-gradient(from 0deg, #4285F4, #EA4335, #FBBC05, #34A853, #4285F4)',
  animation: `${conicGlow} 3s linear infinite`,
  zIndex: 0
});

const NodeCard = styled('div', {
  padding: '16px',
  borderRadius: '13px',
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  position: 'relative',
  zIndex: 1,
  height: '100%',
  border: '1px solid #dadce0',
  boxShadow: '0 1px 2px rgba(60, 64, 67, 0.08)',
  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',

  variants: {
    state: {
      pending: {
        opacity: 0.6,
        backgroundColor: '#f8f9fa',
        borderColor: '#e8eaed'
      },
      active: {
        opacity: 1,
        backgroundColor: '#ffffff',
        borderColor: '#1a73e8',
        boxShadow: '0 2px 10px rgba(26, 115, 232, 0.2)'
      },
      complete: {
        opacity: 1,
        backgroundColor: '#f0f9f4',
        borderColor: '#34a853',
        boxShadow: '0 1px 4px rgba(52, 168, 83, 0.15)'
      }
    }
  }
});

const NodeHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
});

const IconBubble = styled('div', {
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',

  variants: {
    state: {
      pending: {
        backgroundColor: '#e8eaed',
        color: '#80868b'
      },
      active: {
        backgroundColor: '#1a73e8',
        color: '#ffffff',
        boxShadow: '0 2px 8px rgba(26, 115, 232, 0.35)'
      },
      complete: {
        backgroundColor: '#34a853',
        color: '#ffffff',
        boxShadow: '0 2px 8px rgba(52, 168, 83, 0.3)'
      }
    }
  }
});

const NodeStatusTag = styled('span', {
  fontSize: '0.72rem',
  fontWeight: 600,
  fontFamily: '$sans',

  variants: {
    state: {
      pending: { color: '#80868b' },
      active: { color: '#1a73e8' },
      complete: { color: '#137333' }
    }
  }
});

const NodeTitle = styled('h4', {
  fontFamily: '$sans',
  fontSize: '0.88rem',
  fontWeight: 600,
  color: '$textPrimary',
  margin: 0
});

const NodeDesc = styled('p', {
  fontFamily: '$sans',
  fontSize: '0.76rem',
  color: '$textSecondary',
  margin: 0,
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
  const getStepState = (index: number) => {
    if (index < currentStepIndex) return 'complete';
    if (index === currentStepIndex) return isProcessing ? 'active' : 'complete';
    return 'pending';
  };

  const progressPercent = Math.min(100, Math.max(0, (currentStepIndex / (DAG_STEPS.length - 1)) * 100));

  return (
    <DAGContainer>
      <HeaderRow>
        <Title>
          <Activity size={18} color="#1a73e8" />
          <span>Google Vertex AI Synthesis Pipeline</span>
        </Title>
        <StepBadge>
          <span>Step {Math.min(currentStepIndex + 1, DAG_STEPS.length)} of {DAG_STEPS.length}</span>
          <span>•</span>
          <span>{isProcessing ? 'Synthesizing...' : 'Pipeline Ready'}</span>
        </StepBadge>
      </HeaderRow>

      <div style={{ position: 'relative', width: '100%' }}>
        <ConduitLine>
          <ActiveConduitBeam
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={MOTION_TOKENS.smooth}
          />
        </ConduitLine>

        <NodesTrack>
          {DAG_STEPS.map((step, idx) => {
            const state = getStepState(idx);
            const StepIcon = step.icon;
            const isActive = state === 'active';

            return (
              <NodeCardWrapper
                key={step.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...MOTION_TOKENS.smooth, delay: idx * 0.06 }}
              >
                {isActive && <ActiveGlowBorder />}
                <NodeCard state={state}>
                  <NodeHeader>
                    <IconBubble state={state}>
                      {state === 'complete' ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <StepIcon size={16} />
                      )}
                    </IconBubble>
                    <NodeStatusTag state={state}>
                      {state === 'complete' ? 'Completed' : state === 'active' ? 'Synthesizing' : 'Pending'}
                    </NodeStatusTag>
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
