import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/aperture/ApertureIrisLens.tsx?raw';
import rawCssCode from '../../components/ui/aperture/ApertureIrisLens.css?raw';

export const apertureIrisLensItem: ComponentRegistryItem = {
    id: 'aperture-iris-lens',
    slug: 'aperture-iris-lens',
    name: 'Mechanical Aperture Iris Lens',
    description:
      'Precision optical camera aperture iris mechanism featuring interlocking curved blades, rotary knurled ring drag scrub, standard f-stop presets (f/1.4 to f/22), synthesized Web Audio brass leaf ratchet ticks, and dynamic SVG polygon clipping for revealed subject content.',
    category: '3D & Interactive Showcase',
    tags: ['Aperture', 'Camera Lens', 'Mechanical', 'Rotary', 'Interactive', 'Web Audio', 'Optics', 'SVG'],
    status: 'published',
    publishedAt: '2026-10-23',
    updatedAt: '2026-10-23',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/aperture',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/tree/main/src/components/ui/aperture',
    codeSnippet: `import { ApertureIrisLens } from '@/components/ui/aperture';

export function OpticsDemo() {
  return (
    <ApertureIrisLens
      variant="studio-silver"
      bladesCount={9}
      defaultValue={0.55}
      focalLength="50mm"
      soundEnabled={true}
      onChange={(val, fStop) => console.log('Aperture set to:', fStop, val)}
    />
  );
}`,
    installSnippet: 'npm install react react-dom',
    rawSourceCode,
    rawCssCode,
    propsDoc: [
      {
        name: 'variant',
        type: "'studio-silver' | 'matte-obsidian' | 'classic-brass' | 'cyber-neon'",
        defaultValue: "'studio-silver'",
        description: 'Visual barrel finish and blade metallic styling.',
      },
      {
        name: 'bladesCount',
        type: 'number',
        defaultValue: '9',
        description: 'Number of interlocking mechanical iris blades (6 to 14).',
      },
      {
        name: 'value',
        type: 'number',
        description: 'Controlled aperture ratio (0.05 to 1.0).',
      },
      {
        name: 'defaultValue',
        type: 'number',
        defaultValue: '0.55',
        description: 'Initial aperture ratio when uncontrolled (0.55 corresponds to f/4.0).',
      },
      {
        name: 'onChange',
        type: '(value: number, fStop: string) => void',
        description: 'Callback fired when aperture ratio shifts.',
      },
      {
        name: 'showRing',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Render outer machined lens barrel with knurling and engravings.',
      },
      {
        name: 'showFStops',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Render clickable f-stop selector buttons below the lens.',
      },
      {
        name: 'interactive',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Enable circular drag on barrel ring and mouse interaction.',
      },
      {
        name: 'soundEnabled',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Synthesize realistic mechanical brass ratchet ticks via Web Audio.',
      },
      {
        name: 'compact',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Compact card mode for catalogue cards and featured sections.',
      },
      {
        name: 'focalLength',
        type: 'string',
        defaultValue: "'50mm'",
        description: 'Focal length indicator engraved on the lens barrel.',
      },
      {
        name: 'revealContent',
        type: 'React.ReactNode',
        description: 'Custom content or image rendered inside the revealed aperture opening.',
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        description: 'Optional overlay children.',
      },
    ],
    accessibilityNotes: [
      'Accessible slider role with aria-label="Mechanical Lens Aperture Iris".',
      'Exposes aria-valuemin="0.05", aria-valuemax="1", aria-valuenow, and human-readable aria-valuetext (e.g., "f/4.0").',
      'Supports full keyboard navigation: ArrowUp / ArrowRight to open (+0.05), ArrowDown / ArrowLeft to close (-0.05), Home for f/22, End for f/1.4.',
      'F-stop preset buttons include aria-pressed indicators for the currently active aperture stop.',
    ],
    features: [
      'Trigonometric blade overlapping geometry calculating tangent cutting line vectors with zero light leaks',
      'Rotary pointer drag scrub using Math.atan2 relative to lens center',
      'Standard photographic f-stop presets from f/1.4 to f/22',
      'Dual-oscillator brass leaf mechanical click sound synthesis via Web Audio API',
      'Dynamic SVG polygon clip-path revealing custom subject content through the iris aperture',
      '4 physical finishes: Studio Silver, Matte Obsidian, Classic Brass, and Cyber Neon',
    ],
  };
