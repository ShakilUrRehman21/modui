import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './FluidElasticAccordion.css';

export interface FluidAccordionItem {
  id: string;
  number?: string;
  title: string;
  subtitle?: string;
  description?: string;
  tag?: string;
  color?: string;
  image?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onActionClick?: (item: FluidAccordionItem) => void;
  customContent?: React.ReactNode;
}

export type FluidAccordionOrientation = 'horizontal' | 'vertical';
export type FluidAccordionVariant = 'light' | 'editorial' | 'glass' | 'dark' | 'minimal';
export type FluidAccordionTrigger = 'click' | 'hover';
export type FluidAccordionSpring = 'gentle' | 'snappy' | 'elastic';

export interface FluidElasticAccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSelect'> {
  items: FluidAccordionItem[];
  defaultActiveId?: string;
  activeId?: string;
  onActiveChange?: (id: string, item: FluidAccordionItem) => void;
  orientation?: FluidAccordionOrientation;
  variant?: FluidAccordionVariant;
  trigger?: FluidAccordionTrigger;
  springTension?: FluidAccordionSpring;
  soundEnabled?: boolean;
  enableLiquidEdge?: boolean;
  expandedRatio?: number;
  className?: string;
}

// Lightweight synthesized acoustic harmonic haptic tone
const playFluidHaptic = (freq: number = 320, type: OscillatorType = 'sine', duration: number = 0.05) => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration * 0.7);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.5), ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
    setTimeout(() => ctx.close().catch(() => {}), (duration + 0.1) * 1000);
  } catch {
    // Ignore autoplay restrictions
  }
};

export const FluidElasticAccordion: React.FC<FluidElasticAccordionProps> = ({
  items,
  defaultActiveId,
  activeId: controlledActiveId,
  onActiveChange,
  orientation = 'horizontal',
  variant = 'light',
  trigger = 'click',
  springTension = 'elastic',
  soundEnabled = true,
  enableLiquidEdge = true,
  expandedRatio = 3.4,
  className = '',
  style,
  ...rest
}) => {
  const initialId = defaultActiveId || (items.length > 0 ? items[0].id : '');
  const [internalActiveId, setInternalActiveId] = useState(initialId);
  const isControlled = controlledActiveId !== undefined;
  const currentActiveId = isControlled ? controlledActiveId : internalActiveId;

  // Spring liquid curve offset state
  const [liquidFlex, setLiquidFlex] = useState(0);
  const liquidAnimRef = useRef<number | null>(null);
  const flexPosRef = useRef(0);
  const flexVelRef = useRef(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const prevActiveIndexRef = useRef(items.findIndex((item) => item.id === currentActiveId));

  // Elastic physics simulation loop for the liquid boundary curve
  const triggerLiquidWave = useCallback((direction: number) => {
    if (!enableLiquidEdge) return;

    // Initial impulse push in transition direction
    flexVelRef.current += direction * 32;

    const tension = springTension === 'elastic' ? 0.18 : springTension === 'snappy' ? 0.28 : 0.12;
    const damping = springTension === 'elastic' ? 0.76 : springTension === 'snappy' ? 0.68 : 0.84;

    const animate = () => {
      // Spring force towards rest position (0)
      const force = -tension * flexPosRef.current;
      flexVelRef.current += force;
      flexVelRef.current *= damping;
      flexPosRef.current += flexVelRef.current;

      setLiquidFlex(flexPosRef.current);

      if (Math.abs(flexPosRef.current) > 0.3 || Math.abs(flexVelRef.current) > 0.3) {
        liquidAnimRef.current = requestAnimationFrame(animate);
      } else {
        flexPosRef.current = 0;
        flexVelRef.current = 0;
        setLiquidFlex(0);
        liquidAnimRef.current = null;
      }
    };

    if (liquidAnimRef.current) {
      cancelAnimationFrame(liquidAnimRef.current);
    }
    liquidAnimRef.current = requestAnimationFrame(animate);
  }, [enableLiquidEdge, springTension]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (liquidAnimRef.current) cancelAnimationFrame(liquidAnimRef.current);
    };
  }, []);

  const handleSetActive = useCallback(
    (newId: string) => {
      if (newId === currentActiveId) return;

      const newIndex = items.findIndex((i) => i.id === newId);
      const prevIndex = items.findIndex((i) => i.id === currentActiveId);
      const direction = newIndex > prevIndex ? 1 : -1;

      if (!isControlled) {
        setInternalActiveId(newId);
      }

      const activeItem = items.find((i) => i.id === newId);
      if (activeItem) {
        onActiveChange?.(newId, activeItem);
      }

      if (soundEnabled) {
        playFluidHaptic(direction > 0 ? 380 : 310, 'triangle', 0.05);
      }

      triggerLiquidWave(direction);
      prevActiveIndexRef.current = newIndex;
    },
    [currentActiveId, isControlled, items, onActiveChange, soundEnabled, triggerLiquidWave]
  );

  // Keyboard navigation across panels
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = -1;

    if (orientation === 'horizontal') {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = (index + 1) % items.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = (index - 1 + items.length) % items.length;
      }
    } else {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = (index + 1) % items.length;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = (index - 1 + items.length) % items.length;
      }
    }

    if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = items.length - 1;
    }

    if (nextIndex !== -1 && items[nextIndex]) {
      handleSetActive(items[nextIndex].id);
      // Focus panel element
      const panels = containerRef.current?.querySelectorAll<HTMLElement>('.modui-fluid-panel');
      panels?.[nextIndex]?.focus();
    }
  };

  const activeIndex = useMemo(() => {
    const idx = items.findIndex((i) => i.id === currentActiveId);
    return idx !== -1 ? idx : 0;
  }, [items, currentActiveId]);

  return (
    <div
      ref={containerRef}
      className={`modui-fluid-accordion modui-fluid-accordion--${orientation} modui-fluid-accordion--${variant} modui-fluid-accordion--spring-${springTension} ${className}`}
      style={{
        ...style,
      }}
      role="tablist"
      aria-orientation={orientation}
      {...rest}
    >
      {items.map((item, idx) => {
        const isActive = item.id === currentActiveId;
        const numberFormatted = item.number || String(idx + 1).padStart(2, '0');
        const accentColor = item.color || '#4F46E5';

        // Calculate flex proportion: active panel gets expandedRatio, inactive gets 1
        const flexValue = isActive ? expandedRatio : 1;

        return (
          <div
            key={item.id}
            id={`modui-panel-${item.id}`}
            className={`modui-fluid-panel ${isActive ? 'modui-fluid-panel--active' : 'modui-fluid-panel--collapsed'}`}
            style={{
              flex: `${flexValue} 1 0%`,
              '--panel-accent': accentColor,
            } as React.CSSProperties}
            role="tab"
            aria-selected={isActive}
            aria-expanded={isActive}
            aria-controls={`modui-panel-content-${item.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => handleSetActive(item.id)}
            onMouseEnter={() => {
              if (trigger === 'hover') {
                handleSetActive(item.id);
              }
            }}
            onKeyDown={(e) => handleKeyDown(e, idx)}
          >
            {/* Background Ambient Layer with Optional Image or Gradient */}
            <div className="modui-fluid-panel-bg" aria-hidden="true">
              {item.image && (
                <div
                  className="modui-fluid-panel-img"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
              )}
              <div
                className="modui-fluid-panel-glow"
                style={{
                  background: `radial-gradient(ellipse at ${orientation === 'horizontal' ? '30% 50%' : '50% 30%'}, ${accentColor}28 0%, transparent 70%)`,
                }}
              />
              <div className="modui-fluid-panel-sheen" />
            </div>

            {/* Collapsed Ribbon Header */}
            <div className="modui-fluid-collapsed-bar" aria-hidden={isActive}>
              <span className="modui-fluid-num-pill">{numberFormatted}</span>
              <div className="modui-fluid-collapsed-title-wrap">
                <span className="modui-fluid-collapsed-title">{item.title}</span>
              </div>
              {item.tag && <span className="modui-fluid-collapsed-tag">{item.tag}</span>}
            </div>

            {/* Expanded Detailed Content Canvas */}
            <div
              id={`modui-panel-content-${item.id}`}
              className="modui-fluid-expanded-content"
              aria-hidden={!isActive}
            >
              <div className="modui-fluid-meta-top">
                <span className="modui-fluid-badge" style={{ borderColor: `${accentColor}44`, color: accentColor }}>
                  <span className="modui-fluid-badge-dot" style={{ backgroundColor: accentColor }} />
                  {item.tag || `MODULE ${numberFormatted}`}
                </span>
                <span className="modui-fluid-index-hero">{numberFormatted}</span>
              </div>

              <div className="modui-fluid-body">
                <h3 className="modui-fluid-headline">{item.title}</h3>
                {item.subtitle && <p className="modui-fluid-subhead">{item.subtitle}</p>}
                {item.description && (
                  <p className="modui-fluid-description">{item.description}</p>
                )}

                {item.customContent}

                {item.actionText && (
                  <button
                    type="button"
                    className="modui-fluid-cta-btn"
                    style={{
                      '--btn-accent': accentColor,
                    } as React.CSSProperties}
                    onClick={(e) => {
                      e.stopPropagation();
                      item.onActionClick?.(item);
                    }}
                  >
                    <span>{item.actionText}</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Liquid Bezier Edge Divider */}
            {enableLiquidEdge && idx < items.length - 1 && (
              <div
                className={`modui-fluid-edge-divider ${idx === activeIndex || idx === activeIndex - 1 ? 'modui-fluid-edge-divider--active' : ''}`}
                aria-hidden="true"
              >
                {orientation === 'horizontal' ? (
                  <svg
                    className="modui-fluid-edge-svg modui-fluid-edge-svg--vert"
                    viewBox="0 0 40 400"
                    preserveAspectRatio="none"
                  >
                    <path
                      d={`M 20 0 Q ${20 + (idx === activeIndex ? liquidFlex : -liquidFlex * 0.4)} 200 20 400`}
                      fill="none"
                      stroke={idx === activeIndex ? accentColor : 'rgba(255, 255, 255, 0.12)'}
                      strokeWidth={idx === activeIndex ? 2 : 1}
                    />
                  </svg>
                ) : (
                  <svg
                    className="modui-fluid-edge-svg modui-fluid-edge-svg--horiz"
                    viewBox="0 0 600 40"
                    preserveAspectRatio="none"
                  >
                    <path
                      d={`M 0 20 Q 300 ${20 + (idx === activeIndex ? liquidFlex : -liquidFlex * 0.4)} 600 20`}
                      fill="none"
                      stroke={idx === activeIndex ? accentColor : 'rgba(255, 255, 255, 0.12)'}
                      strokeWidth={idx === activeIndex ? 2 : 1}
                    />
                  </svg>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FluidElasticAccordion;
