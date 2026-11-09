import React, { useEffect, useRef, useState, useCallback, useId } from 'react';
import './PerspectiveTextRibbon.css';

export type RibbonOrientation = 'dynamic' | 'horizontal' | 'dynamic-angle' | 'floating-horizon';
export type RibbonVariant = 'cyber-indigo' | 'matrix-emerald' | 'solar-flame' | 'monochrome';
export type RibbonTheme = 'auto' | 'light' | 'dark';

export interface RibbonItem {
  text: string;
  style?: 'solid' | 'outline' | 'accent';
  badge?: string;
  separator?: string;
}

export interface PerspectiveTextRibbonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Array of text items or rich ribbon tokens */
  items?: (string | RibbonItem)[];
  /** 3D spatial perspective tilt preset ('dynamic' or 'horizontal') */
  orientation?: RibbonOrientation;
  /** Visual color theme */
  variant?: RibbonVariant;
  /** Color theme mode ('auto' synchronizes with document theme, or explicit 'light' / 'dark') */
  theme?: RibbonTheme;
  /** Base auto-drift velocity speed (default: 1.2) */
  speed?: number;
  /** Movement direction (default: 'forward') */
  direction?: 'forward' | 'reverse';
  /** Pause auto-drift when cursor hovers over the ribbon */
  pauseOnHover?: boolean;
  /** Enable mouse drag momentum scrub physics */
  interactiveScrub?: boolean;
  /** Synthesize mechanical tick haptics on drag/scrub */
  soundEnabled?: boolean;
  /** Compact mode for catalog card previews */
  compact?: boolean;
  /** Callback fired when velocity changes */
  onVelocityChange?: (velocity: number) => void;
  /** Callback fired when velocity direction is reversed */
  onDirectionChange?: (direction: 'forward' | 'reverse') => void;
}

export const DEFAULT_RIBBON_ITEMS: RibbonItem[] = [
  { text: 'MODUI', style: 'solid', separator: '✦' },
  { text: 'KINETIC', style: 'outline', separator: '❖' },
  { text: 'PRECISION', style: 'accent', badge: '60 FPS', separator: '●' },
  { text: 'EDITORIAL', style: 'solid', separator: '✦' },
  { text: 'PHYSICAL', style: 'outline', separator: '❖' },
  { text: 'ARCHITECTURAL', style: 'accent', badge: 'NEXT-GEN', separator: '●' },
  { text: 'TACTILE', style: 'solid', separator: '✦' },
  { text: 'GENERATIVE', style: 'outline', separator: '❖' },
];

const ORIENTATION_TRANSFORMS: Record<string, string> = {
  'dynamic': 'rotateX(22deg) rotateY(-18deg) rotateZ(-4deg)',
  'horizontal': 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
  'dynamic-angle': 'rotateX(22deg) rotateY(-18deg) rotateZ(-4deg)',
  'floating-horizon': 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
};

export const PerspectiveTextRibbon: React.FC<PerspectiveTextRibbonProps> = ({
  items = DEFAULT_RIBBON_ITEMS,
  orientation = 'dynamic',
  variant = 'cyber-indigo',
  theme: themeMode = 'auto',
  speed = 1.2,
  direction = 'forward',
  pauseOnHover = false,
  interactiveScrub = true,
  soundEnabled = true,
  compact = false,
  onVelocityChange,
  onDirectionChange,
  className = '',
  ...restProps
}) => {
  // Theme state synchronization
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

  const [isPaused, setIsPaused] = useState(false);
  const [internalOrientation, setInternalOrientation] = useState<RibbonOrientation>(orientation);
  const [internalDirection, setInternalDirection] = useState<'forward' | 'reverse'>(direction);

  useEffect(() => {
    setInternalOrientation(orientation);
  }, [orientation]);

  useEffect(() => {
    setInternalDirection(direction);
  }, [direction]);

  const bandRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Physics state refs for 60fps momentum
  const offsetRef = useRef<number>(0);
  const velocityRef = useRef<number>(internalDirection === 'forward' ? -speed : speed);
  const isDraggingRef = useRef<boolean>(false);
  const lastPointerXRef = useRef<number>(0);
  const lastTickDistRef = useRef<number>(0);

  const labelId = useId();

  // Normalized items array
  const normalizedItems: RibbonItem[] = items.map((item, idx) => {
    if (typeof item === 'string') {
      const style: 'solid' | 'outline' | 'accent' = idx % 3 === 0 ? 'solid' : idx % 3 === 1 ? 'outline' : 'accent';
      return { text: item, style, separator: '✦' };
    }
    return item;
  });

  // Web Audio Mechanical Tick Sound DSP
  const playTick = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200 + Math.random() * 300, ctx.currentTime);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);

      setTimeout(() => {
        ctx.close().catch(() => {});
      }, 80);
    } catch {
      // Audio autoplay policy catch
    }
  }, [soundEnabled]);

  // Main Motion & Physics Loop
  useEffect(() => {
    const band = bandRef.current;
    if (!band) return;

    const baseVel = internalDirection === 'forward' ? -speed : speed;

    const animate = () => {
      if (!isDraggingRef.current) {
        if (!isPaused) {
          // Smooth return towards base velocity with momentum decay
          velocityRef.current += (baseVel - velocityRef.current) * 0.06;
          offsetRef.current += velocityRef.current;
        }
      } else {
        offsetRef.current += velocityRef.current;
      }

      // Seamless endless wrap based on single set width
      const loopThreshold = band.scrollWidth / 3;
      if (loopThreshold > 0) {
        if (offsetRef.current <= -loopThreshold) {
          offsetRef.current += loopThreshold;
        } else if (offsetRef.current >= 0) {
          offsetRef.current -= loopThreshold;
        }
      }

      // Check tick distance during fast scrub
      if (Math.abs(offsetRef.current - lastTickDistRef.current) > 75) {
        if (Math.abs(velocityRef.current) > 2) {
          playTick();
        }
        lastTickDistRef.current = offsetRef.current;
      }

      const transformMatrix = ORIENTATION_TRANSFORMS[internalOrientation] || ORIENTATION_TRANSFORMS['dynamic'];
      band.style.transform = `${transformMatrix} translateX(${offsetRef.current}px)`;

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [internalDirection, speed, isPaused, internalOrientation, playTick]);

  // Reverse Velocity action
  const handleReverseVelocity = () => {
    const nextDir = internalDirection === 'forward' ? 'reverse' : 'forward';
    setInternalDirection(nextDir);
    velocityRef.current = -velocityRef.current;
    playTick();
    onDirectionChange?.(nextDir);
  };

  // Pointer & Drag Handlers for Momentum Fling
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactiveScrub) return;
    isDraggingRef.current = true;
    lastPointerXRef.current = e.clientX;
    velocityRef.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastPointerXRef.current;
    offsetRef.current += deltaX;
    velocityRef.current = deltaX * 0.85; // Track flick velocity
    lastPointerXRef.current = e.clientX;
    onVelocityChange?.(velocityRef.current);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      offsetRef.current -= 60;
      velocityRef.current = -4;
      playTick();
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      offsetRef.current += 60;
      velocityRef.current = 4;
      playTick();
      e.preventDefault();
    } else if (e.key === 'r' || e.key === 'R') {
      handleReverseVelocity();
      e.preventDefault();
    } else if (e.key === ' ') {
      setIsPaused((p) => !p);
      e.preventDefault();
    }
  };

  const fullTextSummary = normalizedItems.map((item) => item.text).join(' · ');

  return (
    <div
      className={`modui-perspective-ribbon-container modui-perspective-ribbon--${variant} modui-perspective-ribbon--theme-${activeTheme} ${
        compact ? 'modui-perspective-ribbon--compact' : ''
      } ${className}`}
      role="region"
      aria-labelledby={labelId}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      {...restProps}
    >
      <div id={labelId} className="sr-only">
        3D Perspective Text Ribbon: {fullTextSummary}. Use Left and Right arrow keys to scrub marquee; press R to reverse direction, Space to pause.
      </div>

      {/* Top HUD Telemetry Bar (Hidden in compact mode) */}
      {!compact && (
        <div className="modui-ribbon-hud">
          <div className="modui-ribbon-badge">
            <span className="modui-ribbon-pulse-dot" />
            <span className="modui-ribbon-hud-title">
              3D PERSPECTIVE // {internalOrientation === 'horizontal' || internalOrientation === 'floating-horizon' ? 'HORIZONTAL' : 'DYNAMIC'}
            </span>
          </div>

          <div className="modui-ribbon-stats">
            <span>VELOCITY: {internalDirection === 'reverse' ? `-${speed.toFixed(1)}x` : `+${speed.toFixed(1)}x`}</span>
            <span className="modui-ribbon-divider">·</span>
            <span>HARDWARE COMPOSITED</span>
          </div>
        </div>
      )}

      {/* 3D Viewport Stage */}
      <div
        className="modui-ribbon-viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => {
          if (pauseOnHover) setIsPaused(false);
          isDraggingRef.current = false;
        }}
        title={interactiveScrub ? 'Drag horizontally to scrub with momentum fling' : undefined}
      >
        {/* Repeating Text Bands for Seamless 3D Wrap */}
        <div ref={bandRef} className="modui-ribbon-band">
          {[0, 1, 2].map((repeatIdx) => (
            <div key={repeatIdx} className="modui-ribbon-track" aria-hidden={repeatIdx > 0}>
              {normalizedItems.map((item, idx) => (
                <span
                  key={`${repeatIdx}-${idx}`}
                  className={`modui-ribbon-item modui-ribbon-item--${item.style || 'solid'}`}
                >
                  <span className="modui-ribbon-text">{item.text}</span>
                  {item.badge && <span className="modui-ribbon-item-badge">{item.badge}</span>}
                  <span className="modui-ribbon-separator">{item.separator || '✦'}</span>
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Ambient Depth Vignette Overlays */}
        <div className="modui-ribbon-vignette-left" style={{ pointerEvents: 'none' }} />
        <div className="modui-ribbon-vignette-right" style={{ pointerEvents: 'none' }} />
      </div>

      {/* Tactile Control Toolbar (Hidden in compact mode) */}
      {!compact && (
        <div className="modui-ribbon-toolbar">
          <div className="modui-ribbon-orientation-tabs" role="tablist" aria-label="Ribbon Perspectives">
            {(['dynamic', 'horizontal'] as const).map((mode) => {
              const isSelected =
                internalOrientation === mode ||
                (mode === 'dynamic' && internalOrientation === 'dynamic-angle') ||
                (mode === 'horizontal' && internalOrientation === 'floating-horizon');
              return (
                <button
                  key={mode}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`modui-ribbon-btn ${isSelected ? 'modui-ribbon-btn--active' : ''}`}
                  onClick={() => setInternalOrientation(mode)}
                >
                  {mode === 'dynamic' ? 'Dynamic 3D' : 'Horizontal'}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              className="modui-ribbon-btn modui-ribbon-reverse-btn"
              onClick={handleReverseVelocity}
              title="Reverse velocity direction"
              aria-label="Reverse velocity direction"
            >
              ⇄ Reverse Velocity ({internalDirection === 'forward' ? 'FWD' : 'REV'})
            </button>

            <button
              type="button"
              className="modui-ribbon-btn modui-ribbon-pause-btn"
              onClick={() => setIsPaused((p) => !p)}
              aria-label={isPaused ? 'Resume marquee' : 'Pause marquee'}
            >
              {isPaused ? '▶ Resume' : '❚❚ Pause'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
