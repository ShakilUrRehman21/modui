import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/slider/BeforeAfterSlider.tsx?raw';
import rawCssCode from '../../components/ui/slider/BeforeAfterSlider.css?raw';

export const beforeAfterSliderItem: ComponentRegistryItem = {
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
    rawSourceCode,
    rawCssCode,
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
  };
