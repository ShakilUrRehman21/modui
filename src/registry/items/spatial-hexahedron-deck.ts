import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/spatial-hexahedron-deck/SpatialHexahedronDeck.tsx?raw';
import rawCssCode from '../../components/ui/spatial-hexahedron-deck/SpatialHexahedronDeck.css?raw';

export const spatialHexahedronDeckItem: ComponentRegistryItem = {
  id: 'spatial-hexahedron-deck',
  slug: 'spatial-hexahedron-deck',
  name: 'Spatial Hexahedron Deck',
  description:
    '3D navigable isometric cube product stage in hardware-accelerated CSS 3D space with continuous pointer drag, momentum inertia damping, 6-face capability inspection, 1-click directional face snaps, and multi-angle exploded view.',
  category: '3D & Interactive Showcase',
  tags: [
    '3d',
    'cube',
    'hexahedron',
    'spatial',
    'landing-page',
    'product-showcase',
    'interactive',
    'inertia',
    'explode',
    'haptics',
  ],
  status: 'published',
  publishedAt: '2026-11-21',
  updatedAt: '2026-11-21',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/spatial-hexahedron-deck/SpatialHexahedronDeck.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/spatial-hexahedron-deck/SpatialHexahedronDeck.tsx',
  installSnippet: `// 1. Copy SpatialHexahedronDeck.tsx and SpatialHexahedronDeck.css into your project:
import { SpatialHexahedronDeck } from '@/components/ui/spatial-hexahedron-deck';`,
  codeSnippet: `import React, { useRef } from 'react';
import {
  SpatialHexahedronDeck,
  type SpatialHexahedronDeckHandle,
} from '@/components/ui/spatial-hexahedron-deck';

export function ProductPillarHero() {
  const cubeRef = useRef<SpatialHexahedronDeckHandle>(null);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 1rem' }}>
      <SpatialHexahedronDeck
        ref={cubeRef}
        variant="cyber-obsidian"
        size="md"
        autoRotate={true}
        showFaceNav={true}
        onFaceChange={(face) => console.log('Active face:', face.title)}
      />
    </div>
  );
}`,
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'variant',
      type: "'cyber-obsidian' | 'clean-porcelain' | 'titanium-steel' | 'aurora-violet'",
      defaultValue: "'cyber-obsidian'",
      description: 'Chassis material finish and colorway theme.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: 'Cube size scale preset (150px, 220px, 280px).',
    },
    {
      name: 'cubeSize',
      type: 'number',
      defaultValue: 'undefined',
      description: 'Explicit pixel size for the cube (overrides size preset).',
    },
    {
      name: 'interactive',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Whether 3D free-form pointer drag rotation is enabled.',
    },
    {
      name: 'exploded',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Whether the cube is in unfolded/exploded inspection mode.',
    },
    {
      name: 'explodeDistance',
      type: 'number',
      defaultValue: '1.68',
      description: 'Distance multiplier for exploded faces outward displacement.',
    },
    {
      name: 'autoRotate',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Whether idle auto-rotation along Y axis is active.',
    },
    {
      name: 'autoRotateSpeed',
      type: 'number',
      defaultValue: '0.25',
      description: 'Idle auto-rotation speed in degrees per frame.',
    },
    {
      name: 'activeFace',
      type: "'front' | 'right' | 'back' | 'left' | 'top' | 'bottom'",
      defaultValue: "'front'",
      description: 'Currently focused active face ID.',
    },
    {
      name: 'onFaceChange',
      type: '(face: CubeFaceData) => void',
      defaultValue: 'undefined',
      description: 'Callback fired when face snap or active face changes.',
    },
    {
      name: 'showFaceNav',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Whether to show the directional face snap quick-nav pills.',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Whether to enable synthesized Web Audio API haptics.',
    },
    {
      name: 'compact',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Compact density mode for explorer cards or preview containers.',
    },
  ],
  accessibilityNotes: [
    'Stage container provides role="region" and aria-label="3D Navigable Spatial Hexahedron Product Deck".',
    'Interactive 3D viewport is keyboard accessible via arrow keys for rotational inspection and E key to explode.',
    'Quick-snap directional navigation buttons provide accessible aria-pressed and semantic button labels.',
    'Reduced motion preferences are respected by allowing auto-rotation to be paused.',
  ],
  features: [
    'Hardware-accelerated CSS 3D space with preserve-3d and perspective projection',
    'Continuous pointer drag rotation with instantaneous velocity tracking and momentum inertia damping',
    'Multi-angle exploded inspection mode projecting all 6 faces outward along normal vectors',
    '1-click directional face snap navigation to front, right, back, left, top, and bottom faces',
    '4 curated themes: Cyber Obsidian, Clean Porcelain, Titanium Steel, and Aurora Violet',
    'Zero external style dependencies: standard CSS custom properties only',
    'Zero external audio assets: Web Audio API oscillators for detent clicks and latch resonance',
  ],
};
