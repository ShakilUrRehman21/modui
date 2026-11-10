import React, { useState, useEffect } from 'react';
import { CausticRippleSurface } from '../../components/ui/caustic-surface';
import type { CausticSurfaceVariant } from '../../components/ui/caustic-surface';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function CausticRippleSurfaceDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [causticVariant, setCausticVariant] = useState<CausticSurfaceVariant>(() => isDark ? 'dark-obsidian' : 'porcelain');
    const [causticDamping, setCausticDamping] = useState<number>(0.98);
    const [causticRefraction, setCausticRefraction] = useState<number>(2.2);
    const [causticDropletRadius, setCausticDropletRadius] = useState<number>(4);
    const [causticRain, setCausticRain] = useState<boolean>(true);
    const [causticSound, setCausticSound] = useState<boolean>(true);

  useEffect(() => {
    setCausticVariant(isDark ? 'dark-obsidian' : 'porcelain');
  }, [theme]);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: '920px', margin: '0 auto', padding: '1rem 0' }}>
                        <CausticRippleSurface
                          variant={causticVariant}
                          damping={causticDamping}
                          refractionStrength={causticRefraction}
                          dropletRadius={causticDropletRadius}
                          rainEnabled={causticRain}
                          soundEnabled={causticSound}
                          style={{ width: '100%', height: '480px', borderRadius: '16px' }}
                        />
                        <div style={{ marginTop: '1.25rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                          Clean Fluid Surface: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>2D Wave Equation & Caustic Refractor</span>
                          <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                            Tip: Drag cursor to generate smooth wake ripples, click anywhere to drop an acoustic water droplet, or press Spacebar.
                          </div>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Liquid Surface Skin</label>
                      <select
                        className="modui-control-select"
                        value={causticVariant}
                        onChange={(e) => setCausticVariant(e.target.value as CausticSurfaceVariant)}
                      >
                        <option value="porcelain">Studio Porcelain (Daylight Clear)</option>
                        <option value="crystal-lake">Crystal Lake (Pure Aquamarine)</option>
                        <option value="dark-obsidian">Dark Obsidian (Deep Midnight)</option>
                        <option value="amber-spring">Amber Spring (Golden Sunlight)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Viscosity Damping ({causticDamping})</label>
                      <input
                        type="range"
                        min="0.94"
                        max="0.995"
                        step="0.005"
                        value={causticDamping}
                        onChange={(e) => setCausticDamping(parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Caustic Refraction ({causticRefraction}x)</label>
                      <input
                        type="range"
                        min="1.0"
                        max="4.0"
                        step="0.2"
                        value={causticRefraction}
                        onChange={(e) => setCausticRefraction(parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Droplet Scale ({causticDropletRadius}px)</label>
                      <input
                        type="range"
                        min="2"
                        max="8"
                        step="1"
                        value={causticDropletRadius}
                        onChange={(e) => setCausticDropletRadius(parseInt(e.target.value, 10))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Fluid Acoustics & Rain</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={causticRain}
                            onChange={(e) => setCausticRain(e.target.checked)}
                          />
                          <span>Ambient Idle Raindrops</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={causticSound}
                            onChange={(e) => setCausticSound(e.target.checked)}
                          />
                          <span>Web Audio Droplet Plinks</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
