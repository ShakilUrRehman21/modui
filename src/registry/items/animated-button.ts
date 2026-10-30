import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/button/AnimatedButton.tsx?raw';
import rawCssCode from '../../components/ui/button/AnimatedButton.css?raw';

export const animatedButtonItem: ComponentRegistryItem = {
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
    rawSourceCode,
    rawCssCode,
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
  };
