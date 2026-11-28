import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/popout-folder/InteractivePopoutFolder.tsx?raw';
import rawCssCode from '../../components/ui/popout-folder/InteractivePopoutFolder.css?raw';

export const interactivePopoutFolderItem: ComponentRegistryItem = {
  id: 'interactive-popout-folder',
  slug: 'interactive-popout-folder',
  name: 'Interactive Popout Image Folder',
  description:
    '3D tactile image folder inspired by React Bits and Apple Finder. Hovering or clicking parts the front pocket in 3D perspective to fan out photo cards, and clicking any image opens a full-screen lightbox viewer with keyboard navigation and Web Audio haptics.',
  category: '3D & Interactive Showcase',
  tags: [
    'folder',
    'images',
    'lightbox',
    '3d',
    'gallery',
    'react-bits',
    'popout',
    'showcase',
    'haptics',
  ],
  status: 'published',
  publishedAt: '2026-11-28',
  updatedAt: '2026-11-28',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/popout-folder/InteractivePopoutFolder.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/popout-folder/InteractivePopoutFolder.tsx',
  installSnippet: `// 1. Copy InteractivePopoutFolder.tsx and InteractivePopoutFolder.css into your project:
import { InteractivePopoutFolder } from '@/components/ui/popout-folder';`,
  codeSnippet: `import React, { useRef } from 'react';
import {
  InteractivePopoutFolder,
  type InteractivePopoutFolderHandle,
  type FolderImageItem,
} from '@/components/ui/popout-folder';

export function ProjectMediaFolder() {
  const folderRef = useRef<InteractivePopoutFolderHandle>(null);

  const handleOpen = (image: FolderImageItem) => {
    console.log('Opened image:', image.title);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 1rem' }}>
      <InteractivePopoutFolder
        ref={folderRef}
        title="Visual Captures"
        variant="cobalt-studio"
        size="md"
        soundEnabled={true}
        onImageOpen={handleOpen}
      />
    </div>
  );
}`,
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'title',
      type: 'string',
      defaultValue: "'Visual Captures'",
      description: 'Folder label displayed on the front pocket.',
    },
    {
      name: 'images',
      type: 'FolderImageItem[]',
      defaultValue: 'DEFAULT_FOLDER_IMAGES',
      description: 'Array of image objects with id, src, title, and optional subtitle.',
    },
    {
      name: 'variant',
      type: "'cobalt-studio' | 'obsidian-glass' | 'porcelain-frost' | 'amber-archive'",
      defaultValue: "'cobalt-studio'",
      description: 'Folder material theme and finish.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: 'Folder and fanned photo card dimensions.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Keeps the folder fanned open initially without requiring hover.',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Enables Web Audio acoustic ticks on folder toggle and image open.',
    },
    {
      name: 'compact',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Compact non-overflowing mode for Explorer catalog cards.',
    },
    {
      name: 'onImageOpen',
      type: '(image: FolderImageItem, index: number) => void',
      defaultValue: 'undefined',
      description: 'Callback fired when a fanned image card is clicked to open the lightbox.',
    },
  ],
  features: [
    '3D Perspective Pocket Flap: Front pocket tilts open in 3D space with spring easing on hover or click.',
    'Fanned Photo Cards: Up to 3 photo thumbnails fan outward in a balanced radial arc with hover elevation.',
    'Click-to-Open Lightbox Viewer: Clicking any image launches a modal lightbox with prev/next stepping and metadata.',
    'Four Material Finishes: Cobalt Studio, Obsidian Glass, Porcelain Frost, and Amber Archive.',
    'Web Audio Acoustics: Synthesized paper-pocket open and shutter-focus ticks.',
    'Zero External Dependencies: Pure standard CSS custom properties and React 19 forwardRef handle.',
  ],
  accessibilityNotes: [
    'Folder shell exposes role="button" and aria-expanded with Enter/Space keyboard toggle support.',
    'Each fanned photo card is an accessible <button> with descriptive "Open image ..." labels.',
    'Lightbox renders as role="dialog" aria-modal="true" and supports Escape, ArrowLeft, and ArrowRight keys.',
    'Respects prefers-reduced-motion media query by disabling fan and modal animations.',
  ],
};
