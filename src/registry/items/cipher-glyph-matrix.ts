import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/cipher-glyph/CipherGlyphMatrix.tsx?raw';
import rawCssCode from '../../components/ui/cipher-glyph/CipherGlyphMatrix.css?raw';

export const cipherGlyphMatrixItem: ComponentRegistryItem = {
  id: 'cipher-glyph-matrix',
  slug: 'cipher-glyph-matrix',
  name: 'Cipher Glyph Matrix',
  description:
    'High-velocity cryptographic typography scrambler and decoder featuring progressive wavefront algorithms, variable cryptographic charsets, procedural audio tick DSP, and full Light/Dark mode styling.',
  category: 'Typography & Motion',
  tags: ['typography', 'cipher', 'matrix', 'scramble', 'decoder', 'katakana', 'kinetic', 'web-audio', 'haptics'],
  status: 'published',
  publishedAt: '2026-11-11',
  updatedAt: '2026-11-11',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/cipher-glyph/CipherGlyphMatrix.tsx',
  githubUrl: 'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/cipher-glyph/CipherGlyphMatrix.tsx',
  installSnippet: `// 1. Copy CipherGlyphMatrix.tsx and CipherGlyphMatrix.css into your project:
import { CipherGlyphMatrix } from '@/components/ui/cipher-glyph';`,
  codeSnippet: `import React from 'react';
import { CipherGlyphMatrix } from '@/components/ui/cipher-glyph';

export function CipherDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
      <CipherGlyphMatrix
        text={['QUANTUM_ENCRYPTED', 'NEURAL_NETWORK_V4', 'BIO_SYNAPSE_ONLINE']}
        charset="katakana"
        choreography="wave"
        variant="matrix-emerald"
        speed={38}
        soundEnabled={true}
        scrambleOnHover={true}
      />
    </div>
  );
}`,
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'text',
      type: 'string | string[]',
      description: 'Target text string or array of phrases to cycle through.',
      required: true,
    },
    {
      name: 'charset',
      type: "'katakana' | 'hex' | 'binary' | 'runic' | 'alphanumeric' | string",
      defaultValue: "'katakana'",
      description: 'Cryptographic character set preset or custom string of glyphs.',
    },
    {
      name: 'choreography',
      type: "'wave' | 'center-out' | 'random-dissolve' | 'cursor-proximity'",
      defaultValue: "'wave'",
      description: 'Wavefront decoding algorithm driving the resolution timeline.',
    },
    {
      name: 'variant',
      type: "'matrix-emerald' | 'cyber-cyan' | 'violet-plasma' | 'amber-phosphor'",
      defaultValue: "'matrix-emerald'",
      description: 'Luminous chromatic phosphor color theme.',
    },
    {
      name: 'theme',
      type: "'auto' | 'light' | 'dark'",
      defaultValue: "'auto'",
      description: 'Color theme mode. Synchronizes automatically with document data-theme or enforces explicit light/dark.',
    },
    {
      name: 'speed',
      type: 'number',
      defaultValue: '38',
      description: 'Tick interval in milliseconds between glyph flips.',
    },
    {
      name: 'iterations',
      type: 'number',
      defaultValue: '3',
      description: 'Number of scrambling flips per character before settling.',
    },
    {
      name: 'autoStart',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Automatically triggers cipher scramble on mount.',
    },
    {
      name: 'scrambleOnHover',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Triggers cipher scramble when mouse cursor hovers over text.',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Synthesizes mechanical micro-ticks and chime via Web Audio DSP.',
    },
    {
      name: 'showHud',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows live HUD header with charset indicator and entropy percentage.',
    },
    {
      name: 'bordered',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Wraps the component inside an outer frosted glass card box.',
    },
    {
      name: 'compact',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Compact mode for thumbnails and inline badge usage.',
    },
    {
      name: 'onComplete',
      type: '() => void',
      defaultValue: 'undefined',
      description: 'Callback fired when string decoding completes.',
    },
  ],
  features: [
    '4 Decoding Choreographies: Progressive Wave, Symmetrical Center-Out, Stochastic Random-Dissolve, and Cursor-Proximity scrub',
    '5 Cryptographic Character Sets: Cyber Katakana, Terminal Hex, Quantum Binary, Ancient Runic, and Alphanumeric',
    'Procedural Web Audio DSP: Ultra-fast mechanical micro-ticks and Geiger-like decoder chatter with resolution chime',
    'Multi-Phrase Cycling: Seamlessly steps through an array of phrases on click or automated intervals',
    'Platform Light & Dark UI Adaptation: Obsidian phosphor neon in dark mode vs. crisp porcelain titanium in light mode',
    'Full Accessibility: Accessible region role with hidden un-scrambled screen-reader text so assistive tech reads the clean message',
    'High Performance: Pure CSS transitions and microsecond timer interval with clean unmount cleanup',
  ],
  accessibilityNotes: [
    'ARIA role="region" with clean aria-label containing the decoded target string',
    'Includes an offscreen accessible screen-reader span containing the unmangled plain text',
    'Aria-hidden on scrambling characters to prevent screen reader announcements of rapid gibberish',
    'Respects reduced motion preferences by resolving instantly when requested',
  ],
};

