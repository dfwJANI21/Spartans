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
  padding: '6px 14px',
  borderRadius: '20px',
  backgroundColor: 'rgba(0, 242, 254, 0.1)',
  border: '1px solid rgba(0, 242, 254, 0.25)',
  color: '$accentCyan',
  fontFamily: '$mono',
  fontSize: '0.8rem',
  width: 'fit-content'
});

const HeroTitle = styled('h2', {
  fontFamily: '$display',
  fontSize: '2.5rem',
  fontWeight: 800,
  color: '$textPrimary',
  letterSpacing: '-0.02em',
  lineHeight: 1.15
});

const HeroSub = styled('p', {
  fontSize: '1.05rem',
  color: '$textSecondary',
  maxWidth: '750px',
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
            colors: ['#00F2FE', '#4FACFE', '#10B981', '#FFFFFF']
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
          <Sparkles size={14} /> Autonomous Multimodal Pedagogy Engine
        </Badge>
        <HeroTitle>
          Synthesize Raw Curriculum into an <span style={{ color: '#00F2FE' }}>Interactive Ecosystem</span>
        </HeroTitle>
        <HeroSub>
          Upload lesson materials, course notes, or high-level syllabi. Omni-Teach Live orchestrates Google Search Grounding, Gemini 3 Pro studio visuals, Google Docs & Forms, and spins up a real-time emotionally intelligent Socratic Voice Tutor.
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
              <Layers size={20} color="#00F2FE" />
              <h3 style={{ fontFamily: 'Syne', fontSize: '1.4rem', color: '#F8FAFC' }}>
                3D Artifact Studio & Cloud Deployment
              </h3>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '16px' }}>
              Interactive parallax carousel showcasing the live generated curriculum artifacts. Hover over cards for 3D perspective tilt.
            </p>
            <ArtifactStudio3D lesson={activeLesson} onLaunchTutor={onLaunchTutor} />
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};
