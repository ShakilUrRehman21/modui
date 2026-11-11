import React, { useEffect, useRef, useState, useCallback, useId } from 'react';
import './QuantumOrbitBeacon.css';

export type QuantumOrbitState = 'optimal' | 'active' | 'degraded' | 'offline';
export type QuantumOrbitSize = 'sm' | 'md' | 'lg';
export type QuantumOrbitTheme = 'auto' | 'light' | 'dark';

export interface QuantumOrbitBeaconProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current telemetry status */
  state?: QuantumOrbitState;
  /** Visual dimension preset: 'sm' (32px), 'md' (72px), 'lg' (220px) */
  size?: QuantumOrbitSize;
  /** Explicit pixel width override */
  width?: number;
  /** Explicit pixel height override */
  height?: number;
  /** Color theme mode ('auto' synchronizes with document data-theme, or explicit 'light' / 'dark') */
  theme?: QuantumOrbitTheme;
  /** Speed multiplier for particle orbits */
  speed?: number;
  /** Show live telemetry label and metrics */
  showTelemetry?: boolean;
  /** Custom label override */
  label?: string;
  /** Custom sub-label or latency metric */
  subLabel?: string;
  /** Enable mouse tilt / drag interactivity */
  interactive?: boolean;
  /** Synthesize harmonic quantum crystal chimes on state change */
  soundEnabled?: boolean;
  /** Compact mode for catalog card previews */
  compact?: boolean;
  /** Controlled state change callback */
  onStateChange?: (state: QuantumOrbitState) => void;
}

interface PaletteConfig {
  core: string;
  glow: string;
  trail: string;
  head: string;
  track: string;
  text: string;
  subText: string;
  pillBg: string;
  pillBorder: string;
}

const DARK_PALETTES: Record<QuantumOrbitState, PaletteConfig> = {
  optimal: {
    core: '#10B981',
    glow: 'rgba(16, 185, 129, 0.45)',
    trail: '#34D399',
    head: '#FFFFFF',
    track: 'rgba(255, 255, 255, 0.12)',
    text: '#F8FAFC',
    subText: '#10B981',
    pillBg: 'rgba(16, 185, 129, 0.08)',
    pillBorder: 'rgba(16, 185, 129, 0.25)',
  },
  active: {
    core: '#8B5CF6',
    glow: 'rgba(139, 92, 246, 0.55)',
    trail: '#C084FC',
    head: '#FFFFFF',
    track: 'rgba(255, 255, 255, 0.15)',
    text: '#F8FAFC',
    subText: '#A855F7',
    pillBg: 'rgba(139, 92, 246, 0.1)',
    pillBorder: 'rgba(139, 92, 246, 0.3)',
  },
  degraded: {
    core: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.5)',
    trail: '#FBBF24',
    head: '#FFFFFF',
    track: 'rgba(255, 255, 255, 0.12)',
    text: '#F8FAFC',
    subText: '#F59E0B',
    pillBg: 'rgba(245, 158, 11, 0.08)',
    pillBorder: 'rgba(245, 158, 11, 0.25)',
  },
  offline: {
    core: '#EF4444',
    glow: 'rgba(239, 68, 68, 0.45)',
    trail: '#F87171',
    head: '#FFFFFF',
    track: 'rgba(255, 255, 255, 0.1)',
    text: '#F8FAFC',
    subText: '#EF4444',
    pillBg: 'rgba(239, 68, 68, 0.08)',
    pillBorder: 'rgba(239, 68, 68, 0.25)',
  },
};

const LIGHT_PALETTES: Record<QuantumOrbitState, PaletteConfig> = {
  optimal: {
    core: '#059669',
    glow: 'rgba(5, 150, 105, 0.25)',
    trail: '#10B981',
    head: '#047857',
    track: 'rgba(15, 23, 42, 0.14)',
    text: '#0F172A',
    subText: '#059669',
    pillBg: 'rgba(5, 150, 105, 0.08)',
    pillBorder: 'rgba(5, 150, 105, 0.25)',
  },
  active: {
    core: '#6D28D9',
    glow: 'rgba(109, 40, 217, 0.25)',
    trail: '#7C3AED',
    head: '#5B21B6',
    track: 'rgba(15, 23, 42, 0.16)',
    text: '#0F172A',
    subText: '#6D28D9',
    pillBg: 'rgba(109, 40, 217, 0.08)',
    pillBorder: 'rgba(109, 40, 217, 0.25)',
  },
  degraded: {
    core: '#D97706',
    glow: 'rgba(217, 119, 6, 0.25)',
    trail: '#F59E0B',
    head: '#B45309',
    track: 'rgba(15, 23, 42, 0.14)',
    text: '#0F172A',
    subText: '#D97706',
    pillBg: 'rgba(217, 119, 6, 0.08)',
    pillBorder: 'rgba(217, 119, 6, 0.25)',
  },
  offline: {
    core: '#DC2626',
    glow: 'rgba(220, 38, 38, 0.22)',
    trail: '#EF4444',
    head: '#B91C1C',
    track: 'rgba(15, 23, 42, 0.14)',
    text: '#0F172A',
    subText: '#DC2626',
    pillBg: 'rgba(220, 38, 38, 0.08)',
    pillBorder: 'rgba(220, 38, 38, 0.25)',
  },
};

const DEFAULT_LABELS: Record<QuantumOrbitState, { label: string; subLabel: string; chime: number }> = {
  optimal: { label: 'Systems Optimal', subLabel: '99.99% • 14ms', chime: 880 },
  active: { label: 'High Throughput', subLabel: '12.4k rps • Relativistic', chime: 1174.66 },
  degraded: { label: 'Latency Degraded', subLabel: '420ms • Precession Skew', chime: 587.33 },
  offline: { label: 'Dormant Standby', subLabel: 'Maintenance • Standby', chime: 440 },
};

const DIMENSION_PRESETS: Record<QuantumOrbitSize, { size: number; baseRadius: number }> = {
  sm: { size: 32, baseRadius: 22 },
  md: { size: 72, baseRadius: 50 },
  lg: { size: 220, baseRadius: 152 },
};

export const QuantumOrbitBeacon: React.FC<QuantumOrbitBeaconProps> = ({
  state: controlledState,
  size = 'lg',
  width: customWidth,
  height: customHeight,
  theme: themeMode = 'auto',
  speed = 1.0,
  showTelemetry = true,
  label: customLabel,
  subLabel: customSubLabel,
  interactive = true,
  soundEnabled = true,
  compact = false,
  onStateChange,
  className = '',
  ...restProps
}) => {
  const instanceId = useId();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [internalState, setInternalState] = useState<QuantumOrbitState>(controlledState || 'optimal');
  const currentState = controlledState !== undefined ? controlledState : internalState;

  // Active theme resolution
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>(() => {
    if (themeMode && themeMode !== 'auto') return themeMode;
    if (typeof document !== 'undefined') {
      const docTheme = document.documentElement.getAttribute('data-theme');
      return docTheme === 'light' ? 'light' : 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    if (themeMode && themeMode !== 'auto') {
      setActiveTheme(themeMode);
      return;
    }
    if (typeof document === 'undefined') return;

    const observer = new MutationObserver(() => {
      const docTheme = document.documentElement.getAttribute('data-theme');
      setActiveTheme(docTheme === 'light' ? 'light' : 'dark');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, [themeMode]);

  // Dimension calculations
  const preset = DIMENSION_PRESETS[size] || DIMENSION_PRESETS.lg;
  const canvasDim = customWidth || customHeight || preset.size;

  // Interactive mouse tilt state
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false });
  const timeRef = useRef(0);

  // Web Audio Synthesizer for Quantum Chimes
  const playQuantumChime = useCallback(
    (freq: number) => {
      if (!soundEnabled || typeof window === 'undefined') return;
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.12);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.55);
      } catch {
        // Audio policy ignore
      }
    },
    [soundEnabled]
  );

  const handleStateSelect = useCallback(
    (nextState: QuantumOrbitState) => {
      if (controlledState === undefined) {
        setInternalState(nextState);
      }
      playQuantumChime(DEFAULT_LABELS[nextState].chime);
      onStateChange?.(nextState);
    },
    [controlledState, onStateChange, playQuantumChime]
  );

  // Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    canvas.width = canvasDim * dpr;
    canvas.height = canvasDim * dpr;

    const render = () => {
      if (!isRunning) return;

      const palette = activeTheme === 'light' ? LIGHT_PALETTES[currentState] : DARK_PALETTES[currentState];
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const baseR = (preset.baseRadius / preset.size) * (w / 2);

      // Speed configuration based on state
      let stateSpeed = 0.02 * speed;
      if (currentState === 'active') stateSpeed = 0.075 * speed;
      else if (currentState === 'degraded') stateSpeed = 0.028 * speed;
      else if (currentState === 'offline') stateSpeed = 0.008 * speed;

      timeRef.current += stateSpeed;
      const t = timeRef.current;

      // Mouse lerping for perspective tilt
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;
      const tiltX = (mouseRef.current.y / (canvasDim / 2)) * 0.35;
      const tiltY = (mouseRef.current.x / (canvasDim / 2)) * 0.35;

      ctx.clearRect(0, 0, w, h);

      // 1. Central Quantum Singularity Core with breathing glow
      const corePulse = Math.sin(t * (currentState === 'active' ? 4 : 2)) * 0.15;
      const coreRadius = Math.max(2, baseR * 0.28 * (1 + corePulse));

      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(4, coreRadius * 2.5));
      coreGrad.addColorStop(0, activeTheme === 'light' ? '#FFFFFF' : palette.head);
      coreGrad.addColorStop(0.35, palette.core);
      coreGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(4, coreRadius * 2.5), 0, Math.PI * 2);
      ctx.fill();

      // Core Solid Center Bead
      ctx.fillStyle = palette.head;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(1.5, coreRadius * 0.5), 0, Math.PI * 2);
      ctx.fill();

      // 2. Orbital Tracks: 3 Nested Quantum Rings with Doppler Trails
      const tracks = [
        {
          a: baseR * 1.15,
          b: baseR * 0.38,
          tilt: -Math.PI / 5 + tiltX,
          rotSpeed: 1.2,
          particles: currentState === 'active' ? 3 : 2,
        },
        {
          a: baseR * 0.95,
          b: baseR * 0.32,
          tilt: Math.PI / 3.8 + tiltY,
          rotSpeed: -1.0,
          particles: currentState === 'active' ? 3 : 2,
        },
        {
          a: baseR * 1.25,
          b: baseR * 0.42,
          tilt: Math.PI / 2.1 + (tiltX - tiltY) * 0.5,
          rotSpeed: 0.85,
          particles: currentState === 'active' ? 3 : 2,
        },
      ];

      tracks.forEach((track, tIdx) => {
        ctx.save();
        ctx.translate(cx, cy);

        // Precession wobble for degraded state
        let currentTilt = track.tilt;
        if (currentState === 'degraded') {
          currentTilt += Math.sin(t * 1.8 + tIdx * 1.2) * 0.28; // Dynamic axial skew
        }
        ctx.rotate(currentTilt);

        // Draw Elliptical Ring Path
        ctx.beginPath();
        ctx.ellipse(0, 0, track.a, track.b, 0, 0, Math.PI * 2);
        ctx.strokeStyle = palette.track;
        ctx.lineWidth = Math.max(1, 1.2 * dpr);
        ctx.stroke();

        // Draw Photon Particles along Track
        for (let p = 0; p < track.particles; p++) {
          const pAngle = t * track.rotSpeed + p * (Math.PI / (track.particles / 2));

          const px = Math.cos(pAngle) * track.a;
          const py = Math.sin(pAngle) * track.b;

          // Doppler Trail Vector
          const trailLength = currentState === 'active' ? 0.4 : currentState === 'degraded' ? 0.22 : 0.15;
          const trailAngle = pAngle - track.rotSpeed * trailLength;
          const tx = Math.cos(trailAngle) * track.a;
          const ty = Math.sin(trailAngle) * track.b;

          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(px, py);
          ctx.strokeStyle = palette.trail;
          ctx.lineWidth = Math.max(1.5, 2.5 * dpr);
          ctx.lineCap = 'round';
          ctx.stroke();

          // Particle Head Glint
          ctx.beginPath();
          ctx.arc(px, py, Math.max(2, 3.5 * dpr), 0, Math.PI * 2);
          ctx.fillStyle = palette.head;
          if (activeTheme === 'dark') {
            ctx.shadowColor = palette.core;
            ctx.shadowBlur = 8 * dpr;
          }
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [canvasDim, currentState, activeTheme, speed, preset]);

  // Pointer move handler for interactive tilt
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseRef.current.targetX = x;
    mouseRef.current.targetY = y;
    mouseRef.current.isHovered = true;
  };

  const handlePointerLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
    mouseRef.current.isHovered = false;
  };

  const defaultMeta = DEFAULT_LABELS[currentState];
  const activeLabel = customLabel || defaultMeta.label;
  const activeSubLabel = customSubLabel || defaultMeta.subLabel;
  const palette = activeTheme === 'light' ? LIGHT_PALETTES[currentState] : DARK_PALETTES[currentState];

  return (
    <div
      className={`modui-quantum-beacon modui-quantum-beacon--${size} modui-quantum-beacon--${currentState} modui-quantum-beacon--theme-${activeTheme} ${
        compact ? 'modui-quantum-beacon--compact' : ''
      } ${className}`}
      role="status"
      aria-label={`Status: ${activeLabel} - ${activeSubLabel}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...restProps}
    >
      <div className="modui-quantum-beacon-stage">
        <canvas
          ref={canvasRef}
          className="modui-quantum-beacon-canvas"
          style={{ width: `${canvasDim}px`, height: `${canvasDim}px` }}
          aria-hidden="true"
        />

        {/* Ambient Backlight Glow Halo */}
        <div
          className="modui-quantum-beacon-glow"
          style={{
            background: `radial-gradient(circle at center, ${palette.glow} 0%, rgba(0,0,0,0) 70%)`,
          }}
          aria-hidden="true"
        />
      </div>

      {showTelemetry && (
        <div className="modui-quantum-beacon-telemetry">
          <div className="modui-quantum-beacon-meta">
            <span className="modui-quantum-beacon-label" style={{ color: palette.text }}>
              {activeLabel}
            </span>
            <span
              className="modui-quantum-beacon-sublabel"
              style={{ color: palette.subText }}
            >
              {activeSubLabel}
            </span>
          </div>

          {!compact && size === 'lg' && (
            <div className="modui-quantum-beacon-controls" aria-label="Status State Presets">
              <button
                type="button"
                className={`modui-quantum-beacon-btn ${currentState === 'optimal' ? 'is-active' : ''}`}
                onClick={() => handleStateSelect('optimal')}
              >
                Optimal
              </button>
              <button
                type="button"
                className={`modui-quantum-beacon-btn ${currentState === 'active' ? 'is-active' : ''}`}
                onClick={() => handleStateSelect('active')}
              >
                Active
              </button>
              <button
                type="button"
                className={`modui-quantum-beacon-btn ${currentState === 'degraded' ? 'is-active' : ''}`}
                onClick={() => handleStateSelect('degraded')}
              >
                Degraded
              </button>
              <button
                type="button"
                className={`modui-quantum-beacon-btn ${currentState === 'offline' ? 'is-active' : ''}`}
                onClick={() => handleStateSelect('offline')}
              >
                Dormant
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuantumOrbitBeacon;
