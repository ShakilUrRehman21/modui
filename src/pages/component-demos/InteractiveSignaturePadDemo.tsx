import React, { useState, useRef } from 'react';
import { InteractiveSignaturePad } from '../../components/ui/signature-pad';
import type {
  SignatureVariant,
  SignatureSize,
  InteractiveSignaturePadHandle,
} from '../../components/ui/signature-pad';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function InteractiveSignaturePadDemo({ theme }: DemoProps) {
  const isDark =
    theme
      ? theme === 'dark'
      : typeof document !== 'undefined' &&
        document.documentElement.getAttribute('data-theme') === 'dark';

  const [variant, setVariant] = useState<SignatureVariant>(() =>
    isDark ? 'executive-dark' : 'porcelain-clean'
  );
  const [size, setSize] = useState<SignatureSize>('md');
  const [trimExport, setTrimExport] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showBaseline, setShowBaseline] = useState<boolean>(true);
  const [showPalette, setShowPalette] = useState<boolean>(true);
  const [lastExportUrl, setLastExportUrl] = useState<string | null>(null);

  const sigRef = useRef<InteractiveSignaturePadHandle>(null);

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
            minHeight: '280px',
          }}
        >
          <InteractiveSignaturePad
            ref={sigRef}
            variant={variant}
            size={size}
            trimExport={trimExport}
            soundEnabled={soundEnabled}
            showBaseline={showBaseline}
            showPalette={showPalette}
            onExport={(dataUrl) => setLastExportUrl(dataUrl)}
          />

          <div className="modui-stage-caption" style={{ marginTop: '1.75rem' }}>
            <div className="modui-stage-caption-hint">
              Sign with mouse, trackpad, or finger. Click Export PNG to literally download a cropped, high-resolution transparent PNG.
            </div>
          </div>
        </div>
      </div>

      <div className="modui-controls-panel">
        <div className="modui-control-group">
          <label className="modui-control-label">Document Finish</label>
          <select
            className="modui-control-select"
            value={variant}
            onChange={(e) => setVariant(e.target.value as SignatureVariant)}
          >
            <option value="executive-dark">Executive Dark (Graphite & Slate)</option>
            <option value="parchment-legal">Parchment Legal (Bond Paper & Navy Ink)</option>
            <option value="porcelain-clean">Porcelain Clean (Pure Minimalist White)</option>
            <option value="cyber-matrix">Cyber Matrix (Terminal Phosphor Green)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Scale Sizing</label>
          <select
            className="modui-control-select"
            value={size}
            onChange={(e) => setSize(e.target.value as SignatureSize)}
          >
            <option value="sm">Small (Modal Dialogs & Compact Checkout)</option>
            <option value="md">Medium (Standard Legal Signer Card)</option>
            <option value="lg">Large (Tablet & Desktop Boardroom Desk)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Options & Acoustics</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary, #365CF5)' }}
              />
              Paper Friction Whisper (Web Audio API)
            </label>

            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={trimExport}
                onChange={(e) => setTrimExport(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary, #365CF5)' }}
              />
              Crop Transparent Padding on Export
            </label>

            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={showBaseline}
                onChange={(e) => setShowBaseline(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary, #365CF5)' }}
              />
              Show Legal Baseline Guide
            </label>

            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={showPalette}
                onChange={(e) => setShowPalette(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary, #365CF5)' }}
              />
              Show Ink Palette Toolbar
            </label>
          </div>
        </div>

        {lastExportUrl && (
          <div className="modui-control-group">
            <label className="modui-control-label">Last Exported PNG Stamp</label>
            <div
              style={{
                marginTop: '6px',
                padding: '8px',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.2)',
                border: '1px dashed var(--border-secondary, #333)',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <img
                src={lastExportUrl}
                alt="Exported Signature Stamp"
                style={{ maxHeight: '60px', objectFit: 'contain' }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
