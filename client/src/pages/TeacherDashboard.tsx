/**
 * TeacherDashboard.tsx
 * Teacher Command Center (/)
 * Ingests multimodal inputs, displays live Execution DAG node pipeline,
 * and renders interactive 3D Artifact Studio.
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { styled, MOTION_TOKENS } from '../stitches.config';
import { Dropzone } from '../components/Dropzone';
import { ExecutionDAG } from '../components/ExecutionDAG';
import { ArtifactStudio3D } from '../components/ArtifactStudio3D';
import { Sparkles, Layers } from 'lucide-react';

const PageContainer = styled('div', {
  maxWidth: '1240px',
  margin: '0 auto',
  padding: '40px 24px 80px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '36px'
});

const HeroSection = styled(motion.div, {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
});

const Badge = styled('div', {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '7px 18px',
  borderRadius: '9999px',
  backgroundColor: 'rgba(124, 154, 109, 0.12)',
  border: '1px solid rgba(124, 154, 109, 0.3)',
  color: '$accentSageDeep',
  fontFamily: '$sans',
  fontSize: '0.8rem',
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  width: 'fit-content'
});

const HeroTitle = styled('h2', {
  fontFamily: '$display',
  fontSize: '3.1rem',
  fontWeight: 600,
  color: '$textPrimary',
  letterSpacing: '-0.02em',
  lineHeight: 1.15
});

const HeroSub = styled('p', {
  fontSize: '1.08rem',
  color: '$textSecondary',
  maxWidth: '750px',
  lineHeight: 1.65
});

interface TeacherDashboardProps {
  onLaunchTutor: (lessonId: string) => void;
  activeLesson: any;
  setActiveLesson: (lesson: any) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onLaunchTutor,
  activeLesson,
  setActiveLesson
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleGenerate = async (payload: {
    topic: string;
    subject: string;
    grade: string;
    rawPrompt: string;
    files: File[];
  }) => {
    setIsProcessing(true);
    setCurrentStepIndex(0);

    // Animate DAG Step 0 -> Step 1
    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < 3) return prev + 1;
        return prev;
      });
    }, 1200);

    try {
      const formData = new FormData();
      formData.append('topic', payload.topic);
      formData.append('subject', payload.subject);
      formData.append('grade', payload.grade);
      formData.append('rawPrompt', payload.rawPrompt);

      if (payload.files && payload.files.length > 0) {
        payload.files.forEach(file => {
          formData.append('files', file);
        });
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      clearInterval(stepInterval);

      if (data.success && data.lesson) {
        setCurrentStepIndex(4); // Live Agent Ready!
        setActiveLesson(data.lesson);

        // Confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#7c9a6d', '#d4b996', '#5f7d52', '#fbf9f4']
          });
        } catch (e) {}
      } else {
        console.error('Generation failure:', data.error);
      }
    } catch (err) {
      console.error('API call error:', err);
      clearInterval(stepInterval);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageContainer>
      <HeroSection
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={MOTION_TOKENS.smooth}
      >
        <Badge>
          <Sparkles size={14} /> Autonomous Mindful Pedagogy Engine
        </Badge>
        <HeroTitle>
          Synthesize Mindful Knowledge into an <em style={{ fontStyle: 'italic', color: '#7c9a6d' }}>Interactive Sanctuary</em>
        </HeroTitle>
        <HeroSub>
          Upload lesson materials, course notes, or high-level syllabi. Serenity orchestrates Google Search Grounding, Gemini 3 Pro studio visuals, Google Docs & Forms, and spins up a real-time emotionally intelligent Socratic Voice Sanctuary.
        </HeroSub>
      </HeroSection>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...MOTION_TOKENS.smooth, delay: 0.1 }}
      >
        <Dropzone onGenerate={handleGenerate} isProcessing={isProcessing} />
      </motion.div>

      <AnimatePresence>
        {(isProcessing || activeLesson) && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={MOTION_TOKENS.spatial}
          >
            <ExecutionDAG
              currentStepIndex={currentStepIndex}
              isProcessing={isProcessing}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeLesson && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={MOTION_TOKENS.spatial}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Layers size={20} color="#7c9a6d" />
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.65rem', fontWeight: 600, color: '#2e2a24', margin: 0 }}>
                Artifact Studio & Educational Sanctuary
              </h3>
            </div>
            <p style={{ color: '#6b6357', fontSize: '0.92rem', marginBottom: '16px' }}>
              Interactive parallax carousel showcasing the live generated curriculum artifacts. Hover over cards for 3D perspective tilt.
            </p>
            <ArtifactStudio3D lesson={activeLesson} onLaunchTutor={onLaunchTutor} />
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};
