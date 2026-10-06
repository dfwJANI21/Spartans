/**
 * AudioCanvas.tsx
 * Artisan 60fps Multi-Octave Harmonic Fluid Visualizer.
 * Synthesizes smoothed audio RMS energy, harmonic wavefield dispersion,
 * dynamic transient shockwaves, and orbital stardust physics.
 */

import React, { useRef, useEffect } from 'react';
import { styled } from '../stitches.config';
import { SentimentState } from '../hooks/useGeminiLiveTutor';

interface AudioCanvasProps {
  studentLevel: number; // 0.0 to 1.0
  aiLevel: number;      // 0.0 to 1.0
  isLive: boolean;
  sentiment: SentimentState;
}

const CanvasContainer = styled('div', {
  position: 'relative',
  width: '100%',
  maxWidth: '480px',
  height: '350px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  overflow: 'hidden'
});

const StyledCanvas = styled('canvas', {
  width: '100%',
  height: '100%',
  filter: 'drop-shadow(0 0 28px rgba(0, 242, 254, 0.3))',
  transition: 'filter 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
});

const AmbientStatusPill = styled('div', {
  position: 'absolute',
  bottom: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 16px',
  borderRadius: '9999px',
  background: 'rgba(9, 12, 21, 0.82)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  fontFamily: '$mono',
  fontSize: '0.75rem',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '$textSecondary',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
  zIndex: 2,
  transition: 'all 0.3s ease'
});

const StatusDot = styled('span', {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  transition: 'all 0.3s ease',
  variants: {
    state: {
      idle: { backgroundColor: '#64748B' },
      studentSpeaking: { backgroundColor: '$accentCyan', boxShadow: '0 0 12px $accentCyan' },
      aiSpeaking: { backgroundColor: '#A855F7', boxShadow: '0 0 16px #A855F7' },
      calmMode: { backgroundColor: '#FF9E64', boxShadow: '0 0 16px #FF9E64' }
    }
  }
});

interface Shockwave {
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
}

interface StardustParticle {
  angle: number;
  distance: number;
  speed: number;
  size: number;
  alpha: number;
}

export const AudioCanvas: React.FC<AudioCanvasProps> = ({
  studentLevel,
  aiLevel,
  isLive,
  sentiment
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const phaseRef = useRef(0);
  const smoothedEnergyRef = useRef(0);
  const prevEnergyRef = useRef(0);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const stardustRef = useRef<StardustParticle[]>([]);

  // Initialize stardust particles once
  useEffect(() => {
    const particles: StardustParticle[] = [];
    for (let i = 0; i < 28; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        distance: 25 + Math.random() * 85,
        speed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.7 + 0.3
      });
    }
    stardustRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Smoothly interpolate target energy via dynamic lerp (avoids twitches)
      const targetEnergy = isLive ? Math.min(1.0, studentLevel * 1.35 + aiLevel * 1.6) : 0.04;
      const lerpFactor = targetEnergy > smoothedEnergyRef.current ? 0.22 : 0.08;
      smoothedEnergyRef.current += (targetEnergy - smoothedEnergyRef.current) * lerpFactor;
      const energy = smoothedEnergyRef.current;

      // 2. Transient spike detector: spawn shockwaves on audio volume surges
      const delta = energy - prevEnergyRef.current;
      if (delta > 0.14 && isLive && shockwavesRef.current.length < 4) {
        shockwavesRef.current.push({
          radius: Math.min(width, height) * 0.16,
          maxRadius: Math.min(width, height) * 0.46,
          opacity: 0.85,
          speed: 2.2 + delta * 4
        });
      }
      prevEnergyRef.current = energy;

      phaseRef.current += 0.024 + energy * 0.04;
      ctx.clearRect(0, 0, width, height);

      // Mode-based palette interpolation
      const isCalm = sentiment === 'calm';
      const cPrimary = isCalm ? [255, 158, 100] : [0, 242, 254];
      const cSecondary = isCalm ? [251, 113, 133] : [99, 102, 241];
      const cCore = isCalm ? [255, 245, 234] : [248, 250, 252];

      const baseRadius = Math.min(width, height) * 0.18 * (1 + energy * 0.35);

      // 3. Ambient Volumetric Glow Background
      const ambientGrad = ctx.createRadialGradient(
        centerX, centerY, baseRadius * 0.1,
        centerX, centerY, baseRadius * 2.5
      );
      ambientGrad.addColorStop(0, `rgba(${cPrimary[0]}, ${cPrimary[1]}, ${cPrimary[2]}, ${isLive ? 0.28 + energy * 0.3 : 0.08})`);
      ambientGrad.addColorStop(0.5, `rgba(${cSecondary[0]}, ${cSecondary[1]}, ${cSecondary[2]}, ${isLive ? 0.12 + energy * 0.15 : 0.04})`);
      ambientGrad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = ambientGrad;
      ctx.fill();

      // 4. Render Transient Expanding Shockwaves
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += sw.speed;
        sw.opacity *= 0.94;

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${cPrimary[0]}, ${cPrimary[1]}, ${cPrimary[2]}, ${sw.opacity * 0.5})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();

        if (sw.opacity < 0.02 || sw.radius >= sw.maxRadius) {
          shockwavesRef.current.splice(i, 1);
        }
      }

      // 5. Multi-Octave Harmonic Fluid Wavefield (3 Superimposed Wave Layers)
      const layers = [
        { color: cPrimary, scale: 1.0, freq: 3, ampMultiplier: 1.0, phaseOffset: 0 },
        { color: cSecondary, scale: 1.15, freq: 5, ampMultiplier: 0.85, phaseOffset: Math.PI / 3 },
        { color: [255, 255, 255], scale: 1.28, freq: 7, ampMultiplier: 0.65, phaseOffset: Math.PI / 2 }
      ];

      layers.forEach((l, layerIdx) => {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = isCalm ? 1.5 : 1.8;
        const alpha = Math.max(0.12, 0.55 - layerIdx * 0.15 + energy * 0.35);
        ctx.strokeStyle = `rgba(${l.color[0]}, ${l.color[1]}, ${l.color[2]}, ${alpha})`;

        const points = 72;
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;
          // Superimposed trigonometric harmonics
          const harmonic1 = Math.sin(angle * l.freq + phaseRef.current + l.phaseOffset);
          const harmonic2 = Math.cos(angle * (l.freq * 1.5) - phaseRef.current * 1.4);
          const waveAmp = (harmonic1 * 0.65 + harmonic2 * 0.35) * (10 + energy * 36) * l.ampMultiplier;
          
          const currentRadius = baseRadius * l.scale + waveAmp;
          const x = centerX + Math.cos(angle) * currentRadius;
          const y = centerY + Math.sin(angle) * currentRadius;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      });

      // 6. Orbiting Stardust Constellation Particles
      stardustRef.current.forEach(p => {
        p.angle += p.speed * (1 + energy * 2.5);
        const dynamicDist = (baseRadius * 0.6 + p.distance) * (1 + energy * 0.25);
        const px = centerX + Math.cos(p.angle) * dynamicDist;
        const py = centerY + Math.sin(p.angle) * dynamicDist;

        ctx.beginPath();
        ctx.arc(px, py, p.size * (1 + energy * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cPrimary[0]}, ${cPrimary[1]}, ${cPrimary[2]}, ${p.alpha * (0.4 + energy * 0.6)})`;
        ctx.fill();
      });

      // 7. Central Liquid Core with Specular Light Reflection
      ctx.beginPath();
      const coreR = baseRadius * 0.68;
      ctx.arc(centerX, centerY, coreR, 0, Math.PI * 2);

      const coreGradient = ctx.createRadialGradient(
        centerX - coreR * 0.3, centerY - coreR * 0.3, 4,
        centerX, centerY, coreR
      );
      coreGradient.addColorStop(0, `rgba(${cCore[0]}, ${cCore[1]}, ${cCore[2]}, 0.98)`);
      coreGradient.addColorStop(0.65, `rgba(${cPrimary[0]}, ${cPrimary[1]}, ${cPrimary[2]}, 0.85)`);
      coreGradient.addColorStop(1, `rgba(${cSecondary[0]}, ${cSecondary[1]}, ${cSecondary[2]}, 0.5)`);

      ctx.fillStyle = coreGradient;
      ctx.shadowColor = isCalm ? '#FF9E64' : '#00F2FE';
      ctx.shadowBlur = isLive ? 30 + energy * 40 : 12;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [studentLevel, aiLevel, isLive, sentiment]);

  const getStatus = () => {
    if (!isLive) return { text: 'Tutor Standby', dot: 'idle' as const };
    if (aiLevel > 0.08) return { text: 'Tutor Speaking...', dot: 'aiSpeaking' as const };
    if (studentLevel > 0.04) return { text: 'Listening to Student...', dot: 'studentSpeaking' as const };
    if (sentiment === 'calm') return { text: 'Calm Adaptive Mode Active', dot: 'calmMode' as const };
    return { text: 'Bidirectional Live Audio Active', dot: 'studentSpeaking' as const };
  };

  const status = getStatus();

  return (
    <CanvasContainer>
      <StyledCanvas ref={canvasRef} />
      <AmbientStatusPill>
        <StatusDot state={status.dot} />
        <span>{status.text}</span>
      </AmbientStatusPill>
    </CanvasContainer>
  );
};

