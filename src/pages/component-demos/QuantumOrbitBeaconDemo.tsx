import React, { useState } from 'react';
import { QuantumOrbitBeacon } from '../../components/ui/quantum-orbit-beacon';
import type { QuantumOrbitState, QuantumOrbitSize } from '../../components/ui/quantum-orbit-beacon';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function QuantumOrbitBeaconDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [beaconState, setBeaconState] = useState<QuantumOrbitState>('optimal');
    const [beaconSize, setBeaconSize] = useState<QuantumOrbitSize>('lg');
    const [beaconSpeed, setBeaconSpeed] = useState<number>(1.0);
    const [beaconInteractive, setBeaconInteractive] = useState<boolean>(true);
    const [beaconSound, setBeaconSound] = useState<boolean>(true);
    const [beaconShowTelemetry, setBeaconShowTelemetry] = useState<boolean>(true);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <QuantumOrbitBeacon
                          theme={theme}
                          state={beaconState}
                          size={beaconSize}
                          speed={beaconSpeed}
                          interactive={beaconInteractive}
                          soundEnabled={beaconSound}
                          showTelemetry={beaconShowTelemetry}
                          onStateChange={setBeaconState}
                        />
                        <div style={{ marginTop: '1.25rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                          Quantum State: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{beaconState.toUpperCase()}</span> ({beaconSpeed}x speed)
                          <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                            Move cursor over beacon to tilt 3D perspective plane. Click state buttons or use controls below.
                          </div>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Telemetry Status State</label>
                      <div className="modui-control-buttons">
                        <button
                          className={`modui-control-btn ${beaconState === 'optimal' ? 'modui-control-btn--active' : ''}`}
                          onClick={() => setBeaconState('optimal')}
                        >
                          Optimal (Emerald)
                        </button>
                        <button
                          className={`modui-control-btn ${beaconState === 'active' ? 'modui-control-btn--active' : ''}`}
                          onClick={() => setBeaconState('active')}
                        >
                          Active (Violet)
                        </button>
                        <button
                          className={`modui-control-btn ${beaconState === 'degraded' ? 'modui-control-btn--active' : ''}`}
                          onClick={() => setBeaconState('degraded')}
                        >
                          Degraded (Amber)
                        </button>
                        <button
                          className={`modui-control-btn ${beaconState === 'offline' ? 'modui-control-btn--active' : ''}`}
                          onClick={() => setBeaconState('offline')}
                        >
                          Dormant (Red)
                        </button>
                      </div>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Dimension Size Preset</label>
                      <div className="modui-control-buttons">
                        <button
                          className={`modui-control-btn ${beaconSize === 'sm' ? 'modui-control-btn--active' : ''}`}
                          onClick={() => setBeaconSize('sm')}
                        >
                          Small (32px)
                        </button>
                        <button
                          className={`modui-control-btn ${beaconSize === 'md' ? 'modui-control-btn--active' : ''}`}
                          onClick={() => setBeaconSize('md')}
                        >
                          Medium (72px)
                        </button>
                        <button
                          className={`modui-control-btn ${beaconSize === 'lg' ? 'modui-control-btn--active' : ''}`}
                          onClick={() => setBeaconSize('lg')}
                        >
                          Large (220px HUD)
                        </button>
                      </div>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Orbit Velocity: {beaconSpeed.toFixed(1)}x</label>
                      <input
                        type="range"
                        min="0.4"
                        max="3.0"
                        step="0.1"
                        value={beaconSpeed}
                        onChange={(e) => setBeaconSpeed(parseFloat(e.target.value))}
                        className="modui-control-slider"
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Interactive Options</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={beaconInteractive}
                            onChange={(e) => setBeaconInteractive(e.target.checked)}
                          />
                          <span>3D Perspective Tilt</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={beaconShowTelemetry}
                            onChange={(e) => setBeaconShowTelemetry(e.target.checked)}
                          />
                          <span>Show Telemetry Labels</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={beaconSound}
                            onChange={(e) => setBeaconSound(e.target.checked)}
                          />
                          <span>Web Audio Quantum Chimes</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
