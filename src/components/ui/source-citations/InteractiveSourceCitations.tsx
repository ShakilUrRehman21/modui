import React, {
  useState,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import './InteractiveSourceCitations.css';

export type SourceCitationsVariant =
  | 'studio-obsidian'
  | 'clean-porcelain'
  | 'cyber-neon'
  | 'warm-editorial';

export type SourceCitationsSize = 'sm' | 'md' | 'lg';

export interface CitationSource {
  id: string;
  index: number;
  title: string;
  domain: string;
  url: string;
  quote: string;
  confidence: number;
  publishedDate?: string;
}

export interface CitationSegment {
  text: string;
  citationIndex?: number;
}

export const DEFAULT_CITATION_SOURCES: CitationSource[] = [
  {
    id: 'react-compiler',
    index: 1,
    title: 'React 19 Compiler & Automatic Reactivity',
    domain: 'react.dev/blog/react-compiler',
    url: 'https://react.dev',
    quote:
      'Automatic memoization optimizes component re-renders at build time without manual useMemo or useCallback boilerplate.',
    confidence: 99,
    publishedDate: '2026',
  },
  {
    id: 'css-tokens',
    index: 2,
    title: 'CSS Custom Properties Specification',
    domain: 'developer.mozilla.org/css-variables',
    url: 'https://developer.mozilla.org',
    quote:
      'CSS custom properties cascade natively at runtime with zero JavaScript style injection overhead.',
    confidence: 97,
    publishedDate: '2026',
  },
  {
    id: 'web-audio',
    index: 3,
    title: 'Web Audio API Oscillator Synthesis',
    domain: 'webaudio.github.io/web-audio-api',
    url: 'https://developer.mozilla.org',
    quote:
      'OscillatorNode generates precision periodic waveforms directly in the browser audio thread with sub-millisecond latency.',
    confidence: 98,
    publishedDate: '2026',
  },
];

export const DEFAULT_CITATION_SEGMENTS: CitationSegment[] = [
  { text: 'React 19 eliminates manual memoization overhead via compiler-level reactivity ', citationIndex: 1 },
  { text: ', while native CSS custom properties enable zero-runtime theming ', citationIndex: 2 },
  { text: ' and Web Audio oscillators synthesize sub-millisecond haptics ', citationIndex: 3 },
  { text: '.' },
];

export interface InteractiveSourceCitationsProps {
  segments?: CitationSegment[];
  sources?: CitationSource[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  variant?: SourceCitationsVariant;
  size?: SourceCitationsSize;
  showConfidenceBadge?: boolean;
  showSourceStrip?: boolean;
  soundEnabled?: boolean;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onSourceSelect?: (source: CitationSource, index: number) => void;
}

export interface InteractiveSourceCitationsHandle {
  getActiveIndex: () => number;
  selectSource: (index: number) => void;
  nextSource: () => void;
  prevSource: () => void;
  reset: () => void;
}

export const InteractiveSourceCitations = forwardRef<
  InteractiveSourceCitationsHandle,
  InteractiveSourceCitationsProps
>(function InteractiveSourceCitations(
  {
    segments = DEFAULT_CITATION_SEGMENTS,
    sources = DEFAULT_CITATION_SOURCES,
    activeIndex: controlledIndex,
    defaultActiveIndex = 1,
    variant = 'studio-obsidian',
    size = 'md',
    showConfidenceBadge = true,
    showSourceStrip = true,
    soundEnabled = true,
    compact = false,
    className = '',
    style = {},
    onSourceSelect,
  },
  ref
) {
  const isControlled = controlledIndex !== undefined;
  const [internalIndex, setInternalIndex] = useState<number>(defaultActiveIndex);
  const currentIndex = isControlled ? controlledIndex : internalIndex;

  const indexRef = useRef<number>(currentIndex);
  indexRef.current = currentIndex;

  const audioCtxRef = useRef<AudioContext | null>(null);

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

  const playCrystalTick = useCallback(
    (sourceNumber: number) => {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(580 + sourceNumber * 75, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      } catch {
        // Ignore audio restrictions in headless environments
      }
    },
    [soundEnabled, getAudioContext]
  );

  const selectByIndex = useCallback(
    (targetIndex: number) => {
      const found = sources.find((s) => s.index === targetIndex);
      if (!found) return;

      indexRef.current = targetIndex;
      if (!isControlled) {
        setInternalIndex(targetIndex);
      }
      playCrystalTick(targetIndex);
      onSourceSelect?.(found, targetIndex);
    },
    [sources, isControlled, playCrystalTick, onSourceSelect]
  );

  const stepSource = useCallback(
    (delta: number) => {
      if (sources.length === 0) return;
      const pos = sources.findIndex((s) => s.index === indexRef.current);
      const currentPos = pos === -1 ? 0 : pos;
      const nextPos = (currentPos + delta + sources.length) % sources.length;
      selectByIndex(sources[nextPos].index);
    },
    [sources, selectByIndex]
  );

  useImperativeHandle(
    ref,
    () => ({
      getActiveIndex: () => indexRef.current,
      selectSource: (idx: number) => selectByIndex(idx),
      nextSource: () => stepSource(1),
      prevSource: () => stepSource(-1),
      reset: () => selectByIndex(defaultActiveIndex),
    }),
    [selectByIndex, stepSource, defaultActiveIndex]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepSource(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepSource(-1);
    } else if (/^[1-9]$/.test(e.key)) {
      const num = parseInt(e.key, 10);
      if (sources.some((s) => s.index === num)) {
        e.preventDefault();
        selectByIndex(num);
      }
    }
  };

  const activeSource = sources.find((s) => s.index === currentIndex) || sources[0];

  return (
    <div
      className={`cite-root cite-variant-${variant} cite-size-${size} ${
        compact ? 'cite-compact' : ''
      } ${className}`}
      style={style}
      role="region"
      aria-label="Grounded Source Citations"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="cite-card">
        <div className="cite-top-meta">
          {showConfidenceBadge ? (
            <span className="cite-grounding-pill">
              <span className="cite-grounding-dot" aria-hidden="true" />
              <span>{sources.length} Sources Grounded</span>
            </span>
          ) : (
            <span />
          )}

          {!compact && sources.length > 1 && (
            <div className="cite-stepper">
              <button
                type="button"
                className="cite-step-btn"
                onClick={() => stepSource(-1)}
                aria-label="Previous citation"
              >
                &lsaquo;
              </button>
              <button
                type="button"
                className="cite-step-btn"
                onClick={() => stepSource(1)}
                aria-label="Next citation"
              >
                &rsaquo;
              </button>
            </div>
          )}
        </div>

        <div className="cite-answer">
          {segments.map((seg, idx) => (
            <React.Fragment key={idx}>
              <span>{seg.text}</span>
              {seg.citationIndex !== undefined && (
                <button
                  type="button"
                  className={`cite-inline-chip ${
                    currentIndex === seg.citationIndex ? 'cite-inline-chip--active' : ''
                  }`}
                  onClick={() => selectByIndex(seg.citationIndex!)}
                  aria-pressed={currentIndex === seg.citationIndex}
                  aria-label={`Inspect citation ${seg.citationIndex}`}
                >
                  [{seg.citationIndex}]
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {activeSource && (
          <div key={activeSource.id} className="cite-drawer" role="region" aria-live="polite">
            <div className="cite-source-header">
              <div className="cite-source-identity">
                <span className="cite-source-index">{activeSource.index}</span>
                <a
                  className="cite-source-domain"
                  href={activeSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {activeSource.domain}
                </a>
              </div>
              <span className="cite-confidence-badge">{activeSource.confidence}% Grounded</span>
            </div>

            <div className="cite-source-title">{activeSource.title}</div>
            <blockquote className="cite-quote">&ldquo;{activeSource.quote}&rdquo;</blockquote>
          </div>
        )}

        {showSourceStrip && !compact && sources.length > 1 && (
          <div className="cite-source-strip" role="tablist" aria-label="Source Switcher">
            {sources.map((src) => {
              const isSelected = src.index === activeSource?.index;
              return (
                <button
                  key={src.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`cite-strip-btn ${isSelected ? 'cite-strip-btn--active' : ''}`}
                  onClick={() => selectByIndex(src.index)}
                >
                  <span>[{src.index}]</span>
                  <span>{src.domain.split('/')[0]}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});
