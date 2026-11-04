import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import './SpatialGallery.css';

export type SpatialGalleryVariant = 'studio-dark' | 'studio-light' | 'minimal-mono' | 'cyber-cyan';

export interface SpatialGalleryItem {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  src: string;
  alt?: string;
  description?: string;
  accentColor?: string;
  badge?: string;
}

export interface SpatialGalleryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Visual aesthetic theme finish (default: 'studio-dark') */
  variant?: SpatialGalleryVariant;
  /** Gallery showcase items */
  items?: SpatialGalleryItem[];
  /** Controlled active index */
  activeIndex?: number;
  /** Initial active index for uncontrolled mode */
  defaultIndex?: number;
  /** Render real-time glossy mirror floor reflections (default: true) */
  showReflection?: boolean;
  /** Display navigation controls and playback toolbar (default: true) */
  showControls?: boolean;
  /** Display top HUD overlay with active project telemetry (default: true) */
  showHUD?: boolean;
  /** Automatically rotate through items on an interval (default: false) */
  autoPlay?: boolean;
  /** Auto-play rotation interval in milliseconds (default: 4500) */
  autoPlayInterval?: number;
  /** Synthesize acoustic spatial micro-haptics on card scrub (default: false) */
  soundEnabled?: boolean;
  /** Enable lightbox modal on card click (default: true) */
  enableLightbox?: boolean;
  /** Compact mode optimized for catalogue preview cards */
  compact?: boolean;
  /** Callback fired when the active card changes */
  onSelect?: (item: SpatialGalleryItem, index: number) => void;
  /** Callback fired when a card is clicked or inspected */
  onItemClick?: (item: SpatialGalleryItem, index: number) => void;
  /** Optional custom child elements */
  children?: React.ReactNode;
}

export const DEFAULT_SPATIAL_ITEMS: SpatialGalleryItem[] = [
  {
    id: 'sg-01',
    title: 'Aura Chromatica',
    subtitle: 'Photonic crystal refractions & liquid surface tension dynamics',
    category: 'Optics & Light',
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    alt: 'High refractive photonic crystals with iridescent rainbow dispersion',
    description: 'Experimental study on light caustics passing through curved optical glass prisms, mapping structural wave frequencies into visible color coordinates.',
    accentColor: '#3B82F6',
    badge: 'CASE 01',
  },
  {
    id: 'sg-02',
    title: 'Brutalist Monolith',
    subtitle: 'Machined titanium alloy framing architectural geometry',
    category: 'Structure',
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Monolithic concrete and glass corporate architecture catching daylight',
    description: 'Precision architectural survey exploring the brutalist interplay of heavy raw titanium panels, shadow recesses, and floor-to-ceiling glass fenestrations.',
    accentColor: '#10B981',
    badge: 'CASE 02',
  },
  {
    id: 'sg-03',
    title: 'Quantum Fluidics',
    subtitle: 'Supersonic boundary layers & turbulent vortex shedding',
    category: 'Fluid Dynamics',
    src: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
    alt: 'Abstract fluid turbulence in deep ocean blue and violet hues',
    description: 'Computational fluid dynamic simulation of turbulent flow fields around aerodynamic control surfaces at high Reynolds numbers.',
    accentColor: '#8B5CF6',
    badge: 'CASE 03',
  },
  {
    id: 'sg-04',
    title: 'Neural Core Matrix',
    subtitle: '64-channel systolic array for real-time edge tensor dispatch',
    category: 'Hardware',
    src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    alt: 'High-density microchip silicon architecture with glowing gold micro-traces',
    description: 'High-density silicon wafer featuring sub-nanometer lithography and integrated optical inter-connects for low-latency parallel tensor reduction.',
    accentColor: '#F59E0B',
    badge: 'CASE 04',
  },
  {
    id: 'sg-05',
    title: 'Lumen Kinetic',
    subtitle: 'High-speed camera telemetry of harmonic mechanical resonance',
    category: 'Acoustics',
    src: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    alt: 'Vibrant chromatic fluid surface oscillating under harmonic frequencies',
    description: 'Optical vibrometry recording standing wave nodes across an oscillating fluid boundary, visualizing non-linear acoustic dispersion.',
    accentColor: '#06B6D4',
    badge: 'CASE 05',
  },
];

let sharedAudioCtx: AudioContext | null = null;
function playSpatialAcousticClick(freq = 1400) {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!sharedAudioCtx || sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx = new AudioContextClass();
    }
    const osc = sharedAudioCtx.createOscillator();
    const gain = sharedAudioCtx.createGain();
    const now = sharedAudioCtx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + 0.025);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(gain);
    gain.connect(sharedAudioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  } catch {
    // Ignore audio autoplay restrictions
  }
}

export function SpatialGallery({
  variant = 'studio-light',
  items = DEFAULT_SPATIAL_ITEMS,
  activeIndex: controlledIndex,
  defaultIndex = 0,
  showReflection = true,
  showControls = true,
  showHUD = true,
  autoPlay = false,
  autoPlayInterval = 4500,
  soundEnabled = false,
  enableLightbox = true,
  compact = false,
  onSelect,
  onItemClick,
  className = '',
  style,
  children,
  ...rest
}: SpatialGalleryProps) {
  const isControlled = controlledIndex !== undefined;
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const activeIdx = isControlled ? controlledIndex : internalIndex;

  const [inspectedItem, setInspectedItem] = useState<SpatialGalleryItem | null>(null);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const dragRef = useRef({ startX: 0, currentX: 0, hasDragged: false });
  const containerRef = useRef<HTMLDivElement>(null);

  const totalItems = items.length;

  const setActive = useCallback(
    (index: number) => {
      const next = ((index % totalItems) + totalItems) % totalItems;
      if (!isControlled) {
        setInternalIndex(next);
      }
      if (soundEnabled) {
        playSpatialAcousticClick(1200 + (next % 4) * 150);
      }
      if (items[next]) {
        onSelect?.(items[next], next);
      }
    },
    [isControlled, items, totalItems, soundEnabled, onSelect]
  );

  const nextSlide = useCallback(() => {
    setActive(activeIdx + 1);
  }, [activeIdx, setActive]);

  const prevSlide = useCallback(() => {
    setActive(activeIdx - 1);
  }, [activeIdx, setActive]);

  // Auto-play interval (supports compact previews when autoPlay is enabled)
  useEffect(() => {
    if (!autoPlay || inspectedItem) return;
    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, inspectedItem, nextSlide]);

  // Pointer drag scrubbing with deadzone to preserve clicks
  const handlePointerDown = (e: React.PointerEvent) => {
    if (compact) return;
    setIsPointerDown(true);
    dragRef.current = { startX: e.clientX, currentX: e.clientX, hasDragged: false };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 8) {
      dragRef.current.hasDragged = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDown) return;
    const dx = e.clientX - dragRef.current.startX;
    setIsPointerDown(false);
    if (dragRef.current.hasDragged && Math.abs(dx) > 35) {
      if (dx > 0) prevSlide();
      else nextSlide();
    }
  };

  // Non-passive Wheel scrub: prevents the browser window from scrolling down
  // and smoothly scrubs/cycles the 3D gallery cards instead
  const wheelAccumulator = useRef(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el || compact) return;

    let resetTimer: ReturnType<typeof setTimeout> | null = null;
    const onWheel = (e: WheelEvent) => {
      // Prevent browser from scrolling down the page
      e.preventDefault();
      e.stopPropagation();

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      wheelAccumulator.current += delta;

      const THRESHOLD = 30;
      if (wheelAccumulator.current > THRESHOLD) {
        nextSlide();
        wheelAccumulator.current = 0;
      } else if (wheelAccumulator.current < -THRESHOLD) {
        prevSlide();
        wheelAccumulator.current = 0;
      }

      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        wheelAccumulator.current = 0;
      }, 160);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [compact, nextSlide, prevSlide]);

  // Global Escape key listener to close modal
  useEffect(() => {
    if (!inspectedItem) return;
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setInspectedItem(null);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [inspectedItem]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (inspectedItem) {
        e.preventDefault();
        setInspectedItem(null);
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(totalItems - 1);
    } else if ((e.key === 'Enter' || e.key === ' ') && enableLightbox) {
      e.preventDefault();
      const current = items[activeIdx];
      if (current) {
        setInspectedItem(current);
        onItemClick?.(current, activeIdx);
      }
    }
  };

  const currentItem = useMemo(() => items[activeIdx] || items[0], [items, activeIdx]);

  return (
    <div
      ref={containerRef}
      className={`modui-spatial-gallery modui-spatial-${variant} ${compact ? 'modui-spatial-compact' : ''} ${className}`}
      style={style}
      role="region"
      aria-label="Spatial Gallery"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      {...rest}
    >
      {/* Top HUD Telemetry Overlay */}
      {showHUD && !compact && currentItem && (
        <div className="modui-spatial-hud">
          <div className="modui-spatial-hud-left">
            <span className="modui-spatial-hud-pill">
              {currentItem.badge || `0${activeIdx + 1} / 0${totalItems}`}
            </span>
            <span className="modui-spatial-hud-cat">{currentItem.category || 'CASE STUDY'}</span>
          </div>
          <div className="modui-spatial-hud-right">
            <span className="modui-spatial-hud-dot" style={{ backgroundColor: currentItem.accentColor || '#3B82F6' }} />
            <span className="modui-spatial-hud-status">SPATIAL 3D · 120 FPS</span>
          </div>
        </div>
      )}

      {/* Main 3D Stage Viewport */}
      <div className="modui-spatial-viewport">
        <div className="modui-spatial-track">
          {items.map((item, index) => {
            // Calculate normalized circular offset relative to active card
            let offset = index - activeIdx;
            if (offset < -Math.floor(totalItems / 2)) offset += totalItems;
            if (offset > Math.floor(totalItems / 2)) offset -= totalItems;

            const isCurrent = offset === 0;
            const dist = Math.abs(offset);
            const isVisible = dist <= (compact ? 1 : 2);

            // 3D Cylindrical coordinates
            const spacing = compact ? 100 : 250;
            const translateX = offset * spacing;
            const translateZ = -dist * (compact ? 40 : 120);
            const rotateY = -offset * (compact ? 12 : 18);
            const scale = compact ? (isCurrent ? 1 : 0.8) : Math.max(0.65, 1 - dist * 0.14);
            const opacity = isVisible ? (compact ? (isCurrent ? 1 : 0.45) : Math.max(0.2, 1 - dist * 0.35)) : 0;

            return (
              <div
                key={item.id}
                className={`modui-spatial-card-slot ${isCurrent ? 'is-active' : ''}`}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex: 20 - dist,
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
              >
                {/* Mirror Ground Reflection */}
                {showReflection && (
                  <div className={`modui-spatial-reflection ${compact ? 'is-compact' : ''}`} aria-hidden="true">
                    <img src={item.src} alt="" className="modui-spatial-img-reflection" />
                    <div className="modui-spatial-reflection-gradient" />
                  </div>
                )}

                {/* Primary Card */}
                <div
                  className="modui-spatial-card"
                  role="button"
                  tabIndex={isCurrent ? 0 : -1}
                  aria-label={`${item.title} - ${item.category || ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!dragRef.current.hasDragged) {
                      if (!isCurrent) {
                        setActive(index);
                      } else if (enableLightbox && !compact) {
                        setInspectedItem(item);
                        onItemClick?.(item, index);
                      }
                    }
                  }}
                >
                  <div className="modui-spatial-card-media">
                    <img src={item.src} alt={item.alt || item.title} className="modui-spatial-card-img" />
                    <div className="modui-spatial-card-overlay" />
                    <div className="modui-spatial-specular-glare" />
                  </div>

                  {/* Card Content Footer */}
                  <div className="modui-spatial-card-info">
                    <div className="modui-spatial-card-top">
                      <span className="modui-spatial-card-badge" style={{ borderColor: item.accentColor || 'rgba(255,255,255,0.2)' }}>
                        {item.badge || `0${index + 1}`}
                      </span>
                      {item.category && <span className="modui-spatial-card-cat">{item.category}</span>}
                    </div>
                    <h3 className="modui-spatial-card-title">{item.title}</h3>
                    {item.subtitle && !compact && <p className="modui-spatial-card-sub">{item.subtitle}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ambient Diffused Horizon Ground Plane */}
        {showReflection && <div className={`modui-spatial-horizon-plane ${compact ? 'is-compact' : ''}`} aria-hidden="true" />}
      </div>

      {/* Navigation Controls Bar */}
      {showControls && !compact && (
        <div className="modui-spatial-controls">
          <button
            type="button"
            className="modui-spatial-nav-btn modui-spatial-prev"
            aria-label="Previous Project"
            onClick={prevSlide}
          >
            ←
          </button>

          <div className="modui-spatial-indicators" role="tablist" aria-label="Gallery Slides">
            {items.map((it, idx) => (
              <button
                key={it.id}
                type="button"
                role="tab"
                aria-selected={idx === activeIdx}
                aria-label={`Go to slide ${idx + 1}: ${it.title}`}
                className={`modui-spatial-dot ${idx === activeIdx ? 'is-active' : ''}`}
                style={idx === activeIdx ? { backgroundColor: it.accentColor || '#3B82F6', borderColor: it.accentColor || '#3B82F6' } : undefined}
                onClick={() => setActive(idx)}
              />
            ))}
          </div>

          <button
            type="button"
            className="modui-spatial-nav-btn modui-spatial-next"
            aria-label="Next Project"
            onClick={nextSlide}
          >
            →
          </button>
        </div>
      )}

      {/* Fullscreen Inspection Lightbox Modal */}
      {inspectedItem && (
        <div
          className="modui-spatial-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Inspect: ${inspectedItem.title}`}
          onClick={() => setInspectedItem(null)}
        >
          <div
            className="modui-spatial-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modui-spatial-modal-header">
              <div className="modui-spatial-modal-meta">
                <span className="modui-spatial-modal-badge">{inspectedItem.category || 'FEATURED CASE'}</span>
                <span className="modui-spatial-modal-id">{inspectedItem.badge || 'PROJ-2026'}</span>
              </div>
              <button
                type="button"
                className="modui-spatial-modal-close"
                aria-label="Close Lightbox"
                onClick={() => setInspectedItem(null)}
              >
                ✕
              </button>
            </div>

            <div className="modui-spatial-modal-media">
              <img src={inspectedItem.src} alt={inspectedItem.alt || inspectedItem.title} />
            </div>

            <div className="modui-spatial-modal-body">
              <h2 className="modui-spatial-modal-title">{inspectedItem.title}</h2>
              {inspectedItem.subtitle && (
                <p className="modui-spatial-modal-subtitle">{inspectedItem.subtitle}</p>
              )}
              {inspectedItem.description && (
                <p className="modui-spatial-modal-desc">{inspectedItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}

export default SpatialGallery;
