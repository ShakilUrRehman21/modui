import React, { useRef, useState, useCallback, useEffect } from 'react';
import './FilmstripGallery.css';

export type FilmstripVariant = 'studio-light' | 'warm-editorial' | 'minimal-mono' | 'cinema-dark';

export interface FilmstripItem {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  src: string;
  alt?: string;
  aspectRatio?: '16/9' | '4/3' | '3/2' | '1/1';
}

export interface FilmstripGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual theme finish (default: 'studio-light') */
  variant?: FilmstripVariant;
  /** Gallery stills and media frames */
  items?: FilmstripItem[];
  /** Render authentic top and bottom 35mm sprocket perforations */
  showSprockets?: boolean;
  /** Display cinematic frame numbers */
  showFrameNumbers?: boolean;
  /** Synthesize analog sprocket clicks and camera shutter sounds */
  soundEnabled?: boolean;
  /** Enable lightbox inspection modal */
  enableLightbox?: boolean;
  /** Compact card mode for catalogue explorer cards */
  compact?: boolean;
  /** Active frame index (controlled) */
  activeIndex?: number;
  /** Callback invoked when a frame is clicked or inspected */
  onFrameSelect?: (item: FilmstripItem, index: number) => void;
  /** Optional custom child elements */
  children?: React.ReactNode;
}

export const DEFAULT_FILMSTRIP_ITEMS: FilmstripItem[] = [
  {
    id: 'frame-01',
    title: 'Monolith Horizon',
    subtitle: 'Brutalist glass tower catching morning dusk reflections in Ginza',
    category: 'Architecture',
    src: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
    alt: 'Glass architectural monolith catching dusk reflections',
  },
  {
    id: 'frame-02',
    title: 'Kinetic Facade',
    subtitle: 'Parametric origami facade shifting geometric shadows under solar zenith',
    category: 'Structure',
    src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    alt: 'Geometric corporate skyscraper reaching into the sky',
  },
  {
    id: 'frame-03',
    title: 'Specular Prism',
    subtitle: 'Subpixel dispersion through crystal glass refraction block',
    category: 'Optics',
    src: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
    alt: 'Crystal specimen refracting rainbow spectrum caustics',
  },
  {
    id: 'frame-04',
    title: 'Expressway Trails',
    subtitle: 'Long exposure light trails weaving through elevated Tokyo expressways',
    category: 'Motion',
    src: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    alt: 'Light trails of vehicles speeding on a city highway at night',
  },
  {
    id: 'frame-05',
    title: 'Vapour Pines',
    subtitle: 'Atmospheric volumetric fog diffusing golden hour light through pines',
    category: 'Atmosphere',
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    alt: 'Misty golden pine forest with sunbeams',
  },
  {
    id: 'frame-06',
    title: 'Tidal Dune',
    subtitle: 'Minimalist tidal salt flats meeting distant volcanic silhouette at dusk',
    category: 'Minimalism',
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    alt: 'Minimalist tidal beach shore at sunset',
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

function playSprocketClick() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.015);
    gain.gain.setValueAtTime(0.025, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.02);
  } catch {
    // fallback
  }
}

function playShutterSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(950, t);
    osc1.frequency.exponentialRampToValueAtTime(250, t + 0.02);
    gain1.gain.setValueAtTime(0.035, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.025);

    const t2 = t + 0.03;
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(650, t2);
    osc2.frequency.exponentialRampToValueAtTime(160, t2 + 0.035);
    gain2.gain.setValueAtTime(0.035, t2);
    gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.035);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t2);
    osc2.stop(t2 + 0.04);
  } catch {
    // fallback
  }
}

export const FilmstripGallery: React.FC<FilmstripGalleryProps> = ({
  variant = 'studio-light',
  items = DEFAULT_FILMSTRIP_ITEMS,
  showSprockets = true,
  showFrameNumbers = true,
  soundEnabled = true,
  enableLightbox = true,
  compact = false,
  activeIndex: controlledIndex,
  onFrameSelect,
  className = '',
  children,
  ...restProps
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [internalActiveIndex, setInternalActiveIndex] = useState(0);
  const [lightboxItem, setLightboxItem] = useState<FilmstripItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalActiveIndex;

  const triggerSound = useCallback(
    (type: 'sprocket' | 'shutter') => {
      if (!soundEnabled) return;
      if (type === 'sprocket') playSprocketClick();
      else if (type === 'shutter') playShutterSound();
    },
    [soundEnabled]
  );

  const scrollToFrame = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const validIndex = Math.max(0, Math.min(items.length - 1, index));
      const frameEl = track.children[validIndex] as HTMLElement | undefined;
      if (frameEl) {
        const targetLeft = frameEl.offsetLeft - track.offsetWidth / 2 + frameEl.offsetWidth / 2;
        track.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
      }
      setInternalActiveIndex(validIndex);
      triggerSound('sprocket');
    },
    [items.length, triggerSound]
  );

  const handleFrameClick = useCallback(
    (item: FilmstripItem, index: number) => {
      if (hasScrolled) return;
      setInternalActiveIndex(index);
      if (onFrameSelect) onFrameSelect(item, index);
      triggerSound('shutter');
      if (enableLightbox && !compact) {
        setLightboxItem(item);
      }
    },
    [hasScrolled, onFrameSelect, triggerSound, enableLightbox, compact]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return;
    setIsDragging(true);
    setStartX(e.pageX - track.offsetLeft);
    setScrollLeftState(track.scrollLeft);
    setHasScrolled(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const track = trackRef.current;
    if (!track) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.35;
    if (Math.abs(walk) > 4) {
      setHasScrolled(true);
    }
    track.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!lightboxItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxItem(null);
      } else if (e.key === 'ArrowRight') {
        const currentIndex = items.findIndex((i) => i.id === lightboxItem.id);
        const nextIndex = (currentIndex + 1) % items.length;
        setLightboxItem(items[nextIndex]);
        setInternalActiveIndex(nextIndex);
        triggerSound('sprocket');
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = items.findIndex((i) => i.id === lightboxItem.id);
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        setLightboxItem(items[prevIndex]);
        setInternalActiveIndex(prevIndex);
        triggerSound('sprocket');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxItem, items, triggerSound]);

  const sprocketCount = compact ? 24 : 40;
  const sprocketHoles = Array.from({ length: sprocketCount }, (_, i) => i);

  return (
    <div
      ref={containerRef}
      className={`modui-filmstrip-gallery modui-filmstrip-theme-${variant} ${compact ? 'modui-filmstrip-compact' : ''} ${className}`}
      role="region"
      aria-label="Filmstrip Gallery"
      {...restProps}
    >
      {/* 35mm Sprocket Top Rail */}
      {showSprockets && (
        <div className="modui-filmstrip-sprocket-rail modui-filmstrip-sprocket-rail-top" aria-hidden="true">
          <div className="modui-filmstrip-sprockets">
            {sprocketHoles.map((idx) => (
              <span key={idx} className="modui-filmstrip-hole" />
            ))}
          </div>
        </div>
      )}

      {/* Header Info & Controls (Hidden in compact mode) */}
      {!compact && (
        <div className="modui-filmstrip-header">
          <div className="modui-filmstrip-header-info">
            <span className="modui-filmstrip-counter">
              {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </span>
          </div>
          <div className="modui-filmstrip-actions">
            <button
              type="button"
              className="modui-filmstrip-nav-btn"
              onClick={() => scrollToFrame(activeIndex - 1)}
              disabled={activeIndex <= 0}
              aria-label="Previous frame"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              className="modui-filmstrip-nav-btn"
              onClick={() => scrollToFrame(activeIndex + 1)}
              disabled={activeIndex >= items.length - 1}
              aria-label="Next frame"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Horizontal Film Reel Track */}
      <div
        ref={trackRef}
        className={`modui-filmstrip-track ${isDragging ? 'modui-filmstrip-is-dragging' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const frameNumStr = String(index + 1).padStart(2, '0');

          return (
            <div
              key={item.id}
              className={`modui-filmstrip-frame ${isActive ? 'modui-filmstrip-frame-active' : ''}`}
              role="button"
              tabIndex={0}
              aria-label={`Frame ${frameNumStr}: ${item.title}`}
              onClick={() => handleFrameClick(item, index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleFrameClick(item, index);
                } else if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  scrollToFrame(index + 1);
                } else if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  scrollToFrame(index - 1);
                }
              }}
            >
              <div className="modui-filmstrip-media-container">
                <img
                  src={item.src}
                  alt={item.alt || item.title}
                  loading="lazy"
                  className="modui-filmstrip-image"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="modui-filmstrip-media-fallback" aria-hidden="true" />
                {showFrameNumbers && (
                  <span className="modui-filmstrip-frame-num" aria-hidden="true">
                    {frameNumStr}
                  </span>
                )}
              </div>

              <div className="modui-filmstrip-frame-caption">
                <h4 className="modui-filmstrip-frame-title">{item.title}</h4>
                {item.category && (
                  <span className="modui-filmstrip-frame-cat">{item.category}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 35mm Sprocket Bottom Rail */}
      {showSprockets && (
        <div className="modui-filmstrip-sprocket-rail modui-filmstrip-sprocket-rail-bottom" aria-hidden="true">
          <div className="modui-filmstrip-sprockets">
            {sprocketHoles.map((idx) => (
              <span key={idx} className="modui-filmstrip-hole" />
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          className="modui-filmstrip-lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`Expanded Frame: ${lightboxItem.title}`}
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="modui-filmstrip-lightbox-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modui-filmstrip-lightbox-close"
              onClick={() => setLightboxItem(null)}
              aria-label="Close lightbox"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="modui-filmstrip-lightbox-content">
              <div className="modui-filmstrip-lightbox-image-wrap">
                <img
                  src={lightboxItem.src}
                  alt={lightboxItem.alt || lightboxItem.title}
                  className="modui-filmstrip-lightbox-image"
                />
              </div>

              <div className="modui-filmstrip-lightbox-meta-panel">
                {lightboxItem.category && (
                  <span className="modui-filmstrip-lightbox-cat">{lightboxItem.category}</span>
                )}
                <h3 className="modui-filmstrip-lightbox-title">{lightboxItem.title}</h3>
                {lightboxItem.subtitle && (
                  <p className="modui-filmstrip-lightbox-desc">{lightboxItem.subtitle}</p>
                )}

                <div className="modui-filmstrip-lightbox-footer">
                  <span className="modui-filmstrip-lightbox-hint">
                    Press <kbd>←</kbd> <kbd>→</kbd> to cycle, <kbd>ESC</kbd> to close
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

export default FilmstripGallery;
