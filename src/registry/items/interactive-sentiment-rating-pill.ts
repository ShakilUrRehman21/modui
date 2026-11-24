import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/sentiment-rating-pill/InteractiveSentimentRatingPill.tsx?raw';
import rawCssCode from '../../components/ui/sentiment-rating-pill/InteractiveSentimentRatingPill.css?raw';

export const interactiveSentimentRatingPillItem: ComponentRegistryItem = {
  id: 'interactive-sentiment-rating-pill',
  slug: 'interactive-sentiment-rating-pill',
  name: 'Interactive Sentiment Rating Pill',
  description:
    'Tactile customer sentiment and CSAT/NPS feedback scrubber featuring fluid elastic track transitions, expressive squash-and-stretch avatar emojis, temperature-responsive aura glow, qualitative tags drawer, and synthesized pentatonic musical chime arpeggios.',
  category: 'Buttons and Actions',
  tags: [
    'sentiment',
    'rating',
    'pill',
    'csat',
    'nps',
    'feedback',
    'emoji',
    'scrubber',
    'haptics',
    'audio',
    'pentatonic',
    'promoter',
  ],
  status: 'published',
  publishedAt: '2026-11-24',
  updatedAt: '2026-11-24',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/sentiment-rating-pill/InteractiveSentimentRatingPill.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/sentiment-rating-pill/InteractiveSentimentRatingPill.tsx',
  installSnippet: `// 1. Copy InteractiveSentimentRatingPill.tsx and InteractiveSentimentRatingPill.css into your project:
import { InteractiveSentimentRatingPill } from '@/components/ui/sentiment-rating-pill';`,
  codeSnippet: `import React, { useRef } from 'react';
import {
  InteractiveSentimentRatingPill,
  type InteractiveSentimentRatingPillHandle,
  type SentimentTier,
} from '@/components/ui/sentiment-rating-pill';

export function CustomerFeedbackSection() {
  const ratingRef = useRef<InteractiveSentimentRatingPillHandle>(null);

  const handleRatingChange = (rating: number, tier: SentimentTier) => {
    console.log('User Rating:', rating, tier.title, tier.category);
  };

  const handleFeedbackSubmit = (data: unknown) => {
    console.log('Feedback Submitted:', data);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
      <InteractiveSentimentRatingPill
        ref={ratingRef}
        defaultValue={5}
        variant="studio-obsidian"
        size="md"
        soundEnabled={true}
        showFeedbackDrawer={true}
        onChange={handleRatingChange}
        onSubmitFeedback={handleFeedbackSubmit}
      />
    </div>
  );
}`,
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'value',
      type: 'number',
      defaultValue: 'undefined',
      description: 'Controlled rating value between 1 and 5.',
    },
    {
      name: 'defaultValue',
      type: 'number',
      defaultValue: '5',
      description: 'Initial uncontrolled rating value (1 to 5).',
    },
    {
      name: 'tiers',
      type: 'SentimentTier[]',
      defaultValue: 'DEFAULT_SENTIMENT_TIERS',
      description: 'Array of custom sentiment tiers with titles, descriptions, emojis, colors, and audio frequencies.',
    },
    {
      name: 'variant',
      type: "'studio-obsidian' | 'clean-porcelain' | 'cyber-neon' | 'warm-editorial'",
      defaultValue: "'studio-obsidian'",
      description: 'Visual material chassis theme and surface styling.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: 'Proportion scale: sm (modal inline), md (standard card), lg (prominent hero survey).',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Enables native Web Audio API pentatonic chime arpeggios (261.63Hz - 523.25Hz).',
    },
    {
      name: 'showAvatar',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Displays the squash-and-stretch dynamic sentiment avatar emoji with temperature glow aura.',
    },
    {
      name: 'showLabels',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows title, category badge (detractor / passive / promoter), and descriptive subtitle.',
    },
    {
      name: 'showTelemetry',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Renders live CSAT and NPS percentage status telemetry badges.',
    },
    {
      name: 'showFeedbackDrawer',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Expands qualitative tags grid and optional commentary textarea.',
    },
    {
      name: 'readOnly',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Disables user pointer scrub and keyboard interaction for display-only contexts.',
    },
    {
      name: 'compact',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Compact non-overflowing mode optimized for catalog preview cards.',
    },
    {
      name: 'onChange',
      type: '(rating: number, tier: SentimentTier) => void',
      defaultValue: 'undefined',
      description: 'Callback fired when rating is selected or dragged to a new tier.',
    },
    {
      name: 'onSubmitFeedback',
      type: '(submission: FeedbackSubmission) => void',
      defaultValue: 'undefined',
      description: 'Callback fired when the user submits rating, selected tags, and commentary.',
    },
  ],
  features: [
    'Fluid Elastic Pill Indicator: Hardware-accelerated sliding background pill that translates with non-linear spring physics.',
    'Squash-and-Stretch Avatar Motion: Expressive emoji avatar with physics-informed deformation and color temperature glow.',
    'Continuous Pointer Scrubbing: Click or scrub smoothly across the pill track with instant segment snapping.',
    'Pentatonic Synthesizer DSP: Crystal-clear pentatonic scale chimes (C4, D4, E4, G4, C5) synthesized natively via Web Audio API oscillators.',
    'Qualitative Tags & Drawer: Integrated attribute feedback tags and optional detail notes for in-depth CSAT collection.',
    'Four Production Colorways: Studio Obsidian, Clean Porcelain, Cyber Neon, and Warm Editorial.',
    'Zero External Dependencies: Built strictly with pure standard CSS custom properties and native React 19 APIs.',
  ],
  accessibilityNotes: [
    'Container exposes role="radiogroup" with aria-valuenow, aria-valuemin="1", aria-valuemax="5", and descriptive aria-label.',
    'Each rating step is marked as role="radio" with aria-checked and comprehensive descriptive label.',
    'Full keyboard navigation: Arrow keys for step navigation, Home/End for extremes, and 1-5 number keys for direct jump.',
    'Accessible color contrast ratios maintained across all visual themes and active states.',
    'Respects prefers-reduced-motion media query by disabling scale and squash animations.',
  ],
};
