import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/infinite-canvas-gallery/InfiniteCanvasGallery.tsx?raw';
import rawCssCode from '../../components/ui/infinite-canvas-gallery/InfiniteCanvasGallery.css?raw';

export const infiniteCanvasGalleryItem: ComponentRegistryItem = {
  id: 'infinite-canvas-gallery',
  slug: 'infinite-canvas-gallery',
  name: 'Infinite Canvas Gallery',
  description:
    '360° infinite draggable media canvas inspired by Cosmos, Are.na, and Apple design showcases. Features momentum fling physics with friction decay, toroidal seamless coordinate wrapping, live mini-radar HUD, and Web Audio acoustic micro-haptics.',
  category: '3D & Interactive Showcase',
  tags: [
    'Infinite',
    'Canvas',
    'Gallery',
    'Spatial',
    'Physics',
    'Momentum',
    'Fling',
    'Toroidal',
    'Minimap',
    'Radar',
    'Portfolio',
    'Interactive',
  ],
  status: 'published',
  publishedAt: '2026-11-03',
  updatedAt: '2026-11-03',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/infinite-canvas-gallery/InfiniteCanvasGallery.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/tree/main/src/components/ui/infinite-canvas-gallery',
  codeSnippet: `import { InfiniteCanvasGallery } from '@/components/ui/infinite-canvas-gallery';

export function CreativeSpatialShowcase() {
  return (
    <InfiniteCanvasGallery
      variant="studio-light"
      friction={0.94}
      showMinimap={true}
      showToolbar={true}
      soundEnabled={true}
      onItemClick={(item) => console.log('Selected item:', item.title)}
    />
  );
}`,
  installSnippet: 'npm install react react-dom',
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'variant',
      type: "'studio-light' | 'dark-slate' | 'editorial-paper' | 'minimal-mono'",
      defaultValue: "'studio-light'",
      description: 'Visual color styling matching studio lighting and darkroom aesthetics.',
    },
    {
      name: 'items',
      type: 'CanvasGalleryItem[]',
      defaultValue: 'DEFAULT_CANVAS_ITEMS',
      description: 'Array of gallery items with titles, categories, tags, and media URLs.',
    },
    {
      name: 'friction',
      type: 'number',
      defaultValue: '0.94',
      description: 'Momentum fling friction coefficient for smooth physics deceleration.',
    },
    {
      name: 'showMinimap',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Renders the corner Radar HUD showing active position within the toroidal field.',
    },
    {
      name: 'showToolbar',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Renders the bottom-left controls toolbar (Center Origin, Random Fling).',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Synthesizes subtle Web Audio acoustic ticks on card hover and fling release.',
    },
    {
      name: 'compact',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Compact card preview mode with miniature cards calibrated for catalogue cards.',
    },
    {
      name: 'onItemClick',
      type: '(item: CanvasGalleryItem) => void',
      description: 'Callback fired when a gallery item card is clicked.',
    },
    {
      name: 'onItemHover',
      type: '(item: CanvasGalleryItem | null) => void',
      description: 'Callback fired when hovered card changes or resets on mouse leave.',
    },
    {
      name: 'onPositionChange',
      type: '(pos: { x: number; y: number; speed: number }) => void',
      description: 'Callback fired on canvas pan or velocity update.',
    },
  ],
  accessibilityNotes: [
    'Accessible region role with descriptive label "Infinite 360-degree media canvas gallery".',
    'Full keyboard navigation: Arrow keys to pan the spatial canvas, Home key to center origin.',
    'Each card is accessible via role="button" with title and category descriptions.',
    'Visible focus indicator rings compliant with WCAG AA accessibility standards.',
    'Decorative radial background grid and overlays marked aria-hidden="true".',
    'Respects prefers-reduced-motion by disabling non-essential transitions.',
  ],
  features: [
    '360° omnidirectional drag-and-fling momentum physics with continuous friction decay',
    'Toroidal modular wrapping so cards wrap endlessly in all directions with zero pop-in',
    'Real-time corner Radar Minimap HUD tracking active viewport coordinates and velocity',
    'Subtle 3D card elevation and scale on hover with specular glare and category tags',
    'Zero-dependency procedural Web Audio acoustic clicks on card hover and fling',
    '4 curated visual finishes: Studio Light, Dark Slate, Editorial Paper, and Minimal Mono',
    'Compact explorer mode with miniature cards calibrated specifically for catalog cards',
  ],
};
