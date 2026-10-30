import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/dock/FloatingDock.tsx?raw';
import rawCssCode from '../../components/ui/dock/FloatingDock.css?raw';

export const floatingDockItem: ComponentRegistryItem = {
    id: 'floating-dock',
    slug: 'floating-dock',
    name: 'Tactile Floating Dock',
    description: 'macOS-inspired floating action dock featuring tactile icon hover lift, keyboard shortcuts, accessible ARIA roles, and luminous frosted glassmorphism.',
    category: '3D & Interactive Showcase',
    tags: ['dock', 'navigation', 'floating', 'tactile', 'glassmorphism', 'shortcuts'],
    status: 'published',
    publishedAt: '2026-10-15',
    updatedAt: '2026-10-15',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/dock/FloatingDock.tsx',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/dock/FloatingDock.tsx',
    installSnippet: `// 1. Copy FloatingDock.tsx and FloatingDock.css into your project:
// components/ui/dock/FloatingDock.tsx
// components/ui/dock/FloatingDock.css
// 2. Import into your application:
import { FloatingDock } from '@/components/ui/dock';`,
    codeSnippet: `import React from 'react';
import { FloatingDock } from '@/components/ui/dock';

export function DockDemo() {
  const dockItems = [
    {
      id: 'home',
      label: 'Home',
      shortcut: '⌘1',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: 'explore',
      label: 'Explore',
      shortcut: '⌘2',
      badge: 'New',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      ),
    },
    {
      id: 'projects',
      label: 'Projects',
      shortcut: '⌘3',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
          <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
          <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
        </svg>
      ),
    },
    {
      id: 'alerts',
      label: 'Alerts',
      shortcut: '⌘4',
      badge: 3,
      badgeVariant: 'count',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      shortcut: '⌘,',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 1rem' }}>
      <FloatingDock items={dockItems} variant="glass" />
    </div>
  );
}`,
    rawSourceCode,
    rawCssCode,
    propsDoc: [
      {
        name: 'items',
        type: 'DockItem[]',
        description: 'Array of dock items with id, label, icon, shortcut, badge, and onClick handler.',
        required: true,
      },
      {
        name: 'activeId',
        type: 'string',
        description: 'Controlled active item ID.',
      },
      {
        name: 'defaultActiveId',
        type: 'string',
        description: 'Initial active item ID for uncontrolled mode.',
      },
      {
        name: 'onSelect',
        type: '(id: string, item: DockItem) => void',
        description: 'Callback fired when an item is clicked or activated.',
      },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        defaultValue: "'horizontal'",
        description: 'Dock layout orientation.',
      },
      {
        name: 'magnification',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Enable smooth proximity distance-based magnification wave.',
      },
      {
        name: 'distance',
        type: 'number',
        defaultValue: '130',
        description: 'Pixel radius of cursor proximity influence for magnification.',
      },
      {
        name: 'maxScale',
        type: 'number',
        defaultValue: '1.45',
        description: 'Peak magnification scale factor of the hovered icon.',
      },
      {
        name: 'baseSize',
        type: 'number',
        defaultValue: '44',
        description: 'Base width/height dimension in pixels for dock item buttons.',
      },
      {
        name: 'variant',
        type: "'glass' | 'solid' | 'minimal' | 'dark'",
        defaultValue: "'glass'",
        description: 'Visual shell style of the floating dock container.',
      },
      {
        name: 'liquidIndicator',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Show elastic viscous background pill that stretches smoothly between items.',
      },
      {
        name: 'showTooltips',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Display animated floating tooltips with optional shortcut badges.',
      },
      {
        name: 'position',
        type: "'static' | 'bottom' | 'top'",
        defaultValue: "'static'",
        description: 'Dock placement mode (inline static or viewport fixed pinned).',
      },
    ],
    accessibilityNotes: [
      'Container is accessible with role="tablist" and aria-orientation.',
      'Each dock item is an accessible button with role="tab", aria-selected, and descriptive aria-label.',
      'Full keyboard navigation: ArrowRight / ArrowLeft / ArrowUp / ArrowDown step between tabs.',
      'Home and End keys quickly jump to the first and last dock items.',
      'Global keyboard shortcuts support: Command/Ctrl + key combinations instantly trigger mapped items.',
      'Honors prefers-reduced-motion media query by instantly positioning the active indicator and disabling continuous scaling.',
    ],
    features: [
      'Proximity-based continuous magnification curve with cosine falloff physics',
      'Viscous liquid morphing indicator that dynamically stretches in the direction of motion',
      'Tactile frosted glassmorphism with backdrop blur and luminous border highlights',
      'Interactive floating tooltips with keyboard shortcut hints and spring bounce',
      'Zero external dependencies (pure React, subpixel CSS GPU transforms, and native math)',
    ],
  };
