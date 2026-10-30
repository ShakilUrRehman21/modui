import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/timeline/TimelineRoadmap.tsx?raw';
import rawCssCode from '../../components/ui/timeline/TimelineRoadmap.css?raw';

export const timelineRoadmapItem: ComponentRegistryItem = {
    id: 'timeline-roadmap',
    slug: 'timeline-roadmap',
    name: 'Timeline Roadmap',
    description:
      'Continuous progress spine connecting interactive milestone cards with status indicators, responsive vertical or horizontal layouts, keyboard navigation, and synthesized acoustic latch haptics.',
    category: '3D & Interactive Showcase',
    tags: [
      'Timeline',
      'Roadmap',
      'Changelog',
      'Milestones',
      'Progress',
      'Interactive',
      'Navigation',
      'Showcase',
    ],
    status: 'published',
    publishedAt: '2026-10-27',
    updatedAt: '2026-10-27',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/timeline/TimelineRoadmap.tsx',
    githubUrl:
      'https://github.com/ShakilUrRehman21/modui/tree/main/src/components/ui/timeline',
    codeSnippet: `import { TimelineRoadmap } from '@/components/ui/timeline';

export function RoadmapDemo() {
  return (
    <TimelineRoadmap
      variant="studio-light"
      orientation="vertical"
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
        type: 'TimelineMilestone[]',
        defaultValue: 'DEFAULT_ROADMAP_ITEMS',
        description: 'Array of milestone objects containing date, title, description, status, and tag.',
      },
      {
        name: 'variant',
        type: "'studio-light' | 'warm-editorial' | 'minimal-mono' | 'cinema-dark'",
        defaultValue: "'studio-light'",
        description: 'Visual surface theme and status accent palette.',
      },
      {
        name: 'orientation',
        type: "'vertical' | 'horizontal'",
        defaultValue: "'vertical'",
        description: 'Layout flow orientation for milestone nodes and cards.',
      },
      {
        name: 'activeId',
        type: 'string',
        description: 'Controlled active milestone identifier.',
      },
      {
        name: 'onSelectMilestone',
        type: '(item: TimelineMilestone, index: number) => void',
        description: 'Callback fired when a milestone is selected via click or keyboard.',
      },
      {
        name: 'soundEnabled',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Synthesizes acoustic latch micro-clicks via native Web Audio oscillators.',
      },
      {
        name: 'compact',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Compact horizontal preview mode optimized for catalogue cards.',
      },
    ],
    accessibilityNotes: [
      'Accessible region landmark with aria-label="Timeline Roadmap".',
      'Each milestone node operates as an accessible button with descriptive label indicating title, date, and status.',
      'Active milestone is explicitly conveyed with aria-pressed="true".',
      'Keyboard navigation supports Arrow keys to step through milestones, plus Home and End keys.',
      'Decorative spine lines and tracks are properly marked with aria-hidden="true".',
    ],
    features: [
      'Continuous progress spine dynamically filling up to the active milestone',
      'Dual layout modes: responsive vertical changelog or horizontal milestone track',
      'Interactive milestone cards with status indicators (Shipped, In Progress, Planned)',
      'Synthesized mechanical latch tick acoustic feedback via Web Audio API',
      'Full keyboard navigation with Arrow keys, Home, and End support',
      '4 curated studio themes: Studio Light, Warm Editorial, Minimal Mono, and Cinema Dark',
    ],
  };
