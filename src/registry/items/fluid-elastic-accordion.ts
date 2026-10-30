import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/accordion/FluidElasticAccordion.tsx?raw';
import rawCssCode from '../../components/ui/accordion/FluidElasticAccordion.css?raw';

export const fluidElasticAccordionItem: ComponentRegistryItem = {
    id: 'fluid-elastic-accordion',
    slug: 'fluid-elastic-accordion',
    name: 'Fluid Elastic Accordion',
    description: 'Multi-panel media accordion featuring non-linear spring expansion, interactive liquid bezier edge deformation, Web Audio haptics, and dual orientation.',
    category: '3D & Interactive Showcase',
    tags: ['accordion', 'elastic', 'spring', 'liquid', 'filmstrip', 'showcase', 'physics', 'interactive'],
    status: 'published',
    publishedAt: '2026-10-17',
    updatedAt: '2026-10-17',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/accordion/FluidElasticAccordion.tsx',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/accordion/FluidElasticAccordion.tsx',
    installSnippet: `// 1. Copy FluidElasticAccordion.tsx and FluidElasticAccordion.css into your project:
// components/ui/accordion/FluidElasticAccordion.tsx
// components/ui/accordion/FluidElasticAccordion.css
// 2. Import into your application:
import { FluidElasticAccordion } from '@/components/ui/accordion';`,
    codeSnippet: `import React from 'react';
import { FluidElasticAccordion } from '@/components/ui/accordion';

const items = [
  {
    id: '1',
    number: '01',
    title: 'Spatial Studio',
    subtitle: 'Volumetric Canvas',
    description: 'Real-time raymarching engine powered by WebGL 2.0 with custom sub-surface shaders and volumetric caustics.',
    tag: 'Engine',
    color: '#4F46E5',
    actionText: 'Explore Engine',
  },
  {
    id: '2',
    number: '02',
    title: 'Haptic Rotary',
    subtitle: 'Kinetic Dial',
    description: 'Hardware-grade brushed aluminum rotary controller with rotational momentum and synthesized Web Audio ticks.',
    tag: 'Control',
    color: '#06B6D4',
    actionText: 'Inspect Specs',
  },
  {
    id: '3',
    number: '03',
    title: 'Neural Matrix',
    subtitle: 'Adaptive Physics',
    description: 'Dynamic spring-inertia mesh with liquid edge boundary deformation responding to cursor velocity.',
    tag: 'Compute',
    color: '#10B981',
    actionText: 'View Architecture',
  },
  {
    id: '4',
    number: '04',
    title: 'Quantum Scope',
    subtitle: 'Telemetry Pulse',
    description: 'Low-latency streaming graphs rendering high-frequency waveforms at 120 FPS.',
    tag: 'Telemetry',
    color: '#F59E0B',
    actionText: 'Launch Monitor',
  },
];

export function AccordionDemo() {
  return (
    <FluidElasticAccordion
      items={items}
      defaultActiveId="1"
      orientation="horizontal"
      variant="dark"
      springTension="elastic"
      enableLiquidEdge={true}
    />
  );
}`,
    rawSourceCode,
    rawCssCode,
    propsDoc: [
      {
        name: 'items',
        type: 'FluidAccordionItem[]',
        description: 'Array of accordion panel objects with id, title, subtitle, description, tag, color, image, and action callback.',
        required: true,
      },
      {
        name: 'defaultActiveId',
        type: 'string',
        defaultValue: 'items[0].id',
        description: 'The id of the initially expanded panel.',
      },
      {
        name: 'activeId',
        type: 'string',
        description: 'Controlled active panel id.',
      },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        defaultValue: "'horizontal'",
        description: 'Layout axis: horizontal filmstrip or vertical stacked cards.',
      },
      {
        name: 'variant',
        type: "'dark' | 'glass' | 'editorial' | 'minimal'",
        defaultValue: "'dark'",
        description: 'Visual skin token (Obsidian Dark, Frosted Glass, Warm Editorial, Minimal Monochrome).',
      },
      {
        name: 'trigger',
        type: "'click' | 'hover'",
        defaultValue: "'click'",
        description: 'User interaction that activates and expands a panel.',
      },
      {
        name: 'springTension',
        type: "'gentle' | 'snappy' | 'elastic'",
        defaultValue: "'elastic'",
        description: 'Physics spring curve controlling panel expansion elasticity and bounce.',
      },
      {
        name: 'soundEnabled',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Synthesizes acoustic Web Audio micro-haptics when expanding panels.',
      },
      {
        name: 'enableLiquidEdge',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Renders dynamic SVG bezier curve along panel boundary flexing under transition velocity.',
      },
      {
        name: 'expandedRatio',
        type: 'number',
        defaultValue: '3.4',
        description: 'Proportion ratio of the active expanded panel compared to collapsed panels.',
      },
      {
        name: 'onActiveChange',
        type: '(id: string, item: FluidAccordionItem) => void',
        description: 'Callback fired when a new panel becomes active.',
      },
    ],
    accessibilityNotes: [
      'Container acts as role="tablist" with aria-orientation.',
      'Individual panels are tab-focusable buttons with role="tab", aria-selected, and aria-expanded.',
      'Expanded content canvas marked with role="tabpanel" and linked via aria-controls.',
      'Full keyboard navigation: ArrowRight / ArrowDown and ArrowLeft / ArrowUp cycle through panels; Home and End jump to extremities.',
      'Pure CSS transitions automatically respect prefers-reduced-motion media query.',
    ],
    features: [
      'Non-linear spring expansion physics with cubic-bezier inertia',
      'Dynamic SVG liquid bezier edge flexing under velocity momentum',
      'Dual orientation: Horizontal filmstrip vs vertical card stack',
      '4 curated visual variants: Dark Obsidian, Frosted Glass, Warm Editorial, Minimal',
      'Built-in Web Audio micro-haptic synthesized sound (zero audio files needed)',
      'Touch drag & hover glide trigger support',
    ],
  };
