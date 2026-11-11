import React, { useState, useEffect } from 'react';
import { CardStack } from '../../components/ui/card-stack';
import type { CardStackVariant } from '../../components/ui/card-stack';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function CardStackDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [cardStackVariant, setCardStackVariant] = useState<CardStackVariant>(() => isDark ? 'cinema-dark' : 'studio-light');
    const [cardStackFanOut, setCardStackFanOut] = useState<boolean>(true);
    const [cardStackSound, setCardStackSound] = useState<boolean>(true);
    const [cardStackActiveTitle, setCardStackActiveTitle] = useState<string>('Fluid Kinetic Springs');

  useEffect(() => {
    setCardStackVariant(isDark ? 'cinema-dark' : 'studio-light');
  }, [theme]);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: '540px', margin: '0 auto', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <CardStack
                          variant={cardStackVariant}
                          fanOutOnHover={cardStackFanOut}
                          soundEnabled={cardStackSound}
                          onCardChange={(item) => setCardStackActiveTitle(item.title)}
                        />
                        <div className="modui-stage-caption">
                          Active Deck Card: <span className="modui-stage-caption-value">{cardStackActiveTitle}</span>
                          <div className="modui-stage-caption-hint">
                            Click the top card or press Space / Arrow keys to cycle through the stack. Hover over the deck to fan out.
                          </div>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Surface Finish</label>
                      <select
                        className="modui-control-select"
                        value={cardStackVariant}
                        onChange={(e) => setCardStackVariant(e.target.value as CardStackVariant)}
                      >
                        <option value="studio-light">Studio Light (ModUI Standard)</option>
                        <option value="warm-editorial">Warm Editorial (Linen & Coral)</option>
                        <option value="glass-frost">Glass Frost (Specular Blur)</option>
                        <option value="cinema-dark">Cinema Dark (35mm Slate)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Physics & Motion</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={cardStackFanOut}
                            onChange={(e) => setCardStackFanOut(e.target.checked)}
                          />
                          <span>Rotational Fan Spread on Hover</span>
                        </label>
                      </div>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Acoustics</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={cardStackSound}
                            onChange={(e) => setCardStackSound(e.target.checked)}
                          />
                          <span>Web Audio Paper Flick Haptics</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
