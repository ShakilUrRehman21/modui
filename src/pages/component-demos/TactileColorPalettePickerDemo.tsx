import React, { useState, useRef } from 'react';
import {
  TactileColorPalettePicker,
  type PaletteHarmony,
  type PalettePickerVariant,
  type TactileColorPalettePickerHandle,
  type ColorSwatch,
} from '../../components/ui/color-palette-picker';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function TactileColorPalettePickerDemo({ theme }: DemoProps) {
  const isDark =
    theme
      ? theme === 'dark'
      : typeof document !== 'undefined' &&
        document.documentElement.getAttribute('data-theme') === 'dark';

  const [variant, setVariant] = useState<PalettePickerVariant>(() =>
    isDark ? 'studio-obsidian' : 'clean-porcelain'
  );
  const [harmony, setHarmony] = useState<PaletteHarmony>('triadic');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activePrimary, setActivePrimary] = useState<ColorSwatch | null>(null);

  const pickerRef = useRef<TactileColorPalettePickerHandle>(null);

  const handleSelectPresetHue = (presetHue: number) => {
    pickerRef.current?.setHue(presetHue);
  };

  return (
    <>
      <div className="modui-canvas-stage">
        <div
          style={{
            width: '100%',
            maxWidth: '680px',
            margin: '0 auto',
            padding: '2.5rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '360px',
          }}
        >
          <TactileColorPalettePicker
            ref={pickerRef}
            variant={variant}
            harmony={harmony}
            soundEnabled={soundEnabled}
            onChange={({ primary }) => setActivePrimary(primary)}
          />

          <div className="modui-stage-caption" style={{ marginTop: '1.75rem' }}>
            <div className="modui-stage-caption-hint">
              Drag polar wheel to sculpt hue & saturation &bull; Switch harmonic theories &bull; Copy production CSS custom properties
            </div>
          </div>
        </div>
      </div>

      <div className="modui-controls-panel">
        <div className="modui-control-group">
          <label className="modui-control-label">Material Variant</label>
          <select
            className="modui-control-select"
            value={variant}
            onChange={(e) => setVariant(e.target.value as PalettePickerVariant)}
          >
            <option value="studio-obsidian">Studio Obsidian (Dark Slate & Neon Azure)</option>
            <option value="clean-porcelain">Clean Porcelain (Architectural Editorial White)</option>
            <option value="cyber-matrix">Cyber Matrix (Terminal Emerald & Dark Glass)</option>
            <option value="warm-editorial">Warm Editorial (Amber Kraft & Paper Warmth)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Harmonic Model</label>
          <select
            className="modui-control-select"
            value={harmony}
            onChange={(e) => setHarmony(e.target.value as PaletteHarmony)}
          >
            <option value="triadic">Triadic (Balanced 120° Triad)</option>
            <option value="complementary">Complementary (Polar 180° High Contrast)</option>
            <option value="analogous">Analogous (Adjacent 30° Smooth Gradient)</option>
            <option value="split-complementary">Split-Complementary (150° / 210° Nuance)</option>
            <option value="tetradic">Tetradic (90° Quad Chromatic Cross)</option>
            <option value="monochromatic">Monochromatic (Single Hue Tints & Shades)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Chromatic Hue Presets</label>
          <div className="modui-control-buttons">
            {[
              { label: 'Azure (217°)', hue: 217 },
              { label: 'Emerald (155°)', hue: 155 },
              { label: 'Amber (38°)', hue: 38 },
              { label: 'Crimson (350°)', hue: 350 },
              { label: 'Violet (270°)', hue: 270 },
            ].map((preset) => (
              <button
                key={preset.hue}
                type="button"
                className={`modui-control-btn ${
                  activePrimary && Math.abs(activePrimary.hue - preset.hue) < 5
                    ? 'modui-control-btn--active'
                    : ''
                }`}
                onClick={() => handleSelectPresetHue(preset.hue)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Acoustics & Token Export</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              <span>Synthesized Detent Acoustics (Web Audio)</span>
            </label>

            <button
              type="button"
              className="modui-control-btn"
              onClick={() => pickerRef.current?.copyCssTokens()}
              style={{ alignSelf: 'flex-start', marginTop: '4px' }}
            >
              📋 Copy CSS Design Tokens
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
