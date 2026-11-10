import React, { useState } from 'react';
import { PerspectiveTextRibbon } from '../../components/ui/perspective-text';
import type { RibbonOrientation, RibbonVariant } from '../../components/ui/perspective-text';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function PerspectiveTextRibbonDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [ribbonOrientation, setRibbonOrientation] = useState<RibbonOrientation>('dynamic');
    const [ribbonVariant, setRibbonVariant] = useState<RibbonVariant>('cyber-indigo');
    const [ribbonSpeed, setRibbonSpeed] = useState<number>(1.2);
    const [ribbonDirection, setRibbonDirection] = useState<'forward' | 'reverse'>('forward');
    const [ribbonPauseOnHover, setRibbonPauseOnHover] = useState<boolean>(false);
    const [ribbonSound, setRibbonSound] = useState<boolean>(true);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: '880px', margin: '0 auto', padding: '1rem 0', display: 'flex', flexDirection: 'column' }}>
                        <PerspectiveTextRibbon
                          theme={theme}
                          orientation={ribbonOrientation}
                          variant={ribbonVariant}
                          speed={ribbonSpeed}
                          direction={ribbonDirection}
                          pauseOnHover={ribbonPauseOnHover}
                          interactiveScrub={true}
                          soundEnabled={ribbonSound}
                        />
                        <div style={{ marginTop: '1.25rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                          3D Orientation: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{ribbonOrientation.toUpperCase()}</span> ({ribbonSpeed}x speed)
                          <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                            Drag horizontally across the ribbon to scrub with momentum fling. Use Left/Right Arrow keys to step, Space to pause.
                          </div>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Perspective Spatial Preset</label>
                      <select
                        className="modui-control-select"
                        value={ribbonOrientation}
                        onChange={(e) => setRibbonOrientation(e.target.value as RibbonOrientation)}
                      >
                        <option value="dynamic">Dynamic 3D (Isometric Tilt)</option>
                        <option value="horizontal">Horizontal (Flat Panoramic)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Chromatic Palette</label>
                      <select
                        className="modui-control-select"
                        value={ribbonVariant}
                        onChange={(e) => setRibbonVariant(e.target.value as RibbonVariant)}
                      >
                        <option value="cyber-indigo">Cyber Indigo (Electric Blue &amp; Violet)</option>
                        <option value="matrix-emerald">Matrix Emerald (Phosphor Green &amp; Mint)</option>
                        <option value="solar-flame">Solar Flame (Warm Amber &amp; Gold)</option>
                        <option value="monochrome">Monochrome (High-Contrast Obsidian &amp; Ink)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Drift Speed ({ribbonSpeed.toFixed(1)}x)</label>
                      <input
                        type="range"
                        min="0.4"
                        max="3.0"
                        step="0.2"
                        value={ribbonSpeed}
                        onChange={(e) => setRibbonSpeed(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Marquee Controls</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={ribbonDirection === 'reverse'}
                            onChange={(e) => setRibbonDirection(e.target.checked ? 'reverse' : 'forward')}
                          />
                          <span>Reverse Drift Direction</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={ribbonPauseOnHover}
                            onChange={(e) => setRibbonPauseOnHover(e.target.checked)}
                          />
                          <span>Pause Drift on Hover</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={ribbonSound}
                            onChange={(e) => setRibbonSound(e.target.checked)}
                          />
                          <span>Web Audio Tick Haptics</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
