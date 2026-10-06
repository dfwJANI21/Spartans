/**
 * ArtifactStudio3D.tsx
 * Interactive 3D parallax carousel using Framer Motion useMotionValue and useTransform.
 * Showcases Google Docs, Graded Google Forms, Drive Folders, and Live Socratic Agent.
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
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Award,
  ArrowRight
} from 'lucide-react';

const StudioContainer = styled('div', {
  width: '100%',
  perspective: 1400,
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  marginTop: '16px'
});

const ControlsBar = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 16px',
  borderRadius: '16px',
  backgroundColor: '$bgCard',
  border: '1px solid $borderGlass',
  backdropFilter: 'blur(20px)',
  boxShadow: '$cardShadow'
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
  borderRadius: '10px',
  padding: '10px 18px',
  fontSize: '0.86rem',
  fontFamily: '$sans',
  fontWeight: 600,
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
        color: '$accentSageDeep'
      }
    }
  },

  '&:hover': {
    color: '$textPrimary'
  }
});

const ActiveTabGlider = styled(motion.div, {
  position: 'absolute',
  inset: 0,
  borderRadius: '10px',
  backgroundColor: 'rgba(124, 154, 109, 0.12)',
  border: '1px solid rgba(124, 154, 109, 0.35)',
  boxShadow: '0 4px 15px rgba(124, 154, 109, 0.15)',
  zIndex: 0
});

const CarouselViewport = styled('div', {
  width: '100%',
  minHeight: '490px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative'
});

const CardOuter = styled(motion.div, {
  width: '100%',
  maxWidth: '860px',
  position: 'relative',
  borderRadius: '24px',
  padding: '1px',
  overflow: 'hidden',
  transformStyle: 'preserve-3d',
  boxShadow: '0 24px 60px rgba(70, 55, 40, 0.12), 0 0 35px rgba(124, 154, 109, 0.1)'
});

const SpecularLightBorder = styled(motion.div, {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  borderRadius: '24px',
  zIndex: 0
});

const Card3DInner = styled('div', {
  position: 'relative',
  zIndex: 1,
  borderRadius: '23px',
  backgroundColor: '#ffffff',
  backdropFilter: 'blur(28px)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  transformStyle: 'preserve-3d',
  border: '1px solid #e5dfd3'
});

const CardHeader = styled('div', {
  padding: '26px 34px',
  borderBottom: '1px solid #e5dfd3',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'linear-gradient(90deg, rgba(124, 154, 109, 0.08) 0%, transparent 100%)',
  transform: 'translateZ(25px)'
});

const CardBody = styled('div', {
  padding: '32px 34px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  transform: 'translateZ(40px)' // 3D depth layer pop
});

const ImageBanner = styled('div', {
  width: '100%',
  height: '240px',
  borderRadius: '14px',
  overflow: 'hidden',
  position: 'relative',
  border: '1px solid #e5dfd3',
  transform: 'translateZ(30px)',
  boxShadow: '0 8px 24px rgba(70, 55, 40, 0.1)',

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
  borderRadius: '9999px',
  backgroundColor: 'rgba(255, 255, 255, 0.94)',
  backdropFilter: 'blur(12px)',
  fontFamily: '$sans',
  fontWeight: 600,
  fontSize: '0.75rem',
  color: '$accentSageDeep',
  border: '1px solid #e5dfd3',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  boxShadow: '0 4px 14px rgba(70, 55, 40, 0.1)'
});

const ActionButton = styled(motion.a, {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 24px',
  borderRadius: '9999px',
  fontFamily: '$sans',
  fontSize: '0.88rem',
  fontWeight: 600,
  textDecoration: 'none',
  cursor: 'pointer',
  transform: 'translateZ(55px)',
  transition: 'all 0.25s ease',

  variants: {
    variant: {
      primary: {
        background: 'linear-gradient(135deg, #7c9a6d 0%, #5f7d52 100%)',
        color: '#ffffff',
        boxShadow: '0 6px 20px rgba(124, 154, 109, 0.4)'
      },
      secondary: {
        background: '#fbf9f4',
        border: '1px solid #e5dfd3',
        color: '$textPrimary'
      }
    }
  }
});

const ActionButtonEl = styled(motion.button, {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 24px',
  borderRadius: '9999px',
  fontFamily: '$sans',
  fontSize: '0.88rem',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  transform: 'translateZ(55px)',
  background: 'linear-gradient(135deg, #7c9a6d 0%, #5f7d52 100%)',
  color: '#ffffff',
  boxShadow: '0 6px 20px rgba(124, 154, 109, 0.4)'
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

  const rotateX = useSpring(useTransform(mouseY, [-220, 220], [8, -8]), MOTION_TOKENS.spatial);
  const rotateY = useSpring(useTransform(mouseX, [-400, 400], [-10, 10]), MOTION_TOKENS.spatial);

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
              doc: { label: 'Google Doc Guide', icon: FileText },
              form: { label: 'Graded Assessment', icon: CheckSquare },
              drive: { label: 'Drive Ecosystem', icon: FolderGit2 },
              tutor: { label: 'Live Socratic HUD', icon: Headphones }
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
                <IconComp size={16} />
                <span>{labels[tab].label}</span>
              </TabPill>
            );
          })}
        </TabPills>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={16} color="#10B981" />
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontFamily: 'JetBrains Mono' }}>
            Search Grounded & Formatted
          </span>
        </div>
      </ControlsBar>

      <CarouselViewport onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <AnimatePresence mode="wait">
          {activeTab === 'doc' && (
            <CardOuter
              key="doc"
              style={{ rotateX, rotateY }}
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.96 }}
              transition={MOTION_TOKENS.spatial}
            >
              <SpecularLightBorder
                style={{
                  background: 'radial-gradient(circle 380px at 50% 50%, rgba(124, 154, 109, 0.35) 0%, rgba(212, 185, 150, 0.15) 40%, transparent 70%)'
                }}
              />
              <Card3DInner>

              <CardHeader>
                <div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 600, color: '#2e2a24' }}>
                    {lesson.lessonTitle || 'Multimodal Lesson Plan'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#6b6357', marginTop: '4px' }}>
                    {lesson.subject} • {lesson.grade}
                  </div>
                </div>
                <ActionButton
                  href={workspace.docUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  variant="primary"
                >
                  <ExternalLink size={16} /> Open in Google Docs
                </ActionButton>
              </CardHeader>

              <CardBody>
                {lesson.visualAsset?.url && (
                  <ImageBanner>
                    <img src={lesson.visualAsset.url} alt="Synthesized Concept" />
                    <ImageBadge>
                      <Sparkles size={12} /> Gemini 3 Pro / Imagen Visual Asset
                    </ImageBadge>
                  </ImageBanner>
                )}

                <div>
                  <h4 style={{ color: '#5f7d52', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Executive Summary
                  </h4>
                  <p style={{ color: '#2e2a24', fontSize: '0.95rem', lineHeight: 1.65 }}>
                    {lesson.summary}
                  </p>
                </div>

                {docContent.learningObjectives && (
                  <div>
                    <h4 style={{ color: '#5f7d52', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Core Objectives
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {docContent.learningObjectives.map((obj: string, i: number) => (
                        <div key={i} style={{ fontSize: '0.9rem', color: '#4a4237', display: 'flex', gap: '8px' }}>
                          <span style={{ color: '#7c9a6d', fontWeight: 600 }}>[{i + 1}]</span>
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
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.96 }}
              transition={MOTION_TOKENS.spatial}
            >
              <SpecularLightBorder
                style={{
                  background: 'radial-gradient(circle 380px at 50% 50%, rgba(212, 185, 150, 0.4) 0%, rgba(124, 154, 109, 0.15) 40%, transparent 70%)'
                }}
              />
              <Card3DInner>
                <CardHeader>
                  <div>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 600, color: '#2e2a24' }}>
                      Graded Diagnostic & Socratic Check
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#6b6357', marginTop: '4px' }}>
                      Self-grading Google Form with pedagogical explanations
                    </div>
                  </div>
                  <ActionButton
                    href={workspace.formUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    variant="primary"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <ExternalLink size={16} /> Open Google Form
                  </ActionButton>
                </CardHeader>

                <CardBody>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {quiz.slice(0, 3).map((q: any, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          padding: '20px',
                          borderRadius: '16px',
                          backgroundColor: '#fbf9f4',
                          border: '1px solid #e5dfd3'
                        }}
                      >
                        <div style={{ fontSize: '0.98rem', fontWeight: 600, color: '#2e2a24', marginBottom: '12px' }}>
                          {idx + 1}. {q.question}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          {q.options?.map((opt: string, optIdx: number) => (
                            <div
                              key={optIdx}
                              style={{
                                padding: '10px 14px',
                                borderRadius: '10px',
                                fontSize: '0.85rem',
                                backgroundColor: optIdx === q.correctIndex ? 'rgba(124, 154, 109, 0.16)' : '#ffffff',
                                border: optIdx === q.correctIndex ? '1px solid #7c9a6d' : '1px solid #e5dfd3',
                                color: optIdx === q.correctIndex ? '#5f7d52' : '#6b6357',
                                fontWeight: optIdx === q.correctIndex ? 600 : 400
                              }}
                            >
                              {opt} {optIdx === q.correctIndex && '✓ (Key)'}
                            </div>
                          ))}
                        </div>
                        {q.explanation && (
                          <div style={{ marginTop: '12px', fontSize: '0.82rem', color: '#8b6b4a', fontStyle: 'italic' }}>
                            Pedagogical Rationale: {q.explanation}
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
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.96 }}
              transition={MOTION_TOKENS.spatial}
            >
              <SpecularLightBorder
                style={{
                  background: 'radial-gradient(circle 380px at 50% 50%, rgba(212, 185, 150, 0.35) 0%, rgba(124, 154, 109, 0.15) 40%, transparent 70%)'
                }}
              />
              <Card3DInner>
                <CardHeader>
                  <div>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 600, color: '#2e2a24' }}>
                      Google Drive Cloud Architecture
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#6b6357', marginTop: '4px' }}>
                      Synchronized repository for documents, student quiz submissions & visual assets
                    </div>
                  </div>
                  <ActionButton
                    href={workspace.folderUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    variant="primary"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <ExternalLink size={16} /> Open Drive Folder
                  </ActionButton>
                </CardHeader>

                <CardBody>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    <div style={{ padding: '22px', borderRadius: '16px', background: '#fbf9f4', border: '1px solid #e5dfd3' }}>
                      <FileText size={28} color="#7c9a6d" />
                      <h5 style={{ color: '#2e2a24', fontFamily: 'Inter, sans-serif', fontWeight: 600, margin: '10px 0 4px 0' }}>Teacher & Student Guide</h5>
                      <p style={{ fontSize: '0.82rem', color: '#6b6357' }}>Complete formatted document</p>
                    </div>
                    <div style={{ padding: '22px', borderRadius: '16px', background: '#fbf9f4', border: '1px solid #e5dfd3' }}>
                      <CheckSquare size={28} color="#5f7d52" />
                      <h5 style={{ color: '#2e2a24', fontFamily: 'Inter, sans-serif', fontWeight: 600, margin: '10px 0 4px 0' }}>Formative Quiz Assessment</h5>
                      <p style={{ fontSize: '0.82rem', color: '#6b6357' }}>Self-grading Google Form</p>
                    </div>
                    <div style={{ padding: '22px', borderRadius: '16px', background: '#fbf9f4', border: '1px solid #e5dfd3' }}>
                      <FolderGit2 size={28} color="#d4b996" />
                      <h5 style={{ color: '#2e2a24', fontFamily: 'Inter, sans-serif', fontWeight: 600, margin: '10px 0 4px 0' }}>Synthesized Visual Assets</h5>
                      <p style={{ fontSize: '0.82rem', color: '#6b6357' }}>16:9 Imagen 3 renders</p>
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
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.96 }}
              transition={MOTION_TOKENS.spatial}
            >
              <SpecularLightBorder
                style={{
                  background: 'radial-gradient(circle 380px at 50% 50%, rgba(124, 154, 109, 0.4) 0%, rgba(212, 185, 150, 0.2) 40%, transparent 70%)'
                }}
              />
              <Card3DInner>
                <CardHeader>
                  <div>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 600, color: '#2e2a24' }}>
                      Live Socratic Agent Sanctuary
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#6b6357', marginTop: '4px' }}>
                      Gemini Multimodal Live API Voice Stream with Emotional Pacing
                    </div>
                  </div>
                  <ActionButtonEl
                    onClick={() => onLaunchTutor(lesson.lessonId)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <Headphones size={18} /> Launch Student Voice Sanctuary
                  </ActionButtonEl>
                </CardHeader>

                <CardBody>
                  <div style={{ padding: '26px', borderRadius: '18px', backgroundColor: 'rgba(124, 154, 109, 0.08)', border: '1px solid rgba(124, 154, 109, 0.25)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <Award size={22} color="#7c9a6d" />
                      <h4 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#2e2a24', fontSize: '1.3rem', fontWeight: 600 }}>
                        Socratic Mentor Sanctuary Profile
                      </h4>
                    </div>
                    <p style={{ color: '#4a4237', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '16px' }}>
                      {lesson.socraticTutorProfile?.persona || 'World-class Socratic mentor grounded in mindful pedagogy.'}
                    </p>
                    <div style={{ padding: '16px 20px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e5dfd3' }}>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#5f7d52', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>
                        First Socratic Inquiry
                      </div>
                      <div style={{ color: '#2e2a24', fontStyle: 'italic', fontSize: '0.95rem', lineHeight: 1.5 }}>
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
