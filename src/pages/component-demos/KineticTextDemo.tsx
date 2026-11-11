import React, { useState } from 'react';
import { KineticText } from '../../components/ui/motion/KineticText';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

type KineticStyle = 'solid' | 'outline' | 'gradient';

const PRESETS = ['Type that moves', 'Hover to wake it', 'Letters with weight'];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function KineticTextDemo(_props: DemoProps) {
  const [text, setText] = useState(PRESETS[0]);
  const [style, setStyle] = useState<KineticStyle>('solid');
  const [wave, setWave] = useState(true);
  const [replayKey, setReplayKey] = useState(0);

  return (
    <>
      <div className="modui-canvas-stage">
        <div className="modui-kinetic-poster">
          <span className="modui-kinetic-poster__kicker">Hover the headline</span>
          <KineticText
            key={`${text}-${replayKey}`}
            as="h2"
            text={text}
            interactiveWave={wave}
            className={`kinetic-style-${style} modui-kinetic-poster__title`}
          />
          <div className="modui-kinetic-poster__presets">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                className={`modui-pill-toggle ${text === p ? 'modui-pill-toggle--active' : ''}`}
                onClick={() => setText(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="modui-controls-panel">
        <div className="modui-control-group">
          <label className="modui-control-label">Headline</label>
          <input
            className="modui-control-input"
            value={text}
            maxLength={32}
            onChange={(e) => setText(e.target.value || ' ')}
          />
        </div>
        <div className="modui-control-group">
          <label className="modui-control-label">Treatment</label>
          <div className="modui-control-buttons">
            {(['solid', 'outline', 'gradient'] as KineticStyle[]).map((s) => (
              <button
                key={s}
                type="button"
                className={`modui-control-btn ${style === s ? 'modui-control-btn--active' : ''}`}
                onClick={() => setStyle(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="modui-control-group">
          <label className="modui-control-label">Motion</label>
          <label className="modui-control-toggle">
            <input type="checkbox" checked={wave} onChange={(e) => setWave(e.target.checked)} />
            Wave on hover
          </label>
          <button type="button" className="modui-control-btn" onClick={() => setReplayKey((k) => k + 1)}>
            Reset letters
          </button>
        </div>
      </div>
    </>
  );
}
