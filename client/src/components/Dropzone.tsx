/**
 * Dropzone.tsx
 * Multimodal Dropzone with magnetic glowing cursor canvas, file ingestion,
 * and high-speed curriculum presets.
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styled, MOTION_TOKENS } from '../stitches.config';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  X, 
  Sparkles, 
  Zap 
} from 'lucide-react';

const DropzoneWrapper = styled('div', {
  position: 'relative',
  borderRadius: '24px',
  backgroundColor: '$bgCard',
  border: '1px solid #e5dfd3',
  padding: '36px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: '28px',
  boxShadow: '0 20px 40px -15px rgba(70, 55, 40, 0.1)',
  transition: 'border-color 0.3s ease',

  '&:hover': {
    borderColor: '#d4b996'
  }
});

const MagneticGlow = styled(motion.div, {
  position: 'absolute',
  width: '380px',
  height: '380px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(124, 154, 109, 0.1) 0%, rgba(212, 185, 150, 0.05) 50%, transparent 70%)',
  pointerEvents: 'none',
  transform: 'translate(-50%, -50%)',
  zIndex: 0
});

const DropArea = styled('div', {
  position: 'relative',
  zIndex: 1,
  border: '2px dashed #d4b996',
  borderRadius: '20px',
  padding: '44px 24px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  backgroundColor: 'rgba(251, 249, 244, 0.65)',

  variants: {
    isDragging: {
      true: {
        borderColor: '$accentSage',
        backgroundColor: 'rgba(124, 154, 109, 0.08)',
        transform: 'scale(1.01)',
        boxShadow: '0 12px 30px rgba(124, 154, 109, 0.2)'
      }
    }
  }
});

const FormGrid = styled('div', {
  position: 'relative',
  zIndex: 1,
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '18px'
});

const InputGroup = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
});

const Label = styled('label', {
  fontSize: '0.74rem',
  fontWeight: 600,
  fontFamily: '$sans',
  color: '$textSecondary',
  letterSpacing: '0.08em',
  textTransform: 'uppercase'
});

const StyledInput = styled('input', {
  backgroundColor: '#fbf9f4',
  border: '1px solid #e5dfd3',
  borderRadius: '12px',
  padding: '13px 18px',
  color: '$textPrimary',
  fontFamily: '$sans',
  fontSize: '0.92rem',
  outline: 'none',
  transition: 'all 0.25s ease',

  '&:focus': {
    borderColor: '$accentSage',
    boxShadow: '0 0 16px rgba(124, 154, 109, 0.2)',
    backgroundColor: '#ffffff'
  }
});

const StyledTextarea = styled('textarea', {
  backgroundColor: '#fbf9f4',
  border: '1px solid #e5dfd3',
  borderRadius: '12px',
  padding: '14px 18px',
  color: '$textPrimary',
  fontFamily: '$sans',
  fontSize: '0.92rem',
  outline: 'none',
  minHeight: '90px',
  resize: 'vertical',
  transition: 'all 0.25s ease',

  '&:focus': {
    borderColor: '$accentSage',
    boxShadow: '0 0 16px rgba(124, 154, 109, 0.2)',
    backgroundColor: '#ffffff'
  }
});

const StyledSelect = styled('select', {
  backgroundColor: '#fbf9f4',
  border: '1px solid #e5dfd3',
  borderRadius: '12px',
  padding: '13px 18px',
  color: '$textPrimary',
  fontFamily: '$sans',
  fontSize: '0.92rem',
  outline: 'none',
  transition: 'all 0.25s ease',

  '&:focus': {
    borderColor: '$accentSage',
    boxShadow: '0 0 16px rgba(124, 154, 109, 0.2)',
    backgroundColor: '#ffffff'
  }
});

const PresetsContainer = styled('div', {
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  alignItems: 'center'
});

const PresetChip = styled(motion.button, {
  background: '#ffffff',
  border: '1px solid #e5dfd3',
  borderRadius: '9999px',
  padding: '8px 18px',
  color: '$textSecondary',
  fontSize: '0.8rem',
  fontFamily: '$sans',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  boxShadow: '0 2px 8px rgba(70, 55, 40, 0.05)',
  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',

  '&:hover': {
    borderColor: '$accentSage',
    color: '$accentSageDeep',
    backgroundColor: 'rgba(124, 154, 109, 0.08)',
    boxShadow: '0 4px 12px rgba(124, 154, 109, 0.2)'
  }
});

const FileList = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  marginTop: '16px'
});

const FilePill = styled(motion.div, {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  borderRadius: '9999px',
  backgroundColor: 'rgba(124, 154, 109, 0.12)',
  border: '1px solid rgba(124, 154, 109, 0.35)',
  fontSize: '0.82rem',
  color: '$textPrimary',
  boxShadow: '0 2px 8px rgba(70, 55, 40, 0.06)'
});

const PrimaryButton = styled(motion.button, {
  position: 'relative',
  zIndex: 1,
  background: 'linear-gradient(135deg, #7c9a6d 0%, #5f7d52 100%)',
  color: '#ffffff',
  border: 'none',
  borderRadius: '9999px',
  padding: '16px 36px',
  fontSize: '0.92rem',
  fontWeight: 600,
  fontFamily: '$sans',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  boxShadow: '0 10px 28px -6px rgba(124, 154, 109, 0.5)',
  transition: 'box-shadow 0.25s ease, transform 0.25s ease',

  '&:hover': {
    boxShadow: '0 14px 34px -6px rgba(95, 125, 82, 0.65)'
  },

  '&:disabled': {
    opacity: 0.55,
    cursor: 'not-allowed',
    boxShadow: 'none'
  }
});

interface DropzoneProps {
  onGenerate: (payload: {
    topic: string;
    subject: string;
    grade: string;
    rawPrompt: string;
    files: File[];
  }) => void;
  isProcessing: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onGenerate, isProcessing }) => {
  const [topic, setTopic] = useState('Neuroplasticity & Mindful Cognition');
  const [subject, setSubject] = useState('Cognitive Neuroscience & Mind-Body');
  const [grade, setGrade] = useState('Undergraduate / Advanced Seminar');
  const [rawPrompt, setRawPrompt] = useState('Include neurogenesis, synaptic plasticity, Socratic dialogue on focused attention vs default mode network, and tactile somatic metaphors.');
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 200, y: 150 });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...droppedFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selected]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const applyPreset = (pTopic: string, pSubject: string, pGrade: string, pPrompt: string) => {
    setTopic(pTopic);
    setSubject(pSubject);
    setGrade(pGrade);
    setRawPrompt(pPrompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate({
      topic,
      subject,
      grade,
      rawPrompt,
      files
    });
  };

  return (
    <DropzoneWrapper onMouseMove={handleMouseMove}>
      <MagneticGlow
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.5 }}
      />

      <DropArea
        isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept="image/*,.pdf,.doc,.docx,audio/*,.txt"
        />
        <motion.div
          animate={{ y: isDragging ? -4 : 0 }}
          transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
        >
          <Upload size={38} color="#7c9a6d" style={{ margin: '0 auto 12px auto' }} />
        </motion.div>
        <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.45rem', fontWeight: 600, color: '#2e2a24', marginBottom: '6px' }}>
          Multimodal Sanctuary Intake (PDFs, Research, Audio & Syllabi)
        </h4>
        <p style={{ fontSize: '0.88rem', color: '#6b6357', maxWidth: '520px', margin: '0 auto' }}>
          Drag & drop course media or click to browse. Gemini 2.5 ingest & mindful knowledge grounding starts instantly.
        </p>

        {files.length > 0 && (
          <FileList onClick={(e) => e.stopPropagation()}>
            <AnimatePresence>
              {files.map((f, i) => (
                <FilePill
                  key={`${f.name}-${i}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -6 }}
                  transition={MOTION_TOKENS.snappy}
                >
                  {f.type.includes('image') ? <ImageIcon size={14} /> : f.type.includes('audio') ? <Music size={14} /> : <FileText size={14} />}
                  <span>{f.name}</span>
                  <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeFile(i)} />
                </FilePill>
              ))}
            </AnimatePresence>
          </FileList>
        )}
      </DropArea>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <FormGrid>
          <InputGroup>
            <Label>Lesson Topic / Focus</Label>
            <StyledInput
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Neuroplasticity & Mindful Cognition"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Academic Discipline</Label>
            <StyledSelect value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="Cognitive Neuroscience & Mind-Body">Cognitive Neuroscience & Mind-Body</option>
              <option value="Quantum Physics & Computing">Quantum Physics & Computing</option>
              <option value="Molecular Biology & Genetics">Molecular Biology & Genetics</option>
              <option value="Mindful Leadership & Stoic Ethics">Mindful Leadership & Stoic Ethics</option>
              <option value="Machine Learning & Neural Architectures">Machine Learning & Neural Architectures</option>
              <option value="Macroeconomics & Monetary Policy">Macroeconomics & Monetary Policy</option>
            </StyledSelect>
          </InputGroup>

          <InputGroup>
            <Label>Target Proficiency Level</Label>
            <StyledSelect value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value="Undergraduate / Advanced Seminar">Undergraduate / Advanced Seminar</option>
              <option value="Graduate / Research">Graduate / Research</option>
              <option value="High School Honors">High School Honors</option>
              <option value="Executive Education & Retreat">Executive Education & Retreat</option>
            </StyledSelect>
          </InputGroup>
        </FormGrid>

        <InputGroup>
          <Label>Pedagogical Directives & Socratic Traps</Label>
          <StyledTextarea
            value={rawPrompt}
            onChange={(e) => setRawPrompt(e.target.value)}
            placeholder="Add specific nuances, student misconceptions to challenge, or sanctuary atmosphere requirements..."
          />
        </InputGroup>

        <PresetsContainer>
          <span style={{ fontSize: '0.75rem', color: '#8b6b4a', fontFamily: '$sans', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Serenity Curriculum Blueprints:
          </span>
          <PresetChip
            type="button"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={MOTION_TOKENS.snappy}
            onClick={() => applyPreset(
              'Neuroplasticity & Deep Attentive Focus',
              'Cognitive Neuroscience & Mind-Body',
              'Undergraduate / Advanced Seminar',
              'Include neurogenesis, synaptic pruning, Socratic inquiry on focused meditation vs default mode network, and tactile somatic grounding.'
            )}
          >
            <Zap size={12} color="#7c9a6d" /> Neuroplasticity & Mind
          </PresetChip>

          <PresetChip
            type="button"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={MOTION_TOKENS.snappy}
            onClick={() => applyPreset(
              'Stoic Wisdom & Emotional Equilibrium',
              'Mindful Leadership & Stoic Ethics',
              'Executive Education & Retreat',
              'Deconstruct the dichotomy of control, Marcus Aurelius meditations, and challenge the student on modern burnout vs stoic tranquility.'
            )}
          >
            <Sparkles size={12} color="#d4b996" /> Stoic Equilibrium
          </PresetChip>

          <PresetChip
            type="button"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={MOTION_TOKENS.snappy}
            onClick={() => applyPreset(
              'Quantum Superposition & Decoherence',
              'Quantum Physics & Computing',
              'Undergraduate / Advanced Seminar',
              'Include Bloch sphere geometry, Hadamard gates, and challenge student on wave function collapse vs measurement.'
            )}
          >
            <Zap size={12} color="#7c9a6d" /> Quantum Superposition
          </PresetChip>
        </PresetsContainer>

        <PrimaryButton
          type="submit"
          disabled={isProcessing}
          whileHover={{ scale: isProcessing ? 1 : 1.02 }}
          whileTap={{ scale: isProcessing ? 1 : 0.97 }}
          transition={MOTION_TOKENS.snappy}
        >
          <Sparkles size={18} />
          <span>{isProcessing ? 'Synthesizing Sanctuary Experience...' : 'Initiate Mindful Curriculum'}</span>
        </PrimaryButton>
      </form>
    </DropzoneWrapper>
  );
};
