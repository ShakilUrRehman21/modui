import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import './CyberStreamMatrix.css';

export type MatrixVariant = 'studio-light' | 'dark-obsidian' | 'blueprint' | 'emerald';
export type MatrixCharset = 'matrix' | 'binary' | 'hex' | 'ascii';

export interface CyberStreamMatrixProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual surface color scheme */
  variant?: MatrixVariant;
  /** Character set family (default: 'hex') */
  charset?: MatrixCharset;
  /** Custom character pool (overrides charset preset) */
  customChars?: string;
  /** Falling velocity multiplier (0.2 to 3.0, default: 0.5) */
  speed?: number;
  /** Font size in pixels (default: 14) */
  fontSize?: number;
  /** Stream density multiplier (0.5 to 2.0, default: 1) */
  density?: number;
  /** Column horizontal spacing in pixels (default: 18) */
  columnSpacing?: number;
  /** Length of fading character trail (default: 18) */
  tailLength?: number;
  /** Enable mouse interactive shockwave and spotlight */
  interactive?: boolean;
  /** Radius of pointer repulsion in pixels (default: 90) */
  mouseRadius?: number;
  /** Whether head characters emit a subtle specular glow */
  glow?: boolean;
  /** Whether clicking triggers acoustic digital particle clicks */
  soundEnabled?: boolean;
  /** Optional overlay content rendered centered over the matrix */
  children?: React.ReactNode;
}

// Preset character sets
const CHARSETS: Record<MatrixCharset, string> = {
  matrix: '0123456789アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
  binary: '01',
  hex: '0123456789ABCDEF',
  ascii: '<>/{}[]=+-*#_~^|:;?!&%$',
};

// Color palettes for variants
interface MatrixThemeColors {
  bg: string;
  leadChar: string;
  leadGlow: string;
  trailBase: string;
  spotlight: string;
  gridLine: string;
}

const THEMES: Record<MatrixVariant, MatrixThemeColors> = {
  'studio-light': {
    bg: '#F8F7F2',
    leadChar: '#365CF5',
    leadGlow: 'rgba(54, 92, 245, 0.45)',
    trailBase: '55, 55, 52',
    spotlight: 'rgba(54, 92, 245, 0.08)',
    gridLine: 'rgba(0, 0, 0, 0.03)',
  },
  'dark-obsidian': {
    bg: '#121214',
    leadChar: '#FFFFFF',
    leadGlow: 'rgba(255, 255, 255, 0.65)',
    trailBase: '148, 163, 184',
    spotlight: 'rgba(255, 255, 255, 0.06)',
    gridLine: 'rgba(255, 255, 255, 0.04)',
  },
  blueprint: {
    bg: '#0F172A',
    leadChar: '#38BDF8',
    leadGlow: 'rgba(56, 189, 248, 0.6)',
    trailBase: '96, 165, 250',
    spotlight: 'rgba(56, 189, 248, 0.1)',
    gridLine: 'rgba(56, 189, 248, 0.06)',
  },
  emerald: {
    bg: '#0A120D',
    leadChar: '#4ADE80',
    leadGlow: 'rgba(74, 222, 128, 0.65)',
    trailBase: '34, 197, 94',
    spotlight: 'rgba(74, 222, 128, 0.08)',
    gridLine: 'rgba(74, 222, 128, 0.04)',
  },
};

// Web Audio micro-chirp synthesis on particle burst
const playMatrixChirp = (freq = 1200) => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.038);
    osc.onended = () => ctx.close();
  } catch {
    // Audio restricted or uninitialized
  }
};

interface ColumnStream {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  mutationRate: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  life: number;
  maxLife: number;
  color: string;
}

export const CyberStreamMatrix: React.FC<CyberStreamMatrixProps> = ({
  variant = 'studio-light',
  charset = 'hex',
  customChars,
  speed = 0.5,
  fontSize = 14,
  density = 1,
  columnSpacing = 18,
  tailLength = 18,
  interactive = true,
  mouseRadius = 90,
  glow = true,
  soundEnabled = true,
  children,
  className = '',
  style,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });
  const particlesRef = useRef<Particle[]>([]);

  const charPool = useMemo(() => {
    return customChars && customChars.length > 0 ? customChars : CHARSETS[charset];
  }, [charset, customChars]);

  const getRandomChar = useCallback(() => {
    return charPool[Math.floor(Math.random() * charPool.length)];
  }, [charPool]);

  // Compute spacing adjusted by density
  const effectiveSpacing = useMemo(() => {
    return Math.max(8, Math.round(columnSpacing / Math.max(0.3, density)));
  }, [columnSpacing, density]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let columns: ColumnStream[] = [];

    const theme = THEMES[variant];

    // Resize canvas with devicePixelRatio crisp scaling
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(rect.width, 280);
      height = Math.max(rect.height, 200);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Re-initialize columns
      const colCount = Math.floor(width / effectiveSpacing);
      columns = [];

      for (let i = 0; i < colCount; i++) {
        const x = i * effectiveSpacing + (effectiveSpacing - fontSize) / 2;
        const initialY = (Math.random() * -height) / fontSize;
        const colChars: string[] = [];
        for (let j = 0; j < tailLength; j++) {
          colChars.push(getRandomChar());
        }

        columns.push({
          x,
          y: initialY,
          speed: (0.4 + Math.random() * 0.7) * speed,
          chars: colChars,
          mutationRate: 0.04 + Math.random() * 0.08,
        });
      }
    };

    handleResize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(container);
    }
    window.addEventListener('resize', handleResize);

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // 1. Clear background
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle architectural grid lines
      ctx.strokeStyle = theme.gridLine;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += effectiveSpacing * 2) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
      }
      ctx.stroke();

      // 3. Pointer Spotlight Halo
      if (interactive && mouseRef.current.active) {
        const radGrad = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          mouseRadius * 1.5
        );
        radGrad.addColorStop(0, theme.spotlight);
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, mouseRadius * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Render Glyphs
      ctx.font = `600 ${fontSize}px "JetBrains Mono", "Fira Code", monospace`;
      ctx.textBaseline = 'top';

      for (const col of columns) {
        // Step forward
        col.y += col.speed * 42 * dt;

        // Reset if whole trail passes bottom
        if (col.y - tailLength > height / fontSize) {
          col.y = (Math.random() * -120) / fontSize;
          col.speed = (0.4 + Math.random() * 0.7) * speed;
        }

        // Draw each character in the column tail
        for (let i = 0; i < tailLength; i++) {
          const charY = (col.y - i) * fontSize;
          if (charY < -fontSize || charY > height + fontSize) continue;

          // Mutate glyph intermittently
          if (Math.random() < col.mutationRate) {
            col.chars[i] = getRandomChar();
          }

          let charX = col.x;

          // Interactive Pointer Shockwave Repulsion
          if (interactive && mouseRef.current.active) {
            const dx = charX - mouseRef.current.x;
            const dy = charY - mouseRef.current.y;
            const dist = Math.hypot(dx, dy);

            if (dist < mouseRadius && dist > 0) {
              const force = (1 - dist / mouseRadius) * 22;
              charX += (dx / dist) * force;
            }
          }

          const isHead = i === 0;

          if (isHead) {
            // Head Character: Brilliant specular highlight
            ctx.fillStyle = theme.leadChar;
            if (glow) {
              ctx.shadowColor = theme.leadGlow;
              ctx.shadowBlur = 8;
            } else {
              ctx.shadowBlur = 0;
            }
          } else {
            // Fading trail characters
            const fade = Math.max(0, 1 - i / tailLength);
            ctx.shadowBlur = 0;
            ctx.fillStyle = `rgba(${theme.trailBase}, ${fade * 0.75})`;
          }

          ctx.fillText(col.chars[i] || '0', charX, charY);
        }
      }

      ctx.shadowBlur = 0;

      // 5. Render Particle Sparks
      const particles = particlesRef.current;
      for (let pIdx = particles.length - 1; pIdx >= 0; pIdx--) {
        const p = particles[pIdx];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // subtle gravity
        p.life -= dt;

        if (p.life <= 0) {
          particles.splice(pIdx, 1);
          continue;
        }

        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.fillStyle = theme.leadChar;
        ctx.globalAlpha = alpha;
        ctx.font = `700 ${fontSize * 0.9}px monospace`;
        ctx.fillText(p.char, p.x, p.y);
      }
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [variant, charPool, speed, fontSize, effectiveSpacing, tailLength, interactive, mouseRadius, glow, getRandomChar]);

  // Pointer event handlers
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handlePointerLeave = () => {
    mouseRef.current.active = false;
  };

  const handleClick = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (soundEnabled) {
      playMatrixChirp(1400);
    }

    // Spawn 10 radiant glyph particle sparks
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10 + (Math.random() - 0.5);
      const vel = 2 + Math.random() * 3.5;
      particlesRef.current.push({
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * vel,
        vy: Math.sin(angle) * vel,
        char: getRandomChar(),
        life: 0.6 + Math.random() * 0.4,
        maxLife: 0.8,
        color: THEMES[variant].leadChar,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`modui-matrix-container modui-matrix--${variant} ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handleClick}
      style={style}
      role="region"
      aria-label="Interactive Generative Matrix Stream"
      {...rest}
    >
      <canvas ref={canvasRef} className="modui-matrix-canvas" aria-hidden="true" />
      {children && <div className="modui-matrix-overlay">{children}</div>}
    </div>
  );
};

export default CyberStreamMatrix;
