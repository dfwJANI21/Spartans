/**
 * Dropzone.tsx
 * Google Workspace for Education Multimodal Ingestion Dropzone
 * Features Google Material Design 3 inputs, Drive-style drag-and-drop,
 * and high-speed curriculum blueprints.
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styled, MOTION_TOKENS } from '../stitches.config';
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  X, 
  Sparkles, 
  Cpu,
  Atom,
  Dna,
  TrendingUp,
  FolderUp
} from 'lucide-react';

const DropzoneWrapper = styled('div', {
  position: 'relative',
  borderRadius: '20px',
  backgroundColor: '$bgCard',
  border: '1px solid #dadce0',
  padding: '32px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  boxShadow: '0 1px 3px 0 rgba(60, 64, 67, 0.12), 0 2px 6px 2px rgba(60, 64, 67, 0.06)',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',

  '&:hover': {
    borderColor: '#bdc1c6'
  }
});

const MagneticGlow = styled(motion.div, {
  position: 'absolute',
  width: '380px',
  height: '380px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(26, 115, 232, 0.08) 0%, rgba(66, 133, 244, 0.03) 50%, transparent 70%)',
  pointerEvents: 'none',
  transform: 'translate(-50%, -50%)',
  zIndex: 0
});

const DropArea = styled('div', {
  position: 'relative',
  zIndex: 1,
  border: '2px dashed #dadce0',
  borderRadius: '16px',
  padding: '38px 24px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  backgroundColor: '#f8f9fa',

  variants: {
    isDragging: {
      true: {
        borderColor: '#1a73e8',
        backgroundColor: '#e8f0fe',
        transform: 'scale(1.008)',
        boxShadow: '0 4px 16px rgba(26, 115, 232, 0.18)'
      }
    }
  },

  '&:hover': {
    borderColor: '#1a73e8',
    backgroundColor: '#f1f6fd'
  }
});

const FormGrid = styled('div', {
  position: 'relative',
  zIndex: 1,
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '16px'
});

const InputGroup = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
});

const Label = styled('label', {
  fontSize: '0.78rem',
  fontWeight: 600,
  fontFamily: '$sans',
  color: '$textSecondary',
  letterSpacing: '0.02em'
});

const StyledInput = styled('input', {
  backgroundColor: '#ffffff',
  border: '1px solid #dadce0',
  borderRadius: '8px',
  padding: '12px 16px',
  color: '$textPrimary',
  fontSize: '0.92rem',
  fontFamily: '$sans',
  outline: 'none',
  transition: 'all 0.2s ease',

  '&:focus': {
    borderColor: '#1a73e8',
    boxShadow: '0 0 0 2px rgba(26, 115, 232, 0.2)'
  },

  '&::placeholder': {
    color: '$textMuted'
  }
});

const StyledSelect = styled('select', {
  backgroundColor: '#ffffff',
  border: '1px solid #dadce0',
  borderRadius: '8px',
  padding: '12px 16px',
  color: '$textPrimary',
  fontSize: '0.92rem',
  fontFamily: '$sans',
  outline: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease',

  '&:focus': {
    borderColor: '#1a73e8',
    boxShadow: '0 0 0 2px rgba(26, 115, 232, 0.2)'
  }
});

const StyledTextarea = styled('textarea', {
  backgroundColor: '#ffffff',
  border: '1px solid #dadce0',
  borderRadius: '8px',
  padding: '12px 16px',
  color: '$textPrimary',
  fontSize: '0.92rem',
  fontFamily: '$sans',
  outline: 'none',
  minHeight: '85px',
  resize: 'vertical',
  transition: 'all 0.2s ease',

  '&:focus': {
    borderColor: '#1a73e8',
    boxShadow: '0 0 0 2px rgba(26, 115, 232, 0.2)'
  },

  '&::placeholder': {
    color: '$textMuted'
  }
});

const PresetsContainer = styled('div', {
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  alignItems: 'center'
});

const PresetChip = styled(motion.button, {
  background: '#ffffff',
  border: '1px solid #dadce0',
  borderRadius: '16px',
  padding: '6px 14px',
  fontSize: '0.8rem',
  fontFamily: '$sans',
  fontWeight: 500,
  color: '$textSecondary',
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

const FileList = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '14px'
});

const FilePill = styled(motion.div, {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 14px',
  borderRadius: '16px',
  backgroundColor: '#e8f0fe',
  border: '1px solid rgba(26, 115, 232, 0.3)',
  fontSize: '0.82rem',
  color: '#1a73e8',
  boxShadow: '0 1px 3px rgba(60, 64, 67, 0.08)'
});

const PrimaryButton = styled(motion.button, {
  position: 'relative',
  zIndex: 1,
  backgroundColor: '#1a73e8',
  color: '#ffffff',
  border: 'none',
  borderRadius: '24px',
  padding: '14px 32px',
  fontSize: '0.92rem',
  fontWeight: 600,
  fontFamily: '$sans',
  letterSpacing: '0.02em',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  boxShadow: '0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15)',
  transition: 'background-color 0.2s ease, box-shadow 0.2s ease',

  '&:hover': {
    backgroundColor: '#1557b0',
    boxShadow: '0 2px 6px 2px rgba(60, 64, 67, 0.25), 0 1px 2px 0 rgba(60, 64, 67, 0.3)'
  },

  '&:disabled': {
    opacity: 0.5,
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
  const [topic, setTopic] = useState('Neural Attention Mechanisms & Transformers');
  const [subject, setSubject] = useState('Machine Learning & Computer Science');
  const [grade, setGrade] = useState('Undergraduate / Advanced Seminar');
  const [rawPrompt, setRawPrompt] = useState('Cover query-key-value dot product attention, multi-head projections, positional encoding, and challenge student on quadratic computational complexity vs linear approximations.');
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
          animate={{ y: isDragging ? -3 : 0 }}
          transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
        >
          <FolderUp size={38} color="#1a73e8" style={{ margin: '0 auto 10px auto' }} />
        </motion.div>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#202124', marginBottom: '6px' }}>
          Drag & Drop Curriculum Documents, Images, or Audio
        </h4>
        <p style={{ fontSize: '0.85rem', color: '#5f6368', maxWidth: '520px', margin: '0 auto' }}>
          Import PDFs, DOCX, lecture audio, or diagrams directly into the Google Workspace pipeline, or click to browse files.
        </p>

        {files.length > 0 && (
          <FileList onClick={(e) => e.stopPropagation()}>
            <AnimatePresence>
              {files.map((f, i) => (
                <FilePill
                  key={f.name + i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={MOTION_TOKENS.snappy}
                >
                  {f.type.includes('image') ? <ImageIcon size={14} /> : f.type.includes('audio') ? <Music size={14} /> : <FileText size={14} />}
                  <span>{f.name}</span>
                  <X size={14} style={{ cursor: 'pointer', marginLeft: '2px' }} onClick={() => removeFile(i)} />
                </FilePill>
              ))}
            </AnimatePresence>
          </FileList>
        )}
      </DropArea>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <FormGrid>
          <InputGroup>
            <Label>Lesson Topic / Curriculum Focus</Label>
            <StyledInput
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Neural Attention Mechanisms & Transformers"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Academic Subject</Label>
            <StyledSelect value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="Machine Learning & Computer Science">Machine Learning & Computer Science</option>
              <option value="Quantum Physics & Computing">Quantum Physics & Computing</option>
              <option value="Cellular Biology & Genetics">Cellular Biology & Genetics</option>
              <option value="Macroeconomics & Monetary Policy">Macroeconomics & Monetary Policy</option>
              <option value="Cognitive Neuroscience">Cognitive Neuroscience</option>
              <option value="World History & Governance">World History & Governance</option>
            </StyledSelect>
          </InputGroup>

          <InputGroup>
            <Label>Target Academic Level</Label>
            <StyledSelect value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value="Undergraduate / Advanced Seminar">Undergraduate / Advanced Seminar</option>
              <option value="Graduate / Research Level">Graduate / Research Level</option>
              <option value="High School AP / Honors">High School AP / Honors</option>
              <option value="Professional / Executive Education">Professional / Executive Education</option>
            </StyledSelect>
          </InputGroup>
        </FormGrid>

        <InputGroup>
          <Label>Pedagogical Directives & Socratic Inquiry Goals</Label>
          <StyledTextarea
            value={rawPrompt}
            onChange={(e) => setRawPrompt(e.target.value)}
            placeholder="Add specific learning goals, misconceptions to confront, or Socratic inquiry instructions..."
          />
        </InputGroup>

        <PresetsContainer>
          <span style={{ fontSize: '0.78rem', color: '#5f6368', fontFamily: '$sans', fontWeight: 600 }}>
            Google Education Blueprints:
          </span>
          <PresetChip
            type="button"
            whileHover={{ y: -1, scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            transition={MOTION_TOKENS.snappy}
            onClick={() => applyPreset(
              'Neural Attention Mechanisms & Transformers',
              'Machine Learning & Computer Science',
              'Undergraduate / Advanced Seminar',
              'Cover query-key-value dot product attention, multi-head projections, positional encoding, and challenge student on quadratic computational complexity vs linear approximations.'
            )}
          >
            <Cpu size={13} color="#1a73e8" />
            <span>Transformers & Attention</span>
          </PresetChip>

          <PresetChip
            type="button"
            whileHover={{ y: -1, scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            transition={MOTION_TOKENS.snappy}
            onClick={() => applyPreset(
              'Quantum Superposition & Decoherence',
              'Quantum Physics & Computing',
              'Undergraduate / Advanced Seminar',
              'Include Bloch sphere geometry, Hadamard gates, and challenge student on wave function collapse vs quantum measurement.'
            )}
          >
            <Atom size={13} color="#34a853" />
            <span>Quantum Superposition</span>
          </PresetChip>

          <PresetChip
            type="button"
            whileHover={{ y: -1, scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            transition={MOTION_TOKENS.snappy}
            onClick={() => applyPreset(
              'CRISPR-Cas9 & Gene Editing Mechanics',
              'Cellular Biology & Genetics',
              'Graduate / Research Level',
              'Deconstruct guide RNA targeting, double-strand break repair pathways (NHEJ vs HDR), and off-target cleavage minimization.'
            )}
          >
            <Dna size={13} color="#fbbc04" />
            <span>CRISPR Gene Editing</span>
          </PresetChip>

          <PresetChip
            type="button"
            whileHover={{ y: -1, scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            transition={MOTION_TOKENS.snappy}
            onClick={() => applyPreset(
              'Central Bank Monetary Policy & Inflation',
              'Macroeconomics & Monetary Policy',
              'Undergraduate / Advanced Seminar',
              'Examine Taylor rule, quantitative tightening, interest rate transmission channels, and supply-push vs demand-pull inflation.'
            )}
          >
            <TrendingUp size={13} color="#ea4335" />
            <span>Monetary Policy & Inflation</span>
          </PresetChip>
        </PresetsContainer>

        <PrimaryButton
          type="submit"
          disabled={isProcessing}
          whileHover={{ scale: isProcessing ? 1 : 1.01 }}
          whileTap={{ scale: isProcessing ? 1 : 0.98 }}
          transition={MOTION_TOKENS.snappy}
        >
          <Sparkles size={18} />
          <span>{isProcessing ? 'Synthesizing with Gemini 3 Pro...' : 'Synthesize Curriculum with Gemini'}</span>
        </PrimaryButton>
      </form>
    </DropzoneWrapper>
  );
};
