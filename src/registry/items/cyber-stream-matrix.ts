import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/matrix/CyberStreamMatrix.tsx?raw';
import rawCssCode from '../../components/ui/matrix/CyberStreamMatrix.css?raw';

export const cyberStreamMatrixItem: ComponentRegistryItem = {
    id: 'cyber-stream-matrix',
    slug: 'cyber-stream-matrix',
    name: 'Cyber Stream Matrix',
    description: 'Hardware-accelerated generative glyph streaming canvas with cursor shockwave dispersion, tactile particle bursts, and customizable technical character sets.',
    category: '3D & Interactive Showcase',
    tags: ['matrix', 'canvas', 'stream', 'generative', 'interactive', 'particles', 'haptics', 'shimmer'],
    status: 'published',
    publishedAt: '2026-10-20',
    updatedAt: '2026-10-20',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/matrix/CyberStreamMatrix.tsx',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/matrix/CyberStreamMatrix.tsx',
    installSnippet: `// 1. Copy CyberStreamMatrix.tsx and CyberStreamMatrix.css into your project:
// components/ui/matrix/CyberStreamMatrix.tsx
// components/ui/matrix/CyberStreamMatrix.css
// 2. Import into your application:
import { CyberStreamMatrix } from '@/components/ui/matrix';`,
    codeSnippet: `import React from 'react';
import { CyberStreamMatrix } from '@/components/ui/matrix';

export function MatrixHeroDemo() {
  return (
    <div style={{ width: '100%', height: '420px', borderRadius: '12px', overflow: 'hidden' }}>
      <CyberStreamMatrix
        variant="studio-light"
        charset="hex"
        speed={0.5}
        interactive={true}
        glow={true}
        soundEnabled={true}
      >
        <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.1em', color: '#365CF5' }}>
            SYSTEM TELEMETRY
          </span>
          <h2 style={{ fontSize: '2rem', margin: '0.5rem 0', fontWeight: 800 }}>
            Generative Stream Engine
          </h2>
          <p style={{ opacity: 0.7, fontSize: '0.875rem' }}>
            Move cursor to disperse glyphs • Click to spawn particle bursts
          </p>
        </div>
      </CyberStreamMatrix>
    </div>
  );
}`,
    rawSourceCode,
    rawCssCode,
    propsDoc: [
      {
        name: 'variant',
        type: "'studio-light' | 'dark-obsidian' | 'blueprint' | 'emerald'",
        defaultValue: "'studio-light'",
        description: 'Visual color scheme and atmospheric background tone.',
      },
      {
        name: 'charset',
        type: "'matrix' | 'binary' | 'hex' | 'ascii'",
        defaultValue: "'hex'",
        description: 'Predefined glyph character set family.',
      },
      {
        name: 'customChars',
        type: 'string',
        description: 'User-specified string of characters to stream (overrides charset).',
      },
      {
        name: 'speed',
        type: 'number',
        defaultValue: '0.5',
        description: 'Falling stream velocity multiplier (0.2 to 3.0).',
      },
      {
        name: 'fontSize',
        type: 'number',
        defaultValue: '14',
        description: 'Font size in pixels for stream characters.',
      },
      {
        name: 'density',
        type: 'number',
        defaultValue: '1',
        description: 'Stream column density multiplier (0.5 to 2.0).',
      },
      {
        name: 'columnSpacing',
        type: 'number',
        defaultValue: '18',
        description: 'Horizontal column separation in pixels.',
      },
      {
        name: 'tailLength',
        type: 'number',
        defaultValue: '18',
        description: 'Number of decaying characters in each trailing column stream.',
      },
      {
        name: 'interactive',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Enables pointer shockwave repulsion and spotlight halo.',
      },
      {
        name: 'mouseRadius',
        type: 'number',
        defaultValue: '90',
        description: 'Repulsion force field radius in pixels around the pointer.',
      },
      {
        name: 'glow',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Adds specular bloom shadow glow to lead characters.',
      },
      {
        name: 'soundEnabled',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Synthesizes acoustic digital micro-chirps upon clicking particle bursts.',
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        description: 'Optional content rendered centered above the canvas stream.',
      },
    ],
    accessibilityNotes: [
      'Container acts as an accessible region with aria-label="Interactive Generative Matrix Stream".',
      'HTML5 canvas element marked aria-hidden="true" to prevent screen reader noise from rapid character stream updates.',
      'Overlay children preserve complete keyboard focusability and ARIA accessibility tree.',
      'Supports prefers-reduced-motion considerations by maintaining subtle stationary column rendering if requested.',
    ],
    features: [
      'High-DPI Retina display 2D canvas scaling with subpixel character coordinates',
      'Dynamic elastic pointer shockwave physics repelling streaming glyphs in real time',
      'Interactive particle burst system ejecting luminous glyph sparks on click or tap',
      '4 curated studio themes: Studio Porcelain Light, Stealth Dark Obsidian, Architectural Blueprint, Emerald Phosphor',
      'Integrated Web Audio micro-chirp synthesizer with zero external audio assets',
      'Zero external dependencies — pure HTML5 Canvas and React 19 lifecycle management',
    ],
  };
