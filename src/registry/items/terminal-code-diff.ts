import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/terminal-diff/TerminalCodeDiff.tsx?raw';
import rawCssCode from '../../components/ui/terminal-diff/TerminalCodeDiff.css?raw';

export const terminalCodeDiffItem: ComponentRegistryItem = {
  id: 'terminal-code-diff',
  slug: 'terminal-code-diff',
  name: 'Terminal Code Diff Inspector',
  description:
    'Developer landing page centerpiece featuring macOS traffic lights, multi-file code tabs, line hover highlighting, before/after diff reduction view (+/-), and working one-click copy with acoustic micro-haptics.',
  category: '3D & Interactive Showcase',
  tags: [
    'terminal',
    'code',
    'diff',
    'developer-tools',
    'tabs',
    'syntax-highlighting',
    'copy-to-clipboard',
    'landing-page',
    'showcase',
    'haptics',
  ],
  status: 'published',
  publishedAt: '2026-11-18',
  updatedAt: '2026-11-18',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/terminal-diff/TerminalCodeDiff.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/terminal-diff/TerminalCodeDiff.tsx',
  installSnippet: `// 1. Copy TerminalCodeDiff.tsx and TerminalCodeDiff.css into your project:
import { TerminalCodeDiff } from '@/components/ui/terminal-diff';`,
  codeSnippet: `import React from 'react';
import { TerminalCodeDiff } from '@/components/ui/terminal-diff';

export function TerminalShowcase() {
  return (
    <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto' }}>
      <TerminalCodeDiff
        variant="studio-dark"
        soundEnabled={true}
        onCopy={(code, tabId) => console.log('Copied:', tabId, code)}
      />
    </div>
  );
}`,
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'tabs',
      type: 'TerminalTab[]',
      description: 'Array of file tab objects containing filename, lines, tokens, and rawCode.',
    },
    {
      name: 'defaultTabId',
      type: 'string',
      description: 'Default active tab id on initial render.',
    },
    {
      name: 'variant',
      type: "'studio-dark' | 'cyber-terminal' | 'clean-light' | 'midnight-pro'",
      defaultValue: "'studio-dark'",
      description: 'Visual finish variant determining chassis color and syntax theme.',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Synthesize acoustic Web Audio micro-ticks on tab change and copy.',
    },
    {
      name: 'compact',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Compact sizing mode scaled for card previews in catalog grids.',
    },
    {
      name: 'onTabChange',
      type: '(tabId: string, tab: TerminalTab) => void',
      description: 'Callback fired when a tab is selected.',
    },
    {
      name: 'onCopy',
      type: '(code: string, tabId: string) => void',
      description: 'Callback fired when code is successfully copied to clipboard.',
    },
  ],
  accessibilityNotes: [
    'Renders as role="region" with aria-label="Interactive Terminal Code Diff Inspector".',
    'Tab navigation uses semantic role="tablist" and role="tab" with aria-selected state.',
    'Copy button has descriptive aria-label and provides visual "Copied!" feedback.',
    'Code lines provide semantic line numbers and diff tags.',
    'Respects prefers-reduced-motion by disabling CSS transitions.',
  ],
  features: [
    'Sleek macOS traffic light titlebar with customizable file tabs',
    'Interactive diff mode showing lines removed (-) and lines added (+) with colored backgrounds',
    'Working one-click copy with navigator.clipboard and fallback document.execCommand support',
    '4 curated themes: Studio Dark (Vercel/Supabase), Clean Light (Porcelain), Cyber Terminal, Midnight Pro',
    'Line hover highlighting and fine syntax token coloring',
    'Native Web Audio API acoustic tick haptics with zero external audio files',
    'Strictly zero external style dependencies and pure React 19 architecture',
  ],
};
