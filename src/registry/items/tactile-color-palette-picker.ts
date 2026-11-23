import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/color-palette-picker/TactileColorPalettePicker.tsx?raw';
import rawCssCode from '../../components/ui/color-palette-picker/TactileColorPalettePicker.css?raw';

export const tactileColorPalettePickerItem: ComponentRegistryItem = {
  id: 'tactile-color-palette-picker',
  slug: 'tactile-color-palette-picker',
  name: 'Tactile Color Palette Picker',
  description:
    'Interactive chromatic token studio and mathematical color harmony generator featuring high-precision polar wheel scrubbing, live WCAG AA/AAA contrast telemetry, CSS custom property tokens, and synthesized micro-detent acoustics.',
  category: 'Buttons and Actions',
  tags: [
    'color',
    'palette',
    'picker',
    'chromatic',
    'hsl',
    'wcag',
    'contrast',
    'token',
    'design-tokens',
    'harmonies',
    'haptics',
  ],
  status: 'published',
  publishedAt: '2026-11-23',
  updatedAt: '2026-11-23',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/color-palette-picker/TactileColorPalettePicker.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/color-palette-picker/TactileColorPalettePicker.tsx',
  installSnippet: `// 1. Copy TactileColorPalettePicker.tsx and TactileColorPalettePicker.css into your project:
import { TactileColorPalettePicker } from '@/components/ui/color-palette-picker';`,
  codeSnippet: `import React, { useRef } from 'react';
import {
  TactileColorPalettePicker,
  type TactileColorPalettePickerHandle,
  type PaletteHarmony,
} from '@/components/ui/color-palette-picker';

export function BrandColorStudio() {
  const pickerRef = useRef<TactileColorPalettePickerHandle>(null);

  const handleCopy = (tokens: string) => {
    console.log('Copied Design System Tokens:', tokens);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
      <TactileColorPalettePicker
        ref={pickerRef}
        variant="studio-obsidian"
        harmony="triadic"
        initialHue={217}
        initialSaturation={0.88}
        soundEnabled={true}
        onCopyToken={handleCopy}
      />
    </div>
  );
}`,
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'initialHue',
      type: 'number',
      defaultValue: '217',
      description: 'Initial color hue in degrees (0 to 360).',
    },
    {
      name: 'initialSaturation',
      type: 'number',
      defaultValue: '0.88',
      description: 'Initial radial saturation ratio (0 to 1).',
    },
    {
      name: 'initialLightness',
      type: 'number',
      defaultValue: '0.52',
      description: 'Initial lightness ratio for chromatic swatches (0 to 1).',
    },
    {
      name: 'harmony',
      type: "'triadic' | 'complementary' | 'analogous' | 'split-complementary' | 'tetradic' | 'monochromatic'",
      defaultValue: "'triadic'",
      description: 'Active mathematical color harmony rule.',
    },
    {
      name: 'variant',
      type: "'studio-obsidian' | 'clean-porcelain' | 'cyber-matrix' | 'warm-editorial'",
      defaultValue: "'studio-obsidian'",
      description: 'Chassis material theme and colorway.',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Enables native Web Audio API micro-detent feedback clicks and chimes.',
    },
    {
      name: 'compact',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Compact scaled view mode suitable for embedded preview cards.',
    },
    {
      name: 'onChange',
      type: '(palette: { primary: ColorSwatch; harmonies: ColorSwatch[]; cssToken: string }) => void',
      defaultValue: 'undefined',
      description: 'Callback fired whenever hue, saturation, or harmony changes.',
    },
    {
      name: 'onCopyToken',
      type: '(token: string) => void',
      defaultValue: 'undefined',
      description: 'Callback fired when an individual swatch or CSS tokens snippet is copied.',
    },
  ],
  features: [
    'Polar Color Wheel Scrubbing: Continuous polar coordinate mapping (hue angle & radial saturation).',
    'Mathematical Harmonies: Real-time generation of Triadic, Complementary, Analogous, Split-Complementary, Tetradic, and Monochromatic sets.',
    'Satellite Harmony Pins: Real-time visual tracking of harmonic satellites directly on the polar canvas.',
    'Live WCAG AA / AAA Contrast Telemetry: Instant calculation of relative luminance and contrast ratios against both light and dark backgrounds.',
    'CSS Custom Properties Generator: One-click export of ready-to-use CSS design tokens.',
    'Acoustic Haptics: Web Audio API synthesized detent clicks on 60° cardinal boundaries and copy action chimes.',
    'Zero External Style Dependencies: Pure standard CSS custom properties and React 19 forwardRef handle.',
  ],
  accessibilityNotes: [
    'Uses semantic HTML role="region" with accessible aria-label="Tactile Color Palette Picker".',
    'Harmony selector tabs are marked with role="tablist", role="tab", and aria-selected state.',
    'Palette swatches are exposed as role="list" and role="listitem" with accessible copy titles.',
    'Live WCAG telemetry ensures developers can immediately verify compliance for text on white or dark surfaces.',
    'Respects reduced motion and audio policies, functioning cleanly with sound disabled.',
  ],
};
