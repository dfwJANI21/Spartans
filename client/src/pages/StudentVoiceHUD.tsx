/**
 * StudentVoiceHUD.tsx
 * Google Meet Live Socratic Classroom (/tutor/:lessonId)
 * Bidirectional audio-call interface with Gemini Multimodal Live API,
 * Google 4-color Audio Canvas, Adaptive Emotional Sentiment Engine, and Socratic Action Chips.
 */

import React, { useState } from 'react';
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
  Flame, 
  CheckCircle, 
  BookOpen, 
  ArrowLeft,
  Activity,
  Lightbulb
} from 'lucide-react';

const HUDContainer = styled('div', {
  minHeight: 'calc(100vh - 68px)',
  padding: '24px 24px 70px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  maxWidth: '1280px',
  margin: '0 auto',
  transition: 'all $transitionSpeed ease'
});

const TopBar = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '14px',
  padding: '14px 22px',
  borderRadius: '16px',
  backgroundColor: '$bgCard',
  border: '1px solid #dadce0',
  boxShadow: '0 1px 3px 0 rgba(60, 64, 67, 0.12)',
  transition: 'all $transitionSpeed ease'
});

const BackButton = styled(motion.button, {
  background: '#ffffff',
  border: '1px solid #dadce0',
  borderRadius: '20px',
  padding: '8px 16px',
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
    color: '#202124',
    borderColor: '#1a73e8',
    backgroundColor: '#e8f0fe'
  }
});

const ModeIndicatorBadge = styled(motion.div, {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 16px',
  borderRadius: '20px',
  fontFamily: '$sans',
  fontSize: '0.78rem',
  fontWeight: 600,
  letterSpacing: '0.02em',
  transition: 'all 0.3s ease',

  variants: {
    mode: {
      rigorous: {
        backgroundColor: '#e8f0fe',
        border: '1px solid rgba(26, 115, 232, 0.35)',
        color: '#1a73e8',
        boxShadow: '0 1px 3px rgba(26, 115, 232, 0.12)'
      },
      calm: {
        backgroundColor: '#e6f4ea',
        border: '1px solid rgba(52, 168, 83, 0.4)',
        color: '#137333',
        boxShadow: '0 1px 3px rgba(52, 168, 83, 0.15)'
      }
    }
  }
});

const CallGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 380px',
  gap: '20px',

  '@media (max-width: 992px)': {
    gridTemplateColumns: '1fr'
  }
});

const VoiceChamber = styled('div', {
  padding: '30px 24px',
  borderRadius: '20px',
  backgroundColor: '#ffffff',
  border: '1px solid #dadce0',
  boxShadow: '0 1px 3px 0 rgba(60, 64, 67, 0.12), 0 2px 6px 2px rgba(60, 64, 67, 0.06)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all $transitionSpeed ease'
});

const ControlsDock = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '10px 24px',
  borderRadius: '40px',
  backgroundColor: '#ffffff',
  border: '1px solid #dadce0',
  boxShadow: '0 2px 10px rgba(60, 64, 67, 0.15)',
  zIndex: 10
});

const CallButton = styled(motion.button, {
  width: '52px',
  height: '52px',
  borderRadius: '50%',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',

  variants: {
    active: {
      true: {
        backgroundColor: '#ea4335', // Google Meet Red End-Call
        color: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(234, 67, 53, 0.45)',
        '&:hover': {
          backgroundColor: '#d93025',
          boxShadow: '0 4px 12px rgba(234, 67, 53, 0.6)'
        }
      },
      false: {
        backgroundColor: '#1a73e8', // Google Meet Blue Join-Call
        color: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(26, 115, 232, 0.45)',
        '&:hover': {
          backgroundColor: '#1557b0',
          boxShadow: '0 4px 12px rgba(26, 115, 232, 0.6)'
        }
      }
    }
  }
});

const MicButton = styled(motion.button, {
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  border: '1px solid #dadce0',
  backgroundColor: '#f1f3f4',
  color: '#3c4043',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',

  '&:hover': {
    backgroundColor: '#e8eaed'
  },

  variants: {
    muted: {
      true: {
        backgroundColor: '#ea4335',
        borderColor: '#ea4335',
        color: '#ffffff',
        '&:hover': {
          backgroundColor: '#d93025'
        }
      }
    }
  }
});

const SentimentTestButton = styled(motion.button, {
  padding: '6px 14px',
  borderRadius: '20px',
  backgroundColor: '#ffffff',
  border: '1px solid #dadce0',
  color: '$textSecondary',
  fontFamily: '$sans',
  fontWeight: 500,
  fontSize: '0.78rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'all 0.2s ease',

  '&:hover': {
    borderColor: '#1a73e8',
    color: '#1a73e8',
    backgroundColor: '#e8f0fe'
  }
});

const SidePanel = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
});

const CardPanel = styled('div', {
  padding: '20px',
  borderRadius: '16px',
  backgroundColor: '#ffffff',
  border: '1px solid #dadce0',
  boxShadow: '0 1px 3px 0 rgba(60, 64, 67, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  maxHeight: '400px',
  overflowY: 'auto',
  transition: 'all $transitionSpeed ease'
});

const DialogueFeed = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '100%',
  maxWidth: '680px',
  maxHeight: '220px',
  overflowY: 'auto',
  padding: '8px 12px'
});

const MessageBubble = styled(motion.div, {
  padding: '12px 16px',
  borderRadius: '14px',
  fontSize: '0.88rem',
  lineHeight: 1.5,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',

  variants: {
    sender: {
      tutor: {
        alignSelf: 'flex-start',
        backgroundColor: '#ffffff',
        border: '1px solid #dadce0',
        color: '$textPrimary',
        boxShadow: '0 1px 2px rgba(60, 64, 67, 0.08)'
      },
      student: {
        alignSelf: 'flex-end',
        backgroundColor: '#e8f0fe',
        border: '1px solid rgba(26, 115, 232, 0.3)',
        color: '#1a73e8',
        boxShadow: '0 1px 2px rgba(26, 115, 232, 0.08)'
      },
      system: {
        alignSelf: 'center',
        backgroundColor: '#fef7e0',
        border: '1px solid rgba(251, 188, 4, 0.5)',
        color: '#b06000',
        fontSize: '0.78rem',
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

  const title = lessonData?.lessonTitle || 'Grounded Socratic Classroom';
  const objectives = lessonData?.docContent?.learningObjectives || [];
  const keyConcepts = lessonData?.docContent?.keyConcepts || [];

  return (
    <div className={currentSentiment === 'calm' ? calmTheme.className : ''}>
      <HUDContainer>
        <TopBar>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <BackButton
              onClick={onBack}
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={MOTION_TOKENS.snappy}
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </BackButton>
            <div>
              <h3 style={{ fontFamily: 'Google Sans, Roboto, sans-serif', fontSize: '1.25rem', fontWeight: 600, color: '#202124', margin: 0 }}>
                {title}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#5f6368' }}>
                Google Workspace for Education • Gemini Multimodal Live API
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ModeIndicatorBadge
              mode={currentSentiment}
              layout
              transition={MOTION_TOKENS.smooth}
            >
              {currentSentiment === 'calm' ? (
                <>
                  <Heart size={14} color="#34a853" /> ADAPTIVE CADENCE (SOOTHING)
                </>
              ) : (
                <>
                  <Flame size={14} color="#1a73e8" /> RIGOROUS SOCRATIC MODE
                </>
              )}
            </ModeIndicatorBadge>

            <SentimentTestButton
              onClick={triggerFrustrationTest}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={MOTION_TOKENS.snappy}
            >
              <Activity size={14} color="#1a73e8" /> Emotion Engine Test
            </SentimentTestButton>
          </div>
        </TopBar>

        <CallGrid>
          {/* Main Voice Chamber */}
          <VoiceChamber>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontFamily: 'Google Sans, Roboto, sans-serif', fontSize: '0.74rem', fontWeight: 600, color: currentSentiment === 'calm' ? '#34a853' : '#1a73e8', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                16kHz Bidirectional WebSocket Audio
              </span>
              <h4 style={{ fontFamily: 'Google Sans, Roboto, sans-serif', fontSize: '1.45rem', fontWeight: 600, color: '#202124', marginTop: '4px' }}>
                {isCalling ? 'Socratic Dialogue Active' : 'Begin Socratic Live Call'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#5f6368', marginTop: '2px' }}>
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

            {/* Google Meet Live Call Control Dock */}
            <ControlsDock>
              <MicButton
                muted={isMuted}
                onClick={toggleMute}
                disabled={!isCalling}
                title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                whileHover={{ scale: isCalling ? 1.06 : 1 }}
                whileTap={{ scale: isCalling ? 0.94 : 1 }}
                transition={MOTION_TOKENS.snappy}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </MicButton>

              <CallButton
                active={isCalling}
                onClick={isCalling ? endCall : startLiveCall}
                title={isCalling ? 'End Socratic Call' : 'Join Socratic Live Classroom'}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                transition={MOTION_TOKENS.snappy}
              >
                {isCalling ? <PhoneOff size={22} /> : <PhoneCall size={22} />}
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={MOTION_TOKENS.snappy}
                  >
                    <span style={{ fontSize: '0.72rem', opacity: 0.7, fontFamily: 'Roboto Mono, monospace' }}>
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
                <BookOpen size={18} color="#1a73e8" />
                <h4 style={{ fontFamily: 'Google Sans, Roboto, sans-serif', fontSize: '1.1rem', fontWeight: 600, color: '#202124', margin: 0 }}>
                  Curriculum Objectives
                </h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {objectives.map((obj: string, idx: number) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: '#3c4043' }}>
                    <CheckCircle size={15} color="#34a853" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </CardPanel>

            <CardPanel>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lightbulb size={18} color="#fbbc04" />
                <h4 style={{ fontFamily: 'Google Sans, Roboto, sans-serif', fontSize: '1.1rem', fontWeight: 600, color: '#202124', margin: 0 }}>
                  Intuition Pumps & Analogies
                </h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {keyConcepts.map((c: any, i: number) => (
                  <div key={i} style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: '#f8f9fa', border: '1px solid #dadce0' }}>
                    <div style={{ fontWeight: 600, color: '#1a73e8', fontSize: '0.85rem', marginBottom: '2px' }}>
                      {c.name}
                    </div>
                    {c.analogy && (
                      <div style={{ fontSize: '0.8rem', color: '#5f6368', fontStyle: 'italic' }}>
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
