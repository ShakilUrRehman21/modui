import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/live-avatar-stack/InteractiveLiveAvatarStack.tsx?raw';
import rawCssCode from '../../components/ui/live-avatar-stack/InteractiveLiveAvatarStack.css?raw';

export const interactiveLiveAvatarStackItem: ComponentRegistryItem = {
  id: 'interactive-live-avatar-stack',
  slug: 'interactive-live-avatar-stack',
  name: 'Interactive Live Avatar Stack',
  description:
    'Multiplayer live presence and elastic peer capsule stack featuring overlapping avatar bubbles with spring expansion on hover, live pulsating status rings, rich hover inspection tooltips, overflow counters, and synthesized chime haptics.',
  category: 'Status & Indicators',
  tags: [
    'avatar',
    'multiplayer',
    'presence',
    'live',
    'collaboration',
    'figma',
    'notion',
    'linear',
    'status',
    'haptics',
  ],
  status: 'published',
  publishedAt: '2026-11-22',
  updatedAt: '2026-11-22',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/live-avatar-stack/InteractiveLiveAvatarStack.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/live-avatar-stack/InteractiveLiveAvatarStack.tsx',
  installSnippet: `// 1. Copy InteractiveLiveAvatarStack.tsx and InteractiveLiveAvatarStack.css into your project:
import { InteractiveLiveAvatarStack } from '@/components/ui/live-avatar-stack';`,
  codeSnippet: `import React, { useRef } from 'react';
import {
  InteractiveLiveAvatarStack,
  type InteractiveLiveAvatarStackHandle,
  type TeammatePresence,
} from '@/components/ui/live-avatar-stack';

export function LiveDocumentCollaborators() {
  const stackRef = useRef<InteractiveLiveAvatarStackHandle>(null);

  const handleInvite = () => {
    stackRef.current?.addTeammate({
      id: \`user-\${Date.now()}\`,
      name: 'Niko Vance',
      initials: 'NV',
      role: 'Full Stack Engineer',
      activity: 'Reviewing PR #49',
      status: 'online',
      latencyMs: 19,
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
      <InteractiveLiveAvatarStack
        ref={stackRef}
        variant="studio-glass"
        size="md"
        maxVisible={4}
        showStatusRings={true}
        showTooltips={true}
        showInviteButton={true}
        onInviteClick={handleInvite}
      />
    </div>
  );
}`,
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'teammates',
      type: 'TeammatePresence[]',
      defaultValue: 'DEFAULT_TEAMMATES',
      description: 'Array of live collaborator presence records.',
    },
    {
      name: 'variant',
      type: "'studio-glass' | 'clean-porcelain' | 'cyber-neon' | 'warm-editorial'",
      defaultValue: "'studio-glass'",
      description: 'Chassis material theme and colorway.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: 'Avatar bubble diameter scale (32px, 44px, 56px).',
    },
    {
      name: 'maxVisible',
      type: 'number',
      defaultValue: '4',
      description: 'Maximum visible bubbles rendered before triggering the +N overflow pill.',
    },
    {
      name: 'expanded',
      type: 'boolean',
      defaultValue: 'undefined',
      description: 'Controlled horizontal spread state for avatars.',
    },
    {
      name: 'showStatusRings',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Whether to render online, idle, and presenting indicator dots.',
    },
    {
      name: 'showTooltips',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Whether to reveal rich activity and latency popover tooltips on hover.',
    },
    {
      name: 'showInviteButton',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Whether to display the circular + invite collaborator button.',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Whether to play synthesized Web Audio chime and bubble pop acoustics.',
    },
    {
      name: 'compact',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Compact density mode for explorer cards or preview containers.',
    },
    {
      name: 'onTeammateClick',
      type: '(teammate: TeammatePresence) => void',
      defaultValue: 'undefined',
      description: 'Callback fired when an individual avatar is clicked or activated.',
    },
    {
      name: 'onInviteClick',
      type: '() => void',
      defaultValue: 'undefined',
      description: 'Callback fired when the invite teammate button is clicked.',
    },
    {
      name: 'onOverflowClick',
      type: '(hiddenTeammates: TeammatePresence[]) => void',
      defaultValue: 'undefined',
      description: 'Callback fired when the +N overflow pill is clicked.',
    },
  ],
  accessibilityNotes: [
    'Capsule container provides role="group" and aria-label="Multiplayer Live Teammate Presence Stack".',
    'Each avatar item provides role="button", tabIndex={0}, and an accessible aria-label with name and status.',
    'Tooltips provide role="tooltip" with clear user metadata and real-time activity status.',
    'All interactive controls support keyboard activation via Enter and Space keys.',
  ],
  features: [
    'Elastic spring-physics expansion spreading avatars horizontally on hover',
    'Multiplayer presence indicator dots with animated presenting pulses',
    'Rich hover inspection popovers displaying teammate role, active file/section, and ping latency',
    '+N overflow counter pill calculating hidden collaborators dynamically',
    'Synthesized Web Audio API acoustic chimes for peer join and bubble pop transitions',
    '4 curated themes: Studio Glass, Clean Porcelain, Cyber Neon, and Warm Editorial',
    'Imperative ref handle to add, remove, and update collaborator presence in real time',
  ],
};
