import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/radial-hub/RadialOrbitHub.tsx?raw';
import rawCssCode from '../../components/ui/radial-hub/RadialOrbitHub.css?raw';

export const radialOrbitHubItem: ComponentRegistryItem = {
    id: 'radial-orbit-hub',
    slug: 'radial-orbit-hub',
    name: 'Radial Orbit Hub',
    description: 'Central tactile core that blossoms into an elastic circular spring wheel with rotational inertia, haptic sound synthesis, and multiple layout modes.',
    category: 'Buttons and Actions',
    tags: ['radial', 'orbit', 'wheel', 'elastic', 'spring', 'action-menu', 'haptics', 'inertia'],
    status: 'published',
    publishedAt: '2026-10-16',
    updatedAt: '2026-10-16',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/radial-hub/RadialOrbitHub.tsx',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/radial-hub/RadialOrbitHub.tsx',
    installSnippet: `// 1. Copy RadialOrbitHub.tsx and RadialOrbitHub.css into your project:
// components/ui/radial-hub/RadialOrbitHub.tsx
// components/ui/radial-hub/RadialOrbitHub.css
// 2. Import into your application:
import { RadialOrbitHub } from '@/components/ui/radial-hub';`,
    codeSnippet: `import React from 'react';
import { RadialOrbitHub } from '@/components/ui/radial-hub';

export function OrbitHubDemo() {
  const items = [
    {
      id: 'camera',
      label: 'Spatial Camera',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
      ),
      shortcut: '⌘C',
    },
    {
      id: 'palette',
      label: 'Theme Presets',
      badge: 'New',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
      ),
      shortcut: '⌘T',
    },
    {
      id: 'analytics',
      label: 'System Metrics',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      shortcut: '⌘M',
    },
    {
      id: 'share',
      label: 'Export Asset',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      ),
      shortcut: '⌘S',
    },
    {
      id: 'settings',
      label: 'Preferences',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      shortcut: '⌘,',
    },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
      <RadialOrbitHub items={items} radius={110} mode="circle" variant="glass" />
    </div>
  );
}`,
    rawSourceCode,
    rawCssCode,
    propsDoc: [
      {
        name: 'items',
        type: 'RadialOrbitItem[]',
        description: 'Array of satellite action nodes containing id, label, icon, shortcut, badge, and onClick handler.',
        required: true,
      },
      {
        name: 'radius',
        type: 'number',
        defaultValue: '110',
        description: 'Orbital radius distance from center hub in pixels.',
      },
      {
        name: 'mode',
        type: "'circle' | 'fan-top' | 'fan-right' | 'fan-bottom' | 'fan-left' | 'quarter'",
        defaultValue: "'circle'",
        description: 'Geometric distribution arc of the action nodes around the core.',
      },
      {
        name: 'variant',
        type: "'glass' | 'dark' | 'neon' | 'minimal'",
        defaultValue: "'glass'",
        description: 'Visual surface theme styling token.',
      },
      {
        name: 'enableRotation',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Allows dragging or swiping to spin the orbit ring with physics momentum and inertia damping.',
      },
      {
        name: 'soundEnabled',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Synthesizes synthetic Web Audio micro-haptic clicks upon expansion and node hover.',
      },
      {
        name: 'trigger',
        type: "'click' | 'hover'",
        defaultValue: "'click'",
        description: 'Interaction trigger for opening and collapsing the orbital satellites.',
      },
    ],
    accessibilityNotes: [
      'Core button uses aria-haspopup="menu" and dynamic aria-expanded state.',
      'Satellite nodes are accessible buttons with role="menuitem" and explicit labels.',
      'Keyboard navigation: ArrowRight / ArrowDown and ArrowLeft / ArrowUp traverse satellite nodes.',
      'Escape key collapses the open orbit and returns focus to the core trigger.',
      'Pure CSS transforms respect prefers-reduced-motion.',
    ],
    features: [
      'Elastic spring bloom with staggered mathematical delay coordinates',
      'Rotational inertia drag physics with friction damping',
      'Built-in Web Audio API micro-haptics (zero external audio file dependencies)',
      '6 orbital distribution modes (360° circle, 180° semi-circles, 90° corner)',
      'Counter-rotational stability keeping icons perfectly upright while spinning',
    ],
  };
