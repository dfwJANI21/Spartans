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
  background: 'transparent',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  padding: '8px 14px',
  color: '$textSecondary',
  fontSize: '0.85rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.2s ease',

  '&:hover': {
    color: '$textPrimary',
    borderColor: '$borderGlassHover'
  }
});

const ModeIndicatorBadge = styled(motion.div, {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 18px',
  borderRadius: '9999px',
  fontFamily: '$mono',
  fontSize: '0.8rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  transition: 'all 0.5s ease',

  variants: {
    mode: {
      rigorous: {
        backgroundColor: 'rgba(0, 242, 254, 0.12)',
        border: '1px solid $accentCyan',
        color: '$accentCyan',
        boxShadow: '0 0 20px rgba(0, 242, 254, 0.3)'
      },
      calm: {
        backgroundColor: 'rgba(255, 158, 100, 0.18)',
        border: '1px solid $accentCyan',
        color: '$accentCyan',
        boxShadow: '0 0 25px rgba(255, 158, 100, 0.45)'
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
  padding: '32px',
  borderRadius: '$cardBorderRadius',
  backgroundColor: '$bgCard',
  border: '1px solid $borderGlass',
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
  padding: '12px 24px',
  borderRadius: '9999px',
  backgroundColor: 'rgba(9, 12, 21, 0.85)',
  border: '1px solid $borderGlass',
  backdropFilter: 'blur(16px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
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
        backgroundColor: '#EF4444',
        color: '#FFFFFF',
        boxShadow: '0 0 25px rgba(239, 68, 68, 0.5)',
        '&:hover': {
          boxShadow: '0 0 35px rgba(239, 68, 68, 0.8)'
        }
      },
      false: {
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        color: '#FFFFFF',
        boxShadow: '0 0 25px rgba(16, 185, 129, 0.5)',
        '&:hover': {
          boxShadow: '0 0 35px rgba(16, 185, 129, 0.8)'
        }
      }
    }
  }
});

const MicButton = styled(motion.button, {
  width: '46px',
  height: '46px',
  borderRadius: '50%',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  backgroundColor: 'rgba(255, 255, 255, 0.06)',
  color: '$textPrimary',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',

  '&:hover': {
    borderColor: '$accentCyan',
    backgroundColor: 'rgba(0, 242, 254, 0.1)'
  },

  variants: {
    muted: {
      true: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        borderColor: '#EF4444',
        color: '#EF4444'
      }
    }
  }
});

const SentimentTestButton = styled(motion.button, {
  padding: '8px 16px',
  borderRadius: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px dashed $borderGlass',
  color: '$textSecondary',
  fontFamily: '$mono',
  fontSize: '0.78rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'all 0.2s ease',

  '&:hover': {
    borderColor: '$accentCyan',
    color: '$accentCyan'
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
  backgroundColor: '$bgCard',
  border: '1px solid $borderGlass',
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
  borderRadius: '14px',
  fontSize: '0.9rem',
  lineHeight: 1.5,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',

  variants: {
    sender: {
      tutor: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(20, 26, 45, 0.85)',
        border: '1px solid $borderGlass',
        color: '$textPrimary'
      },
      student: {
        alignSelf: 'flex-end',
        backgroundColor: 'rgba(0, 242, 254, 0.12)',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        color: '$textPrimary'
      },
      system: {
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 158, 100, 0.15)',
        border: '1px dashed rgba(255, 158, 100, 0.4)',
        color: '$accentCyan',
        fontSize: '0.8rem',
        fontFamily: '$mono'
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
              <h3 style={{ fontFamily: 'Syne', fontSize: '1.2rem', color: '#F8FAFC', margin: 0 }}>
                {title}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                Gemini Multimodal Live API • Bidirectional Socratic HUD
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
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: currentSentiment === 'calm' ? '#FF9E64' : '#00F2FE', letterSpacing: '0.08em' }}>
                NATIVE WEBSOCKET 16KHZ AUDIO CHANNEL
              </span>
              <h4 style={{ fontFamily: 'Syne', fontSize: '1.4rem', color: '#F8FAFC', marginTop: '4px' }}>
                {isCalling ? 'Socratic Voice Session Active' : 'Begin Socratic Call'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '2px' }}>
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
                <BookOpen size={18} color="#00F2FE" />
                <h4 style={{ fontFamily: 'Syne', fontSize: '1rem', color: '#F8FAFC', margin: 0 }}>
                  Curriculum Objectives
                </h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {objectives.map((obj: string, idx: number) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', color: '#CBD5E1' }}>
                    <CheckCircle size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </CardPanel>

            <CardPanel>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#FF9E64" />
                <h4 style={{ fontFamily: 'Syne', fontSize: '1rem', color: '#F8FAFC', margin: 0 }}>
                  Intuition Pumps & Analogies
                </h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {keyConcepts.map((c: any, i: number) => (
                  <div key={i} style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontWeight: 600, color: '#00F2FE', fontSize: '0.85rem', marginBottom: '4px' }}>
                      {c.name}
                    </div>
                    {c.analogy && (
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontStyle: 'italic' }}>
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
