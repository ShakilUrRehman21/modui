import React, { useState } from 'react';
import { PointCloudMorpher } from '../../components/ui/point-cloud';
import type { PointCloudTopology, PointCloudVariant } from '../../components/ui/point-cloud';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function PointCloudMorpherDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [pointCloudTopology, setPointCloudTopology] = useState<PointCloudTopology>('sphere');
    const [pointCloudVariant, setPointCloudVariant] = useState<PointCloudVariant>('cyber-violet');
    const [pointCloudParticles, setPointCloudParticles] = useState<number>(900);
    const [pointCloudConstellations, setPointCloudConstellations] = useState<boolean>(true);
    const [pointCloudAutoRotate, setPointCloudAutoRotate] = useState<boolean>(true);
    const [pointCloudVortex, setPointCloudVortex] = useState<boolean>(true);
    const [pointCloudSound, setPointCloudSound] = useState<boolean>(true);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: '880px', margin: '0 auto', padding: '1rem 0', display: 'flex', flexDirection: 'column' }}>
                        <PointCloudMorpher
                          theme={theme}
                          topology={pointCloudTopology}
                          variant={pointCloudVariant}
                          particleCount={pointCloudParticles}
                          showConstellations={pointCloudConstellations}
                          autoRotate={pointCloudAutoRotate}
                          interactiveVortex={pointCloudVortex}
                          soundEnabled={pointCloudSound}
                          onTopologyChange={(t) => setPointCloudTopology(t)}
                        />
                        <div style={{ marginTop: '1.25rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                          Active Topology: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{pointCloudTopology.toUpperCase()}</span> ({pointCloudParticles} vertices)
                          <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                            Drag horizontally/vertically to orbit in 3D. Hover to engage gravitational cursor vortex. Arrow keys rotate, Spacebar cycles shapes.
                          </div>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Chromatic Palette</label>
                      <select
                        className="modui-control-select"
                        value={pointCloudVariant}
                        onChange={(e) => setPointCloudVariant(e.target.value as PointCloudVariant)}
                      >
                        <option value="cyber-violet">Cyber Violet (Neon Indigo &amp; Magenta)</option>
                        <option value="matrix-emerald">Matrix Emerald (Phosphor Green &amp; Mint)</option>
                        <option value="solar-amber">Solar Amber (Warm Gold &amp; Flame Core)</option>
                        <option value="deep-ice">Deep Ice (Glacial Cyan &amp; Arctic Navy)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Target Topology</label>
                      <select
                        className="modui-control-select"
                        value={pointCloudTopology}
                        onChange={(e) => setPointCloudTopology(e.target.value as PointCloudTopology)}
                      >
                        <option value="sphere">Fibonacci Sphere (Geodesic)</option>
                        <option value="torus">Clifford Torus (3D Donut)</option>
                        <option value="helix">Double Helix (DNA Strand)</option>
                        <option value="wave">Quantum Wave (Harmonic Ripple)</option>
                        <option value="cube">Tesseract Lattice (3D Cube)</option>
                        <option value="galaxy">Galactic Spiral (Logarithmic)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Vertex Count ({pointCloudParticles})</label>
                      <input
                        type="range"
                        min="300"
                        max="1600"
                        step="100"
                        value={pointCloudParticles}
                        onChange={(e) => setPointCloudParticles(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Simulation Dynamics</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={pointCloudConstellations}
                            onChange={(e) => setPointCloudConstellations(e.target.checked)}
                          />
                          <span>Constellation Filaments</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={pointCloudAutoRotate}
                            onChange={(e) => setPointCloudAutoRotate(e.target.checked)}
                          />
                          <span>Continuous 3D Auto-Orbit</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={pointCloudVortex}
                            onChange={(e) => setPointCloudVortex(e.target.checked)}
                          />
                          <span>Cursor Gravitational Vortex</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={pointCloudSound}
                            onChange={(e) => setPointCloudSound(e.target.checked)}
                          />
                          <span>Web Audio Chime Haptics</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
