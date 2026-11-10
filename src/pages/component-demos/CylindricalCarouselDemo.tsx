import React, { useState } from 'react';
import { CylindricalCarousel } from '../../components/ui/carousel';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function CylindricalCarouselDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [carouselRadius, setCarouselRadius] = useState(280);
    const [carouselTilt, setCarouselTilt] = useState(-4);
    const [carouselAutoplay, setCarouselAutoplay] = useState(false);
    const [carouselCount, setCarouselCount] = useState(6);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: '860px', height: '420px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
                        <CylindricalCarousel
                          items={[
                            { id: '1', title: 'Spatial Studio', subtitle: 'Hardware module', tag: 'Core', badge: 'v2.1', color: '#4F46E5' },
                            { id: '2', title: 'Neural Canvas', subtitle: 'Generative shader', tag: 'WebGL', badge: 'New', color: '#06B6D4' },
                            { id: '3', title: 'Haptic Rotary', subtitle: 'Dial encoder', tag: 'Analog', color: '#10B981' },
                            { id: '4', title: 'Vector Oscilloscope', subtitle: 'Waveform telemetry', tag: 'Audio', color: '#F59E0B' },
                            { id: '5', title: 'Kinetic Matrix', subtitle: 'Spring geometry', tag: 'Physics', color: '#8B5CF6' },
                            { id: '6', title: 'Quantum Telemetry', subtitle: 'Atomic clock sync', tag: 'Radio', badge: 'Pro', color: '#EC4899' },
                            { id: '7', title: 'Optical Grid', subtitle: 'Subpixel raster', tag: 'Display', color: '#3B82F6' },
                            { id: '8', title: 'Resonance Filter', subtitle: 'Analog cutoff', tag: 'DSP', color: '#14B8A6' },
                          ].slice(0, carouselCount)}
                          radius={carouselRadius}
                          tiltAngle={carouselTilt}
                          autoplay={carouselAutoplay}
                          autoplaySpeed={8}
                          style={{ minHeight: '420px', height: '420px' }}
                        />
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Items Count ({carouselCount})</label>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {[4, 6, 8].map((cnt) => (
                          <button
                            key={cnt}
                            type="button"
                            className={`modui-pill-toggle ${carouselCount === cnt ? 'modui-pill-toggle--active' : ''}`}
                            onClick={() => setCarouselCount(cnt)}
                          >
                            {cnt} Cards
                          </button>
                        ))}
                      </div>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">3D Radius ({carouselRadius}px)</label>
                      <input
                        type="range"
                        min="200"
                        max="360"
                        step="10"
                        value={carouselRadius}
                        onChange={(e) => setCarouselRadius(parseInt(e.target.value, 10))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Tilt Pitch ({carouselTilt}°)</label>
                      <input
                        type="range"
                        min="-15"
                        max="15"
                        step="1"
                        value={carouselTilt}
                        onChange={(e) => setCarouselTilt(parseInt(e.target.value, 10))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Physics & Motion</label>
                      <label className="modui-control-toggle">
                        <input
                          type="checkbox"
                          checked={carouselAutoplay}
                          onChange={(e) => setCarouselAutoplay(e.target.checked)}
                        />
                        <span>Continuous Orbit</span>
                      </label>
                    </div>
                  </div>
    </>
  );
}
