/**
 * TeacherDashboard.tsx
 * Google Workspace for Education • Teacher Command Studio (/)
 * Ingests multimodal inputs, displays live Vertex AI Execution DAG node pipeline,
 * and renders interactive 3D Google Workspace Artifact Studio.
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { styled, MOTION_TOKENS } from '../stitches.config';
import { Dropzone } from '../components/Dropzone';
import { ExecutionDAG } from '../components/ExecutionDAG';
import { ArtifactStudio3D } from '../components/ArtifactStudio3D';
import { Sparkles, Layers, BookOpen } from 'lucide-react';

const PageContainer = styled('div', {
  maxWidth: '1240px',
  margin: '0 auto',
  padding: '36px 24px 80px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '32px'
});

const HeroSection = styled(motion.div, {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
});

const Badge = styled('div', {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 14px',
  borderRadius: '20px',
  backgroundColor: '#e8f0fe',
  border: '1px solid rgba(26, 115, 232, 0.3)',
  color: '#1a73e8',
  fontFamily: '$sans',
  fontSize: '0.8rem',
  fontWeight: 600,
  letterSpacing: '0.02em',
  width: 'fit-content'
});

const HeroTitle = styled('h2', {
  fontFamily: '$display',
  fontSize: '2.5rem',
  fontWeight: 600,
  color: '$textPrimary',
  letterSpacing: '-0.02em',
  lineHeight: 1.2
});

const HeroSub = styled('p', {
  fontSize: '1.05rem',
  color: '$textSecondary',
  maxWidth: '820px',
  lineHeight: 1.6
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

    // Animate DAG Step 0 -> Step 1 -> Step 2
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

        // Google 4-Color Confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853']
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
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={MOTION_TOKENS.smooth}
      >
        <Badge>
          <Sparkles size={14} color="#1a73e8" />
          <span>Gemini 2.0 & Google Workspace Ecosystem</span>
        </Badge>
        <HeroTitle>
          Synthesize Lesson Materials into an <span style={{ color: '#1a73e8' }}>Interactive Socratic Classroom</span>
        </HeroTitle>
        <HeroSub>
          Upload course notes, syllabi, or textbook chapters. Omni-Teach orchestrates Google Search Grounding, Gemini 3 Pro studio visuals, Google Docs & Forms generation, and deploys a live bidirectional 16kHz Socratic Voice Tutor.
        </HeroSub>
      </HeroSection>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...MOTION_TOKENS.smooth, delay: 0.08 }}
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
              <Layers size={22} color="#1a73e8" />
              <h3 style={{ fontFamily: 'Google Sans, Roboto, sans-serif', fontSize: '1.45rem', fontWeight: 600, color: '#202124', margin: 0 }}>
                Google Workspace Artifact Studio
              </h3>
            </div>
            <p style={{ color: '#5f6368', fontSize: '0.92rem', marginBottom: '16px' }}>
              Generated learning artifacts provisioned in Google Drive. Review generated Google Docs, Google Forms quizzes, and launch the real-time Socratic voice classroom.
            </p>
            <ArtifactStudio3D lesson={activeLesson} onLaunchTutor={onLaunchTutor} />
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};
