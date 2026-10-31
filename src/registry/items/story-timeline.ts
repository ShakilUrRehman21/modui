import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/story-timeline/StoryTimeline.tsx?raw';
import rawCssCode from '../../components/ui/story-timeline/StoryTimeline.css?raw';

export const storyTimelineItem: ComponentRegistryItem = {
  id: 'story-timeline',
  slug: 'story-timeline',
  name: 'Instagram Story Timeline',
  description:
    'Authentic Instagram-style story reel featuring 9:16 smartphone viewport card, top segmented progress bars, 3D desktop carousel stage, tap left/right navigation, long-press to pause, interactive voting polls, emoji reaction sliders, music visualizer stickers, and flying heart physics.',
  category: '3D & Interactive Showcase',
  tags: [
    'Story',
    'Instagram',
    'Timeline',
    'Reel',
    'Interactive',
    'Stickers',
    'Polls',
    'Audio',
    'Showcase',
  ],
  status: 'published',
  publishedAt: '2026-10-31',
  updatedAt: '2026-10-31',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/story-timeline/StoryTimeline.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/tree/main/src/components/ui/story-timeline',
  codeSnippet: `import { StoryTimeline } from '@/components/ui/story-timeline';

export function StoryReelDemo() {
  return (
    <StoryTimeline
      variant="instagram-dark"
      username="modui.studio"
      handle="Dieter Rams × Web Audio"
      autoPlay={true}
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
      type: "'instagram-dark' | 'editorial-paper' | 'cyber-neon' | 'studio-mono'",
      defaultValue: "'instagram-dark'",
      description: 'Visual color styling and bezel theme.',
    },
    {
      name: 'stories',
      type: 'StorySlide[]',
      defaultValue: 'DEFAULT_STORIES',
      description: 'Array of story slides with titles, gradients, timestamps, and interactive stickers.',
    },
    {
      name: 'username',
      type: 'string',
      defaultValue: "'modui.studio'",
      description: 'Profile username displayed in the top story header.',
    },
    {
      name: 'handle',
      type: 'string',
      defaultValue: "'Dieter Rams × Web Audio'",
      description: 'Profile handle or subtitle displayed under username.',
    },
    {
      name: 'autoPlay',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Auto-advance stories via top segmented progress timers.',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Synthesizes acoustic story advance ticks, poll voting pops, and heart chimes.',
    },
    {
      name: 'onStoryChange',
      type: '(story: StorySlide, index: number) => void',
      description: 'Callback fired when active story slide changes.',
    },
    {
      name: 'onPollVote',
      type: '(storyId: string, optionId: string) => void',
      description: 'Callback fired when user clicks an option in an interactive poll sticker.',
    },
  ],
  accessibilityNotes: [
    'Accessible region landmark with aria-label="Instagram-Style Story Timeline".',
    'Top segmented progress bars operate as an accessible progressbar with aria-valuenow.',
    'Full keyboard navigation: ArrowRight / Space to advance, ArrowLeft to go back, P to toggle pause, M to toggle sound.',
    'Interactive poll buttons and action buttons maintain WCAG AA visible focus indicators.',
    'Reduced motion preferences safely disable flying heart particles and progress bar transitions.',
  ],
  features: [
    'Authentic 9:16 smartphone card viewport with 3D desktop carousel side cards',
    'Instagram signature segmented progress bar strip at the top with auto-advancing timers',
    'Tap right half to advance, tap left half to go back',
    'Press and hold / pointer-down to pause story and hide UI overlays (just like Instagram)',
    'Interactive poll voting sticker with live animated percentage reveals and celebration audio',
    'Interactive emoji reaction slider with draggable thumb',
    'Flying floating heart reaction particle effects with Web Audio acoustic chime',
    '4 curated visual themes: Instagram Dark, Editorial Paper, Cyber Neon, and Studio Mono',
  ],
};
