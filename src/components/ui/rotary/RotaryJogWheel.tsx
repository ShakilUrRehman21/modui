import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './RotaryJogWheel.css';

export type RotaryWheelVariant = 'metallic' | 'dark' | 'glass' | 'minimal';
export type RotaryWheelMode = 'continuous' | 'bounded' | 'bipolar';
export type RotaryDisplayFormat = 'degrees' | 'percent' | 'value' | 'timecode';

export interface RotaryJogWheelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSelect'> {
  /** Current controlled value */
  value?: number;
  /** Uncontrolled initial value */
  defaultValue?: number;
  /** Minimum value for bounded/bipolar mode (default: 0) */
  min?: number;
  /** Maximum value for bounded/bipolar mode (default: 100) */
  max?: number;
  /** Step increment for snapping and keyboard navigation (default: 1) */
  step?: number;
  /** Interaction mode: continuous (infinite 360°), bounded (min/max), or bipolar (-max to +max) */
  mode?: RotaryWheelMode;
  /** Visual theme aesthetic */
  variant?: RotaryWheelVariant;
  /** Preset size or explicit pixel diameter */
  size?: 'sm' | 'md' | 'lg' | number;
  /** Whether to snap rotation to discrete step detents */
  snapping?: boolean;
  /** Enable rotational momentum with friction upon release */
  inertia?: boolean;
  /** Inertia deceleration friction (0.80 - 0.98, default: 0.92) */
  friction?: number;
  /** Synthesize acoustic micro-haptic clicks upon passing detents */
  soundEnabled?: boolean;
  /** Sensitivity multiplier for wheel and touch drag (default: 1) */
  sensitivity?: number;
  /** Number of tick notches displayed around perimeter (default: 36) */
  ticksCount?: number;
  /** Preset format for the center readout */
  displayFormat?: RotaryDisplayFormat;
  /** Custom formatter function for value display */
  formatValue?: (val: number) => string;
  /** Text label above the wheel */
  label?: string;
  /** Subtitle or parameter name below the wheel */
  sublabel?: string;
  /** Whether to render the laser-etched circumference ticks */
  showTicks?: boolean;
  /** Whether to render the active illuminated arc track */
  showArc?: boolean;
  /** Whether the jog wheel is disabled */
  disabled?: boolean;
  /** Real-time change callback firing during rotation */
  onChange?: (val: number, angleDeg: number) => void;
  /** Callback firing when rotation stops */
  onChangeEnd?: (val: number, angleDeg: number) => void;
  /** Callback when the center button is tapped */
  onCenterClick?: () => void;
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

// Lightweight synthesized acoustic micro-tick for hardware detents
const playRotaryDetentClick = (pitch = 880, speed = 1) => {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const clampedSpeed = Math.min(Math.max(speed, 0.6), 2.4);
    const targetFreq = pitch * clampedSpeed;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(targetFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.022);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.022);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.025);
  } catch {
    // Audio context may be restricted before user gesture
  }
};

// Formats seconds into MM:SS:FF timecode
const formatAsTimecode = (val: number): string => {
  const totalFrames = Math.floor(Math.abs(val) * 24);
  const frames = totalFrames % 24;
  const totalSecs = Math.floor(Math.abs(val));
  const secs = totalSecs % 60;
  const mins = Math.floor(totalSecs / 60);
  const sign = val < 0 ? '-' : '';
  return `${sign}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
};

export const RotaryJogWheel: React.FC<RotaryJogWheelProps> = ({
  value: controlledValue,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  mode = 'bounded',
  variant = 'metallic',
  size = 'md',
  snapping = false,
  inertia = true,
  friction = 0.92,
  soundEnabled = true,
  sensitivity = 1,
  ticksCount = 36,
  displayFormat = 'value',
  formatValue,
  label,
  sublabel,
  showTicks = true,
  showArc = true,
  disabled = false,
  onChange,
  onChangeEnd,
  onCenterClick,
  className = '',
  style,
  ...rest
}) => {
  // Resolve numeric diameter
  const diameter = useMemo(() => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'sm':
        return 148;
      case 'lg':
        return 248;
      case 'md':
      default:
        return 196;
    }
  }, [size]);

  // Initial internal value
  const initialVal = defaultValue !== undefined ? defaultValue : (mode === 'bipolar' ? 0 : min);
  const [internalValue, setInternalValue] = useState<number>(initialVal);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // Internal angle tracking (in degrees, can exceed 360 in continuous mode)
  const angleFromValue = useCallback((val: number) => {
    if (mode === 'continuous') {
      return val * (360 / (step * 36));
    }
    const range = max - min;
    if (range <= 0) return 0;
    const progress = (val - min) / range;
    return progress * 300 - 150; // -150° to +150° arc
  }, [mode, min, max, step]);

  const valueFromAngle = useCallback((deg: number) => {
    if (mode === 'continuous') {
      const raw = deg / (360 / (step * 36));
      return Math.round(raw / step) * step;
    }
    // Arc is 300° total (-150° to +150°)
    const clampedDeg = Math.min(Math.max(deg, -150), 150);
    const progress = (clampedDeg + 150) / 300;
    const rawVal = min + progress * (max - min);
    const stepped = Math.round(rawVal / step) * step;
    return Math.min(Math.max(stepped, min), max);
  }, [mode, min, max, step]);

  const [angle, setAngle] = useState<number>(() => angleFromValue(initialVal));
  const [isInteracting, setIsInteracting] = useState(false);
  const [indicatorPulse, setIndicatorPulse] = useState(false);

  // Synchronize angle when controlled value changes externally
  useEffect(() => {
    if (isControlled && !isInteracting) {
      setAngle(angleFromValue(controlledValue));
    }
  }, [controlledValue, isControlled, isInteracting, angleFromValue]);

  const wheelRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastPointerAngleRef = useRef(0);
  const accumulatedAngleRef = useRef(angle);

  useEffect(() => {
    accumulatedAngleRef.current = angle;
  }, [angle]);

  // Inertia & velocity tracking
  const velocityRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const lastDetentIndexRef = useRef<number>(Math.floor(angle / (360 / ticksCount)));

  // Report value change
  const reportChange = useCallback((nextVal: number, nextAngle: number) => {
    if (!isControlled) {
      setInternalValue(nextVal);
    }
    onChange?.(nextVal, nextAngle);
  }, [isControlled, onChange]);

  // Handle acoustic click triggering on detent crossing
  const checkDetentTick = useCallback((deg: number, velocityMag: number) => {
    if (!soundEnabled) return;
    const detentAngle = 360 / ticksCount;
    const currentDetent = Math.floor(deg / detentAngle);
    if (currentDetent !== lastDetentIndexRef.current) {
      lastDetentIndexRef.current = currentDetent;
      playRotaryDetentClick(880, Math.max(1, velocityMag * 0.05));
    }
  }, [soundEnabled, ticksCount]);

  // Cancel any ongoing momentum animation
  const stopMomentum = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  // Compute angle between wheel center and pointer event
  const getPointerAngle = (clientX: number, clientY: number): number => {
    if (!wheelRef.current) return 0;
    const rect = wheelRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rad = Math.atan2(clientY - cy, clientX - cx);
    let deg = (rad * 180) / Math.PI;
    // Normalize: right is 0°, bottom is 90°, top is -90° / 270°
    return deg;
  };

  // Pointer Down (Mouse / Touch / Pen)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    // Only capture primary button
    if (e.button !== 0) return;

    stopMomentum();
    isDraggingRef.current = true;
    setIsInteracting(true);
    wheelRef.current?.setPointerCapture(e.pointerId);

    const startAngle = getPointerAngle(e.clientX, e.clientY);
    lastPointerAngleRef.current = startAngle;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  // Pointer Move (Circular scrubbing)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || disabled) return;

    const currentPointerAngle = getPointerAngle(e.clientX, e.clientY);
    let delta = currentPointerAngle - lastPointerAngleRef.current;

    // Handle crossing -180° / 180° seam
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    const scaledDelta = delta * sensitivity;
    const now = performance.now();
    const dt = Math.max(now - lastTimeRef.current, 1);

    velocityRef.current = (scaledDelta / dt) * 16.6; // normalized to ~60fps
    lastTimeRef.current = now;
    lastPointerAngleRef.current = currentPointerAngle;

    let nextAngle = accumulatedAngleRef.current + scaledDelta;

    if (mode !== 'continuous') {
      nextAngle = Math.min(Math.max(nextAngle, -150), 150);
    }

    if (snapping) {
      const notchDeg = 360 / ticksCount;
      nextAngle = Math.round(nextAngle / notchDeg) * notchDeg;
    }

    setAngle(nextAngle);
    checkDetentTick(nextAngle, Math.abs(velocityRef.current));

    const nextVal = valueFromAngle(nextAngle);
    reportChange(nextVal, nextAngle);
  };

  // Pointer Up / Cancel (Initiate momentum or snap)
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    wheelRef.current?.releasePointerCapture(e.pointerId);

    const finalAngle = accumulatedAngleRef.current;
    const finalVal = valueFromAngle(finalAngle);

    // Run momentum animation if inertia is enabled and velocity is significant
    if (inertia && Math.abs(velocityRef.current) > 0.8 && mode === 'continuous') {
      let vel = velocityRef.current;
      const stepDeceleration = () => {
        vel *= friction;
        if (Math.abs(vel) < 0.05) {
          setIsInteracting(false);
          onChangeEnd?.(valueFromAngle(accumulatedAngleRef.current), accumulatedAngleRef.current);
          return;
        }

        const nextA = accumulatedAngleRef.current + vel;
        setAngle(nextA);
        checkDetentTick(nextA, Math.abs(vel));
        reportChange(valueFromAngle(nextA), nextA);

        animFrameRef.current = requestAnimationFrame(stepDeceleration);
      };
      animFrameRef.current = requestAnimationFrame(stepDeceleration);
    } else {
      setIsInteracting(false);
      onChangeEnd?.(finalVal, finalAngle);
    }
  };

  // Wheel scrubbing support (trackpad / mouse scroll)
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    stopMomentum();

    const wheelDelta = (e.deltaY || e.deltaX) * 0.15 * sensitivity;
    let nextAngle = accumulatedAngleRef.current + wheelDelta;

    if (mode !== 'continuous') {
      nextAngle = Math.min(Math.max(nextAngle, -150), 150);
    }

    if (snapping) {
      const notchDeg = 360 / ticksCount;
      nextAngle = Math.round(nextAngle / notchDeg) * notchDeg;
    }

    setAngle(nextAngle);
    checkDetentTick(nextAngle, 2);

    const nextVal = valueFromAngle(nextAngle);
    reportChange(nextVal, nextAngle);
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    stopMomentum();

    let handled = false;
    let delta = 0;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        delta = step;
        handled = true;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        delta = -step;
        handled = true;
        break;
      case 'PageUp':
        delta = step * 10;
        handled = true;
        break;
      case 'PageDown':
        delta = -step * 10;
        handled = true;
        break;
      case 'Home':
        if (mode !== 'continuous') {
          const target = mode === 'bipolar' ? 0 : min;
          const targetAngle = angleFromValue(target);
          setAngle(targetAngle);
          reportChange(target, targetAngle);
          checkDetentTick(targetAngle, 3);
          handled = true;
        }
        break;
      case 'End':
        if (mode !== 'continuous') {
          const target = max;
          const targetAngle = angleFromValue(target);
          setAngle(targetAngle);
          reportChange(target, targetAngle);
          checkDetentTick(targetAngle, 3);
          handled = true;
        }
        break;
      case 'Enter':
      case ' ':
        handleCenterTrigger();
        handled = true;
        break;
    }

    if (handled && delta !== 0) {
      e.preventDefault();
      const current = valueFromAngle(accumulatedAngleRef.current);
      let nextVal = current + delta;
      if (mode !== 'continuous') {
        nextVal = Math.min(Math.max(nextVal, min), max);
      }
      const nextAngle = angleFromValue(nextVal);
      setAngle(nextAngle);
      checkDetentTick(nextAngle, 2);
      reportChange(nextVal, nextAngle);
      onChangeEnd?.(nextVal, nextAngle);
    }
  };

  // Center button / tap trigger
  const handleCenterTrigger = () => {
    if (disabled) return;
    setIndicatorPulse(true);
    setTimeout(() => setIndicatorPulse(false), 300);

    if (soundEnabled) {
      playRotaryDetentClick(1150, 1.2);
    }

    if (onCenterClick) {
      onCenterClick();
    } else {
      // Default behavior: reset to zero / min
      const resetVal = mode === 'bipolar' ? 0 : min;
      const resetAngle = angleFromValue(resetVal);
      setAngle(resetAngle);
      reportChange(resetVal, resetAngle);
      onChangeEnd?.(resetVal, resetAngle);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Formatted display string for central readout
  const displayString = useMemo(() => {
    if (formatValue) return formatValue(currentValue);
    switch (displayFormat) {
      case 'degrees': {
        const normDeg = Math.round(((angle % 360) + 360) % 360);
        return `${normDeg}°`;
      }
      case 'percent': {
        const range = max - min;
        const pct = range > 0 ? Math.round(((currentValue - min) / range) * 100) : 0;
        return `${pct}%`;
      }
      case 'timecode':
        return formatAsTimecode(currentValue);
      case 'value':
      default:
        return Number.isInteger(currentValue) ? `${currentValue}` : currentValue.toFixed(1);
    }
  }, [currentValue, angle, displayFormat, formatValue, min, max]);

  // Generate SVG tick marks around the perimeter
  const tickMarks = useMemo(() => {
    if (!showTicks) return null;
    const ticks = [];
    const radius = diameter / 2 - 8;
    const cx = diameter / 2;
    const cy = diameter / 2;

    for (let i = 0; i < ticksCount; i++) {
      const tickDeg = (i * 360) / ticksCount - 90;
      const rad = (tickDeg * Math.PI) / 180;
      const isMajor = i % 4 === 0;
      const len = isMajor ? 7 : 4;

      const x1 = cx + (radius - len) * Math.cos(rad);
      const y1 = cy + (radius - len) * Math.sin(rad);
      const x2 = cx + radius * Math.cos(rad);
      const y2 = cy + radius * Math.sin(rad);

      ticks.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          className={`modui-rotary-tick ${isMajor ? 'modui-rotary-tick--major' : ''}`}
        />
      );
    }
    return ticks;
  }, [showTicks, ticksCount, diameter]);

  // Compute active arc stroke-dasharray and stroke-dashoffset for bounded mode
  const arcStrokeData = useMemo(() => {
    if (!showArc || mode === 'continuous') return null;
    const arcRadius = diameter / 2 - 14;
    const totalArcAngle = 300; // degrees
    const totalCircumference = 2 * Math.PI * arcRadius;
    const arcLength = (totalArcAngle / 360) * totalCircumference;

    // Progress from 0 to 1
    const progress = Math.min(Math.max((angle + 150) / 300, 0), 1);
    const activeLength = progress * arcLength;

    return {
      radius: arcRadius,
      circumference: totalCircumference,
      arcLength,
      activeLength,
      dashOffset: totalCircumference - activeLength,
    };
  }, [showArc, mode, angle, diameter]);

  return (
    <div
      className={`modui-rotary-wrapper modui-rotary--${variant} ${disabled ? 'modui-rotary--disabled' : ''} ${className}`}
      style={{ width: diameter, ...style }}
      {...rest}
    >
      {/* Optional Top Header Label */}
      {label && (
        <div className="modui-rotary-header">
          <span className="modui-rotary-label">{label}</span>
        </div>
      )}

      {/* Main Wheel Shell */}
      <div
        ref={wheelRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label || 'Rotary Jog Wheel'}
        aria-valuenow={currentValue}
        aria-valuemin={mode !== 'continuous' ? min : undefined}
        aria-valuemax={mode !== 'continuous' ? max : undefined}
        aria-valuetext={displayString}
        aria-disabled={disabled}
        className={`modui-rotary-disc ${isInteracting ? 'modui-rotary-disc--active' : ''}`}
        style={{
          width: diameter,
          height: diameter,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
      >
        {/* SVG Perimeter Track (Ticks + Progress Arc) */}
        <svg
          className="modui-rotary-svg-track"
          width={diameter}
          height={diameter}
          viewBox={`0 0 ${diameter} ${diameter}`}
          aria-hidden="true"
        >
          {/* Ticks ring */}
          {tickMarks}

          {/* Background Arc Track for bounded mode */}
          {arcStrokeData && (
            <>
              <circle
                cx={diameter / 2}
                cy={diameter / 2}
                r={arcStrokeData.radius}
                className="modui-rotary-arc-bg"
                style={{
                  strokeDasharray: `${arcStrokeData.arcLength} ${arcStrokeData.circumference}`,
                  transform: `rotate(120deg)`,
                  transformOrigin: '50% 50%',
                }}
              />
              <circle
                cx={diameter / 2}
                cy={diameter / 2}
                r={arcStrokeData.radius}
                className="modui-rotary-arc-active"
                style={{
                  strokeDasharray: `${arcStrokeData.activeLength} ${arcStrokeData.circumference}`,
                  transform: `rotate(120deg)`,
                  transformOrigin: '50% 50%',
                }}
              />
            </>
          )}
        </svg>

        {/* Rotating Machined Rotor Body */}
        <div
          className="modui-rotary-rotor"
          style={{
            transform: `rotate(${angle}deg)`,
          }}
          aria-hidden="true"
        >
          {/* Conic Machined Metal Texture */}
          <div className="modui-rotary-conic-surface" />

          {/* Radial indicator tick/needle */}
          <div className="modui-rotary-needle-wrapper">
            <div className="modui-rotary-needle" />
            <div className="modui-rotary-needle-glow" />
          </div>

          {/* Tactile finger indentation dimple */}
          <div className="modui-rotary-dimple">
            <div className="modui-rotary-dimple-inner" />
          </div>
        </div>

        {/* Center Static Cap (Digital Readout + Action Trigger) */}
        <button
          type="button"
          tabIndex={-1}
          className={`modui-rotary-center-cap ${indicatorPulse ? 'modui-rotary-center-cap--pulse' : ''}`}
          onClick={handleCenterTrigger}
          title={onCenterClick ? 'Activate trigger' : 'Reset to default'}
          aria-label={onCenterClick ? 'Center control button' : 'Reset value'}
        >
          {/* Center LED Activity Indicator */}
          <span className={`modui-rotary-center-led ${isInteracting ? 'modui-rotary-center-led--active' : ''}`} />

          {/* Digital Readout */}
          <span className="modui-rotary-readout-value">{displayString}</span>

          {/* Optional Mode or Unit subtitle */}
          <span className="modui-rotary-readout-unit">
            {mode === 'continuous' ? 'SCRUB' : mode === 'bipolar' ? 'BAL' : sublabel || 'DETENT'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default RotaryJogWheel;
