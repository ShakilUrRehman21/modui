import React, { useState, useEffect, useRef, useCallback } from 'react';
import './FlipClockCountdown.css';

export type FlipClockVariant =
  | 'dark-monolith'
  | 'brass-vintage'
  | 'clean-porcelain'
  | 'cyber-terminal';

export type FlipClockSize = 'sm' | 'md' | 'lg';
export type FlipClockMode = 'countdown' | 'clock' | 'stopwatch';

export interface RemainingTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMilliseconds: number;
  isComplete: boolean;
}

export interface FlipClockLabels {
  days?: string;
  hours?: string;
  minutes?: string;
  seconds?: string;
}

export interface FlipClockCountdownProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Target date/time for countdown mode (Date object, ISO timestamp string, or milliseconds) */
  targetDate?: Date | string | number;
  /** Operating mode: countdown to targetDate, real-time clock, or upward stopwatch (default: 'countdown') */
  mode?: FlipClockMode;
  /** Visual theme finish (default: 'dark-monolith') */
  variant?: FlipClockVariant;
  /** Scale sizing preset (default: 'md') */
  size?: FlipClockSize;
  /** Whether to render days unit (default: true) */
  showDays?: boolean;
  /** Whether to render hours unit (default: true) */
  showHours?: boolean;
  /** Whether to render minutes unit (default: true) */
  showMinutes?: boolean;
  /** Whether to render seconds unit (default: true) */
  showSeconds?: boolean;
  /** Whether to render unit text labels beneath cards (default: true) */
  showLabels?: boolean;
  /** Custom label text for units (supports internationalization) */
  labels?: FlipClockLabels;
  /** Enable mechanical split-flap acoustics via native Web Audio API (default: false) */
  soundEnabled?: boolean;
  /** Callback fired on each 1-second interval tick */
  onTick?: (remaining: RemainingTime) => void;
  /** Callback fired when countdown reaches zero */
  onComplete?: () => void;
}

/**
 * Web Audio API synthesizer for mechanical split-flap acoustic clack.
 * Uses zero external audio files.
 */
function playMechanicalClack() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const t = ctx.currentTime;

    // 1. Low mechanical card slap (triangle oscillator decay)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.045);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);

    // 2. High snap transient of acrylic card impact
    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snapOsc.type = 'sine';
    snapOsc.frequency.setValueAtTime(920, t);
    snapOsc.frequency.exponentialRampToValueAtTime(180, t + 0.02);
    snapGain.gain.setValueAtTime(0.1, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    snapOsc.connect(snapGain);
    snapGain.connect(ctx.destination);
    snapOsc.start(t);
    snapOsc.stop(t + 0.025);

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 120);
  } catch {
    // Autoplay restrictions or headless test runners silently caught
  }
}

/**
 * Single 3D Split-Flap Card component.
 * Choreographs the 4-leaf mechanical rotation with perspective and drop shadows.
 */
interface FlipCardProps {
  value: string;
  soundEnabled?: boolean;
}

const FlipCard: React.FC<FlipCardProps> = ({ value, soundEnabled }) => {
  const [currentDisplay, setCurrentDisplay] = useState(value);
  const [previousDisplay, setPreviousDisplay] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value !== currentDisplay) {
      setPreviousDisplay(currentDisplay);
      setCurrentDisplay(value);
      setIsFlipping(true);

      if (soundEnabled) {
        playMechanicalClack();
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Flip animation completes in ~540ms
      timeoutRef.current = setTimeout(() => {
        setIsFlipping(false);
        setPreviousDisplay(value);
      }, 540);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, currentDisplay, soundEnabled]);

  return (
    <div
      className={`modui-flip-card-container ${
        isFlipping ? 'modui-flip-animating' : ''
      }`}
    >
      {/* 1. Upper Static Leaf (reveals new top value) */}
      <div className="modui-flip-leaf modui-flip-leaf-upper-static">
        <div className="modui-flip-leaf-content">{currentDisplay}</div>
      </div>

      {/* 2. Lower Static Leaf (shows old bottom value while top folds) */}
      <div className="modui-flip-leaf modui-flip-leaf-lower-static">
        <div className="modui-flip-leaf-content">{previousDisplay}</div>
      </div>

      {/* 3. Upper Flipping Flap (folds down 0deg -> -90deg) */}
      <div className="modui-flip-leaf modui-flip-leaf-upper-flap">
        <div className="modui-flip-leaf-content">{previousDisplay}</div>
        <div className="modui-flip-overlay-shadow" />
      </div>

      {/* 4. Lower Flipping Flap (folds down 90deg -> 0deg) */}
      <div className="modui-flip-leaf modui-flip-leaf-lower-flap">
        <div className="modui-flip-leaf-content">{currentDisplay}</div>
        <div className="modui-flip-overlay-shadow" />
      </div>

      {/* Mechanical Axle and Brass/Steel Hinge Pins */}
      <div className="modui-flip-divider-line" />
      <div className="modui-flip-hinge-pin modui-flip-hinge-pin-left" />
      <div className="modui-flip-hinge-pin modui-flip-hinge-pin-right" />
    </div>
  );
};

/**
 * ModUI FlipClockCountdown Primitive (#35)
 * 3D Mechanical Split-Flap Event Countdown & Precision Clock
 */
export function FlipClockCountdown({
  targetDate,
  mode = 'countdown',
  variant = 'dark-monolith',
  size = 'md',
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  showLabels = true,
  labels,
  soundEnabled = false,
  onTick,
  onComplete,
  className = '',
  style,
  ...rest
}: FlipClockCountdownProps) {
  // Parse target date or default to 4 days, 18 hours, 42 minutes, 19 seconds from mount
  const defaultTargetRef = useRef<number>(
    Date.now() + (4 * 86400 + 18 * 3600 + 42 * 60 + 19) * 1000
  );

  const parsedTargetTime = targetDate
    ? new Date(targetDate).getTime()
    : defaultTargetRef.current;

  // Stopwatch elapsed seconds reference
  const stopwatchSecondsRef = useRef<number>(0);

  const calculateState = useCallback((): RemainingTime => {
    const now = Date.now();

    if (mode === 'clock') {
      const d = new Date();
      return {
        days: 0,
        hours: d.getHours(),
        minutes: d.getMinutes(),
        seconds: d.getSeconds(),
        totalMilliseconds: 0,
        isComplete: false,
      };
    }

    if (mode === 'stopwatch') {
      const elapsed = stopwatchSecondsRef.current;
      const d = Math.floor(elapsed / 86400);
      const h = Math.floor((elapsed % 86400) / 3600);
      const m = Math.floor((elapsed % 3600) / 60);
      const s = elapsed % 60;
      return {
        days: d,
        hours: h,
        minutes: m,
        seconds: s,
        totalMilliseconds: elapsed * 1000,
        isComplete: false,
      };
    }

    // Countdown mode
    const diff = parsedTargetTime - now;
    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalMilliseconds: 0,
        isComplete: true,
      };
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      days: d,
      hours: h,
      minutes: m,
      seconds: s,
      totalMilliseconds: diff,
      isComplete: false,
    };
  }, [mode, parsedTargetTime]);

  const [time, setTime] = useState<RemainingTime>(calculateState);
  const completedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (mode === 'stopwatch') {
        stopwatchSecondsRef.current += 1;
      }

      const nextTime = calculateState();
      setTime(nextTime);
      onTick?.(nextTime);

      if (nextTime.isComplete && !completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateState, mode, onTick, onComplete]);

  // Formatted 2-digit strings
  const pad = (n: number) => n.toString().padStart(2, '0');
  const daysStr = pad(time.days);
  const hoursStr = pad(time.hours);
  const minutesStr = pad(time.minutes);
  const secondsStr = pad(time.seconds);

  const displayLabels = {
    days: labels?.days ?? 'Days',
    hours: labels?.hours ?? 'Hours',
    minutes: labels?.minutes ?? 'Minutes',
    seconds: labels?.seconds ?? 'Seconds',
  };

  const ariaText = `${mode === 'countdown' ? 'Countdown: ' : mode === 'clock' ? 'Current Time: ' : 'Stopwatch: '}${
    showDays ? `${daysStr} ${displayLabels.days}, ` : ''
  }${showHours ? `${hoursStr} ${displayLabels.hours}, ` : ''}${
    showMinutes ? `${minutesStr} ${displayLabels.minutes}, ` : ''
  }${showSeconds ? `${secondsStr} ${displayLabels.seconds}` : ''}`;

  return (
    <div
      role="timer"
      aria-label={ariaText}
      aria-live="polite"
      className={`modui-flip-clock-root modui-flip-variant-${variant} modui-flip-size-${size} ${className}`}
      style={style}
      {...rest}
    >
      {/* DAYS UNIT */}
      {showDays && mode !== 'clock' && (
        <>
          <div className="modui-flip-unit-group">
            <FlipCard value={daysStr} soundEnabled={soundEnabled} />
            {showLabels && (
              <span className="modui-flip-label">{displayLabels.days}</span>
            )}
          </div>
          {(showHours || showMinutes || showSeconds) && (
            <div className="modui-flip-colon-separator" aria-hidden="true">
              <div className="modui-flip-colon-dot" />
              <div className="modui-flip-colon-dot" />
            </div>
          )}
        </>
      )}

      {/* HOURS UNIT */}
      {showHours && (
        <>
          <div className="modui-flip-unit-group">
            <FlipCard value={hoursStr} soundEnabled={soundEnabled} />
            {showLabels && (
              <span className="modui-flip-label">{displayLabels.hours}</span>
            )}
          </div>
          {(showMinutes || showSeconds) && (
            <div className="modui-flip-colon-separator" aria-hidden="true">
              <div className="modui-flip-colon-dot" />
              <div className="modui-flip-colon-dot" />
            </div>
          )}
        </>
      )}

      {/* MINUTES UNIT */}
      {showMinutes && (
        <>
          <div className="modui-flip-unit-group">
            <FlipCard value={minutesStr} soundEnabled={soundEnabled} />
            {showLabels && (
              <span className="modui-flip-label">{displayLabels.minutes}</span>
            )}
          </div>
          {showSeconds && (
            <div className="modui-flip-colon-separator" aria-hidden="true">
              <div className="modui-flip-colon-dot" />
              <div className="modui-flip-colon-dot" />
            </div>
          )}
        </>
      )}

      {/* SECONDS UNIT */}
      {showSeconds && (
        <div className="modui-flip-unit-group">
          <FlipCard value={secondsStr} soundEnabled={soundEnabled} />
          {showLabels && (
            <span className="modui-flip-label">{displayLabels.seconds}</span>
          )}
        </div>
      )}
    </div>
  );
}

export default FlipClockCountdown;
