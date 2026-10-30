import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/cloth/NeuralClothMesh.tsx?raw';
import rawCssCode from '../../components/ui/cloth/NeuralClothMesh.css?raw';

export const neuralClothMeshItem: ComponentRegistryItem = {
    id: 'neural-cloth-mesh',
    slug: 'neural-cloth-mesh',
    name: 'Neural Cloth Mesh',
    description:
      'Real-time physical 2D Verlet integration particle lattice connected by elastic relaxation constraints, featuring dynamic 3D surface normal lighting, pointer turbulence wake, and harmonic wind acoustics.',
    category: '3D & Interactive Showcase',
    tags: ['Cloth', 'Verlet', 'Physics', 'Simulation', 'Mesh', 'Silk', 'Canvas', 'Web Audio'],
    status: 'published',
    publishedAt: '2026-10-22',
    updatedAt: '2026-10-22',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/cloth',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/tree/main/src/components/ui/cloth',
    codeSnippet: `import { NeuralClothMesh } from '@/components/ui/cloth';

export function SilkContinuumDemo() {
  return (
    <div style={{ width: '100%', height: '420px', borderRadius: '12px', overflow: 'hidden' }}>
      <NeuralClothMesh
        variant="studio-silk"
        renderMode="wireframe"
        pinMode="curtain"
        gravity={0.10}
        windStrength={0}
        stiffness={2}
        interactive={true}
        soundEnabled={true}
        headline="Neural Continuum."
        subheadline="Verlet particle lattice connected by elastic relaxation constraints with real-time facet normal lighting."
      />
    </div>
  );
}`,
    installSnippet: 'npm install react react-dom',
    rawSourceCode,
    rawCssCode,
    propsDoc: [
      {
        name: 'variant',
        type: "'studio-silk' | 'liquid-gold' | 'dark-obsidian' | 'emerald-aurora'",
        defaultValue: "'studio-silk'",
        description: 'Visual color scheme and specular reflection response.',
      },
      {
        name: 'renderMode',
        type: "'shaded' | 'wireframe' | 'hybrid'",
        defaultValue: "'wireframe'",
        description: 'Rendering technique: smooth illuminated polygons, architectural wireframe, or hybrid.',
      },
      {
        name: 'pinMode',
        type: "'top-edge' | 'corners' | 'curtain'",
        defaultValue: "'curtain'",
        description: 'How the cloth is tethered: entire top edge, two upper corners, or draped curtain.',
      },
      {
        name: 'gravity',
        type: 'number',
        defaultValue: '0.10',
        description: 'Downward gravitational acceleration vector.',
      },
      {
        name: 'windStrength',
        type: 'number',
        defaultValue: '0',
        description: 'Ambient aerodynamic breeze turbulence factor.',
      },
      {
        name: 'compact',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Compact card preview mode for embedded catalogue & showcase cards.',
      },
      {
        name: 'stiffness',
        type: 'number',
        defaultValue: '2',
        description: 'Constraint elasticity relaxation iterations (1 to 5).',
      },
      {
        name: 'mouseRadius',
        type: 'number',
        defaultValue: '85',
        description: 'Radius of pointer turbulence influence in pixels.',
      },
      {
        name: 'interactive',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Enables pointer wind wake and drag stretching.',
      },
      {
        name: 'soundEnabled',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Synthesizes harmonic resonant whoosh acoustics on fabric ripple.',
      },
      {
        name: 'headline',
        type: 'string',
        defaultValue: "'Verlet Silk Mesh.'",
        description: 'Typographic display headline rendered over the cloth plane.',
      },
      {
        name: 'subheadline',
        type: 'string',
        description: 'Supporting descriptive body text.',
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        description: 'Optional custom overlay elements.',
      },
    ],
    accessibilityNotes: [
      'Accessible region role with aria-label="Interactive Verlet Silk Cloth Mesh".',
      'HTML5 canvas marked aria-hidden="true" to prevent noisy screen reader updates.',
      'Supports keyboard Spacebar and Enter triggers to inject aerodynamic wind ripples.',
      'Overlay typography and interactive children preserve full focusability and WCAG AA contrast.',
    ],
    features: [
      'Hardware-accelerated 2D Verlet integration particle simulation with structural constraints',
      'Dynamic 3D facet normal lighting rendering liquid satin and metallic sheen highlights',
      'Fluid cursor wind wake repulsion and drag impulse physics',
      'Synthesized Web Audio harmonic breeze resonant whoosh with zero external audio assets',
      '4 curated studio themes: Studio Silk, Liquid Gold, Dark Obsidian, Emerald Aurora',
      'Multiple anchor pin modes: full top edge, corner suspensions, and draped curtain',
    ],
  };
