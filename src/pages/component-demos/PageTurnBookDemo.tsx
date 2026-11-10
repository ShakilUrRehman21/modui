import React, { useState, useEffect } from 'react';
import { PageTurnBook } from '../../components/ui/page-turn';
import type { PageTurnVariant } from '../../components/ui/page-turn';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function PageTurnBookDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [bookVariant, setBookVariant] = useState<PageTurnVariant>(() => isDark ? 'dark-obsidian' : 'studio-editorial');
    const [bookSound, setBookSound] = useState<boolean>(true);
    const [bookAutoPlay, setBookAutoPlay] = useState<boolean>(false);
    const [bookCurl, setBookCurl] = useState<boolean>(true);
    const [bookActiveSpread, setBookActiveSpread] = useState<number>(0);

  useEffect(() => {
    setBookVariant(isDark ? 'dark-obsidian' : 'studio-editorial');
  }, [theme]);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: '860px', margin: '0 auto', padding: '1rem 0', display: 'flex', flexDirection: 'column' }}>
                        <PageTurnBook
                          variant={bookVariant}
                          soundEnabled={bookSound}
                          autoPlay={bookAutoPlay}
                          interactiveCurl={bookCurl}
                          onPageChange={(spreadIdx) => setBookActiveSpread(spreadIdx)}
                        />
                        <div style={{ marginTop: '1.25rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                          Current Spread: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Spread {bookActiveSpread + 1}</span> (Pages {bookActiveSpread * 2 + 1} &amp; {bookActiveSpread * 2 + 2})
                          <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                            Drag horizontally across pages or click corner curl to turn leaves. Use Left &amp; Right Arrow keys for keyboard flipping.
                          </div>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Aesthetic Edition</label>
                      <select
                        className="modui-control-select"
                        value={bookVariant}
                        onChange={(e) => setBookVariant(e.target.value as PageTurnVariant)}
                      >
                        <option value="studio-editorial">Studio Editorial (Warm Archival Paper)</option>
                        <option value="dark-obsidian">Dark Obsidian (Carbon &amp; Luminous Cobalt)</option>
                        <option value="blueprint">Blueprint Tech (Drafting Grid &amp; Cyan)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Interactive Paper Physics</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={bookCurl}
                            onChange={(e) => setBookCurl(e.target.checked)}
                          />
                          <span>Corner Peel Curl Indicator</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={bookSound}
                            onChange={(e) => setBookSound(e.target.checked)}
                          />
                          <span>Web Audio Paper Rustle DSP</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={bookAutoPlay}
                            onChange={(e) => setBookAutoPlay(e.target.checked)}
                          />
                          <span>Auto-Turn Spreads</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
