import React, { useState, useEffect } from 'react';
import { CyberStreamMatrix } from '../../components/ui/matrix';
import type { MatrixVariant, MatrixCharset } from '../../components/ui/matrix';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function CyberStreamMatrixDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [matrixVariant, setMatrixVariant] = useState<MatrixVariant>(() => isDark ? 'dark-obsidian' : 'studio-light');
    const [matrixCharset, setMatrixCharset] = useState<MatrixCharset>('hex');
    const [matrixSpeed, setMatrixSpeed] = useState<number>(0.5);
    const [matrixDensity, setMatrixDensity] = useState<number>(1);
    const [matrixGlow, setMatrixGlow] = useState<boolean>(true);
    const [matrixSound, setMatrixSound] = useState<boolean>(true);

  useEffect(() => {
    setMatrixVariant(isDark ? 'dark-obsidian' : 'studio-light');
  }, [theme]);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: '920px', margin: '0 auto', padding: '1rem 0' }}>
                        <CyberStreamMatrix
                          variant={matrixVariant}
                          charset={matrixCharset}
                          speed={matrixSpeed}
                          density={matrixDensity}
                          glow={matrixGlow}
                          soundEnabled={matrixSound}
                          style={{ width: '100%', height: '420px', borderRadius: '12px', boxShadow: '0 12px 36px rgba(0,0,0,0.08)' }}
                        >
                          <div className="modui-demo-glass-card" aria-hidden="true">
                            <div className="modui-demo-glass-card__title">Move to repel, click to burst</div>
                            <p className="modui-demo-glass-card__text">
                              Glyph rain that parts around your cursor and scatters on click, with optional synth chirps.
                            </p>
                          </div>
                        </CyberStreamMatrix>
                        <div className="modui-stage-caption">
                          Rendering: <span className="modui-stage-caption-value">60 fps canvas</span>
                          <div className="modui-stage-caption-hint">
                            Move your cursor across the canvas to disperse glyph columns, click anywhere to trigger a particle shockwave burst, or change themes below.
                          </div>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Surface Skin</label>
                      <select
                        className="modui-control-select"
                        value={matrixVariant}
                        onChange={(e) => setMatrixVariant(e.target.value as MatrixVariant)}
                      >
                        <option value="studio-light">Studio Light (Cobalt on Off-White)</option>
                        <option value="dark-obsidian">Dark Obsidian (Cyber Cyan)</option>
                        <option value="emerald">Emerald Matrix (Classic Neon)</option>
                        <option value="blueprint">Blueprint Technical (Deep Navy)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Character Glyph Set</label>
                      <div style={{ display: 'flex', gap: '0.35rem', width: '100%' }}>
                        {(['matrix', 'binary', 'hex', 'ascii'] as const).map((cs) => (
                          <button
                            key={cs}
                            type="button"
                            className={`modui-pill-toggle ${matrixCharset === cs ? 'modui-pill-toggle--active' : ''}`}
                            onClick={() => setMatrixCharset(cs)}
                            style={{ flex: 1, padding: '0.45rem 0.25rem', textAlign: 'center', fontSize: '0.75rem', minWidth: 0, textTransform: 'uppercase' }}
                          >
                            {cs}
                          </button>
                        ))}
                      </div>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Rain Velocity ({matrixSpeed}x)</label>
                      <input
                        type="range"
                        min="0.4"
                        max="2.5"
                        step="0.1"
                        value={matrixSpeed}
                        onChange={(e) => setMatrixSpeed(parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Stream Density ({matrixDensity}x)</label>
                      <input
                        type="range"
                        min="0.5"
                        max="1.8"
                        step="0.1"
                        value={matrixDensity}
                        onChange={(e) => setMatrixDensity(parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Optics & Audio</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={matrixGlow}
                            onChange={(e) => setMatrixGlow(e.target.checked)}
                          />
                          <span>Lead Glyph Bloom Glow</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={matrixSound}
                            onChange={(e) => setMatrixSound(e.target.checked)}
                          />
                          <span>Web Audio Particle Chirps</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
