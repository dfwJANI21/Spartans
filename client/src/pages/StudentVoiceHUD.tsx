/**
 * StudentVoiceHUD.tsx
 * The Live Student Voice HUD (/tutor/:lessonId)
 * Immersive bidirectional audio-call interface with Gemini Multimodal Live API,
 * Interactive Audio Canvas, Frustration-Reactive Stitches theme morphing, and Socratic Pills.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styled, calmTheme, MOTION_TOKENS } from '../stitches.config';
import { useGeminiLiveTutor, SentimentState } from '../hooks/useGeminiLiveTutor';
import { AudioCanvas } from '../components/AudioCanvas';
import { SocraticPills } from '../components/SocraticPills';
import { 
  Mic, 
  MicOff, 
  PhoneCall, 
  PhoneOff, 
  Sparkles, 
  Heart, 
  ShieldAlert, 
  Flame, 
  CheckCircle, 
  BookOpen, 
  ArrowLeft,
  HelpCircle,
  Activity
} from 'lucide-react';

const HUDContainer = styled('div', {
  minHeight: 'calc(100vh - 72px)',
  padding: '32px 24px 80px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  maxWidth: '1280px',
  margin: '0 auto',
  transition: 'all $transitionSpeed ease'
});

const TopBar = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '16px',
  padding: '16px 24px',
  borderRadius: '$cardBorderRadius',
  backgroundColor: '$bgCard',
  border: '1px solid $borderGlass',
  backdropFilter: 'blur(20px)',
  boxShadow: '$cardShadow',
  transition: 'all $transitionSpeed ease'
});

const BackButton = styled(motion.button, {
  background: '#ffffff',
  border: '1px solid #e5dfd3',
  borderRadius: '9999px',
  padding: '8px 18px',
  color: '$textSecondary',
  fontFamily: '$sans',
  fontWeight: 500,
  fontSize: '0.85rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.2s ease',

  '&:hover': {
    color: '$textPrimary',
    borderColor: '$accentSage',
    backgroundColor: 'rgba(124, 154, 109, 0.08)'
  }
});

const ModeIndicatorBadge = styled(motion.div, {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 20px',
  borderRadius: '9999px',
  fontFamily: '$sans',
  fontSize: '0.78rem',
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  transition: 'all 0.5s ease',

  variants: {
    mode: {
      rigorous: {
        backgroundColor: 'rgba(212, 185, 150, 0.22)',
        border: '1px solid #d4b996',
        color: '#8b6b4a',
        boxShadow: '0 2px 12px rgba(212, 185, 150, 0.2)'
      },
      calm: {
        backgroundColor: 'rgba(124, 154, 109, 0.16)',
        border: '1px solid #7c9a6d',
        color: '#5f7d52',
        boxShadow: '0 2px 14px rgba(124, 154, 109, 0.25)'
      }
    }
  }
});

const CallGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 380px',
  gap: '24px',

  '@media (max-width: 992px)': {
    gridTemplateColumns: '1fr'
  }
});

const VoiceChamber = styled('div', {
  padding: '36px',
  borderRadius: '$cardBorderRadius',
  backgroundColor: '#ffffff',
  border: '1px solid #e5dfd3',
  backdropFilter: 'blur(24px)',
  boxShadow: '$cardShadow',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all $transitionSpeed ease'
});

const ControlsDock = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '12px 26px',
  borderRadius: '9999px',
  backgroundColor: 'rgba(255, 255, 255, 0.94)',
  border: '1px solid #e5dfd3',
  backdropFilter: 'blur(16px)',
  boxShadow: '0 8px 30px rgba(70, 55, 40, 0.12)',
  zIndex: 10
});

const CallButton = styled(motion.button, {
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'box-shadow 0.25s ease',

  variants: {
    active: {
      true: {
        backgroundColor: '#c27d60',
        color: '#FFFFFF',
        boxShadow: '0 0 20px rgba(194, 125, 96, 0.45)',
        '&:hover': {
          boxShadow: '0 0 30px rgba(194, 125, 96, 0.7)'
        }
      },
      false: {
        background: 'linear-gradient(135deg, #7c9a6d 0%, #5f7d52 100%)',
        color: '#FFFFFF',
        boxShadow: '0 0 25px rgba(124, 154, 109, 0.45)',
        '&:hover': {
          boxShadow: '0 0 35px rgba(124, 154, 109, 0.7)'
        }
      }
    }
  }
});

const MicButton = styled(motion.button, {
  width: '46px',
  height: '46px',
  borderRadius: '50%',
  border: '1px solid #e5dfd3',
  backgroundColor: '#fbf9f4',
  color: '$textPrimary',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',

  '&:hover': {
    borderColor: '$accentSage',
    backgroundColor: 'rgba(124, 154, 109, 0.1)'
  },

  variants: {
    muted: {
      true: {
        backgroundColor: 'rgba(194, 125, 96, 0.15)',
        borderColor: '#c27d60',
        color: '#c27d60'
      }
    }
  }
});

const SentimentTestButton = styled(motion.button, {
  padding: '8px 18px',
  borderRadius: '9999px',
  backgroundColor: '#ffffff',
  border: '1px dashed #d4b996',
  color: '$textSecondary',
  fontFamily: '$sans',
  fontWeight: 500,
  fontSize: '0.8rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'all 0.2s ease',

  '&:hover': {
    borderColor: '$accentSage',
    color: '$accentSageDeep',
    backgroundColor: 'rgba(124, 154, 109, 0.06)'
  }
});

const SidePanel = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
});

const CardPanel = styled('div', {
  padding: '24px',
  borderRadius: '$cardBorderRadius',
  backgroundColor: '#ffffff',
  border: '1px solid #e5dfd3',
  backdropFilter: 'blur(20px)',
  boxShadow: '$cardShadow',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  maxHeight: '420px',
  overflowY: 'auto',
  transition: 'all $transitionSpeed ease'
});

const DialogueFeed = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
  maxWidth: '650px',
  maxHeight: '220px',
  overflowY: 'auto',
  padding: '8px 12px'
});

const MessageBubble = styled(motion.div, {
  padding: '12px 18px',
  borderRadius: '16px',
  fontSize: '0.9rem',
  lineHeight: 1.5,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',

  variants: {
    sender: {
      tutor: {
        alignSelf: 'flex-start',
        backgroundColor: '#ffffff',
        border: '1px solid #e5dfd3',
        color: '$textPrimary',
        boxShadow: '0 2px 8px rgba(70, 55, 40, 0.04)'
      },
      student: {
        alignSelf: 'flex-end',
        backgroundColor: 'rgba(124, 154, 109, 0.15)',
        border: '1px solid rgba(124, 154, 109, 0.35)',
        color: '$textPrimary',
        boxShadow: '0 2px 8px rgba(124, 154, 109, 0.08)'
      },
      system: {
        alignSelf: 'center',
        backgroundColor: 'rgba(212, 185, 150, 0.2)',
        border: '1px dashed rgba(212, 185, 150, 0.6)',
        color: '#8b6b4a',
        fontSize: '0.8rem',
        fontFamily: '$sans',
        fontWeight: 600
      }
    }
  }
});

interface StudentVoiceHUDProps {
  lessonId: string;
  lessonData?: any;
  onBack: () => void;
}

export const StudentVoiceHUD: React.FC<StudentVoiceHUDProps> = ({
  lessonId,
  lessonData,
  onBack
}) => {
  const [currentSentiment, setCurrentSentiment] = useState<SentimentState>('rigorous');

  const {
    isCalling,
    isMuted,
    sentiment,
    statusText,
    messages,
    studentAudioLevel,
    aiAudioLevel,
    startLiveCall,
    endCall,
    toggleMute,
    sendUserPrompt,
    triggerFrustrationTest
  } = useGeminiLiveTutor({
    lessonId,
    lessonData,
    onSentimentChange: (newSentiment) => {
      setCurrentSentiment(newSentiment);
    }
  });

  const title = lessonData?.lessonTitle || 'Grounded Socratic Exploration';
  const objectives = lessonData?.docContent?.learningObjectives || [];
  const keyConcepts = lessonData?.docContent?.keyConcepts || [];

  return (
    <div className={currentSentiment === 'calm' ? calmTheme.className : ''}>
      <HUDContainer>
        <TopBar>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <BackButton
              onClick={onBack}
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={MOTION_TOKENS.snappy}
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </BackButton>
            <div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.45rem', fontWeight: 600, color: '#2e2a24', margin: 0 }}>
                {title}
              </h3>
              <span style={{ fontSize: '0.82rem', color: '#6b6357' }}>
                Gemini Multimodal Live API • Bidirectional Socratic Sanctuary
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ModeIndicatorBadge
              mode={currentSentiment}
              layout
              transition={MOTION_TOKENS.smooth}
            >
              {currentSentiment === 'calm' ? (
                <>
                  <Heart size={14} /> CALM ADAPTIVE MODE (SOOTHING CADENCE)
                </>
              ) : (
                <>
                  <Flame size={14} /> RIGOROUS SOCRATIC MODE
                </>
              )}
            </ModeIndicatorBadge>

            <SentimentTestButton
              onClick={triggerFrustrationTest}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              transition={MOTION_TOKENS.snappy}
            >
              <Activity size={14} /> Trigger Emotion Engine Test
            </SentimentTestButton>
          </div>
        </TopBar>

        <CallGrid>
          {/* Main Voice Chamber */}
          <VoiceChamber>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: currentSentiment === 'calm' ? '#d4b996' : '#7c9a6d', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Native WebSocket 16kHz Audio Channel
              </span>
              <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', fontWeight: 600, color: '#2e2a24', marginTop: '4px' }}>
                {isCalling ? 'Socratic Dialogue Active' : 'Begin Socratic Call'}
              </h4>
              <p style={{ fontSize: '0.88rem', color: '#6b6357', marginTop: '2px' }}>
                {statusText}
              </p>
            </div>

            {/* Concentric Expanding Audio Canvas Visualizer */}
            <AudioCanvas
              studentLevel={studentAudioLevel}
              aiLevel={aiAudioLevel}
              isLive={isCalling}
              sentiment={currentSentiment}
            />

            {/* Live Call Control Dock */}
            <ControlsDock>
              <MicButton
                muted={isMuted}
                onClick={toggleMute}
                disabled={!isCalling}
                title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                whileHover={{ scale: isCalling ? 1.08 : 1 }}
                whileTap={{ scale: isCalling ? 0.92 : 1 }}
                transition={MOTION_TOKENS.snappy}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </MicButton>

              <CallButton
                active={isCalling}
                onClick={isCalling ? endCall : startLiveCall}
                title={isCalling ? 'End Socratic Call' : 'Start Socratic Call'}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={MOTION_TOKENS.snappy}
              >
                {isCalling ? <PhoneOff size={24} /> : <PhoneCall size={24} />}
              </CallButton>
            </ControlsDock>

            {/* Socratic Action Pills */}
            <div style={{ width: '100%' }}>
              <SocraticPills
                onAction={(prompt) => sendUserPrompt(prompt)}
                disabled={!isCalling}
              />
            </div>

            {/* Live Socratic Dialogue Feed */}
            <DialogueFeed>
              <AnimatePresence>
                {messages.map((m) => (
                  <MessageBubble
                    key={m.id}
                    sender={m.sender}
                    initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={MOTION_TOKENS.snappy}
                  >
                    <span style={{ fontSize: '0.72rem', opacity: 0.6, fontFamily: 'JetBrains Mono' }}>
                      {m.sender.toUpperCase()} • {m.timestamp}
                    </span>
                    <span>{m.text}</span>
                  </MessageBubble>
                ))}
              </AnimatePresence>
            </DialogueFeed>
          </VoiceChamber>

          {/* Right Socratic Curriculum Context */}
          <SidePanel>
            <CardPanel>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} color="#7c9a6d" />
                <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 600, color: '#2e2a24', margin: 0 }}>
                  Curriculum Objectives
                </h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {objectives.map((obj: string, idx: number) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', fontSize: '0.88rem', color: '#4a4237' }}>
                    <CheckCircle size={16} color="#5f7d52" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </CardPanel>

            <CardPanel>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#d4b996" />
                <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 600, color: '#2e2a24', margin: 0 }}>
                  Intuition Pumps & Analogies
                </h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {keyConcepts.map((c: any, i: number) => (
                  <div key={i} style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#fbf9f4', border: '1px solid #e5dfd3' }}>
                    <div style={{ fontWeight: 600, color: '#5f7d52', fontSize: '0.88rem', marginBottom: '4px' }}>
                      {c.name}
                    </div>
                    {c.analogy && (
                      <div style={{ fontSize: '0.82rem', color: '#6b6357', fontStyle: 'italic' }}>
                        "{c.analogy}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardPanel>
          </SidePanel>
        </CallGrid>
      </HUDContainer>
    </div>
  );
};
