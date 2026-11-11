import React, { useState } from 'react';
import { Badge } from '../../components/ui/badge';
import type { BadgeVariant } from '../../components/ui/badge';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

const VARIANTS: { variant: BadgeVariant; label: string }[] = [
  { variant: 'default', label: 'Draft' },
  { variant: 'accent', label: 'Live' },
  { variant: 'success', label: 'Deployed' },
  { variant: 'warning', label: 'Degraded' },
  { variant: 'cyan', label: 'Syncing' },
];

const SERVICES: { name: string; region: string; variant: BadgeVariant; status: string; pulse?: boolean }[] = [
  { name: 'Edge API', region: 'fra-1', variant: 'success', status: 'Operational' },
  { name: 'Realtime', region: 'iad-1', variant: 'accent', status: 'Streaming', pulse: true },
  { name: 'Search index', region: 'sin-1', variant: 'cyan', status: 'Rebuilding', pulse: true },
  { name: 'Image CDN', region: 'gru-1', variant: 'warning', status: 'Slow responses' },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function BadgeDemo(_props: DemoProps) {
  const [showDot, setShowDot] = useState(true);
  const [pulse, setPulse] = useState(true);

  return (
    <>
      <div className="modui-canvas-stage">
        <div className="modui-badge-demo">
          <div className="modui-badge-demo-row" aria-label="Badge variants">
            {VARIANTS.map(({ variant, label }) => (
              <Badge key={variant} variant={variant} dot={showDot} pulse={showDot && pulse && variant !== 'default'}>
                {label}
              </Badge>
            ))}
          </div>

          <ul className="modui-badge-demo-list" aria-label="Badges in context">
            {SERVICES.map((s) => (
              <li key={s.name} className="modui-badge-demo-item">
                <span className="modui-badge-demo-name">{s.name}</span>
                <span className="modui-badge-demo-region">{s.region}</span>
                <Badge variant={s.variant} dot={showDot} pulse={showDot && pulse && s.pulse}>
                  {s.status}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="modui-controls-panel">
        <div className="modui-control-group">
          <label className="modui-control-label">Indicators</label>
          <label className="modui-control-toggle">
            <input type="checkbox" checked={showDot} onChange={(e) => setShowDot(e.target.checked)} />
            Status dot
          </label>
          <label className="modui-control-toggle">
            <input type="checkbox" checked={pulse} disabled={!showDot} onChange={(e) => setPulse(e.target.checked)} />
            Pulse on live states
          </label>
        </div>
      </div>
    </>
  );
}
