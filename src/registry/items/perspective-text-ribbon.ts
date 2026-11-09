import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/perspective-text/PerspectiveTextRibbon.tsx?raw';
import rawCssCode from '../../components/ui/perspective-text/PerspectiveTextRibbon.css?raw';

export const perspectiveTextRibbonItem: ComponentRegistryItem = {
  id: 'perspective-text-ribbon',
  slug: 'perspective-text-ribbon',
  name: '3D Perspective Text Ribbon',
  description:
    'Hardware-accelerated 3D kinetic typography marquee streaming across multi-axis spatial perspective coordinates with mouse drag momentum scrub physics, customizable 3D orientation presets, alternating stroke/fill typographic treatments, synthesized audio tick haptics, and complete Light/Dark theme adaptation.',
  category: 'Typography & Motion',
  tags: [
    '3D Perspective',
    'Typography',
    'Text Ribbon',
    'Kinetic Marquee',
    'Momentum Scrub',
    'Spatial Architecture',
    'Stroke Fill',
    'Hardware Compositing',
    'Web Audio DSP',
  ],
  status: 'published',
  publishedAt: '2026-11-09',
  updatedAt: '2026-11-09',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/perspective-text/PerspectiveTextRibbon.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/tree/main/src/components/ui/perspective-text',
  codeSnippet: `import { PerspectiveTextRibbon } from '@/components/ui/perspective-text';

export function PerspectiveRibbonDemo() {
  return (
    <PerspectiveTextRibbon
      orientation="dynamic-angle"
      variant="cyber-indigo"
      speed={1.2}
      direction="forward"
      interactiveScrub={true}
      soundEnabled={true}
    />
  );
}`,
  installSnippet: 'npm install react react-dom',
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'items',
      type: '(string | RibbonItem)[]',
      defaultValue: 'DEFAULT_RIBBON_ITEMS',
      description: 'Array of string tokens or rich ribbon items with custom styles, badges, and separators.',
    },
    {
      name: 'orientation',
      type: "'dynamic-angle' | 'cylindrical-arch' | 'floating-horizon' | 'isometric-helix'",
      defaultValue: "'dynamic-angle'",
      description: '3D perspective orientation preset styling the spatial tilt and viewing angle.',
    },
    {
      name: 'variant',
      type: "'cyber-indigo' | 'matrix-emerald' | 'solar-flame' | 'monochrome'",
      defaultValue: "'cyber-indigo'",
      description: 'Chromatic color theme styling accent letterforms, borders, and ambient glow.',
    },
    {
      name: 'theme',
      type: "'auto' | 'light' | 'dark'",
      defaultValue: "'auto'",
      description: 'Theme mode automatically synchronized with document theme or locked to explicit mode.',
    },
    {
      name: 'speed',
      type: 'number',
      defaultValue: '1.2',
      description: 'Base auto-drift velocity speed in pixels per frame.',
    },
    {
      name: 'direction',
      type: "'forward' | 'reverse'",
      defaultValue: "'forward'",
      description: 'Horizontal streaming direction of the kinetic typography ribbon.',
    },
    {
      name: 'pauseOnHover',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Temporarily pauses continuous marquee drift when cursor hovers over the 3D viewport.',
    },
    {
      name: 'interactiveScrub',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Enables pointer drag tracking with momentum release and natural friction damping.',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Synthesizes mechanical audio tick haptics via Web Audio DSP on high-velocity scrub.',
    },
    {
      name: 'compact',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Compact card preview mode hiding HUD bars and toolbars for thumbnail displays.',
    },
    {
      name: 'onVelocityChange',
      type: '(velocity: number) => void',
      defaultValue: 'undefined',
      description: 'Callback fired whenever the ribbon velocity changes during interactive scrubbing.',
    },
  ],
  features: [
    'True 3D Spatial Perspective: Hardware-composited 3D viewport with multi-axis Euler angles and depth projection',
    '4 Spatial Presets: Dynamic Angle, Cylindrical Arch, Floating Horizon, and Isometric Helix',
    'Momentum Fling Physics: Pointer drag tracking with fling velocity and smooth friction decay',
    'Alternating Typographic Styling: Automatic or manual solid fills, transparent sub-pixel strokes, and chromatic glowing accents',
    'Web Audio Tick Haptics: High-frequency mechanical micro-ticks synthesized in-browser on rapid scrubbing',
    'Seamless Infinite Wrap: Tripled repeating tracks mathematically cycling without seams or layout glitches',
    'Light & Dark Theme Adaptation: Dedicated high-contrast styling for both porcelain light mode and obsidian dark mode',
    'Full Accessibility: ARIA region, live screen reader text summary, and Arrow key keyboard scrub controls',
  ],
  accessibilityNotes: [
    'ARIA role="region" with dynamic aria-labelledby announcing full ribbon text stream',
    'Keyboard navigation: ArrowLeft and ArrowRight scrub the marquee; Spacebar pauses and resumes drift',
    'Orientation buttons implemented with role="tablist" and role="tab" with explicit aria-selected states',
    'Supports prefers-reduced-motion by freezing continuous drift while preserving manual scrub',
  ],
};

