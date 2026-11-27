import React, { useState, useRef } from 'react';
import {
  PrismaticBorderBeamButton,
  type BorderBeamVariant,
  type BorderBeamSize,
  type PrismaticBorderBeamButtonHandle,
} from '../../components/ui/prismatic-border-beam-button';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function PrismaticBorderBeamButtonDemo({ theme }: DemoProps) {
  const isDark =
    theme
      ? theme === 'dark'
      : typeof document !== 'undefined' &&
        document.documentElement.getAttribute('data-theme') === 'dark';

  const [variant, setVariant] = useState<BorderBeamVariant>(() =>
    isDark ? 'obsidian-prism' : 'porcelain-aurora'
  );
  const [size, setSize] = useState<BorderBeamSize>('lg');
  const [beamDuration, setBeamDuration] = useState<number>(3.2);
  const [magnetic, setMagnetic] = useState<boolean>(true);
  const [spotlight, setSpotlight] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [clickCount, setClickCount] = useState<number>(0);

  const btnRef = useRef<PrismaticBorderBeamButtonHandle>(null);

  const handleSimulatedDeploy = () => {
    setClickCount((c) => c + 1);
    setLoading(true);
    setTimeout(() => setLoading(false), 1400);
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
            minHeight: '300px',
          }}
        >
          <PrismaticBorderBeamButton
            ref={btnRef}
            variant={variant}
            size={size}
            beamDuration={beamDuration}
            magnetic={magnetic}
            spotlight={spotlight}
            loading={loading}
            loadingText="Deploying Edge..."
            soundEnabled={soundEnabled}
            onClick={handleSimulatedDeploy}
          >
            Launch Workspace
          </PrismaticBorderBeamButton>

          <div className="modui-stage-caption" style={{ marginTop: '2.25rem' }}>
            <div className="modui-stage-caption-hint">
              Hover for 3D magnetic tilt &amp; specular sheen &bull; Click to trigger pulse &amp; async loading ({clickCount} clicks)
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
            onChange={(e) => setVariant(e.target.value as BorderBeamVariant)}
          >
            <option value="obsidian-prism">Obsidian Prism (Dark)</option>
            <option value="porcelain-aurora">Porcelain Aurora (Light)</option>
            <option value="cyber-flare">Cyber Flare (Cyan)</option>
            <option value="solar-gold">Solar Gold (Amber)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Button Scale</label>
          <select
            className="modui-control-select"
            value={size}
            onChange={(e) => setSize(e.target.value as BorderBeamSize)}
          >
            <option value="sm">Small (Compact CTA)</option>
            <option value="md">Medium (Default)</option>
            <option value="lg">Large (Hero Flagship)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Orbit Speed ({beamDuration}s)</label>
          <div className="modui-control-buttons">
            {[1.4, 3.2, 5.5].map((spd) => (
              <button
                key={spd}
                type="button"
                className={`modui-control-btn ${beamDuration === spd ? 'modui-control-btn--active' : ''}`}
                onClick={() => {
                  setBeamDuration(spd);
                  btnRef.current?.setBeamSpeed(spd);
                }}
              >
                {spd === 1.4 ? 'Hyper (1.4s)' : spd === 3.2 ? 'Balanced (3.2s)' : 'Calm (5.5s)'}
              </button>
            ))}
            <button
              type="button"
              className="modui-control-btn"
              onClick={() => btnRef.current?.triggerPulse()}
            >
              Pulse Ring
            </button>
          </div>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Physics &amp; Acoustics</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={magnetic}
                onChange={(e) => setMagnetic(e.target.checked)}
              />
              <span>3D Magnetic Pointer Tilt</span>
            </label>
            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={spotlight}
                onChange={(e) => setSpotlight(e.target.checked)}
              />
              <span>Cursor Specular Spotlight</span>
            </label>
            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              <span>Web Audio Crystal Chimes</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
