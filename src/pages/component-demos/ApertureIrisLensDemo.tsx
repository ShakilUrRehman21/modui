import React, { useState, useEffect } from 'react';
import { ApertureIrisLens } from '../../components/ui/aperture';
import type { ApertureVariant } from '../../components/ui/aperture';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function ApertureIrisLensDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [apertureVariant, setApertureVariant] = useState<ApertureVariant>(() => isDark ? 'matte-obsidian' : 'studio-silver');
    const [apertureBlades, setApertureBlades] = useState<number>(9);
    const [apertureValue, setApertureValue] = useState<number>(0.55);
    const [apertureSound, setApertureSound] = useState<boolean>(true);
    const [apertureRing, setApertureRing] = useState<boolean>(true);
    const [apertureFocal, setApertureFocal] = useState<string>('50mm');

  useEffect(() => {
    setApertureVariant(isDark ? 'matte-obsidian' : 'studio-silver');
  }, [theme]);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: '780px', margin: '0 auto', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <ApertureIrisLens
                          variant={apertureVariant}
                          bladesCount={apertureBlades}
                          value={apertureValue}
                          onChange={(val) => setApertureValue(val)}
                          soundEnabled={apertureSound}
                          showRing={apertureRing}
                          focalLength={apertureFocal}
                        />
                        <div className="modui-stage-caption">
                          Mechanical Iris Barrel: <span className="modui-stage-caption-value">Trigonometric Blade Overlap</span>
                          <div className="modui-stage-caption-hint">
                            Drag along the outer knurled ring to scrub aperture opening with rotary angle tracking, click f-stop step presets, or use Arrow keys.
                          </div>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Barrel & Blade Finish</label>
                      <select
                        className="modui-control-select"
                        value={apertureVariant}
                        onChange={(e) => setApertureVariant(e.target.value as ApertureVariant)}
                      >
                        <option value="studio-silver">Studio Silver (Machined Anodized)</option>
                        <option value="matte-obsidian">Matte Obsidian (Stealth Graphite)</option>
                        <option value="classic-brass">Classic Brass (Vintage Leica)</option>
                        <option value="cyber-neon">Cyber Neon (Sci-Fi Holographic)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Aperture Ratio ({(apertureValue * 100).toFixed(0)}%)</label>
                      <input
                        type="range"
                        min="0.05"
                        max="1.0"
                        step="0.01"
                        value={apertureValue}
                        onChange={(e) => setApertureValue(parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Iris Blades ({apertureBlades})</label>
                      <input
                        type="range"
                        min="6"
                        max="14"
                        step="1"
                        value={apertureBlades}
                        onChange={(e) => setApertureBlades(parseInt(e.target.value, 10))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Focal Engraving</label>
                      <select
                        className="modui-control-select"
                        value={apertureFocal}
                        onChange={(e) => setApertureFocal(e.target.value)}
                      >
                        <option value="35mm">35mm f/1.4 Summilux</option>
                        <option value="50mm">50mm f/1.4 Noctilux</option>
                        <option value="85mm">85mm f/1.4 Portrait Master</option>
                        <option value="135mm">135mm f/1.8 Telephoto</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Mechanics & Audio</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={apertureSound}
                            onChange={(e) => setApertureSound(e.target.checked)}
                          />
                          <span>Web Audio Leaf Ratchet Clicks</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={apertureRing}
                            onChange={(e) => setApertureRing(e.target.checked)}
                          />
                          <span>Machined Barrel Ring & Degree Ticks</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
