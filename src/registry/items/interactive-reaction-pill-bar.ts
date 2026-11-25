import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/reaction-pill-bar/InteractiveReactionPillBar.tsx?raw';
import rawCssCode from '../../components/ui/reaction-pill-bar/InteractiveReactionPillBar.css?raw';

export const interactiveReactionPillBarItem: ComponentRegistryItem = {
  id: 'interactive-reaction-pill-bar',
  slug: 'interactive-reaction-pill-bar',
  name: 'Interactive Reaction Pill Bar',
  description:
    'Multiplayer emoji reaction dock featuring spring-bounce toggle pills, rolling tabular counters, floating micro-spark activations, quick-add emoji popover, hover reactor tooltips, and ascending Web Audio marimba pop acoustics.',
  category: 'Buttons and Actions',
  tags: [
    'reactions',
    'emoji',
    'collaboration',
    'slack',
    'linear',
    'pills',
    'counter',
    'popover',
    'haptics',
    'multiplayer',
  ],
  status: 'published',
  publishedAt: '2026-11-25',
  updatedAt: '2026-11-25',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/reaction-pill-bar/InteractiveReactionPillBar.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/reaction-pill-bar/InteractiveReactionPillBar.tsx',
  installSnippet: `// 1. Copy InteractiveReactionPillBar.tsx and InteractiveReactionPillBar.css into your project:
import { InteractiveReactionPillBar } from '@/components/ui/reaction-pill-bar';`,
  codeSnippet: `import React, { useRef } from 'react';
import {
  InteractiveReactionPillBar,
  type InteractiveReactionPillBarHandle,
  type ReactionItem,
} from '@/components/ui/reaction-pill-bar';

export function ActivityReactionDock() {
  const dockRef = useRef<InteractiveReactionPillBarHandle>(null);

  const handleToggle = (item: ReactionItem) => {
    console.log('Reaction toggled:', item.emoji, item.count, item.reacted);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
      <InteractiveReactionPillBar
        ref={dockRef}
        variant="studio-obsidian"
        size="md"
        soundEnabled={true}
        showAddButton={true}
        onReactionToggle={handleToggle}
      />
    </div>
  );
}`,
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'reactions',
      type: 'ReactionItem[]',
      defaultValue: 'undefined',
      description: 'Controlled array of reaction items.',
    },
    {
      name: 'defaultReactions',
      type: 'ReactionItem[]',
      defaultValue: 'DEFAULT_REACTIONS',
      description: 'Initial uncontrolled list of emoji reactions and counts.',
    },
    {
      name: 'pickerEmojis',
      type: 'Array<{ emoji: string; label: string }>',
      defaultValue: 'DEFAULT_PICKER_EMOJIS',
      description: 'Emoji options displayed in the quick-add popover menu.',
    },
    {
      name: 'variant',
      type: "'studio-obsidian' | 'clean-porcelain' | 'cyber-neon' | 'warm-editorial'",
      defaultValue: "'studio-obsidian'",
      description: 'Visual material colorway and surface styling.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: 'Pill scale preset.',
    },
    {
      name: 'frameless',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Removes outer container surface for inline embedding inside messages or cards.',
    },
    {
      name: 'showAddButton',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows the + trigger button and quick-add emoji popover.',
    },
    {
      name: 'showTooltips',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Displays hover tooltips listing users who reacted.',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Enables native Web Audio API marimba pop acoustics on toggle and add.',
    },
    {
      name: 'readOnly',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Disables interactive toggling and hides the add button.',
    },
    {
      name: 'compact',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Compact non-overflowing mode for Explorer catalog cards.',
    },
    {
      name: 'onReactionToggle',
      type: '(item: ReactionItem, allReactions: ReactionItem[]) => void',
      defaultValue: 'undefined',
      description: 'Callback fired whenever a reaction is toggled or newly added.',
    },
    {
      name: 'onChange',
      type: '(reactions: ReactionItem[]) => void',
      defaultValue: 'undefined',
      description: 'Callback fired with the updated reactions list.',
    },
  ],
  features: [
    'Spring-Bounce Reaction Pills: Elastic scale deformation and active glow when toggling reactions.',
    'Rolling Tabular Counters: Numeric badges animate cleanly with tabular-nums alignment.',
    'Floating Spark Pop: Activated pills emit a subtle upward floating emoji spark.',
    'Quick-Add Emoji Popover: Accessible menu popover for appending new reactions on the fly.',
    'Hover Reactor Tooltips: Displays contributing teammates and reaction labels on hover/focus.',
    'Web Audio Marimba Pop Acoustics: Synthesized ascending/descending sine pops with zero external audio files.',
    'Zero External Dependencies: Pure standard CSS custom properties and React 19 forwardRef handle.',
  ],
  accessibilityNotes: [
    'Root container exposes role="group" with aria-label="Emoji Reactions".',
    'Each reaction pill uses native <button> with aria-pressed state and descriptive count label.',
    'Quick-add trigger exposes aria-haspopup="menu" and aria-expanded, and closes on Escape or outside click.',
    'Respects prefers-reduced-motion media query by disabling bounce, roll, and spark animations.',
  ],
};
