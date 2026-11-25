import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import './InteractiveReactionPillBar.css';

export type ReactionPillVariant =
  | 'studio-obsidian'
  | 'clean-porcelain'
  | 'cyber-neon'
  | 'warm-editorial';

export type ReactionPillSize = 'sm' | 'md' | 'lg';

export interface ReactionItem {
  id: string;
  emoji: string;
  label: string;
  count: number;
  reacted: boolean;
  users?: string[];
}

export const DEFAULT_REACTIONS: ReactionItem[] = [
  {
    id: 'fire',
    emoji: '🔥',
    label: 'Fire',
    count: 14,
    reacted: true,
    users: ['Alex', 'Maya', 'Sam'],
  },
  {
    id: 'rocket',
    emoji: '🚀',
    label: 'Ship it',
    count: 9,
    reacted: false,
    users: ['Elena', 'Devon'],
  },
  {
    id: 'heart',
    emoji: '❤️',
    label: 'Love',
    count: 24,
    reacted: false,
    users: ['Priya', 'Noah', 'Liam'],
  },
  {
    id: 'clap',
    emoji: '👏',
    label: 'Applause',
    count: 6,
    reacted: false,
    users: ['Jordan'],
  },
];

export const DEFAULT_PICKER_EMOJIS: Array<{ emoji: string; label: string }> = [
  { emoji: '🎉', label: 'Celebrate' },
  { emoji: '👀', label: 'Eyes' },
  { emoji: '⚡', label: 'Fast' },
  { emoji: '💎', label: 'Gem' },
  { emoji: '🙌', label: 'Praise' },
  { emoji: '💡', label: 'Idea' },
];

export interface InteractiveReactionPillBarProps {
  reactions?: ReactionItem[];
  defaultReactions?: ReactionItem[];
  pickerEmojis?: Array<{ emoji: string; label: string }>;
  variant?: ReactionPillVariant;
  size?: ReactionPillSize;
  frameless?: boolean;
  showAddButton?: boolean;
  showTooltips?: boolean;
  soundEnabled?: boolean;
  readOnly?: boolean;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onReactionToggle?: (item: ReactionItem, allReactions: ReactionItem[]) => void;
  onChange?: (reactions: ReactionItem[]) => void;
}

export interface InteractiveReactionPillBarHandle {
  getReactions: () => ReactionItem[];
  toggleReaction: (idOrEmoji: string) => void;
  addReaction: (emoji: string, label?: string) => void;
  reset: () => void;
}

export const InteractiveReactionPillBar = forwardRef<
  InteractiveReactionPillBarHandle,
  InteractiveReactionPillBarProps
>(function InteractiveReactionPillBar(
  {
    reactions: controlledReactions,
    defaultReactions = DEFAULT_REACTIONS,
    pickerEmojis = DEFAULT_PICKER_EMOJIS,
    variant = 'studio-obsidian',
    size = 'md',
    frameless = false,
    showAddButton = true,
    showTooltips = true,
    soundEnabled = true,
    readOnly = false,
    compact = false,
    className = '',
    style = {},
    onReactionToggle,
    onChange,
  },
  ref
) {
  const isControlled = controlledReactions !== undefined;
  const [internalReactions, setInternalReactions] = useState<ReactionItem[]>(() =>
    defaultReactions.map((r) => ({ ...r }))
  );

  const activeReactions = isControlled ? controlledReactions : internalReactions;
  const reactionsRef = useRef<ReactionItem[]>(activeReactions);
  reactionsRef.current = activeReactions;

  const [poppedId, setPoppedId] = useState<string | null>(null);
  const [sparkId, setSparkId] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);

  const rootRef = useRef<HTMLDivElement>(null);
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

  const playMarimbaPop = useCallback(
    (active: boolean, index: number) => {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const baseFreq = active ? 523.25 + (index % 6) * 55 : 349.23;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(
          active ? baseFreq * 1.25 : baseFreq * 0.8,
          now + 0.06
        );

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      } catch {
        // Ignore audio restrictions in restricted environments
      }
    },
    [soundEnabled, getAudioContext]
  );

  // Close popover on outside click or Escape
  useEffect(() => {
    if (!isPickerOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsPickerOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isPickerOpen]);

  const triggerAnimations = useCallback((id: string, activated: boolean) => {
    setPoppedId(id);
    if (activated) {
      setSparkId(id);
    }
    setTimeout(() => {
      setPoppedId((prev) => (prev === id ? null : prev));
      setSparkId((prev) => (prev === id ? null : prev));
    }, 520);
  }, []);

  const commitReactions = useCallback(
    (nextList: ReactionItem[], toggledItem?: ReactionItem) => {
      reactionsRef.current = nextList;
      if (!isControlled) {
        setInternalReactions(nextList);
      }
      if (toggledItem) {
        onReactionToggle?.(toggledItem, nextList);
      }
      onChange?.(nextList);
    },
    [isControlled, onReactionToggle, onChange]
  );

  const handleToggle = useCallback(
    (idOrEmoji: string) => {
      if (readOnly) return;
      const current = reactionsRef.current;
      const idx = current.findIndex((r) => r.id === idOrEmoji || r.emoji === idOrEmoji);
      if (idx === -1) return;

      const target = current[idx];
      const nextReacted = !target.reacted;
      const updatedItem: ReactionItem = {
        ...target,
        reacted: nextReacted,
        count: Math.max(0, target.count + (nextReacted ? 1 : -1)),
      };

      const nextList = current.map((r, i) => (i === idx ? updatedItem : r));
      triggerAnimations(updatedItem.id, nextReacted);
      playMarimbaPop(nextReacted, idx);
      commitReactions(nextList, updatedItem);
    },
    [readOnly, triggerAnimations, playMarimbaPop, commitReactions]
  );

  const handleAddEmoji = useCallback(
    (emoji: string, label = 'Reaction') => {
      if (readOnly) return;
      const current = reactionsRef.current;
      const existingIdx = current.findIndex((r) => r.emoji === emoji);

      if (existingIdx !== -1) {
        const existing = current[existingIdx];
        if (!existing.reacted) {
          handleToggle(existing.id);
        } else {
          triggerAnimations(existing.id, true);
          playMarimbaPop(true, existingIdx);
        }
        setIsPickerOpen(false);
        return;
      }

      const newId = `emoji-${emoji}-${Date.now()}`;
      const created: ReactionItem = {
        id: newId,
        emoji,
        label,
        count: 1,
        reacted: true,
        users: ['You'],
      };

      const nextList = [...current, created];
      triggerAnimations(newId, true);
      playMarimbaPop(true, nextList.length - 1);
      setIsPickerOpen(false);
      commitReactions(nextList, created);
    },
    [readOnly, handleToggle, triggerAnimations, playMarimbaPop, commitReactions]
  );

  useImperativeHandle(
    ref,
    () => ({
      getReactions: () => reactionsRef.current,
      toggleReaction: (idOrEmoji: string) => handleToggle(idOrEmoji),
      addReaction: (emoji: string, label?: string) => handleAddEmoji(emoji, label),
      reset: () => {
        const fresh = defaultReactions.map((r) => ({ ...r }));
        setIsPickerOpen(false);
        commitReactions(fresh);
      },
    }),
    [handleToggle, handleAddEmoji, defaultReactions, commitReactions]
  );

  const formatTooltip = (item: ReactionItem) => {
    const names = item.users && item.users.length > 0 ? item.users.slice(0, 2).join(', ') : '';
    if (item.reacted) {
      return names ? `You, ${names} · ${item.label}` : `You · ${item.label}`;
    }
    return names ? `${names} · ${item.label}` : item.label;
  };

  return (
    <div
      ref={rootRef}
      className={`react-dock-root react-variant-${variant} react-size-${size} ${
        compact ? 'react-compact' : ''
      } ${className}`}
      style={style}
      role="group"
      aria-label="Emoji Reactions"
    >
      <div
        className={`react-dock-surface ${frameless ? 'react-dock-surface--frameless' : ''}`}
      >
        {activeReactions.map((item, idx) => {
          const isPopped = poppedId === item.id;
          const showSpark = sparkId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`react-pill-btn ${item.reacted ? 'react-pill-btn--active' : ''} ${
                isPopped ? 'react-pill-btn--pop' : ''
              }`}
              onClick={() => handleToggle(item.id)}
              disabled={readOnly}
              aria-pressed={item.reacted}
              aria-label={`${item.label} (${item.count})`}
            >
              {showSpark && (
                <span className="react-spark-emoji" aria-hidden="true">
                  {item.emoji}
                </span>
              )}
              <span className="react-pill-emoji" aria-hidden="true">
                {item.emoji}
              </span>
              <span
                key={`${item.id}-${item.count}`}
                className={`react-pill-count ${isPopped ? 'react-pill-count--tick' : ''}`}
              >
                {item.count}
              </span>

              {showTooltips && !compact && (
                <span className="react-pill-tooltip" role="tooltip">
                  {formatTooltip(item)}
                </span>
              )}
            </button>
          );
        })}

        {showAddButton && !readOnly && (
          <div className="react-add-wrapper">
            <button
              type="button"
              className="react-add-btn"
              onClick={() => {
                setIsPickerOpen((prev) => !prev);
                playMarimbaPop(true, 4);
              }}
              aria-haspopup="menu"
              aria-expanded={isPickerOpen}
              aria-label="Add reaction"
            >
              +
            </button>

            {isPickerOpen && (
              <div className="react-popover" role="menu" aria-label="Quick reaction picker">
                {pickerEmojis.map((pick) => (
                  <button
                    key={pick.emoji}
                    type="button"
                    role="menuitem"
                    className="react-popover-pick"
                    onClick={() => handleAddEmoji(pick.emoji, pick.label)}
                    aria-label={`Add ${pick.label} (${pick.emoji})`}
                  >
                    {pick.emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
