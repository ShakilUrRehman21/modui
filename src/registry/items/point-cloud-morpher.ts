import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/point-cloud/PointCloudMorpher.tsx?raw';
import rawCssCode from '../../components/ui/point-cloud/PointCloudMorpher.css?raw';

export const pointCloudMorpherItem: ComponentRegistryItem = {
  id: 'point-cloud-morpher',
  slug: 'point-cloud-morpher',
  name: '3D Point Cloud Mesh Morpher',
  description:
    'Hardware-accelerated 3D mathematical particle sculpture featuring seamless spring-damped topology morphing (Fibonacci Sphere, Clifford Torus, Double Helix DNA, Quantum Wave, Tesseract Cube, Galactic Spiral), cursor gravitational vortex, orbit drag physics, and chromatic depth shading.',
  category: '3D & Interactive Showcase',
  tags: [
    '3D Point Cloud',
    'Particle Mesh',
    'Topology Morpher',
    'Fibonacci Sphere',
    'Clifford Torus',
    'Double Helix',
    'Quantum Wave',
    'Gravitational Vortex',
    'Constellation Filaments',
    'Hardware Compositing',
  ],
  status: 'published',
  publishedAt: '2026-11-08',
  updatedAt: '2026-11-08',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/point-cloud/PointCloudMorpher.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/tree/main/src/components/ui/point-cloud',
  codeSnippet: `import { PointCloudMorpher } from '@/components/ui/point-cloud';

export function PointCloudDemo() {
  return (
    <PointCloudMorpher
      topology="sphere"
      variant="cyber-violet"
      particleCount={900}
      showConstellations={true}
      autoRotate={true}
      interactiveVortex={true}
      soundEnabled={true}
    />
  );
}`,
  installSnippet: 'npm install react react-dom',
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'topology',
      type: "'sphere' | 'torus' | 'helix' | 'wave' | 'cube' | 'galaxy'",
      defaultValue: "'sphere'",
      description: 'Active 3D geometric topology target interpolated by the vertex cloud.',
    },
    {
      name: 'variant',
      type: "'cyber-violet' | 'matrix-emerald' | 'solar-amber' | 'deep-ice'",
      defaultValue: "'cyber-violet'",
      description: 'Color theme styling the vertex highlights, constellation filaments, and background vignette.',
    },
    {
      name: 'particleCount',
      type: 'number',
      defaultValue: '900',
      description: 'Total number of luminous vertices generated in the point cloud (200 - 2000).',
    },
    {
      name: 'showConstellations',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Render glowing filament connection lines between vertices within proximity threshold.',
    },
    {
      name: 'constellationDistance',
      type: 'number',
      defaultValue: '34',
      description: 'Pixel proximity threshold for connecting adjacent vertices with constellation lines.',
    },
    {
      name: 'autoRotate',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Continuous smooth auto-orbit rotation around the Y and X axes.',
    },
    {
      name: 'rotationSpeed',
      type: 'number',
      defaultValue: '1.0',
      description: 'Speed multiplier for continuous auto-rotation.',
    },
    {
      name: 'interactiveVortex',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Enables cursor gravitational vortex repulsion and tangential swirling upon mouse hover.',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Synthesizes harmonic resonance chords via Web Audio DSP on topology transitions.',
    },
    {
      name: 'compact',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Compact card preview mode hiding HUD bars and toolbars for thumbnail displays.',
    },
    {
      name: 'onTopologyChange',
      type: '(topology: PointCloudTopology) => void',
      defaultValue: 'undefined',
      description: 'Callback fired whenever the active 3D topology is switched.',
    },
  ],
  features: [
    '6 High-Dimensional Topologies: Fibonacci Geodesic Sphere, Clifford Torus, Double Helix DNA, Quantum Harmonic Wave, Tesseract Cube Lattice, and Logarithmic Spiral Galaxy',
    'Zero-Lag Spring Physics: Per-vertex velocity dampening ensuring organic, smooth morph transitions between complex 3D shapes',
    'Interactive Cursor Vortex: Gravitational repulsion and tangential swirl field reacting to mouse and touch coordinates',
    'Proximity Constellation Filaments: Dynamic sub-pixel filament lines connecting nearby vertices',
    '3D Matrix Orbit & Inertial Damping: Full 3D camera rotation with pointer drag inertia and decay',
    'Web Audio DSP Synthesis: Harmonic musical chime feedback synthesized purely in-browser on shape changes',
    '4 Chromatic Palettes: Cyber Violet, Matrix Emerald, Solar Amber, and Deep Ice',
    'Fully Accessible: ARIA region, live screen reader announcements, and keyboard arrow orbit navigation',
  ],
  accessibilityNotes: [
    'ARIA role="region" with dynamic aria-labelledby announcing current topology and vertex count',
    'Keyboard navigation: Arrow keys rotate 3D camera orbit; Spacebar and Enter cycle through topologies',
    'Toolbar buttons implemented with role="tablist" and role="tab" with explicit aria-selected states',
    'Supports prefers-reduced-motion by dampening velocities and auto-rotation',
  ],
};

