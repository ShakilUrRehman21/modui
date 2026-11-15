import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/magnetic-roll-split/MagneticRollSplitText.tsx?raw';
import rawCssCode from '../../components/ui/magnetic-roll-split/MagneticRollSplitText.css?raw';

export const magneticRollSplitTextItem: ComponentRegistryItem = {
  id: 'magnetic-roll-split-text',
  slug: 'magnetic-roll-split-text',
  name: 'Magnetic Roll Split Text',
  description:
    'Tactile 3D tumbling character drum array inspired by vintage mechanical departure split-flap displays and luxury editorial kinetic typography. Features staggered spring choreographies, duplicate face color inversions, and synthesized solenoid acoustics.',
  category: 'Typography & Motion',
  tags: [
    'typography',
    'kinetic',
    'split-flap',
    'roll',
    'editorial',
    '3d-drum',
    'stagger',
    'solenoid',
    'web-audio',
  ],
  status: 'published',
  publishedAt: '2026-11-15',
  updatedAt: '2026-11-15',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/magnetic-roll-split/MagneticRollSplitText.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/magnetic-roll-split/MagneticRollSplitText.tsx',
  installSnippet: `// 1. Copy MagneticRollSplitText.tsx and MagneticRollSplitText.css into your project:
import { MagneticRollSplitText } from '@/components/ui/magnetic-roll-split';`,
  codeSnippet: `import React from 'react';
import { MagneticRollSplitText } from '@/components/ui/magnetic-roll-split';

export function SplitRollDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <MagneticRollSplitText
        text={['RESONANCE', 'PRECISION', 'KINETIC UI']}
        variant="studio-light"
        choreography="wave"
        stagger={35}
        speed={480}
        soundEnabled={true}
      />
    </div>
  );
}`,
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'text',
      type: 'string | string[]',
      description: 'Target text string or array of phrases to cycle through.',
      required: true,
    },
    {
      name: 'variant',
      type: "'studio-light' | 'editorial-dark' | 'solenoid-amber' | 'cyber-cobalt'",
      defaultValue: "'studio-light'",
      description: 'Curated architectural finish variant.',
    },
    {
      name: 'choreography',
      type: "'wave' | 'center-out' | 'cascade' | 'random'",
      defaultValue: "'wave'",
      description: 'Stagger delay algorithm driving the character drum tumbling sequence.',
    },
    {
      name: 'stagger',
      type: 'number',
      defaultValue: '35',
      description: 'Delay between consecutive character rolls in milliseconds.',
    },
    {
      name: 'speed',
      type: 'number',
      defaultValue: '480',
      description: 'Animation duration of drum tumble in milliseconds.',
    },
    {
      name: 'direction',
      type: "'up' | 'down'",
      defaultValue: "'up'",
      description: 'Rotational drum roll direction.',
    },
    {
      name: 'trigger',
      type: "'hover' | 'click' | 'auto' | 'manual'",
      defaultValue: "'hover'",
      description: 'Event that triggers the split-roll animation.',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Enable synthesized mechanical split-flap solenoid sound feedback.',
    },
    {
      name: 'compact',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Scale down font size for thumbnail and catalog card stages.',
    },
    {
      name: 'onRollComplete',
      type: '(activeText: string) => void',
      description: 'Callback fired when all character drums complete tumble.',
    },
    {
      name: 'onRollRef',
      type: '(triggerFn: () => void) => void',
      description: 'Exposes imperative roll trigger function.',
    },
  ],
  features: [
    'Hardware-Accelerated 3D Drums: Individual character barrels rotating with perspective depth and smooth cubic-bezier easing.',
    '4 Curated Finishes: Studio Light, Editorial Dark, Solenoid Departure Amber, and Cyber Cobalt Phosphor.',
    '4 Stagger Choreographies: Wave, Center-Outward, Accelerated Cascade, and Organic Randomization.',
    'Synthesized Solenoid Acoustics: Zero-asset Web Audio mechanical clicks synthesized in real time with micro-pitch dispersion.',
    'Multi-Phrase Cycling: Seamlessly rotates through arrays of headline phrases on consecutive rolls.',
    'Word Wrapping Preservation: Groups characters into inline-block words to ensure natural typography breaks on responsive viewports.',
    'Accessible by Default: Fully readable by screen readers via hidden semantic text, with full keyboard Enter/Space activation.',
  ],
  accessibilityNotes: [
    'Renders with role="region" and a descriptive aria-label containing the active phrase.',
    'Includes an accessible .modui-split-sr-text element so assistive technology reads the phrase as a single word rather than fractured characters.',
    'Supports full keyboard triggering with Enter and Space keys, and respects prefers-reduced-motion.',
  ],
};
