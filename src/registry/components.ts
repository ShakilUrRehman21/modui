// Component Raw Source & CSS Imports (Vite compile-time string imports)
import animatedButtonSource from '../components/ui/button/AnimatedButton.tsx?raw';
import animatedButtonCss from '../components/ui/button/AnimatedButton.css?raw';
import badgeSource from '../components/ui/badge/Badge.tsx?raw';
import badgeCss from '../components/ui/badge/Badge.css?raw';
import kineticTextSource from '../components/ui/motion/KineticText.tsx?raw';
import kineticTextCss from '../components/ui/motion/KineticText.css?raw';
import numberTickerSource from '../components/ui/counter/NumberTicker.tsx?raw';
import numberTickerCss from '../components/ui/counter/NumberTicker.css?raw';
import cylindricalCarouselSource from '../components/ui/carousel/CylindricalCarousel.tsx?raw';
import cylindricalCarouselCss from '../components/ui/carousel/CylindricalCarousel.css?raw';
import floatingDockSource from '../components/ui/dock/FloatingDock.tsx?raw';
import floatingDockCss from '../components/ui/dock/FloatingDock.css?raw';
export type ComponentCategory =
  | 'Buttons and Actions'
  | 'Status & Indicators'
  | 'Typography & Motion'
  | '3D & Interactive Showcase';

export type ComponentStatus = 'published' | 'in-progress';

export interface ComponentPropDoc {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
  required?: boolean;
}

export interface ComponentRegistryItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ComponentCategory;
  tags: string[];
  status: ComponentStatus;
  publishedAt?: string;
  updatedAt?: string;
  version: string;
  sourceLocation: string;
  githubUrl: string;
  codeSnippet: string;
  installSnippet: string;
  rawSourceCode: string;
  rawCssCode: string;
  propsDoc: ComponentPropDoc[];
  accessibilityNotes: string[];
  features: string[];
}

export const COMPONENT_CATEGORIES: ComponentCategory[] = [
  'Buttons and Actions',
  'Status & Indicators',
  'Typography & Motion',
  '3D & Interactive Showcase',
];

export const COMPONENT_REGISTRY: ComponentRegistryItem[] = [
  {
    id: 'animated-button',
    slug: 'animated-button',
    name: 'Animated Button',
    description: 'Polished button component with micro-interactions including shimmer sheen, magnetic pull, click ripples, glowing borders, and icon slides.',
    category: 'Buttons and Actions',
    tags: ['button', 'interaction', 'shimmer', 'ripple', 'magnetic', 'micro-interactions'],
    status: 'published',
    publishedAt: '2026-10-10',
    updatedAt: '2026-10-11',
    version: '1.2.0',
    sourceLocation: 'src/components/ui/button/AnimatedButton.tsx',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/button/AnimatedButton.tsx',
    installSnippet: `// 1. Copy AnimatedButton.tsx and AnimatedButton.css into your project:
// components/ui/button/AnimatedButton.tsx
// components/ui/button/AnimatedButton.css
// 2. Import into your application:
import { AnimatedButton } from '@/components/ui/button';`,
    codeSnippet: `import React from 'react';
import { AnimatedButton } from '@/components/ui/button';

export function ButtonShowcase() {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {/* Shimmer sweep effect */}
      <AnimatedButton variant="shimmer">
        Get Started
      </AnimatedButton>

      {/* Perimeter pulse glow */}
      <AnimatedButton variant="glow">
        Launch Project
      </AnimatedButton>

      {/* Click-origin radial ripple */}
      <AnimatedButton variant="ripple">
        Interactive Ripple
      </AnimatedButton>

      {/* Magnetic physics attraction */}
      <AnimatedButton variant="magnetic">
        Hover Magnetic
      </AnimatedButton>

      {/* Trailing icon slide */}
      <AnimatedButton variant="slide" iconRight={<ArrowRight size={16} />}>
        Explore Components
      </AnimatedButton>

      {/* Dynamic spinning gradient border */}
      <AnimatedButton variant="gradient-border">
        Special Edition
      </AnimatedButton>
    </div>
  );
}`,
    rawSourceCode: animatedButtonSource,
    rawCssCode: animatedButtonCss,
    propsDoc: [
      {
        name: 'variant',
        type: "'shimmer' | 'glow' | 'ripple' | 'magnetic' | 'slide' | 'gradient-border' | 'minimal'",
        defaultValue: "'shimmer'",
        description: 'Visual animation style and interactive behavior mode.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: 'Dimension scale of the button (heights: 32px, 40px, 48px).',
      },
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Renders an accessible loading spinner and disables user interaction.',
      },
      {
        name: 'loadingText',
        type: 'string',
        defaultValue: 'undefined',
        description: 'Optional label override displayed during the loading state.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Disables button interactions and applies muted visual state.',
      },
      {
        name: 'icon',
        type: 'ReactNode',
        defaultValue: 'undefined',
        description: 'Icon element rendered before the button label.',
      },
      {
        name: 'iconRight',
        type: 'ReactNode',
        defaultValue: 'undefined',
        description: 'Icon element rendered after the button label.',
      },
      {
        name: 'fullWidth',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Expands button to fill 100% of parent width.',
      },
    ],
    accessibilityNotes: [
      'Semantic <button> element with full keyboard operability (Tab, Enter, Space).',
      'Provides aria-disabled="true" when disabled.',
      'Provides aria-busy="true" during active loading states.',
      'High-contrast focus-visible ring adhering to WCAG 2.1 AA standards.',
    ],
    features: [
      '7 bespoke animation variants with zero external motion dependencies',
      'Pure CSS micro-animations & physics-inspired magnetic tracking',
      'Click-origin canvas ripple calculation',
      'Seamless dark & light mode token integration',
    ],
  },
  {
    id: 'badge',
    slug: 'badge',
    name: 'Pulse Badge',
    description: 'Tactile status indicators and pill badges with breathing ambient pulse auras, icon slots, and semantic color tokens.',
    category: 'Status & Indicators',
    tags: ['badge', 'status', 'pulse', 'indicator', 'pill', 'aura'],
    status: 'published',
    publishedAt: '2026-10-11',
    updatedAt: '2026-10-11',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/badge/Badge.tsx',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/badge/Badge.tsx',
    installSnippet: `// 1. Copy Badge.tsx and Badge.css into your project:
import { Badge } from '@/components/ui/badge';`,
    codeSnippet: `import React from 'react';
import { Badge } from '@/components/ui/badge';

export function BadgeShowcase() {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="accent" dot pulse>Live Pulse</Badge>
      <Badge variant="success" dot>Operational</Badge>
      <Badge variant="cyan">React 19</Badge>
      <Badge variant="default">Pure CSS</Badge>
    </div>
  );
}`,
    rawSourceCode: badgeSource,
    rawCssCode: badgeCss,
    propsDoc: [
      {
        name: 'variant',
        type: "'default' | 'accent' | 'success' | 'warning' | 'cyan'",
        defaultValue: "'default'",
        description: 'Semantic surface and color token styling.',
      },
      {
        name: 'dot',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Displays a live indicator circle dot.',
      },
      {
        name: 'pulse',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Adds breathing radial pulse keyframe wave around the dot.',
      },
      {
        name: 'icon',
        type: 'React.ReactNode',
        defaultValue: 'undefined',
        description: 'Optional leading icon slot.',
      },
    ],
    accessibilityNotes: [
      'Pure semantic text pill with optional aria-hidden decorative pulse beacon.',
      'Meets WCAG AA contrast standards across all variants.',
    ],
    features: [
      'Lightweight React & CSS keyframes',
      'Smooth breathing pulse radar beacon',
      'Compact & responsive token-driven colors',
    ],
  },
  {
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
    rawSourceCode: kineticTextSource,
    rawCssCode: kineticTextCss,
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
  },
  {
    id: 'number-ticker',
    slug: 'number-ticker',
    name: 'Number Ticker',
    description: 'Smooth vertical slot-machine rolling number counter with spring physics, individual column staggering, tabular numerals, and prefix/suffix formatting.',
    category: 'Typography & Motion',
    tags: ['counter', 'ticker', 'odometer', 'motion', 'spring', 'typography', 'numbers'],
    status: 'published',
    publishedAt: '2026-10-13',
    updatedAt: '2026-10-13',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/counter/NumberTicker.tsx',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/counter/NumberTicker.tsx',
    installSnippet: `// 1. Copy NumberTicker.tsx and NumberTicker.css into your project:
// components/ui/counter/NumberTicker.tsx
// components/ui/counter/NumberTicker.css

import { NumberTicker } from './components/ui/counter/NumberTicker';

export default function Example() {
  return (
    <div style={{ fontSize: '3rem', fontWeight: 700 }}>
      <NumberTicker value={1420} prefix="$" suffix="/mo" />
    </div>
  );
}`,
    codeSnippet: `import { NumberTicker } from './components/ui/counter/NumberTicker';

export function MetricsShowcase() {
  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <span className="metric-label">Monthly Active Users</span>
        <NumberTicker
          value={84250}
          suffix="+"
          duration={1.4}
        />
      </div>

      <div className="metric-card">
        <span className="metric-label">Uptime Reliability</span>
        <NumberTicker
          value={99.98}
          decimalPlaces={2}
          suffix="%"
          duration={1.2}
        />
      </div>

      <div className="metric-card">
        <span className="metric-label">Annual Recurring Revenue</span>
        <NumberTicker
          value={1240}
          prefix="$"
          suffix="k"
          duration={1.5}
        />
      </div>
    </div>
  );
}`,
    rawSourceCode: numberTickerSource,
    rawCssCode: numberTickerCss,
    propsDoc: [
      {
        name: 'value',
        type: 'number',
        description: 'Target numerical value to roll to.',
        required: true,
      },
      {
        name: 'decimalPlaces',
        type: 'number',
        defaultValue: '0',
        description: 'Number of decimal places to format and display.',
      },
      {
        name: 'prefix',
        type: 'string',
        defaultValue: "''",
        description: 'Text or symbol prepended before numbers (e.g. $, +).',
      },
      {
        name: 'suffix',
        type: 'string',
        defaultValue: "''",
        description: 'Text or symbol appended after numbers (e.g. %, k, /mo).',
      },
      {
        name: 'duration',
        type: 'number',
        defaultValue: '1.2',
        description: 'Animation roll duration in seconds.',
      },
      {
        name: 'delay',
        type: 'number',
        defaultValue: '0',
        description: 'Delay in seconds before roll begins.',
      },
      {
        name: 'stagger',
        type: 'number',
        defaultValue: '0.04',
        description: 'Per-digit column stagger interval in seconds.',
      },
    ],
    accessibilityNotes: [
      'Accessible screen-reader readout container with role="status" and aria-live="polite".',
      'Visual rolling digits marked with aria-hidden="true" to prevent redundant character readings.',
      'Respects prefers-reduced-motion media query by disabling animation transitions.',
      'Strict tabular figures (font-variant-numeric: tabular-nums) eliminate layout shift and horizontal jank.',
    ],
    features: [
      'Individual slot-machine vertical roll strips for every digit 0-9',
      'Physics-based cubic-bezier(0.16, 1, 0.3, 1) spring deceleration',
      'Thousands comma separation with fractional precision support',
      'Zero external runtime dependencies (Pure React 19 + CSS)',
    ],
  },
  {
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
    rawSourceCode: cylindricalCarouselSource,
    rawCssCode: cylindricalCarouselCss,
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
  },
  {
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
    rawSourceCode: floatingDockSource,
    rawCssCode: floatingDockCss,
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
  },
];
