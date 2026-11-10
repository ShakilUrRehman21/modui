import React, { useState, useEffect } from 'react';
import { ReelTapeDeck } from '../../components/ui/tape-deck';
import type { ReelTapeDeckVariant, TapeSpeed } from '../../components/ui/tape-deck';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function ReelTapeDeckDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [deckVariant, setDeckVariant] = useState<ReelTapeDeckVariant>(() => isDark ? 'dark-slate' : 'studio-light');
    const [deckSpeed, setDeckSpeed] = useState<TapeSpeed>('15');
    const [deckSound, setDeckSound] = useState<boolean>(true);
    const [deckTransport, setDeckTransport] = useState<string>('stop');

  useEffect(() => {
    setDeckVariant(isDark ? 'dark-slate' : 'studio-light');
  }, [theme]);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', padding: '1rem 0', display: 'flex', flexDirection: 'column' }}>
                        <ReelTapeDeck
                          variant={deckVariant}
                          speed={deckSpeed}
                          soundEnabled={deckSound}
                          onTransportChange={(state) => setDeckTransport(state)}
                        />
                        <div style={{ marginTop: '1.25rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                          Transport Status: <span style={{ color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>{deckTransport}</span>
                          <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                            Click PLAY, REW, FFWD or drag either tape spool directly to scrub audio. Watch the twin ballistic VU meters dance in real time.
                          </div>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Chassis Finish</label>
                      <select
                        className="modui-control-select"
                        value={deckVariant}
                        onChange={(e) => setDeckVariant(e.target.value as ReelTapeDeckVariant)}
                      >
                        <option value="studio-light">Studio Light (ModUI Cream & Cobalt)</option>
                        <option value="dark-slate">Dark Slate (Mastering Suite)</option>
                        <option value="warm-editorial">Warm Editorial (Linen & Brass)</option>
                        <option value="minimal-mono">Minimal Mono (Dieter Rams Bauhaus)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Tape Speed (IPS)</label>
                      <select
                        className="modui-control-select"
                        value={deckSpeed}
                        onChange={(e) => setDeckSpeed(e.target.value as TapeSpeed)}
                      >
                        <option value="15">15 IPS (Studio High-Fidelity)</option>
                        <option value="7.5">7.5 IPS (Standard Reel)</option>
                        <option value="3.75">3.75 IPS (Extended Play)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Acoustics</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={deckSound}
                            onChange={(e) => setDeckSound(e.target.checked)}
                          />
                          <span>Web Audio Capstan & Solenoids</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
