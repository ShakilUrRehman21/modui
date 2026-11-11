import React, { useEffect, useRef, useState, useCallback, useId } from 'react';
import './CipherGlyphMatrix.css';

export type CipherCharset = 'katakana' | 'hex' | 'binary' | 'runic' | 'alphanumeric';
export type CipherChoreography = 'wave' | 'center-out' | 'random-dissolve' | 'cursor-proximity';
export type CipherVariant = 'matrix-emerald' | 'cyber-cyan' | 'violet-plasma' | 'amber-phosphor';
export type CipherTheme = 'auto' | 'light' | 'dark';

export interface CipherGlyphMatrixProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Target text string or array of phrases to cycle through */
  text: string | string[];
  /** Cryptographic character set preset or custom string of glyphs */
  charset?: CipherCharset | string;
  /** Wavefront decoding algorithm */
  choreography?: CipherChoreography;
  /** Visual color theme variant */
  variant?: CipherVariant;
  /** Color theme mode ('auto' synchronizes with document data-theme, or explicit 'light' / 'dark') */
  theme?: CipherTheme;
  /** Tick interval in milliseconds (default: 38ms) */
  speed?: number;
  /** Number of scrambling flips per character before settling (default: 3) */
  iterations?: number;
  /** Automatically trigger cipher scramble on mount (default: true) */
  autoStart?: boolean;
  /** Trigger cipher scramble when mouse hovers over text (default: true) */
  scrambleOnHover?: boolean;
  /** Synthesize mechanical micro-ticks and chime via Web Audio DSP */
  soundEnabled?: boolean;
  /** Show live HUD indicator with charset and entropy state */
  showHud?: boolean;
  /** Wrap with an outer frosted glass card box (default: false) */
  bordered?: boolean;
  /** Compact mode for card thumbnails and small labels */
  compact?: boolean;
  /** Callback fired when decoding completes */
  onComplete?: () => void;
  /** Imperative ref trigger for manual scramble */
  onScrambleRef?: (trigger: () => void) => void;
}

const PRESET_CHARSETS: Record<CipherCharset, string> = {
  katakana: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789',
  hex: '0123456789ABCDEF!#$@%&*<>/\\|',
  binary: '01',
  runic: 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛈᛇᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ',
  alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
};

interface GlyphState {
  char: string;
  isResolved: boolean;
  activeChar: string;
}

export const CipherGlyphMatrix: React.FC<CipherGlyphMatrixProps> = ({
  text,
  charset = 'katakana',
  choreography = 'wave',
  variant = 'matrix-emerald',
  theme: themeMode = 'auto',
  speed = 38,
  iterations = 3,
  autoStart = true,
  scrambleOnHover = true,
  soundEnabled = true,
  showHud = true,
  bordered = false,
  compact = false,
  onComplete,
  onScrambleRef,
  className = '',
  ...restProps
}) => {
  const instanceId = useId();
  const [textIndex, setTextIndex] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Active target text
  const textArray = Array.isArray(text) ? text : [text];
  const currentTargetText = textArray[textIndex % textArray.length] || '';

  // Theme resolution
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

    const observer = new MutationObserver(() => {
      const docTheme = document.documentElement.getAttribute('data-theme');
      setActiveTheme(docTheme === 'light' ? 'light' : 'dark');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, [themeMode]);

  // Glyph string generator
  const glyphPool = typeof charset === 'string' && PRESET_CHARSETS[charset as CipherCharset]
    ? PRESET_CHARSETS[charset as CipherCharset]
    : charset;

  // Active glyph states
  const [glyphs, setGlyphs] = useState<GlyphState[]>(() =>
    currentTargetText.split('').map((char) => ({
      char,
      isResolved: true,
      activeChar: char,
    }))
  );

  const [isScrambling, setIsScrambling] = useState(false);
  const [entropyProgress, setEntropyProgress] = useState(100);

  // Web Audio Synthesizer for Decoder Chatter
  const playTickChatter = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Frequency jitter simulates Geiger/decoder relays
      const freq = 600 + Math.random() * 800;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.025);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.025);
    } catch {
      // Audio policy safe
    }
  }, [soundEnabled]);

  const playResolveChime = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.2);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Audio policy safe
    }
  }, [soundEnabled]);

  // Scramble Choreography Engine
  const startScramble = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    const target = currentTargetText;
    const len = target.length;
    let step = 0;
    const totalSteps = len * iterations;

    setIsScrambling(true);

    // Compute order indices based on choreography
    let order: number[] = [];
    if (choreography === 'wave') {
      order = Array.from({ length: len }, (_, i) => i);
    } else if (choreography === 'center-out') {
      const mid = Math.floor(len / 2);
      const left: number[] = [];
      const right: number[] = [];
      for (let i = 0; i < len; i++) {
        if (i <= mid) left.push(i);
        else right.push(i);
      }
      left.reverse();
      const res: number[] = [];
      let l = 0, r = 0;
      while (l < left.length || r < right.length) {
        if (l < left.length) res.push(left[l++]);
        if (r < right.length) res.push(right[r++]);
      }
      order = res;
    } else if (choreography === 'random-dissolve') {
      order = Array.from({ length: len }, (_, i) => i).sort(() => Math.random() - 0.5);
    } else {
      order = Array.from({ length: len }, (_, i) => i);
    }

    // Rank of each index in resolution timeline
    const rankMap = new Map<number, number>();
    order.forEach((idx, rank) => rankMap.set(idx, rank));

    const executeStep = (currentStep: number) => {
      const currentResolvedRank = Math.floor((currentStep / totalSteps) * len);
      const progress = Math.min(100, Math.floor((currentStep / totalSteps) * 100));
      setEntropyProgress(progress);

      if (Math.random() > 0.4) {
        playTickChatter();
      }

      setGlyphs(() =>
        target.split('').map((char, index) => {
          if (char === ' ') {
            return { char, isResolved: true, activeChar: ' ' };
          }

          const indexRank = rankMap.get(index) ?? 0;
          const isResolved = indexRank <= currentResolvedRank;

          if (isResolved) {
            return { char, isResolved: true, activeChar: char };
          }

          // Random cryptographic cipher character
          const randomGlyph = glyphPool[Math.floor(Math.random() * glyphPool.length)] || '#';
          return { char, isResolved: false, activeChar: randomGlyph };
        })
      );
    };

    // Immediate initial scramble step for instant haptic feedback
    executeStep(0);

    timerRef.current = setInterval(() => {
      step++;
      executeStep(step);

      if (step >= totalSteps) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsScrambling(false);
        setEntropyProgress(100);
        setGlyphs(
          target.split('').map((char) => ({
            char,
            isResolved: true,
            activeChar: char,
          }))
        );
        playResolveChime();
        onComplete?.();
      }
    }, speed);
  }, [
    currentTargetText,
    iterations,
    choreography,
    speed,
    glyphPool,
    playTickChatter,
    playResolveChime,
    onComplete,
  ]);

  // Imperative ref trigger export
  useEffect(() => {
    onScrambleRef?.(startScramble);
  }, [onScrambleRef, startScramble]);

  // Scramble on target text change or mount
  useEffect(() => {
    if (autoStart) {
      startScramble();
    } else {
      setGlyphs(
        currentTargetText.split('').map((char) => ({
          char,
          isResolved: true,
          activeChar: char,
        }))
      );
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentTargetText, autoStart]);

  // Hover Scramble handler
  const handleMouseEnter = () => {
    if (scrambleOnHover && !isScrambling) {
      startScramble();
    }
  };

  // Cursor Proximity scrub handler (when in cursor-proximity mode)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (choreography !== 'cursor-proximity' || isScrambling) return;
    const container = containerRef.current;
    if (!container) return;

    const spanEls = container.querySelectorAll('.modui-cipher-char');
    const mouseX = e.clientX;

    spanEls.forEach((el, idx) => {
      const rect = el.getBoundingClientRect();
      const charCenter = rect.left + rect.width / 2;
      const dist = Math.abs(mouseX - charCenter);

      if (dist < 48) {
        // Scramble this character
        setGlyphs((prev) => {
          const next = [...prev];
          if (next[idx] && next[idx].char !== ' ') {
            next[idx] = {
              ...next[idx],
              isResolved: false,
              activeChar: glyphPool[Math.floor(Math.random() * glyphPool.length)] || '#',
            };
          }
          return next;
        });
        if (Math.random() > 0.6) playTickChatter();
      } else {
        // Resolve this character
        setGlyphs((prev) => {
          const next = [...prev];
          if (next[idx] && !next[idx].isResolved) {
            next[idx] = {
              ...next[idx],
              isResolved: true,
              activeChar: next[idx].char,
            };
          }
          return next;
        });
      }
    });
  };

  const handleNextPhrase = () => {
    if (textArray.length > 1) {
      setTextIndex((prev) => (prev + 1) % textArray.length);
    } else {
      startScramble();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`modui-cipher-container ${bordered ? 'modui-cipher-container--bordered' : ''} modui-cipher--${variant} modui-cipher--theme-${activeTheme} ${
        compact ? 'modui-cipher--compact' : ''
      } ${className}`}
      role="region"
      aria-label={`Cipher decoded text: ${currentTargetText}`}
      onMouseEnter={handleMouseEnter}
      onPointerMove={handlePointerMove}
      {...restProps}
    >
      {/* Visual HUD header */}
      {showHud && !compact && (
        <div className="modui-cipher-hud">
          <div className="modui-cipher-hud-left">
            <span className="modui-cipher-indicator-dot" />
            <span className="modui-cipher-hud-tag">
              CIPHER // {typeof charset === 'string' ? charset.toUpperCase() : 'CUSTOM'}
            </span>
          </div>
          <div className="modui-cipher-hud-right">
            <span className="modui-cipher-hud-mode">{choreography.toUpperCase()}</span>
            <span className="modui-cipher-hud-entropy">
              {isScrambling ? `DECRYPTING ${entropyProgress}%` : 'SECURE // 100%'}
            </span>
          </div>
        </div>
      )}

      {/* Cipher typographic stream */}
      <div
        className="modui-cipher-stream"
        onClick={handleNextPhrase}
        title="Click to re-scramble / advance phrase"
      >
        {glyphs.map((g, idx) => (
          <span
            key={`${instanceId}-char-${idx}`}
            className={`modui-cipher-char ${
              g.isResolved ? 'is-resolved' : 'is-scrambling'
            }`}
            data-char={g.char}
            aria-hidden="true"
          >
            {g.activeChar}
          </span>
        ))}
        {/* Invisible clean text for screen readers */}
        <span className="modui-cipher-sr-text">{currentTargetText}</span>
      </div>

      {/* Optional multi-phrase stepper dots */}
      {textArray.length > 1 && !compact && (
        <div className="modui-cipher-stepper" aria-hidden="true">
          {textArray.map((_, pIdx) => (
            <span
              key={pIdx}
              className={`modui-cipher-step-dot ${pIdx === textIndex % textArray.length ? 'is-active' : ''}`}
              onClick={() => setTextIndex(pIdx)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CipherGlyphMatrix;
