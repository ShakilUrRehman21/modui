import React, { useState, useRef } from 'react';
import { CipherGlyphMatrix } from '../../components/ui/cipher-glyph';
import type {
  CipherCharset,
  CipherChoreography,
  CipherVariant,
} from '../../components/ui/cipher-glyph';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

const PHRASES = [
  'QUANTUM_ENCRYPTED',
  'NEURAL_CIPHER_V4',
  'SYNAPSE_PROTOCOL_ACTIVE',
  'DECENTRALIZED_NEXUS',
];

export default function CipherGlyphMatrixDemo({ theme }: DemoProps) {
  const isDark =
    theme
      ? theme === 'dark'
      : typeof document !== 'undefined' &&
        document.documentElement.getAttribute('data-theme') === 'dark';

  const [charset, setCharset] = useState<CipherCharset>('katakana');
  const [choreography, setChoreography] = useState<CipherChoreography>('wave');
  const [variant, setVariant] = useState<CipherVariant>(() =>
    isDark ? 'matrix-emerald' : 'cyber-cyan'
  );
  const [speed, setSpeed] = useState<number>(38);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [scrambleOnHover, setScrambleOnHover] = useState<boolean>(true);

  const triggerRef = useRef<(() => void) | null>(null);

  const handleManualScramble = () => {
    triggerRef.current?.();
  };

  return (
    <>
      <div className="modui-canvas-stage">
        <div
          style={{
            width: '100%',
            maxWidth: '820px',
            margin: '0 auto',
            padding: '1.5rem 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '100%' }}>
            <CipherGlyphMatrix
              text={PHRASES}
              charset={charset}
              choreography={choreography}
              variant={variant}
              theme={theme}
              speed={speed}
              iterations={3}
              soundEnabled={soundEnabled}
              scrambleOnHover={scrambleOnHover}
              showHud={true}
              onScrambleRef={(fn) => {
                triggerRef.current = fn;
              }}
            />
          </div>

          <div
            style={{
              marginTop: '1.25rem',
              fontSize: '0.8125rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-tertiary)',
              textAlign: 'center',
            }}
          >
            Hover characters to scramble &bull; Click to cycle phrases
          </div>
        </div>
      </div>

      <div className="modui-controls-panel">
        <div className="modui-control-group">
          <label className="modui-control-label">Character Glyph Set</label>
          <select
            className="modui-control-select"
            value={charset}
            onChange={(e) => setCharset(e.target.value as CipherCharset)}
          >
            <option value="katakana">Katakana Cyber (Matrix)</option>
            <option value="hex">Hexadecimal Terminal</option>
            <option value="binary">Quantum Binary (0/1)</option>
            <option value="runic">Ancient Nordic Runic</option>
            <option value="alphanumeric">ASCII Alphanumeric</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Phosphor Glow</label>
          <select
            className="modui-control-select"
            value={variant}
            onChange={(e) => setVariant(e.target.value as CipherVariant)}
          >
            <option value="matrix-emerald">Matrix Emerald</option>
            <option value="cyber-cyan">Cyber Cyan</option>
            <option value="violet-plasma">Violet Plasma</option>
            <option value="amber-phosphor">Amber Phosphor</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Decoding Motion</label>
          <select
            className="modui-control-select"
            value={choreography}
            onChange={(e) => setChoreography(e.target.value as CipherChoreography)}
          >
            <option value="wave">Progressive Wave</option>
            <option value="center-out">Center Outward</option>
            <option value="cursor-proximity">Cursor Proximity</option>
            <option value="random-dissolve">Random Dissolve</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Flip Velocity ({speed}ms)</label>
          <input
            type="range"
            min="20"
            max="90"
            step="5"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
          />
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Acoustics & Actions</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <label className="modui-control-toggle" style={{ paddingTop: 0 }}>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              <span>Audio Chatter</span>
            </label>

            <button
              type="button"
              className="modui-pill-toggle modui-pill-toggle--active"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              onClick={handleManualScramble}
            >
              ⚡ Re-Scramble
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
