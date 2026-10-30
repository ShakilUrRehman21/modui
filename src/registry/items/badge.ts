import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/badge/Badge.tsx?raw';
import rawCssCode from '../../components/ui/badge/Badge.css?raw';

export const badgeItem: ComponentRegistryItem = {
    id: 'badge',
    slug: 'badge',
    name: 'Pulse Badge',
    description: 'Tactile status indicators and pill badges with breathing ambient pulse auras, icon slots, and semantic color tokens.',
    category: 'Status & Indicators',
    tags: ['badge', 'status', 'pulse', 'indicator', 'pill', 'aura'],
    status: 'published',
    publishedAt: '2026-10-11',
    updatedAt: '2026-10-11',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/badge/Badge.tsx',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/badge/Badge.tsx',
    installSnippet: `// 1. Copy Badge.tsx and Badge.css into your project:
import { Badge } from '@/components/ui/badge';`,
    codeSnippet: `import React from 'react';
import { Badge } from '@/components/ui/badge';

export function BadgeShowcase() {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="accent" dot pulse>Live Pulse</Badge>
      <Badge variant="success" dot>Operational</Badge>
      <Badge variant="cyan">React 19</Badge>
      <Badge variant="default">Pure CSS</Badge>
    </div>
  );
}`,
    rawSourceCode,
    rawCssCode,
    propsDoc: [
      {
        name: 'variant',
        type: "'default' | 'accent' | 'success' | 'warning' | 'cyan'",
        defaultValue: "'default'",
        description: 'Semantic surface and color token styling.',
      },
      {
        name: 'dot',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Displays a live indicator circle dot.',
      },
      {
        name: 'pulse',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Adds breathing radial pulse keyframe wave around the dot.',
      },
      {
        name: 'icon',
        type: 'React.ReactNode',
        defaultValue: 'undefined',
        description: 'Optional leading icon slot.',
      },
    ],
    accessibilityNotes: [
      'Pure semantic text pill with optional aria-hidden decorative pulse beacon.',
      'Meets WCAG AA contrast standards across all variants.',
    ],
    features: [
      'Lightweight React & CSS keyframes',
      'Smooth breathing pulse radar beacon',
      'Compact & responsive token-driven colors',
    ],
  };
