import React, { useState, useCallback, useRef } from 'react';
import './TimelineRoadmap.css';

export type TimelineVariant = 'studio-light' | 'warm-editorial' | 'minimal-mono' | 'cinema-dark';
export type TimelineOrientation = 'vertical' | 'horizontal';
export type MilestoneStatus = 'shipped' | 'in-progress' | 'planned';

export interface TimelineMilestone {
  id: string;
  date: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  tag?: string;
}

export interface TimelineRoadmapProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual theme finish (default: 'studio-light') */
  variant?: TimelineVariant;
  /** Layout orientation (default: 'vertical') */
  orientation?: TimelineOrientation;
  /** Milestone list data */
  items?: TimelineMilestone[];
  /** Controlled active milestone ID */
  activeId?: string;
  /** Callback fired when a milestone is selected */
  onSelectMilestone?: (item: TimelineMilestone, index: number) => void;
  /** Synthesize acoustic latch tick when switching milestones */
  soundEnabled?: boolean;
  /** Compact mode optimized for catalogue cards and preview stages */
  compact?: boolean;
  /** Optional custom child elements */
  children?: React.ReactNode;
}

export const DEFAULT_ROADMAP_ITEMS: TimelineMilestone[] = [
  {
    id: 'm1',
    date: 'Q1 2026',
    title: 'Core Engine 2.0',
    description: 'Subpixel physics rendering pipeline with zero runtime style overhead.',
    status: 'shipped',
    tag: 'Architecture',
  },
  {
    id: 'm2',
    date: 'Q2 2026',
    title: 'Spatial Audio Haptics',
    description: 'Dual-oscillator acoustic micro-ticks synthesized via Web Audio API.',
    status: 'shipped',
    tag: 'Audio Lab',
  },
  {
    id: 'm3',
    date: 'Q3 2026',
    title: 'Dynamic Design Tokens',
    description: 'Curated light studio palette, fluid typography, and responsive spring gestures.',
    status: 'in-progress',
    tag: 'Design System',
  },
  {
    id: 'm4',
    date: 'Q4 2026',
    title: 'Generative Canvas Primitives',
    description: 'Hardware-accelerated liquid caustics, cloth mesh lattices, and generative streams.',
    status: 'planned',
    tag: 'Next-Gen UI',
  },
];

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

function playMilestoneTick() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1750, t);
    osc.frequency.exponentialRampToValueAtTime(520, t + 0.018);

    gain.gain.setValueAtTime(0.035, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.018);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.022);
  } catch {
    // Graceful fallback
  }
}

export const TimelineRoadmap: React.FC<TimelineRoadmapProps> = ({
  variant = 'studio-light',
  orientation = 'vertical',
  items = DEFAULT_ROADMAP_ITEMS,
  activeId: controlledActiveId,
  onSelectMilestone,
  soundEnabled = true,
  compact = false,
  className = '',
  children,
  ...restProps
}) => {
  const [internalActiveId, setInternalActiveId] = useState<string>(
    controlledActiveId || (items[2] ? items[2].id : items[0]?.id || '')
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const effectiveActiveId = controlledActiveId !== undefined ? controlledActiveId : internalActiveId;
  const activeIndex = items.findIndex((i) => i.id === effectiveActiveId);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  const triggerSound = useCallback(() => {
    if (soundEnabled) {
      playMilestoneTick();
    }
  }, [soundEnabled]);

  const selectMilestone = useCallback(
    (item: TimelineMilestone, index: number) => {
      setInternalActiveId(item.id);
      triggerSound();
      if (onSelectMilestone) {
        onSelectMilestone(item, index);
      }
    },
    [onSelectMilestone, triggerSound]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (orientation === 'vertical') {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = Math.min(items.length - 1, safeActiveIndex + 1);
        selectMilestone(items[nextIdx], nextIdx);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = Math.max(0, safeActiveIndex - 1);
        selectMilestone(items[prevIdx], prevIdx);
      }
    } else {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIdx = Math.min(items.length - 1, safeActiveIndex + 1);
        selectMilestone(items[nextIdx], nextIdx);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIdx = Math.max(0, safeActiveIndex - 1);
        selectMilestone(items[prevIdx], prevIdx);
      }
    }

    if (e.key === 'Home') {
      e.preventDefault();
      selectMilestone(items[0], 0);
    } else if (e.key === 'End') {
      e.preventDefault();
      const lastIdx = items.length - 1;
      selectMilestone(items[lastIdx], lastIdx);
    }
  };

  // Progress percentage for filled spine
  const progressRatio = items.length > 1 ? safeActiveIndex / (items.length - 1) : 1;
  const progressPercent = Math.min(100, Math.max(0, progressRatio * 100));

  // In compact mode, force clean horizontal presentation
  const effectiveOrientation = compact ? 'horizontal' : orientation;

  return (
    <div
      ref={containerRef}
      className={`modui-timeline-roadmap modui-timeline-theme-${variant} modui-timeline-${effectiveOrientation} ${compact ? 'modui-timeline-compact' : ''} ${className}`}
      role="region"
      aria-label="Timeline Roadmap"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      {...restProps}
    >
      {/* Background Spine with Filled Progress */}
      <div className="modui-timeline-spine-track" aria-hidden="true">
        <div
          className="modui-timeline-spine-fill"
          style={
            effectiveOrientation === 'vertical'
              ? { height: `${progressPercent}%` }
              : { width: `${progressPercent}%` }
          }
        />
      </div>

      {/* Milestone List */}
      <div className="modui-timeline-milestones" role="list">
        {items.map((item, index) => {
          const isActive = item.id === effectiveActiveId;
          const isPassed = index <= safeActiveIndex;

          let statusLabel = 'Planned';
          if (item.status === 'shipped') statusLabel = 'Shipped';
          else if (item.status === 'in-progress') statusLabel = 'In Progress';

          return (
            <div
              key={item.id}
              className={`modui-timeline-milestone ${isActive ? 'modui-timeline-milestone--active' : ''} ${isPassed ? 'modui-timeline-milestone--passed' : ''}`}
              role="listitem"
            >
              {/* Interactive Node Marker */}
              <button
                type="button"
                className={`modui-timeline-node ${isActive ? 'modui-timeline-node--active' : ''} ${isPassed ? 'modui-timeline-node--passed' : ''}`}
                onClick={() => selectMilestone(item, index)}
                aria-label={`Milestone: ${item.title} (${item.date}) - ${statusLabel}`}
                aria-pressed={isActive}
              >
                <span className="modui-timeline-node-core" />
              </button>

              {/* Milestone Content Card */}
              <div
                className="modui-timeline-card"
                onClick={() => selectMilestone(item, index)}
              >
                <div className="modui-timeline-card-header">
                  <span className="modui-timeline-date">{item.date}</span>
                  <span className={`modui-timeline-status modui-timeline-status--${item.status}`}>
                    {statusLabel}
                  </span>
                </div>

                <h3 className="modui-timeline-title">{item.title}</h3>
                <p className="modui-timeline-desc">{item.description}</p>

                {!compact && item.tag && (
                  <div className="modui-timeline-tags">
                    <span className="modui-timeline-tag">{item.tag}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {children}
    </div>
  );
};

export default TimelineRoadmap;
