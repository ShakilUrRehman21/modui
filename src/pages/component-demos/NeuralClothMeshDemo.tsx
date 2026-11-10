import React, { useState, useEffect } from 'react';
import { NeuralClothMesh } from '../../components/ui/cloth';
import type { ClothVariant, ClothRenderMode, ClothPinMode } from '../../components/ui/cloth';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function NeuralClothMeshDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [clothVariant, setClothVariant] = useState<ClothVariant>(() => isDark ? 'dark-obsidian' : 'studio-silk');
    const [clothRenderMode, setClothRenderMode] = useState<ClothRenderMode>('wireframe');
    const [clothPinMode, setClothPinMode] = useState<ClothPinMode>('curtain');
    const [clothGravity, setClothGravity] = useState<number>(0.10);
    const [clothWind, setClothWind] = useState<number>(0);
    const [clothStiffness] = useState<number>(2);
    const [clothSound, setClothSound] = useState<boolean>(true);

  useEffect(() => {
    setClothVariant(isDark ? 'dark-obsidian' : 'studio-silk');
  }, [theme]);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: '920px', margin: '0 auto', padding: '1rem 0' }}>
                        <NeuralClothMesh
                          variant={clothVariant}
                          renderMode={clothRenderMode}
                          pinMode={clothPinMode}
                          gravity={clothGravity}
                          windStrength={clothWind}
                          stiffness={clothStiffness}
                          soundEnabled={clothSound}
                          style={{ width: '100%', height: '480px', borderRadius: '16px' }}
                        />
                        <div style={{ marginTop: '1.25rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                          Verlet Continuum: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Structural Spring Lattice</span>
                          <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                            Tip: Drag through the fabric to billow the silk with aerodynamic wind wake, click or press Spacebar to inject a resonant wave impulse.
                          </div>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Surface Material</label>
                      <select
                        className="modui-control-select"
                        value={clothVariant}
                        onChange={(e) => setClothVariant(e.target.value as ClothVariant)}
                      >
                        <option value="studio-silk">Studio Silk (Porcelain / Cobalt)</option>
                        <option value="liquid-gold">Liquid Gold (Champagne / Bronze)</option>
                        <option value="dark-obsidian">Dark Obsidian (Titanium / Cyan)</option>
                        <option value="emerald-aurora">Emerald Aurora (Mint / Forest)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Rendering Technique</label>
                      <div style={{ display: 'flex', gap: '0.35rem', width: '100%' }}>
                        {(['shaded', 'wireframe', 'hybrid'] as const).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            className={`modui-pill-toggle ${clothRenderMode === mode ? 'modui-pill-toggle--active' : ''}`}
                            onClick={() => setClothRenderMode(mode)}
                            style={{ flex: 1, padding: '0.45rem 0.25rem', textAlign: 'center', fontSize: '0.75rem', minWidth: 0, textTransform: 'capitalize' }}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Anchor Tether Mode</label>
                      <select
                        className="modui-control-select"
                        value={clothPinMode}
                        onChange={(e) => setClothPinMode(e.target.value as ClothPinMode)}
                      >
                        <option value="top-edge">Top Edge Suspended (Banner)</option>
                        <option value="corners">Corner Pins (Hammock / Flag)</option>
                        <option value="curtain">Periodic Draped (Curtain Pleats)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Breeze Wind ({clothWind.toFixed(2)}x)</label>
                      <input
                        type="range"
                        min="0.0"
                        max="1.2"
                        step="0.05"
                        value={clothWind}
                        onChange={(e) => setClothWind(parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Gravity Vector ({clothGravity.toFixed(2)})</label>
                      <input
                        type="range"
                        min="0.1"
                        max="0.8"
                        step="0.05"
                        value={clothGravity}
                        onChange={(e) => setClothGravity(parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Acoustics & Sound</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={clothSound}
                            onChange={(e) => setClothSound(e.target.checked)}
                          />
                          <span>Web Audio Breeze Resonance</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
