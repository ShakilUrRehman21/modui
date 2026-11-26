import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/source-citations/InteractiveSourceCitations.tsx?raw';
import rawCssCode from '../../components/ui/source-citations/InteractiveSourceCitations.css?raw';

export const interactiveSourceCitationsItem: ComponentRegistryItem = {
  id: 'interactive-source-citations',
  slug: 'interactive-source-citations',
  name: 'Interactive Source Citations',
  description:
    'AI search and RAG-grounded citation inspector featuring clickable inline grounding chips, live verbatim quote drawer, domain trust links, confidence scoring, keyboard stepping, and Web Audio crystal detent ticks.',
  category: 'Status & Indicators',
  tags: [
    'ai',
    'citations',
    'rag',
    'grounding',
    'search',
    'perplexity',
    'sources',
    'verification',
    'haptics',
  ],
  status: 'published',
  publishedAt: '2026-11-26',
  updatedAt: '2026-11-26',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/source-citations/InteractiveSourceCitations.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/source-citations/InteractiveSourceCitations.tsx',
  installSnippet: `// 1. Copy InteractiveSourceCitations.tsx and InteractiveSourceCitations.css into your project:
import { InteractiveSourceCitations } from '@/components/ui/source-citations';`,
  codeSnippet: `import React, { useRef } from 'react';
import {
  InteractiveSourceCitations,
  type InteractiveSourceCitationsHandle,
  type CitationSource,
} from '@/components/ui/source-citations';

export function GroundedAnswerView() {
  const citeRef = useRef<InteractiveSourceCitationsHandle>(null);

  const handleSelect = (source: CitationSource) => {
    console.log('Inspecting source:', source.domain, source.confidence);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
      <InteractiveSourceCitations
        ref={citeRef}
        variant="studio-obsidian"
        size="md"
        soundEnabled={true}
        onSourceSelect={handleSelect}
      />
    </div>
  );
}`,
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'segments',
      type: 'CitationSegment[]',
      defaultValue: 'DEFAULT_CITATION_SEGMENTS',
      description: 'Prose segments interleaved with optional inline citationIndex markers.',
    },
    {
      name: 'sources',
      type: 'CitationSource[]',
      defaultValue: 'DEFAULT_CITATION_SOURCES',
      description: 'Array of grounded source objects with title, domain, URL, quote, and confidence.',
    },
    {
      name: 'activeIndex',
      type: 'number',
      defaultValue: 'undefined',
      description: 'Controlled active citation index.',
    },
    {
      name: 'defaultActiveIndex',
      type: 'number',
      defaultValue: '1',
      description: 'Initial uncontrolled citation index.',
    },
    {
      name: 'variant',
      type: "'studio-obsidian' | 'clean-porcelain' | 'cyber-neon' | 'warm-editorial'",
      defaultValue: "'studio-obsidian'",
      description: 'Visual material colorway and card styling.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: 'Typography and container width preset.',
    },
    {
      name: 'showConfidenceBadge',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows the grounded sources count indicator badge.',
    },
    {
      name: 'showSourceStrip',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Displays the bottom source domain switcher tabs.',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Enables Web Audio crystal detent ticks when switching citations.',
    },
    {
      name: 'compact',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Compact non-overflowing mode for Explorer catalog cards.',
    },
    {
      name: 'onSourceSelect',
      type: '(source: CitationSource, index: number) => void',
      defaultValue: 'undefined',
      description: 'Callback fired when a citation chip or source tab is selected.',
    },
  ],
  features: [
    'Inline Grounding Chips: Clickable [1], [2], [3] citations embedded directly inside AI-generated prose.',
    'Verbatim Quote Verification Drawer: Smoothly animates between cited passages with source domain links and grounding confidence percentages.',
    'Multi-Modal Navigation: Step via inline chips, bottom domain tabs, header prev/next buttons, or keyboard (ArrowLeft/Right and 1-9 keys).',
    'Web Audio Crystal Ticks: Pitch-indexed triangle oscillator feedback per source index.',
    'Zero External Dependencies: Pure standard CSS custom properties and React 19 forwardRef handle.',
  ],
  accessibilityNotes: [
    'Root container uses role="region" with aria-label="Grounded Source Citations" and keyboard focus support.',
    'Inline citation chips expose aria-pressed state and descriptive "Inspect citation N" labels.',
    'Bottom source switcher implements role="tablist", role="tab", and aria-selected attributes.',
    'Active quote drawer uses aria-live="polite" to announce source changes cleanly.',
  ],
};
