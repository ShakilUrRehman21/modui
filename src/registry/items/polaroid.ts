import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/polaroid/Polaroid.tsx?raw';
import rawCssCode from '../../components/ui/polaroid/Polaroid.css?raw';

export const polaroidItem: ComponentRegistryItem = {
  id: 'polaroid',
  slug: 'polaroid',
  name: 'Polaroid Gallery',
  description:
    'Tactile, physics-driven Polaroid tabletop gallery and portfolio showcase. Features organic dragging and tossing with depth layering, 3D card flipping between photo and archival back metadata, authentic chemical film development animation, washi paper tape strips, and Web Audio mechanical shutter acoustics.',
  category: '3D & Interactive Showcase',
  tags: [
    'Polaroid',
    'Gallery',
    'Portfolio',
    'Photography',
    'Physics',
    '3D Flip',
    'Audio DSP',
    'Interactive',
  ],
  status: 'published',
  publishedAt: '2026-11-01',
  updatedAt: '2026-11-01',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/polaroid/Polaroid.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/tree/main/src/components/ui/polaroid',
  codeSnippet: `import { Polaroid } from '@/components/ui/polaroid';

export function PortfolioGalleryDemo() {
  return (
    <Polaroid
      variant="studio-classic"
      layout="scatter"
      draggable={true}
      soundEnabled={true}
    />
  );
}`,
  installSnippet: 'npm install react react-dom',
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'variant',
      type: "'studio-classic' | 'dark-room' | 'vintage-sepia' | 'minimal-mono'",
      defaultValue: "'studio-classic'",
      description: 'Visual color styling matching studio lighting and darkroom aesthetics.',
    },
    {
      name: 'layout',
      type: "'scatter' | 'grid'",
      defaultValue: "'scatter'",
      description: 'Layout mode: organic scattered tabletop or clean portfolio grid.',
    },
    {
      name: 'photos',
      type: 'PolaroidPhoto[]',
      defaultValue: 'DEFAULT_POLAROIDS',
      description: 'Array of photo specimens with titles, captions, camera specs, and archival notes.',
    },
    {
      name: 'draggable',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Enables interactive drag-and-drop tabletop positioning with depth layering in scatter mode.',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Synthesizes dual-stage mechanical camera shutter clicks, paper rustle, and develop chime.',
    },
    {
      name: 'compact',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Compact card preview mode optimized for small display spaces and card previews.',
    },
    {
      name: 'showControls',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Renders the studio top toolbar with layout switcher, shuffle, and develop-all controls.',
    },
    {
      name: 'onPhotoClick',
      type: '(photo: PolaroidPhoto) => void',
      description: 'Callback fired when a photo is clicked or focused.',
    },
    {
      name: 'onPhotoFlip',
      type: '(photo: PolaroidPhoto, isFlipped: boolean) => void',
      description: 'Callback fired when a photo card is flipped between front and back.',
    },
  ],
  accessibilityNotes: [
    'Accessible button roles on each Polaroid card with descriptive aria-label reading photo title and instructions.',
    'Full keyboard navigation: Enter or Space to flip cards, Tab to focus through photos.',
    'Screen readers receive accurate information about photo details, camera exposure specs, and archival notes.',
    'WCAG AA compliant color contrast on both front cursive captions and archival rubber stamp backs.',
    'Respects reduced motion preferences by smoothly settling transitions.',
  ],
  features: [
    'Organic physics-driven tabletop scatter mode with drag-and-drop tossing and depth z-indexing',
    'Crisp editorial portfolio grid mode for structured work presentations',
    '3D perspective card flipping between front photo specimen and archival ink rubber stamped back',
    'Authentic chemical film development fog animation with blur, contrast, and desaturation transitions',
    'Customizable washi paper tape strips pinning photos to the tabletop canvas',
    'Archival technical metadata backing: camera exposure settings (f-stop, shutter, ISO) and handwritten client notes',
    'Synthesized Web Audio acoustics: mechanical double-click camera shutter, paper rustle, and develop chimes',
    '4 curated studio finishes: Studio Classic, Dark Room, Vintage Sepia, and Minimal Mono',
  ],
};
