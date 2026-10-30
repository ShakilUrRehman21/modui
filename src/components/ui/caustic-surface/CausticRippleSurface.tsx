import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import './CausticRippleSurface.css';

export type CausticSurfaceVariant =
  | 'porcelain'
  | 'crystal-lake'
  | 'dark-obsidian'
  | 'amber-spring';

export interface CausticRippleSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual surface color scheme */
  variant?: CausticSurfaceVariant;
  /** Wave simulation damping (0.92 to 0.995, default: 0.98) */
  damping?: number;
  /** Refraction light deflection multiplier (default: 2.2) */
  refractionStrength?: number;
  /** Radius of injected disturbance droplets in simulation pixels (default: 4) */
  dropletRadius?: number;
  /** Periodic ambient raindrops when idle */
  rainEnabled?: boolean;
  /** Interval in milliseconds between ambient raindrops (default: 2400) */
  rainInterval?: number;
  /** Synthesize realistic acoustic water droplet plinks on ripple drops */
  soundEnabled?: boolean;
  /** Custom main headline text */
  headline?: string;
  /** Custom subheadline description */
  subheadline?: string;
  /** Compact card preview mode for embedded catalogue cards (default: false) */
  compact?: boolean;
  /** Show top and bottom HUD telemetry overlays (default: true) */
  showHud?: boolean;
  /** Custom overlay children */
  children?: React.ReactNode;
}

let sharedAudioCtx: AudioContext | null = null;

function getSharedAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!sharedAudioCtx || sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx = new AudioContextClass();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

// Synthesizes realistic acoustic water droplet "plink / bloop"
const playDropletPlink = (pitch = 640) => {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Frequency sweeps rapidly upward to mimic bubble resonance
    osc.frequency.setValueAtTime(pitch * 0.7, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.13);
  } catch {
    // Audio context restricted
  }
};

export const CausticRippleSurface: React.FC<CausticRippleSurfaceProps> = ({
  variant = 'porcelain',
  compact = false,
  showHud = true,
  damping = 0.98,
  refractionStrength = 2.2,
  dropletRadius = 4,
  rainEnabled = true,
  rainInterval = 2400,
  soundEnabled = true,
  headline = 'Liquid Clarity.',
  subheadline = 'Physical 2D fluid wave propagation with real-time caustic light refraction, ambient rain simulation, and synthesized acoustic droplet haptics.',
  children,
  className = '',
  ...restProps
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const specularCanvasRef = useRef<HTMLCanvasElement>(null);

  const [waveActivity, setWaveActivity] = useState<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const lastMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 2D Wave Simulation Buffer Refs
  // Using half-resolution simulation for exceptional 60+ FPS performance
  const simWidthRef = useRef<number>(240);
  const simHeightRef = useRef<number>(160);
  const buffer1Ref = useRef<Int16Array | null>(null);
  const buffer2Ref = useRef<Int16Array | null>(null);
  const currentBufferIdxRef = useRef<number>(0);

  // Allocate wave buffers
  const initBuffers = useCallback((w: number, h: number) => {
    const sw = Math.floor(w / 3.5);
    const sh = Math.floor(h / 3.5);
    simWidthRef.current = sw;
    simHeightRef.current = sh;

    const size = sw * sh;
    buffer1Ref.current = new Int16Array(size);
    buffer2Ref.current = new Int16Array(size);
  }, []);

  // Drop disturbance impulse into buffer
  const dropRipple = useCallback(
    (clientX: number, clientY: number, radius = dropletRadius, strength = 450, playSound = false) => {
      const container = containerRef.current;
      if (!container || !buffer1Ref.current) return;

      const rect = container.getBoundingClientRect();
      const normX = (clientX - rect.left) / rect.width;
      const normY = (clientY - rect.top) / rect.height;

      const sw = simWidthRef.current;
      const sh = simHeightRef.current;
      const cx = Math.floor(normX * sw);
      const cy = Math.floor(normY * sh);

      const buffer = currentBufferIdxRef.current === 0 ? buffer1Ref.current : buffer2Ref.current;
      if (!buffer) return;

      const r2 = radius * radius;
      for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
          const dist2 = x * x + y * y;
          if (dist2 <= r2) {
            const px = cx + x;
            const py = cy + y;
            if (px > 1 && px < sw - 1 && py > 1 && py < sh - 1) {
              const idx = py * sw + px;
              const falloff = 1 - Math.sqrt(dist2) / radius;
              buffer[idx] = Math.min(32000, buffer[idx] + Math.floor(strength * falloff));
            }
          }
        }
      }

      if (playSound && soundEnabled) {
        const pitch = 550 + Math.random() * 250;
        playDropletPlink(pitch);
      }
    },
    [dropletRadius, soundEnabled]
  );

  // Setup simulation and rendering loop
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const specularCanvas = specularCanvasRef.current;
    if (!container || !canvas || !specularCanvas) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 520;

    canvas.width = width;
    canvas.height = height;
    specularCanvas.width = width;
    specularCanvas.height = height;

    initBuffers(width, height);

    const ctx = canvas.getContext('2d');
    const specCtx = specularCanvas.getContext('2d');
    if (!ctx || !specCtx) return;

    let animId = 0;
    let frameCount = 0;

    // Initial introductory drops
    dropRipple(rectCenter(container).x, rectCenter(container).y, dropletRadius * 1.5, 600, false);

    const render = () => {
      animId = requestAnimationFrame(render);
      frameCount++;

      const sw = simWidthRef.current;
      const sh = simHeightRef.current;
      const currentBuf = currentBufferIdxRef.current === 0 ? buffer1Ref.current : buffer2Ref.current;
      const nextBuf = currentBufferIdxRef.current === 0 ? buffer2Ref.current : buffer1Ref.current;

      if (!currentBuf || !nextBuf) return;

      // 1. Solve 2D Discrete Wave Propagation Equation
      let totalEnergy = 0;
      for (let y = 1; y < sh - 1; y++) {
        const row = y * sw;
        for (let x = 1; x < sw - 1; x++) {
          const idx = row + x;
          const val =
            ((currentBuf[idx - 1] +
              currentBuf[idx + 1] +
              currentBuf[idx - sw] +
              currentBuf[idx + sw]) >>
              1) -
            nextBuf[idx];

          const damped = Math.floor(val * damping);
          nextBuf[idx] = damped;
          totalEnergy += Math.abs(damped);
        }
      }

      // Swap buffers
      currentBufferIdxRef.current = currentBufferIdxRef.current === 0 ? 1 : 0;

      // Update telemetry state occasionally
      if (frameCount % 12 === 0) {
        setWaveActivity(Math.min(100, Math.floor((totalEnergy / (sw * sh)) * 3.2)));
      }

      // 2. Render Caustic & Refraction Specular Lighting
      const imgData = specCtx.createImageData(sw, sh);
      const data = imgData.data;

      const isDark = variant === 'dark-obsidian';
      const isAmber = variant === 'amber-spring';

      // Light direction vector
      const lx = 0.577;
      const ly = 0.577;

      for (let y = 1; y < sh - 1; y++) {
        const row = y * sw;
        for (let x = 1; x < sw - 1; x++) {
          const idx = row + x;
          // Normal gradient vectors
          const dx = (nextBuf[idx + 1] - nextBuf[idx - 1]) * (refractionStrength * 0.08);
          const dy = (nextBuf[idx + sw] - nextBuf[idx - sw]) * (refractionStrength * 0.08);

          // Specular caustic reflection
          const dot = -dx * lx - dy * ly;
          const pixelIdx = idx * 4;

          if (dot > 0.5) {
            const intensity = Math.min(255, Math.floor((dot - 0.5) * 280));
            if (isDark) {
              data[pixelIdx] = Math.floor(intensity * 0.7);     // R
              data[pixelIdx + 1] = Math.floor(intensity * 0.9); // G
              data[pixelIdx + 2] = 255;                         // B (Cyan blue)
              data[pixelIdx + 3] = Math.floor(intensity * 0.95);
            } else if (isAmber) {
              data[pixelIdx] = 255;                             // R
              data[pixelIdx + 1] = Math.floor(intensity * 0.85); // G
              data[pixelIdx + 2] = Math.floor(intensity * 0.4);  // B (Warm Gold)
              data[pixelIdx + 3] = Math.floor(intensity * 0.9);
            } else {
              data[pixelIdx] = 255;
              data[pixelIdx + 1] = 255;
              data[pixelIdx + 2] = 255;
              data[pixelIdx + 3] = Math.floor(intensity * 0.85);
            }
          } else {
            // Ambient subtle tint based on wave height
            const hVal = nextBuf[idx];
            if (Math.abs(hVal) > 4) {
              const alpha = Math.min(45, Math.floor(Math.abs(hVal) * 0.06));
              data[pixelIdx] = isDark ? 56 : 14;
              data[pixelIdx + 1] = isDark ? 189 : 165;
              data[pixelIdx + 2] = 233;
              data[pixelIdx + 3] = alpha;
            }
          }
        }
      }

      // Draw high-resolution scaled caustics
      specCtx.clearRect(0, 0, width, height);

      // Create an offscreen canvas to scale smoothly with bilinear filtering
      const offscreen = document.createElement('canvas');
      offscreen.width = sw;
      offscreen.height = sh;
      const offCtx = offscreen.getContext('2d');
      if (offCtx) {
        offCtx.putImageData(imgData, 0, 0);
        specCtx.imageSmoothingEnabled = true;
        specCtx.imageSmoothingQuality = 'high';
        specCtx.drawImage(offscreen, 0, 0, width, height);
      }
    };

    render();

    // Responsive ResizeObserver handler
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && container) {
      ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = Math.floor(entry.contentRect.width);
          const h = Math.floor(entry.contentRect.height);
          if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
            canvas.width = w;
            canvas.height = h;
            specularCanvas.width = w;
            specularCanvas.height = h;
            initBuffers(w, h);
          }
        }
      });
      ro.observe(container);
    }

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        canvas.width = w;
        canvas.height = h;
        specularCanvas.width = w;
        specularCanvas.height = h;
        initBuffers(w, h);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [variant, damping, refractionStrength, dropletRadius, initBuffers, dropRipple]);

  // Periodic ambient raindrops
  useEffect(() => {
    if (!rainEnabled) return;
    const interval = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const rx = rect.left + Math.random() * rect.width;
      const ry = rect.top + Math.random() * rect.height;
      dropRipple(rx, ry, dropletRadius * 1.2, 480, soundEnabled);
    }, rainInterval);

    return () => clearInterval(interval);
  }, [rainEnabled, rainInterval, dropletRadius, dropRipple, soundEnabled]);

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    dropRipple(e.clientX, e.clientY, dropletRadius * 1.8, 650, true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 8) {
      const strength = isDraggingRef.current ? 400 : 180;
      dropRipple(e.clientX, e.clientY, dropletRadius, strength, false);
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const container = containerRef.current;
      if (container) {
        const center = rectCenter(container);
        dropRipple(center.x, center.y, dropletRadius * 2, 700, true);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`modui-caustic-surface modui-caustic-surface--${variant} ${compact ? 'modui-caustic-surface--compact' : ''} ${className}`}
      role="region"
      aria-label="Interactive Liquid Caustic Ripple Surface"
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      {...restProps}
    >
      {/* 1. Underlying Clean Visual Content Layer */}
      {compact ? (
        <div className="modui-caustic-compact-content">
          <span className="modui-caustic-compact-badge">LIQUID CAUSTIC</span>
          <span className="modui-caustic-compact-label">Interactive Ripple Surface</span>
          {children}
        </div>
      ) : (
        <div className="modui-caustic-content">
          <div className="modui-caustic-eyebrow">
            <span>CLEAN INTERFACE PRINTS</span>
          </div>

          <h3 className="modui-caustic-title">{headline}</h3>

          <p className="modui-caustic-desc">{subheadline}</p>

          <div className="modui-caustic-card-chip-group">
            <div className="modui-caustic-card-chip">
              <span className="modui-caustic-chip-dot" />
              <span>2D Wave Physics</span>
            </div>
            <div className="modui-caustic-card-chip">
              <span className="modui-caustic-chip-dot" />
              <span>Sunlight Caustic Refraction</span>
            </div>
            <div className="modui-caustic-card-chip">
              <span className="modui-caustic-chip-dot" />
              <span>Web Audio Acoustic Plinks</span>
            </div>
          </div>

          {children}
        </div>
      )}

      {/* 2. Water Fluid Canvas Overlay */}
      <canvas ref={canvasRef} className="modui-caustic-canvas" />

      {/* 3. Sunlight Specular Caustic Highlights Canvas */}
      <canvas ref={specularCanvasRef} className="modui-caustic-specular-canvas" />

      {/* 4. HUD Telemetry & Micro-hints */}
      {!compact && showHud && (
        <div className="modui-caustic-hud">
          <div className="modui-caustic-hud-top">
            <div className="modui-caustic-badge">
              <span className="modui-caustic-badge-pulse" />
              <span>LIQUID CAUSTIC REFRACTOR</span>
            </div>

            <div className="modui-caustic-telemetry">
              <div>
                <span>SURFACE: </span>
                <span className="modui-caustic-telemetry-val">{variant.toUpperCase()}</span>
              </div>
              <div>
                <span>WAVE ENERGY: </span>
                <span className="modui-caustic-telemetry-val">{waveActivity}%</span>
              </div>
            </div>
          </div>

          <div className="modui-caustic-hud-bottom">
            <div className="modui-caustic-hints">
              <span><span className="modui-caustic-hint-key">Drag</span> Liquid Wake</span>
              <span><span className="modui-caustic-hint-key">Click</span> Drop Ripple</span>
              <span><span className="modui-caustic-hint-key">Space</span> Pulse Center</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper: Get bounding rectangle center point
function rectCenter(elem: HTMLElement): { x: number; y: number } {
  const r = elem.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}
