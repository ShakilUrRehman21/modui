import React, { useState } from 'react';
import { TerminalCodeDiff } from '../../components/ui/terminal-diff';
import type { TerminalVariant } from '../../components/ui/terminal-diff';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function TerminalCodeDiffDemo({ theme }: DemoProps) {
  const isDark =
    theme
      ? theme === 'dark'
      : typeof document !== 'undefined' &&
        document.documentElement.getAttribute('data-theme') === 'dark';

  const [variant, setVariant] = useState<TerminalVariant>(() =>
    isDark ? 'studio-dark' : 'clean-light'
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

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
            minHeight: '280px',
          }}
        >
          <TerminalCodeDiff
            variant={variant}
            soundEnabled={soundEnabled}
          />

          <div className="modui-stage-caption" style={{ marginTop: '1.5rem' }}>
            <div className="modui-stage-caption-hint">
              Switch tabs to inspect before/after diff reduction. Click Copy to write real code to your clipboard.
            </div>
          </div>
        </div>
      </div>

      <div className="modui-controls-panel">
        <div className="modui-control-group">
          <label className="modui-control-label">Terminal Finish</label>
          <select
            className="modui-control-select"
            value={variant}
            onChange={(e) => setVariant(e.target.value as TerminalVariant)}
          >
            <option value="studio-dark">Studio Dark (Vercel / Supabase Slate)</option>
            <option value="clean-light">Clean Light (Porcelain Minimal)</option>
            <option value="cyber-terminal">Cyber Terminal (Phosphor Emerald)</option>
            <option value="midnight-pro">Midnight Pro (OLED True Black)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Acoustic Feedback</label>
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              marginTop: '6px',
            }}
          >
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              style={{ accentColor: 'var(--accent-primary, #365CF5)' }}
            />
            Web Audio Micro-Ticks
          </label>
        </div>
      </div>
    </>
  );
}
