import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/spatial-gallery/SpatialGallery.tsx?raw';
import rawCssCode from '../../components/ui/spatial-gallery/SpatialGallery.css?raw';

export const spatialGalleryItem: ComponentRegistryItem = {
  id: 'spatial-gallery',
  slug: 'spatial-gallery',
  name: 'Spatial Gallery',
  description:
    'High-end 3D spatial cylindrical ribbon showcase with real-time ground mirror reflections and specular glare. Inspired by ThreeUI, Skiper UI, and luxury automotive/spatial tech digital experiences. Features touch/drag scrubbing with deadzone protection, wheel scrub, keyboard arrows navigation, procedural Web Audio acoustic ticks, and full inspection lightbox modal.',
  category: '3D & Interactive Showcase',
  tags: [
    'Spatial',
    '3D',
    'Gallery',
    'Mirror',
    'Reflection',
    'Cylindrical',
    'Showcase',
    'GSAP',
    'WebGL',
    'Perspective',
    'Portfolio',
    'Interactive',
  ],
  status: 'published',
  publishedAt: '2026-11-04',
  updatedAt: '2026-11-04',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/spatial-gallery/SpatialGallery.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/tree/main/src/components/ui/spatial-gallery',
  codeSnippet: `import { SpatialGallery } from '@/components/ui/spatial-gallery';

export function CreativeShowcase() {
  return (
    <SpatialGallery
      variant="studio-dark"
      showReflection={true}
      showControls={true}
      showHUD={true}
      soundEnabled={true}
      autoPlay={false}
      onSelect={(item, index) => console.log('Active project:', item.title, index)}
    />
  );
}`,
  installSnippet: 'npm install react react-dom',
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'variant',
      type: "'studio-dark' | 'studio-light' | 'minimal-mono' | 'cyber-cyan'",
      defaultValue: "'studio-dark'",
      description: 'Curated visual aesthetic theme finish.',
    },
    {
      name: 'items',
      type: 'SpatialGalleryItem[]',
      defaultValue: 'DEFAULT_SPATIAL_ITEMS',
      description: 'Showcase card items with media URLs, badges, titles, subtitles, and descriptions.',
    },
    {
      name: 'activeIndex',
      type: 'number',
      description: 'Controlled active card index.',
    },
    {
      name: 'defaultIndex',
      type: 'number',
      defaultValue: '0',
      description: 'Initial active card index for uncontrolled mode.',
    },
    {
      name: 'showReflection',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Renders real-time inverted mirror floor reflections with opacity falloff.',
    },
    {
      name: 'showControls',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Renders bottom navigation arrow buttons and slide dot indicators.',
    },
    {
      name: 'showHUD',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Renders top HUD overlay displaying case study badge, status, and telemetry.',
    },
    {
      name: 'autoPlay',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Automatically cycles through items on a continuous interval.',
    },
    {
      name: 'autoPlayInterval',
      type: 'number',
      defaultValue: '4500',
      description: 'Interval in milliseconds between auto-play slide advances.',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Synthesizes acoustic spatial micro-haptic clicks on card scrub using Web Audio API.',
    },
    {
      name: 'enableLightbox',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Enables high-resolution inspection modal upon clicking the active card or pressing Enter.',
    },
    {
      name: 'compact',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Compact card preview mode calibrated specifically for component catalog cards.',
    },
    {
      name: 'onSelect',
      type: '(item: SpatialGalleryItem, index: number) => void',
      description: 'Callback fired when the active card changes.',
    },
    {
      name: 'onItemClick',
      type: '(item: SpatialGalleryItem, index: number) => void',
      description: 'Callback fired when a card is clicked or inspected.',
    },
  ],
  accessibilityNotes: [
    'Accessible region role with descriptive label "Spatial Gallery".',
    'Full keyboard navigation: ArrowRight / ArrowLeft to cycle items, Home for first item, End for last item, Enter/Space to inspect card, and Escape to dismiss modal.',
    'Each card is accessible via role="button" with title and category descriptions.',
    'Dot indicators use role="tablist" and role="tab" with aria-selected state.',
    'Fullscreen inspection modal has role="dialog", aria-modal="true", and supports Escape dismissal.',
    'Decorative mirror reflections and horizon floor plane are marked aria-hidden="true".',
    'Respects prefers-reduced-motion by disabling 3D transitions and animated pulses.',
  ],
  features: [
    'True 3D cylindrical spatial ribbon projection (translateZ, rotateY, translateX) calibrated to 1100px perspective',
    'Real-time inverted mirror floor reflection with progressive opacity falloff and floor shine',
    'Specular light glare across the active foreground card for physical material realism',
    'Intuitive touch/pointer drag scrub with 8px deadzone protection to preserve click inspection',
    'Mouse wheel scrubbing for desktop trackpads and mouse wheels',
    'Procedural Web Audio acoustic spatial micro-haptic clicks on slide change',
    'High-resolution inspection modal with backdrop blur, project metadata, and Escape dismiss',
    '4 curated visual finishes: Studio Dark, Studio Light, Minimal Mono, and Cyber Cyan',
    'Compact explorer mode calibrated specifically for catalog cards and previews',
  ],
};

