import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import './NeuralClothMesh.css';

export type ClothVariant = 'studio-silk' | 'liquid-gold' | 'dark-obsidian' | 'emerald-aurora';
export type ClothRenderMode = 'shaded' | 'wireframe' | 'hybrid';
export type ClothPinMode = 'top-edge' | 'corners' | 'curtain';

export interface NeuralClothMeshProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual surface color scheme and specular response */
  variant?: ClothVariant;
  /** Rendering technique: smooth illuminated polygons, technical wireframe, or hybrid (default: 'wireframe') */
  renderMode?: ClothRenderMode;
  /** How the cloth is tethered: entire top edge, two upper corners, or draped curtain (default: 'curtain') */
  pinMode?: ClothPinMode;
  /** Downward gravitational acceleration (0.0 to 1.0, default: 0.10) */
  gravity?: number;
  /** Ambient aerodynamic breeze turbulence (0.0 to 1.5, default: 0) */
  windStrength?: number;
  /** Constraint elasticity relaxation iterations (1 to 5, default: 2) */
  stiffness?: number;
  /** Radius of pointer turbulence influence in pixels (default: 85) */
  mouseRadius?: number;
  /** Enable mouse hover wind wake and drag stretching */
  interactive?: boolean;
  /** Synthesize harmonic resonant whoosh acoustics on fabric ripple */
  soundEnabled?: boolean;
  /** Compact card preview mode for embedded catalogue & showcase cards (default: false) */
  compact?: boolean;
  /** Typographic headline rendered over the cloth plane */
  headline?: string;
  /** Supporting descriptive subtitle */
  subheadline?: string;
  /** Optional custom overlay children */
  children?: React.ReactNode;
}

// Point particle in the Verlet lattice
interface ClothPoint {
  x: number;
  y: number;
  px: number; // Previous X
  py: number; // Previous Y
  pinned: boolean;
  pinX: number;
  pinY: number;
}

// Structural or shear constraint link
interface ClothConstraint {
  p1: ClothPoint;
  p2: ClothPoint;
  dist: number;
}

// Color palettes for themes
interface ClothTheme {
  bg: string;
  baseLight: string;
  baseShadow: string;
  specular: string;
  wireColor: string;
  glow: string;
  tagColor: string;
  textColor: string;
  subtextColor: string;
}

const THEMES: Record<ClothVariant, ClothTheme> = {
  'studio-silk': {
    bg: '#F8F7F2',
    baseLight: '#FFFFFF',
    baseShadow: '#E2E8F0',
    specular: 'rgba(54, 92, 245, 0.4)',
    wireColor: 'rgba(54, 92, 245, 0.22)',
    glow: 'rgba(54, 92, 245, 0.12)',
    tagColor: '#365CF5',
    textColor: '#0F172A',
    subtextColor: '#64748B',
  },
  'liquid-gold': {
    bg: '#16130E',
    baseLight: '#FBBF24',
    baseShadow: '#78350F',
    specular: 'rgba(253, 230, 138, 0.65)',
    wireColor: 'rgba(245, 158, 11, 0.3)',
    glow: 'rgba(217, 119, 6, 0.2)',
    tagColor: '#F59E0B',
    textColor: '#FEF3C7',
    subtextColor: '#D97706',
  },
  'dark-obsidian': {
    bg: '#0A0E17',
    baseLight: '#1E293B',
    baseShadow: '#020617',
    specular: 'rgba(6, 182, 212, 0.55)',
    wireColor: 'rgba(6, 182, 212, 0.28)',
    glow: 'rgba(6, 182, 212, 0.15)',
    tagColor: '#06B6D4',
    textColor: '#F8FAFC',
    subtextColor: '#94A3B8',
  },
  'emerald-aurora': {
    bg: '#061A14',
    baseLight: '#064E3B',
    baseShadow: '#022C22',
    specular: 'rgba(16, 185, 129, 0.55)',
    wireColor: 'rgba(52, 211, 153, 0.3)',
    glow: 'rgba(16, 185, 129, 0.18)',
    tagColor: '#10B981',
    textColor: '#ECFDF5',
    subtextColor: '#6EE7B7',
  },
};

// Web Audio synthesizer for harmonic fabric breeze sounds
let audioCtx: AudioContext | null = null;
let lastAudioTick = 0;

function playClothWhoosh(intensity: number) {
  if (typeof window === 'undefined') return;
  const now = performance.now();
  if (now - lastAudioTick < 80) return; // Rate-limit sound ticks
  lastAudioTick = now;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx || audioCtx.state === 'suspended') {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    // Gentle resonant wind chime frequency (240Hz to 480Hz modulated by intensity)
    const baseFreq = 220 + Math.min(intensity * 180, 320);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, t + 0.18);

    // Warm lowpass filter to emulate fabric whoosh
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.linearRampToValueAtTime(350, t + 0.18);

    const volume = Math.min(0.045, Math.max(0.005, intensity * 0.035));
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.22);
  } catch {
    // Graceful fallback if Web Audio is blocked or unavailable
  }
}

export const NeuralClothMesh: React.FC<NeuralClothMeshProps> = ({
  variant = 'studio-silk',
  renderMode = 'wireframe',
  pinMode = 'curtain',
  gravity = 0.10,
  windStrength = 0,
  stiffness = 2,
  mouseRadius = 85,
  interactive = true,
  soundEnabled = true,
  compact = false,
  headline = 'Verlet Silk Mesh.',
  subheadline = 'Physical particle lattice connected by elastic relaxation constraints with real-time normal lighting and aerodynamic breeze.',
  children,
  className = '',
  style,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Mouse tracking state
  const mouseRef = useRef<{
    x: number;
    y: number;
    px: number;
    py: number;
    vx: number;
    vy: number;
    down: boolean;
    active: boolean;
  }>({
    x: -1000,
    y: -1000,
    px: -1000,
    py: -1000,
    vx: 0,
    vy: 0,
    down: false,
    active: false,
  });

  const theme = THEMES[variant];

  // Primary animation and physics simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    // Simulation grid dimensions
    const spacing = 18; // Spacing between nodes in pixels
    let cols = 0;
    let rows = 0;
    let points: ClothPoint[] = [];
    let constraints: ClothConstraint[] = [];

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(rect.width, 300);
      height = Math.max(rect.height, 240);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Reconstruct cloth lattice
      cols = Math.floor(width / spacing);
      rows = Math.floor((height * 0.88) / spacing);
      points = [];
      constraints = [];

      const startX = (width - (cols - 1) * spacing) / 2;
      const startY = 16;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * spacing;
          const y = startY + r * spacing;

          let isPinned = false;
          if (pinMode === 'top-edge' && r === 0) {
            isPinned = true;
          } else if (pinMode === 'corners' && r === 0 && (c === 0 || c === cols - 1)) {
            isPinned = true;
          } else if (pinMode === 'curtain' && r === 0 && (c % 5 === 0 || c === cols - 1)) {
            isPinned = true;
          }

          points.push({
            x,
            y,
            px: x,
            py: y,
            pinned: isPinned,
            pinX: x,
            pinY: y,
          });
        }
      }

      // Create structural constraints (horizontal & vertical)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          // Right neighbor
          if (c < cols - 1) {
            const rightIdx = idx + 1;
            constraints.push({
              p1: points[idx],
              p2: points[rightIdx],
              dist: spacing,
            });
          }
          // Bottom neighbor
          if (r < rows - 1) {
            const bottomIdx = idx + cols;
            constraints.push({
              p1: points[idx],
              p2: points[bottomIdx],
              dist: spacing,
            });
          }
        }
      }
    };

    handleResize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(container);
    }
    window.addEventListener('resize', handleResize);

    // Light source vector for 3D facet illumination
    const light = { x: 0.45, y: -0.65, z: 0.6 };
    const lightMag = Math.sqrt(light.x * light.x + light.y * light.y + light.z * light.z);
    light.x /= lightMag;
    light.y /= lightMag;
    light.z /= lightMag;

    let time = 0;

    const render = () => {
      time += 0.02;

      // 1. Verlet particle integration & wind forces
      const windWave = Math.sin(time * 1.5) * windStrength * 1.8;
      const breezeZ = Math.cos(time * 0.9) * 0.5;

      const mouse = mouseRef.current;
      const mouseSpeed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
      if (soundEnabled && mouse.active && mouseSpeed > 4) {
        playClothWhoosh(Math.min(1.2, mouseSpeed / 18));
      }

      const friction = 0.985; // Damping velocity factor

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (p.pinned) {
          p.x = p.pinX;
          p.y = p.pinY;
          continue;
        }

        const vx = (p.x - p.px) * friction;
        const vy = (p.y - p.py) * friction;

        p.px = p.x;
        p.py = p.y;

        // Apply downward gravity + aerodynamic harmonic wind
        const windX = windWave + Math.sin(time + p.y * 0.03) * windStrength * 0.6;
        p.x += vx + windX * 0.15;
        p.y += vy + gravity;

        // Pointer turbulence wind wake and drag
        if (interactive && mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseRadius && dist > 0.001) {
            const force = (1 - dist / mouseRadius) * 4.5;
            const normX = dx / dist;
            const normY = dy / dist;

            // Repulsion push + pointer velocity drag
            p.x += normX * force + mouse.vx * 0.18;
            p.y += normY * force + mouse.vy * 0.18;
          }
        }
      }

      // 2. Relaxation of distance constraints
      const relaxationSteps = Math.max(1, Math.min(5, stiffness));
      for (let step = 0; step < relaxationSteps; step++) {
        for (let i = 0; i < constraints.length; i++) {
          const c = constraints[i];
          const dx = c.p2.x - c.p1.x;
          const dy = c.p2.y - c.p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          const diff = (dist - c.dist) / dist;

          const offsetX = dx * diff * 0.5;
          const offsetY = dy * diff * 0.5;

          if (!c.p1.pinned) {
            c.p1.x += offsetX;
            c.p1.y += offsetY;
          }
          if (!c.p2.pinned) {
            c.p2.x -= offsetX;
            c.p2.y -= offsetY;
          }
        }
      }

      // Update mouse velocity decay
      mouse.vx *= 0.5;
      mouse.vy *= 0.5;

      // 3. Clear canvas with theme background
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, width, height);

      // 4. Subtle ambient background grid lines for studio depth
      ctx.strokeStyle = variant === 'studio-silk' ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 40) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
      }
      ctx.stroke();

      // 5. Render Cloth Mesh
      if (renderMode === 'shaded' || renderMode === 'hybrid') {
        // Draw illuminated 4-point quad facets with normal-based lighting
        for (let r = 0; r < rows - 1; r++) {
          for (let c = 0; c < cols - 1; c++) {
            const i0 = r * cols + c;
            const i1 = i0 + 1;
            const i2 = i0 + cols + 1;
            const i3 = i0 + cols;

            const p0 = points[i0];
            const p1 = points[i1];
            const p2 = points[i2];
            const p3 = points[i3];

            // Compute approximate facet surface normal via cross product of diagonals
            const ax = p2.x - p0.x;
            const ay = p2.y - p0.y;
            const az = breezeZ;

            const bx = p3.x - p1.x;
            const by = p3.y - p1.y;
            const bz = -breezeZ;

            let nx = ay * bz - az * by;
            let ny = az * bx - ax * bz;
            let nz = ax * by - ay * bx;

            const nMag = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
            nx /= nMag;
            ny /= nMag;
            nz /= nMag;

            // Dot product with directional light
            const dot = Math.max(0, nx * light.x + ny * light.y + nz * light.z);
            const brightness = 0.35 + dot * 0.65;

            // Fill quad polygon
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();

            // Set specular reflection tone based on theme
            if (variant === 'studio-silk') {
              const grey = Math.floor(220 + brightness * 35);
              ctx.fillStyle = `rgb(${grey}, ${grey}, ${grey + 4})`;
            } else if (variant === 'liquid-gold') {
              const rVal = Math.floor(180 + brightness * 75);
              const gVal = Math.floor(120 + brightness * 80);
              const bVal = Math.floor(20 + brightness * 40);
              ctx.fillStyle = `rgb(${rVal}, ${gVal}, ${bVal})`;
            } else if (variant === 'dark-obsidian') {
              const shade = Math.floor(14 + brightness * 42);
              const cyanTint = Math.floor(brightness * 65);
              ctx.fillStyle = `rgb(${shade}, ${shade + cyanTint / 2}, ${shade + cyanTint})`;
            } else {
              // Emerald Aurora
              const rVal = Math.floor(4 + brightness * 25);
              const gVal = Math.floor(40 + brightness * 120);
              const bVal = Math.floor(30 + brightness * 80);
              ctx.fillStyle = `rgb(${rVal}, ${gVal}, ${bVal})`;
            }
            ctx.fill();
          }
        }
      }

      // Draw wireframe overlay if in wireframe or hybrid mode
      if (renderMode === 'wireframe' || renderMode === 'hybrid') {
        ctx.strokeStyle = theme.wireColor;
        ctx.lineWidth = renderMode === 'wireframe' ? 1.2 : 0.6;
        ctx.beginPath();

        for (let i = 0; i < constraints.length; i++) {
          const c = constraints[i];
          ctx.moveTo(c.p1.x, c.p1.y);
          ctx.lineTo(c.p2.x, c.p2.y);
        }
        ctx.stroke();

        // Node dots in pure wireframe mode
        if (renderMode === 'wireframe') {
          ctx.fillStyle = theme.tagColor;
          for (let i = 0; i < points.length; i += 2) {
            const p = points[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.pinned ? 2.5 : 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw tether pin anchors along top edge
      ctx.fillStyle = theme.tagColor;
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (p.pinned) {
          ctx.beginPath();
          ctx.arc(p.pinX, p.pinY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Pointer Spotlight Halo
      if (interactive && mouse.active) {
        const radGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouseRadius * 1.4
        );
        radGrad.addColorStop(0, theme.glow);
        radGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouseRadius * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

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
  }, [variant, renderMode, pinMode, gravity, windStrength, stiffness, mouseRadius, interactive, soundEnabled, theme]);

  // Pointer event handlers
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const mouse = mouseRef.current;
    if (mouse.active) {
      mouse.vx = currentX - mouse.x;
      mouse.vy = currentY - mouse.y;
    } else {
      mouse.vx = 0;
      mouse.vy = 0;
    }

    mouse.px = mouse.x;
    mouse.py = mouse.y;
    mouse.x = currentX;
    mouse.y = currentY;
    mouse.active = true;
    setIsInteracting(true);
  };

  const handlePointerLeave = () => {
    mouseRef.current.active = false;
    mouseRef.current.down = false;
    setIsInteracting(false);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    mouseRef.current.down = true;
    if (soundEnabled) {
      playClothWhoosh(0.9);
    }
    // Gust impulse on pointer down
    const mouse = mouseRef.current;
    mouse.vx += (Math.random() - 0.5) * 20;
    mouse.vy += 12;
  };

  const handlePointerUp = () => {
    mouseRef.current.down = false;
  };

  // Keyboard accessibility: Spacebar or Enter triggers a gentle wind ripple
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      const cx = rect ? rect.width / 2 : 200;
      const cy = rect ? rect.height / 2 : 150;

      const mouse = mouseRef.current;
      mouse.x = cx;
      mouse.y = cy;
      mouse.vx = (Math.random() - 0.5) * 35;
      mouse.vy = -18;
      mouse.active = true;

      if (soundEnabled) {
        playClothWhoosh(1.1);
      }

      setTimeout(() => {
        mouse.active = false;
      }, 350);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`modui-cloth-mesh modui-cloth-mesh--${variant} ${compact ? 'modui-cloth-mesh--compact' : ''} ${className}`}
      style={style}
      role="region"
      aria-label="Interactive Verlet Silk Cloth Mesh"
      tabIndex={interactive ? 0 : undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {/* 2D Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="modui-cloth-mesh__canvas"
        aria-hidden="true"
      />

      {/* Atmospheric Vignette Overlay */}
      <div className="modui-cloth-mesh__vignette" />

      {/* Optional Typographic & Interactive Center Overlay */}
      <div className="modui-cloth-mesh__overlay">
        {!compact && (headline || subheadline) && (
          <div className="modui-cloth-mesh__content">
            <div className="modui-cloth-mesh__badge-tag" style={{ color: theme.tagColor }}>
              <span className="modui-cloth-mesh__pulse-dot" style={{ backgroundColor: theme.tagColor }} />
              VERLET CONTINUUM // {variant.toUpperCase().replace('-', ' ')}
            </div>
            {headline && (
              <h2 className="modui-cloth-mesh__headline" style={{ color: theme.textColor }}>
                {headline}
              </h2>
            )}
            {subheadline && (
              <p className="modui-cloth-mesh__subheadline" style={{ color: theme.subtextColor }}>
                {subheadline}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
