import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import './InteractiveSignaturePad.css';

export type SignatureVariant =
  | 'executive-dark'
  | 'parchment-legal'
  | 'porcelain-clean'
  | 'cyber-matrix';

export type SignatureSize = 'sm' | 'md' | 'lg';

export interface Point {
  x: number;
  y: number;
  time: number;
}

export interface Stroke {
  points: Point[];
  color: string;
}

export interface ExportPNGOptions {
  /** Output filename for download (default: 'signature-<timestamp>.png') */
  filename?: string;
  /** Automatically crop transparent whitespace around ink strokes (default: true) */
  trim?: boolean;
}

export interface InteractiveSignaturePadHandle {
  /** Literally export and download PNG image file, returning dataUrl and blob */
  exportPNG: (
    options?: ExportPNGOptions
  ) => Promise<{ dataUrl: string; blob: Blob | null }>;
  /** Clear all strokes from the canvas */
  clear: () => void;
  /** Undo the previous stroke */
  undo: () => void;
  /** Redo the previously undone stroke */
  redo: () => void;
  /** Check if the signature pad is currently empty */
  isEmpty: () => boolean;
  /** Get current raw canvas DataURL (PNG) */
  getDataURL: () => string;
  /** Get stroke history array */
  getStrokes: () => Stroke[];
}

export interface InteractiveSignaturePadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Visual theme finish (default: 'executive-dark') */
  variant?: SignatureVariant;
  /** Scale sizing preset (default: 'md') */
  size?: SignatureSize;
  /** Compact card embed mode scaled for catalog grid cards */
  compact?: boolean;
  /** Pre-populate with a sample executive vector signature (defaults to true in compact mode) */
  defaultSignature?: boolean;
  /** Initial or default ink stroke color */
  strokeColor?: string;
  /** Palette of selectable ink colors */
  colors?: string[];
  /** Minimum stroke line width in pixels (default: 1.5) */
  minWidth?: number;
  /** Maximum stroke line width in pixels (default: 4.5) */
  maxWidth?: number;
  /** Trim transparent padding on exported PNG (default: true) */
  trimExport?: boolean;
  /** Enable subtle paper friction acoustics via native Web Audio API (default: false) */
  soundEnabled?: boolean;
  /** Whether to show the legal dashed baseline guide (default: true) */
  showBaseline?: boolean;
  /** Whether to show the ink color palette switcher in the header (default: true) */
  showPalette?: boolean;
  /** Title text displayed in toolbar (default: 'Authorized Signature') */
  title?: string;
  /** Callback fired when user begins a stroke */
  onDrawStart?: () => void;
  /** Callback fired when user completes a stroke */
  onDrawEnd?: (strokesCount: number) => void;
  /** Callback fired when PNG export is triggered */
  onExport?: (dataUrl: string, blob: Blob | null) => void;
  /** Callback fired when canvas is cleared */
  onClear?: () => void;
}

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f1f3f9', '#f59e0b'];

/**
 * Web Audio API synthesizer for acoustic pen friction on paper.
 * Uses zero external audio files.
 */
function playPenFriction() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2200, t);
    osc.frequency.exponentialRampToValueAtTime(1400, t + 0.015);

    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.018);

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 50);
  } catch {
    // Autoplay restrictions safely caught
  }
}

/**
 * Generate a smooth parametric vector cursive signature for mock preview cards.
 */
function generateSampleSignature(
  width: number,
  height: number,
  color: string
): Stroke[] {
  const now = Date.now();
  const w = Math.max(160, width);
  const h = Math.max(60, height);

  // Key control points for the main cursive signature
  const keyPoints1 = [
    { x: 0.14, y: 0.65, dt: 0 },
    { x: 0.16, y: 0.46, dt: 30 },
    { x: 0.19, y: 0.24, dt: 65 },
    { x: 0.22, y: 0.14, dt: 105 },
    { x: 0.24, y: 0.18, dt: 140 },
    { x: 0.23, y: 0.35, dt: 180 },
    { x: 0.20, y: 0.54, dt: 220 },
    { x: 0.19, y: 0.70, dt: 260 },
    { x: 0.22, y: 0.76, dt: 295 },
    { x: 0.26, y: 0.72, dt: 330 },
    { x: 0.29, y: 0.58, dt: 365 },
    { x: 0.33, y: 0.48, dt: 400 },
    { x: 0.36, y: 0.60, dt: 435 },
    { x: 0.39, y: 0.48, dt: 470 },
    { x: 0.42, y: 0.60, dt: 505 },
    { x: 0.46, y: 0.35, dt: 545 },
    { x: 0.49, y: 0.18, dt: 585 },
    { x: 0.51, y: 0.19, dt: 620 },
    { x: 0.50, y: 0.40, dt: 660 },
    { x: 0.49, y: 0.60, dt: 700 },
    { x: 0.53, y: 0.50, dt: 735 },
    { x: 0.56, y: 0.60, dt: 770 },
    { x: 0.60, y: 0.46, dt: 805 },
    { x: 0.64, y: 0.58, dt: 840 },
    { x: 0.69, y: 0.44, dt: 880 },
    { x: 0.75, y: 0.34, dt: 925 },
    { x: 0.81, y: 0.28, dt: 970 },
  ];

  // Key control points for the dynamic underscore flourish
  const keyPoints2 = [
    { x: 0.20, y: 0.72, dt: 1050 },
    { x: 0.32, y: 0.76, dt: 1090 },
    { x: 0.46, y: 0.77, dt: 1130 },
    { x: 0.60, y: 0.75, dt: 1170 },
    { x: 0.74, y: 0.70, dt: 1210 },
    { x: 0.84, y: 0.63, dt: 1250 },
  ];

  // Catmull-Rom spline interpolation to generate smooth calligraphic trajectory
  function interpolatePoints(
    kps: { x: number; y: number; dt: number }[],
    stepsPerSegment = 4
  ): Point[] {
    const result: Point[] = [];
    for (let i = 0; i < kps.length - 1; i++) {
      const p0 = kps[Math.max(0, i - 1)];
      const p1 = kps[i];
      const p2 = kps[i + 1];
      const p3 = kps[Math.min(kps.length - 1, i + 2)];

      for (let s = 0; s < stepsPerSegment; s++) {
        const t = s / stepsPerSegment;
        const t2 = t * t;
        const t3 = t2 * t;

        const qx =
          0.5 *
          (2 * p1.x +
            (-p0.x + p2.x) * t +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
        const qy =
          0.5 *
          (2 * p1.y +
            (-p0.y + p2.y) * t +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
        const time = now + Math.round(p1.dt + (p2.dt - p1.dt) * t);

        result.push({
          x: Math.round(qx * w),
          y: Math.round(qy * h),
          time,
        });
      }
    }
    const last = kps[kps.length - 1];
    result.push({
      x: Math.round(last.x * w),
      y: Math.round(last.y * h),
      time: now + last.dt,
    });
    return result;
  }

  return [
    { points: interpolatePoints(keyPoints1, 4), color },
    { points: interpolatePoints(keyPoints2, 5), color },
  ];
}

/**
 * ModUI InteractiveSignaturePad Primitive (#36)
 * Studio-Grade Vector Ink Signature Canvas with Velocity Tapering & Literal PNG Export
 */
export const InteractiveSignaturePad = forwardRef<
  InteractiveSignaturePadHandle,
  InteractiveSignaturePadProps
>(function InteractiveSignaturePad(
  {
    variant = 'executive-dark',
    size = 'md',
    compact = false,
    defaultSignature = false,
    strokeColor,
    colors = DEFAULT_COLORS,
    minWidth = 1.6,
    maxWidth = 4.8,
    trimExport = true,
    soundEnabled = false,
    showBaseline = true,
    showPalette = true,
    title = 'Authorized Signature',
    onDrawStart,
    onDrawEnd,
    onExport,
    onClear,
    className = '',
    style,
    ...rest
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasInitializedRef = useRef<boolean>(false);
  const [activeColor, setActiveColor] = useState<string>(
    strokeColor || (variant === 'porcelain-clean' ? '#0f172a' : colors[0])
  );

  const strokesRef = useRef<Stroke[]>([]);
  const undoneStrokesRef = useRef<Stroke[]>([]);
  const currentPointsRef = useRef<Point[]>([]);
  const isDrawingRef = useRef<boolean>(false);
  const [strokeCount, setStrokeCount] = useState<number>(0);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setFeedbackToast(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setFeedbackToast(null);
    }, 2200);
  }, []);

  // Sync color if external prop changes
  useEffect(() => {
    if (strokeColor) {
      setActiveColor(strokeColor);
    }
  }, [strokeColor]);

  // Adjust canvas buffer resolution to devicePixelRatio (Retina / 4K crispness)
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    const width = Math.round(rect.width || (compact ? 340 : 580));
    const height = Math.round(rect.height || (compact ? 94 : 220));

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    // Auto-populate default signature if requested or in compact preview
    if (
      !hasInitializedRef.current &&
      (defaultSignature || (compact && defaultSignature !== false)) &&
      strokesRef.current.length === 0
    ) {
      hasInitializedRef.current = true;
      const initialStrokes = generateSampleSignature(width, height, activeColor);
      strokesRef.current = initialStrokes;
      setStrokeCount(initialStrokes.length);
    }

    // Redraw existing strokes
    redrawAllStrokes();
  }, [compact, defaultSignature, activeColor]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  /**
   * Render quadratic bezier curves with velocity-responsive width
   */
  const drawStrokeSegment = (
    ctx: CanvasRenderingContext2D,
    p1: Point,
    p2: Point,
    color: string
  ) => {
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const timeDiff = Math.max(1, p2.time - p1.time);
    const velocity = dist / timeDiff; // pixels per ms

    // Faster velocity -> thinner elegant taper
    const width = Math.max(
      minWidth,
      Math.min(maxWidth, maxWidth - velocity * 1.6)
    );

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  };

  const redrawAllStrokes = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    strokesRef.current.forEach((stroke) => {
      const pts = stroke.points;
      if (pts.length < 2) {
        if (pts.length === 1) {
          ctx.beginPath();
          ctx.fillStyle = stroke.color;
          ctx.arc(pts[0].x, pts[0].y, minWidth, 0, Math.PI * 2);
          ctx.fill();
        }
        return;
      }

      for (let i = 1; i < pts.length; i++) {
        drawStrokeSegment(ctx, pts[i - 1], pts[i], stroke.color);
      }
    });
  };

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const time = Date.now();

    currentPointsRef.current = [{ x, y, time }];
    undoneStrokesRef.current = []; // Clear redo stack on new stroke

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.fillStyle = activeColor;
      ctx.arc(x, y, minWidth, 0, Math.PI * 2);
      ctx.fill();
    }

    if (soundEnabled) {
      playPenFriction();
    }

    onDrawStart?.();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const time = Date.now();

    const pts = currentPointsRef.current;
    const prev = pts[pts.length - 1];
    const curr = { x, y, time };

    const ctx = canvas.getContext('2d');
    if (ctx && prev) {
      drawStrokeSegment(ctx, prev, curr, activeColor);
    }

    pts.push(curr);

    if (soundEnabled && pts.length % 5 === 0) {
      playPenFriction();
    }
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    if (currentPointsRef.current.length > 0) {
      strokesRef.current.push({
        points: [...currentPointsRef.current],
        color: activeColor,
      });
      currentPointsRef.current = [];
      const newCount = strokesRef.current.length;
      setStrokeCount(newCount);
      onDrawEnd?.(newCount);
    }
  };

  const handleClear = useCallback(() => {
    strokesRef.current = [];
    undoneStrokesRef.current = [];
    currentPointsRef.current = [];
    setStrokeCount(0);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
    }

    onClear?.();
  }, [onClear]);

  const handleUndo = useCallback(() => {
    if (strokesRef.current.length === 0) return;
    const popped = strokesRef.current.pop();
    if (popped) {
      undoneStrokesRef.current.push(popped);
    }
    setStrokeCount(strokesRef.current.length);
    redrawAllStrokes();
  }, []);

  const handleRedo = useCallback(() => {
    if (undoneStrokesRef.current.length === 0) return;
    const restored = undoneStrokesRef.current.pop();
    if (restored) {
      strokesRef.current.push(restored);
    }
    setStrokeCount(strokesRef.current.length);
    redrawAllStrokes();
  }, []);

  /**
   * Literal PNG Export Engine:
   * 1. Detects drawn pixel bounding box.
   * 2. Crops transparent margins (trim).
   * 3. Triggers genuine browser file download (<a download="...">.click()).
   * 4. Returns dataUrl and Blob.
   */
  const exportPNG = useCallback(
    async (options?: ExportPNGOptions): Promise<{ dataUrl: string; blob: Blob | null }> => {
      const canvas = canvasRef.current;
      if (!canvas || strokesRef.current.length === 0) {
        showToast('Please sign before exporting!');
        return { dataUrl: '', blob: null };
      }

      const shouldTrim = options?.trim ?? trimExport;
      const filename =
        options?.filename || `signature-${Date.now()}.png`;

      let exportCanvas = canvas;

      // Crop transparent margins to deliver a crisp signature stamp
      if (shouldTrim) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const { data, width, height } = imgData;

          let minX = width;
          let minY = height;
          let maxX = 0;
          let maxY = 0;
          let hasPixels = false;

          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const alpha = data[(y * width + x) * 4 + 3];
              if (alpha > 0) {
                hasPixels = true;
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
              }
            }
          }

          if (hasPixels) {
            const pad = Math.round(20 * dpr);
            const cropX = Math.max(0, minX - pad);
            const cropY = Math.max(0, minY - pad);
            const cropW = Math.min(width - cropX, maxX - minX + pad * 2);
            const cropH = Math.min(height - cropY, maxY - minY + pad * 2);

            const trimmed = document.createElement('canvas');
            trimmed.width = cropW;
            trimmed.height = cropH;
            const trimCtx = trimmed.getContext('2d');
            if (trimCtx) {
              trimCtx.drawImage(
                canvas,
                cropX,
                cropY,
                cropW,
                cropH,
                0,
                0,
                cropW,
                cropH
              );
              exportCanvas = trimmed;
            }
          }
        }
      }

      const dataUrl = exportCanvas.toDataURL('image/png');

      // Convert to blob for external callers
      const blob: Blob | null = await new Promise((resolve) => {
        exportCanvas.toBlob((b) => resolve(b), 'image/png');
      });

      // TRIGGER LITERAL BROWSER FILE DOWNLOAD
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      showToast(`Exported ${filename}!`);
      onExport?.(dataUrl, blob);

      return { dataUrl, blob };
    },
    [trimExport, onExport, showToast]
  );

  useImperativeHandle(
    ref,
    () => ({
      exportPNG,
      clear: handleClear,
      undo: handleUndo,
      redo: handleRedo,
      isEmpty: () => strokesRef.current.length === 0,
      getDataURL: () => {
        const c = canvasRef.current;
        return c ? c.toDataURL('image/png') : '';
      },
      getStrokes: () => [...strokesRef.current],
    }),
    [exportPNG, handleClear, handleUndo, handleRedo]
  );

  return (
    <div
      ref={containerRef}
      className={`modui-signature-root modui-signature-variant-${variant} modui-signature-size-${size} ${
        compact ? 'modui-signature-compact' : ''
      } ${className}`}
      style={style}
      {...rest}
    >
      {/* HEADER BAR */}
      <div className="modui-sig-header">
        <div className="modui-sig-title-group">
          <span className="modui-sig-title">{title}</span>
          <span className="modui-sig-badge">Vector Ink</span>
        </div>

        {showPalette && (
          <div className="modui-sig-palette" role="toolbar" aria-label="Ink color palette">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                className={`modui-sig-color-swatch ${activeColor === c ? 'active' : ''}`}
                style={{ backgroundColor: c, color: c }}
                onClick={() => setActiveColor(c)}
                aria-label={`Select ink color ${c}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* CANVAS STAGE */}
      <div className="modui-sig-canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="modui-sig-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
          aria-label="Draw your vector signature here"
        />

        {showBaseline && (
          <div className="modui-sig-baseline-guide" aria-hidden="true">
            <span className="modui-sig-x-mark">✕ Sign on the line above</span>
            <span className="modui-sig-legal-hint">DocuSign / Legal Ready</span>
          </div>
        )}

        {feedbackToast && (
          <div className="modui-sig-feedback-toast" role="status">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{feedbackToast}</span>
          </div>
        )}
      </div>

      {/* FOOTER BAR */}
      <div className="modui-sig-footer">
        <div className="modui-sig-meta">
          <span className={`modui-sig-stroke-dot ${strokeCount > 0 ? 'has-ink' : ''}`} />
          <span>
            {strokeCount === 0
              ? 'Ready to sign'
              : `${strokeCount} stroke${strokeCount > 1 ? 's' : ''} recorded`}
          </span>
        </div>

        <div className="modui-sig-actions">
          <button
            type="button"
            className="modui-sig-btn"
            onClick={handleUndo}
            disabled={strokeCount === 0}
            title="Undo last stroke"
            aria-label="Undo last stroke"
          >
            Undo
          </button>
          <button
            type="button"
            className="modui-sig-btn"
            onClick={handleClear}
            disabled={strokeCount === 0}
            title="Clear entire canvas"
            aria-label="Clear canvas"
          >
            Clear
          </button>
          <button
            type="button"
            className="modui-sig-btn modui-sig-btn-primary"
            onClick={() => exportPNG()}
            disabled={strokeCount === 0}
            title="Literally download signature as transparent PNG"
            aria-label="Export PNG"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default InteractiveSignaturePad;
