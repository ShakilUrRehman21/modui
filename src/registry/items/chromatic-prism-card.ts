import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/prism/ChromaticPrismCard.tsx?raw';
import rawCssCode from '../../components/ui/prism/ChromaticPrismCard.css?raw';

export const chromaticPrismCardItem: ComponentRegistryItem = {
    id: 'chromatic-prism-card',
    slug: 'chromatic-prism-card',
    name: 'Chromatic Prism Specimen Card',
    description:
      'Optical quartz specimen card featuring 3D perspective gyro tilt, dynamic incident light glare tracking, subpixel chromatic dispersion fringes, frosted silica depth refraction, and synthesized crystalline glass chime haptics.',
    category: '3D & Interactive Showcase',
    tags: ['Prism', 'Chromatic', 'Glassmorphism', '3D Tilt', 'Dispersion', 'Optics', 'Web Audio', 'Showcase'],
    status: 'published',
    publishedAt: '2026-10-24',
    updatedAt: '2026-10-24',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/prism',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/tree/main/src/components/ui/prism',
    codeSnippet: `import { ChromaticPrismCard } from '@/components/ui/prism';

export function SpecimenDemo() {
  return (
    <ChromaticPrismCard
      variant="sapphire-crystal"
      title="Optical Sapphire Specimen"
      subtitle="Subpixel chromatic dispersion prism featuring multi-plane silica depth refraction."
      serialNumber="REF. 9042 // SPECIMEN 01"
      refractiveIndex="n = 1.544"
      actionLabel="Inspect Specimen"
      onAction={() => console.log('Specimen inspected')}
    />
  );
}`,
    installSnippet: 'npm install react react-dom',
    rawSourceCode,
    rawCssCode,
    propsDoc: [
      {
        name: 'variant',
        type: "'sapphire-crystal' | 'obsidian-prism' | 'amber-quartz' | 'emerald-matrix'",
        defaultValue: "'sapphire-crystal'",
        description: 'Visual crystal finish, specular reflection, and spectral color palette.',
      },
      {
        name: 'title',
        type: 'string',
        defaultValue: "'Optical Sapphire Specimen'",
        description: 'Primary specimen headline title.',
      },
      {
        name: 'subtitle',
        type: 'string',
        description: 'Supporting editorial description text.',
      },
      {
        name: 'category',
        type: 'string',
        defaultValue: "'QUARTZ PRIMITIVE'",
        description: 'Category classification pill badge.',
      },
      {
        name: 'serialNumber',
        type: 'string',
        defaultValue: "'REF. 9042 // SPECIMEN 01'",
        description: 'Technical reference or serial number stamp.',
      },
      {
        name: 'refractiveIndex',
        type: 'string',
        defaultValue: "'n = 1.544'",
        description: 'Optical material refractive index metric.',
      },
      {
        name: 'actionLabel',
        type: 'string',
        defaultValue: "'Inspect Specimen'",
        description: 'Label rendered on the interactive action button.',
      },
      {
        name: 'onAction',
        type: '() => void',
        description: 'Callback invoked when the action button is triggered.',
      },
      {
        name: 'maxTilt',
        type: 'number',
        defaultValue: '14',
        description: 'Maximum 3D perspective rotational angle in degrees.',
      },
      {
        name: 'interactive',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Enables pointer-tracking 3D gyro tilt and optical specular glare.',
      },
      {
        name: 'soundEnabled',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Synthesizes delicate dual-oscillator crystalline glass chime upon action click.',
      },
      {
        name: 'compact',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Compact card preview mode for embedded catalogue and showcase cards.',
      },
      {
        name: 'mediaNode',
        type: 'React.ReactNode',
        description: 'Custom specimen media, 3D visual, or graphic placed in the card stage.',
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        description: 'Optional overlay child elements.',
      },
    ],
    accessibilityNotes: [
      'Accessible region landmark with aria-label="Chromatic Prism Card: {title}".',
      'Full keyboard focusability and navigation using Arrow keys to tilt and Enter/Space to activate the primary action.',
      'Decorative optical overlays, glare layers, and millimeter rules are properly marked aria-hidden="true".',
      'Action button features distinct hover, active, and focus-visible states adhering to WCAG AA contrast.',
    ],
    features: [
      '3D perspective gyro rotation calculated from normalized pointer coordinates',
      'Dynamic incident light tracking with radial specular glare following cursor angle',
      'Subpixel chromatic dispersion splitting RGB fringe caustics along beveled perimeter borders',
      'Calibrated millimeter graduation rule with real-time sliding optical notch indicator',
      'Synthesized dual-oscillator crystalline glass chime sound via Web Audio API',
      '4 curated architectural mineral themes: Sapphire Crystal, Obsidian Prism, Amber Quartz, Emerald Matrix',
    ],
  };
