import React, { useState, useEffect } from 'react';
import { Polaroid } from '../../components/ui/polaroid';
import type { PolaroidVariant, PolaroidLayoutMode } from '../../components/ui/polaroid';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function PolaroidDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [polaroidVariant, setPolaroidVariant] = useState<PolaroidVariant>(() => isDark ? 'dark-room' : 'studio-classic');
    const [polaroidLayout, setPolaroidLayout] = useState<PolaroidLayoutMode>('scatter');
    const [polaroidDraggable, setPolaroidDraggable] = useState<boolean>(true);
    const [polaroidSound, setPolaroidSound] = useState<boolean>(true);
    const [polaroidActiveTitle, setPolaroidActiveTitle] = useState<string>('Zurich Haptics Lab');

  useEffect(() => {
    setPolaroidVariant(isDark ? 'dark-room' : 'studio-classic');
  }, [theme]);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto', padding: '1rem 0', display: 'flex', flexDirection: 'column' }}>
                        <Polaroid
                          variant={polaroidVariant}
                          layout={polaroidLayout}
                          draggable={polaroidDraggable}
                          soundEnabled={polaroidSound}
                          onPhotoClick={(p) => setPolaroidActiveTitle(p.title)}
                          onPhotoFlip={(p, isFlipped) => setPolaroidActiveTitle(`${p.title} (${isFlipped ? 'Back' : 'Front'})`)}
                        />
                        <div style={{ marginTop: '1.25rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                          Focused Specimen: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{polaroidActiveTitle}</span>
                          <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                            Click top-right circular arrow or press Space to 3D flip card. Drag cards across the tabletop in scatter mode. Click "Develop All" to trigger chemical film fog animation.
                          </div>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Aesthetic Finish</label>
                      <select
                        className="modui-control-select"
                        value={polaroidVariant}
                        onChange={(e) => setPolaroidVariant(e.target.value as PolaroidVariant)}
                      >
                        <option value="studio-classic">Studio Classic (Warm Daylight)</option>
                        <option value="dark-room">Dark Room (Safelight Red/Amber)</option>
                        <option value="vintage-sepia">Vintage Sepia (Archival Paper)</option>
                        <option value="minimal-mono">Minimal Mono (High Contrast)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Display Mode</label>
                      <select
                        className="modui-control-select"
                        value={polaroidLayout}
                        onChange={(e) => setPolaroidLayout(e.target.value as PolaroidLayoutMode)}
                      >
                        <option value="scatter">Tabletop Scatter (Draggable & Layered)</option>
                        <option value="grid">Editorial Portfolio Grid</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Physics & Acoustics</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={polaroidDraggable}
                            onChange={(e) => setPolaroidDraggable(e.target.checked)}
                          />
                          <span>Interactive Draggable Tabletop</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={polaroidSound}
                            onChange={(e) => setPolaroidSound(e.target.checked)}
                          />
                          <span>Web Audio Shutter & Paper Rustle</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
