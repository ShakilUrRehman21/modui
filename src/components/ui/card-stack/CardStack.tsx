import React, { useState, useCallback, useEffect, useRef } from 'react';
import './CardStack.css';

export type CardStackVariant = 'studio-light' | 'warm-editorial' | 'glass-frost' | 'cinema-dark';

export interface CardStackItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  author?: {
    name: string;
    role?: string;
  };
  actionLabel?: string;
  onAction?: () => void;
}

export interface CardStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual theme finish (default: 'studio-light') */
  variant?: CardStackVariant;
  /** Array of card items */
  items?: CardStackItem[];
  /** Fan out stacked cards on hover or focus */
  fanOutOnHover?: boolean;
  /** Synthesize acoustic card flick haptic clicks on cycle */
  soundEnabled?: boolean;
  /** Compact card mode for catalogue explorer cards */
  compact?: boolean;
  /** Controlled active top card index */
  activeIndex?: number;
  /** Callback fired when the active card changes */
  onCardChange?: (item: CardStackItem, index: number) => void;
  /** Optional custom child elements */
  children?: React.ReactNode;
}

export const DEFAULT_STACK_ITEMS: CardStackItem[] = [
  {
    id: 'card-01',
    title: 'Fluid Kinetic Springs',
    description: 'Non-linear physics modeling mass, velocity, and spring damping with zero layout shifts.',
    category: 'Design System',
    author: {
      name: 'Elena Vance',
      role: 'Interaction Designer',
    },
    actionLabel: 'Explore Springs',
  },
  {
    id: 'card-02',
    title: 'Synthesized Acoustic Haptics',
    description: 'Real-time Web Audio API micro-oscillators providing tactile physical feedback without audio files.',
    category: 'Audio Lab',
    author: {
      name: 'Marcus Chen',
      role: 'Sound Architect',
    },
    actionLabel: 'Test Oscillators',
  },
  {
    id: 'card-03',
    title: 'Subpixel Spatial Glare',
    description: 'Pointer-tracked incident specular caustics and chromatic dispersion across 3D planar facets.',
    category: 'Spatial Optics',
    author: {
      name: 'Sophia Laurent',
      role: 'Creative Developer',
    },
    actionLabel: 'View Caustics',
  },
  {
    id: 'card-04',
    title: 'Zero Runtime Overhead',
    description: 'Architected strictly with CSS custom properties and native React APIs for maximum performance.',
    category: 'Engineering',
    author: {
      name: 'Julian Drake',
      role: 'Systems Engineer',
    },
    actionLabel: 'Inspect Specs',
  },
];

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx || audioCtx.state === 'suspended') {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

function playCardFlick() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    // Transient paper tick
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1900, t);
    osc1.frequency.exponentialRampToValueAtTime(450, t + 0.02);
    gain1.gain.setValueAtTime(0.04, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.025);

    // Subtle low card thump
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(260, t + 0.005);
    osc2.frequency.exponentialRampToValueAtTime(70, t + 0.04);
    gain2.gain.setValueAtTime(0.035, t + 0.005);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t + 0.005);
    osc2.stop(t + 0.045);
  } catch {
    // Graceful fallback
  }
}

export const CardStack: React.FC<CardStackProps> = ({
  variant = 'studio-light',
  items = DEFAULT_STACK_ITEMS,
  fanOutOnHover = true,
  soundEnabled = true,
  compact = false,
  activeIndex: controlledIndex,
  onCardChange,
  className = '',
  children,
  ...restProps
}) => {
  const [internalIndex, setInternalIndex] = useState(0);
  const [isFlinging, setIsFlinging] = useState(false);
  const isHoveredRef = useRef(false);

  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;

  const triggerSound = useCallback(() => {
    if (soundEnabled) {
      playCardFlick();
    }
  }, [soundEnabled]);

  const cycleNext = useCallback(() => {
    if (isFlinging || items.length <= 1) return;
    setIsFlinging(true);
    triggerSound();

    setTimeout(() => {
      const nextIndex = (activeIndex + 1) % items.length;
      setInternalIndex(nextIndex);
      if (onCardChange) {
        onCardChange(items[nextIndex], nextIndex);
      }
      setIsFlinging(false);
    }, 220);
  }, [isFlinging, items, activeIndex, onCardChange, triggerSound]);

  const cyclePrev = useCallback(() => {
    if (isFlinging || items.length <= 1) return;
    triggerSound();
    const prevIndex = (activeIndex - 1 + items.length) % items.length;
    setInternalIndex(prevIndex);
    if (onCardChange) {
      onCardChange(items[prevIndex], prevIndex);
    }
  }, [isFlinging, items, activeIndex, onCardChange, triggerSound]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      cycleNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      cyclePrev();
    }
  };

  return (
    <div
      className={`modui-card-stack-wrap modui-card-stack-theme-${variant} ${compact ? 'modui-card-stack-compact' : ''} ${className}`}
      role="region"
      aria-label="Card Stack"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      {...restProps}
    >
      <div className={`modui-card-stack-stage ${fanOutOnHover ? 'modui-card-stack-hover-fan' : ''}`}>
        {items.map((item, idx) => {
          // Calculate relative position in stack from top (0 = top, 1 = second, etc.)
          const relativeOffset = (idx - activeIndex + items.length) % items.length;
          const isTop = relativeOffset === 0;
          const isVisible = relativeOffset < 4;

          if (!isVisible) return null;

          const cardIndexFormatted = String(idx + 1).padStart(2, '0');

          return (
            <div
              key={item.id}
              className={`modui-card-stack-item ${isTop ? 'modui-card-stack-item--top' : ''} ${isTop && isFlinging ? 'modui-card-stack-item--flinging' : ''}`}
              style={{
                zIndex: items.length - relativeOffset,
                '--stack-offset': relativeOffset,
              } as React.CSSProperties}
              onClick={isTop ? cycleNext : undefined}
              role={isTop ? 'button' : undefined}
              aria-label={isTop ? `Card ${cardIndexFormatted}: ${item.title}` : undefined}
              aria-hidden={!isTop}
            >
              <div className="modui-card-stack-header">
                <span className="modui-card-stack-badge">
                  {item.category || 'FEATURE'}
                </span>
                <span className="modui-card-stack-counter" aria-hidden="true">
                  {cardIndexFormatted} / {String(items.length).padStart(2, '0')}
                </span>
              </div>

              <div className="modui-card-stack-body">
                <h3 className="modui-card-stack-title">{item.title}</h3>
                <p className="modui-card-stack-desc">{item.description}</p>
              </div>

              {!compact && item.author && (
                <div className="modui-card-stack-footer">
                  <div className="modui-card-stack-author">
                    <span className="modui-card-stack-avatar" aria-hidden="true">
                      {item.author.name.charAt(0)}
                    </span>
                    <div className="modui-card-stack-author-meta">
                      <span className="modui-card-stack-author-name">{item.author.name}</span>
                      {item.author.role && (
                        <span className="modui-card-stack-author-role">{item.author.role}</span>
                      )}
                    </div>
                  </div>

                  {item.actionLabel && (
                    <button
                      type="button"
                      className="modui-card-stack-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.onAction) item.onAction();
                      }}
                    >
                      <span>{item.actionLabel}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Indicators */}
      {!compact && (
        <div className="modui-card-stack-controls">
          <button
            type="button"
            className="modui-card-stack-nav-btn"
            onClick={cyclePrev}
            aria-label="Previous card"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="modui-card-stack-dots" role="tablist" aria-label="Card dots">
            {items.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                className={`modui-card-stack-dot ${idx === activeIndex ? 'modui-card-stack-dot--active' : ''}`}
                onClick={() => {
                  triggerSound();
                  setInternalIndex(idx);
                  if (onCardChange) onCardChange(items[idx], idx);
                }}
                aria-label={`Jump to card ${idx + 1}`}
                role="tab"
                aria-selected={idx === activeIndex}
              />
            ))}
          </div>

          <button
            type="button"
            className="modui-card-stack-nav-btn"
            onClick={cycleNext}
            aria-label="Next card"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}

      {children}
    </div>
  );
};

export default CardStack;
