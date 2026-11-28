import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import './InteractivePopoutFolder.css';

export type PopoutFolderVariant =
  | 'cobalt-studio'
  | 'obsidian-glass'
  | 'porcelain-frost'
  | 'amber-archive';

export type PopoutFolderSize = 'sm' | 'md' | 'lg';

export interface FolderImageItem {
  id: string;
  src: string;
  title: string;
  subtitle?: string;
}

export const DEFAULT_FOLDER_IMAGES: FolderImageItem[] = [
  {
    id: 'img-1',
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
    title: 'Obsidian Wave Study',
    subtitle: '3840 × 2160 · PNG',
  },
  {
    id: 'img-2',
    src: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=900&q=80',
    title: 'Iridescent Glass Prism',
    subtitle: '4096 × 2304 · RAW',
  },
  {
    id: 'img-3',
    src: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=900&q=80',
    title: 'Neon Horizon Mesh',
    subtitle: '3840 × 2160 · WEBP',
  },
];

export interface InteractivePopoutFolderProps {
  title?: string;
  images?: FolderImageItem[];
  variant?: PopoutFolderVariant;
  size?: PopoutFolderSize;
  defaultOpen?: boolean;
  soundEnabled?: boolean;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onFolderToggle?: (isOpen: boolean) => void;
  onImageOpen?: (image: FolderImageItem, index: number) => void;
  onImageClose?: () => void;
}

export interface InteractivePopoutFolderHandle {
  openFolder: () => void;
  closeFolder: () => void;
  toggleFolder: () => void;
  openImage: (index: number) => void;
  closeLightbox: () => void;
}

export const InteractivePopoutFolder = forwardRef<
  InteractivePopoutFolderHandle,
  InteractivePopoutFolderProps
>(function InteractivePopoutFolder(
  {
    title = 'Visual Captures',
    images = DEFAULT_FOLDER_IMAGES,
    variant = 'cobalt-studio',
    size = 'md',
    defaultOpen = false,
    soundEnabled = true,
    compact = false,
    className = '',
    style = {},
    onFolderToggle,
    onImageOpen,
    onImageClose,
  },
  ref
) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const visibleImages = images.slice(0, 3);

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

  const playAcousticTick = useCallback(
    (freq: number, duration = 0.05) => {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.15, now + duration);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + duration + 0.01);
      } catch {
        // Ignore audio context restrictions
      }
    },
    [soundEnabled, getAudioContext]
  );

  const setFolderState = useCallback(
    (next: boolean) => {
      setIsOpen(next);
      playAcousticTick(next ? 520 : 380, 0.045);
      onFolderToggle?.(next);
    },
    [playAcousticTick, onFolderToggle]
  );

  const handleOpenImage = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= images.length) return;
      setActiveImageIndex(idx);
      playAcousticTick(740, 0.06);
      onImageOpen?.(images[idx], idx);
    },
    [images, playAcousticTick, onImageOpen]
  );

  const handleCloseLightbox = useCallback(() => {
    setActiveImageIndex(null);
    playAcousticTick(420, 0.04);
    onImageClose?.();
  }, [playAcousticTick, onImageClose]);

  const stepImage = useCallback(
    (delta: number) => {
      if (activeImageIndex === null || images.length === 0) return;
      const next = (activeImageIndex + delta + images.length) % images.length;
      handleOpenImage(next);
    },
    [activeImageIndex, images.length, handleOpenImage]
  );

  useEffect(() => {
    if (activeImageIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseLightbox();
      } else if (e.key === 'ArrowRight') {
        stepImage(1);
      } else if (e.key === 'ArrowLeft') {
        stepImage(-1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeImageIndex, handleCloseLightbox, stepImage]);

  useImperativeHandle(
    ref,
    () => ({
      openFolder: () => setFolderState(true),
      closeFolder: () => setFolderState(false),
      toggleFolder: () => setFolderState(!isOpen),
      openImage: (idx: number) => handleOpenImage(idx),
      closeLightbox: () => handleCloseLightbox(),
    }),
    [setFolderState, isOpen, handleOpenImage, handleCloseLightbox]
  );

  const activeImage = activeImageIndex !== null ? images[activeImageIndex] : null;

  return (
    <div
      className={`pfolder-root pfolder-variant-${variant} pfolder-size-${size} ${
        compact ? 'pfolder-compact' : ''
      } ${className}`}
      style={style}
      role="region"
      aria-label={`${title} image folder`}
    >
      <div className="pfolder-stage">
        <div
          className={`pfolder-shell ${isOpen ? 'pfolder-shell--open' : ''}`}
          tabIndex={0}
          role="button"
          aria-expanded={isOpen}
          aria-label={`Toggle ${title} folder`}
          onClick={() => setFolderState(!isOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setFolderState(!isOpen);
            }
          }}
        >
          <div className="pfolder-tab" aria-hidden="true" />
          <div className="pfolder-back" aria-hidden="true" />

          <div className="pfolder-cards-layer">
            {visibleImages.map((img, idx) => (
              <button
                key={img.id}
                type="button"
                className={`pfolder-photo-card pfolder-photo-${idx}`}
                aria-label={`Open image ${img.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenImage(idx);
                }}
              >
                <img src={img.src} alt={img.title} loading="lazy" />
                {!compact && <span className="pfolder-photo-caption">{img.title}</span>}
              </button>
            ))}
          </div>

          <div className="pfolder-front">
            <div className="pfolder-title">{title}</div>
            <div className="pfolder-meta">{images.length} images</div>
          </div>
        </div>
      </div>

      {activeImage && (
        <div
          className="pfolder-lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.title}
          onClick={handleCloseLightbox}
        >
          <div
            className="pfolder-lightbox-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pfolder-lightbox-media">
              <img src={activeImage.src} alt={activeImage.title} />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="pfolder-lightbox-nav pfolder-lightbox-prev"
                    onClick={() => stepImage(-1)}
                    aria-label="Previous image"
                  >
                    &lsaquo;
                  </button>
                  <button
                    type="button"
                    className="pfolder-lightbox-nav pfolder-lightbox-next"
                    onClick={() => stepImage(1)}
                    aria-label="Next image"
                  >
                    &rsaquo;
                  </button>
                </>
              )}
            </div>

            <div className="pfolder-lightbox-bar">
              <div>
                <div className="pfolder-lightbox-title">{activeImage.title}</div>
                <div className="pfolder-lightbox-sub">
                  {activeImage.subtitle || `Image ${(activeImageIndex ?? 0) + 1} of ${images.length}`}
                </div>
              </div>
              <button
                type="button"
                className="pfolder-lightbox-close"
                onClick={handleCloseLightbox}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
