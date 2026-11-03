import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './InfiniteCanvasGallery.css';

export type CanvasGalleryVariant = 'studio-light' | 'dark-slate' | 'editorial-paper' | 'minimal-mono';

export interface CanvasGalleryItem {
  id: string;
  index: string;
  title: string;
  category: string;
  year: string;
  tag: string;
  imageUrl: string;
  accentColor?: string;
  description?: string;
  linkUrl?: string;
}

export interface InfiniteCanvasGalleryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Visual theme matching platform design system (default: 'studio-light') */
  variant?: CanvasGalleryVariant;
  /** Array of gallery items to populate the infinite space */
  items?: CanvasGalleryItem[];
  /** Friction damping coefficient for momentum fling decay (default: 0.94) */
  friction?: number;
  /** Whether to render the corner Radar Minimap HUD (default: true) */
  showMinimap?: boolean;
  /** Whether to show the bottom-left navigation controls (default: true) */
  showToolbar?: boolean;
  /** Synthesize subtle micro-haptic acoustic ticks on interaction (default: true) */
  soundEnabled?: boolean;
  /** Compact card preview mode for explorer catalogue cards */
  compact?: boolean;
  /** Initial canvas offset coordinates */
  initialPosition?: { x: number; y: number };
  /** Callback fired when an item card is clicked */
  onItemClick?: (item: CanvasGalleryItem) => void;
  /** Callback fired when an item is hovered */
  onItemHover?: (item: CanvasGalleryItem | null) => void;
  /** Callback fired on pan or velocity update */
  onPositionChange?: (pos: { x: number; y: number; speed: number }) => void;
  /** Active inspected gallery item (controlled mode) */
  inspectedItem?: CanvasGalleryItem | null;
  /** Callback fired when an item is inspected or dismissed */
  onInspectItem?: (item: CanvasGalleryItem | null) => void;
}

export const DEFAULT_CANVAS_ITEMS: CanvasGalleryItem[] = [
  {
    id: 'canvas-1',
    index: '01',
    title: 'Kroma Optical Caustics',
    category: 'Light Simulation',
    year: '2026',
    tag: 'GLSL',
    accentColor: '#365CF5',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    description: 'Real-time raymarching caustic dispersion with dynamic Snell refraction.',
  },
  {
    id: 'canvas-2',
    index: '02',
    title: 'Aether Spatial Studio',
    category: 'Hardware Architecture',
    year: '2025',
    tag: 'CNC',
    accentColor: '#10B981',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    description: 'Anodized 6061 aluminum enclosure with tactile rotary potentiometers.',
  },
  {
    id: 'canvas-3',
    index: '03',
    title: 'Verlet Structural Cloth',
    category: 'Physics Engine',
    year: '2026',
    tag: 'MATH',
    accentColor: '#8B5CF6',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    description: '2D particle relaxation grid with elastic tension and tear physics.',
  },
  {
    id: 'canvas-4',
    index: '04',
    title: 'Chronos Dual Watch',
    category: 'Horology Design',
    year: '2025',
    tag: 'LUX',
    accentColor: '#F59E0B',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    description: 'Dual-barrel mechanical escapement with hand-beveled titanium bridges.',
  },
  {
    id: 'canvas-5',
    index: '05',
    title: 'Neo Helsinki Biennale',
    category: 'Editorial Identity',
    year: '2024',
    tag: 'PRINT',
    accentColor: '#EC4899',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    description: 'Bilingual exhibition pavilion catalogue with kinetic Swiss typography.',
  },
  {
    id: 'canvas-6',
    index: '06',
    title: 'Aperture Iris Mechanical',
    category: 'Camera Optics',
    year: '2026',
    tag: 'F/1.4',
    accentColor: '#06B6D4',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
    description: 'Twelve-blade stepless circular diaphragm for creamy out-of-focus specular bokeh.',
  },
  {
    id: 'canvas-7',
    index: '07',
    title: 'Neural Graph Topology',
    category: 'Data Visualization',
    year: '2025',
    tag: 'NODE',
    accentColor: '#6366F1',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    description: 'Multi-cluster high-dimensional embedding projection with force-directed springs.',
  },
  {
    id: 'canvas-8',
    index: '08',
    title: 'Reel Tape Transport',
    category: 'Audio Mechanics',
    year: '2024',
    tag: 'HIFI',
    accentColor: '#D97706',
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
    description: 'Authentic 15 IPS magnetic tape player with analog VU meters and tape hiss.',
  },
  {
    id: 'canvas-9',
    index: '09',
    title: 'Polaroid Instant Lab',
    category: 'Analog Artifact',
    year: '2025',
    tag: 'CHEM',
    accentColor: '#EF4444',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
    description: 'Silver halide instant chemical emulsion with realistic development curve.',
  },
  {
    id: 'canvas-10',
    index: '10',
    title: 'Cyber Stream Matrix',
    category: 'Terminal Shading',
    year: '2026',
    tag: 'CRT',
    accentColor: '#14B8A6',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    description: 'Phosphor green matrix terminal cascade with authentic scanline jitter.',
  },
  {
    id: 'canvas-11',
    index: '11',
    title: 'Radial Orbit Hub',
    category: 'Circular Navigation',
    year: '2025',
    tag: 'ARIA',
    accentColor: '#84CC16',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    description: 'Planetary satellite command hub with polar coordinate magnetic snapping.',
  },
  {
    id: 'canvas-12',
    index: '12',
    title: 'Chromatic Prism Lens',
    category: 'Spectral Dispersion',
    year: '2026',
    tag: 'RGB',
    accentColor: '#A855F7',
    imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80',
    description: 'Prismatic crystal refraction splitting pure white incident light into spectrum.',
  },
];

export const InfiniteCanvasGallery: React.FC<InfiniteCanvasGalleryProps> = ({
  variant = 'studio-light',
  items = DEFAULT_CANVAS_ITEMS,
  friction = 0.94,
  showMinimap = true,
  showToolbar = true,
  soundEnabled = true,
  compact = false,
  initialPosition,
  inspectedItem: controlledInspectedItem,
  onInspectItem,
  onItemClick,
  onItemHover,
  onPositionChange,
  className = '',
  ...restProps
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Canvas spatial coordinates & physics state
  const [pan, setPan] = useState<{ x: number; y: number }>(initialPosition || { x: 0, y: 0 });
  const [velocity, setVelocity] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [activeItem, setActiveItem] = useState<CanvasGalleryItem | null>(null);

  // Inspected Item Lightbox State
  const [internalInspectedItem, setInternalInspectedItem] = useState<CanvasGalleryItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const inspected = controlledInspectedItem !== undefined ? controlledInspectedItem : internalInspectedItem;

  // Drag tracking refs
  const dragRef = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    isPointerDown: false,
    hasDragged: false,
  });

  // Grid dimensions
  const COLS = 4;
  const ROWS = 3;
  const CARD_WIDTH = compact ? 120 : 230;
  const CARD_HEIGHT = compact ? 105 : 200;
  const GAP_X = compact ? 16 : 32;
  const GAP_Y = compact ? 16 : 32;
  const CELL_W = CARD_WIDTH + GAP_X;
  const CELL_H = CARD_HEIGHT + GAP_Y;
  const TOTAL_W = COLS * CELL_W;
  const TOTAL_H = ROWS * CELL_H;

  // Web Audio Micro-Haptic Synthesis
  const playTickSound = useCallback(
    (freq = 1200, duration = 0.018) => {
      if (!soundEnabled || typeof window === 'undefined') return;
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioCtx();
        }
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.45, ctx.currentTime + duration);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        // AudioContext not allowed or not supported
      }
    },
    [soundEnabled]
  );

  // Continuous Toroidal modulo helper
  const mod = (n: number, m: number) => ((n % m) + m) % m;

  // Real-time Physics Render Loop
  useEffect(() => {
    let animFrame: number;

    const tick = () => {
      if (!dragRef.current.isPointerDown) {
        setVelocity((prevVel) => {
          if (Math.abs(prevVel.x) < 0.01 && Math.abs(prevVel.y) < 0.01) {
            return { x: 0, y: 0 };
          }
          return {
            x: prevVel.x * friction,
            y: prevVel.y * friction,
          };
        });

        setPan((prevPan) => {
          if (Math.abs(velocity.x) > 0.01 || Math.abs(velocity.y) > 0.01) {
            const nextPan = {
              x: prevPan.x + velocity.x,
              y: prevPan.y + velocity.y,
            };
            if (onPositionChange) {
              const speed = Math.hypot(velocity.x, velocity.y) * 60;
              onPositionChange({ x: nextPan.x, y: nextPan.y, speed });
            }
            return nextPan;
          }
          return prevPan;
        });
      }

      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [friction, velocity, onPositionChange]);

  // Pointer Down
  // Pointer Down (Drag Start Candidate)
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (inspected) return; // Prevent canvas dragging while inspected image modal is active

    // Bypass canvas drag tracking if user clicked on action buttons or inspect hints
    const target = e.target as HTMLElement;
    if (target.closest('.modui-card-inspect-hint') || target.closest('button')) {
      return;
    }

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      lastTime: performance.now(),
      isPointerDown: true,
      hasDragged: false,
    };
    setVelocity({ x: 0, y: 0 });
  }, [inspected]);

  // Pointer Move
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isPointerDown) return;

    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    const totalDist = Math.hypot(e.clientX - dragRef.current.startX, e.clientY - dragRef.current.startY);

    // Enforce 4px drag deadzone so mouse clicks do not inadvertently trigger panning
    if (!dragRef.current.hasDragged) {
      if (totalDist < 4) return;
      dragRef.current.hasDragged = true;
      setIsDragging(true);

      if (viewportRef.current) {
        try {
          viewportRef.current.setPointerCapture(e.pointerId);
        } catch {
          // Pointer capture may fail on certain browsers
        }
      }
    }

    const now = performance.now();
    const dt = Math.max(1, now - dragRef.current.lastTime);

    setPan((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    // Instantaneous velocity scaled to 60fps
    const vx = (dx / dt) * 16.6;
    const vy = (dy / dt) * 16.6;
    setVelocity({ x: vx, y: vy });

    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
    dragRef.current.lastTime = now;
  }, []);

  // Pointer Up / Cancel
  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (dragRef.current.isPointerDown) {
        const wasDragged = dragRef.current.hasDragged;
        dragRef.current.isPointerDown = false;
        setIsDragging(false);

        if (viewportRef.current) {
          try {
            viewportRef.current.releasePointerCapture(e.pointerId);
          } catch {
            // Safe release
          }
        }

        if (wasDragged && Math.hypot(velocity.x, velocity.y) > 6) {
          playTickSound(900, 0.03);
        }
      }
    },
    [velocity, playTickSound]
  );

  // Inspect Modal Open / Close Handlers
  const handleInspect = useCallback(
    (item: CanvasGalleryItem) => {
      if (compact) return; // Do not open modal in compact preview mode
      setInternalInspectedItem(item);
      if (onInspectItem) onInspectItem(item);
      playTickSound(1800, 0.04);
    },
    [compact, onInspectItem, playTickSound]
  );

  const handleCloseInspect = useCallback(() => {
    setInternalInspectedItem(null);
    setIsFullscreen(false);
    if (onInspectItem) onInspectItem(null);
    playTickSound(900, 0.03);
  }, [onInspectItem, playTickSound]);

  const currentIndex = inspected ? items.findIndex((it) => it.id === inspected.id) : -1;

  const handlePrevInspect = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (!inspected || items.length === 0) return;
      const prevIdx = (currentIndex - 1 + items.length) % items.length;
      const nextItem = items[prevIdx];
      setInternalInspectedItem(nextItem);
      if (onInspectItem) onInspectItem(nextItem);
      playTickSound(1400, 0.02);
    },
    [inspected, items, currentIndex, onInspectItem, playTickSound]
  );

  const handleNextInspect = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (!inspected || items.length === 0) return;
      const nextIdx = (currentIndex + 1) % items.length;
      const nextItem = items[nextIdx];
      setInternalInspectedItem(nextItem);
      if (onInspectItem) onInspectItem(nextItem);
      playTickSound(1400, 0.02);
    },
    [inspected, items, currentIndex, onInspectItem, playTickSound]
  );

  // Keyboard Navigation (Arrow Keys + Home + Escape/Arrows for Inspector)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (inspected) {
        if (e.key === 'Escape') {
          e.preventDefault();
          handleCloseInspect();
          return;
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrevInspect();
          return;
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextInspect();
          return;
        }
        if (e.key === 'f' || e.key === 'F') {
          e.preventDefault();
          setIsFullscreen((prev) => !prev);
          return;
        }
        return;
      }

      const step = e.shiftKey ? 80 : 35;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setPan((p) => ({ ...p, x: p.x + step }));
        setVelocity({ x: 12, y: 0 });
        playTickSound(1100, 0.015);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setPan((p) => ({ ...p, x: p.x - step }));
        setVelocity({ x: -12, y: 0 });
        playTickSound(1100, 0.015);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setPan((p) => ({ ...p, y: p.y + step }));
        setVelocity({ x: 0, y: 12 });
        playTickSound(1100, 0.015);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setPan((p) => ({ ...p, y: p.y - step }));
        setVelocity({ x: 0, y: -12 });
        playTickSound(1100, 0.015);
      } else if (e.key === 'Home') {
        e.preventDefault();
        setPan({ x: 0, y: 0 });
        setVelocity({ x: 0, y: 0 });
        playTickSound(800, 0.03);
      }
    },
    [inspected, handleCloseInspect, handlePrevInspect, handleNextInspect, playTickSound]
  );

  // Center Origin Handler
  const handleCenter = useCallback(() => {
    setPan({ x: 0, y: 0 });
    setVelocity({ x: 0, y: 0 });
    playTickSound(800, 0.03);
  }, [playTickSound]);

  // Random Fling Handler
  const handleFlingRandom = useCallback(() => {
    const rvx = (Math.random() - 0.5) * 36;
    const rvy = (Math.random() - 0.5) * 36;
    setVelocity({ x: rvx, y: rvy });
    playTickSound(1300, 0.025);
  }, [playTickSound]);

  // Card Hover
  const handleCardMouseEnter = useCallback(
    (item: CanvasGalleryItem) => {
      setActiveItem(item);
      playTickSound(1400, 0.012);
      if (onItemHover) onItemHover(item);
    },
    [playTickSound, onItemHover]
  );

  const handleCardMouseLeave = useCallback(() => {
    setActiveItem(null);
    if (onItemHover) onItemHover(null);
  }, [onItemHover]);

  // Card Click: Open Inspected High-Res Lightbox Modal
  const handleCardClick = useCallback(
    (e: React.MouseEvent, item: CanvasGalleryItem) => {
      e.stopPropagation();
      if (dragRef.current.hasDragged) return;
      playTickSound(1600, 0.025);
      if (onItemClick) onItemClick(item);
      handleInspect(item);
    },
    [playTickSound, onItemClick, handleInspect]
  );

  // Render cards computed positions
  const computedCards = useMemo(() => {
    return items.map((item, index) => {
      const c = index % COLS;
      const r = Math.floor(index / COLS);
      const baseX = c * CELL_W;
      const baseY = r * CELL_H;

      // World coordinates
      const worldX = baseX + pan.x;
      const worldY = baseY + pan.y;

      // Toroidal continuous modulo wrapping
      const screenX = mod(worldX + CARD_WIDTH, TOTAL_W) - CARD_WIDTH;
      const screenY = mod(worldY + CARD_HEIGHT, TOTAL_H) - CARD_HEIGHT;

      return {
        item,
        screenX,
        screenY,
      };
    });
  }, [items, pan.x, pan.y, COLS, CELL_W, CELL_H, CARD_WIDTH, CARD_HEIGHT, TOTAL_W, TOTAL_H]);

  // Minimap position ratio (0 to 1)
  const normX = mod(-pan.x, TOTAL_W) / TOTAL_W;
  const normY = mod(-pan.y, TOTAL_H) / TOTAL_H;
  const currentSpeed = Math.round(Math.hypot(velocity.x, velocity.y) * 60);

  return (
    <div
      ref={viewportRef}
      className={`modui-infinite-gallery modui-infinite-gallery--${variant} ${compact ? 'modui-infinite-gallery--compact' : ''} ${className}`}
      role="region"
      aria-label="Infinite 360-degree media canvas gallery"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      {...restProps}
    >
      {/* Background Infinite Radial Dot Grid */}
      <div
        className="modui-infinite-bg-grid"
        style={{
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
        aria-hidden="true"
      />

      {/* Cards Container */}
      <div className="modui-infinite-cards-plane">
        {computedCards.map(({ item, screenX, screenY }) => {
          const isHovered = activeItem?.id === item.id;

          return (
            <div
              key={item.id}
              className={`modui-gallery-card ${isHovered ? 'is-hovered' : ''}`}
              style={{
                width: `${CARD_WIDTH}px`,
                height: `${CARD_HEIGHT}px`,
                transform: `translate3d(${screenX.toFixed(1)}px, ${screenY.toFixed(1)}px, 0)`,
              }}
              onMouseEnter={() => handleCardMouseEnter(item)}
              onMouseLeave={handleCardMouseLeave}
              onClick={(e) => handleCardClick(e, item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleInspect(item);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`${item.title} - ${item.category}`}
            >
              <div
                className="modui-card-media-wrap"
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleInspect(item);
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="modui-card-img"
                  loading="lazy"
                  draggable={false}
                />
                <span className="modui-card-tag-badge">{item.tag}</span>
              </div>

              <div className="modui-card-info-wrap">
                <div className="modui-card-cat-label">{item.category}</div>
                <div className="modui-card-title-label">{item.title}</div>
                <div className="modui-card-meta-row">
                  <span className="modui-card-index-spec">#{item.index}</span>
                  <span
                    className="modui-card-inspect-hint"
                    role="button"
                    tabIndex={0}
                    aria-label={`Inspect ${item.title}`}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleInspect(item);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        handleInspect(item);
                      }
                    }}
                  >
                    Inspect →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= FULL MODE OVERLAYS ================= */}
      {!compact && (
        <>
          {/* Top Left Coordinates & Telemetry HUD */}
          <div className="modui-infinite-coords-hud" aria-hidden="true">
            <div className="modui-coords-pill">
              <span className="modui-coords-pulse-dot" />
              <span className="modui-coords-label">POS:</span>
              <span className="modui-coords-val">
                X: {Math.round(-pan.x)} · Y: {Math.round(-pan.y)}
              </span>
            </div>
            <div className="modui-velocity-pill">
              <span>VEL:</span>
              <span className="modui-velocity-val">{currentSpeed} px/s</span>
            </div>
          </div>

          {/* Top Right Instruction Pill */}
          <div className="modui-infinite-instruction-pill" aria-hidden="true">
            <span className="modui-instruction-spark">✦</span>
            <span>360° Drag & Fling Canvas</span>
          </div>

          {/* Bottom Left Toolbar Controls */}
          {showToolbar && (
            <div className="modui-infinite-controls">
              <button
                type="button"
                className="modui-infinite-btn"
                onClick={handleCenter}
                title="Center Origin (Home key)"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
                </svg>
                <span>Origin</span>
              </button>
              <button
                type="button"
                className="modui-infinite-btn modui-infinite-btn--subtle"
                onClick={handleFlingRandom}
                title="Trigger Random Momentum Fling"
              >
                <span>Fling ↗</span>
              </button>
            </div>
          )}

          {/* Bottom Right Radar Minimap HUD */}
          {showMinimap && (
            <div className="modui-radar-minimap" aria-hidden="true">
              <div className="modui-radar-header">
                <span>RADAR</span>
                <span className="modui-radar-spec">TOROID</span>
              </div>
              <div className="modui-radar-field">
                <div
                  className="modui-radar-indicator"
                  style={{
                    transform: `translate3d(${(normX * 58).toFixed(1)}px, ${(normY * 34).toFixed(1)}px, 0)`,
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* ================= COMPACT MODE (Explorer Card Mode) ================= */}
      {compact && (
        <div className="modui-compact-canvas-overlay" aria-hidden="true">
          <div className="modui-compact-radar-chip">
            <span className="modui-coords-pulse-dot" />
            <span>360° SPATIAL GRID</span>
          </div>
          <div className="modui-compact-action-hint">
            <span>Drag to Pan</span>
          </div>
        </div>
      )}

      {/* ================= INSPECTED IMAGE LIGHTBOX MODAL ================= */}
      {inspected && (
        <div
          className={`modui-gallery-inspector-modal ${isFullscreen ? 'modui-gallery-inspector-modal--fullscreen' : ''}`}
          onClick={handleCloseInspect}
          role="dialog"
          aria-modal="true"
          aria-label={`Inspected Image: ${inspected.title}`}
        >
          <div
            className="modui-gallery-inspector-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header HUD */}
            <div className="modui-inspector-header">
              <div className="modui-inspector-header-left">
                <span className="modui-inspector-index">#{inspected.index}</span>
                <span className="modui-inspector-cat-pill">{inspected.category}</span>
                <span className="modui-inspector-tag-badge">{inspected.tag}</span>
              </div>
              <div className="modui-inspector-header-actions">
                <button
                  type="button"
                  className="modui-inspector-action-btn"
                  onClick={() => setIsFullscreen((prev) => !prev)}
                  title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen View (F)'}
                  aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
                >
                  {isFullscreen ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="4 14 10 14 10 20" />
                      <polyline points="20 10 14 10 14 4" />
                      <line x1="14" y1="10" x2="21" y2="3" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  className="modui-inspector-action-btn modui-inspector-close-btn"
                  onClick={handleCloseInspect}
                  title="Close Inspector (Esc)"
                  aria-label="Close image inspection"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Image Viewport */}
            <div className="modui-inspector-media-stage">
              <button
                type="button"
                className="modui-inspector-nav-btn modui-inspector-nav-btn--prev"
                onClick={handlePrevInspect}
                title="Previous Image (←)"
                aria-label="Previous Image"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <img
                src={inspected.imageUrl}
                alt={inspected.title}
                className="modui-inspector-img"
              />

              <button
                type="button"
                className="modui-inspector-nav-btn modui-inspector-nav-btn--next"
                onClick={handleNextInspect}
                title="Next Image (→)"
                aria-label="Next Image"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Modal Footer Info */}
            <div className="modui-inspector-footer">
              <div className="modui-inspector-footer-main">
                <div className="modui-inspector-title-row">
                  <h3 className="modui-inspector-title">{inspected.title}</h3>
                  <span className="modui-inspector-year-pill">{inspected.year}</span>
                </div>
                {inspected.description && (
                  <p className="modui-inspector-desc">{inspected.description}</p>
                )}
              </div>
              <div className="modui-inspector-footer-meta">
                <span className="modui-inspector-counter">
                  {currentIndex + 1} / {items.length}
                </span>
                <span className="modui-inspector-keys-hint">
                  ← / → to navigate · Esc to close
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfiniteCanvasGallery;
