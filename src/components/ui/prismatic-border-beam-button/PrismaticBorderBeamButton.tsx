import React, {
  useState,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import './PrismaticBorderBeamButton.css';

export type BorderBeamVariant =
  | 'obsidian-prism'
  | 'porcelain-aurora'
  | 'cyber-flare'
  | 'solar-gold';

export type BorderBeamSize = 'sm' | 'md' | 'lg';

export interface PrismaticBorderBeamButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  variant?: BorderBeamVariant;
  size?: BorderBeamSize;
  beamDuration?: number;
  magnetic?: boolean;
  spotlight?: boolean;
  loading?: boolean;
  loadingText?: string;
  soundEnabled?: boolean;
  compact?: boolean;
}

export interface PrismaticBorderBeamButtonHandle {
  focus: () => void;
  triggerPulse: () => void;
  setBeamSpeed: (seconds: number) => void;
}

const DefaultSparkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
  </svg>
);

const DefaultArrowIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export const PrismaticBorderBeamButton = forwardRef<
  PrismaticBorderBeamButtonHandle,
  PrismaticBorderBeamButtonProps
>(function PrismaticBorderBeamButton(
  {
    children = 'Launch Workspace',
    icon = <DefaultSparkIcon />,
    trailingIcon = <DefaultArrowIcon />,
    variant = 'obsidian-prism',
    size = 'md',
    beamDuration = 3.2,
    magnetic = true,
    spotlight = true,
    loading = false,
    loadingText = 'Initializing...',
    soundEnabled = true,
    compact = false,
    disabled = false,
    type = 'button',
    className = '',
    style = {},
    onClick,
    onPointerMove,
    onPointerLeave,
    ...rest
  },
  ref
) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [tilt, setTilt] = useState<{ rx: number; ry: number; tx: number; ty: number }>({
    rx: 0,
    ry: 0,
    tx: 0,
    ty: 0,
  });
  const [pointerPct, setPointerPct] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [pulseKey, setPulseKey] = useState<number>(0);
  const [customDuration, setCustomDuration] = useState<number | null>(null);

  const effectiveDuration = customDuration ?? beamDuration;

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  const playCrystalClick = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.18);
    } catch {
      // Ignore audio errors in restricted environments
    }
  }, [soundEnabled, getAudioContext]);

  const firePulse = useCallback(() => {
    setPulseKey((k) => k + 1);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => buttonRef.current?.focus(),
      triggerPulse: () => {
        firePulse();
        playCrystalClick();
      },
      setBeamSpeed: (seconds: number) => {
        setCustomDuration(Math.max(0.4, Math.min(10, seconds)));
      },
    }),
    [firePulse, playCrystalClick]
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    onPointerMove?.(e);
    if (disabled || loading) return;
    const el = buttonRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    if (spotlight) {
      setPointerPct({
        x: Math.round(relX * 100),
        y: Math.round(relY * 100),
      });
    }

    if (magnetic && !compact) {
      const dx = relX - 0.5;
      const dy = relY - 0.5;
      setTilt({
        rx: Number((-dy * 10).toFixed(2)),
        ry: Number((dx * 12).toFixed(2)),
        tx: Number((dx * 4).toFixed(2)),
        ty: Number((dy * 3 - 2).toFixed(2)),
      });
    }
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    onPointerLeave?.(e);
    setTilt({ rx: 0, ry: 0, tx: 0, ty: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    firePulse();
    playCrystalClick();
    onClick?.(e);
  };

  const transformValue =
    tilt.tx !== 0 || tilt.ty !== 0 || tilt.rx !== 0 || tilt.ry !== 0
      ? `translate3d(${tilt.tx}px, ${tilt.ty}px, 0) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`
      : undefined;

  return (
    <span className={`beam-btn-wrapper ${compact ? 'beam-compact' : ''} ${className}`}>
      <button
        ref={buttonRef}
        type={type}
        disabled={disabled}
        aria-busy={loading}
        className={`beam-btn-root beam-variant-${variant} beam-size-${size} ${
          loading ? 'beam-btn-root--loading' : ''
        }`}
        style={
          {
            ...style,
            '--beam-duration': `${effectiveDuration}s`,
            '--pointer-x': `${pointerPct.x}%`,
            '--pointer-y': `${pointerPct.y}%`,
            transform: transformValue,
          } as React.CSSProperties
        }
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        {...rest}
      >
        {pulseKey > 0 && <span key={pulseKey} className="beam-pulse-ring" aria-hidden="true" />}

        <span className="beam-btn-inner">
          {spotlight && <span className="beam-spotlight-layer" aria-hidden="true" />}

          {loading ? (
            <>
              <span className="beam-spinner" aria-hidden="true" />
              <span className="beam-label">{loadingText}</span>
            </>
          ) : (
            <>
              {icon && <span className="beam-leading-icon">{icon}</span>}
              <span className="beam-label">{children}</span>
              {trailingIcon && <span className="beam-trailing-icon">{trailingIcon}</span>}
            </>
          )}
        </span>
      </button>
    </span>
  );
});
