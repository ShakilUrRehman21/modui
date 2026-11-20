import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/signature-pad/InteractiveSignaturePad.tsx?raw';
import rawCssCode from '../../components/ui/signature-pad/InteractiveSignaturePad.css?raw';

export const interactiveSignaturePadItem: ComponentRegistryItem = {
  id: 'interactive-signature-pad',
  slug: 'interactive-signature-pad',
  name: 'Interactive Signature Pad',
  description:
    'Studio-grade vector ink signature canvas with velocity-responsive stroke tapering, legal baseline guide, undo/redo stroke history, executive ink palette, and literal PNG image export with whitespace trimming.',
  category: 'Buttons and Actions',
  tags: [
    'signature',
    'canvas',
    'vector-ink',
    'export-png',
    'docusign',
    'legal',
    'checkout',
    'onboarding',
    'contracts',
    'haptics',
  ],
  status: 'published',
  publishedAt: '2026-11-20',
  updatedAt: '2026-11-20',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/signature-pad/InteractiveSignaturePad.tsx',
  githubUrl:
    'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/signature-pad/InteractiveSignaturePad.tsx',
  installSnippet: `// 1. Copy InteractiveSignaturePad.tsx and InteractiveSignaturePad.css into your project:
import { InteractiveSignaturePad } from '@/components/ui/signature-pad';`,
  codeSnippet: `import React, { useRef } from 'react';
import {
  InteractiveSignaturePad,
  InteractiveSignaturePadHandle,
} from '@/components/ui/signature-pad';

export function LegalContractCheckout() {
  const sigRef = useRef<InteractiveSignaturePadHandle>(null);

  const handleExport = (dataUrl: string, blob: Blob | null) => {
    console.log('Exported signature:', dataUrl);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
      <InteractiveSignaturePad
        ref={sigRef}
        variant="executive-dark"
        size="md"
        title="Authorized Signer Signature"
        onExport={handleExport}
      />
    </div>
  );
}`,
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'variant',
      type: "'executive-dark' | 'parchment-legal' | 'porcelain-clean' | 'cyber-matrix'",
      defaultValue: "'executive-dark'",
      description: 'Chassis material theme and colorway.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: 'Physical scale sizing preset.',
    },
    {
      name: 'strokeColor',
      type: 'string',
      description: 'Initial or active ink stroke color.',
    },
    {
      name: 'colors',
      type: 'string[]',
      defaultValue: "['#3b82f6', '#10b981', '#f1f3f9', '#f59e0b']",
      description: 'Selectable ink color palette swatches.',
    },
    {
      name: 'minWidth',
      type: 'number',
      defaultValue: '1.6',
      description: 'Minimum stroke line width in pixels at high velocity.',
    },
    {
      name: 'maxWidth',
      type: 'number',
      defaultValue: '4.8',
      description: 'Maximum stroke line width in pixels at low velocity.',
    },
    {
      name: 'trimExport',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Automatically crop transparent whitespace around drawn ink when exporting PNG.',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Synthesizes acoustic paper friction whispers via native Web Audio API.',
    },
    {
      name: 'showBaseline',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Whether to render the legal dashed baseline guide and X-mark.',
    },
    {
      name: 'showPalette',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Whether to show the ink color palette in the toolbar.',
    },
    {
      name: 'title',
      type: 'string',
      defaultValue: "'Authorized Signature'",
      description: 'Header title text.',
    },
    {
      name: 'onDrawStart',
      type: '() => void',
      description: 'Callback fired when user begins a stroke.',
    },
    {
      name: 'onDrawEnd',
      type: '(strokesCount: number) => void',
      description: 'Callback fired when user completes a stroke.',
    },
    {
      name: 'onExport',
      type: '(dataUrl: string, blob: Blob | null) => void',
      description: 'Callback fired when literal PNG export is completed.',
    },
    {
      name: 'onClear',
      type: '() => void',
      description: 'Callback fired when canvas is cleared.',
    },
  ],
  accessibilityNotes: [
    'Canvas provides descriptive aria-label="Draw your vector signature here".',
    'Toolbar swatches provide accessible role="toolbar" and aria-label attributes.',
    'Buttons feature clear accessible names ("Clear canvas", "Export PNG", "Undo last stroke") and disabled state indicators.',
    'Touch action is set to none on canvas to ensure smooth drawing without scrolling interfering.',
  ],
  features: [
    'Velocity-responsive Bezier curve stroke engine with smooth midpoint quadratic interpolation',
    'Literal PNG image export with whitespace cropping and automatic browser file download',
    'Retina & 4K display resolution scaling via devicePixelRatio',
    'Undo & Redo stroke stack with instant single-frame redraw',
    'Legal dashed baseline guide with "✕" sign indicator',
    '4 crafted themes: Executive Dark, Parchment Legal, Porcelain Clean, Cyber Matrix',
    'Synthesized paper friction acoustic haptics (zero external audio files)',
  ],
};
