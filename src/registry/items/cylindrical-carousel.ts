import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/carousel/CylindricalCarousel.tsx?raw';
import rawCssCode from '../../components/ui/carousel/CylindricalCarousel.css?raw';

export const cylindricalCarouselItem: ComponentRegistryItem = {
    id: 'cylindrical-carousel',
    slug: 'cylindrical-carousel',
    name: 'Cylindrical 3D Carousel',
    description: '3D cylindrical projection carousel with touch/mouse inertia drag physics, real-time depth-of-field blur, and click-to-focus orientation.',
    category: '3D & Interactive Showcase',
    tags: ['carousel', '3d', 'inertia', 'physics', 'perspective', 'depth-of-field', 'slider', 'interactive'],
    status: 'published',
    publishedAt: '2026-10-14',
    updatedAt: '2026-10-14',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/carousel/CylindricalCarousel.tsx',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/carousel/CylindricalCarousel.tsx',
    installSnippet: `// 1. Copy CylindricalCarousel.tsx and CylindricalCarousel.css into your project:
// components/ui/carousel/CylindricalCarousel.tsx
// components/ui/carousel/CylindricalCarousel.css

// 2. Import and pass an array of items:
import { CylindricalCarousel } from '@/components/ui/carousel';

const items = [
  { id: '1', title: 'Spatial Studio', subtitle: 'Hardware module', tag: 'Core', badge: 'v2.1' },
  { id: '2', title: 'Neural Canvas', subtitle: 'Generative shader', tag: 'WebGL', badge: 'New' },
  { id: '3', title: 'Haptic Rotary', subtitle: 'Dial encoder', tag: 'Analog' },
  { id: '4', title: 'Vector Scope', subtitle: 'Waveform telemetry', tag: 'Audio' },
  { id: '5', title: 'Kinetic Matrix', subtitle: 'Spring geometry', tag: 'Physics' },
];

export default function Showcase() {
  return (
    <CylindricalCarousel
      items={items}
      radius={380}
      cardWidth={230}
      cardHeight={310}
      autoplay={false}
    />
  );
}`,
    codeSnippet: `import React from 'react';
import { CylindricalCarousel } from '@/components/ui/carousel';

const items = [
  { id: '1', title: 'Spatial Studio', subtitle: 'Hardware module', tag: 'Core', badge: 'v2.1' },
  { id: '2', title: 'Neural Canvas', subtitle: 'Generative shader', tag: 'WebGL', badge: 'New' },
  { id: '3', title: 'Haptic Rotary', subtitle: 'Dial encoder', tag: 'Analog' },
  { id: '4', title: 'Vector Oscilloscope', subtitle: 'Waveform telemetry', tag: 'Audio' },
  { id: '5', title: 'Kinetic Matrix', subtitle: 'Spring geometry', tag: 'Physics' },
  { id: '6', title: 'Quantum Telemetry', subtitle: 'Atomic clock sync', tag: 'Radio', badge: 'Pro' },
];

export function CarouselDemo() {
  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <CylindricalCarousel
        items={items}
        radius={360}
        cardWidth={220}
        cardHeight={300}
        snapToNearest={true}
        showControls={true}
      />
    </div>
  );
}`,
    rawSourceCode,
    rawCssCode,
    propsDoc: [
      {
        name: 'items',
        type: 'CylindricalCarouselItem[]',
        required: true,
        description: 'Array of items with title, subtitle, tag, badge, image, color, or custom content.',
      },
      {
        name: 'radius',
        type: 'number',
        defaultValue: '360',
        description: 'Virtual cylinder radius in pixels for 3D translateZ distance.',
      },
      {
        name: 'cardWidth',
        type: 'number',
        defaultValue: '220',
        description: 'Width of each card on the cylinder in pixels.',
      },
      {
        name: 'cardHeight',
        type: 'number',
        defaultValue: '300',
        description: 'Height of each card on the cylinder in pixels.',
      },
      {
        name: 'tiltAngle',
        type: 'number',
        defaultValue: '-4',
        description: 'Pitch angle in degrees to tilt the 3D cylinder towards or away from the viewer.',
      },
      {
        name: 'perspective',
        type: 'number',
        defaultValue: '1100',
        description: 'CSS 3D perspective distance in pixels.',
      },
      {
        name: 'autoplay',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Enable slow continuous rotation when idle, pausing on hover or drag.',
      },
      {
        name: 'autoplaySpeed',
        type: 'number',
        defaultValue: '8',
        description: 'Rotation speed in degrees per second when autoplay is enabled.',
      },
      {
        name: 'friction',
        type: 'number',
        defaultValue: '0.93',
        description: 'Momentum friction deceleration factor between 0.85 and 0.98.',
      },
      {
        name: 'snapToNearest',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Smoothly snap to the nearest card with cubic easing after drag inertia ends.',
      },
      {
        name: 'onActiveChange',
        type: '(index: number, item: CylindricalCarouselItem) => void',
        description: 'Callback fired whenever the active focused card in front changes.',
      },
      {
        name: 'showControls',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Show bottom floating capsule controls with previous/next buttons.',
      },
      {
        name: 'showIndicators',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Show active slide indicator dots in the bottom control pill.',
      },
      {
        name: 'showDragHint',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Show top drag hint instruction badge.',
      },
    ],
    accessibilityNotes: [
      'Container is accessible with role="region" and aria-roledescription="carousel".',
      'Each card is accessible with role="group", aria-roledescription="slide", and aria-current="true" when active.',
      'Keyboard navigation enabled: Left and Right arrow keys smoothly step between slides.',
      'Indicator tabs are marked with role="tablist" and role="tab" with aria-selected.',
      'Respects prefers-reduced-motion media query by disabling continuous animations and abrupt transitions.',
    ],
    features: [
      'True 3D perspective projection with CSS preserve-3d and geometric circular layout',
      'Pointer inertia momentum tossing with exponential friction deceleration physics',
      'Dynamic optical depth-of-field with progressive blur, opacity, and scale falloff',
      'Click-to-focus smooth spherical camera rotation with cubic-bezier easing',
      'Zero external 3D libraries (100% native React + CSS GPU acceleration)',
    ],
  };
