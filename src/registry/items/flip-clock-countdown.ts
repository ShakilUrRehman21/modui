import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/flip-clock/FlipClockCountdown.tsx?raw';
import rawCssCode from '../../components/ui/flip-clock/FlipClockCountdown.css?raw';

export const flipClockCountdownItem: ComponentRegistryItem = {
  id: 'flip-clock-countdown',
  slug: 'flip-clock-countdown',
  name: 'Flip Clock Countdown',
  description:
    '3D mechanical split-flap event countdown timer and precision clock. Features authentic folding leaf physics, realistic center axle hinge pins, perspective drop shadows, and synthesized Web Audio acoustic clacks.',
  category: '3D & Interactive Showcase',
  tags: [
    'flip-clock',
    'split-flap',
    'countdown',
    'timer',
    'clock',
    '3d-transforms',
    'mechanical',
    'haptics',
    'landing-page',
    'showcase',
  ],
  status: 'published',
  publishedAt: '2026-11-19',
  updatedAt: '2026-11-19',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/flip-clock/FlipClockCountdown.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/flip-clock/FlipClockCountdown.tsx',
  installSnippet: `// 1. Copy FlipClockCountdown.tsx and FlipClockCountdown.css into your project:
import { FlipClockCountdown } from '@/components/ui/flip-clock';`,
  codeSnippet: `import React from 'react';
import { FlipClockCountdown } from '@/components/ui/flip-clock';

export function LaunchHeroCountdown() {
  // Target: 7 days from now
  const launchDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
      <FlipClockCountdown
        targetDate={launchDate}
        variant="dark-monolith"
        size="md"
        soundEnabled={true}
        onComplete={() => alert('Launch time has arrived!')}
      />
    </div>
  );
}`,
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'targetDate',
      type: 'Date | string | number',
      description:
        'Target date or ISO timestamp for countdown mode (defaults to 4 days, 18h, 42m from mount).',
    },
    {
      name: 'mode',
      type: "'countdown' | 'clock' | 'stopwatch'",
      defaultValue: "'countdown'",
      description:
        'Operating mode: countdown to targetDate, real-time local clock, or stopwatch.',
    },
    {
      name: 'variant',
      type: "'dark-monolith' | 'brass-vintage' | 'clean-porcelain' | 'cyber-terminal'",
      defaultValue: "'dark-monolith'",
      description: 'Chassis material theme and colorway.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: 'Physical scale sizing preset.',
    },
    {
      name: 'showDays',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Whether to render the Days unit (automatically hidden in clock mode).',
    },
    {
      name: 'showHours',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Whether to render the Hours unit.',
    },
    {
      name: 'showMinutes',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Whether to render the Minutes unit.',
    },
    {
      name: 'showSeconds',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Whether to render the Seconds unit.',
    },
    {
      name: 'showLabels',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Whether to render unit name labels (Days, Hours, Minutes, Seconds).',
    },
    {
      name: 'labels',
      type: 'FlipClockLabels',
      description:
        'Custom localized label strings for Days, Hours, Minutes, and Seconds.',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Synthesizes authentic mechanical split-flap clack acoustics via native Web Audio API.',
    },
    {
      name: 'onTick',
      type: '(remaining: RemainingTime) => void',
      description: 'Callback fired on every 1-second interval tick.',
    },
    {
      name: 'onComplete',
      type: '() => void',
      description: 'Callback fired when countdown reaches zero.',
    },
  ],
  accessibilityNotes: [
    'Renders as semantic role="timer" with aria-live="polite" for screen reader announcements.',
    'Provides descriptive aria-label with full sentence breakdown (e.g. "Countdown: 04 Days, 18 Hours, 42 Minutes, 19 Seconds").',
    'Visual colon separators and hinge accents are marked aria-hidden="true".',
    'Supports high contrast mode across dark and light palettes.',
  ],
  features: [
    'Physical 4-leaf 3D split-flap rotation with perspective and authentic drop shadows',
    'Mechanical axle divider with left/right stamped metal hinge pins',
    '3 operational modes: Event Countdown, Real-Time Local Clock, and Stopwatch',
    '4 crafted material finishes: Dark Monolith, Brass Vintage, Clean Porcelain, Cyber Terminal',
    '3 sizing presets: Small (compact embeds), Medium (standard hero), Large (billboard displays)',
    'Synthesized Web Audio API mechanical clack haptics (zero external audio files)',
    'Full internationalization support for custom unit labels',
  ],
};
