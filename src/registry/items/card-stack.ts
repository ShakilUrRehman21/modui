import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/card-stack/CardStack.tsx?raw';
import rawCssCode from '../../components/ui/card-stack/CardStack.css?raw';

export const cardStackItem: ComponentRegistryItem = {
    id: 'card-stack',
    slug: 'card-stack',
    name: 'Card Stack',
    description:
      'Layered 3D card deck featuring calculated perspective offsets, smooth hover fan spread, tactile card fling cycle animations, and synthesized Web Audio acoustic haptics.',
    category: '3D & Interactive Showcase',
    tags: [
      'Card Stack',
      '3D Layering',
      'Showcase',
      'Physics',
      'Interactive',
      'Fan Spread',
      'Web Audio',
      'Testimonials',
    ],
    status: 'published',
    publishedAt: '2026-10-26',
    updatedAt: '2026-10-26',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/card-stack/CardStack.tsx',
    githubUrl:
      'https://github.com/ShakilUrRehman21/modui/tree/main/src/components/ui/card-stack',
    codeSnippet: `import { CardStack } from '@/components/ui/card-stack';

export function CardStackDemo() {
  return (
    <CardStack
      variant="studio-light"
      fanOutOnHover={true}
      soundEnabled={true}
    />
  );
}`,
    installSnippet: 'npm install react react-dom',
    rawSourceCode,
    rawCssCode,
    propsDoc: [
      {
        name: 'items',
        type: 'CardStackItem[]',
        defaultValue: 'DEFAULT_STACK_ITEMS',
        description: 'Array of card objects containing title, description, category, author, and optional action handlers.',
      },
      {
        name: 'variant',
        type: "'studio-light' | 'warm-editorial' | 'glass-frost' | 'cinema-dark'",
        defaultValue: "'studio-light'",
        description: 'Visual surface theme and shadow depth aesthetic.',
      },
      {
        name: 'fanOutOnHover',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Enables rotational fan spread and perspective elevation when hovering over the card stack.',
      },
      {
        name: 'soundEnabled',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Synthesizes tactile card flick and page-turn ticks via native Web Audio oscillators.',
      },
      {
        name: 'compact',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Compact card mode optimized for catalogue cards and preview containers.',
      },
      {
        name: 'activeIndex',
        type: 'number',
        description: 'Controlled active top card index.',
      },
      {
        name: 'onCardChange',
        type: '(item: CardStackItem, index: number) => void',
        description: 'Callback invoked when the active top card changes.',
      },
    ],
    accessibilityNotes: [
      'Accessible region landmark with aria-label="Card Stack".',
      'Top card operates as an accessible button with descriptive label indicating card number and headline.',
      'Keyboard navigation supports ArrowRight/Space/Enter to cycle forward and ArrowLeft to cycle backward.',
      'Background cards are properly marked with aria-hidden="true" to prevent redundant screen reader focus.',
      'Dot indicators support tablist and tab accessibility standards with aria-selected states.',
    ],
    features: [
      'Calculated 3D perspective layering with scale, elevation, and opacity falloff',
      'Interactive rotational fan spread revealing background cards on hover or focus',
      'Satisfying fling spring physics sending the top card to the back of the deck',
      'Synthesized tactile paper snap and card flick acoustic feedback via Web Audio API',
      'Dot indicators and previous/next navigation buttons with accessible keyboard controls',
      '4 curated studio themes: Studio Light, Warm Editorial, Glass Frost, and Cinema Dark',
    ],
  };
