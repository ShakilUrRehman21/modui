import React, { useState, useEffect } from 'react';
import { ChromaticPrismCard } from '../../components/ui/prism';
import type { PrismVariant } from '../../components/ui/prism';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function ChromaticPrismCardDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [prismVariant, setPrismVariant] = useState<PrismVariant>(() => isDark ? 'obsidian-prism' : 'sapphire-crystal');
    const [prismTilt, setPrismTilt] = useState<number>(14);
    const [prismInteractive, setPrismInteractive] = useState<boolean>(true);
    const [prismSound, setPrismSound] = useState<boolean>(true);
    const [prismTitle, setPrismTitle] = useState<string>('Optical Sapphire Specimen');
    const [prismActionClicked, setPrismActionClicked] = useState<number>(0);

  useEffect(() => {
    setPrismVariant(isDark ? 'obsidian-prism' : 'sapphire-crystal');
  }, [theme]);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: '520px', margin: '0 auto', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <ChromaticPrismCard
                          variant={prismVariant}
                          title={prismTitle}
                          maxTilt={prismTilt}
                          interactive={prismInteractive}
                          soundEnabled={prismSound}
                          onAction={() => setPrismActionClicked((c) => c + 1)}
                        />
                        <div style={{ marginTop: '1.75rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                          Optical Quartz Specimen: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>3D Gyro Tilt & Spectral Dispersion</span>
                          <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                            Tip: Move your cursor across the card surface to cast dynamic incident glare, observe RGB chromatic caustics, or click Inspect Specimen ({prismActionClicked} activations).
                          </div>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Mineral Crystal Finish</label>
                      <select
                        className="modui-control-select"
                        value={prismVariant}
                        onChange={(e) => setPrismVariant(e.target.value as PrismVariant)}
                      >
                        <option value="sapphire-crystal">Sapphire Crystal (Studio Daylight Silica)</option>
                        <option value="obsidian-prism">Obsidian Prism (Stealth Space Graphite)</option>
                        <option value="amber-quartz">Amber Quartz (Warm Champagne Mineral)</option>
                        <option value="emerald-matrix">Emerald Matrix (Luminescent Jade)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Perspective Max Tilt ({prismTilt}°)</label>
                      <input
                        type="range"
                        min="4"
                        max="26"
                        step="1"
                        value={prismTilt}
                        onChange={(e) => setPrismTilt(parseInt(e.target.value, 10))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Specimen Headline</label>
                      <input
                        type="text"
                        className="modui-control-input"
                        value={prismTitle}
                        onChange={(e) => setPrismTitle(e.target.value)}
                        placeholder="Enter title..."
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Optics & Haptics</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={prismInteractive}
                            onChange={(e) => setPrismInteractive(e.target.checked)}
                          />
                          <span>Pointer-Tracking Gyro Tilt</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={prismSound}
                            onChange={(e) => setPrismSound(e.target.checked)}
                          />
                          <span>Web Audio Crystal Glass Chime</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
