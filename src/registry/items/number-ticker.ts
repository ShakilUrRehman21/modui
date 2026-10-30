import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/counter/NumberTicker.tsx?raw';
import rawCssCode from '../../components/ui/counter/NumberTicker.css?raw';

export const numberTickerItem: ComponentRegistryItem = {
    id: 'number-ticker',
    slug: 'number-ticker',
    name: 'Number Ticker',
    description: 'Smooth vertical slot-machine rolling number counter with spring physics, individual column staggering, tabular numerals, and prefix/suffix formatting.',
    category: 'Typography & Motion',
    tags: ['counter', 'ticker', 'odometer', 'motion', 'spring', 'typography', 'numbers'],
    status: 'published',
    publishedAt: '2026-10-13',
    updatedAt: '2026-10-13',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/counter/NumberTicker.tsx',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/counter/NumberTicker.tsx',
    installSnippet: `// 1. Copy NumberTicker.tsx and NumberTicker.css into your project:
// components/ui/counter/NumberTicker.tsx
// components/ui/counter/NumberTicker.css

import { NumberTicker } from './components/ui/counter/NumberTicker';

export default function Example() {
  return (
    <div style={{ fontSize: '3rem', fontWeight: 700 }}>
      <NumberTicker value={1420} prefix="$" suffix="/mo" />
    </div>
  );
}`,
    codeSnippet: `import { NumberTicker } from './components/ui/counter/NumberTicker';

export function MetricsShowcase() {
  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <span className="metric-label">Monthly Active Users</span>
        <NumberTicker
          value={84250}
          suffix="+"
          duration={1.4}
        />
      </div>

      <div className="metric-card">
        <span className="metric-label">Uptime Reliability</span>
        <NumberTicker
          value={99.98}
          decimalPlaces={2}
          suffix="%"
          duration={1.2}
        />
      </div>

      <div className="metric-card">
        <span className="metric-label">Annual Recurring Revenue</span>
        <NumberTicker
          value={1240}
          prefix="$"
          suffix="k"
          duration={1.5}
        />
      </div>
    </div>
  );
}`,
    rawSourceCode,
    rawCssCode,
    propsDoc: [
      {
        name: 'value',
        type: 'number',
        description: 'Target numerical value to roll to.',
        required: true,
      },
      {
        name: 'decimalPlaces',
        type: 'number',
        defaultValue: '0',
        description: 'Number of decimal places to format and display.',
      },
      {
        name: 'prefix',
        type: 'string',
        defaultValue: "''",
        description: 'Text or symbol prepended before numbers (e.g. $, +).',
      },
      {
        name: 'suffix',
        type: 'string',
        defaultValue: "''",
        description: 'Text or symbol appended after numbers (e.g. %, k, /mo).',
      },
      {
        name: 'duration',
        type: 'number',
        defaultValue: '1.2',
        description: 'Animation roll duration in seconds.',
      },
      {
        name: 'delay',
        type: 'number',
        defaultValue: '0',
        description: 'Delay in seconds before roll begins.',
      },
      {
        name: 'stagger',
        type: 'number',
        defaultValue: '0.04',
        description: 'Per-digit column stagger interval in seconds.',
      },
    ],
    accessibilityNotes: [
      'Accessible screen-reader readout container with role="status" and aria-live="polite".',
      'Visual rolling digits marked with aria-hidden="true" to prevent redundant character readings.',
      'Respects prefers-reduced-motion media query by disabling animation transitions.',
      'Strict tabular figures (font-variant-numeric: tabular-nums) eliminate layout shift and horizontal jank.',
    ],
    features: [
      'Individual slot-machine vertical roll strips for every digit 0-9',
      'Physics-based cubic-bezier(0.16, 1, 0.3, 1) spring deceleration',
      'Thousands comma separation with fractional precision support',
      'Zero external runtime dependencies (Pure React 19 + CSS)',
    ],
  };
