import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/prismatic-border-beam-button/PrismaticBorderBeamButton.tsx?raw';
import rawCssCode from '../../components/ui/prismatic-border-beam-button/PrismaticBorderBeamButton.css?raw';

export const prismaticBorderBeamButtonItem: ComponentRegistryItem = {
  id: 'prismatic-border-beam-button',
  slug: 'prismatic-border-beam-button',
  name: 'Prismatic Border Beam Button',
  description:
    'Flagship SaaS hero CTA featuring an orbiting @property conic-gradient prismatic energy beam, cursor-reactive specular glass spotlight, 3D magnetic tilt, radial click pulse rings, and synthesized Web Audio crystal chimes.',
  category: 'Buttons and Actions',
  tags: [
    'button',
    'cta',
    'border-beam',
    'prismatic',
    'conic-gradient',
    'magnetic',
    'spotlight',
    'hero',
    'haptics',
  ],
  status: 'published',
  publishedAt: '2026-11-27',
  updatedAt: '2026-11-27',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/prismatic-border-beam-button/PrismaticBorderBeamButton.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/prismatic-border-beam-button/PrismaticBorderBeamButton.tsx',
  installSnippet: `// 1. Copy PrismaticBorderBeamButton.tsx and PrismaticBorderBeamButton.css into your project:
import { PrismaticBorderBeamButton } from '@/components/ui/prismatic-border-beam-button';`,
  codeSnippet: `import React, { useRef } from 'react';
import {
  PrismaticBorderBeamButton,
  type PrismaticBorderBeamButtonHandle,
} from '@/components/ui/prismatic-border-beam-button';

export function HeroCallToAction() {
  const btnRef = useRef<PrismaticBorderBeamButtonHandle>(null);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
      <PrismaticBorderBeamButton
        ref={btnRef}
        variant="obsidian-prism"
        size="lg"
        beamDuration={3.2}
        soundEnabled={true}
        onClick={() => console.log('Launched!')}
      >
        Launch Workspace
      </PrismaticBorderBeamButton>
    </div>
  );
}`,
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'children',
      type: 'React.ReactNode',
      defaultValue: "'Launch Workspace'",
      description: 'Button label content.',
    },
    {
      name: 'variant',
      type: "'obsidian-prism' | 'porcelain-aurora' | 'cyber-flare' | 'solar-gold'",
      defaultValue: "'obsidian-prism'",
      description: 'Surface material and prismatic beam color spectrum.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: 'Capsule padding and typography scale.',
    },
    {
      name: 'beamDuration',
      type: 'number',
      defaultValue: '3.2',
      description: 'Orbital duration of the conic-gradient border beam in seconds.',
    },
    {
      name: 'magnetic',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Enables 3D perspective magnetic tilt toward the pointer.',
    },
    {
      name: 'spotlight',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Enables cursor-reactive radial specular sheen across the button surface.',
    },
    {
      name: 'loading',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Displays an inline spinner, accelerates beam speed, and sets aria-busy.',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Plays a synthesized Web Audio crystal chime on click.',
    },
    {
      name: 'compact',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Compact mode tailored for Explorer catalog cards.',
    },
  ],
  features: [
    'Orbiting @property Border Beam: Smooth GPU-accelerated conic-gradient energy beam tracing the pill rim.',
    'Specular Glass Spotlight: Cursor-tracked radial sheen glides across the inner rim surface.',
    '3D Magnetic Tilt: Subtle perspective pitch and yaw response following pointer position.',
    'Click Pulse Ring & Async Loading: Expanding halo wave on click plus accelerated beam during loading.',
    'Four Production Colorways: Obsidian Prism, Porcelain Aurora, Cyber Flare, and Solar Gold.',
    'Zero External Dependencies: Pure standard CSS custom properties and React 19 forwardRef handle.',
  ],
  accessibilityNotes: [
    'Built on a native <button> element with full keyboard focus ring and aria-busy support during loading.',
    'Decorative icons, spotlight layers, and pulse rings are marked aria-hidden="true".',
    'Respects prefers-reduced-motion media query by halting beam orbit and pulse animations.',
  ],
};
