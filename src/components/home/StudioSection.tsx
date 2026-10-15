import React, { useState } from 'react';
import { KineticText } from '../ui/motion/KineticText';
import { trackPreviewOpen } from '../../lib/analytics';
import './StudioSection.css';

interface StudioSectionProps {
  onNavigate: (path: string) => void;
}

export const StudioSection: React.FC<StudioSectionProps> = ({ onNavigate }) => {
  const [stageKineticText, setStageKineticText] = useState('Modular UI, crafted with character.');
  const [kineticWaveKey, setKineticWaveKey] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playClickSound = (pitch = 720) => {
    if (!soundEnabled) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;
      const ctx = new AudioCtxClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.45, ctx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch {
      // AudioContext blocked by browser policy, fail gracefully
    }
  };

  const handlePresetClick = (text: string, presetName: string) => {
    setStageKineticText(text);
    setKineticWaveKey((k) => k + 1);
    playClickSound(800);
    trackPreviewOpen({ component: 'kinetic-text', mode: 'preset', variant: presetName });
  };

  const handlePing = () => {
    setKineticWaveKey((k) => k + 1);
    playClickSound(950);
  };

  return (
    <div id="studio-stage" className="modui-workbench-stage-card">
      <div className="modui-workbench-header">
        <div className="modui-workbench-title-group">
          <span className="modui-stage-dot" />
          <span className="modui-workbench-title">INTERACTIVE STUDIO</span>
          <span className="modui-stage-counter-pill">GSAP Kinetic Wave</span>
        </div>

        <div className="modui-workbench-header-right">
          <button
            type="button"
            className="modui-sound-toggle-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute synthesized click SFX' : 'Enable click SFX'}
          >
            <span>{soundEnabled ? '🔊 Sound On' : '🔇 Muted'}</span>
          </button>
        </div>
      </div>

      <div className="modui-workbench-canvas">
        <div className="modui-stage-center-box">
          <KineticText
            key={kineticWaveKey}
            text={stageKineticText}
          />
          <span className="modui-canvas-caption">
            Hover over any character to trigger real-time spring physics
          </span>
        </div>
      </div>

      <div className="modui-stage-tweak-bar">
        <div className="modui-tweak-group modui-tweak-group-grow">
          <span className="modui-tweak-label">Kinetic String:</span>
          <input
            type="text"
            className="modui-tweak-input"
            value={stageKineticText}
            onChange={(e) => setStageKineticText(e.target.value)}
            placeholder="Type custom text..."
          />
        </div>

        <div className="modui-tweak-group">
          <span className="modui-tweak-label">Presets:</span>
          <button
            type="button"
            className={`modui-pill-toggle ${stageKineticText.includes('Modular') ? 'modui-pill-toggle--active' : ''}`}
            onClick={() => handlePresetClick('Modular UI, crafted with character.', 'character')}
          >
            Character
          </button>
          <button
            type="button"
            className={`modui-pill-toggle ${stageKineticText.includes('Physics') ? 'modui-pill-toggle--active' : ''}`}
            onClick={() => handlePresetClick('Physics-based typography motion.', 'physics')}
          >
            Physics
          </button>
          <button
            type="button"
            className={`modui-pill-toggle ${stageKineticText.includes('Subpixel') ? 'modui-pill-toggle--active' : ''}`}
            onClick={() => handlePresetClick('Subpixel rendering with pure CSS.', 'subpixel')}
          >
            Subpixel
          </button>
        </div>
      </div>

      <div className="modui-workbench-footer">
        <span className="modui-workbench-footer-hint">
          Interactive Motion Engine • Zero runtime dependencies
        </span>
        <div className="modui-workbench-inspect-link">
          <button
            onClick={() => onNavigate('/components/kinetic-text')}
            className="modui-inspect-action-btn"
          >
            <span>Inspect Component</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
