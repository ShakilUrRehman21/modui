import React, { useState, useEffect } from 'react';
import { FilmstripGallery } from '../../components/ui/filmstrip';
import type { FilmstripVariant } from '../../components/ui/filmstrip';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function FilmstripGalleryDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [filmstripVariant, setFilmstripVariant] = useState<FilmstripVariant>(() => isDark ? 'cinema-dark' : 'studio-light');
    const [filmstripSprockets, setFilmstripSprockets] = useState<boolean>(true);
    const [filmstripFrameNumbers, setFilmstripFrameNumbers] = useState<boolean>(true);
    const [filmstripSound, setFilmstripSound] = useState<boolean>(true);
    const [filmstripLightbox, setFilmstripLightbox] = useState<boolean>(true);
    const [filmstripActiveFrame, setFilmstripActiveFrame] = useState<string>('Monolith Horizon');

  useEffect(() => {
    setFilmstripVariant(isDark ? 'cinema-dark' : 'studio-light');
  }, [theme]);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: '1080px', margin: '0 auto', padding: '1.25rem 0', display: 'flex', flexDirection: 'column' }}>
                        <FilmstripGallery
                          variant={filmstripVariant}
                          showSprockets={filmstripSprockets}
                          showFrameNumbers={filmstripFrameNumbers}
                          soundEnabled={filmstripSound}
                          enableLightbox={filmstripLightbox}
                          onFrameSelect={(item) => setFilmstripActiveFrame(item.title)}
                        />
                        <div style={{ marginTop: '1.25rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                          35mm Cinematography Reel: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{filmstripActiveFrame}</span>
                          <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                            Drag horizontally to scrub the reel. Click any frame to inspect in lightbox modal.
                          </div>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Emulsion & Atmosphere Finish</label>
                      <select
                        className="modui-control-select"
                        value={filmstripVariant}
                        onChange={(e) => setFilmstripVariant(e.target.value as FilmstripVariant)}
                      >
                        <option value="studio-light">Studio Light (ModUI Signature)</option>
                        <option value="warm-editorial">Warm Editorial (Linen & Coral)</option>
                        <option value="minimal-mono">Minimal Mono (High Contrast)</option>
                        <option value="cinema-dark">Cinema Dark (35mm Noir)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Reel Aesthetics & Overlays</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={filmstripSprockets}
                            onChange={(e) => setFilmstripSprockets(e.target.checked)}
                          />
                          <span>Perforated 35mm Sprocket Borders</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={filmstripFrameNumbers}
                            onChange={(e) => setFilmstripFrameNumbers(e.target.checked)}
                          />
                          <span>Frame Index Numbers & 24 FPS Sync</span>
                        </label>
      
                      </div>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Inspection & Acoustics</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={filmstripLightbox}
                            onChange={(e) => setFilmstripLightbox(e.target.checked)}
                          />
                          <span>Full-Bleed Modal Lightbox Inspection</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={filmstripSound}
                            onChange={(e) => setFilmstripSound(e.target.checked)}
                          />
                          <span>Synthesized Sprocket & Shutter Haptics</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
