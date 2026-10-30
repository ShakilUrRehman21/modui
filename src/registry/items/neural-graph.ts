import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/neural-graph/NeuralGraph.tsx?raw';
import rawCssCode from '../../components/ui/neural-graph/NeuralGraph.css?raw';

export const neuralGraphItem: ComponentRegistryItem = {
    id: 'neural-graph',
    slug: 'neural-graph',
    name: 'Synaptic Neural Graph',
    description:
      'Force-directed synaptic canvas graph with physics spring relaxation, real-time action potential wave propagation, interactive node dragging, cluster filtering, and synthesized micro-tonal Web Audio haptics.',
    category: '3D & Interactive Showcase',
    tags: [
      'Neural Network',
      'Graph',
      'Physics',
      'Canvas',
      'Synapse',
      'Interactive',
      'Web Audio',
      'Haptics',
    ],
    status: 'published',
    publishedAt: '2026-10-29',
    updatedAt: '2026-10-29',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/neural-graph/NeuralGraph.tsx',
    githubUrl:
      'https://github.com/ShakilUrRehman21/modui/tree/main/src/components/ui/neural-graph',
    codeSnippet: `import { NeuralGraph } from '@/components/ui/neural-graph';

export function SynapticGraphDemo() {
  return (
    <NeuralGraph
      variant="studio-light"
      interactive={true}
      soundEnabled={true}
      autoPulse={true}
    />
  );
}`,
    installSnippet: 'npm install react react-dom',
    rawSourceCode,
    rawCssCode,
    propsDoc: [
      {
        name: 'variant',
        type: "'studio-light' | 'dark-slate' | 'warm-editorial' | 'quantum-violet'",
        defaultValue: "'studio-light'",
        description: 'Visual surface theme and chromatic accent palette.',
      },
      {
        name: 'nodes',
        type: 'NeuralNode[]',
        defaultValue: 'DEFAULT_NEURAL_NODES',
        description: 'Array of neural node objects containing id, label, cluster, value, and coordinates.',
      },
      {
        name: 'edges',
        type: 'NeuralEdge[]',
        defaultValue: 'DEFAULT_NEURAL_EDGES',
        description: 'Array of synaptic axon connections defining source, target, and weight.',
      },
      {
        name: 'selectedNodeId',
        type: 'string',
        description: 'Controlled active node identifier for inspector focus.',
      },
      {
        name: 'onSelectNode',
        type: '(node: NeuralNode | null) => void',
        description: 'Callback triggered when a node is clicked or deselected.',
      },
      {
        name: 'onFireSynapse',
        type: '(sourceId: string, targetId: string) => void',
        description: 'Callback fired when an action potential pulse travels along an axon.',
      },
      {
        name: 'interactive',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Enables pointer magnetism, draggable nodes, and camera pan/zoom.',
      },
      {
        name: 'soundEnabled',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Synthesizes micro-tonal node chimes and electrical spark discharges via Web Audio API.',
      },
      {
        name: 'autoPulse',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Automatically emits periodic subtle ambient synaptic pulses across the lattice.',
      },
      {
        name: 'showControls',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Displays floating telemetry HUD and action controls toolbar.',
      },
      {
        name: 'showInspector',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Displays floating telemetry inspector card when a node is selected.',
      },
      {
        name: 'compact',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Compact mode without overlay controls, optimized for catalogue preview cards.',
      },
    ],
    accessibilityNotes: [
      'Accessible region landmark with aria-label="Interactive Synaptic Neural Graph".',
      'All interactive controls (filters, impulse trigger, camera reset, sound toggle) are semantic buttons with clear accessible names.',
      'Sound feedback is complementary; all states are fully communicated with visual pulse waves, halo glows, and border highlights.',
      'Respects prefers-reduced-motion by dampening pulse animation speeds and camera shifts.',
    ],
    features: [
      'Hardware-accelerated 2D force-directed physics engine with Coulomb repulsion and Hooke spring tension',
      'Real-time action potential wave propagation sending glowing photon particles along connected axons',
      'Synthesized Web Audio acoustic haptics: micro-tonal cluster chimes and electrical spark discharges',
      'Full camera pan and zoom controls with smooth spring damping and one-click centering reset',
      'Floating studio telemetry HUD displaying live node, synapse, and pulse metrics',
      '4 curated studio themes: Studio Light, Dark Slate, Warm Editorial, and Quantum Violet',
    ],
  };
