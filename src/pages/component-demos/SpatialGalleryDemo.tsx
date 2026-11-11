import React, { useState, useEffect } from 'react';
import { SpatialGallery } from '../../components/ui/spatial-gallery';
import type { SpatialGalleryVariant } from '../../components/ui/spatial-gallery';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function SpatialGalleryDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [spatialVariant, setSpatialVariant] = useState<SpatialGalleryVariant>(() => isDark ? 'studio-dark' : 'studio-light');
    const [spatialReflection, setSpatialReflection] = useState<boolean>(true);
    const [spatialControls, setSpatialControls] = useState<boolean>(true);
    const [spatialHUD, setSpatialHUD] = useState<boolean>(true);
    const [spatialSound, setSpatialSound] = useState<boolean>(true);
    const [spatialAutoPlay, setSpatialAutoPlay] = useState<boolean>(false);
    const [spatialActiveTitle, setSpatialActiveTitle] = useState<string>('Aura Chromatica');

  useEffect(() => {
    setSpatialVariant(isDark ? 'studio-dark' : 'studio-light');
  }, [theme]);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto', padding: '1rem 0', display: 'flex', flexDirection: 'column' }}>
                        <SpatialGallery
                          variant={spatialVariant}
                          showReflection={spatialReflection}
                          showControls={spatialControls}
                          showHUD={spatialHUD}
                          soundEnabled={spatialSound}
                          autoPlay={spatialAutoPlay}
                          onSelect={(item) => setSpatialActiveTitle(item.title)}
                          onItemClick={(item) => setSpatialActiveTitle(`${item.title} (Inspected)`)}
                        />
                        <div className="modui-stage-caption">
                          Active Spatial Node: <span className="modui-stage-caption-value">{spatialActiveTitle}</span>
                          <div className="modui-stage-caption-hint">
                            Drag horizontally or wheel scrub to orbit the 3D cylindrical ribbon. Click the active card or press Enter to inspect in high-resolution lightbox modal.
                          </div>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Aesthetic Finish</label>
                      <select
                        className="modui-control-select"
                        value={spatialVariant}
                        onChange={(e) => setSpatialVariant(e.target.value as SpatialGalleryVariant)}
                      >
                        <option value="studio-dark">Studio Dark (Titanium Alloy)</option>
                        <option value="studio-light">Studio Light (Gallery Porcelain)</option>
                        <option value="minimal-mono">Minimal Mono (Brutalist Contrast)</option>
                        <option value="cyber-cyan">Cyber Cyan (Neon Telemetry)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">3D Environment Options</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={spatialReflection}
                            onChange={(e) => setSpatialReflection(e.target.checked)}
                          />
                          <span>Ground Mirror Floor Reflection</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={spatialHUD}
                            onChange={(e) => setSpatialHUD(e.target.checked)}
                          />
                          <span>Top Telemetry HUD Overlay</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={spatialControls}
                            onChange={(e) => setSpatialControls(e.target.checked)}
                          />
                          <span>Navigation Arrows & Slide Dots</span>
                        </label>
                      </div>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Interactivity & Playback</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={spatialSound}
                            onChange={(e) => setSpatialSound(e.target.checked)}
                          />
                          <span>Web Audio Acoustic Spatial Clicks</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={spatialAutoPlay}
                            onChange={(e) => setSpatialAutoPlay(e.target.checked)}
                          />
                          <span>Auto-Play Continuous Orbit</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
