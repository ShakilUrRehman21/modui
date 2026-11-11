import React, { useState, useEffect } from 'react';
import { InfiniteCanvasGallery } from '../../components/ui/infinite-canvas-gallery';
import type { CanvasGalleryVariant } from '../../components/ui/infinite-canvas-gallery';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function InfiniteCanvasGalleryDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [canvasVariant, setCanvasVariant] = useState<CanvasGalleryVariant>(() => isDark ? 'dark-slate' : 'studio-light');
    const [canvasMinimap, setCanvasMinimap] = useState<boolean>(true);
    const [canvasToolbar, setCanvasToolbar] = useState<boolean>(true);
    const [canvasSound, setCanvasSound] = useState<boolean>(true);
    const [canvasFriction, setCanvasFriction] = useState<number>(0.94);
    const [canvasActiveTitle, setCanvasActiveTitle] = useState<string>('Kroma Optical Caustics');

  useEffect(() => {
    setCanvasVariant(isDark ? 'dark-slate' : 'studio-light');
  }, [theme]);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto', padding: '1rem 0', display: 'flex', flexDirection: 'column' }}>
                        <InfiniteCanvasGallery
                          variant={canvasVariant}
                          showMinimap={canvasMinimap}
                          showToolbar={canvasToolbar}
                          soundEnabled={canvasSound}
                          friction={canvasFriction}
                          onItemHover={(item) => item && setCanvasActiveTitle(item.title)}
                          onItemClick={(item) => setCanvasActiveTitle(`${item.title} (Selected)`)}
                        />
                        <div className="modui-stage-caption">
                          Active Canvas Node: <span className="modui-stage-caption-value">{canvasActiveTitle}</span>
                          <div className="modui-stage-caption-hint">
                            Click and drag in any direction to fling the canvas with momentum. Cards wrap infinitely in 360 degrees using toroidal coordinates.
                          </div>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Aesthetic Finish</label>
                      <select
                        className="modui-control-select"
                        value={canvasVariant}
                        onChange={(e) => setCanvasVariant(e.target.value as CanvasGalleryVariant)}
                      >
                        <option value="studio-light">Studio Light (ModUI Standard)</option>
                        <option value="dark-slate">Dark Slate (Cyber Charcoal)</option>
                        <option value="editorial-paper">Editorial Paper (Linen & Stone)</option>
                        <option value="minimal-mono">Minimal Mono (High Contrast)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Momentum Friction: {canvasFriction.toFixed(2)}</label>
                      <input
                        type="range"
                        className="modui-control-range"
                        min="0.85"
                        max="0.98"
                        step="0.01"
                        value={canvasFriction}
                        onChange={(e) => setCanvasFriction(parseFloat(e.target.value))}
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Overlays & Micro-Haptics</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={canvasMinimap}
                            onChange={(e) => setCanvasMinimap(e.target.checked)}
                          />
                          <span>Radar Minimap HUD</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={canvasToolbar}
                            onChange={(e) => setCanvasToolbar(e.target.checked)}
                          />
                          <span>Origin & Controls Toolbar</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={canvasSound}
                            onChange={(e) => setCanvasSound(e.target.checked)}
                          />
                          <span>Web Audio Micro-Haptic Ticks</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
