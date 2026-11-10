import React, { useState, useEffect } from 'react';
import { RotaryJogWheel } from '../../components/ui/rotary';
import type { RotaryWheelVariant, RotaryWheelMode, RotaryDisplayFormat } from '../../components/ui/rotary';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function RotaryJogWheelDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [rotaryValue, setRotaryValue] = useState(42);
    const [rotaryVariant, setRotaryVariant] = useState<RotaryWheelVariant>(() => isDark ? 'dark' : 'metallic');
    const [rotaryMode, setRotaryMode] = useState<RotaryWheelMode>('bounded');
    const [rotarySize, setRotarySize] = useState<'sm' | 'md' | 'lg'>('md');
    const [rotaryFormat, setRotaryFormat] = useState<RotaryDisplayFormat>('value');
    const [rotarySound, setRotarySound] = useState(true);
    const [rotaryInertia, setRotaryInertia] = useState(true);
    const [rotarySnapping, setRotarySnapping] = useState(false);

  useEffect(() => {
    setRotaryVariant(isDark ? 'dark' : 'metallic');
  }, [theme]);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '380px', padding: '1rem 0' }}>
                        <RotaryJogWheel
                          value={rotaryValue}
                          onChange={(val) => setRotaryValue(val)}
                          min={0}
                          max={100}
                          step={1}
                          variant={rotaryVariant}
                          mode={rotaryMode}
                          size={rotarySize}
                          displayFormat={rotaryFormat}
                          soundEnabled={rotarySound}
                          inertia={rotaryInertia}
                          snapping={rotarySnapping}
                          label="Master Output"
                          sublabel="LEVEL"
                        />
                        <div style={{ marginTop: '2rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                          Current Output: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{rotaryValue}</span>
                          <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                            Tip: Drag wheel circularly, flick with velocity to test momentum inertia, or use Arrow keys. Tap center to reset.
                          </div>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Surface Skin</label>
                      <select
                        className="modui-control-select"
                        value={rotaryVariant}
                        onChange={(e) => setRotaryVariant(e.target.value as RotaryWheelVariant)}
                      >
                        <option value="metallic">Machined Silver Aluminum</option>
                        <option value="dark">Stealth Dark Obsidian</option>
                        <option value="glass">Luminous Studio Glass</option>
                        <option value="minimal">Minimal Monoline</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Rotation Mode</label>
                      <select
                        className="modui-control-select"
                        value={rotaryMode}
                        onChange={(e) => setRotaryMode(e.target.value as RotaryWheelMode)}
                      >
                        <option value="bounded">Bounded (300° Arc Limit)</option>
                        <option value="continuous">Continuous (Infinite 360° Scrub)</option>
                        <option value="bipolar">Bipolar (Center-Zero Balance)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Wheel Size</label>
                      <div style={{ display: 'flex', gap: '0.35rem', width: '100%' }}>
                        {[
                          { id: 'sm', label: 'SM (148px)' },
                          { id: 'md', label: 'MD (196px)' },
                          { id: 'lg', label: 'LG (248px)' },
                        ].map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            className={`modui-pill-toggle ${rotarySize === s.id ? 'modui-pill-toggle--active' : ''}`}
                            onClick={() => setRotarySize(s.id as 'sm' | 'md' | 'lg')}
                            style={{ flex: 1, padding: '0.45rem 0.25rem', textAlign: 'center', fontSize: '0.75rem', minWidth: 0, whiteSpace: 'nowrap' }}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Center Readout Format</label>
                      <select
                        className="modui-control-select"
                        value={rotaryFormat}
                        onChange={(e) => setRotaryFormat(e.target.value as RotaryDisplayFormat)}
                      >
                        <option value="value">Numeric Value (0-100)</option>
                        <option value="percent">Percentage (%)</option>
                        <option value="degrees">Radial Degrees (°)</option>
                        <option value="timecode">Scrub Timecode (MM:SS:FF)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Value Position ({rotaryValue})</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={rotaryValue}
                        onChange={(e) => setRotaryValue(parseInt(e.target.value, 10))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Physics & Haptics</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={rotarySound}
                            onChange={(e) => setRotarySound(e.target.checked)}
                          />
                          <span>Web Audio Mechanical Ticks</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={rotaryInertia}
                            onChange={(e) => setRotaryInertia(e.target.checked)}
                          />
                          <span>Rotational Momentum Inertia</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={rotarySnapping}
                            onChange={(e) => setRotarySnapping(e.target.checked)}
                          />
                          <span>Detent Notch Snapping</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
