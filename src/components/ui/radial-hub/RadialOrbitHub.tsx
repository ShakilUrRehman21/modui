import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './RadialOrbitHub.css';

export interface RadialOrbitItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  badge?: string | number;
  shortcut?: string;
  color?: string;
  disabled?: boolean;
}

export type RadialOrbitMode = 'circle' | 'fan-top' | 'fan-right' | 'fan-bottom' | 'fan-left' | 'quarter';
export type RadialOrbitVariant = 'glass' | 'dark' | 'neon' | 'minimal';

export interface RadialOrbitHubProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSelect'> {
  /** Satellite action nodes positioned on the orbit ring */
  items: RadialOrbitItem[];
  /** Radial distance from core center in pixels (default: 110) */
  radius?: number;
  /** Bloom distribution layout (default: 'circle') */
  mode?: RadialOrbitMode;
  /** Visual surface styling token (default: 'glass') */
  variant?: RadialOrbitVariant;
  /** Interaction trigger for opening the orbit (default: 'click') */
  trigger?: 'click' | 'hover';
  /** Allow mouse/touch dragging to spin the orbit ring with momentum physics (default: true) */
  enableRotation?: boolean;
  /** Synthetic Web Audio micro-haptics on open and node hover (default: true) */
  soundEnabled?: boolean;
  /** Alias for soundEnabled */
  soundEffects?: boolean;
  /** Whether to show labels and tooltips on nodes (default: true) */
  showLabels?: boolean;
  /** Custom central core icon when closed */
  coreIcon?: React.ReactNode;
  /** Custom central core icon when open */
  coreOpenIcon?: React.ReactNode;
  /** Accessible label for the main hub control */
  coreLabel?: string;
  /** Initial opened state */
  defaultOpen?: boolean;
  /** Controlled open state */
  isOpen?: boolean;
  /** Callback fired on open/close toggle */
  onOpenChange?: (open: boolean) => void;
  /** Callback fired when an item is selected */
  onSelect?: (item: RadialOrbitItem) => void;
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

// Lightweight Web Audio API click synthesizer (Zero asset load)
const playHapticTone = (freq: number, type: OscillatorType = 'sine', duration: number = 0.04) => {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.4), ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio permission restrictions
  }
};

export const RadialOrbitHub: React.FC<RadialOrbitHubProps> = ({
  items,
  radius = 110,
  mode = 'circle',
  variant = 'glass',
  trigger = 'click',
  enableRotation = true,
  soundEnabled: soundEnabledProp = true,
  soundEffects,
  showLabels = true,
  coreIcon,
  coreOpenIcon,
  coreLabel = 'Radial action hub',
  defaultOpen = false,
  isOpen: controlledOpen,
  onOpenChange,
  onSelect,
  className = '',
  style,
  ...rest
}) => {
  const soundEnabled = soundEffects !== undefined ? soundEffects : soundEnabledProp;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const [activeRotation, setActiveRotation] = useState(0);
  const rotationRef = useRef(0);

  useEffect(() => {
    rotationRef.current = activeRotation;
  }, [activeRotation]);

  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Dragging state for rotational wheel
  const isDraggingRef = useRef(false);
  const lastAngleRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTimeRef = useRef(0);
  const movedRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLButtonElement>(null);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
      if (soundEnabled) {
        playHapticTone(nextOpen ? 680 : 340, 'triangle', 0.06);
      }
    },
    [isControlled, onOpenChange, soundEnabled]
  );

  const toggleOpen = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  // Calculate angles for each satellite node based on mode
  const nodeAngles = useMemo(() => {
    const count = items.length;
    if (count === 0) return [];

    switch (mode) {
      case 'fan-top': {
        // Semi-circle spread across top (-180° to 0°)
        const step = count > 1 ? 180 / (count - 1) : 0;
        return items.map((_, i) => -180 + i * step);
      }
      case 'fan-bottom': {
        // Semi-circle spread across bottom (0° to 180°)
        const step = count > 1 ? 180 / (count - 1) : 0;
        return items.map((_, i) => i * step);
      }
      case 'fan-right': {
        // Semi-circle spread across right (-90° to 90°)
        const step = count > 1 ? 180 / (count - 1) : 0;
        return items.map((_, i) => -90 + i * step);
      }
      case 'fan-left': {
        // Semi-circle spread across left (90° to 270°)
        const step = count > 1 ? 180 / (count - 1) : 0;
        return items.map((_, i) => 90 + i * step);
      }
      case 'quarter': {
        // 90° corner arc (-90° to 0°)
        const step = count > 1 ? 90 / (count - 1) : 0;
        return items.map((_, i) => -90 + i * step);
      }
      case 'circle':
      default: {
        // Full 360° distribution starting at top (-90°)
        const step = 360 / count;
        return items.map((_, i) => -90 + i * step);
      }
    }
  }, [items, mode]);

  // Inertia damping loop after drag release
  const startInertia = useCallback(() => {
    if (Math.abs(velocityRef.current) < 0.05) return;
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

    const step = () => {
      velocityRef.current *= 0.94; // Friction damping
      rotationRef.current += velocityRef.current;
      setActiveRotation(rotationRef.current);

      if (Math.abs(velocityRef.current) > 0.06) {
        rafIdRef.current = requestAnimationFrame(step);
      }
    };
    rafIdRef.current = requestAnimationFrame(step);
  }, []);

  // Compute pointer angle relative to hub center
  const getPointerAngle = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!enableRotation || !open) return;
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

    isDraggingRef.current = true;
    movedRef.current = false;
    lastAngleRef.current = getPointerAngle(e.clientX, e.clientY);
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !enableRotation) return;

    const currentAngle = getPointerAngle(e.clientX, e.clientY);
    let delta = currentAngle - lastAngleRef.current;

    // Handle wrap-around near 180 / -180 boundary
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    if (Math.abs(delta) > 1) {
      movedRef.current = true;
    }

    const now = performance.now();
    const dt = Math.max(now - lastTimeRef.current, 1);
    velocityRef.current = (delta / dt) * 16; // Normalized velocity

    rotationRef.current += delta;
    setActiveRotation(rotationRef.current);

    lastAngleRef.current = currentAngle;
    lastTimeRef.current = now;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    startInertia();
  };

  // Keyboard navigation across nodes
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      coreRef.current?.focus();
      return;
    }

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (focusedIndex + 1) % items.length;
      setFocusedIndex(next);
      if (soundEnabled) playHapticTone(520, 'sine', 0.03);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (focusedIndex - 1 + items.length) % items.length;
      setFocusedIndex(prev);
      if (soundEnabled) playHapticTone(520, 'sine', 0.03);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex >= 0 && items[focusedIndex] && !items[focusedIndex].disabled) {
        handleItemClick(items[focusedIndex]);
      }
    }
  };

  const handleItemClick = (item: RadialOrbitItem) => {
    if (item.disabled || movedRef.current) return;
    if (soundEnabled) playHapticTone(840, 'triangle', 0.08);
    item.onClick?.();
    onSelect?.(item);
  };

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`modui-radial-hub modui-radial-hub--${variant} ${open ? 'modui-radial-hub--open' : ''} ${className}`}
      style={{
        '--hub-radius': `${radius}px`,
        ...style,
      } as React.CSSProperties}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      onMouseEnter={trigger === 'hover' ? () => setOpen(true) : undefined}
      onMouseLeave={trigger === 'hover' ? () => setOpen(false) : undefined}
      role="region"
      aria-label={coreLabel}
      {...rest}
    >
      {/* Decorative SVG Geometric Orbit Rings & Pulses */}
      <svg className="modui-radial-orbit-canvas" aria-hidden="true">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          className="modui-radial-orbit-ring"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius + 18}
          className="modui-radial-orbit-ring-outer"
        />
      </svg>

      {/* Orbit Track Satellite Container */}
      <div
        className="modui-radial-satellites"
        style={{
          transform: `rotate(${enableRotation ? activeRotation : 0}deg)`,
        }}
      >
        {items.map((item, idx) => {
          const baseAngle = nodeAngles[idx] || 0;
          const rad = (baseAngle * Math.PI) / 180;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;
          const isHovered = hoveredItemId === item.id;
          const isFocused = focusedIndex === idx;

          return (
            <div
              key={item.id}
              className={`modui-radial-node-slot ${open ? 'modui-radial-node-slot--open' : ''}`}
              style={{
                transform: open
                  ? `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
                  : 'translate3d(0, 0, 0)',
                transitionDelay: `${open ? idx * 35 : 0}ms`,
              }}
            >
              {/* Counter-rotation so icons stay upright while orbit rotates */}
              <div
                className="modui-radial-node-counter-rot"
                style={{
                  transform: `rotate(${enableRotation ? -activeRotation : 0}deg)`,
                }}
              >
                <button
                  type="button"
                  className={`modui-radial-node-btn ${isHovered || isFocused ? 'modui-radial-node-btn--hovered' : ''} ${
                    item.disabled ? 'modui-radial-node-btn--disabled' : ''
                  }`}
                  style={{
                    borderColor: item.color || undefined,
                  }}
                  onClick={() => handleItemClick(item)}
                  onMouseEnter={() => {
                    setHoveredItemId(item.id);
                    if (soundEnabled && open) playHapticTone(560, 'sine', 0.02);
                  }}
                  onMouseLeave={() => setHoveredItemId(null)}
                  onFocus={() => {
                    setFocusedIndex(idx);
                    setHoveredItemId(item.id);
                  }}
                  onBlur={() => {
                    setHoveredItemId(null);
                    setFocusedIndex(-1);
                  }}
                  disabled={!open || item.disabled}
                  aria-label={item.label}
                  role="menuitem"
                  tabIndex={open ? 0 : -1}
                >
                  <span className="modui-radial-node-icon" style={{ color: item.color || undefined }}>
                    {item.icon}
                  </span>

                  {/* Node Badge Indicator */}
                  {item.badge !== undefined && (
                    <span className="modui-radial-node-badge">{item.badge}</span>
                  )}

                  {/* Specular Ambient Glare Ring */}
                  <span className="modui-radial-node-glare" aria-hidden="true" />
                </button>

                {/* Floating Micro-Tooltip */}
                {showLabels && (
                  <div
                    className={`modui-radial-tooltip ${isHovered || isFocused ? 'modui-radial-tooltip--visible' : ''}`}
                    role="tooltip"
                  >
                    <span className="modui-radial-tooltip-text">{item.label}</span>
                    {item.shortcut && (
                      <kbd className="modui-radial-tooltip-kbd">{item.shortcut}</kbd>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Central Tactile Core Button */}
      <button
        ref={coreRef}
        type="button"
        className="modui-radial-core-btn"
        onClick={toggleOpen}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={coreLabel}
      >
        <div className="modui-radial-core-inner">
          <div className="modui-radial-core-icon-box">
            {open ? (
              coreOpenIcon || (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              )
            ) : (
              coreIcon || (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="12" cy="4" r="2" />
                  <circle cx="20" cy="12" r="2" />
                  <circle cx="12" cy="20" r="2" />
                  <circle cx="4" cy="12" r="2" />
                </svg>
              )
            )}
          </div>
        </div>

        {/* Ambient Breathing Radar Halo */}
        <div className="modui-radial-core-halo" aria-hidden="true" />
        <div className="modui-radial-core-glow" aria-hidden="true" />
      </button>
    </div>
  );
};

export default RadialOrbitHub;
