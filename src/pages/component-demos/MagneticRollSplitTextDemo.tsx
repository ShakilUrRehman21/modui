import React, { useState, useRef } from 'react';
import { MagneticRollSplitText } from '../../components/ui/magnetic-roll-split';
import type {
  SplitRollVariant,
  SplitRollChoreography,
} from '../../components/ui/magnetic-roll-split';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

const DEMO_PHRASES = [
  'RESONANCE',
  'PRECISION KINETICS',
  'PHYSICS DRIVEN',
  'MODULAR CRAFT',
];

export default function MagneticRollSplitTextDemo({ theme }: DemoProps) {
  const isDark =
    theme
      ? theme === 'dark'
      : typeof document !== 'undefined' &&
        document.documentElement.getAttribute('data-theme') === 'dark';

  const [variant, setVariant] = useState<SplitRollVariant>(() =>
    isDark ? 'editorial-dark' : 'studio-light'
  );
  const [choreography, setChoreography] = useState<SplitRollChoreography>('wave');
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [stagger, setStagger] = useState<number>(35);
  const [speed, setSpeed] = useState<number>(480);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const rollRef = useRef<(() => void) | null>(null);

  const handleManualRoll = () => {
    rollRef.current?.();
  };

  return (
    <>
      <div className="modui-canvas-stage">
        <div
          style={{
            width: '100%',
            maxWidth: '860px',
            margin: '0 auto',
            padding: '2.5rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '260px',
          }}
        >
          <MagneticRollSplitText
            text={DEMO_PHRASES}
            variant={variant}
            theme={theme}
            choreography={choreography}
            direction={direction}
            stagger={stagger}
            speed={speed}
            soundEnabled={soundEnabled}
            trigger="hover"
            onRollRef={(fn) => {
              rollRef.current = fn;
            }}
          />

          <div className="modui-stage-caption" style={{ marginTop: '2rem' }}>
            <div className="modui-stage-caption-hint">
              Hover over or click characters to tumble drums. Automatically cycles through phrases.
            </div>
          </div>
        </div>
      </div>

      <div className="modui-controls-panel">
        <div className="modui-control-group">
          <label className="modui-control-label">Finish Variant</label>
          <select
            className="modui-control-select"
            value={variant}
            onChange={(e) => setVariant(e.target.value as SplitRollVariant)}
          >
            <option value="studio-light">Studio Light (Porcelain & Cobalt)</option>
            <option value="editorial-dark">Editorial Dark (Obsidian Titanium)</option>
            <option value="solenoid-amber">Solenoid Amber (Departure Board)</option>
            <option value="cyber-cobalt">Cyber Cobalt (Electric Phosphor)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Choreography</label>
          <select
            className="modui-control-select"
            value={choreography}
            onChange={(e) => setChoreography(e.target.value as SplitRollChoreography)}
          >
            <option value="wave">Wave Stagger (Left to Right)</option>
            <option value="center-out">Center Outward</option>
            <option value="cascade">Accelerated Cascade</option>
            <option value="random">Organic Randomization</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Roll Direction</label>
          <select
            className="modui-control-select"
            value={direction}
            onChange={(e) => setDirection(e.target.value as 'up' | 'down')}
          >
            <option value="up">Upward Tumble</option>
            <option value="down">Downward Tumble</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Stagger Delay ({stagger}ms)</label>
          <input
            type="range"
            min="10"
            max="80"
            step="5"
            value={stagger}
            onChange={(e) => setStagger(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
          />
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Acoustics & Actions</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <label className="modui-control-toggle" style={{ paddingTop: 0 }}>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              <span>Solenoid Clicks</span>
            </label>

            <button
              type="button"
              className="modui-pill-toggle modui-pill-toggle--active"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              onClick={handleManualRoll}
            >
              ⚡ Re-Trigger Roll
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
