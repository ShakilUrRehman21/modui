import React, { useEffect, useRef, useState, useCallback, useId } from 'react';
import './PointCloudMorpher.css';

export type PointCloudTopology = 'sphere' | 'torus' | 'helix' | 'wave' | 'cube' | 'galaxy';
export type PointCloudVariant = 'cyber-violet' | 'matrix-emerald' | 'solar-amber' | 'deep-ice';
export type PointCloudTheme = 'auto' | 'light' | 'dark';

export interface PointCloudMorpherProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Target 3D geometric shape */
  topology?: PointCloudTopology;
  /** Chromatic color theme */
  variant?: PointCloudVariant;
  /** Color theme mode ('auto' synchronizes with document theme, or explicit 'light' / 'dark') */
  theme?: PointCloudTheme;
  /** Total vertex count (default: 900) */
  particleCount?: number;
  /** Render luminous filament lines between nearby vertices */
  showConstellations?: boolean;
  /** Proximity distance threshold for constellation filament connections */
  constellationDistance?: number;
  /** Continuous auto-orbit rotation */
  autoRotate?: boolean;
  /** Speed multiplier for auto-orbit */
  rotationSpeed?: number;
  /** Cursor gravitational vortex field */
  interactiveVortex?: boolean;
  /** Synthesize harmonic resonance sound on shape change */
  soundEnabled?: boolean;
  /** Compact mode for catalog card previews */
  compact?: boolean;
  /** Controlled topology change callback */
  onTopologyChange?: (topology: PointCloudTopology) => void;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  tx: number;
  ty: number;
  tz: number;
  vx: number;
  vy: number;
  vz: number;
  baseRadius: number;
  colorBias: number;
}

interface PaletteDefinition {
  bg: string;
  particlePrimary: string;
  particleSecondary: string;
  particleHighlight: string;
  constellation: string;
  glow: string;
}

const DARK_PALETTES: Record<PointCloudVariant, PaletteDefinition> = {
  'cyber-violet': {
    bg: '#0A0B10',
    particlePrimary: '#6366F1',
    particleSecondary: '#EC4899',
    particleHighlight: '#38BDF8',
    constellation: 'rgba(99, 102, 241, 0.22)',
    glow: 'rgba(99, 102, 241, 0.4)',
  },
  'matrix-emerald': {
    bg: '#060B08',
    particlePrimary: '#10B981',
    particleSecondary: '#34D399',
    particleHighlight: '#A7F3D0',
    constellation: 'rgba(16, 185, 129, 0.24)',
    glow: 'rgba(16, 185, 129, 0.45)',
  },
  'solar-amber': {
    bg: '#0E0905',
    particlePrimary: '#F59E0B',
    particleSecondary: '#EF4444',
    particleHighlight: '#FDE68A',
    constellation: 'rgba(245, 158, 11, 0.22)',
    glow: 'rgba(245, 158, 11, 0.4)',
  },
  'deep-ice': {
    bg: '#070C14',
    particlePrimary: '#06B6D4',
    particleSecondary: '#3B82F6',
    particleHighlight: '#E0F2FE',
    constellation: 'rgba(6, 182, 212, 0.22)',
    glow: 'rgba(6, 182, 212, 0.4)',
  },
};

const LIGHT_PALETTES: Record<PointCloudVariant, PaletteDefinition> = {
  'cyber-violet': {
    bg: '#F8FAFC',
    particlePrimary: '#4F46E5',
    particleSecondary: '#DB2777',
    particleHighlight: '#0284C7',
    constellation: 'rgba(79, 70, 229, 0.16)',
    glow: 'rgba(79, 70, 229, 0.25)',
  },
  'matrix-emerald': {
    bg: '#F4FBF7',
    particlePrimary: '#059669',
    particleSecondary: '#10B981',
    particleHighlight: '#047857',
    constellation: 'rgba(5, 150, 105, 0.16)',
    glow: 'rgba(5, 150, 105, 0.25)',
  },
  'solar-amber': {
    bg: '#FFFDF9',
    particlePrimary: '#D97706',
    particleSecondary: '#DC2626',
    particleHighlight: '#B45309',
    constellation: 'rgba(217, 119, 6, 0.16)',
    glow: 'rgba(217, 119, 6, 0.25)',
  },
  'deep-ice': {
    bg: '#F0F9FF',
    particlePrimary: '#0284C7',
    particleSecondary: '#2563EB',
    particleHighlight: '#0369A1',
    constellation: 'rgba(2, 132, 199, 0.16)',
    glow: 'rgba(2, 132, 199, 0.25)',
  },
};

const TOPOLOGIES: { id: PointCloudTopology; label: string; icon: string }[] = [
  { id: 'sphere', label: 'Fibonacci Sphere', icon: '●' },
  { id: 'torus', label: 'Clifford Torus', icon: '◎' },
  { id: 'helix', label: 'Double Helix', icon: '☍' },
  { id: 'wave', label: 'Quantum Wave', icon: '〰' },
  { id: 'cube', label: 'Tesseract Lattice', icon: '◇' },
  { id: 'galaxy', label: 'Galactic Spiral', icon: '✦' },
];

export const PointCloudMorpher: React.FC<PointCloudMorpherProps> = ({
  topology: controlledTopology,
  variant = 'cyber-violet',
  theme: themeMode = 'auto',
  particleCount = 900,
  showConstellations = true,
  constellationDistance = 34,
  autoRotate = true,
  rotationSpeed = 1.0,
  interactiveVortex = true,
  soundEnabled = true,
  compact = false,
  onTopologyChange,
  className = '',
  ...restProps
}) => {
  const [internalTopology, setInternalTopology] = useState<PointCloudTopology>(controlledTopology || 'sphere');
  const currentTopology = controlledTopology !== undefined ? controlledTopology : internalTopology;

  // Dynamic Theme Synchronization
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

    const checkTheme = () => {
      const docTheme = document.documentElement.getAttribute('data-theme');
      setActiveTheme(docTheme === 'light' ? 'light' : 'dark');
    };

    checkTheme();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          checkTheme();
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [themeMode]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Rotation & interaction state
  const rotRef = useRef<{ x: number; y: number; vx: number; vy: number }>({ x: 0.2, y: 0.3, vx: 0, vy: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseVortexRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  const labelId = useId();

  // Web Audio Harmonic Chime DSP
  const playChime = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // Root chord frequency based on topology index
      const topoIdx = TOPOLOGIES.findIndex((t) => t.id === currentTopology);
      const baseFreq = 261.63 * Math.pow(1.05946, (topoIdx % 6) * 2); // Pentatonic steps

      [baseFreq, baseFreq * 1.5, baseFreq * 2.0].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.02, ctx.currentTime + 0.35);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.06 / (i + 1), ctx.currentTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.03);
        osc.stop(ctx.currentTime + 0.5);
      });

      setTimeout(() => {
        ctx.close().catch(() => {});
      }, 700);
    } catch {
      // Audio autoplay policy catch
    }
  }, [soundEnabled, currentTopology]);

  // Generate target coordinates for a topology
  const getCoordinatesForTopology = useCallback(
    (type: PointCloudTopology, idx: number, total: number): { x: number; y: number; z: number } => {
      const scale = compact ? 0.65 : 1.0;

      switch (type) {
        case 'sphere': {
          // Geodesic Fibonacci sphere
          const phi = Math.acos(-1 + (2 * idx) / total);
          const theta = Math.sqrt(total * Math.PI) * phi;
          const radius = 95 * scale;
          return {
            x: radius * Math.cos(theta) * Math.sin(phi),
            y: radius * Math.sin(theta) * Math.sin(phi),
            z: radius * Math.cos(phi),
          };
        }

        case 'torus': {
          // Clifford / Standard 3D Torus
          const u = (idx / total) * Math.PI * 2 * 7;
          const v = (idx / total) * Math.PI * 2;
          const majorR = 90 * scale;
          const minorR = 36 * scale;
          return {
            x: (majorR + minorR * Math.cos(u)) * Math.cos(v),
            y: (majorR + minorR * Math.cos(u)) * Math.sin(v),
            z: minorR * Math.sin(u),
          };
        }

        case 'helix': {
          // Double Helix DNA
          const strand = idx % 2 === 0 ? 1 : -1;
          const t = (idx / total) * Math.PI * 10 - Math.PI * 5;
          const radius = 55 * scale;
          const heightSpan = 220 * scale;
          return {
            x: radius * Math.cos(t) * strand,
            y: (idx / total - 0.5) * heightSpan,
            z: radius * Math.sin(t) * strand,
          };
        }

        case 'wave': {
          // Quantum undulating harmonic wave grid
          const cols = Math.floor(Math.sqrt(total * 1.5));
          const col = idx % cols;
          const row = Math.floor(idx / cols);
          const centerC = col - cols / 2;
          const centerR = row - (total / cols) / 2;
          const dist = Math.sqrt(centerC * centerC + centerR * centerR);
          const spacing = 11 * scale;
          return {
            x: centerC * spacing,
            y: Math.sin(dist * 0.4) * (28 * scale),
            z: centerR * spacing,
          };
        }

        case 'cube': {
          // Symmetrical 3D Tesseract / Cube frame
          const side = 135 * scale;
          const half = side / 2;
          const face = idx % 6;
          const u = ((idx % 30) / 30 - 0.5) * side;
          const v = ((Math.floor(idx / 30) % 30) / 30 - 0.5) * side;

          switch (face) {
            case 0: return { x: half, y: u, z: v };
            case 1: return { x: -half, y: u, z: v };
            case 2: return { x: u, y: half, z: v };
            case 3: return { x: u, y: -half, z: v };
            case 4: return { x: u, y: v, z: half };
            default: return { x: u, y: v, z: -half };
          }
        }

        case 'galaxy': {
          // Logarithmic double-spiral galaxy
          const arm = idx % 3;
          const armOffset = (arm * 2 * Math.PI) / 3;
          const progress = idx / total;
          const r = Math.pow(progress, 0.75) * 115 * scale;
          const theta = progress * Math.PI * 6 + armOffset;
          const spread = (Math.random() - 0.5) * 14 * scale;
          return {
            x: r * Math.cos(theta) + spread,
            y: (Math.random() - 0.5) * (20 * scale * (1 - progress * 0.5)),
            z: r * Math.sin(theta) + spread,
          };
        }
      }
    },
    [compact]
  );

  // Initialize or re-target particles on topology / count changes
  useEffect(() => {
    const total = Math.max(200, Math.min(2000, particleCount));
    let particles = particlesRef.current;

    if (particles.length !== total) {
      particles = [];
      for (let i = 0; i < total; i++) {
        const coords = getCoordinatesForTopology(currentTopology, i, total);
        particles.push({
          x: coords.x,
          y: coords.y,
          z: coords.z,
          tx: coords.x,
          ty: coords.y,
          tz: coords.z,
          vx: 0,
          vy: 0,
          vz: 0,
          baseRadius: Math.random() * 1.4 + 1.1,
          colorBias: Math.random(),
        });
      }
      particlesRef.current = particles;
    } else {
      for (let i = 0; i < total; i++) {
        const coords = getCoordinatesForTopology(currentTopology, i, total);
        particles[i].tx = coords.x;
        particles[i].ty = coords.y;
        particles[i].tz = coords.z;
      }
    }

    playChime();
  }, [currentTopology, particleCount, getCoordinatesForTopology, playChime]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const isLight = activeTheme === 'light';
    const palette = isLight ? LIGHT_PALETTES[variant] : DARK_PALETTES[variant];
    const thresholdSq = constellationDistance * constellationDistance;

    const render = () => {
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Update rotation & inertial decay
      const rot = rotRef.current;
      if (autoRotate && !isDraggingRef.current) {
        rot.y += 0.005 * rotationSpeed;
        rot.x += 0.0015 * rotationSpeed;
      }
      rot.y += rot.vy;
      rot.x += rot.vx;
      rot.vx *= 0.94;
      rot.vy *= 0.94;

      const cosY = Math.cos(rot.y);
      const sinY = Math.sin(rot.y);
      const cosX = Math.cos(rot.x);
      const sinX = Math.sin(rot.x);

      const vortex = mouseVortexRef.current;
      const particles = particlesRef.current;
      const num = particles.length;

      // Projected array for fast screen sorting & constellation line pass
      const projected: { sx: number; sy: number; sz: number; alpha: number; p: Particle }[] = [];

      for (let i = 0; i < num; i++) {
        const p = particles[i];

        // Spring acceleration towards target topology
        const ax = (p.tx - p.x) * 0.07;
        const ay = (p.ty - p.y) * 0.07;
        const az = (p.tz - p.z) * 0.07;

        p.vx = (p.vx + ax) * 0.88;
        p.vy = (p.vy + ay) * 0.88;
        p.vz = (p.vz + az) * 0.88;

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // 3D Matrix Rotation (Y axis then X axis)
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Perspective camera projection
        const fov = 340;
        const depth = fov + z2 + 130;
        const scale = fov / Math.max(20, depth);

        let sx = cx + x1 * scale;
        let sy = cy + y2 * scale;

        // Interactive cursor vortex repulsion & swirling
        if (interactiveVortex && vortex.active) {
          const dx = sx - vortex.x;
          const dy = sy - vortex.y;
          const distSq = dx * dx + dy * dy;
          const vortexRadiusSq = 120 * 120;

          if (distSq < vortexRadiusSq && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 120) * 16;
            // Tangential swirl + repulsion
            sx += (dx / dist) * force - (dy / dist) * (force * 0.5);
            sy += (dy / dist) * force + (dx / dist) * (force * 0.5);
          }
        }

        const alpha = isLight
          ? Math.max(0.25, Math.min(1.0, (z2 + 130) / 220))
          : Math.max(0.12, Math.min(1.0, (z2 + 130) / 260));
        projected.push({ sx, sy, sz: z2, alpha, p });
      }

      // Constellation proximity lines pass (sampled for performance)
      if (showConstellations && !compact) {
        ctx.strokeStyle = palette.constellation;
        ctx.lineWidth = isLight ? 0.9 : 0.75;
        ctx.beginPath();

        const step = num > 900 ? 3 : 2;
        for (let i = 0; i < num; i += step) {
          const p1 = projected[i];
          for (let j = i + step; j < Math.min(i + 36, num); j += step) {
            const p2 = projected[j];
            const dx = p1.sx - p2.sx;
            const dy = p1.sy - p2.sy;
            const distSq = dx * dx + dy * dy;

            if (distSq < thresholdSq) {
              const lineAlpha = (1 - Math.sqrt(distSq) / constellationDistance) * 0.3 * Math.min(p1.alpha, p2.alpha);
              if (lineAlpha > 0.02) {
                ctx.moveTo(p1.sx, p1.sy);
                ctx.lineTo(p2.sx, p2.sy);
              }
            }
          }
        }
        ctx.stroke();
      }

      // Draw Particles with Depth Shading
      for (let i = 0; i < num; i++) {
        const item = projected[i];
        const rad = item.p.baseRadius * (item.sz > 0 ? 1.25 : 0.9);

        ctx.fillStyle =
          item.p.colorBias > 0.7
            ? palette.particleHighlight
            : item.p.colorBias > 0.3
            ? palette.particlePrimary
            : palette.particleSecondary;

        ctx.globalAlpha = item.alpha;
        ctx.beginPath();
        ctx.arc(item.sx, item.sy, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [variant, activeTheme, showConstellations, constellationDistance, autoRotate, rotationSpeed, interactiveVortex, compact]);

  // Pointer & Drag Handlers for 3D Orbit
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    const rect = e.currentTarget.getBoundingClientRect();
    mouseVortexRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    mouseVortexRef.current = { x: curX, y: curY, active: true };

    if (isDraggingRef.current) {
      const dx = e.clientX - lastPointerRef.current.x;
      const dy = e.clientY - lastPointerRef.current.y;

      rotRef.current.vy = dx * 0.007;
      rotRef.current.vx = dy * 0.007;

      lastPointerRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    mouseVortexRef.current.active = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // capture release fallback
    }
  };

  const handlePointerLeave = () => {
    mouseVortexRef.current.active = false;
  };

  const handleTopologySelect = (id: PointCloudTopology) => {
    if (controlledTopology === undefined) {
      setInternalTopology(id);
    }
    onTopologyChange?.(id);
  };

  // Keyboard navigation for accessible 3D manipulation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const rot = rotRef.current;
    if (e.key === 'ArrowLeft') {
      rot.vy -= 0.05;
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      rot.vy += 0.05;
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      rot.vx -= 0.05;
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      rot.vx += 0.05;
      e.preventDefault();
    } else if (e.key === ' ' || e.key === 'Enter') {
      const curIdx = TOPOLOGIES.findIndex((t) => t.id === currentTopology);
      const nextIdx = (curIdx + 1) % TOPOLOGIES.length;
      handleTopologySelect(TOPOLOGIES[nextIdx].id);
      e.preventDefault();
    }
  };

  return (
    <div
      className={`modui-point-cloud-container modui-point-cloud--${variant} modui-point-cloud--theme-${activeTheme} ${
        compact ? 'modui-point-cloud--compact' : ''
      } ${className}`}
      role="region"
      aria-labelledby={labelId}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      {...restProps}
    >
      <div id={labelId} className="sr-only">
        3D Point Cloud Mesh Morpher — Currently displaying {currentTopology} topology. Use arrow keys to orbit and spacebar to cycle topologies.
      </div>

      {/* Top HUD Status & Telemetry Bar (Hidden in compact mode) */}
      {!compact && (
        <div className="modui-point-cloud-hud">
          <div className="modui-point-cloud-badge">
            <span className="modui-point-cloud-pulse-dot" />
            <span className="modui-point-cloud-topology-label">
              {currentTopology.charAt(0).toUpperCase() + currentTopology.slice(1)}
            </span>
          </div>

          <div className="modui-point-cloud-stats">
            <span>{particleCount} points</span>
          </div>
        </div>
      )}

      {/* Interactive 3D Canvas Stage */}
      <div className="modui-point-cloud-stage">
        <canvas
          ref={canvasRef}
          className="modui-point-cloud-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          title="Drag to orbit 3D point cloud; hover to distort vortex"
        />

        {/* Ambient Chromatic Vignette Overlays */}
        <div className="modui-point-cloud-vignette" style={{ pointerEvents: 'none' }} />
      </div>

      {/* Tactile Topology Switcher Toolbar (Hidden in compact mode) */}
      {!compact && (
        <div className="modui-point-cloud-toolbar" role="tablist" aria-label="3D Topologies">
          {TOPOLOGIES.map((topo) => {
            const isActive = currentTopology === topo.id;
            return (
              <button
                key={topo.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`modui-topology-btn ${isActive ? 'modui-topology-btn--active' : ''}`}
                onClick={() => handleTopologySelect(topo.id)}
              >
                <span className="modui-topology-icon">{topo.icon}</span>
                <span className="modui-topology-text">{topo.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
