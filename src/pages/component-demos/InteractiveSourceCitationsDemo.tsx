import React, { useState, useRef } from 'react';
import {
  InteractiveSourceCitations,
  type SourceCitationsVariant,
  type SourceCitationsSize,
  type InteractiveSourceCitationsHandle,
  type CitationSource,
} from '../../components/ui/source-citations';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function InteractiveSourceCitationsDemo({ theme }: DemoProps) {
  const isDark =
    theme
      ? theme === 'dark'
      : typeof document !== 'undefined' &&
        document.documentElement.getAttribute('data-theme') === 'dark';

  const [variant, setVariant] = useState<SourceCitationsVariant>(() =>
    isDark ? 'studio-obsidian' : 'clean-porcelain'
  );
  const [size, setSize] = useState<SourceCitationsSize>('md');
  const [showConfidenceBadge, setShowConfidenceBadge] = useState<boolean>(true);
  const [showSourceStrip, setShowSourceStrip] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const [selectedLog, setSelectedLog] = useState<string | null>(null);

  const citeRef = useRef<InteractiveSourceCitationsHandle>(null);

  const handleSelect = (source: CitationSource, index: number) => {
    setActiveIndex(index);
    setSelectedLog(`[${index}] ${source.domain} (${source.confidence}% Grounded)`);
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
            minHeight: '340px',
          }}
        >
          <InteractiveSourceCitations
            ref={citeRef}
            variant={variant}
            size={size}
            showConfidenceBadge={showConfidenceBadge}
            showSourceStrip={showSourceStrip}
            soundEnabled={soundEnabled}
            onSourceSelect={handleSelect}
          />

          <div className="modui-stage-caption" style={{ marginTop: '1.75rem' }}>
            <div className="modui-stage-caption-hint">
              Click inline [1] [2] [3] badges &bull; Use Arrow keys or 1–3 to inspect sources &bull; Click domain tabs below
            </div>
          </div>
        </div>
      </div>

      <div className="modui-controls-panel">
        <div className="modui-control-group">
          <label className="modui-control-label">Visual Variant</label>
          <select
            className="modui-control-select"
            value={variant}
            onChange={(e) => setVariant(e.target.value as SourceCitationsVariant)}
          >
            <option value="studio-obsidian">Studio Obsidian (Dark)</option>
            <option value="clean-porcelain">Clean Porcelain (Light)</option>
            <option value="cyber-neon">Cyber Neon (Cyan)</option>
            <option value="warm-editorial">Warm Editorial (Amber)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Card Scale</label>
          <select
            className="modui-control-select"
            value={size}
            onChange={(e) => setSize(e.target.value as SourceCitationsSize)}
          >
            <option value="sm">Small (Compact Answer)</option>
            <option value="md">Medium (Default RAG Card)</option>
            <option value="lg">Large (Research View)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Source Selection</label>
          <div className="modui-control-buttons">
            <button
              type="button"
              className={`modui-control-btn ${activeIndex === 1 ? 'modui-control-btn--active' : ''}`}
              onClick={() => citeRef.current?.selectSource(1)}
            >
              [1] React 19
            </button>
            <button
              type="button"
              className={`modui-control-btn ${activeIndex === 2 ? 'modui-control-btn--active' : ''}`}
              onClick={() => citeRef.current?.selectSource(2)}
            >
              [2] CSS Vars
            </button>
            <button
              type="button"
              className={`modui-control-btn ${activeIndex === 3 ? 'modui-control-btn--active' : ''}`}
              onClick={() => citeRef.current?.selectSource(3)}
            >
              [3] Web Audio
            </button>
            <button
              type="button"
              className="modui-control-btn"
              onClick={() => citeRef.current?.nextSource()}
            >
              Next &rsaquo;
            </button>
          </div>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Display &amp; Acoustics</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              <span>Web Audio Crystal Detents</span>
            </label>
            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={showConfidenceBadge}
                onChange={(e) => setShowConfidenceBadge(e.target.checked)}
              />
              <span>Grounding Count Badge</span>
            </label>
            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={showSourceStrip}
                onChange={(e) => setShowSourceStrip(e.target.checked)}
              />
              <span>Bottom Domain Switcher Strip</span>
            </label>
          </div>
        </div>

        {selectedLog && (
          <div className="modui-control-group" style={{ gridColumn: '1 / -1' }}>
            <label className="modui-control-label">Active Citation Telemetry</label>
            <div
              style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
              }}
            >
              {selectedLog}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
