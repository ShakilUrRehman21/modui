import React, { useState } from 'react';
import { FlipClockCountdown } from '../../components/ui/flip-clock';
import type {
  FlipClockVariant,
  FlipClockSize,
  FlipClockMode,
} from '../../components/ui/flip-clock';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function FlipClockCountdownDemo({ theme }: DemoProps) {
  const isDark =
    theme
      ? theme === 'dark'
      : typeof document !== 'undefined' &&
        document.documentElement.getAttribute('data-theme') === 'dark';

  const [variant, setVariant] = useState<FlipClockVariant>(() =>
    isDark ? 'dark-monolith' : 'clean-porcelain'
  );
  const [size, setSize] = useState<FlipClockSize>('md');
  const [mode, setMode] = useState<FlipClockMode>('countdown');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showDays, setShowDays] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);

  return (
    <>
      <div className="modui-canvas-stage">
        <div
          style={{
            width: '100%',
            maxWidth: '720px',
            margin: '0 auto',
            padding: '2.5rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '280px',
          }}
        >
          <FlipClockCountdown
            variant={variant}
            size={size}
            mode={mode}
            soundEnabled={soundEnabled}
            showDays={showDays}
            showLabels={showLabels}
          />

          <div className="modui-stage-caption" style={{ marginTop: '2rem' }}>
            <div className="modui-stage-caption-hint">
              Authentic 3D mechanical split-flap flip tiles with folding leaf physics, center axle hinge pins, and acoustic clack haptics.
            </div>
          </div>
        </div>
      </div>

      <div className="modui-controls-panel">
        <div className="modui-control-group">
          <label className="modui-control-label">Material Finish</label>
          <select
            className="modui-control-select"
            value={variant}
            onChange={(e) => setVariant(e.target.value as FlipClockVariant)}
          >
            <option value="dark-monolith">Dark Monolith (Graphite / Minimalist)</option>
            <option value="brass-vintage">Brass Vintage (Warm Ivory / Antique Brass)</option>
            <option value="clean-porcelain">Clean Porcelain (Architectural White)</option>
            <option value="cyber-terminal">Cyber Terminal (Phosphor Emerald Console)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Scale Sizing</label>
          <select
            className="modui-control-select"
            value={size}
            onChange={(e) => setSize(e.target.value as FlipClockSize)}
          >
            <option value="sm">Small (Embedded Badges & Compact Headers)</option>
            <option value="md">Medium (Standard Hero Section)</option>
            <option value="lg">Large (Billboard & Keynote Event Drops)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Operation Mode</label>
          <select
            className="modui-control-select"
            value={mode}
            onChange={(e) => setMode(e.target.value as FlipClockMode)}
          >
            <option value="countdown">Event Countdown (Days : Hours : Mins : Secs)</option>
            <option value="clock">Real-Time Clock (Local 24h Time)</option>
            <option value="stopwatch">Upward Stopwatch (Elapsed Time)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Options & Acoustics</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary, #365CF5)' }}
              />
              Mechanical Split-Flap Acoustics (Web Audio API)
            </label>

            {mode !== 'clock' && (
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={showDays}
                  onChange={(e) => setShowDays(e.target.checked)}
                  style={{ accentColor: 'var(--accent-primary, #365CF5)' }}
                />
                Show Days Unit
              </label>
            )}

            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary, #365CF5)' }}
              />
              Show Unit Labels
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
