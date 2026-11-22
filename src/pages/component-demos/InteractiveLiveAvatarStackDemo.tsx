import React, { useState, useRef } from 'react';
import {
  InteractiveLiveAvatarStack,
  type LiveAvatarStackVariant,
  type LiveAvatarStackSize,
  type TeammatePresence,
  type InteractiveLiveAvatarStackHandle,
} from '../../components/ui/live-avatar-stack';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function InteractiveLiveAvatarStackDemo({ theme }: DemoProps) {
  const isDark =
    theme
      ? theme === 'dark'
      : typeof document !== 'undefined' &&
        document.documentElement.getAttribute('data-theme') === 'dark';

  const [variant, setVariant] = useState<LiveAvatarStackVariant>(() =>
    isDark ? 'studio-glass' : 'clean-porcelain'
  );
  const [size, setSize] = useState<LiveAvatarStackSize>('md');
  const [maxVisible, setMaxVisible] = useState<number>(4);
  const [showStatusRings, setShowStatusRings] = useState<boolean>(true);
  const [showTooltips, setShowTooltips] = useState<boolean>(true);
  const [showInviteButton, setShowInviteButton] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeTeammate, setActiveTeammate] = useState<TeammatePresence | null>(null);

  const stackRef = useRef<InteractiveLiveAvatarStackHandle>(null);

  return (
    <>
      <div className="modui-canvas-stage">
        <div
          style={{
            width: '100%',
            maxWidth: '680px',
            margin: '0 auto',
            padding: '3rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '280px',
          }}
        >
          <InteractiveLiveAvatarStack
            ref={stackRef}
            variant={variant}
            size={size}
            maxVisible={maxVisible}
            showStatusRings={showStatusRings}
            showTooltips={showTooltips}
            showInviteButton={showInviteButton}
            soundEnabled={soundEnabled}
            onTeammateClick={(tm) => setActiveTeammate(tm)}
            onOverflowClick={(hidden) => {
              if (hidden.length > 0) setActiveTeammate(hidden[0]);
            }}
          />

          <div className="modui-stage-caption" style={{ marginTop: '2.25rem' }}>
            <div className="modui-stage-caption-hint">
              Hover stack to spread avatars with elastic spring physics &bull; Hover individual bubbles for rich activity tooltips &bull; Click an avatar to inspect details
            </div>
          </div>
        </div>
      </div>

      <div className="modui-controls-panel">
        <div className="modui-control-group">
          <label className="modui-control-label">Material Variant</label>
          <select
            className="modui-control-select"
            value={variant}
            onChange={(e) => setVariant(e.target.value as LiveAvatarStackVariant)}
          >
            <option value="studio-glass">Studio Glass (Frosted Obsidian & Cyan)</option>
            <option value="clean-porcelain">Clean Porcelain (Architectural White)</option>
            <option value="cyber-neon">Cyber Neon (Phosphor Emerald & Dark)</option>
            <option value="warm-editorial">Warm Editorial (Bronze & Amber)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Avatar Scale</label>
          <select
            className="modui-control-select"
            value={size}
            onChange={(e) => setSize(e.target.value as LiveAvatarStackSize)}
          >
            <option value="sm">Small (32px — Compact Headers & Navbars)</option>
            <option value="md">Medium (44px — Standard Hero & Document Toolbar)</option>
            <option value="lg">Large (56px — Keynote Collaboration Deck)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Max Visible Avatars</label>
          <select
            className="modui-control-select"
            value={maxVisible}
            onChange={(e) => setMaxVisible(Number(e.target.value))}
          >
            <option value={2}>2 Visible (Early +N Overflow)</option>
            <option value={3}>3 Visible</option>
            <option value={4}>4 Visible (Standard)</option>
            <option value={5}>5 Visible</option>
            <option value={6}>6 Visible (Wide Track)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Options & Acoustics</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={showStatusRings}
                onChange={(e) => setShowStatusRings(e.target.checked)}
              />
              <span>Live Pulsating Presence Rings</span>
            </label>

            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={showTooltips}
                onChange={(e) => setShowTooltips(e.target.checked)}
              />
              <span>Rich Hover Inspection Tooltips</span>
            </label>

            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={showInviteButton}
                onChange={(e) => setShowInviteButton(e.target.checked)}
              />
              <span>Show Collaborative Invite Button</span>
            </label>

            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              <span>Synthesized Acoustic Chimes & Pops</span>
            </label>
          </div>
        </div>

        {activeTeammate && (
          <div
            className="modui-control-group"
            style={{
              gridColumn: '1 / -1',
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-default)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Inspected Collaborator: {activeTeammate.name} ({activeTeammate.role || 'Member'})
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background:
                    activeTeammate.status === 'online'
                      ? 'rgba(16, 185, 129, 0.15)'
                      : activeTeammate.status === 'presenting'
                      ? 'rgba(139, 92, 246, 0.15)'
                      : 'rgba(245, 158, 11, 0.15)',
                  color:
                    activeTeammate.status === 'online'
                      ? '#10b981'
                      : activeTeammate.status === 'presenting'
                      ? '#8b5cf6'
                      : '#f59e0b',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {activeTeammate.status} &bull; {activeTeammate.latencyMs ?? 20}ms
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Current Focus: {activeTeammate.activity || 'Active in document'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
