import React, { useState, useRef, useCallback } from 'react';
import './BeforeAfterSlider.css';

export type SliderOrientation = 'horizontal' | 'vertical';
export type SliderInteraction = 'drag' | 'hover' | 'both';
export type SliderVariant = 'light' | 'dark' | 'glass' | 'minimal';

export interface BeforeAfterSliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Source URL for the before image (shown on the left/top) */
  beforeImage?: string;
  /** Source URL for the after image (shown on the right/bottom) */
  afterImage?: string;
  /** Custom before content node (e.g., wireframe or code block) */
  beforeNode?: React.ReactNode;
  /** Custom after content node (e.g., rendered UI or color graded view) */
  afterNode?: React.ReactNode;
  /** Label badge for the before side */
  beforeLabel?: string;
  /** Label badge for the after side */
  afterLabel?: string;
  /** Split orientation axis */
  orientation?: SliderOrientation;
  /** Trigger interaction model */
  mode?: SliderInteraction;
  /** Visual surface design token */
  variant?: SliderVariant;
  /** Initial divider position percentage (0-100, default: 50) */
  initialPosition?: number;
  /** Controlled divider position percentage (0-100) */
  position?: number;
  /** Callback fired as the position changes */
  onPositionChange?: (pos: number) => void;
  /** Whether to show the floating Before / After badge tags */
  showLabels?: boolean;
  /** Synthesize subtle acoustic micro-haptic clicks when passing center */
  soundEnabled?: boolean;
  /** Aspect ratio or card height */
  aspectRatio?: string;
  /** Border radius of the slider container */
  borderRadius?: string;
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

// Lightweight synthesized acoustic micro-tick for divider center snap
const playDividerHaptic = (freq: number = 520, duration: number = 0.03) => {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore autoplay limits
  }
};

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeNode,
  afterNode,
  beforeLabel = 'Before',
  afterLabel = 'After',
  orientation = 'horizontal',
  mode = 'drag',
  variant = 'light',
  initialPosition = 50,
  position: controlledPosition,
  onPositionChange,
  showLabels = true,
  soundEnabled = true,
  aspectRatio = '16 / 10',
  borderRadius,
  className = '',
  style,
  ...rest
}) => {
  const isControlled = controlledPosition !== undefined;
  const [internalPos, setInternalPos] = useState(initialPosition);
  const currentPos = Math.max(0, Math.min(100, isControlled ? controlledPosition : internalPos));

  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevPosRef = useRef(currentPos);

  const updatePosition = useCallback(
    (newPos: number) => {
      const clamped = Math.max(0, Math.min(100, Math.round(newPos * 10) / 10));

      // Trigger micro-haptic when crossing the exact 50% midpoint
      if (soundEnabled) {
        const crossedCenter = (prevPosRef.current < 50 && clamped >= 50) || (prevPosRef.current > 50 && clamped <= 50);
        if (crossedCenter) {
          playDividerHaptic(640, 0.025);
        }
      }
      prevPosRef.current = clamped;

      if (!isControlled) {
        setInternalPos(clamped);
      }
      onPositionChange?.(clamped);
    },
    [isControlled, onPositionChange, soundEnabled]
  );

  const calculatePositionFromCoords = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();

      let pct = 50;
      if (orientation === 'horizontal') {
        const offset = clientX - rect.left;
        pct = (offset / rect.width) * 100;
      } else {
        const offset = clientY - rect.top;
        pct = (offset / rect.height) * 100;
      }
      updatePosition(pct);
    },
    [orientation, updatePosition]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if not supported
    }
    calculatePositionFromCoords(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (mode === 'hover') {
      calculatePositionFromCoords(e.clientX, e.clientY);
    } else if (isDragging || mode === 'both') {
      calculatePositionFromCoords(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }
    setIsDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (orientation === 'horizontal') {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        updatePosition(currentPos - step);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        updatePosition(currentPos + step);
      }
    } else {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        updatePosition(currentPos - step);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        updatePosition(currentPos + step);
      }
    }

    if (e.key === 'Home') {
      e.preventDefault();
      updatePosition(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      updatePosition(100);
    }
  };

  // Default artistic SVG demonstration scenes when external images are omitted
  const renderDefaultBefore = () => (
    <div className="modui-slider-default-scene modui-slider-default-before">
      <div className="modui-slider-grid-lines" />
      <div className="modui-slider-blueprint-box">
        <div className="modui-slider-blueprint-circle" />
        <div className="modui-slider-blueprint-vector" />
      </div>
      <div className="modui-slider-scene-tag modui-slider-scene-tag--before">
        <span>RAW_WIREFRAME</span>
        <span className="modui-slider-scene-sub">INPUT MESH</span>
      </div>
    </div>
  );

  const renderDefaultAfter = () => (
    <div className="modui-slider-default-scene modui-slider-default-after">
      <div className="modui-slider-volumetric-orb" />
      <div className="modui-slider-rendered-box">
        <div className="modui-slider-caustic-beam" />
      </div>
      <div className="modui-slider-scene-tag modui-slider-scene-tag--after">
        <span>SPECTRAL_RENDER</span>
        <span className="modui-slider-scene-sub">VOLUMETRIC 3D</span>
      </div>
    </div>
  );

  // Clip path calculation based on orientation and split position
  const clipPathStyle =
    orientation === 'horizontal'
      ? `polygon(0% 0%, ${currentPos}% 0%, ${currentPos}% 100%, 0% 100%)`
      : `polygon(0% 0%, 100% 0%, 100% ${currentPos}%, 0% ${currentPos}%)`;

  return (
    <div
      ref={containerRef}
      className={`modui-compare-slider modui-compare-slider--${orientation} modui-compare-slider--${variant} ${isDragging ? 'modui-compare-slider--dragging' : ''} ${className}`}
      style={{
        aspectRatio,
        borderRadius,
        ...style,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-label="Comparison slider"
      aria-valuenow={Math.round(currentPos)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${beforeLabel} ${Math.round(currentPos)}%, ${afterLabel} ${100 - Math.round(currentPos)}%`}
      {...rest}
    >
      {/* Underlying "After" Layer (Base layer, visible on right/bottom) */}
      <div className="modui-slider-layer modui-slider-layer--after" aria-hidden="true">
        {afterNode ? (
          afterNode
        ) : afterImage ? (
          <img src={afterImage} alt={afterLabel} className="modui-slider-img" draggable={false} />
        ) : (
          renderDefaultAfter()
        )}
      </div>

      {/* Top "Before" Layer (Clipped layer, visible on left/top) */}
      <div
        className="modui-slider-layer modui-slider-layer--before"
        style={{ clipPath: clipPathStyle, WebkitClipPath: clipPathStyle }}
        aria-hidden="true"
      >
        {beforeNode ? (
          beforeNode
        ) : beforeImage ? (
          <img src={beforeImage} alt={beforeLabel} className="modui-slider-img" draggable={false} />
        ) : (
          renderDefaultBefore()
        )}
      </div>

      {/* Floating Tactical Badges */}
      {showLabels && (
        <>
          <div
            className="modui-slider-badge modui-slider-badge--before"
            style={{ opacity: currentPos < 12 ? 0.2 : 1 }}
          >
            <span className="modui-slider-badge-dot" />
            <span>{beforeLabel}</span>
          </div>

          <div
            className="modui-slider-badge modui-slider-badge--after"
            style={{ opacity: currentPos > 88 ? 0.2 : 1 }}
          >
            <span>{afterLabel}</span>
            <span className="modui-slider-badge-dot modui-slider-badge-dot--accent" />
          </div>
        </>
      )}

      {/* Dynamic Divider Line & Tactile Handle */}
      <div
        className="modui-slider-divider"
        style={{
          [orientation === 'horizontal' ? 'left' : 'top']: `${currentPos}%`,
        }}
        aria-hidden="true"
      >
        {/* Glow Line */}
        <div className="modui-slider-divider-line" />

        {/* Center Knurled Tactile Handle Grip */}
        <div className="modui-slider-handle">
          <div className="modui-slider-handle-inner">
            {orientation === 'horizontal' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 7L3 12L8 17" />
                <path d="M16 7L21 12L16 17" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 8L12 3L17 8" />
                <path d="M7 16L12 21L17 16" />
              </svg>
            )}
          </div>

          {/* Ambient Specular Halo */}
          <div className="modui-slider-handle-halo" />
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
