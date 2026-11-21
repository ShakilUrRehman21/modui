import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import './SpatialHexahedronDeck.css';

export type CubeFaceId = 'front' | 'right' | 'back' | 'left' | 'top' | 'bottom';

export interface CubeFaceData {
  id: CubeFaceId;
  badge?: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  tag?: string;
  customContent?: React.ReactNode;
}

export type SpatialHexahedronVariant =
  | 'cyber-obsidian'
  | 'clean-porcelain'
  | 'titanium-steel'
  | 'aurora-violet';

export type SpatialHexahedronSize = 'sm' | 'md' | 'lg';

export interface SpatialHexahedronDeckProps {
  /** Face data for 6 faces */
  faces?: CubeFaceData[];
  /** Chassis and theme variant */
  variant?: SpatialHexahedronVariant;
  /** Size scale (sm: 150px, md: 220px, lg: 280px) */
  size?: SpatialHexahedronSize;
  /** Explicit pixel size for the cube (overrides size preset) */
  cubeSize?: number;
  /** Whether 3D drag interaction is active */
  interactive?: boolean;
  /** Whether the cube starts in or is currently exploded */
  exploded?: boolean;
  /** Exploded distance multiplier (default: 1.68) */
  explodeDistance?: number;
  /** Whether idle auto-rotation is active */
  autoRotate?: boolean;
  /** Auto-rotation speed in degrees per frame (default: 0.25) */
  autoRotateSpeed?: number;
  /** Active focused face ID */
  activeFace?: CubeFaceId;
  /** Callback fired when focused face changes */
  onFaceChange?: (face: CubeFaceData) => void;
  /** Whether to render directional quick-snap navigation pills */
  showFaceNav?: boolean;
  /** Whether to enable Web Audio acoustic detent and latch feedback */
  soundEnabled?: boolean;
  /** Compact mode for preview cards */
  compact?: boolean;
  /** Optional container class name */
  className?: string;
  /** Optional container style */
  style?: React.CSSProperties;
}

export interface SpatialHexahedronDeckHandle {
  snapToFace: (faceId: CubeFaceId) => void;
  setExploded: (exploded: boolean) => void;
  toggleExplode: () => void;
  resetRotation: () => void;
  getRotation: () => { rotX: number; rotY: number };
}

// Target camera orientation angles to bring each face straight to the front
const FACE_ANGLES: Record<CubeFaceId, { rotX: number; rotY: number }> = {
  front: { rotX: 0, rotY: 0 },
  right: { rotX: 0, rotY: -90 },
  back: { rotX: 0, rotY: -180 },
  left: { rotX: 0, rotY: 90 },
  top: { rotX: -90, rotY: 0 },
  bottom: { rotX: 90, rotY: 0 },
};

const DEFAULT_FACES: CubeFaceData[] = [
  {
    id: 'front',
    badge: 'Core 01',
    title: 'Velocity Engine',
    subtitle: 'Zero Runtime Bloat',
    description: 'Sub-millisecond render dispatch with hardware-accelerated CSS 3D composition.',
    tag: '60 FPS LOCKED',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: 'right',
    badge: 'Core 02',
    title: 'Isolated Vault',
    subtitle: 'Zero Telemetry Leaks',
    description: 'Memory-safe cryptographic state boundaries with strictly client-side validation.',
    tag: 'EAL6+ COMPLIANT',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    id: 'back',
    badge: 'Core 03',
    title: 'Global Mesh',
    subtitle: 'Distributed Anycast',
    description: 'Edge-propagated instances synchronized across 310+ point-of-presence datacenters.',
    tag: 'GLOBAL EDGE',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: 'left',
    badge: 'Core 04',
    title: 'Self-Healing SLA',
    subtitle: '99.999% Reliability',
    description: 'Autonomous health consensus with seamless sub-5ms multi-region instant failover.',
    tag: 'AUTONOMOUS',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    id: 'top',
    badge: 'Core 05',
    title: 'Developer Craft',
    subtitle: 'React 19 & Pure CSS',
    description: 'Zero external CSS runtime bloat, standard CSS custom properties, and full TypeScript typings.',
    tag: 'ZERO RUNTIME',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: 'bottom',
    badge: 'Core 06',
    title: 'Tactile Acoustics',
    subtitle: 'Web Audio Oscillators',
    description: 'Synthesized parametric detent ticks and physical latch haptics with zero asset downloads.',
    tag: 'NATIVE DSP',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    ),
  },
];

// Web Audio API Acoustic Haptics
let sharedAudioCtx: AudioContext | null = null;
function getSharedAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtxClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtxClass) return null;
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    try {
      sharedAudioCtx = new AudioCtxClass();
    } catch {
      return null;
    }
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

function playSnapSound() {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(820, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.03);
    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {}
}

function playExplodeSound(isExploded: boolean) {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const startFreq = isExploded ? 480 : 720;
    const endFreq = isExploded ? 760 : 380;
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.13);
  } catch {}
}

export const SpatialHexahedronDeck = forwardRef<
  SpatialHexahedronDeckHandle,
  SpatialHexahedronDeckProps
>(function SpatialHexahedronDeck(
  {
    faces = DEFAULT_FACES,
    variant = 'cyber-obsidian',
    size = 'md',
    cubeSize: customSize,
    interactive = true,
    exploded: controlledExploded,
    explodeDistance = 1.68,
    autoRotate = true,
    autoRotateSpeed = 0.25,
    activeFace: controlledActiveFace,
    onFaceChange,
    showFaceNav = true,
    soundEnabled = true,
    compact = false,
    className = '',
    style,
  },
  ref
) {
  // Determine pixel size
  const actualSize = customSize ?? (size === 'sm' ? 150 : size === 'lg' ? 280 : 220);
  const halfSize = actualSize / 2;
  const explodeDist = actualSize * explodeDistance * 0.5;

  // Rotation state: default starts at an elegant isometric 3D showcase perspective
  const [rotX, setRotX] = useState<number>(-18);
  const [rotY, setRotY] = useState<number>(32);
  const [isExploded, setIsExploded] = useState<boolean>(controlledExploded ?? false);
  const [activeFaceId, setActiveFaceId] = useState<CubeFaceId>(controlledActiveFace ?? 'front');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAnimatingSnap, setIsAnimatingSnap] = useState<boolean>(false);

  // Sync controlled props
  useEffect(() => {
    if (controlledExploded !== undefined) {
      setIsExploded(controlledExploded);
    }
  }, [controlledExploded]);

  useEffect(() => {
    if (controlledActiveFace !== undefined) {
      setActiveFaceId(controlledActiveFace);
    }
  }, [controlledActiveFace]);

  // Pointer drag tracking refs
  const lastPointerRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const velocityRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const animFrameRef = useRef<number | null>(null);
  const cubeRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // Snap to a designated face
  const snapToFace = useCallback(
    (faceId: CubeFaceId) => {
      const target = FACE_ANGLES[faceId];
      if (!target) return;
      setIsAnimatingSnap(true);
      setRotX(target.rotX);
      setRotY(target.rotY);
      setActiveFaceId(faceId);

      if (soundEnabled) {
        playSnapSound();
      }

      const matchedFace = faces.find((f) => f.id === faceId);
      if (matchedFace && onFaceChange) {
        onFaceChange(matchedFace);
      }

      // Turn off snap animation class after transition finishes
      setTimeout(() => {
        setIsAnimatingSnap(false);
      }, 550);
    },
    [faces, onFaceChange, soundEnabled]
  );

  const toggleExplode = useCallback(() => {
    setIsExploded((prev) => {
      const next = !prev;
      if (soundEnabled) {
        playExplodeSound(next);
      }
      return next;
    });
  }, [soundEnabled]);

  const resetRotation = useCallback(() => {
    setIsAnimatingSnap(true);
    setRotX(-18);
    setRotY(32);
    setActiveFaceId('front');
    if (soundEnabled) {
      playSnapSound();
    }
    setTimeout(() => {
      setIsAnimatingSnap(false);
    }, 550);
  }, [soundEnabled]);

  // Imperative Handle
  useImperativeHandle(
    ref,
    () => ({
      snapToFace,
      setExploded: (val: boolean) => {
        setIsExploded(val);
        if (soundEnabled) playExplodeSound(val);
      },
      toggleExplode,
      resetRotation,
      getRotation: () => ({ rotX, rotY }),
    }),
    [snapToFace, toggleExplode, resetRotation, rotX, rotY, soundEnabled]
  );

  // Pointer Event Handlers for 3D Drag
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    setIsDragging(true);
    setIsAnimatingSnap(false);
    lastPointerRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    velocityRef.current = { vx: 0, vy: 0 };
    if (e.currentTarget.setPointerCapture) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !interactive) return;
    const now = performance.now();
    const dt = Math.max(now - lastPointerRef.current.time, 1);
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;

    // Track instantaneous velocity
    velocityRef.current = {
      vx: (dx / dt) * 16,
      vy: (dy / dt) * 16,
    };

    lastPointerRef.current = { x: e.clientX, y: e.clientY, time: now };

    setRotY((prev) => prev + dx * 0.55);
    setRotX((prev) => Math.min(85, Math.max(-85, prev - dy * 0.55)));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (e.currentTarget.releasePointerCapture) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }

    if (soundEnabled) {
      playSnapSound();
    }
  };

  // Inertia and Auto-Rotation loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      if (!isDragging && !isAnimatingSnap) {
        // Inertia damping
        if (Math.abs(velocityRef.current.vx) > 0.05 || Math.abs(velocityRef.current.vy) > 0.05) {
          setRotY((prev) => prev + velocityRef.current.vx * 0.4);
          setRotX((prev) => Math.min(85, Math.max(-85, prev - velocityRef.current.vy * 0.4)));
          velocityRef.current.vx *= 0.92;
          velocityRef.current.vy *= 0.92;
        } else if (autoRotate) {
          // Idle auto rotation
          setRotY((prev) => (prev + autoRotateSpeed * dt * 60) % 360);
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isDragging, isAnimatingSnap, autoRotate, autoRotateSpeed]);

  // CSS variables applied to container
  const containerStyle: React.CSSProperties = {
    ...style,
    ['--modui-shd-size' as string]: `${actualSize}px`,
    ['--modui-shd-half-size' as string]: `${halfSize}px`,
    ['--modui-shd-explode-dist' as string]: `${explodeDist}px`,
  };

  const cubeTransformStyle: React.CSSProperties = {
    transform: `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`,
  };

  return (
    <div
      className={`modui-shd-container modui-shd-variant-${variant} ${
        compact ? 'modui-shd-compact' : ''
      } ${className}`}
      style={containerStyle}
      role="region"
      aria-label="3D Navigable Spatial Hexahedron Product Deck"
    >
      <div
        ref={viewportRef}
        className={`modui-shd-viewport ${interactive ? 'modui-shd-interactive' : ''} ${
          isDragging ? 'modui-shd-dragging' : ''
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        tabIndex={interactive ? 0 : -1}
        onKeyDown={(e) => {
          if (!interactive) return;
          if (e.key === 'ArrowLeft') setRotY((p) => p - 15);
          if (e.key === 'ArrowRight') setRotY((p) => p + 15);
          if (e.key === 'ArrowUp') setRotX((p) => Math.min(85, p + 15));
          if (e.key === 'ArrowDown') setRotX((p) => Math.max(-85, p - 15));
          if (e.key === 'e' || e.key === 'E') toggleExplode();
        }}
        aria-describedby="modui-shd-nav-hint"
      >
        <div
          ref={cubeRef}
          className={`modui-shd-cube ${isExploded ? 'modui-shd-exploded' : ''} ${
            isAnimatingSnap ? 'modui-shd-animating' : ''
          }`}
          style={cubeTransformStyle}
        >
          {faces.map((face) => {
            const isActive = face.id === activeFaceId;
            return (
              <div
                key={face.id}
                className={`modui-shd-face modui-shd-face-${face.id} ${
                  isActive ? 'modui-shd-face-active' : ''
                }`}
                onClick={() => snapToFace(face.id)}
              >
                {face.customContent ? (
                  face.customContent
                ) : (
                  <>
                    <div className="modui-shd-face-header">
                      {face.badge && <span className="modui-shd-badge">{face.badge}</span>}
                      {face.icon && <div className="modui-shd-icon">{face.icon}</div>}
                    </div>

                    <div className="modui-shd-face-body">
                      <h4 className="modui-shd-title">{face.title}</h4>
                      {face.subtitle && (
                        <div className="modui-shd-subtitle">{face.subtitle}</div>
                      )}
                      {face.description && (
                        <p className="modui-shd-desc">{face.description}</p>
                      )}
                    </div>

                    <div className="modui-shd-face-footer">
                      <span>{face.id.toUpperCase()}</span>
                      {face.tag && <span>{face.tag}</span>}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Ambient Ground Reflection Shadow */}
        <div className="modui-shd-shadow" />
      </div>

      {/* Interactive Quick-Snap Navigation Bar */}
      {showFaceNav && (
        <nav className="modui-shd-nav" aria-label="Hexahedron Face Selectors">
          <button
            type="button"
            className="modui-shd-nav-btn modui-shd-nav-explode-btn"
            onClick={toggleExplode}
            aria-pressed={isExploded}
          >
            <span>{isExploded ? '↩ Collapse' : '💥 Explode'}</span>
          </button>

          {(['front', 'right', 'back', 'left', 'top', 'bottom'] as CubeFaceId[]).map((fId) => (
            <button
              key={fId}
              type="button"
              className={`modui-shd-nav-btn ${activeFaceId === fId ? 'modui-shd-nav-active' : ''}`}
              onClick={() => snapToFace(fId)}
            >
              {fId.charAt(0).toUpperCase() + fId.slice(1)}
            </button>
          ))}
        </nav>
      )}

      <span id="modui-shd-nav-hint" style={{ display: 'none' }}>
        Use arrow keys to rotate cube or click buttons to inspect individual faces.
      </span>
    </div>
  );
});

export default SpatialHexahedronDeck;
