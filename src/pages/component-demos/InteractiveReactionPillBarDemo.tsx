import React, { useState, useRef } from 'react';
import {
  InteractiveReactionPillBar,
  type ReactionPillVariant,
  type ReactionPillSize,
  type InteractiveReactionPillBarHandle,
  type ReactionItem,
} from '../../components/ui/reaction-pill-bar';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function InteractiveReactionPillBarDemo({ theme }: DemoProps) {
  const isDark =
    theme
      ? theme === 'dark'
      : typeof document !== 'undefined' &&
        document.documentElement.getAttribute('data-theme') === 'dark';

  const [variant, setVariant] = useState<ReactionPillVariant>(() =>
    isDark ? 'studio-obsidian' : 'clean-porcelain'
  );
  const [size, setSize] = useState<ReactionPillSize>('md');
  const [frameless, setFrameless] = useState<boolean>(false);
  const [showAddButton, setShowAddButton] = useState<boolean>(true);
  const [showTooltips, setShowTooltips] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  const dockRef = useRef<InteractiveReactionPillBarHandle>(null);

  const handleToggle = (item: ReactionItem) => {
    setLastEvent(
      `${item.emoji} ${item.label} → ${item.reacted ? 'Reacted' : 'Removed'} (${item.count})`
    );
  };

  return (
    <>
      <div className="modui-canvas-stage">
        <div
          style={{
            width: '100%',
            maxWidth: '680px',
            margin: '0 auto',
            padding: '2.5rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '320px',
          }}
        >
          <InteractiveReactionPillBar
            ref={dockRef}
            variant={variant}
            size={size}
            frameless={frameless}
            showAddButton={showAddButton}
            showTooltips={showTooltips}
            soundEnabled={soundEnabled}
            onReactionToggle={handleToggle}
          />

          <div className="modui-stage-caption" style={{ marginTop: '2rem' }}>
            <div className="modui-stage-caption-hint">
              Click any reaction pill to toggle &bull; Hover for contributors &bull; Use + to add new emoji reactions
            </div>
          </div>
        </div>
      </div>

      <div className="modui-controls-panel">
        <div className="modui-control-group">
          <label className="modui-control-label">Visual Variant</label>
          <select
            className="modui-control-select"
            value={variant}
            onChange={(e) => setVariant(e.target.value as ReactionPillVariant)}
          >
            <option value="studio-obsidian">Studio Obsidian (Dark)</option>
            <option value="clean-porcelain">Clean Porcelain (Light)</option>
            <option value="cyber-neon">Cyber Neon (Cyan)</option>
            <option value="warm-editorial">Warm Editorial (Amber)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Pill Scale</label>
          <select
            className="modui-control-select"
            value={size}
            onChange={(e) => setSize(e.target.value as ReactionPillSize)}
          >
            <option value="sm">Small (Compact Thread)</option>
            <option value="md">Medium (Default Dock)</option>
            <option value="lg">Large (Showcase)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Quick Actions</label>
          <div className="modui-control-buttons">
            <button
              type="button"
              className="modui-control-btn"
              onClick={() => dockRef.current?.toggleReaction('rocket')}
            >
              🚀 Toggle Ship It
            </button>
            <button
              type="button"
              className="modui-control-btn"
              onClick={() => dockRef.current?.addReaction('🎉', 'Celebrate')}
            >
              🎉 Add Celebrate
            </button>
            <button
              type="button"
              className="modui-control-btn"
              onClick={() => {
                dockRef.current?.reset();
                setLastEvent('Reset to default reactions');
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Options &amp; Acoustics</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              <span>Web Audio Marimba Pops</span>
            </label>
            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={showAddButton}
                onChange={(e) => setShowAddButton(e.target.checked)}
              />
              <span>Quick-Add Emoji Popover (+)</span>
            </label>
            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={showTooltips}
                onChange={(e) => setShowTooltips(e.target.checked)}
              />
              <span>Hover Reactor Tooltips</span>
            </label>
            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={frameless}
                onChange={(e) => setFrameless(e.target.checked)}
              />
              <span>Frameless Inline Mode</span>
            </label>
          </div>
        </div>

        {lastEvent && (
          <div className="modui-control-group" style={{ gridColumn: '1 / -1' }}>
            <label className="modui-control-label">Latest Reaction Event</label>
            <div
              style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
              }}
            >
              {lastEvent}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
