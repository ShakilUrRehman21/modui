import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/filmstrip/FilmstripGallery.tsx?raw';
import rawCssCode from '../../components/ui/filmstrip/FilmstripGallery.css?raw';

export const filmstripGalleryItem: ComponentRegistryItem = {
    id: 'filmstrip-gallery',
    slug: 'filmstrip-gallery',
    name: 'Filmstrip Gallery',
    description:
      'Continuous 35mm cinematographic film reel gallery featuring calibrated sprocket perforations, smooth drag scrub physics, frame elevation micro-interactions, full-bleed lightbox inspection, and synthesized analog sprocket clicks.',
    category: '3D & Interactive Showcase',
    tags: [
      'Gallery',
      'Filmstrip',
      'Cinematography',
      'Lightbox',
      'Web Audio',
      'Interactive',
      'Showcase',
      'Photography',
    ],
    status: 'published',
    publishedAt: '2026-10-25',
    updatedAt: '2026-10-25',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/filmstrip/FilmstripGallery.tsx',
    githubUrl:
      'https://github.com/ShakilUrRehman21/modui/tree/main/src/components/ui/filmstrip',
    codeSnippet: `import { FilmstripGallery } from '@/components/ui/filmstrip';

export function CinemaGalleryDemo() {
  return (
    <FilmstripGallery
      variant="studio-light"
      showSprockets={true}
      showFrameNumbers={true}
      showMetadata={true}
      soundEnabled={true}
      enableLightbox={true}
    />
  );
}`,
    installSnippet: 'npm install react react-dom',
    rawSourceCode,
    rawCssCode,
    propsDoc: [
      {
        name: 'items',
        type: 'FilmstripItem[]',
        defaultValue: 'DEFAULT_FILMSTRIP_ITEMS',
        description: 'Array of gallery stills including title, subtitle, category, image src, and camera metadata tags.',
      },
      {
        name: 'variant',
        type: "'studio-light' | 'warm-editorial' | 'minimal-mono' | 'cinema-dark'",
        defaultValue: "'studio-light'",
        description: 'Cinematic visual finish, edge lighting tint, and color atmosphere.',
      },
      {
        name: 'showSprockets',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Renders authentic 35mm top and bottom film reel sprocket perforations and edge markings.',
      },
      {
        name: 'showFrameNumbers',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Renders calibrated frame indices, timecode stamps, and frame rate labels.',
      },
      {
        name: 'showMetadata',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Displays focal length, shutter speed, and emulsion ISO metadata chips on each frame.',
      },
      {
        name: 'soundEnabled',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Synthesizes analog mechanical sprocket clicks and camera shutter sounds via Web Audio API.',
      },
      {
        name: 'enableLightbox',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Enables high-definition fullscreen modal inspection dialog with keyboard cycle controls.',
      },
      {
        name: 'compact',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Compact preview mode optimized for catalogue cards and embed widgets.',
      },
      {
        name: 'activeIndex',
        type: 'number',
        description: 'Controlled active frame index.',
      },
      {
        name: 'onFrameSelect',
        type: '(item: FilmstripItem, index: number) => void',
        description: 'Callback invoked when a frame is clicked or inspected.',
      },
    ],
    accessibilityNotes: [
      'Accessible region landmark with aria-label="Filmstrip Gallery".',
      'Every frame operates as a keyboard-accessible button with aria-label describing frame index and title.',
      'Keyboard navigation supports Arrow keys to scroll frames, Enter/Space to inspect, and Escape to dismiss lightbox.',
      'Lightbox modal utilizes role="dialog", aria-modal="true", and provides an explicit accessible close control.',
      'Decorative film sprocket holes and edge codes are properly marked aria-hidden="true".',
    ],
    features: [
      'Continuous 35mm cinematographic filmstrip with calibrated sprocket perforations and edge markings',
      'Pointer-drag momentum scrub physics and horizontal smooth scrolling',
      'Dynamic frame elevation and zoom on hover with luminous edge backlighting',
      'Full-bleed modal lightbox inspection with EXIF camera specs (focal length, shutter, ISO)',
      'Synthesized analog sprocket ratchet micro-ticks and SLR camera shutter haptics via Web Audio API',
      '4 curated cinematic themes: Cinema Dark, Monochrome Silver, Cyber Cyan, and Vintage Sepia',
    ],
  };
