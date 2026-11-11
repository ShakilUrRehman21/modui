import React, { useState, useEffect } from 'react';
import { BeforeAfterSlider } from '../../components/ui/slider';
import type { SliderOrientation, SliderInteraction, SliderVariant } from '../../components/ui/slider';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function BeforeAfterSliderDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [sliderOrientation, setSliderOrientation] = useState<SliderOrientation>('horizontal');
    const [sliderMode, setSliderMode] = useState<SliderInteraction>('drag');
    const [sliderVariant, setSliderVariant] = useState<SliderVariant>(() => isDark ? 'dark' : 'light');
    const [sliderPosition, setSliderPosition] = useState(50);
    const [sliderLabels, setSliderLabels] = useState(true);
    const [sliderSound, setSliderSound] = useState(true);

  useEffect(() => {
    setSliderVariant(isDark ? 'dark' : 'light');
  }, [theme]);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', padding: '1rem 0' }}>
                        <BeforeAfterSlider
                          orientation={sliderOrientation}
                          mode={sliderMode}
                          variant={sliderVariant}
                          position={sliderPosition}
                          onPositionChange={(pos) => setSliderPosition(pos)}
                          showLabels={sliderLabels}
                          soundEnabled={sliderSound}
                          aspectRatio="16 / 10"
                        />
                        <div className="modui-stage-caption">
                          Divider Position: <span className="modui-stage-caption-value">{sliderPosition}%</span>
                          <div className="modui-stage-caption-hint">
                            Drag the tactile handle, hover (if mode allows), or focus and use Arrow / Home / End keys.
                          </div>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Orientation</label>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {(['horizontal', 'vertical'] as const).map((orient) => (
                          <button
                            key={orient}
                            type="button"
                            className={`modui-pill-toggle ${sliderOrientation === orient ? 'modui-pill-toggle--active' : ''}`}
                            onClick={() => setSliderOrientation(orient)}
                          >
                            {orient.charAt(0).toUpperCase() + orient.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Interaction Mode</label>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {(['drag', 'hover', 'both'] as const).map((m) => (
                          <button
                            key={m}
                            type="button"
                            className={`modui-pill-toggle ${sliderMode === m ? 'modui-pill-toggle--active' : ''}`}
                            onClick={() => setSliderMode(m)}
                          >
                            {m.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Surface Skin</label>
                      <select
                        className="modui-control-select"
                        value={sliderVariant}
                        onChange={(e) => setSliderVariant(e.target.value as SliderVariant)}
                      >
                        <option value="light">Crisp Light Studio</option>
                        <option value="dark">Dark Obsidian</option>
                        <option value="glass">Frosted Glass</option>
                        <option value="minimal">Minimal Monoline</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Divider Position ({sliderPosition}%)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={sliderPosition}
                        onChange={(e) => setSliderPosition(parseInt(e.target.value, 10))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Toggles & Feedback</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={sliderLabels}
                            onChange={(e) => setSliderLabels(e.target.checked)}
                          />
                          <span>Corner Badges (Before / After)</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={sliderSound}
                            onChange={(e) => setSliderSound(e.target.checked)}
                          />
                          <span>Center Snap Acoustic Tick</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
