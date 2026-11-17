import React, { useState } from 'react';
import { MagneticSpotlightReveal } from '../../components/ui/magnetic-spotlight';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function MagneticSpotlightRevealDemo({ theme: _theme }: DemoProps) {
  const [preset, setPreset] = useState<'production' | 'analytics'>('production');
  const [radius, setRadius] = useState<number>(80);
  const [showRing, setShowRing] = useState<boolean>(true);

  return (
    <>
      <div className="modui-canvas-stage">
        <div
          style={{
            width: '100%',
            maxWidth: '580px',
            margin: '0 auto',
            padding: '2.5rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '280px',
          }}
        >
          <MagneticSpotlightReveal
            key={`${preset}-${radius}-${showRing}`}
            radius={radius}
            showRing={showRing}
            {...(preset === 'analytics'
              ? {
                  baseContent: (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        fontFamily: 'var(--font-mono, monospace)',
                        color: '#64748B',
                      }}
                    >
                      <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                        Analytics Engine // Standby CAD
                      </div>
                      <div
                        style={{
                          border: '1px dashed rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          padding: '12px 16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '11px',
                        }}
                      >
                        <span>Query Pipeline [Wireframe]</span>
                        <span>Cold Storage</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#475569' }}>
                        Hover spotlight over canvas to ignite live pipeline
                      </div>
                    </div>
                  ),
                  revealContent: (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        background: 'linear-gradient(135deg, #0F172A 0%, #0369A1 100%)',
                        color: '#fff',
                      }}
                    >
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase' }}>
                        ⚡ Live Real-Time Telemetry
                      </div>
                      <div
                        style={{
                          background: 'rgba(255,255,255,0.14)',
                          border: '1px solid rgba(255,255,255,0.25)',
                          borderRadius: '8px',
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                        }}
                      >
                        <span style={{ fontWeight: 700 }}>🔥 2.4M Events / Sec</span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono, monospace)',
                            fontSize: '11px',
                            background: 'rgba(255,255,255,0.2)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 600,
                          }}
                        >
                          0.4ms Latency
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#BAE6FD' }}>
                        Stream ingestion distributed across 14 regions
                      </div>
                    </div>
                  ),
                }
              : {})}
          />

          <div className="modui-stage-caption" style={{ marginTop: '1.5rem' }}>
            <div className="modui-stage-caption-hint">
              Move cursor over canvas to focus spotlight portal. Resets to center on exit.
            </div>
          </div>
        </div>
      </div>

      <div className="modui-controls-panel">
        <div className="modui-control-group">
          <label className="modui-control-label">Preset View</label>
          <select
            className="modui-control-select"
            value={preset}
            onChange={(e) => setPreset(e.target.value as 'production' | 'analytics')}
          >
            <option value="production">Production Cloud (Approved)</option>
            <option value="analytics">Real-Time Analytics Pipeline</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Aperture Radius ({radius}px)</label>
          <input
            type="range"
            min={50}
            max={140}
            step={5}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="modui-control-range"
            style={{ accentColor: 'var(--accent-primary, #365CF5)', cursor: 'pointer' }}
          />
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Portal Border Ring</label>
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              marginTop: '6px',
            }}
          >
            <input
              type="checkbox"
              checked={showRing}
              onChange={(e) => setShowRing(e.target.checked)}
              style={{ accentColor: 'var(--accent-primary, #365CF5)' }}
            />
            Show Glowing Ring
          </label>
        </div>
      </div>
    </>
  );
}
