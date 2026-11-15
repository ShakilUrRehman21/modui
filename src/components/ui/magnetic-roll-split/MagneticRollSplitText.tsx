import React, { useState, useEffect, useRef, useId, useCallback, useMemo } from 'react';
import './MagneticRollSplitText.css';

export type SplitRollVariant =
  | 'studio-light'
  | 'editorial-dark'
  | 'solenoid-amber'
  | 'cyber-cobalt';

export type SplitRollChoreography = 'wave' | 'center-out' | 'cascade' | 'random';

export interface MagneticRollSplitTextProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Target text or array of phrases to cycle through */
  text: string | string[];
  /** Visual finish variant */
  variant?: SplitRollVariant;
  /** Explicit light/dark theme override */
  theme?: 'light' | 'dark';
  /** Stagger choreography mode */
  choreography?: SplitRollChoreography;
  /** Delay between characters in milliseconds (default: 35) */
  stagger?: number;
  /** Animation duration of drum tumble in ms (default: 480) */
  speed?: number;
  /** Roll direction */
  direction?: 'up' | 'down';
  /** Event trigger mode: 'hover' | 'click' | 'auto' | 'manual' */
  trigger?: 'hover' | 'click' | 'auto' | 'manual';
  /** Enable zero-asset synthesized mechanical Web Audio haptics */
  soundEnabled?: boolean;
  /** Automatically trigger roll on initial mount */
  autoStart?: boolean;
  /** Compact sizing for catalog card previews */
  compact?: boolean;
  /** Callback fired when all character drums complete tumble */
  onRollComplete?: (activeText: string) => void;
  /** Expose imperative roll trigger function */
  onRollRef?: (triggerFn: () => void) => void;
}

/* ====================================================================
   Zero-Asset Web Audio Synthesizer (Mechanical Solenoid Departure Clicks)
   ==================================================================== */
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtx && AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

function playSolenoidClick(baseFreq = 620, pitchRandom = 0.15) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const freqOffset = (Math.random() - 0.5) * 2 * (baseFreq * pitchRandom);
    const freq = Math.max(120, baseFreq + freqOffset);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.028);

    gain.gain.setValueAtTime(0.045, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.028);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.028);
  } catch {
    // Audio gracefully silences if context blocked
  }
}

export function MagneticRollSplitText({
  text,
  variant = 'studio-light',
  theme,
  choreography = 'wave',
  stagger = 35,
  speed = 480,
  direction = 'up',
  trigger = 'hover',
  soundEnabled = true,
  autoStart = false,
  compact = false,
  onRollComplete,
  onRollRef,
  className = '',
  style,
  ...rest
}: MagneticRollSplitTextProps) {
  const containerId = useId();

  // Normalize phrases
  const phrases = useMemo(() => {
    if (Array.isArray(text)) {
      return text.length > 0 ? text : ['MODUI'];
    }
    return [text || 'MODUI'];
  }, [text]);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const currentPhrase = phrases[phraseIndex] || '';

  // Characters split with word wrapping boundaries
  const words = useMemo(() => {
    return currentPhrase.split(' ').map((word) => word.split(''));
  }, [currentPhrase]);

  const totalChars = useMemo(() => {
    return words.reduce((acc, word) => acc + word.length, 0);
  }, [words]);

  // Track flip states per character index
  const [isRolled, setIsRolled] = useState(false);
  const [activeRolls, setActiveRolls] = useState<boolean[]>(() =>
    new Array(totalChars).fill(false)
  );

  const timersRef = useRef<number[]>([]);
  const isAnimatingRef = useRef(false);

  // Clear timers on unmount
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  // Calculate stagger delay based on choreography
  const getCharDelay = useCallback(
    (charIdx: number, total: number) => {
      switch (choreography) {
        case 'center-out': {
          const center = (total - 1) / 2;
          const dist = Math.abs(charIdx - center);
          return dist * stagger;
        }
        case 'cascade': {
          const norm = charIdx / Math.max(1, total - 1);
          return Math.pow(norm, 1.8) * (total * stagger);
        }
        case 'random': {
          return Math.random() * (total * stagger * 0.85);
        }
        case 'wave':
        default:
          return charIdx * stagger;
      }
    },
    [choreography, stagger]
  );

  // Core trigger roll transition
  const triggerRoll = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    clearAllTimers();

    const nextRolledState = !isRolled;
    setIsRolled(nextRolledState);

    let completedCount = 0;

    for (let i = 0; i < totalChars; i++) {
      const delay = getCharDelay(i, totalChars);
      const timer = window.setTimeout(() => {
        setActiveRolls((prev) => {
          const next = [...prev];
          next[i] = nextRolledState;
          return next;
        });

        if (soundEnabled) {
          playSolenoidClick(600 + (i % 6) * 45);
        }

        completedCount++;
        if (completedCount === totalChars) {
          // If phrases array has multiple, advance on next complete
          window.setTimeout(() => {
            isAnimatingRef.current = false;
            if (phrases.length > 1 && nextRolledState) {
              setPhraseIndex((prev) => (prev + 1) % phrases.length);
            }
            onRollComplete?.(currentPhrase);
          }, speed * 0.5);
        }
      }, delay);

      timersRef.current.push(timer);
    }
  }, [
    isRolled,
    totalChars,
    getCharDelay,
    soundEnabled,
    phrases.length,
    speed,
    currentPhrase,
    onRollComplete,
    clearAllTimers,
  ]);

  // Imperative ref exposing trigger
  useEffect(() => {
    if (onRollRef) {
      onRollRef(triggerRoll);
    }
  }, [onRollRef, triggerRoll]);

  // Auto-start if requested
  useEffect(() => {
    if (autoStart) {
      const autoTimer = window.setTimeout(() => {
        triggerRoll();
      }, 250);
      return () => window.clearTimeout(autoTimer);
    }
  }, [autoStart, triggerRoll]);

  // Interactive event handlers
  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      triggerRoll();
    }
  };

  const handleClick = () => {
    if (trigger === 'click' || trigger === 'hover') {
      triggerRoll();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerRoll();
    }
  };

  let globalCharCounter = 0;

  return (
    <div
      id={containerId}
      className={`modui-split-roll-root modui-split--${variant} ${compact ? 'modui-split--compact' : ''} ${className}`}
      style={
        {
          ...style,
          '--sr-drum-duration': `${speed}ms`,
        } as React.CSSProperties
      }
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label={`Split-roll typography: ${currentPhrase}`}
      tabIndex={0}
      data-theme={theme}
      {...rest}
    >
      {/* Accessible screen reader announcement */}
      <span className="modui-split-sr-text">{currentPhrase}</span>

      {/* Visual Split-Flap 3D Tumbling Phrase */}
      <div className="modui-split-phrase" aria-hidden="true">
        {words.map((wordChars, wordIdx) => (
          <span key={`word-${wordIdx}`} className="modui-split-word">
            {wordChars.map((char, charInWordIdx) => {
              const charIdx = globalCharCounter++;
              const charIsRolled = activeRolls[charIdx] ?? false;

              return (
                <span key={`char-${charIdx}-${charInWordIdx}`} className="modui-split-cell">
                  {/* Sizer provides natural proportional width & height */}
                  <span className="modui-split-sizer">{char}</span>

                  {/* 3D Tumbling Drum Overlay */}
                  <span
                    className={`modui-split-drum modui-split-drum--${direction} ${
                      charIsRolled ? 'is-rolled' : ''
                    }`}
                  >
                    <span className="modui-split-face modui-split-face--primary">{char}</span>
                    <span className="modui-split-face modui-split-face--duplicate">{char}</span>
                  </span>
                </span>
              );
            })}
          </span>
        ))}
      </div>
    </div>
  );
}

export default MagneticRollSplitText;
