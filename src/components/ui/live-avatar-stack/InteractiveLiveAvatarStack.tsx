import React, {
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import './InteractiveLiveAvatarStack.css';

export type LivePresenceStatus = 'online' | 'idle' | 'presenting' | 'offline';

export interface TeammatePresence {
  id: string;
  name: string;
  initials?: string;
  avatarUrl?: string;
  role?: string;
  activity?: string;
  status: LivePresenceStatus;
  latencyMs?: number;
  color?: string;
}

export type LiveAvatarStackVariant =
  | 'studio-glass'
  | 'clean-porcelain'
  | 'cyber-neon'
  | 'warm-editorial';

export type LiveAvatarStackSize = 'sm' | 'md' | 'lg';

export interface InteractiveLiveAvatarStackProps {
  /** Array of live active teammate records */
  teammates?: TeammatePresence[];
  /** Styling chassis and theme */
  variant?: LiveAvatarStackVariant;
  /** Size scale preset */
  size?: LiveAvatarStackSize;
  /** Maximum number of avatar bubbles visible before +N overflow */
  maxVisible?: number;
  /** Controlled expanded spread state (spreads avatars horizontally) */
  expanded?: boolean;
  /** Whether to render live pulsating presence status rings */
  showStatusRings?: boolean;
  /** Whether to show rich hover inspection tooltips */
  showTooltips?: boolean;
  /** Whether to render the "+ Invite / Add" peer button */
  showInviteButton?: boolean;
  /** Whether to enable synthesized Web Audio API haptics */
  soundEnabled?: boolean;
  /** Compact density mode for card previews */
  compact?: boolean;
  /** Callback when an avatar is clicked */
  onTeammateClick?: (teammate: TeammatePresence) => void;
  /** Callback when the invite button is clicked */
  onInviteClick?: () => void;
  /** Callback when the +N overflow pill is clicked */
  onOverflowClick?: (hiddenTeammates: TeammatePresence[]) => void;
  /** Custom container class */
  className?: string;
  /** Custom container style */
  style?: React.CSSProperties;
}

export interface InteractiveLiveAvatarStackHandle {
  addTeammate: (teammate: TeammatePresence) => void;
  removeTeammate: (id: string) => void;
  updateStatus: (id: string, status: LivePresenceStatus, activity?: string) => void;
  getTeammates: () => TeammatePresence[];
}

export const DEFAULT_TEAMMATES: TeammatePresence[] = [
  {
    id: 'user-sr',
    name: 'Sarah Ross',
    initials: 'SR',
    role: 'Staff Frontend Engineer',
    activity: 'Editing HeroSection.tsx',
    status: 'online',
    latencyMs: 24,
    color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  },
  {
    id: 'user-al',
    name: 'Alex Lin',
    initials: 'AL',
    role: 'Product Designer',
    activity: 'Presenting Canvas Frames',
    status: 'presenting',
    latencyMs: 31,
    color: 'linear-gradient(135deg, #10b981, #047857)',
  },
  {
    id: 'user-md',
    name: 'Marco Diaz',
    initials: 'MD',
    role: 'Systems Architect',
    activity: 'Idle (5m ago)',
    status: 'idle',
    latencyMs: 42,
    color: 'linear-gradient(135deg, #f59e0b, #b45309)',
  },
  {
    id: 'user-ek',
    name: 'Elena Kostova',
    initials: 'EK',
    role: 'Creative Developer',
    activity: 'Inspecting WebGL Shaders',
    status: 'online',
    latencyMs: 18,
    color: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  },
  {
    id: 'user-jt',
    name: 'James Taylor',
    initials: 'JT',
    role: 'DevOps Lead',
    activity: 'Deploying Edge Clusters',
    status: 'online',
    latencyMs: 15,
    color: 'linear-gradient(135deg, #ec4899, #be185d)',
  },
];

// Web Audio API Acoustic Synthesizer
let sharedAudioCtx: AudioContext | null = null;
function getSharedAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtxClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtxClass) return null;
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    try {
      sharedAudioCtx = new AudioCtxClass();
    } catch {
      return null;
    }
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

function playJoinChime() {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    gain1.gain.setValueAtTime(0.09, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.33);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.08); // A5
    gain2.gain.setValueAtTime(0.12, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.43);
  } catch {}
}

function playBubblePop() {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  } catch {}
}

export const InteractiveLiveAvatarStack = forwardRef<
  InteractiveLiveAvatarStackHandle,
  InteractiveLiveAvatarStackProps
>(function InteractiveLiveAvatarStack(
  {
    teammates: initialTeammates = DEFAULT_TEAMMATES,
    variant = 'studio-glass',
    size = 'md',
    maxVisible = 4,
    expanded: controlledExpanded,
    showStatusRings = true,
    showTooltips = true,
    showInviteButton = true,
    soundEnabled = true,
    compact = false,
    onTeammateClick,
    onInviteClick,
    onOverflowClick,
    className = '',
    style,
  },
  ref
) {
  const [teammates, setTeammates] = useState<TeammatePresence[]>(initialTeammates);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Sync initial teammates if prop updates
  React.useEffect(() => {
    setTeammates(initialTeammates);
  }, [initialTeammates]);

  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : isHovered;

  // Imperative handle
  useImperativeHandle(
    ref,
    () => ({
      addTeammate: (teammate: TeammatePresence) => {
        setTeammates((prev) => [...prev, teammate]);
        if (soundEnabled) playJoinChime();
      },
      removeTeammate: (id: string) => {
        setTeammates((prev) => prev.filter((t) => t.id !== id));
      },
      updateStatus: (id: string, status: LivePresenceStatus, activity?: string) => {
        setTeammates((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status, ...(activity ? { activity } : {}) } : t))
        );
      },
      getTeammates: () => teammates,
    }),
    [teammates, soundEnabled]
  );

  const visibleTeammates = teammates.slice(0, maxVisible);
  const hiddenTeammates = teammates.slice(maxVisible);
  const overflowCount = hiddenTeammates.length;

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (soundEnabled) playBubblePop();
  }, [soundEnabled]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      className={`modui-las-root modui-las-variant-${variant} modui-las-size-${size} ${
        compact ? 'modui-las-compact' : ''
      } ${className}`}
      style={style}
      role="group"
      aria-label="Multiplayer Live Teammate Presence Stack"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`modui-las-capsule ${isExpanded ? 'modui-las-expanded' : ''}`}>
        <div className="modui-las-track">
          {visibleTeammates.map((teammate) => {
            const initials =
              teammate.initials ||
              teammate.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

            return (
              <div
                key={teammate.id}
                className="modui-las-item"
                tabIndex={0}
                role="button"
                aria-label={`${teammate.name} - ${teammate.status} (${teammate.role || 'Member'})`}
                onClick={() => onTeammateClick?.(teammate)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onTeammateClick?.(teammate);
                  }
                }}
              >
                <div
                  className="modui-las-bubble"
                  style={{
                    background: teammate.color || 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  }}
                >
                  {teammate.avatarUrl ? (
                    <img src={teammate.avatarUrl} alt={teammate.name} />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>

                {showStatusRings && (
                  <div
                    className={`modui-las-status-dot modui-las-status-${teammate.status}`}
                    title={`Status: ${teammate.status}`}
                  />
                )}

                {showTooltips && !compact && (
                  <div className="modui-las-tooltip" role="tooltip">
                    <div className="modui-las-tooltip-name">
                      <span>{teammate.name}</span>
                      {teammate.latencyMs !== undefined && (
                        <span className="modui-las-tooltip-latency">
                          {teammate.latencyMs}ms
                        </span>
                      )}
                    </div>
                    {teammate.role && (
                      <div className="modui-las-tooltip-role">{teammate.role}</div>
                    )}
                    {teammate.activity && (
                      <div className="modui-las-tooltip-activity">
                        <span>●</span> {teammate.activity}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {overflowCount > 0 && (
            <button
              type="button"
              className="modui-las-overflow-btn"
              onClick={() => onOverflowClick?.(hiddenTeammates)}
              aria-label={`View ${overflowCount} more teammates`}
              title={`${overflowCount} more teammates active`}
            >
              +{overflowCount}
            </button>
          )}

          {showInviteButton && !compact && (
            <button
              type="button"
              className="modui-las-invite-btn"
              onClick={onInviteClick}
              aria-label="Invite teammate to live session"
              title="Invite teammate"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default InteractiveLiveAvatarStack;
