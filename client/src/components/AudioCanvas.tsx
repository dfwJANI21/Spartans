/**
 * AudioCanvas.tsx
 * Google Gemini Live 60fps Multi-Octave Harmonic Fluid Visualizer
 * Synthesizes smoothed audio RMS energy, Google 4-color wavefield dispersion,
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
  filter: 'drop-shadow(0 0 24px rgba(66, 133, 244, 0.22))',
  transition: 'filter 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
});

const AmbientStatusPill = styled('div', {
  position: 'absolute',
  bottom: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 16px',
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(16px)',
  border: '1px solid #dadce0',
  fontFamily: '$sans',
  fontWeight: 500,
  fontSize: '0.76rem',
  color: '$textPrimary',
  boxShadow: '0 1px 3px rgba(60, 64, 67, 0.12)',
  zIndex: 2,
  transition: 'all 0.25s ease'
});

const StatusDot = styled('span', {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  transition: 'all 0.25s ease',
  variants: {
    state: {
      idle: { backgroundColor: '#80868b' },
      studentSpeaking: { backgroundColor: '#1a73e8', boxShadow: '0 0 8px #1a73e8' },
      aiSpeaking: { backgroundColor: '#ea4335', boxShadow: '0 0 10px #ea4335' },
      calmMode: { backgroundColor: '#34a853', boxShadow: '0 0 10px #34a853' }
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
  colorIndex: number;
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

  // Google 4 Colors: Blue, Red, Yellow, Green
  const googleColors = [
    [66, 133, 244], // Google Blue
    [234, 67, 53],  // Google Red
    [251, 188, 4],  // Google Yellow
    [52, 168, 83]   // Google Green
  ];

  // Initialize stardust particles once
  useEffect(() => {
    const particles: StardustParticle[] = [];
    for (let i = 0; i < 28; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        distance: 25 + Math.random() * 85,
        speed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.7 + 0.3,
        colorIndex: i % 4
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

      // 1. Smoothly interpolate target energy via dynamic lerp
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

      // Google brand color scheme
      const isCalm = sentiment === 'calm';
      const cPrimary = isCalm ? [52, 168, 83] : [66, 133, 244];
      const cSecondary = isCalm ? [66, 133, 244] : [234, 67, 53];
      const cCore = [255, 255, 255];

      const baseRadius = Math.min(width, height) * 0.18 * (1 + energy * 0.35);

      // 3. Ambient Volumetric Glow Background
      const ambientGrad = ctx.createRadialGradient(
        centerX, centerY, baseRadius * 0.1,
        centerX, centerY, baseRadius * 2.5
      );
      ambientGrad.addColorStop(0, `rgba(${cPrimary[0]}, ${cPrimary[1]}, ${cPrimary[2]}, ${isLive ? 0.22 + energy * 0.25 : 0.06})`);
      ambientGrad.addColorStop(0.5, `rgba(${cSecondary[0]}, ${cSecondary[1]}, ${cSecondary[2]}, ${isLive ? 0.1 + energy * 0.12 : 0.03})`);
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
        ctx.lineWidth = 2.2;
        ctx.stroke();
        ctx.restore();

        if (sw.opacity < 0.02 || sw.radius >= sw.maxRadius) {
          shockwavesRef.current.splice(i, 1);
        }
      }

      // 5. Multi-Octave Harmonic Fluid Wavefield (Google 4 Colors)
      const layers = [
        { color: [66, 133, 244], scale: 1.0, freq: 3, ampMultiplier: 1.0, phaseOffset: 0 },
        { color: [234, 67, 53], scale: 1.14, freq: 4, ampMultiplier: 0.85, phaseOffset: Math.PI / 3 },
        { color: [251, 188, 4], scale: 1.25, freq: 6, ampMultiplier: 0.7, phaseOffset: Math.PI / 2 },
        { color: [52, 168, 83], scale: 1.34, freq: 5, ampMultiplier: 0.6, phaseOffset: Math.PI }
      ];

      layers.forEach((l, layerIdx) => {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1.8;
        const alpha = Math.max(0.15, 0.6 - layerIdx * 0.12 + energy * 0.3);
        ctx.strokeStyle = `rgba(${l.color[0]}, ${l.color[1]}, ${l.color[2]}, ${alpha})`;

        const points = 72;
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;
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

      // 6. Orbiting Stardust Constellation Particles with Google Colors
      stardustRef.current.forEach(p => {
        p.angle += p.speed * (1 + energy * 2.5);
        const dynamicDist = (baseRadius * 0.6 + p.distance) * (1 + energy * 0.25);
        const px = centerX + Math.cos(p.angle) * dynamicDist;
        const py = centerY + Math.sin(p.angle) * dynamicDist;
        const pColor = googleColors[p.colorIndex];

        ctx.beginPath();
        ctx.arc(px, py, p.size * (1 + energy * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pColor[0]}, ${pColor[1]}, ${pColor[2]}, ${p.alpha * (0.4 + energy * 0.6)})`;
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
      coreGradient.addColorStop(0.6, `rgba(${cPrimary[0]}, ${cPrimary[1]}, ${cPrimary[2]}, 0.8)`);
      coreGradient.addColorStop(1, `rgba(${cSecondary[0]}, ${cSecondary[1]}, ${cSecondary[2]}, 0.4)`);

      ctx.fillStyle = coreGradient;
      ctx.shadowColor = isCalm ? '#34a853' : '#1a73e8';
      ctx.shadowBlur = isLive ? 20 + energy * 25 : 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [studentLevel, aiLevel, isLive, sentiment]);

  const getStatus = () => {
    if (!isLive) return { text: 'Gemini Live Standby', dot: 'idle' as const };
    if (aiLevel > 0.08) return { text: 'Gemini Tutor Speaking...', dot: 'aiSpeaking' as const };
    if (studentLevel > 0.04) return { text: 'Listening to Student...', dot: 'studentSpeaking' as const };
    if (sentiment === 'calm') return { text: 'Adaptive Cadence Active', dot: 'calmMode' as const };
    return { text: 'Bidirectional Live Audio Connected', dot: 'studentSpeaking' as const };
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
