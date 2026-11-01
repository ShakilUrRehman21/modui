import React, { useState, useRef, useCallback, useMemo } from 'react';
import './Polaroid.css';

export type PolaroidVariant = 'studio-classic' | 'dark-room' | 'vintage-sepia' | 'minimal-mono';
export type PolaroidLayoutMode = 'scatter' | 'grid';

export interface PolaroidPhoto {
  id: string;
  title: string;
  caption: string;
  date: string;
  tag: string;
  aspectRatio?: 'square' | 'portrait'; // square (1:1) or portrait (4:5)
  gradient?: string;
  imageUrl?: string;
  cameraSettings?: string; // e.g. "f/2.8 · 1/250s · ISO 100"
  clientNote?: string;
  tapeColor?: string; // Washi tape strip color
  initialRotation?: number; // In degrees (-8 to +8)
  initialX?: number; // Scatter offset X in %
  initialY?: number; // Scatter offset Y in %
  developed?: boolean;
}

export interface PolaroidProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Visual finish matching platform design system (default: 'studio-classic') */
  variant?: PolaroidVariant;
  /** Layout mode: organic scattered tabletop or clean portfolio grid (default: 'scatter') */
  layout?: PolaroidLayoutMode;
  /** Array of Polaroid photos */
  photos?: PolaroidPhoto[];
  /** Allow interactive dragging and tossing in scatter mode (default: true) */
  draggable?: boolean;
  /** Enable camera shutter sound and paper rustle acoustics (default: true) */
  soundEnabled?: boolean;
  /** Compact card preview mode for explorer catalogue cards */
  compact?: boolean;
  /** Show top control bar with layout toggle and scatter action (default: true) */
  showControls?: boolean;
  /** Callback fired when a photo is clicked */
  onPhotoClick?: (photo: PolaroidPhoto) => void;
  /** Callback fired when a photo is flipped */
  onPhotoFlip?: (photo: PolaroidPhoto, isFlipped: boolean) => void;
}

export const DEFAULT_POLAROIDS: PolaroidPhoto[] = [
  {
    id: 'polaroid-1',
    title: 'Zurich Haptics Lab',
    caption: 'Milled brass rotary potentiometer · Zurich \'25',
    date: '14 OCT 2025',
    tag: 'Hardware / DSP',
    cameraSettings: 'f/2.8 · 1/500s · ISO 100 · 50mm',
    clientNote: 'Precision tolerances below 15 microns produce a tactile snap that flat touch glass cannot replicate.',
    tapeColor: 'rgba(245, 158, 11, 0.45)', // Warm amber washi
    initialRotation: -4,
    initialX: 12,
    initialY: 8,
    developed: true,
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a8a 100%)',
  },
  {
    id: 'polaroid-2',
    title: 'Subpixel Reverie',
    caption: 'Kinetic wave harmonics · Master Tape A',
    date: '02 NOV 2025',
    tag: 'Audio / WebGL',
    cameraSettings: 'f/1.4 · 1/250s · ISO 200 · 35mm',
    clientNote: 'Synthesized mathematically at native 44.1kHz sample rate with ballistic needle dynamics.',
    tapeColor: 'rgba(54, 92, 245, 0.45)', // Cobalt blue washi
    initialRotation: 3.5,
    initialX: 52,
    initialY: 4,
    developed: true,
    gradient: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)',
  },
  {
    id: 'polaroid-3',
    title: 'Tokyo Midnight Crossing',
    caption: 'Neon caustics across wet Shibuya asphalt',
    date: '18 DEC 2025',
    tag: 'Optics / 3D',
    cameraSettings: 'f/1.8 · 1/60s · ISO 800 · 28mm',
    clientNote: 'Chromatic dispersion and ambient light refraction rendered on an HTML5 physics canvas.',
    tapeColor: 'rgba(16, 185, 129, 0.45)', // Emerald washi
    initialRotation: -2.5,
    initialX: 24,
    initialY: 48,
    developed: true,
    gradient: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #065f46 100%)',
  },
  {
    id: 'polaroid-4',
    title: 'Spatial Studio v2',
    caption: 'Layered 3D glass card architecture',
    date: '24 JAN 2026',
    tag: 'Design System',
    cameraSettings: 'f/4.0 · 1/125s · ISO 100 · 85mm',
    clientNote: 'Zero runtime CSS bloat with native CSS custom properties and spring-damped momentum.',
    tapeColor: 'rgba(168, 85, 247, 0.45)', // Purple washi
    initialRotation: 5,
    initialX: 68,
    initialY: 42,
    developed: true,
    gradient: 'linear-gradient(135deg, #4c1d95 0%, #581c87 50%, #3b0764 100%)',
  },
];

// Audio Context Singleton & Synthesizer Engine
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

// 1. Camera Shutter Mechanical Snap (Dual-stage click)
function playShutterSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    // Stage 1: Spring release click
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(800, t);
    osc1.frequency.exponentialRampToValueAtTime(120, t + 0.025);
    gain1.gain.setValueAtTime(0.2, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.035);

    // Stage 2: Mirror curtain slap (35ms later)
    setTimeout(() => {
      try {
        const t2 = ctx.currentTime;
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(450, t2);
        osc2.frequency.exponentialRampToValueAtTime(80, t2 + 0.04);
        gain2.gain.setValueAtTime(0.35, t2);
        gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.05);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(t2);
        osc2.stop(t2 + 0.055);
      } catch {
        // Audio error silent fallback
      }
    }, 35);
  } catch {
    // Audio error silent fallback
  }
}

// 2. Paper Flutter / Rustle (Filtered noise burst on drag/pickup)
function playPaperRustle() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.06;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.Q.setValueAtTime(2.5, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start(t);
  } catch {
    // Audio error silent fallback
  }
}

export const Polaroid: React.FC<PolaroidProps> = ({
  variant = 'studio-classic',
  layout: initialLayout = 'scatter',
  photos: userPhotos,
  draggable = true,
  soundEnabled = true,
  compact = false,
  showControls = true,
  onPhotoClick,
  onPhotoFlip,
  className = '',
  style,
  ...rest
}) => {
  const photos = useMemo(() => userPhotos || DEFAULT_POLAROIDS, [userPhotos]);

  // Layout mode state: 'scatter' | 'grid'
  const [layoutMode, setLayoutMode] = useState<PolaroidLayoutMode>(initialLayout);

  // Active flipped photo IDs
  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});

  // Active developing states
  const [developingIds, setDevelopingIds] = useState<Record<string, boolean>>({});

  // Z-index tracking stack
  const [zOrder, setZOrder] = useState<string[]>(() => photos.map((p) => p.id));

  // Position & rotation state for scatter mode (per photo ID)
  const [positions, setPositions] = useState<
    Record<string, { x: number; y: number; rot: number }>
  >(() => {
    const initial: Record<string, { x: number; y: number; rot: number }> = {};
    photos.forEach((p, idx) => {
      // Default natural scatter positions if not provided
      const defaultOffsets = [
        { x: 12, y: 10, rot: -4.5 },
        { x: 50, y: 8, rot: 3.8 },
        { x: 22, y: 46, rot: -2.2 },
        { x: 62, y: 42, rot: 5.2 },
      ];
      const fallback = defaultOffsets[idx % defaultOffsets.length];
      initial[p.id] = {
        x: p.initialX !== undefined ? p.initialX : fallback.x,
        y: p.initialY !== undefined ? p.initialY : fallback.y,
        rot: p.initialRotation !== undefined ? p.initialRotation : fallback.rot,
      };
    });
    return initial;
  });

  // Dragging state
  const [dragActiveId, setDragActiveId] = useState<string | null>(null);
  const dragRef = useRef<{
    activeId: string | null;
    startX: number;
    startY: number;
    initialPosX: number;
    initialPosY: number;
    boardRect?: DOMRect;
  }>({
    activeId: null,
    startX: 0,
    startY: 0,
    initialPosX: 0,
    initialPosY: 0,
  });

  const boardRef = useRef<HTMLDivElement>(null);

  // Bring photo to top of stack
  const bringToTop = useCallback((id: string) => {
    setZOrder((prev) => {
      const filtered = prev.filter((item) => item !== id);
      return [...filtered, id];
    });
  }, []);

  // Handle Flip Card
  const toggleFlip = useCallback(
    (e: React.MouseEvent, photo: PolaroidPhoto) => {
      e.stopPropagation();
      setFlippedIds((prev) => {
        const nextState = !prev[photo.id];
        if (soundEnabled) {
          playPaperRustle();
        }
        if (onPhotoFlip) {
          onPhotoFlip(photo, nextState);
        }
        return { ...prev, [photo.id]: nextState };
      });
    },
    [soundEnabled, onPhotoFlip]
  );

  // Handle Develop Trigger
  const triggerDevelop = useCallback(
    (photoId: string) => {
      if (soundEnabled) {
        playShutterSound();
      }
      setDevelopingIds((prev) => ({ ...prev, [photoId]: true }));
    },
    [soundEnabled]
  );

  // Develop All Action
  const handleDevelopAll = useCallback(() => {
    if (soundEnabled) {
      playShutterSound();
    }
    const allDev: Record<string, boolean> = {};
    photos.forEach((p) => {
      allDev[p.id] = true;
    });
    setDevelopingIds(allDev);
  }, [photos, soundEnabled]);

  // Reshuffle / Re-scatter Action
  const handleReshuffle = useCallback(() => {
    if (soundEnabled) {
      playPaperRustle();
    }
    setPositions((prev) => {
      const nextPos = { ...prev };
      photos.forEach((p) => {
        const cur = nextPos[p.id] || { x: 30, y: 30, rot: 0 };
        nextPos[p.id] = {
          x: Math.max(8, Math.min(68, cur.x + (Math.random() * 12 - 6))),
          y: Math.max(6, Math.min(50, cur.y + (Math.random() * 10 - 5))),
          rot: Math.round((Math.random() * 14 - 7) * 10) / 10,
        };
      });
      return nextPos;
    });
  }, [photos, soundEnabled]);

  // Pointer Down (Start Drag)
  const handlePointerDown = useCallback(
    (e: React.PointerEvent, photoId: string) => {
      if (!draggable || layoutMode !== 'scatter' || compact) return;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      bringToTop(photoId);

      if (soundEnabled) {
        playPaperRustle();
      }

      setDragActiveId(photoId);

      const boardRect = boardRef.current?.getBoundingClientRect();
      const currentPos = positions[photoId] || { x: 30, y: 30, rot: 0 };

      dragRef.current = {
        activeId: photoId,
        startX: e.clientX,
        startY: e.clientY,
        initialPosX: currentPos.x,
        initialPosY: currentPos.y,
        boardRect,
      };
    },
    [draggable, layoutMode, compact, positions, bringToTop, soundEnabled]
  );

  // Pointer Move (Dragging)
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current.activeId || !dragRef.current.boardRect) return;

      const { activeId, startX, startY, initialPosX, initialPosY, boardRect } = dragRef.current;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      // Convert pixel deltas to percentage offsets
      const percentDeltaX = (deltaX / boardRect.width) * 100;
      const percentDeltaY = (deltaY / boardRect.height) * 100;

      const newX = Math.max(0, Math.min(78, initialPosX + percentDeltaX));
      const newY = Math.max(0, Math.min(64, initialPosY + percentDeltaY));

      setPositions((prev) => ({
        ...prev,
        [activeId]: {
          ...prev[activeId],
          x: newX,
          y: newY,
        },
      }));
    },
    []
  );

  // Pointer Up (End Drag)
  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (dragRef.current.activeId) {
        try {
          (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
        dragRef.current.activeId = null;
        setDragActiveId(null);
      }
    },
    []
  );

  // Keyboard accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, photo: PolaroidPhoto) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleFlip(e as unknown as React.MouseEvent, photo);
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        triggerDevelop(photo.id);
      }
    },
    [toggleFlip, triggerDevelop]
  );

  return (
    <div
      ref={boardRef}
      className={`modui-polaroid modui-polaroid--${variant} modui-polaroid--${layoutMode} ${compact ? 'modui-polaroid--compact' : ''} ${className}`}
      style={style}
      role="region"
      aria-label="Interactive Studio Polaroid Gallery"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      {...rest}
    >
      {/* 1. Studio Top Control Bar */}
      {showControls && !compact && (
        <div className="modui-polaroid-toolbar">
          <div className="modui-polaroid-brand">
            <span className="modui-polaroid-brand__badge">POLAROID SX-70</span>
            <span className="modui-polaroid-brand__title">STUDIO ARCHIVE</span>
          </div>

          <div className="modui-polaroid-actions">
            {/* View Mode Switcher */}
            <div className="modui-polaroid-mode-toggle" role="group" aria-label="Layout Mode">
              <button
                type="button"
                className={`modui-polaroid-toggle-btn ${layoutMode === 'scatter' ? 'modui-polaroid-toggle-btn--active' : ''}`}
                onClick={() => {
                  setLayoutMode('scatter');
                  if (soundEnabled) playPaperRustle();
                }}
                title="Tabletop Scatter Mode (Drag & Toss)"
              >
                <span>Scatter</span>
              </button>
              <button
                type="button"
                className={`modui-polaroid-toggle-btn ${layoutMode === 'grid' ? 'modui-polaroid-toggle-btn--active' : ''}`}
                onClick={() => {
                  setLayoutMode('grid');
                  if (soundEnabled) playPaperRustle();
                }}
                title="Editorial Grid Mode"
              >
                <span>Grid</span>
              </button>
            </div>

            {/* Scatter Shuffle Action */}
            {layoutMode === 'scatter' && (
              <button
                type="button"
                className="modui-polaroid-action-btn"
                onClick={handleReshuffle}
                title="Shuffle photo positions"
                aria-label="Reshuffle photos"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 3 21 3 21 8" />
                  <line x1="4" y1="20" x2="21" y2="3" />
                  <polyline points="21 16 21 21 16 21" />
                  <line x1="15" y1="15" x2="21" y2="21" />
                  <line x1="4" y1="4" x2="9" y2="9" />
                </svg>
                <span>Shuffle</span>
              </button>
            )}

            {/* Develop All Action */}
            <button
              type="button"
              className="modui-polaroid-action-btn modui-polaroid-action-btn--develop"
              onClick={handleDevelopAll}
              title="Trigger instant chemistry development for all photos"
              aria-label="Develop all photos"
            >
              <span className="modui-polaroid-shutter-dot" />
              <span>Develop All</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Photo Stage Canvas */}
      <div className="modui-polaroid-stage">
        {photos.map((photo) => {
          const isFlipped = Boolean(flippedIds[photo.id]);
          const isDeveloping = Boolean(developingIds[photo.id]);
          const isDragging = dragActiveId === photo.id;
          const pos = positions[photo.id] || { x: 30, y: 30, rot: 0 };
          const zIndex = zOrder.indexOf(photo.id) + 1;

          // Scatter styling vs Grid styling
          const cardStyle: React.CSSProperties =
            layoutMode === 'scatter' && !compact
              ? {
                  position: 'absolute',
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: `rotate(${pos.rot}deg) ${isDragging ? 'scale(1.06)' : 'scale(1)'}`,
                  zIndex: isDragging ? 999 : zIndex,
                }
              : {};

          return (
            <div
              key={photo.id}
              className={`modui-polaroid-card ${isFlipped ? 'is-flipped' : ''} ${isDragging ? 'is-dragging' : ''} ${photo.aspectRatio === 'portrait' ? 'is-portrait' : 'is-square'}`}
              style={cardStyle}
              onPointerDown={(e) => handlePointerDown(e, photo.id)}
              onClick={() => {
                bringToTop(photo.id);
                if (onPhotoClick) onPhotoClick(photo);
              }}
              onKeyDown={(e) => handleKeyDown(e, photo)}
              role="button"
              tabIndex={0}
              aria-label={`Polaroid Photo: ${photo.title}. Press Space or Enter to flip.`}
              title="Click to focus · Drag to move · Flip button on top-right"
            >
              {/* Optional Washi Paper Tape Strip at top */}
              {photo.tapeColor && layoutMode === 'scatter' && !compact && (
                <div
                  className="modui-polaroid-washi-tape"
                  style={{ backgroundColor: photo.tapeColor }}
                  aria-hidden="true"
                />
              )}

              {/* 3D Flip Card Inner Container */}
              <div className="modui-polaroid-flipper">
                
                {/* ================= A. FRONT SIDE: PHOTO & HANDWRITTEN CAPTION ================= */}
                <div className="modui-polaroid-face modui-polaroid-face--front">
                  {/* Flip Action Button Icon */}
                  <button
                    type="button"
                    className="modui-polaroid-flip-btn"
                    onClick={(e) => toggleFlip(e, photo)}
                    title="Flip photo to view back metadata"
                    aria-label="Flip to back"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                    </svg>
                  </button>

                  {/* Photo Window (Square or 4:5 with Realistic Film Chemistry) */}
                  <div className="modui-polaroid-frame">
                    <div
                      className={`modui-polaroid-photo ${isDeveloping ? 'is-developing' : ''}`}
                      style={{
                        background: photo.gradient || 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
                      }}
                    >
                      {/* Photo Image or Graphic Art */}
                      {photo.imageUrl ? (
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="modui-polaroid-img"
                          loading="lazy"
                        />
                      ) : (
                        <div className="modui-polaroid-placeholder-art">
                          <span className="modui-polaroid-art-tag">{photo.tag}</span>
                          <h4 className="modui-polaroid-art-title">{photo.title}</h4>
                        </div>
                      )}

                      {/* Film Texture Grain & Ambient Vignette */}
                      <div className="modui-polaroid-vignette" aria-hidden="true" />
                      <div className="modui-polaroid-chemical-fog" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Wide Bottom White Margin: Handwritten Cursive Caption & Tag */}
                  <div className="modui-polaroid-caption-area">
                    <div className="modui-polaroid-caption-row">
                      <span className="modui-polaroid-caption-text">{photo.caption}</span>
                    </div>
                    <div className="modui-polaroid-meta-row">
                      <span className="modui-polaroid-tag-badge">{photo.tag}</span>
                      <span className="modui-polaroid-date-stamp">{photo.date}</span>
                    </div>
                  </div>
                </div>

                {/* ================= B. BACK SIDE: RUBBER STAMP & ARCHIVAL METADATA ================= */}
                <div className="modui-polaroid-face modui-polaroid-face--back">
                  {/* Flip Back Button */}
                  <button
                    type="button"
                    className="modui-polaroid-flip-btn"
                    onClick={(e) => toggleFlip(e, photo)}
                    title="Flip photo back to front"
                    aria-label="Flip back to front"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 2v6h6M2.66 15.57a10 10 0 0 0 .57-8.38l-5.67-5.67" />
                    </svg>
                  </button>

                  <div className="modui-polaroid-back-inner">
                    {/* Archival Rubber Ink Stamp */}
                    <div className="modui-polaroid-stamp">
                      <span className="modui-polaroid-stamp__circle">EXPOSURE ARCHIVE</span>
                      <span className="modui-polaroid-stamp__date">{photo.date}</span>
                    </div>

                    {/* Camera Technical Exposure Settings */}
                    <div className="modui-polaroid-back-specs">
                      <div className="modui-polaroid-spec-label">CAMERA SPECS</div>
                      <div className="modui-polaroid-spec-val">
                        {photo.cameraSettings || 'f/2.8 · 1/250s · ISO 100'}
                      </div>
                    </div>

                    {/* Handwritten Client / Lab Note */}
                    <div className="modui-polaroid-back-note">
                      <p>"{photo.clientNote || 'Archived specimen preserved in ModUI creative portfolio catalogue.'}"</p>
                    </div>

                    <div className="modui-polaroid-back-footer">
                      <span className="modui-polaroid-spec-id">SERIAL #{photo.id.toUpperCase()}</span>
                      <span className="modui-polaroid-spec-chem">INSTANT FILM 600</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Polaroid;

