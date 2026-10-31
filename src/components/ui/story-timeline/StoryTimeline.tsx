import React, { useState, useRef, useEffect, useCallback } from 'react';
import './StoryTimeline.css';

export type StoryTimelineVariant = 'instagram-dark' | 'editorial-paper' | 'cyber-neon' | 'studio-mono';

export interface StoryPollOption {
  id: string;
  text: string;
  votes: number;
}

export interface StoryPoll {
  question: string;
  options: [StoryPollOption, StoryPollOption];
}

export interface StorySticker {
  type: 'poll' | 'reaction-slider' | 'link' | 'music' | 'quote';
  poll?: StoryPoll;
  linkText?: string;
  linkUrl?: string;
  sliderEmoji?: string;
  musicTrack?: string;
  musicArtist?: string;
  quoteText?: string;
  quoteAuthor?: string;
}

export interface StorySlide {
  id: string;
  timestamp: string; // e.g. "2h ago", "Nov 2024"
  tag: string;       // e.g. "THE GENESIS", "HARDWARE PROTO"
  title: string;
  description: string;
  gradient: string;  // CSS background gradient or image url
  accentColor: string;
  stickers?: StorySticker[];
  durationMs?: number; // default 5000ms
}

export interface StoryTimelineProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Visual finish (default: 'instagram-dark') */
  variant?: StoryTimelineVariant;
  /** List of story slides */
  stories?: StorySlide[];
  /** Profile username shown at top */
  username?: string;
  /** Profile handle / subtitle */
  handle?: string;
  /** Profile avatar image URL or initials */
  avatarUrl?: string;
  /** Synthesized audio haptics for taps, votes, and reactions */
  soundEnabled?: boolean;
  /** Auto-advance stories */
  autoPlay?: boolean;
  /** Controlled active index */
  activeIndex?: number;
  /** Show adjacent story preview cards on desktop (default: false) */
  showAdjacentPreviews?: boolean;
  /** Compact card mode for explorer and catalog previews (default: false) */
  compact?: boolean;
  /** Callback fired when active story changes */
  onStoryChange?: (story: StorySlide, index: number) => void;
  /** Callback fired when user votes in a poll */
  onPollVote?: (storyId: string, optionId: string) => void;
}

export const DEFAULT_STORIES: StorySlide[] = [
  {
    id: 'story-1',
    timestamp: '2h ago',
    tag: 'CHAPTER 01 · PROTOTYPE',
    title: 'The Brass Dial Experiment',
    description: 'Rejecting flat glass interfaces. We milled our first mechanical rotary potentiometer in Zurich to prove digital software needs physical haptic weight.',
    gradient: 'linear-gradient(145deg, #18181b 0%, #27272a 40%, #09090b 100%)',
    accentColor: '#f59e0b',
    durationMs: 6000,
    stickers: [
      {
        type: 'poll',
        poll: {
          question: 'Do you prefer physical haptics over flat glass?',
          options: [
            { id: 'opt-1', text: 'Yes, heavy tactile dials', votes: 142 },
            { id: 'opt-2', text: 'No, touch glass is fine', votes: 23 },
          ],
        },
      },
    ],
  },
  {
    id: 'story-2',
    timestamp: '4h ago',
    tag: 'CHAPTER 02 · ACOUSTICS',
    title: 'Zero-Latency Web Audio DSP',
    description: 'Every click, spool acceleration, and spring oscillation is generated mathematically at native sample rate. No recorded MP3 files.',
    gradient: 'linear-gradient(145deg, #090d16 0%, #0c1a30 50%, #030712 100%)',
    accentColor: '#0ea5e9',
    durationMs: 5500,
    stickers: [
      {
        type: 'music',
        musicTrack: 'Subpixel Harmonics in A Minor',
        musicArtist: 'ModUI Sound Lab · 44.1kHz',
      },
      {
        type: 'quote',
        quoteText: 'Audio and visual damping must share the exact same spring constant.',
        quoteAuthor: 'Kenji T. · DSP Engineer',
      },
    ],
  },
  {
    id: 'story-3',
    timestamp: 'Yesterday',
    tag: 'CHAPTER 03 · HARDWARE',
    title: 'Anodized 6061 Aluminum',
    description: 'CNC machined bead-blasted metal chassis. Precision tolerances below 20 microns produce an acoustic snap that plastic cannot match.',
    gradient: 'linear-gradient(145deg, #041f17 0%, #064e3b 50%, #022c22 100%)',
    accentColor: '#10b981',
    durationMs: 5000,
    stickers: [
      {
        type: 'reaction-slider',
        sliderEmoji: '🔥',
      },
    ],
  },
  {
    id: 'story-4',
    timestamp: '2d ago',
    tag: 'CHAPTER 04 · REVEAL',
    title: 'Verlet GPU Cloth Dynamics',
    description: 'Tensile structural physics running 120 FPS directly in the DOM. The boundary between physical industrial hardware and software has dissolved.',
    gradient: 'linear-gradient(145deg, #1e112a 0%, #3b0764 50%, #0f0716 100%)',
    accentColor: '#a855f7',
    durationMs: 6000,
    stickers: [
      {
        type: 'link',
        linkText: 'Explore Verlet Primitives →',
        linkUrl: '#/components/neural-cloth-mesh',
      },
    ],
  },
  {
    id: 'story-5',
    timestamp: '3d ago',
    tag: 'CHAPTER 05 · PRODUCTION',
    title: '21 Primitives Shipped Worldwide',
    description: 'From ballistic VU meters to cylindrical carousels. ModUI is now in production for creative developers across 40+ countries.',
    gradient: 'linear-gradient(145deg, #2b0b14 0%, #881337 50%, #190408 100%)',
    accentColor: '#f43f5e',
    durationMs: 5000,
    stickers: [
      {
        type: 'poll',
        poll: {
          question: 'Are you building your next app with ModUI?',
          options: [
            { id: 'opt-3', text: 'Already building! 🚀', votes: 289 },
            { id: 'opt-4', text: 'Starring repository ⭐', votes: 94 },
          ],
        },
      },
    ],
  },
];

// Audio Singleton Engine
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

// 1. Story slide advance tick
function playStoryAdvanceTick() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(700, t + 0.03);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.04);
  } catch {}
}

// 2. Poll vote celebration pop
function playVotePop() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(1040, t + 0.08);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.13);
  } catch {}
}

// 3. Heart reaction bubble chirp
function playReactionHeart() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, t); // E5
    osc.frequency.exponentialRampToValueAtTime(1318.5, t + 0.1); // E6
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  } catch {}
}

export const StoryTimeline: React.FC<StoryTimelineProps> = ({
  variant = 'instagram-dark',
  stories = DEFAULT_STORIES,
  username = 'modui.studio',
  handle = 'Dieter Rams × Web Audio',
  avatarUrl,
  soundEnabled = true,
  autoPlay = true,
  activeIndex: controlledIndex,
  showAdjacentPreviews = false,
  compact = false,
  onStoryChange,
  onPollVote,
  className = '',
  ...restProps
}) => {
  const [internalActiveIndex, setInternalActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [soundMuted, setSoundMuted] = useState(!soundEnabled);

  // Poll state map: storyId -> optionId selected
  const [userVotes, setUserVotes] = useState<Record<string, string>>({});
  // Reaction slider value: 0 to 100
  const [sliderValue, setSliderValue] = useState(70);
  // Flying floating hearts
  const [hearts, setHearts] = useState<Array<{ id: number; left: number }>>([]);
  const heartCounterRef = useRef(0);

  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalActiveIndex;
  const currentStory = stories[activeIndex] || stories[0];
  const storyDuration = currentStory.durationMs || 5000;

  const lastTimeRef = useRef<number>(Date.now());
  const holdStartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Navigation handlers
  const goToStory = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(stories.length - 1, index));
      if (controlledIndex === undefined) {
        setInternalActiveIndex(clamped);
      }
      setProgressPercent(0);
      lastTimeRef.current = Date.now();

      if (!soundMuted) {
        playStoryAdvanceTick();
      }

      onStoryChange?.(stories[clamped], clamped);
    },
    [controlledIndex, onStoryChange, soundMuted, stories]
  );

  const nextStory = useCallback(() => {
    if (activeIndex < stories.length - 1) {
      goToStory(activeIndex + 1);
    } else {
      // Loop back to start
      goToStory(0);
    }
  }, [activeIndex, goToStory, stories.length]);

  const prevStory = useCallback(() => {
    if (activeIndex > 0) {
      goToStory(activeIndex - 1);
    } else {
      goToStory(0);
    }
  }, [activeIndex, goToStory]);

  // Story Timer Loop
  useEffect(() => {
    if (!autoPlay || isPaused || isHolding) return;

    lastTimeRef.current = Date.now();
    const intervalMs = 40; // 25fps progress update

    const timer = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      setProgressPercent((prev) => {
        const increment = (delta / storyDuration) * 100;
        const next = prev + increment;
        if (next >= 100) {
          nextStory();
          return 0;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [autoPlay, isPaused, isHolding, storyDuration, nextStory]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextStory();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevStory();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setIsPaused((p) => !p);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setSoundMuted((m) => !m);
      }
    },
    [nextStory, prevStory]
  );

  // Press & Hold to pause story (just like Instagram)
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only hold if not clicking an interactive sticker button
    const target = e.target as HTMLElement;
    if (target.closest('button, input, a, .story-interactive-sticker')) {
      return;
    }
    holdStartTimerRef.current = setTimeout(() => {
      setIsHolding(true);
    }, 180);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (holdStartTimerRef.current) {
      clearTimeout(holdStartTimerRef.current);
    }

    if (isHolding) {
      setIsHolding(false);
      lastTimeRef.current = Date.now();
      return;
    }

    // If it was a quick tap, check left vs right half
    const target = e.target as HTMLElement;
    if (target.closest('button, input, a, .story-interactive-sticker, .story-bottom-action-bar')) {
      return;
    }

    const card = e.currentTarget.getBoundingClientRect();
    const tapX = e.clientX - card.left;
    const isRightHalf = tapX > card.width * 0.4;

    if (isRightHalf) {
      nextStory();
    } else {
      prevStory();
    }
  };

  // Poll voting
  const handleVote = (storyId: string, optionId: string) => {
    if (userVotes[storyId]) return; // Already voted
    setUserVotes((prev) => ({ ...prev, [storyId]: optionId }));
    if (!soundMuted) {
      playVotePop();
    }
    onPollVote?.(storyId, optionId);
  };

  // Flying heart reaction
  const triggerHeartReaction = () => {
    heartCounterRef.current += 1;
    const newHeart = {
      id: heartCounterRef.current,
      left: 70 + Math.random() * 20, // percentage from right
    };
    setHearts((prev) => [...prev, newHeart]);
    if (!soundMuted) {
      playReactionHeart();
    }

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1200);
  };

  return (
    <div
      className={`story-timeline-root story-theme-${variant} ${isHolding ? 'is-holding' : ''} ${compact ? 'story-timeline-compact' : ''} ${className}`}
      role="region"
      aria-label="Instagram-Style Story Timeline"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      {...restProps}
    >
      {/* 3D Stage Carousel: Left/Previous story preview card (optional) */}
      {showAdjacentPreviews && (
        <div
          className="story-side-preview story-preview-prev"
          onClick={prevStory}
          aria-hidden="true"
          title="Go to previous story"
        >
          {stories[activeIndex - 1] && (
            <div
              className="story-side-card"
              style={{ background: stories[activeIndex - 1].gradient }}
            >
              <div className="side-card-overlay">
                <span className="side-card-title">{stories[activeIndex - 1].title}</span>
                <span className="side-card-time">{stories[activeIndex - 1].timestamp}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Active Phone/Card Viewport (9:16 Aspect) */}
      <div
        className="story-phone-frame"
        style={{
          background: currentStory.gradient,
          '--story-accent': currentStory.accentColor,
        } as React.CSSProperties}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {/* Subtle ambient lighting vignette */}
        <div className="story-ambient-glow" style={{ background: currentStory.accentColor }} />
        <div className="story-glass-grain" />

        {/* 1. TOP SEGMENTED PROGRESS BARS (Instagram Signature) */}
        <div className="story-progress-strip" role="progressbar" aria-valuenow={activeIndex}>
          {stories.map((story, idx) => {
            let fillWidth = '0%';
            if (idx < activeIndex) {
              fillWidth = '100%';
            } else if (idx === activeIndex) {
              fillWidth = `${progressPercent}%`;
            }

            return (
              <div
                key={story.id}
                className={`story-progress-segment ${idx === activeIndex ? 'is-active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  goToStory(idx);
                }}
              >
                <div
                  className="story-progress-fill"
                  style={{ width: fillWidth }}
                />
              </div>
            );
          })}
        </div>

        {/* 2. TOP STORY HEADER (Profile + Time + Sound/Pause Controls) */}
        <header className="story-top-header">
          <div className="story-author-group">
            <div className="story-avatar-aura">
              <div className="story-avatar-img">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={username} />
                ) : (
                  <span>MU</span>
                )}
              </div>
            </div>

            <div className="story-author-meta">
              <div className="story-author-name-row">
                <span className="story-username">{username}</span>
                <span className="story-verified-badge" title="Verified Creator">✓</span>
                <span className="story-time-ago">{currentStory.timestamp}</span>
              </div>
              <span className="story-handle-subtitle">{handle}</span>
            </div>
          </div>

          <div className="story-top-actions">
            {/* Audio Mute / Unmute Button */}
            <button
              type="button"
              className="story-icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                setSoundMuted((m) => !m);
              }}
              aria-label={soundMuted ? 'Unmute Story Sound' : 'Mute Story Sound'}
              title={soundMuted ? 'Unmute (M)' : 'Mute (M)'}
            >
              {soundMuted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                  <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>

            {/* Play / Pause Toggle Button */}
            <button
              type="button"
              className="story-icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsPaused((p) => !p);
              }}
              aria-label={isPaused ? 'Resume Story' : 'Pause Story'}
              title={isPaused ? 'Play (P)' : 'Pause (P)'}
            >
              {isPaused ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* 3. STORY BODY CONTENT (Typography, Narrative & Media) */}
        <main className="story-content-body">
          <div className="story-tag-pill">
            <span className="story-tag-dot" />
            <span className="story-tag-text">{currentStory.tag}</span>
          </div>

          <h2 className="story-headline-title">{currentStory.title}</h2>
          <p className="story-narrative-copy">{currentStory.description}</p>

          {/* 4. INTERACTIVE INSTAGRAM STICKERS */}
          {currentStory.stickers && currentStory.stickers.length > 0 && (
            <div className="story-stickers-container">
              {currentStory.stickers.map((sticker, sIdx) => {
                // A. Interactive Poll Sticker
                if (sticker.type === 'poll' && sticker.poll) {
                  const poll = sticker.poll;
                  const votedOptionId = userVotes[currentStory.id];
                  const hasVoted = Boolean(votedOptionId);

                  const opt1 = poll.options[0];
                  const opt2 = poll.options[1];
                  const totalVotes = opt1.votes + opt2.votes + (hasVoted ? 1 : 0);
                  const opt1Votes = opt1.votes + (votedOptionId === opt1.id ? 1 : 0);
                  const opt2Votes = opt2.votes + (votedOptionId === opt2.id ? 1 : 0);
                  const pct1 = Math.round((opt1Votes / totalVotes) * 100);
                  const pct2 = 100 - pct1;

                  return (
                    <div
                      key={sIdx}
                      className="story-interactive-sticker sticker-poll-card"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h4 className="poll-question-title">{poll.question}</h4>

                      <div className="poll-options-grid">
                        {/* Option 1 */}
                        <button
                          type="button"
                          className={`poll-option-btn ${votedOptionId === opt1.id ? 'is-selected' : ''}`}
                          onClick={() => handleVote(currentStory.id, opt1.id)}
                          disabled={hasVoted}
                        >
                          {hasVoted && (
                            <div className="poll-result-bar" style={{ width: `${pct1}%` }} />
                          )}
                          <span className="poll-option-text">{opt1.text}</span>
                          {hasVoted && <span className="poll-percentage">{pct1}%</span>}
                        </button>

                        {/* Option 2 */}
                        <button
                          type="button"
                          className={`poll-option-btn ${votedOptionId === opt2.id ? 'is-selected' : ''}`}
                          onClick={() => handleVote(currentStory.id, opt2.id)}
                          disabled={hasVoted}
                        >
                          {hasVoted && (
                            <div className="poll-result-bar" style={{ width: `${pct2}%` }} />
                          )}
                          <span className="poll-option-text">{opt2.text}</span>
                          {hasVoted && <span className="poll-percentage">{pct2}%</span>}
                        </button>
                      </div>
                    </div>
                  );
                }

                // B. Emoji Slider Sticker
                if (sticker.type === 'reaction-slider') {
                  return (
                    <div
                      key={sIdx}
                      className="story-interactive-sticker sticker-slider-card"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="slider-header-text">How hyped are you for this?</div>
                      <div className="slider-track-wrap">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={sliderValue}
                          onChange={(e) => setSliderValue(Number(e.target.value))}
                          className="story-native-slider"
                        />
                        <div
                          className="slider-emoji-handle"
                          style={{ left: `${sliderValue}%` }}
                        >
                          <span>{sticker.sliderEmoji || '🔥'}</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                // C. Music Sticker
                if (sticker.type === 'music') {
                  return (
                    <div
                      key={sIdx}
                      className="story-interactive-sticker sticker-music-pill"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="music-bars-anim">
                        <span /><span /><span /><span />
                      </div>
                      <div className="music-track-info">
                        <span className="music-title">{sticker.musicTrack}</span>
                        <span className="music-artist">{sticker.musicArtist}</span>
                      </div>
                    </div>
                  );
                }

                // D. Tap Link Sticker
                if (sticker.type === 'link') {
                  return (
                    <a
                      key={sIdx}
                      href={sticker.linkUrl || '#'}
                      className="story-interactive-sticker sticker-link-pill"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="link-icon">🔗</span>
                      <span className="link-text">{sticker.linkText || 'Tap to inspect'}</span>
                    </a>
                  );
                }

                // E. Pull Quote Sticker
                if (sticker.type === 'quote') {
                  return (
                    <blockquote
                      key={sIdx}
                      className="story-interactive-sticker sticker-quote-bubble"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="quote-body">“{sticker.quoteText}”</p>
                      <cite className="quote-credit">— {sticker.quoteAuthor}</cite>
                    </blockquote>
                  );
                }

                return null;
              })}
            </div>
          )}
        </main>

        {/* Floating Flying Hearts Container */}
        <div className="story-floating-hearts-layer" aria-hidden="true">
          {hearts.map((heart) => (
            <span
              key={heart.id}
              className="floating-heart"
              style={{ right: `${heart.left}%` }}
            >
              ❤️
            </span>
          ))}
        </div>

        {/* 5. BOTTOM INTERACTIVE INSTAGRAM ACTION BAR */}
        <footer
          className="story-bottom-action-bar"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="story-input-container">
            <input
              type="text"
              placeholder="Send message..."
              className="story-message-input"
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
            />
          </div>

          <button
            type="button"
            className="story-bottom-heart-btn"
            onClick={triggerHeartReaction}
            aria-label="Send Heart Reaction"
            title="Send Heart"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          <button
            type="button"
            className="story-bottom-share-btn"
            onClick={nextStory}
            aria-label="Next Story Slide"
            title="Next Story (Tap Right)"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </footer>

        {/* Tap guide overlay hints */}
        <div className="story-tap-hints" aria-hidden="true">
          <div className="tap-hint tap-hint-left">‹ Tap</div>
          <div className="tap-hint tap-hint-right">Tap ›</div>
        </div>
      </div>

      {/* 3D Stage Carousel: Right/Next story preview card (optional) */}
      {showAdjacentPreviews && (
        <div
          className="story-side-preview story-preview-next"
          onClick={nextStory}
          aria-hidden="true"
          title="Go to next story"
        >
          {stories[activeIndex + 1] && (
            <div
              className="story-side-card"
              style={{ background: stories[activeIndex + 1].gradient }}
            >
              <div className="side-card-overlay">
                <span className="side-card-title">{stories[activeIndex + 1].title}</span>
                <span className="side-card-time">{stories[activeIndex + 1].timestamp}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
