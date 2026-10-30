import React, { useRef, useState, useCallback, useMemo, useId } from 'react';
import './ApertureIrisLens.css';

export type ApertureVariant = 'studio-silver' | 'matte-obsidian' | 'classic-brass' | 'cyber-neon';

export interface FStopItem {
  label: string;
  value: number; // Normalized aperture ratio 0.05 to 1.0
  fNumber: number;
}

export const STANDARD_F_STOPS: FStopItem[] = [
  { label: 'f/1.4', value: 1.0, fNumber: 1.4 },
  { label: 'f/2.0', value: 0.85, fNumber: 2.0 },
  { label: 'f/2.8', value: 0.70, fNumber: 2.8 },
  { label: 'f/4.0', value: 0.55, fNumber: 4.0 },
  { label: 'f/5.6', value: 0.42, fNumber: 5.6 },
  { label: 'f/8.0', value: 0.30, fNumber: 8.0 },
  { label: 'f/11', value: 0.20, fNumber: 11.0 },
  { label: 'f/16', value: 0.12, fNumber: 16.0 },
  { label: 'f/22', value: 0.05, fNumber: 22.0 },
];

export interface ApertureIrisLensProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Visual barrel finish and blade metallic styling */
  variant?: ApertureVariant;
  /** Number of interlocking mechanical iris blades (6 to 14, default: 9) */
  bladesCount?: number;
  /** Controlled aperture ratio (0.05 to 1.0) */
  value?: number;
  /** Initial aperture ratio when uncontrolled (default: 0.55 = f/4.0) */
  defaultValue?: number;
  /** Callback fired when aperture opening shifts */
  onChange?: (value: number, fStop: string) => void;
  /** Render outer machined lens barrel with knurling and engravings (default: true) */
  showRing?: boolean;
  /** Render clickable f-stop selector buttons below the lens (default: true) */
  showFStops?: boolean;
  /** Enable circular drag on barrel ring and mouse interaction (default: true) */
  interactive?: boolean;
  /** Synthesize realistic mechanical brass ratchet ticks via Web Audio (default: true) */
  soundEnabled?: boolean;
  /** Compact card mode for catalogue cards and featured sections (default: false) */
  compact?: boolean;
  /** Focal length indicator engraved on the lens barrel (default: '50mm') */
  focalLength?: string;
  /** Custom content or image rendered inside the revealed aperture opening */
  revealContent?: React.ReactNode;
  /** Optional overlay children */
  children?: React.ReactNode;
}

// Synthesizes an authentic mechanical camera aperture leaf click
let audioCtx: AudioContext | null = null;
let lastSoundTime = 0;

function playApertureTick(isOpening: boolean) {
  if (typeof window === 'undefined') return;
  const now = performance.now();
  if (now - lastSoundTime < 45) return; // Prevent audio congestion during rapid scrub
  lastSoundTime = now;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx || audioCtx.state === 'suspended') {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const t = audioCtx.currentTime;

    // 1. High metal leaf blade click transient
    const oscClick = audioCtx.createOscillator();
    const gainClick = audioCtx.createGain();
    const clickFreq = isOpening ? 2100 : 1750;

    oscClick.type = 'triangle';
    oscClick.frequency.setValueAtTime(clickFreq, t);
    oscClick.frequency.exponentialRampToValueAtTime(800, t + 0.018);

    gainClick.gain.setValueAtTime(0.04, t);
    gainClick.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);

    oscClick.connect(gainClick);
    gainClick.connect(audioCtx.destination);

    oscClick.start(t);
    oscClick.stop(t + 0.025);

    // 2. Low resonant barrel housing detent "thump"
    const oscThump = audioCtx.createOscillator();
    const gainThump = audioCtx.createGain();

    oscThump.type = 'sine';
    oscThump.frequency.setValueAtTime(280, t);
    oscThump.frequency.exponentialRampToValueAtTime(110, t + 0.035);

    gainThump.gain.setValueAtTime(0.03, t);
    gainThump.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

    oscThump.connect(gainThump);
    gainThump.connect(audioCtx.destination);

    oscThump.start(t);
    oscThump.stop(t + 0.045);
  } catch {
    // Graceful fallback if Web Audio is blocked
  }
}

// Map aperture ratio (0.05 - 1.0) to closest matching F-Stop label
function getClosestFStop(aperture: number): string {
  let closest = STANDARD_F_STOPS[0];
  let minDiff = Math.abs(aperture - closest.value);
  for (let i = 1; i < STANDARD_F_STOPS.length; i++) {
    const diff = Math.abs(aperture - STANDARD_F_STOPS[i].value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = STANDARD_F_STOPS[i];
    }
  }
  return closest.label;
}

export const ApertureIrisLens: React.FC<ApertureIrisLensProps> = ({
  variant = 'studio-silver',
  bladesCount = 9,
  value: controlledValue,
  defaultValue = 0.55,
  onChange,
  showRing = true,
  showFStops = true,
  interactive = true,
  soundEnabled = true,
  compact = false,
  focalLength = '50mm',
  revealContent,
  children,
  className = '',
  style,
  ...rest
}) => {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<number>(defaultValue);
  const apertureValue = isControlled ? controlledValue : internalValue;

  const [isDragging, setIsDragging] = useState(false);
  const dragCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startAngleRef = useRef<number>(0);
  const startValueRef = useRef<number>(apertureValue);
  const prevValueRef = useRef<number>(apertureValue);

  // Clamped blade count
  const nBlades = Math.max(6, Math.min(16, bladesCount));

  // Current active F-Stop label
  const currentFStop = useMemo(() => getClosestFStop(apertureValue), [apertureValue]);

  // Update value helper with audio feedback
  const updateAperture = useCallback(
    (newVal: number) => {
      const clamped = Math.round(Math.max(0.05, Math.min(1.0, newVal)) * 100) / 100;
      const prev = prevValueRef.current;
      const isOpening = clamped > prev;

      if (Math.abs(clamped - prev) > 0.02) {
        if (soundEnabled) {
          playApertureTick(isOpening);
        }
        prevValueRef.current = clamped;
      }

      if (!isControlled) {
        setInternalValue(clamped);
      }
      onChange?.(clamped, getClosestFStop(clamped));
    },
    [isControlled, onChange, soundEnabled]
  );

  // SVG Geometry constants (viewBox: 0 0 320 320)
  const cx = 160;
  const cy = 160;
  const outerR = 120; // Outer mounting barrel radius
  const minIrisR = 8; // Closed pinpoint opening radius
  const maxIrisR = 105; // Wide-open iris radius

  // Current aperture opening radius
  const currentIrisR = minIrisR + (maxIrisR - minIrisR) * Math.pow(apertureValue, 0.9);

  // Generate the N interlocking curved blades
  const blades = useMemo(() => {
    const list: { id: number; path: string; angleDeg: number }[] = [];
    const step = (Math.PI * 2) / nBlades;
    const r = currentIrisR;
    const L = Math.sqrt(Math.max(0, outerR * outerR - r * r));

    for (let k = 0; k < nBlades; k++) {
      const phi = k * step;
      const cosP = Math.cos(phi);
      const sinP = Math.sin(phi);

      // 1. Inner contact point along the opening perimeter
      const pInnerX = cx + r * cosP;
      const pInnerY = cy + r * sinP;

      // 2. Tip point where the tangent cutting edge reaches the outer circumference
      const pTipX = pInnerX - L * sinP;
      const pTipY = pInnerY + L * cosP;

      // Outer angle of tip
      const tipAngle = Math.atan2(pTipY - cy, pTipX - cx);
      // Sweep outer arc to provide ample overlap behind the adjacent blade
      const arcEndAngle = tipAngle + step * 1.55;
      const pArcEndX = cx + outerR * Math.cos(arcEndAngle);
      const pArcEndY = cy + outerR * Math.sin(arcEndAngle);

      // 3. Curved return back-edge curving inward to base
      const pBaseAngle = phi + step * 0.85;
      const pBaseX = cx + (r * 0.9) * Math.cos(pBaseAngle);
      const pBaseY = cy + (r * 0.9) * Math.sin(pBaseAngle);

      // SVG path definition
      const path = [
        `M ${pInnerX.toFixed(2)} ${pInnerY.toFixed(2)}`,
        `L ${pTipX.toFixed(2)} ${pTipY.toFixed(2)}`,
        `A ${outerR} ${outerR} 0 0 1 ${pArcEndX.toFixed(2)} ${pArcEndY.toFixed(2)}`,
        `Q ${(cx + outerR * 0.7 * Math.cos(tipAngle + step)).toFixed(2)} ${(cy + outerR * 0.7 * Math.sin(tipAngle + step)).toFixed(2)} ${pBaseX.toFixed(2)} ${pBaseY.toFixed(2)}`,
        'Z',
      ].join(' ');

      list.push({
        id: k,
        path,
        angleDeg: (phi * 180) / Math.PI,
      });
    }

    return list;
  }, [nBlades, currentIrisR, cx, cy, outerR]);

  // Generate central opening polygon for clipping revealed content
  const aperturePolygonPoints = useMemo(() => {
    const points: string[] = [];
    const step = (Math.PI * 2) / nBlades;
    const r = currentIrisR;

    for (let k = 0; k < nBlades; k++) {
      const phi = k * step;
      const px = cx + r * Math.cos(phi);
      const py = cy + r * Math.sin(phi);
      points.push(`${px.toFixed(2)},${py.toFixed(2)}`);
    }

    return points.join(' ');
  }, [nBlades, currentIrisR, cx, cy]);

  // Pointer drag interaction on outer barrel knurl ring
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    dragCenterRef.current = { x: centerX, y: centerY };
    startAngleRef.current = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    startValueRef.current = apertureValue;
    setIsDragging(true);

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !interactive) return;

    const currentAngle = Math.atan2(
      e.clientY - dragCenterRef.current.y,
      e.clientX - dragCenterRef.current.x
    );

    let angleDelta = currentAngle - startAngleRef.current;
    // Normalize angular jump across -PI / +PI boundary
    if (angleDelta > Math.PI) angleDelta -= Math.PI * 2;
    if (angleDelta < -Math.PI) angleDelta += Math.PI * 2;

    // Full 180° rotation covers the entire aperture sweep
    const valueDelta = angleDelta / (Math.PI * 0.9);
    updateAperture(startValueRef.current + valueDelta);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore if already released
      }
    }
  };

  // Keyboard navigation for WCAG AA slider compliance
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      updateAperture(apertureValue + 0.05);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      updateAperture(apertureValue - 0.05);
    } else if (e.key === 'Home') {
      e.preventDefault();
      updateAperture(0.05);
    } else if (e.key === 'End') {
      e.preventDefault();
      updateAperture(1.0);
    }
  };

  // Unique ID for SVG definitions using stable React 19 useId hook
  const rawId = useId();
  const clipId = useMemo(
    () => `modui-iris-clip-${rawId.replace(/:/g, '')}`,
    [rawId]
  );

  return (
    <div
      className={`modui-aperture-wrap modui-aperture--${variant} ${compact ? 'modui-aperture--compact' : ''} ${className}`}
      style={style}
      role="slider"
      aria-label="Mechanical Lens Aperture Iris"
      aria-valuemin={0.05}
      aria-valuemax={1.0}
      aria-valuenow={parseFloat(apertureValue.toFixed(2))}
      aria-valuetext={currentFStop}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {/* Top Lens Barrel Metadata Badge */}
      {!compact && showRing && (
        <div className="modui-aperture-hud">
          <span className="modui-aperture-hud-item">MODUI OPTICS // {focalLength}</span>
          <span className="modui-aperture-hud-fstop">{currentFStop}</span>
        </div>
      )}

      {/* Main Circular Aperture Assembly */}
      <div
        className={`modui-aperture-barrel ${isDragging ? 'modui-aperture-barrel--dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Knurled Outer Tactile Grip Texture Ring */}
        {showRing && <div className="modui-aperture-knurl-ring" />}

        {/* SVG Iris Assembly */}
        <svg
          viewBox="0 0 320 320"
          className="modui-aperture-svg"
          aria-hidden="true"
        >
          <defs>
            {/* Dynamic Aperture Opening Polygon ClipPath */}
            <clipPath id={clipId}>
              <polygon points={aperturePolygonPoints} />
            </clipPath>

            {/* Subtle Metallic Linear Gradients for Blades */}
            <linearGradient id="blade-grad-light" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="45%" stopColor="#CBD5E1" />
              <stop offset="80%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>

            <linearGradient id="blade-grad-obsidian" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2D3748" />
              <stop offset="40%" stopColor="#1A202C" />
              <stop offset="85%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            <linearGradient id="blade-grad-brass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="35%" stopColor="#D97706" />
              <stop offset="75%" stopColor="#92400E" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>

            <linearGradient id="blade-grad-cyber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="50%" stopColor="#0F172A" />
              <stop offset="80%" stopColor="#082F49" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.4" />
            </linearGradient>

            {/* Blade Layering Drop Shadow */}
            <filter id="blade-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1.5" dy="1.5" stdDeviation="1.8" floodColor="rgba(0,0,0,0.45)" />
            </filter>
          </defs>

          {/* Machined Lens Barrel Base Plate */}
          <circle cx={cx} cy={cy} r={outerR + 24} className="modui-barrel-outer" />
          <circle cx={cx} cy={cy} r={outerR + 10} className="modui-barrel-middle" />
          <circle cx={cx} cy={cy} r={outerR} className="modui-barrel-inner" />

          {/* Calibrated Millimeter & Degree Radial Ticks */}
          {showRing &&
            Array.from({ length: 36 }).map((_, i) => {
              const angle = (i * 10 * Math.PI) / 180;
              const isMajor = i % 6 === 0;
              const tickR1 = outerR + (isMajor ? 14 : 17);
              const tickR2 = outerR + 22;
              return (
                <line
                  key={i}
                  x1={(cx + tickR1 * Math.cos(angle)).toFixed(2)}
                  y1={(cy + tickR1 * Math.sin(angle)).toFixed(2)}
                  x2={(cx + tickR2 * Math.cos(angle)).toFixed(2)}
                  y2={(cy + tickR2 * Math.sin(angle)).toFixed(2)}
                  className={`modui-barrel-tick ${isMajor ? 'modui-barrel-tick--major' : ''}`}
                />
              );
            })}

          {/* Under-Aperture Content Canvas / Subject Area */}
          <g clipPath={`url(#${clipId})`}>
            {/* Background Subject Canvas (Revealed Inside the Iris Opening) */}
            <rect
              x={cx - outerR}
              y={cy - outerR}
              width={outerR * 2}
              height={outerR * 2}
              className="modui-iris-aperture-bg"
            />
          </g>

          {/* Interlocking Iris Blades Layer */}
          <g className="modui-blades-group">
            {blades.map((b) => (
              <path
                key={b.id}
                d={b.path}
                className="modui-aperture-blade"
                filter="url(#blade-shadow)"
              />
            ))}
          </g>

          {/* Aperture Opening Inner Rim Accent Glow Ring */}
          <polygon
            points={aperturePolygonPoints}
            className="modui-aperture-opening-rim"
          />

          {/* Outer Lens Retention Bezel Ring */}
          <circle cx={cx} cy={cy} r={outerR} className="modui-barrel-bezel" />
        </svg>

        {/* Revealed HTML Content Placed Inside Iris Opening */}
        <div
          className="modui-aperture-reveal-container"
          style={{
            clipPath: `polygon(${aperturePolygonPoints
              .split(' ')
              .map((pt) => {
                const [x, y] = pt.split(',').map(Number);
                // Convert 320x320 SVG coords to percentages
                return `${((x / 320) * 100).toFixed(2)}% ${((y / 320) * 100).toFixed(2)}%`;
              })
              .join(', ')})`,
          }}
        >
          {revealContent || children ? (
            revealContent || children
          ) : (
            <div className="modui-aperture-default-subject">
              <div className="modui-subject-reticle" />
              <div className="modui-subject-core-pill">50mm F/1.4</div>
              <span className="modui-subject-caption">OPTICAL APERTURE</span>
            </div>
          )}
        </div>
      </div>

      {/* Clickable F-Stop Step Presets Bar */}
      {showFStops && (
        <div className="modui-fstop-selector" role="group" aria-label="Aperture F-Stops">
          {STANDARD_F_STOPS.map((stop) => {
            const isActive = currentFStop === stop.label;
            return (
              <button
                key={stop.label}
                type="button"
                className={`modui-fstop-btn ${isActive ? 'modui-fstop-btn--active' : ''}`}
                onClick={() => updateAperture(stop.value)}
                aria-pressed={isActive}
              >
                {stop.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
