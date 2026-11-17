import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/magnetic-spotlight/MagneticSpotlightReveal.tsx?raw';
import rawCssCode from '../../components/ui/magnetic-spotlight/MagneticSpotlightReveal.css?raw';

export const magneticSpotlightRevealItem: ComponentRegistryItem = {
  id: 'magnetic-spotlight-reveal',
  slug: 'magnetic-spotlight-reveal',
  name: 'Magnetic Spotlight & Portal Reveal',
  description:
    'Cursor-following fluid aperture mask that reveals vivid underlying product mockups or colored graphics through a dark schematic layer. Features glowing border ring, spring velocity tracking, and smooth fluid transitions.',
  category: '3D & Interactive Showcase',
  tags: [
    'spotlight',
    'portal',
    'reveal',
    'mask',
    'clip-path',
    'interactive',
    'hero',
    'landing-page',
    'showcase',
    'before-after',
  ],
  status: 'published',
  publishedAt: '2026-11-17',
  updatedAt: '2026-11-17',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/magnetic-spotlight/MagneticSpotlightReveal.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/magnetic-spotlight/MagneticSpotlightReveal.tsx',
  installSnippet: `// 1. Copy MagneticSpotlightReveal.tsx and MagneticSpotlightReveal.css into your project:
import { MagneticSpotlightReveal } from '@/components/ui/magnetic-spotlight';`,
  codeSnippet: `import React from 'react';
import { MagneticSpotlightReveal } from '@/components/ui/magnetic-spotlight';

export function SpotlightShowcase() {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <MagneticSpotlightReveal radius={80} showRing={true} />
    </div>
  );
}`,
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'revealContent',
      type: 'React.ReactNode',
      description: 'Underlying rich content revealed inside the magnetic spotlight aperture (defaults to live production cloud card).',
    },
    {
      name: 'baseContent',
      type: 'React.ReactNode',
      description: 'Base background content visible outside the spotlight boundary (defaults to schematic architecture wireframe).',
    },
    {
      name: 'radius',
      type: 'number',
      defaultValue: '80',
      description: 'Radius of the spotlight aperture circle in pixels.',
    },
    {
      name: 'showRing',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Show glowing illuminated magnetic portal border ring.',
    },
    {
      name: 'compact',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Compact sizing mode scaled for card previews in catalog grids.',
    },
    {
      name: 'onPositionChange',
      type: '(x: number, y: number) => void',
      description: 'Callback fired continuously with coordinates as the spotlight moves.',
    },
  ],
  accessibilityNotes: [
    'Renders as role="region" with aria-label="Interactive Magnetic Spotlight & Portal Reveal".',
    'Full keyboard navigation: Arrow keys nudge the spotlight position across the canvas.',
    'Press Escape or Enter to smoothly reset spotlight aperture back to center.',
    'Screen reader announcement describes available keyboard shortcuts.',
    'Respects prefers-reduced-motion by disabling CSS motion transitions.',
  ],
  features: [
    'Smooth cursor-following fluid aperture mask with dynamic CSS clip-path',
    'Electric indigo glowing portal ring with layered radial glow',
    'Dark schematic blueprint base layer with wireframe box and technical specs',
    'Vibrant production cloud reveal layer with live quantum cluster card and 99.99% SLO pill',
    'Smooth 0.08s ease-out auto-centering reset when cursor leaves canvas',
    'Full keyboard accessibility with Arrow keys and Escape reset',
    'Strictly zero external runtime style dependencies and zero sound synthesizer',
  ],
};
