import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import './InteractiveSentimentRatingPill.css';

export type SentimentVariant =
  | 'studio-obsidian'
  | 'clean-porcelain'
  | 'cyber-neon'
  | 'warm-editorial';

export type SentimentSize = 'sm' | 'md' | 'lg';

export interface SentimentTier {
  rating: number;
  label: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  frequency: number;
  category: 'detractor' | 'passive' | 'promoter';
}

export const DEFAULT_SENTIMENT_TIERS: SentimentTier[] = [
  {
    rating: 1,
    label: 'Poor',
    title: 'Critical Issue',
    description: 'Detractor · Severe friction, blocker, or bug encountered',
    emoji: '😡',
    color: '#ef4444',
    frequency: 261.63, // C4
    category: 'detractor',
  },
  {
    rating: 2,
    label: 'Fair',
    title: 'Needs Improvement',
    description: 'Detractor · Suboptimal workflow, friction, or UX impediments',
    emoji: '🙁',
    color: '#f97316',
    frequency: 293.66, // D4
    category: 'detractor',
  },
  {
    rating: 3,
    label: 'Good',
    title: 'Neutral Baseline',
    description: 'Passive · Core functionality met without friction or delight',
    emoji: '😐',
    color: '#eab308',
    frequency: 329.63, // E4
    category: 'passive',
  },
  {
    rating: 4,
    label: 'Great',
    title: 'High Delight',
    description: 'Promoter · Fast, smooth, responsive, and intuitive flow',
    emoji: '😊',
    color: '#10b981',
    frequency: 392.0, // G4
    category: 'promoter',
  },
  {
    rating: 5,
    label: 'Stellar',
    title: 'Exceptional Craft',
    description: 'Promoter · Flawless experience, sub-millisecond satisfaction',
    emoji: '🤩',
    color: '#38bdf8',
    frequency: 523.25, // C5
    category: 'promoter',
  },
];

export const DEFAULT_FEEDBACK_TAGS = [
  '⚡ Lightning Fast',
  '✨ Beautiful Polish',
  '🎯 Intuitive Flow',
  '🎨 Delightful Visuals',
  '🐛 Bug Observed',
  '⏳ Performance Lag',
  '💡 Feature Request',
];

export interface FeedbackSubmission {
  rating: number;
  tier: SentimentTier;
  selectedTags: string[];
  note: string;
}

export interface InteractiveSentimentRatingPillProps {
  value?: number;
  defaultValue?: number;
  tiers?: SentimentTier[];
  variant?: SentimentVariant;
  size?: SentimentSize;
  soundEnabled?: boolean;
  showAvatar?: boolean;
  showLabels?: boolean;
  showTelemetry?: boolean;
  showFeedbackDrawer?: boolean;
  readOnly?: boolean;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (rating: number, tier: SentimentTier) => void;
  onSubmitFeedback?: (submission: FeedbackSubmission) => void;
}

export interface InteractiveSentimentRatingPillHandle {
  getRating: () => number;
  setRating: (rating: number) => void;
  getSentiment: () => SentimentTier;
  reset: () => void;
}

export const InteractiveSentimentRatingPill = forwardRef<
  InteractiveSentimentRatingPillHandle,
  InteractiveSentimentRatingPillProps
>(function InteractiveSentimentRatingPill(
  {
    value: controlledValue,
    defaultValue = 5,
    tiers = DEFAULT_SENTIMENT_TIERS,
    variant = 'studio-obsidian',
    size = 'md',
    soundEnabled = true,
    showAvatar = true,
    showLabels = true,
    showTelemetry = true,
    showFeedbackDrawer = false,
    readOnly = false,
    compact = false,
    className = '',
    style = {},
    onChange,
    onSubmitFeedback,
  },
  ref
) {
  const isControlled = controlledValue !== undefined;
  const [internalRating, setInternalRating] = useState<number>(() => {
    const init = isControlled ? controlledValue : defaultValue;
    return Math.max(1, Math.min(5, init));
  });

  const activeRating = isControlled ? Math.max(1, Math.min(5, controlledValue)) : internalRating;

  // Selected feedback tags and note
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedbackNote, setFeedbackNote] = useState<string>('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(showFeedbackDrawer);

  // Avatar squash & stretch animation state
  const [isBouncing, setIsBouncing] = useState<boolean>(false);

  // Pill track DOM references
  const trackRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<Map<number, HTMLButtonElement>>(new Map());
  const [sliderStyle, setSliderStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  // Find active tier
  const activeTier = tiers.find((t) => t.rating === activeRating) || tiers[tiers.length - 1];

  // Up-to-date refs for imperative handle
  const ratingRef = useRef(activeRating);
  const tierRef = useRef(activeTier);
  ratingRef.current = activeRating;
  tierRef.current = activeTier;

  // Native Web Audio Synthesizer ref
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioContextRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx();
      }
    }
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(() => {});
    }
    return audioContextRef.current;
  }, []);

  // Synthesize musical pentatonic chime
  const playChime = useCallback(
    (frequency: number) => {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;

        // Primary fundamental oscillator (sine)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(frequency, now);
        gain1.gain.setValueAtTime(0.12, now);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.35);

        // Harmonic overtone (triangle) for warm bell shimmer
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(frequency * 2, now);
        gain2.gain.setValueAtTime(0.04, now);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now);
        osc2.stop(now + 0.22);
      } catch {
        // Silently handle audio context restrictions
      }
    },
    [soundEnabled, getAudioContext]
  );

  // Measure and update active pill indicator position
  const updateIndicatorPosition = useCallback(() => {
    const activeBtn = buttonsRef.current.get(activeRating);
    const track = trackRef.current;
    if (!activeBtn || !track) return;

    const trackRect = track.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    setSliderStyle({
      left: btnRect.left - trackRect.left,
      width: btnRect.width,
    });
  }, [activeRating]);

  useEffect(() => {
    updateIndicatorPosition();
    const handleResize = () => updateIndicatorPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateIndicatorPosition]);

  // Trigger avatar bounce and audio chime on rating change
  const handleRatingChange = useCallback(
    (newRating: number) => {
      if (readOnly) return;
      const clamped = Math.max(1, Math.min(5, newRating));
      const targetTier = tiers.find((t) => t.rating === clamped) || tiers[clamped - 1];

      if (!isControlled) {
        setInternalRating(clamped);
      }

      ratingRef.current = clamped;
      tierRef.current = targetTier;

      // Trigger squash bounce
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 380);

      // Play harmonic chime
      if (targetTier) {
        playChime(targetTier.frequency);
      }

      onChange?.(clamped, targetTier);
    },
    [readOnly, isControlled, tiers, playChime, onChange]
  );

  // Imperative handle
  useImperativeHandle(
    ref,
    () => ({
      getRating: () => ratingRef.current,
      setRating: (r: number) => handleRatingChange(r),
      getSentiment: () => tierRef.current,
      reset: () => {
        handleRatingChange(defaultValue);
        setSelectedTags([]);
        setFeedbackNote('');
        setSubmittedMessage(null);
      },
    }),
    [handleRatingChange, defaultValue]
  );

  // Drag scrubber interaction across pill track
  const isDraggingRef = useRef(false);

  const calculateRatingFromPointer = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return null;
      const rect = track.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, relativeX / rect.width));
      const rating = Math.min(5, Math.floor(ratio * 5) + 1);
      return rating;
    },
    []
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (readOnly) return;
    isDraggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const newRating = calculateRatingFromPointer(e.clientX);
    if (newRating !== null && newRating !== activeRating) {
      handleRatingChange(newRating);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || readOnly) return;
    const newRating = calculateRatingFromPointer(e.clientX);
    if (newRating !== null && newRating !== activeRating) {
      handleRatingChange(newRating);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture was already released
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (readOnly) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      handleRatingChange(Math.min(5, activeRating + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      handleRatingChange(Math.max(1, activeRating - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      handleRatingChange(1);
    } else if (e.key === 'End') {
      e.preventDefault();
      handleRatingChange(5);
    } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
      e.preventDefault();
      handleRatingChange(parseInt(e.key, 10));
    }
  };

  // Toggle feedback tag
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Submit feedback
  const handleSubmitFeedback = () => {
    const payload: FeedbackSubmission = {
      rating: activeRating,
      tier: activeTier,
      selectedTags,
      note: feedbackNote.trim(),
    };
    onSubmitFeedback?.(payload);
    setSubmittedMessage('Feedback recorded! Thank you for helping us polish ModUI.');
    setTimeout(() => setSubmittedMessage(null), 3500);
  };

  return (
    <div
      className={`senti-rating-container senti-variant-${variant} senti-size-${size} ${
        compact ? 'senti-compact' : ''
      } ${className}`}
      style={
        {
          ...style,
          '--active-tier-color': activeTier.color,
        } as React.CSSProperties
      }
      onKeyDown={handleKeyDown}
      tabIndex={readOnly ? -1 : 0}
      role="radiogroup"
      aria-label="Customer Satisfaction Rating"
      aria-valuenow={activeRating}
      aria-valuemin={1}
      aria-valuemax={5}
    >
      <div className="senti-rating-card">
        {/* Dynamic Avatar */}
        {showAvatar && (
          <div className="senti-avatar-wrapper">
            <div className="senti-avatar-halo" />
            <div
              className={`senti-avatar-circle ${isBouncing ? 'senti-avatar-bounce' : ''}`}
              aria-hidden="true"
            >
              {activeTier.emoji}
            </div>
          </div>
        )}

        {/* Title, Category Badge, and Subtitle */}
        {showLabels && (
          <div className="senti-header-group">
            <div className="senti-title">
              <span>{activeTier.title}</span>
              <span className="senti-category-badge">{activeTier.category}</span>
            </div>
            <div className="senti-sub">{activeTier.description}</div>
          </div>
        )}

        {/* Pill Scrubber Track */}
        <div className="senti-track-wrapper">
          <div
            ref={trackRef}
            className="senti-pill-track"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* Sliding Pill Indicator */}
            <div
              className="senti-indicator-slider"
              style={{
                left: `${sliderStyle.left}px`,
                width: `${sliderStyle.width}px`,
              }}
              aria-hidden="true"
            />

            {tiers.map((tier) => {
              const isActive = tier.rating === activeRating;
              return (
                <button
                  key={tier.rating}
                  ref={(el) => {
                    if (el) buttonsRef.current.set(tier.rating, el);
                    else buttonsRef.current.delete(tier.rating);
                  }}
                  type="button"
                  className={`senti-segment-btn ${isActive ? 'senti-segment-active' : ''}`}
                  onClick={() => handleRatingChange(tier.rating)}
                  role="radio"
                  aria-checked={isActive}
                  aria-label={`${tier.rating} - ${tier.label}: ${tier.title}`}
                  disabled={readOnly}
                >
                  <span className="senti-segment-num">{tier.rating}</span>
                  <span className="senti-segment-label">{tier.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Telemetry Stats */}
        {showTelemetry && !compact && (
          <div className="senti-telemetry-row">
            <div className="senti-telemetry-item">
              <span className="senti-telemetry-dot" />
              <span>Realtime CSAT:</span>
              <span className="senti-telemetry-val">4.8 / 5.0</span>
            </div>
            <div className="senti-telemetry-item">
              <span>NPS Status:</span>
              <span className="senti-telemetry-val">
                {activeTier.category === 'promoter'
                  ? '94% Promoter Zone'
                  : activeTier.category === 'passive'
                  ? 'Passive Baseline'
                  : 'Action Needed'}
              </span>
            </div>
          </div>
        )}

        {/* Optional Qualitative Feedback Drawer Toggle / Form */}
        {!compact && (showFeedbackDrawer || isDrawerOpen) && (
          <div className="senti-drawer">
            <div className="senti-drawer-title">What shaped your experience?</div>
            <div className="senti-tags-grid">
              {DEFAULT_FEEDBACK_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    className={`senti-tag-pill ${isSelected ? 'senti-tag-selected' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            <textarea
              className="senti-note-input"
              rows={2}
              placeholder="Tell us what you loved or how we can improve..."
              value={feedbackNote}
              onChange={(e) => setFeedbackNote(e.target.value)}
            />

            <button
              type="button"
              className="senti-submit-btn"
              onClick={handleSubmitFeedback}
            >
              Submit Rating & Notes
            </button>

            {submittedMessage && (
              <div className="senti-feedback-toast">{submittedMessage}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
