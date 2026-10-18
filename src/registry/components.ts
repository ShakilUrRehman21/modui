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
import radialOrbitHubSource from '../components/ui/radial-hub/RadialOrbitHub.tsx?raw';
import radialOrbitHubCss from '../components/ui/radial-hub/RadialOrbitHub.css?raw';
import fluidElasticAccordionSource from '../components/ui/accordion/FluidElasticAccordion.tsx?raw';
import fluidElasticAccordionCss from '../components/ui/accordion/FluidElasticAccordion.css?raw';
import beforeAfterSliderSource from '../components/ui/slider/BeforeAfterSlider.tsx?raw';
import beforeAfterSliderCss from '../components/ui/slider/BeforeAfterSlider.css?raw';
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
  {
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
    rawSourceCode: radialOrbitHubSource,
    rawCssCode: radialOrbitHubCss,
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
  },
  {
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
    rawSourceCode: fluidElasticAccordionSource,
    rawCssCode: fluidElasticAccordionCss,
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
  },
  {
    id: 'before-after-slider',
    slug: 'before-after-slider',
    name: 'Before-After Slider',
    description: 'Clean split comparison slider featuring smooth clip-path masking, tactile frosted glass handle, horizontal and vertical orientation, and center snap haptics.',
    category: '3D & Interactive Showcase',
    tags: ['slider', 'compare', 'before-after', 'split-view', 'clip-path', 'interactive', 'haptics'],
    status: 'published',
    publishedAt: '2026-10-18',
    updatedAt: '2026-10-18',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/slider/BeforeAfterSlider.tsx',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/slider/BeforeAfterSlider.tsx',
    installSnippet: `// 1. Copy BeforeAfterSlider.tsx and BeforeAfterSlider.css into your project:
// components/ui/slider/BeforeAfterSlider.tsx
// components/ui/slider/BeforeAfterSlider.css
// 2. Import into your application:
import { BeforeAfterSlider } from '@/components/ui/slider';`,
    codeSnippet: `import React from 'react';
import { BeforeAfterSlider } from '@/components/ui/slider';

export function SliderDemo() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <BeforeAfterSlider
        beforeLabel="Wireframe"
        afterLabel="Rendered"
        initialPosition={50}
        orientation="horizontal"
        variant="dark"
        showLabels={true}
        soundEnabled={true}
      />
    </div>
  );
}`,
    rawSourceCode: beforeAfterSliderSource,
    rawCssCode: beforeAfterSliderCss,
    propsDoc: [
      {
        name: 'beforeImage',
        type: 'string',
        description: 'Source URL for the before image (shown on the left/top side).',
      },
      {
        name: 'afterImage',
        type: 'string',
        description: 'Source URL for the after image (shown on the right/bottom side).',
      },
      {
        name: 'beforeNode',
        type: 'React.ReactNode',
        description: 'Custom React node rendered on the before side (overrides beforeImage).',
      },
      {
        name: 'afterNode',
        type: 'React.ReactNode',
        description: 'Custom React node rendered on the after side (overrides afterImage).',
      },
      {
        name: 'beforeLabel',
        type: 'string',
        defaultValue: "'Before'",
        description: 'Text badge displayed for the before view.',
      },
      {
        name: 'afterLabel',
        type: 'string',
        defaultValue: "'After'",
        description: 'Text badge displayed for the after view.',
      },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        defaultValue: "'horizontal'",
        description: 'Axis along which the slider splits and moves.',
      },
      {
        name: 'mode',
        type: "'drag' | 'hover' | 'both'",
        defaultValue: "'drag'",
        description: 'Interaction trigger: manual pointer dragging, effortless hover tracking, or both.',
      },
      {
        name: 'variant',
        type: "'dark' | 'glass' | 'minimal'",
        defaultValue: "'dark'",
        description: 'Visual skin token (Dark Obsidian, Frosted Glass, Minimal Monoline).',
      },
      {
        name: 'initialPosition',
        type: 'number',
        defaultValue: '50',
        description: 'Starting position of the divider handle (0 to 100 percentage).',
      },
      {
        name: 'position',
        type: 'number',
        description: 'Controlled divider position percentage (0 to 100).',
      },
      {
        name: 'showLabels',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Whether to show floating Before / After tactical badge tags.',
      },
      {
        name: 'soundEnabled',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Synthesizes an acoustic micro-tick click when passing the exact 50% midpoint.',
      },
      {
        name: 'aspectRatio',
        type: 'string',
        defaultValue: "'16 / 10'",
        description: 'CSS aspect-ratio constraint for the slider card.',
      },
      {
        name: 'onPositionChange',
        type: '(pos: number) => void',
        description: 'Callback reporting position changes in real time (0 to 100).',
      },
    ],
    accessibilityNotes: [
      'Accessible role="slider" with aria-valuenow, aria-valuemin, aria-valuemax, and descriptive aria-valuetext.',
      'Keyboard support: ArrowLeft / ArrowRight (or ArrowUp / ArrowDown) adjustments in 2% increments; Shift modifier increases jump to 10%.',
      'Home key snaps to 0%; End key snaps to 100%.',
      'Divider line and handle marked aria-hidden="true" to keep screen reader output clean.',
    ],
    features: [
      'Hardware-accelerated clip-path masking for subpixel split rendering',
      'Tactile frosted glass circular handle with ambient rotating dashed halo',
      'Laser glow divider hairline with specular neon reflection',
      'Synthetic Web Audio micro-haptic tick at the exact 50% midpoint',
      'Dual orientation: Horizontal split (left/right) vs Vertical split (top/bottom)',
      'Built-in high-fidelity blueprint wireframe and 3D caustic default vector scenes',
    ],
  },
];



