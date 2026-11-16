import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/tactile-step-wizard/TactileStepWizard.tsx?raw';
import rawCssCode from '../../components/ui/tactile-step-wizard/TactileStepWizard.css?raw';

export const tactileStepWizardItem: ComponentRegistryItem = {
  id: 'tactile-step-wizard',
  slug: 'tactile-step-wizard',
  name: 'Tactile Step Wizard',
  description:
    'Production-grade multi-step form and onboarding wizard orchestrator. Features connected progress track nodes, step validation, fluid slide transitions, keyboard shortcuts (Enter to advance, Cmd/Ctrl+Backspace to return), and acoustic haptics.',
  category: 'Buttons and Actions',
  tags: [
    'wizard',
    'stepper',
    'multi-step',
    'form',
    'onboarding',
    'checkout',
    'validation',
    'haptics',
    'web-audio',
  ],
  status: 'published',
  publishedAt: '2026-11-16',
  updatedAt: '2026-11-16',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/tactile-step-wizard/TactileStepWizard.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/tactile-step-wizard/TactileStepWizard.tsx',
  installSnippet: `// 1. Copy TactileStepWizard.tsx and TactileStepWizard.css into your project:
import { TactileStepWizard } from '@/components/ui/tactile-step-wizard';`,
  codeSnippet: `import React from 'react';
import { TactileStepWizard } from '@/components/ui/tactile-step-wizard';

const steps = [
  {
    id: 'account',
    title: 'Account',
    description: 'Personal details',
    content: <div>Account Configuration Form</div>,
  },
  {
    id: 'workspace',
    title: 'Workspace',
    description: 'Domain and cloud region',
    content: <div>Workspace Settings Form</div>,
  },
  {
    id: 'launch',
    title: 'Review',
    description: 'Pre-flight check',
    content: <div>Review & Deployment</div>,
  },
];

export function WizardDemo() {
  return (
    <TactileStepWizard
      steps={steps}
      variant="studio"
      orientation="horizontal"
      linear={true}
      soundEnabled={true}
      onComplete={() => alert('Wizard completed!')}
    />
  );
}`,
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'steps',
      type: 'WizardStep[]',
      description: 'Array of step definitions containing id, title, description, content, and optional validator.',
      required: true,
    },
    {
      name: 'currentStep',
      type: 'number',
      description: 'Controlled active step index (0-indexed).',
    },
    {
      name: 'defaultStep',
      type: 'number',
      defaultValue: '0',
      description: 'Initial step index for uncontrolled mode.',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical' | 'minimal'",
      defaultValue: "'horizontal'",
      description: 'Layout arrangement for the stepper track (top header, sidebar, or minimal bar).',
    },
    {
      name: 'variant',
      type: "'studio' | 'editorial' | 'emerald' | 'minimal'",
      defaultValue: "'studio'",
      description: 'Visual finish and color theme.',
    },
    {
      name: 'linear',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Enforce sequential progression; prevents skipping uncompleted future steps.',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Enable synthesized mechanical solenoid and harmonic chime audio feedback.',
    },
    {
      name: 'compact',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Compact scaling for catalog card previews and dense layouts.',
    },
    {
      name: 'onStepChange',
      type: '(nextIndex: number, prevIndex: number, step: WizardStep) => void',
      description: 'Callback fired whenever the active step changes.',
    },
    {
      name: 'onComplete',
      type: '() => void',
      description: 'Callback fired when the user completes the final step.',
    },
    {
      name: 'nextLabel',
      type: 'string',
      defaultValue: "'Next Step'",
      description: 'Custom label for the next action button.',
    },
    {
      name: 'prevLabel',
      type: 'string',
      defaultValue: "'Previous'",
      description: 'Custom label for the previous action button.',
    },
    {
      name: 'completeLabel',
      type: 'string',
      defaultValue: "'Complete Setup'",
      description: 'Custom label for the final completion button.',
    },
  ],
  features: [
    'Connected Progress Track: Dynamic SVG / CSS track line with fluid fill percentage matching current step index.',
    'Step Validation Engine: Supports synchronous and async validate() step functions with error shake animation on failure.',
    'Directional Slide Transitions: Automatically determines whether to slide content forward or backward based on target step.',
    '3 Track Orientations: Top horizontal track, vertical sidebar track for multi-column wizards, and minimal segmented progress bar.',
    '4 Architectural Finishes: Studio (Porcelain/Cobalt), Editorial (Titanium/Neon), Emerald (Fintech), and Minimal (Monochrome).',
    'Synthesized Web Audio Haptics: Zero-asset audio synthesizers for advance clicks, back latch releases, and completion chimes.',
    'Accessible Keyboard Navigation: Full Enter/Cmd+Enter advance, Cmd+Backspace / Alt+Left return, and ARIA tablist semantics.',
  ],
  accessibilityNotes: [
    'Renders with role="region" and aria-label="Interactive Step Wizard".',
    'Stepper navigation uses role="tablist" with individual buttons having role="tab", aria-selected, and aria-current="step".',
    'Active step content is wrapped in role="tabpanel" with dynamic aria-labelledby linkage.',
    'Counter status is announced via aria-live="polite", and all transitions respect prefers-reduced-motion.',
  ],
};
