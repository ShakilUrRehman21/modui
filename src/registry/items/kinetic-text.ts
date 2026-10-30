import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/motion/KineticText.tsx?raw';
import rawCssCode from '../../components/ui/motion/KineticText.css?raw';

export const kineticTextItem: ComponentRegistryItem = {
    id: 'kinetic-text',
    slug: 'kinetic-text',
    name: 'Kinetic Text',
    description: 'Expressive typography interaction with GSAP character-level splitting, magnetic wave elevation, and kinetic bounce.',
    category: 'Typography & Motion',
    tags: ['gsap', 'typography', 'kinetic', 'motion', 'text', 'wave', 'split-text'],
    status: 'published',
    publishedAt: '2026-10-11',
    updatedAt: '2026-10-11',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/motion/KineticText.tsx',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/motion/KineticText.tsx',
    installSnippet: `// 1. Install GSAP:
npm install gsap

// 2. Import KineticText:
import { KineticText } from '@/components/ui/motion/KineticText';`,
    codeSnippet: `import React from 'react';
import { KineticText } from '@/components/ui/motion/KineticText';

export function TypographyShowcase() {
  return (
    <div style={{ padding: '2rem' }}>
      <KineticText
        as="h1"
        text="Modular UI, sculpted in real time."
        interactiveWave={true}
      />
    </div>
  );
}`,
    rawSourceCode,
    rawCssCode,
    propsDoc: [
      {
        name: 'text',
        type: 'string',
        description: 'Input string to decompose and animate kinetically.',
        required: true,
      },
      {
        name: 'as',
        type: "'h1' | 'h2' | 'h3' | 'span' | 'div'",
        defaultValue: "'h2'",
        description: 'Semantic HTML tag to render.',
      },
      {
        name: 'interactiveWave',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Trigger GSAP ripple wave across character indices on hover.',
      },
    ],
    accessibilityNotes: [
      'Accessible text node preserved for screen readers without disruption.',
      'Characters marked with will-change for high performance rendering.',
    ],
    features: [
      'Zero layout shift character decomposition',
      'Smooth GSAP timeline easing',
      'Customizable per-character accent coloring',
    ],
  };
