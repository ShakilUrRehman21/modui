import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/caustic-surface/CausticRippleSurface.tsx?raw';
import rawCssCode from '../../components/ui/caustic-surface/CausticRippleSurface.css?raw';

export const causticRippleSurfaceItem: ComponentRegistryItem = {
    id: 'caustic-ripple-surface',
    slug: 'caustic-ripple-surface',
    name: 'Caustic Ripple Surface',
    description:
      'Clean interactive 2D fluid wave propagation with real-time sunlight caustic light refraction, ambient rain simulation, and synthesized acoustic droplet haptics.',
    category: '3D & Interactive Showcase',
    tags: ['Fluid', 'Water', 'Caustics', 'Physics', 'Refraction', 'Web Audio', 'Canvas'],
    status: 'published',
    publishedAt: '2026-10-21',
    updatedAt: '2026-10-21',
    version: '0.1.0',
    sourceLocation: 'src/components/ui/caustic-surface',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/tree/main/src/components/ui/caustic-surface',
    codeSnippet: `import { CausticRippleSurface } from '@/components/ui/caustic-surface';

export function ClarityShowcase() {
  return (
    <CausticRippleSurface
      variant="porcelain"
      damping={0.98}
      refractionStrength={2.2}
      rainEnabled={true}
      soundEnabled={true}
      headline="Liquid Clarity."
      subheadline="Physical 2D fluid wave propagation with real-time caustic light refraction and acoustic droplet haptics."
    />
  );
}`,
    installSnippet: 'npm install react react-dom',
    rawSourceCode,
    rawCssCode,
    propsDoc: [
      {
        name: 'variant',
        type: "'porcelain' | 'crystal-lake' | 'dark-obsidian' | 'amber-spring'",
        defaultValue: "'porcelain'",
        description: 'Visual color palette for background tone and liquid caustics.',
      },
      {
        name: 'damping',
        type: 'number',
        defaultValue: '0.98',
        description: 'Wave propagation momentum damping coefficient (0.92 to 0.995).',
      },
      {
        name: 'refractionStrength',
        type: 'number',
        defaultValue: '2.2',
        description: 'Multiplicative factor for normal vector light bending.',
      },
      {
        name: 'dropletRadius',
        type: 'number',
        defaultValue: '4',
        description: 'Radius in simulation units of injected water ripple disturbances.',
      },
      {
        name: 'rainEnabled',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Enables ambient periodic raindrop ripples falling across the surface.',
      },
      {
        name: 'rainInterval',
        type: 'number',
        defaultValue: '2400',
        description: 'Delay in milliseconds between ambient raindrops.',
      },
      {
        name: 'soundEnabled',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Synthesizes realistic water droplet acoustic plinks on ripple impacts.',
      },
      {
        name: 'headline',
        type: 'string',
        defaultValue: "'Liquid Clarity.'",
        description: 'Main typographic display headline rendered beneath the water plane.',
      },
      {
        name: 'subheadline',
        type: 'string',
        description: 'Supporting descriptive body text viewed through the caustic refractor.',
      },
    ],
    accessibilityNotes: [
      'Accessible region role with aria-label="Interactive Liquid Caustic Ripple Surface".',
      'Canvas overlays marked with pointer-events and transparent blending to preserve text legibility.',
      'Supports keyboard Spacebar and Enter triggers to inject clean centered ripple pulses.',
      'Respects prefers-reduced-motion by allowing ambient rain to be toggled off.',
    ],
    features: [
      'High-performance 2D discrete wave propagation equation running at 60+ FPS',
      'Dual canvas pipeline rendering refractive surface normals and specular sunlight caustics',
      'Interactive pointer drag wake trails and click droplet bursts',
      'Synthesized Web Audio droplet plink sound effects with zero external media files',
      '4 curated studio themes: Studio Porcelain, Crystal Lake, Dark Obsidian, Amber Spring',
      'Clean typography and card chips displayed through the crystalline water layer',
    ],
  };
