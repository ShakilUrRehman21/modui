import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/page-turn/PageTurnBook.tsx?raw';
import rawCssCode from '../../components/ui/page-turn/PageTurnBook.css?raw';

export const pageTurnBookItem: ComponentRegistryItem = {
  id: 'page-turn-book',
  slug: 'page-turn-book',
  name: '3D Page Turn Book',
  description:
    'Hardware-accelerated 3D dual-page book featuring tactile paper folding geometry, dynamic subsurface specular sheen, interactive drag-to-peel corners, and synthesized Web Audio paper rustle DSP.',
  category: '3D & Interactive Showcase',
  tags: [
    '3D Book',
    'Page Turn',
    'Paper Fold',
    'Editorial',
    'Tactile Physics',
    'Web Audio DSP',
    'Interactive Spread',
    'Hardware Compositing',
  ],
  status: 'published',
  publishedAt: '2026-11-07',
  updatedAt: '2026-11-07',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/page-turn/PageTurnBook.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/tree/main/src/components/ui/page-turn',
  codeSnippet: `import { PageTurnBook } from '@/components/ui/page-turn';

export function PageTurnDemo() {
  return (
    <PageTurnBook
      variant="studio-editorial"
      soundEnabled={true}
      interactiveCurl={true}
      autoPlay={false}
    />
  );
}`,
  installSnippet: 'npm install react react-dom',
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'pages',
      type: 'PageItem[]',
      defaultValue: 'DEFAULT_BOOK_PAGES',
      description: 'Array of page data objects including chapter, title, subtitle, prose body, quote, and metrics.',
    },
    {
      name: 'variant',
      type: "'studio-editorial' | 'dark-obsidian' | 'blueprint'",
      defaultValue: "'studio-editorial'",
      description: 'Visual theme styling the book covers, paper grain, typography, and spine illumination.',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Whether to play real-time synthesized Web Audio paper rustle noise bursts upon turning leaves.',
    },
    {
      name: 'autoPlay',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Automatically flip through spreads on a continuous timed interval.',
    },
    {
      name: 'autoPlayInterval',
      type: 'number',
      defaultValue: '4500',
      description: 'Delay between automatic page flips in milliseconds.',
    },
    {
      name: 'interactiveCurl',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows an interactive corner peel triangle on the bottom-right corner that curls on hover.',
    },
    {
      name: 'onPageChange',
      type: '(currentSpreadIndex: number) => void',
      defaultValue: 'undefined',
      description: 'Callback fired whenever the user or autoplay transitions to a new spread.',
    },
    {
      name: 'className',
      type: 'string',
      defaultValue: "''",
      description: 'Optional additional CSS classes for the root book container.',
    },
    {
      name: 'style',
      type: 'React.CSSProperties',
      defaultValue: 'undefined',
      description: 'Optional inline style overrides for the outer container.',
    },
  ],
  accessibilityNotes: [
    'Accessible region landmark with aria-label="3D Interactive Page Turn Book".',
    'Navigation controls provided with descriptive aria-label attributes and disabled state indications.',
    'Full keyboard navigation support via Left and Right Arrow keys.',
    'Book spine and non-semantic ambient overlays marked with aria-hidden="true".',
    'Spread progress dots adhere to ARIA tablist/tab accessibility patterns with aria-selected.',
  ],
  features: [
    'Hardware-accelerated CSS 3D transforms with perspective and dynamic dual-sided leaf rotation',
    'Dynamic subsurface specular sheen and ambient occlusion spine shadows during leaf turning',
    'Interactive pointer drag to peel back leaves in real-time with threshold snapping',
    'Corner peel curl hover trigger with drop-shadow triangle fold',
    'Synthesized Web Audio DSP paper rustle noise bursts with resonant bandpass filter sweeps',
    '3 distinctive aesthetic editions: Studio Editorial, Dark Obsidian, and Blueprint Tech',
    'Full responsiveness with single-leaf view adaptation on mobile viewports',
  ],
};
