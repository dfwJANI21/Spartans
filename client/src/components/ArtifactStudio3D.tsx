/**
 * ArtifactStudio3D.tsx
 * Google Workspace Interactive 3D Artifact Studio
 * Features Google Docs, Graded Google Forms, Google Drive Repositories,
 * and Gemini Live Socratic Agent interfaces.
 */

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { styled, MOTION_TOKENS } from '../stitches.config';
import { 
  FileText, 
  CheckSquare, 
  FolderGit2, 
  Headphones, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Award,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

const StudioContainer = styled('div', {
  width: '100%',
  perspective: 1400,
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  marginTop: '12px'
});

const ControlsBar = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 16px',
  borderRadius: '20px',
  backgroundColor: '$bgCard',
  border: '1px solid #dadce0',
  boxShadow: '0 1px 3px 0 rgba(60, 64, 67, 0.12), 0 2px 6px 2px rgba(60, 64, 67, 0.06)'
});

const TabPills = styled('div', {
  display: 'flex',
  gap: '6px',
  position: 'relative'
});

const TabPill = styled('button', {
  position: 'relative',
  background: 'transparent',
  border: 'none',
  borderRadius: '16px',
  padding: '8px 18px',
  fontSize: '0.85rem',
  fontFamily: '$sans',
  fontWeight: 500,
  color: '$textSecondary',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'color 0.2s ease',
  zIndex: 1,

  variants: {
    active: {
      true: {
        color: '#1a73e8',
        fontWeight: 600
      }
    }
  },

  '&:hover': {
    color: '#202124'
  }
});

const ActiveTabGlider = styled(motion.div, {
  position: 'absolute',
  inset: 0,
  borderRadius: '16px',
  backgroundColor: '#e8f0fe',
  border: '1px solid rgba(26, 115, 232, 0.25)',
  zIndex: 0
});

const CarouselViewport = styled('div', {
  width: '100%',
  minHeight: '480px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative'
});

const CardOuter = styled(motion.div, {
  width: '100%',
  maxWidth: '880px',
  position: 'relative',
  borderRadius: '20px',
  padding: '1px',
  overflow: 'hidden',
  transformStyle: 'preserve-3d',
  boxShadow: '0 1px 3px 0 rgba(60, 64, 67, 0.15), 0 4px 12px 3px rgba(60, 64, 67, 0.1)'
});

const SpecularLightBorder = styled(motion.div, {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  borderRadius: '20px',
  zIndex: 0
});

const Card3DInner = styled('div', {
  position: 'relative',
  zIndex: 1,
  borderRadius: '19px',
  backgroundColor: '#ffffff',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  transformStyle: 'preserve-3d',
  border: '1px solid #dadce0'
});

const CardHeader = styled('div', {
  padding: '22px 32px',
  borderBottom: '1px solid #e8eaed',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: '#ffffff',
  transform: 'translateZ(20px)'
});

const CardBody = styled('div', {
  padding: '28px 32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  transform: 'translateZ(30px)'
});

const ImageBanner = styled('div', {
  width: '100%',
  height: '240px',
  borderRadius: '12px',
  overflow: 'hidden',
  position: 'relative',
  border: '1px solid #dadce0',
  transform: 'translateZ(25px)',
  boxShadow: '0 1px 3px rgba(60, 64, 67, 0.12)',

  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }
});

const ImageBadge = styled('div', {
  position: 'absolute',
  bottom: '12px',
  left: '12px',
  padding: '6px 14px',
  borderRadius: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  fontFamily: '$sans',
  fontWeight: 600,
  fontSize: '0.75rem',
  color: '#1a73e8',
  border: '1px solid #dadce0',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  boxShadow: '0 1px 3px rgba(60, 64, 67, 0.15)'
});

const ActionButton = styled(motion.a, {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 22px',
  borderRadius: '24px',
  fontFamily: '$sans',
  fontSize: '0.85rem',
  fontWeight: 600,
  textDecoration: 'none',
  cursor: 'pointer',
  transform: 'translateZ(40px)',
  transition: 'all 0.2s ease',

  variants: {
    variant: {
      docs: {
        background: '#1a73e8',
        color: '#ffffff',
        boxShadow: '0 1px 3px rgba(60, 64, 67, 0.3)',
        '&:hover': {
          background: '#1557b0'
        }
      },
      forms: {
        background: '#7248b9',
        color: '#ffffff',
        boxShadow: '0 1px 3px rgba(60, 64, 67, 0.3)',
        '&:hover': {
          background: '#5b329a'
        }
      },
      drive: {
        background: '#137333',
        color: '#ffffff',
        boxShadow: '0 1px 3px rgba(60, 64, 67, 0.3)',
        '&:hover': {
          background: '#0d5526'
        }
      }
    }
  }
});

const ActionButtonEl = styled(motion.button, {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 22px',
  borderRadius: '24px',
  fontFamily: '$sans',
  fontSize: '0.85rem',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  transform: 'translateZ(40px)',
  background: '#1a73e8',
  color: '#ffffff',
  boxShadow: '0 1px 3px rgba(60, 64, 67, 0.3)',
  transition: 'background-color 0.2s ease',

  '&:hover': {
    background: '#1557b0'
  }
});

interface ArtifactStudio3DProps {
  lesson: any;
  onLaunchTutor: (lessonId: string) => void;
}

export const ArtifactStudio3D: React.FC<ArtifactStudio3DProps> = ({ lesson, onLaunchTutor }) => {
  const [activeTab, setActiveTab] = useState<'doc' | 'form' | 'drive' | 'tutor'>('doc');

  // Parallax Tilt & Specular Light Coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const lightX = useMotionValue(400);
  const lightY = useMotionValue(250);

  const rotateX = useSpring(useTransform(mouseY, [-220, 220], [6, -6]), MOTION_TOKENS.spatial);
  const rotateY = useSpring(useTransform(mouseX, [-400, 400], [-8, 8]), MOTION_TOKENS.spatial);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
    lightX.set(e.clientX - rect.left);
    lightY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const workspace = lesson?.workspace || {};
  const docContent = lesson?.docContent || {};
  const quiz = lesson?.quizQuestions || [];

  return (
    <StudioContainer>
      <ControlsBar>
        <TabPills>
          {(['doc', 'form', 'drive', 'tutor'] as const).map((tab) => {
            const labels = {
              doc: { label: 'Google Docs', icon: FileText, color: '#4285f4' },
              form: { label: 'Google Forms', icon: CheckSquare, color: '#7248b9' },
              drive: { label: 'Google Drive', icon: FolderGit2, color: '#34a853' },
              tutor: { label: 'Live Socratic Tutor', icon: Headphones, color: '#1a73e8' }
            };
            const IconComp = labels[tab].icon;
            const isActive = activeTab === tab;

            return (
              <TabPill
                key={tab}
                active={isActive}
                onClick={() => setActiveTab(tab)}
              >
                {isActive && (
                  <ActiveTabGlider
                    layoutId="activeArtifactTab"
                    transition={MOTION_TOKENS.spatial}
                  />
                )}
                <IconComp size={15} color={isActive ? labels[tab].color : '#5f6368'} />
                <span>{labels[tab].label}</span>
              </TabPill>
            );
          })}
        </TabPills>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="#34a853" />
          <span style={{ fontSize: '0.78rem', color: '#5f6368', fontFamily: '$sans' }}>
            Vertex AI Search Grounded
          </span>
        </div>
      </ControlsBar>

      <CarouselViewport onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <AnimatePresence mode="wait">
          {activeTab === 'doc' && (
            <CardOuter
              key="doc"
              style={{ rotateX, rotateY }}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.98 }}
              transition={MOTION_TOKENS.spatial}
            >
              <SpecularLightBorder
                style={{
                  background: 'radial-gradient(circle 380px at 50% 50%, rgba(66, 133, 244, 0.15) 0%, transparent 60%)'
                }}
              />
              <Card3DInner>
                <CardHeader>
                  <div>
                    <div style={{ fontFamily: 'Google Sans, Roboto, sans-serif', fontSize: '1.25rem', fontWeight: 600, color: '#202124' }}>
                      {lesson.lessonTitle || 'Multimodal Lesson Plan'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#5f6368', marginTop: '2px' }}>
                      {lesson.subject} • {lesson.grade}
                    </div>
                  </div>
                  <ActionButton
                    href={workspace.docUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    variant="docs"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ExternalLink size={15} /> Open in Google Docs
                  </ActionButton>
                </CardHeader>

                <CardBody>
                  {lesson.visualAsset?.url && (
                    <ImageBanner>
                      <img src={lesson.visualAsset.url} alt="Synthesized Concept" />
                      <ImageBadge>
                        <Sparkles size={12} color="#1a73e8" />
                        <span>Gemini 3 Pro / Imagen 3 Asset</span>
                      </ImageBadge>
                    </ImageBanner>
                  )}

                  <div>
                    <h4 style={{ color: '#1a73e8', fontFamily: '$sans', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Executive Curriculum Summary
                    </h4>
                    <p style={{ color: '#202124', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      {lesson.summary}
                    </p>
                  </div>

                  {docContent.learningObjectives && (
                    <div>
                      <h4 style={{ color: '#1a73e8', fontFamily: '$sans', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Core Learning Objectives
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {docContent.learningObjectives.map((obj: string, i: number) => (
                          <div key={i} style={{ fontSize: '0.88rem', color: '#3c4043', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <span style={{ color: '#1a73e8', fontWeight: 600 }}>{i + 1}.</span>
                            <span>{obj}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card3DInner>
            </CardOuter>
          )}

          {activeTab === 'form' && (
            <CardOuter
              key="form"
              style={{ rotateX, rotateY }}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.98 }}
              transition={MOTION_TOKENS.spatial}
            >
              <SpecularLightBorder
                style={{
                  background: 'radial-gradient(circle 380px at 50% 50%, rgba(114, 72, 185, 0.15) 0%, transparent 60%)'
                }}
              />
              <Card3DInner>
                <CardHeader>
                  <div>
                    <div style={{ fontFamily: 'Google Sans, Roboto, sans-serif', fontSize: '1.25rem', fontWeight: 600, color: '#202124' }}>
                      Graded Diagnostic Google Form
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#5f6368', marginTop: '2px' }}>
                      Self-grading Google Forms quiz with pedagogical reasoning
                    </div>
                  </div>
                  <ActionButton
                    href={workspace.formUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    variant="forms"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ExternalLink size={15} /> Open Google Form
                  </ActionButton>
                </CardHeader>

                <CardBody>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {quiz.slice(0, 3).map((q: any, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          padding: '16px 20px',
                          borderRadius: '12px',
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #dadce0'
                        }}
                      >
                        <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#202124', marginBottom: '10px' }}>
                          Question {idx + 1}: {q.question}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                          {q.options?.map((opt: string, optIdx: number) => (
                            <div
                              key={optIdx}
                              style={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                fontSize: '0.82rem',
                                backgroundColor: optIdx === q.correctIndex ? '#e6f4ea' : '#ffffff',
                                border: optIdx === q.correctIndex ? '1px solid #34a853' : '1px solid #dadce0',
                                color: optIdx === q.correctIndex ? '#137333' : '#3c4043',
                                fontWeight: optIdx === q.correctIndex ? 600 : 400
                              }}
                            >
                              {opt} {optIdx === q.correctIndex && '✓ (Correct)'}
                            </div>
                          ))}
                        </div>
                        {q.explanation && (
                          <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#5f6368' }}>
                            <strong style={{ color: '#7248b9' }}>Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card3DInner>
            </CardOuter>
          )}

          {activeTab === 'drive' && (
            <CardOuter
              key="drive"
              style={{ rotateX, rotateY }}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.98 }}
              transition={MOTION_TOKENS.spatial}
            >
              <SpecularLightBorder
                style={{
                  background: 'radial-gradient(circle 380px at 50% 50%, rgba(52, 168, 83, 0.15) 0%, transparent 60%)'
                }}
              />
              <Card3DInner>
                <CardHeader>
                  <div>
                    <div style={{ fontFamily: 'Google Sans, Roboto, sans-serif', fontSize: '1.25rem', fontWeight: 600, color: '#202124' }}>
                      Google Drive Classroom Repository
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#5f6368', marginTop: '2px' }}>
                      Synchronized Google Drive folder containing course materials & assets
                    </div>
                  </div>
                  <ActionButton
                    href={workspace.folderUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    variant="drive"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ExternalLink size={15} /> Open in Google Drive
                  </ActionButton>
                </CardHeader>

                <CardBody>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                    <div style={{ padding: '18px', borderRadius: '12px', background: '#f8f9fa', border: '1px solid #dadce0' }}>
                      <FileText size={26} color="#4285f4" />
                      <h5 style={{ color: '#202124', fontFamily: '$sans', fontWeight: 600, margin: '8px 0 2px 0' }}>Google Doc Guide</h5>
                      <p style={{ fontSize: '0.8rem', color: '#5f6368' }}>Formatted classroom syllabus & study notes</p>
                    </div>
                    <div style={{ padding: '18px', borderRadius: '12px', background: '#f8f9fa', border: '1px solid #dadce0' }}>
                      <CheckSquare size={26} color="#7248b9" />
                      <h5 style={{ color: '#202124', fontFamily: '$sans', fontWeight: 600, margin: '8px 0 2px 0' }}>Google Form Quiz</h5>
                      <p style={{ fontSize: '0.8rem', color: '#5f6368' }}>Interactive self-grading assessment</p>
                    </div>
                    <div style={{ padding: '18px', borderRadius: '12px', background: '#f8f9fa', border: '1px solid #dadce0' }}>
                      <Sparkles size={26} color="#34a853" />
                      <h5 style={{ color: '#202124', fontFamily: '$sans', fontWeight: 600, margin: '8px 0 2px 0' }}>Gemini Studio Assets</h5>
                      <p style={{ fontSize: '0.8rem', color: '#5f6368' }}>High-resolution Imagen visual diagrams</p>
                    </div>
                  </div>
                </CardBody>
              </Card3DInner>
            </CardOuter>
          )}

          {activeTab === 'tutor' && (
            <CardOuter
              key="tutor"
              style={{ rotateX, rotateY }}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.98 }}
              transition={MOTION_TOKENS.spatial}
            >
              <SpecularLightBorder
                style={{
                  background: 'radial-gradient(circle 380px at 50% 50%, rgba(26, 115, 232, 0.18) 0%, transparent 60%)'
                }}
              />
              <Card3DInner>
                <CardHeader>
                  <div>
                    <div style={{ fontFamily: 'Google Sans, Roboto, sans-serif', fontSize: '1.25rem', fontWeight: 600, color: '#202124' }}>
                      Gemini Live Socratic Voice Classroom
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#5f6368', marginTop: '2px' }}>
                      Gemini Multimodal Live API Voice Stream with Emotional Pacing
                    </div>
                  </div>
                  <ActionButtonEl
                    onClick={() => onLaunchTutor(lesson.lessonId)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Headphones size={16} /> Enter Live Socratic Classroom
                  </ActionButtonEl>
                </CardHeader>

                <CardBody>
                  <div style={{ padding: '20px', borderRadius: '14px', backgroundColor: '#e8f0fe', border: '1px solid rgba(26, 115, 232, 0.25)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Award size={20} color="#1a73e8" />
                      <h4 style={{ fontFamily: '$sans', color: '#1a73e8', fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>
                        Socratic Mentor Persona Profile
                      </h4>
                    </div>
                    <p style={{ color: '#202124', fontSize: '0.9rem', lineHeight: 1.55, marginBottom: '14px' }}>
                      {lesson.socraticTutorProfile?.persona || 'World-class Socratic mentor powered by Google Gemini.'}
                    </p>
                    <div style={{ padding: '14px 18px', borderRadius: '10px', backgroundColor: '#ffffff', border: '1px solid #dadce0' }}>
                      <div style={{ fontFamily: '$sans', fontSize: '0.74rem', fontWeight: 600, color: '#1a73e8', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Initial Socratic Inquiry Prompt
                      </div>
                      <div style={{ color: '#202124', fontStyle: 'italic', fontSize: '0.92rem', lineHeight: 1.5 }}>
                        "{lesson.socraticTutorProfile?.firstQuestion}"
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card3DInner>
            </CardOuter>
          )}
        </AnimatePresence>
      </CarouselViewport>
    </StudioContainer>
  );
};
