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
  borderRadius: '$cardBorderRadius',
  backgroundColor: '$bgCard',
  border: '1px solid $borderGlass',
  backdropFilter: 'blur(20px)',
  padding: '32px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  transition: 'border-color 0.3s ease',

  '&:hover': {
    borderColor: '$borderGlassHover'
  }
});

const MagneticGlow = styled(motion.div, {
  position: 'absolute',
  width: '350px',
  height: '350px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, transparent 70%)',
  pointerEvents: 'none',
  transform: 'translate(-50%, -50%)',
  zIndex: 0
});

const DropArea = styled('div', {
  position: 'relative',
  zIndex: 1,
  border: '2px dashed rgba(0, 242, 254, 0.25)',
  borderRadius: '16px',
  padding: '40px 24px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.25s ease',
  backgroundColor: 'rgba(9, 12, 21, 0.45)',

  variants: {
    isDragging: {
      true: {
        borderColor: '$accentCyan',
        backgroundColor: 'rgba(0, 242, 254, 0.08)',
        transform: 'scale(1.01)',
        boxShadow: '0 0 30px rgba(0, 242, 254, 0.25)'
      }
    }
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
  gap: '8px'
});

const Label = styled('label', {
  fontSize: '0.8rem',
  fontWeight: 600,
  fontFamily: '$mono',
  color: '$textSecondary',
  letterSpacing: '0.04em',
  textTransform: 'uppercase'
});

const StyledInput = styled('input', {
  backgroundColor: 'rgba(9, 12, 21, 0.8)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '10px',
  padding: '12px 16px',
  color: '$textPrimary',
  fontFamily: '$sans',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'all 0.2s ease',

  '&:focus': {
    borderColor: '$accentCyan',
    boxShadow: '0 0 15px rgba(0, 242, 254, 0.25)'
  }
});

const StyledTextarea = styled('textarea', {
  backgroundColor: 'rgba(9, 12, 21, 0.8)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '10px',
  padding: '14px 16px',
  color: '$textPrimary',
  fontFamily: '$sans',
  fontSize: '0.9rem',
  outline: 'none',
  minHeight: '90px',
  resize: 'vertical',
  transition: 'all 0.2s ease',

  '&:focus': {
    borderColor: '$accentCyan',
    boxShadow: '0 0 15px rgba(0, 242, 254, 0.25)'
  }
});

const StyledSelect = styled('select', {
  backgroundColor: 'rgba(9, 12, 21, 0.8)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '10px',
  padding: '12px 16px',
  color: '$textPrimary',
  fontFamily: '$sans',
  fontSize: '0.9rem',
  outline: 'none',

  '&:focus': {
    borderColor: '$accentCyan'
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
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '9999px',
  padding: '7px 15px',
  color: '$textSecondary',
  fontSize: '0.8rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',

  '&:hover': {
    borderColor: '$accentCyan',
    color: '$accentCyan',
    backgroundColor: 'rgba(0, 242, 254, 0.08)',
    boxShadow: '0 0 16px rgba(0, 242, 254, 0.2)'
  }
});

const FileList = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  marginTop: '14px'
});

const FilePill = styled(motion.div, {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '7px 14px',
  borderRadius: '10px',
  backgroundColor: 'rgba(0, 242, 254, 0.12)',
  border: '1px solid rgba(0, 242, 254, 0.35)',
  fontSize: '0.82rem',
  color: '$textPrimary',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
});

const PrimaryButton = styled(motion.button, {
  position: 'relative',
  zIndex: 1,
  background: 'linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%)',
  color: '#090C15',
  border: 'none',
  borderRadius: '14px',
  padding: '16px 32px',
  fontSize: '1.02rem',
  fontWeight: 700,
  fontFamily: '$display',
  letterSpacing: '0.03em',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  boxShadow: '0 0 30px rgba(0, 242, 254, 0.45)',
  transition: 'box-shadow 0.25s ease',

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
  const [topic, setTopic] = useState('Quantum Computing & Superposition');
  const [subject, setSubject] = useState('Quantum Physics & Computing');
  const [grade, setGrade] = useState('Undergraduate / AP');
  const [rawPrompt, setRawPrompt] = useState('Include Dirac bra-ket notation, Bloch sphere intuition, and interactive socratic traps.');
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
          <Upload size={38} color="#00F2FE" style={{ margin: '0 auto 12px auto' }} />
        </motion.div>
        <h4 style={{ fontFamily: 'Syne', fontSize: '1.15rem', color: '#F8FAFC', marginBottom: '6px' }}>
          Multimodal Dropzone (PDFs, Images, Audio, Syllabi)
        </h4>
        <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
          Drag & drop course media or click to browse. Gemini 2.5 ingest & search-grounding starts instantly.
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
              placeholder="e.g. CRISPR Cas-9 Gene Editing"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Academic Discipline</Label>
            <StyledSelect value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="Quantum Physics & Computing">Quantum Physics & Computing</option>
              <option value="Molecular Biology & Genetics">Molecular Biology & Genetics</option>
              <option value="Machine Learning & Neural Architectures">Machine Learning & Neural Architectures</option>
              <option value="Macroeconomics & Monetary Policy">Macroeconomics & Monetary Policy</option>
              <option value="Astrophysics & Cosmology">Astrophysics & Cosmology</option>
            </StyledSelect>
          </InputGroup>

          <InputGroup>
            <Label>Target Proficiency Level</Label>
            <StyledSelect value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value="Undergraduate / AP">Undergraduate / AP</option>
              <option value="Graduate / Research">Graduate / Research</option>
              <option value="High School Honors">High School Honors</option>
              <option value="Executive Education">Executive Education</option>
            </StyledSelect>
          </InputGroup>
        </FormGrid>

        <InputGroup>
          <Label>Pedagogical Directives & Socratic Traps</Label>
          <StyledTextarea
            value={rawPrompt}
            onChange={(e) => setRawPrompt(e.target.value)}
            placeholder="Add specific nuances, student misconceptions to challenge, or workspace requirements..."
          />
        </InputGroup>

        <PresetsContainer>
          <span style={{ fontSize: '0.78rem', color: '#64748B', fontFamily: 'JetBrains Mono' }}>
            QUICK HACKATHON PRESETS:
          </span>
          <PresetChip
            type="button"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={MOTION_TOKENS.snappy}
            onClick={() => applyPreset(
              'Quantum Superposition & Decoherence',
              'Quantum Physics & Computing',
              'Undergraduate / AP',
              'Include Bloch sphere geometry, Hadamard gates, and challenge student on wave function collapse vs measurement.'
            )}
          >
            <Zap size={12} /> Quantum Superposition
          </PresetChip>

          <PresetChip
            type="button"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={MOTION_TOKENS.snappy}
            onClick={() => applyPreset(
              'CRISPR-Cas9 & Base Editing Mechanisms',
              'Molecular Biology & Genetics',
              'Graduate / Research',
              'Focus on PAM site recognition, guide RNA mismatch tolerances, and off-target cleavage mitigation.'
            )}
          >
            <Sparkles size={12} /> CRISPR-Cas9
          </PresetChip>

          <PresetChip
            type="button"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={MOTION_TOKENS.snappy}
            onClick={() => applyPreset(
              'Transformer Attention & Positional Encodings',
              'Machine Learning & Neural Architectures',
              'Undergraduate / AP',
              'Derive Scaled Dot-Product Attention from first principles and probe Rotary Position Embeddings (RoPE).'
            )}
          >
            <Zap size={12} /> Transformers & Attention
          </PresetChip>
        </PresetsContainer>

        <PrimaryButton
          type="submit"
          disabled={isProcessing}
          whileHover={{ scale: isProcessing ? 1 : 1.02 }}
          whileTap={{ scale: isProcessing ? 1 : 0.97 }}
          transition={MOTION_TOKENS.snappy}
        >
          <Sparkles size={20} />
          <span>{isProcessing ? 'Orchestrating Live Ecosystem...' : 'Initiate Multimodal Pipeline'}</span>
        </PrimaryButton>
      </form>
    </DropzoneWrapper>
  );
};
