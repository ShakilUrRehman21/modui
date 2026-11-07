import React, { useState, useEffect, useCallback, useRef } from 'react';
import './PageTurnBook.css';

export interface PageItem {
  id: string;
  pageNumber: number;
  title: string;
  subtitle?: string;
  body: string;
  quote?: string;
  accentColor?: string;
}

export type PageTurnVariant = 'studio-editorial' | 'dark-obsidian' | 'blueprint';

export interface PageTurnBookProps {
  /** Array of pages to display (even number recommended for dual spreads) */
  pages?: PageItem[];
  /** Visual aesthetic theme */
  variant?: PageTurnVariant;
  /** Whether to play synthetic Web Audio paper rustle sound on page turns */
  soundEnabled?: boolean;
  /** Automatically advance pages on an interval */
  autoPlay?: boolean;
  /** Autoplay interval in milliseconds */
  autoPlayInterval?: number;
  /** Enable corner curl hover effect */
  interactiveCurl?: boolean;
  /** Compact mode optimized for catalogue cards and preview containers */
  compact?: boolean;
  /** Callback fired when page/spread changes */
  onPageChange?: (currentSpreadIndex: number) => void;
  /** Optional container class name */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

export const DEFAULT_BOOK_PAGES: PageItem[] = [
  {
    id: 'page-1',
    pageNumber: 1,
    title: 'The Art of Tactile Motion',
    subtitle: 'Kinetic Physics on the Web',
    body: 'True digital craft begins when code ceases to feel like pixels and starts behaving like matter. Every acceleration curve, friction decay, and spring constant communicates weight and material integrity to the human eye.',
    quote: 'Design is not what it looks like; it is how it reacts when touched.',
    accentColor: '#365CF5',
  },
  {
    id: 'page-2',
    pageNumber: 2,
    title: 'Zero Runtime Baggage',
    subtitle: 'Pure CSS Custom Properties',
    body: 'Heavy JavaScript animation loops throttle the main UI thread. ModUI decouples physical simulation into declarative CSS 3D transforms, allowing GPU raster engines to handle perspective projection and lighting.',
    quote: 'Eliminate runtime dependencies before optimizing them.',
    accentColor: '#FF735E',
  },
  {
    id: 'page-3',
    pageNumber: 3,
    title: 'Architectural Shadows',
    subtitle: 'Dynamic Paper Curvature',
    body: 'When a sheet of 120gsm bond paper flexes in space, light recedes into the fold while the crest catches ambient reflection. Our real-time specular gradient simulates natural subsurface light bounce as you turn each leaf.',
    quote: 'Light does not merely illuminate; it defines physical geometry.',
    accentColor: '#10B981',
  },
  {
    id: 'page-4',
    pageNumber: 4,
    title: 'Acoustic Presence',
    subtitle: 'Synthesized Paper Rustle',
    body: 'Visuals without haptics remain detached. ModUI incorporates micro-synthesized Web Audio white-noise bursts shaped by dual resonant bandpass filters to mimic dry fibrous cellulose sliding against bookbinding cloth.',
    quote: 'Sound transforms an interface from a flat glass screen into an artifact.',
    accentColor: '#8B5CF6',
  },
  {
    id: 'page-5',
    pageNumber: 5,
    title: 'Spatial Surfaces',
    subtitle: 'Next-Generation Gestures',
    body: 'From fluid trackpad inertia to touch drags, the interface respects pointer velocity. Release mid-turn and the spring damper computes whether the leaf snaps forward or settles gracefully back to rest.',
    quote: 'Motion should feel inevitable, never simulated.',
    accentColor: '#06B6D4',
  },
  {
    id: 'page-6',
    pageNumber: 6,
    title: 'Source Ownership',
    subtitle: 'Permanent Creative Independence',
    body: 'No walled gardens. ModUI drops entire primitives directly into your repository. You own every line of code, every CSS variable, and every physical interaction equation in perpetuity.',
    quote: 'The best dependencies are the ones you own completely.',
    accentColor: '#F59E0B',
  },
];

/**
 * Synthesizes a realistic two-stage tactile paper page-rustle sound via Web Audio API.
 */
function playPaperRustle() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const duration = 0.32;
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const output = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555;
      b1 = 0.99332 * b1 + white * 0.0750;
      b2 = 0.96900 * b2 + white * 0.1538;
      output[i] = (b0 + b1 + b2) * 0.18;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(950, ctx.currentTime + 0.22);
    filter.Q.setValueAtTime(2.2, ctx.currentTime);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start();
    noiseSource.stop(ctx.currentTime + 0.3);

    setTimeout(() => {
      try {
        if (ctx.state === 'closed') return;
        const landingBuffer = ctx.createBuffer(1, Math.floor(sampleRate * 0.08), sampleRate);
        const lOut = landingBuffer.getChannelData(0);
        for (let j = 0; j < lOut.length; j++) {
          lOut[j] = (Math.random() * 2 - 1) * 0.08;
        }
        const landSource = ctx.createBufferSource();
        landSource.buffer = landingBuffer;

        const landFilter = ctx.createBiquadFilter();
        landFilter.type = 'lowpass';
        landFilter.frequency.setValueAtTime(450, ctx.currentTime);

        const landGain = ctx.createGain();
        landGain.gain.setValueAtTime(0.06, ctx.currentTime);
        landGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);

        landSource.connect(landFilter);
        landFilter.connect(landGain);
        landGain.connect(ctx.destination);

        landSource.start();
        landSource.stop(ctx.currentTime + 0.08);
      } catch {
        // ignore
      }
    }, 420);

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 700);
  } catch {
    // Audio context may be restricted by browser autoplay policy
  }
}

export const PageTurnBook: React.FC<PageTurnBookProps> = ({
  pages = DEFAULT_BOOK_PAGES,
  variant = 'studio-editorial',
  soundEnabled = true,
  autoPlay = false,
  autoPlayInterval = 4500,
  interactiveCurl = true,
  compact = false,
  onPageChange,
  className = '',
  style,
}) => {
  const totalPages = pages.length;
  const totalSpreads = Math.ceil(totalPages / 2);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [turnState, setTurnState] = useState<'idle' | 'turning-forward' | 'turning-backward'>('idle');

  // Swipe / Touch support
  const touchStartXRef = useRef<number | null>(null);

  // Static leaves:
  const leftStaticPage =
    turnState === 'turning-backward'
      ? pages[(currentSpread - 1) * 2]
      : pages[currentSpread * 2];

  const rightStaticPage =
    turnState === 'turning-forward'
      ? pages[(currentSpread + 1) * 2 + 1]
      : pages[currentSpread * 2 + 1];

  // Dynamic turning leaf faces:
  const turningFrontPage =
    turnState === 'turning-backward'
      ? pages[(currentSpread - 1) * 2 + 1]
      : pages[currentSpread * 2 + 1];

  const turningBackPage =
    turnState === 'turning-backward'
      ? pages[currentSpread * 2]
      : pages[(currentSpread + 1) * 2];

  const handleTurnNext = useCallback(() => {
    if (turnState !== 'idle' || currentSpread >= totalSpreads - 1) return;

    if (soundEnabled) {
      playPaperRustle();
    }

    setTurnState('turning-forward');

    setTimeout(() => {
      setCurrentSpread((prev) => {
        const next = Math.min(prev + 1, totalSpreads - 1);
        onPageChange?.(next);
        return next;
      });
      setTurnState('idle');
    }, 720);
  }, [turnState, currentSpread, totalSpreads, soundEnabled, onPageChange]);

  const handleTurnPrev = useCallback(() => {
    if (turnState !== 'idle' || currentSpread <= 0) return;

    if (soundEnabled) {
      playPaperRustle();
    }

    setTurnState('turning-backward');

    setTimeout(() => {
      setCurrentSpread((prev) => {
        const next = Math.max(prev - 1, 0);
        onPageChange?.(next);
        return next;
      });
      setTurnState('idle');
    }, 720);
  }, [turnState, currentSpread, totalSpreads, soundEnabled, onPageChange]);

  // Autoplay timer
  useEffect(() => {
    if (!autoPlay || turnState !== 'idle') return;

    const timer = setInterval(() => {
      if (currentSpread >= totalSpreads - 1) {
        setCurrentSpread(0);
        onPageChange?.(0);
      } else {
        handleTurnNext();
      }
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, currentSpread, totalSpreads, turnState, handleTurnNext, onPageChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleTurnNext();
      } else if (e.key === 'ArrowLeft') {
        handleTurnPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTurnNext, handleTurnPrev]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const deltaX = touchStartXRef.current - e.changedTouches[0].clientX;
    touchStartXRef.current = null;

    if (deltaX > 50) {
      handleTurnNext();
    } else if (deltaX < -50) {
      handleTurnPrev();
    }
  };

  return (
    <div
      className={`modui-page-turn-book modui-page-turn--${variant} ${compact ? 'modui-page-turn--compact' : ''} ${className}`}
      style={style}
      role="region"
      aria-label="3D Interactive Page Turn Book"
    >
      {/* Outer Tabletop with Perspective */}
      <div className="modui-book-tabletop">
        <div
          className="modui-book-viewport"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Center Book Spine */}
          <div className="modui-book-spine" aria-hidden="true" />
          <div className="modui-book-spine-highlight" aria-hidden="true" />

          {/* LEFT STATIC PAGE (Click to turn previous) */}
          <div
            className="modui-book-leaf modui-book-leaf--left"
            onClick={handleTurnPrev}
            style={{ cursor: currentSpread > 0 && turnState === 'idle' ? 'pointer' : 'default' }}
            title={currentSpread > 0 ? 'Click to turn to previous page' : ''}
          >
            {leftStaticPage ? (
              <div className="modui-page-surface">
                <div className="modui-page-body-wrap">
                  <h3 className="modui-page-title">{leftStaticPage.title}</h3>
                  {leftStaticPage.subtitle && <h4 className="modui-page-subtitle">{leftStaticPage.subtitle}</h4>}
                  <p className="modui-page-prose">{leftStaticPage.body}</p>

                  {leftStaticPage.quote && (
                    <blockquote className="modui-page-quote">
                      "{leftStaticPage.quote}"
                    </blockquote>
                  )}
                </div>

                <div className="modui-page-footer">
                  <span className="modui-page-folio">— {leftStaticPage.pageNumber} —</span>
                </div>
              </div>
            ) : (
              <div className="modui-page-surface modui-page-surface--blank">
                <span className="modui-page-watermark">MODUI</span>
              </div>
            )}
            <div className="modui-leaf-shadow modui-leaf-shadow--left" />
          </div>

          {/* RIGHT STATIC PAGE (Click to turn next) */}
          <div
            className="modui-book-leaf modui-book-leaf--right"
            onClick={handleTurnNext}
            style={{ cursor: currentSpread < totalSpreads - 1 && turnState === 'idle' ? 'pointer' : 'default' }}
            title={currentSpread < totalSpreads - 1 ? 'Click to turn to next page' : ''}
          >
            {rightStaticPage ? (
              <div className="modui-page-surface">
                <div className="modui-page-body-wrap">
                  <h3 className="modui-page-title">{rightStaticPage.title}</h3>
                  {rightStaticPage.subtitle && <h4 className="modui-page-subtitle">{rightStaticPage.subtitle}</h4>}
                  <p className="modui-page-prose">{rightStaticPage.body}</p>

                  {rightStaticPage.quote && (
                    <blockquote className="modui-page-quote">
                      "{rightStaticPage.quote}"
                    </blockquote>
                  )}
                </div>

                <div className="modui-page-footer">
                  <span className="modui-page-folio">— {rightStaticPage.pageNumber} —</span>
                </div>
              </div>
            ) : (
              <div className="modui-page-surface modui-page-surface--blank">
                <span className="modui-page-watermark">END OF VOLUME</span>
              </div>
            )}

            {/* Tactile Curved Corner Dog-Ear Curl */}
            {interactiveCurl && !compact && currentSpread < totalSpreads - 1 && turnState === 'idle' && (
              <div
                className="modui-corner-curl"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTurnNext();
                }}
                title="Click to turn to next page"
                role="button"
                tabIndex={0}
                aria-label="Turn to next page"
              >
                <div className="modui-corner-curl-dogear" />
              </div>
            )}

            <div className="modui-leaf-shadow modui-leaf-shadow--right" />
          </div>

          {/* DYNAMIC AMBIENT CAST SHADOW BENEATH LIFTING LEAF */}
          {turnState !== 'idle' && (
            <div
              className={`modui-leaf-cast-shadow ${
                turnState === 'turning-backward' ? 'modui-leaf-cast-shadow--left' : 'modui-leaf-cast-shadow--right'
              }`}
              aria-hidden="true"
            />
          )}

          {/* TURNING DYNAMIC 3D LEAF (Double-Sided with True Soft Bending Curvature) */}
          {turnState !== 'idle' && (
            <div
              className={`modui-turning-leaf ${
                turnState === 'turning-forward'
                  ? 'modui-turning-leaf--forward'
                  : 'modui-turning-leaf--backward'
              }`}
            >
              {/* Front face of turning sheet */}
              <div className="modui-turning-face modui-turning-face--front">
                {turningFrontPage && (
                  <div className="modui-page-surface">
                    <div className="modui-page-body-wrap">
                      <h3 className="modui-page-title">{turningFrontPage.title}</h3>
                      {turningFrontPage.subtitle && <h4 className="modui-page-subtitle">{turningFrontPage.subtitle}</h4>}
                      <p className="modui-page-prose">{turningFrontPage.body}</p>
                    </div>
                    <div className="modui-page-footer">
                      <span className="modui-page-folio">— {turningFrontPage.pageNumber} —</span>
                    </div>
                  </div>
                )}
                {/* Diffuse Cylindrical Specular Glare & Trough Shadow */}
                <div className="modui-paper-specular" />
              </div>

              {/* Back face of turning sheet */}
              <div className="modui-turning-face modui-turning-face--back">
                {turningBackPage && (
                  <div className="modui-page-surface">
                    <div className="modui-page-body-wrap">
                      <h3 className="modui-page-title">{turningBackPage.title}</h3>
                      {turningBackPage.subtitle && <h4 className="modui-page-subtitle">{turningBackPage.subtitle}</h4>}
                      <p className="modui-page-prose">{turningBackPage.body}</p>
                    </div>
                    <div className="modui-page-footer">
                      <span className="modui-page-folio">— {turningBackPage.pageNumber} —</span>
                    </div>
                  </div>
                )}
                <div className="modui-paper-specular" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tactile Navigation Bar & Page Progress Indicator (Hidden in compact card mode) */}
      {!compact && (
        <div className="modui-book-toolbar">
          <button
            type="button"
            className="modui-book-nav-btn"
            onClick={handleTurnPrev}
            disabled={currentSpread <= 0 || turnState !== 'idle'}
            aria-label="Previous spread"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Prev Page</span>
          </button>

          {/* Spread progress dots */}
          <div className="modui-book-spread-dots" role="tablist" aria-label="Page spreads">
            {Array.from({ length: totalSpreads }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={currentSpread === idx}
                className={`modui-spread-dot ${currentSpread === idx ? 'modui-spread-dot--active' : ''}`}
                onClick={() => {
                  if (turnState === 'idle' && idx !== currentSpread) {
                    if (idx > currentSpread) handleTurnNext();
                    else handleTurnPrev();
                  }
                }}
                aria-label={`Spread ${idx + 1}`}
              />
            ))}
          </div>

          <div className="modui-book-page-counter">
            <span className="modui-book-counter-current">
              {leftStaticPage ? leftStaticPage.pageNumber : ''}-{rightStaticPage ? rightStaticPage.pageNumber : ''}
            </span>
            <span className="modui-book-counter-sep">/</span>
            <span className="modui-book-counter-total">{totalPages}</span>
          </div>

          <button
            type="button"
            className="modui-book-nav-btn"
            onClick={handleTurnNext}
            disabled={currentSpread >= totalSpreads - 1 || turnState !== 'idle'}
            aria-label="Next spread"
          >
            <span>Next Page</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default PageTurnBook;
