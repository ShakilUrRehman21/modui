import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/quantum-orbit-beacon/QuantumOrbitBeacon.tsx?raw';
import rawCssCode from '../../components/ui/quantum-orbit-beacon/QuantumOrbitBeacon.css?raw';

export const quantumOrbitBeaconItem: ComponentRegistryItem = {
  id: 'quantum-orbit-beacon',
  slug: 'quantum-orbit-beacon',
  name: 'Quantum Orbit Beacon',
  description:
    'Next-generation status indicator featuring nested 3D orbital tracks, relativistic photon Doppler trails, and dynamic light/dark UI adaptation.',
  category: 'Status & Indicators',
  tags: ['status', 'indicator', 'quantum', 'orbit', 'telemetry', 'beacon', 'doppler', 'light-mode', 'dark-mode'],
  status: 'published',
  publishedAt: '2026-11-10',
  updatedAt: '2026-11-10',
  version: '1.0.0',
  sourceLocation: 'src/components/ui/quantum-orbit-beacon/QuantumOrbitBeacon.tsx',
  githubUrl: 'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/quantum-orbit-beacon/QuantumOrbitBeacon.tsx',
  installSnippet: `// 1. Copy QuantumOrbitBeacon.tsx and QuantumOrbitBeacon.css into your project:
import { QuantumOrbitBeacon } from '@/components/ui/quantum-orbit-beacon';`,
  codeSnippet: `import React, { useState } from 'react';
import { QuantumOrbitBeacon, QuantumOrbitState } from '@/components/ui/quantum-orbit-beacon';

export function QuantumBeaconDemo() {
  const [state, setState] = useState<QuantumOrbitState>('optimal');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
      <QuantumOrbitBeacon
        state={state}
        size="lg"
        interactive
        soundEnabled
        onStateChange={setState}
      />
      
      {/* Inline Small Badge */}
      <QuantumOrbitBeacon
        state={state}
        size="sm"
        label="Edge Gateway"
        subLabel="US-East • 14ms"
      />
    </div>
  );
}`,
  rawSourceCode,
  rawCssCode,
  propsDoc: [
    {
      name: 'state',
      type: "'optimal' | 'active' | 'degraded' | 'offline'",
      defaultValue: "'optimal'",
      description: 'Current telemetry status state driving orbital mechanics and chromatic palette.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'lg'",
      description: "Dimension preset: 'sm' (32px inline), 'md' (72px badge), 'lg' (220px HUD showcase).",
    },
    {
      name: 'theme',
      type: "'auto' | 'light' | 'dark'",
      defaultValue: "'auto'",
      description: 'Color theme mode. Synchronizes automatically with document data-theme or enforces explicit light/dark.',
    },
    {
      name: 'speed',
      type: 'number',
      defaultValue: '1.0',
      description: 'Speed multiplier for orbital particle rotation.',
    },
    {
      name: 'showTelemetry',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Renders status labels and sub-labels alongside the orbit canvas.',
    },
    {
      name: 'label',
      type: 'string',
      defaultValue: 'undefined',
      description: 'Custom main label override (e.g. "Kubernetes Primary").',
    },
    {
      name: 'subLabel',
      type: 'string',
      defaultValue: 'undefined',
      description: 'Custom sub-label or latency metric (e.g. "99.99% • 12ms").',
    },
    {
      name: 'interactive',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Enables 3D perspective mouse tilt response on pointer movement.',
    },
    {
      name: 'soundEnabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Synthesizes Web Audio quantum crystal chimes on state transitions.',
    },
    {
      name: 'compact',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Compact mode for catalog cards and dense dashboard rows.',
    },
    {
      name: 'onStateChange',
      type: '(state: QuantumOrbitState) => void',
      defaultValue: 'undefined',
      description: 'Callback fired when an interactive state preset button is clicked.',
    },
  ],
  features: [
    '3D Sub-Atomic Orbital Mechanics: 3 nested quantum ring tracks with independent radii, inclination angles, and rotational velocities',
    'Doppler Photon Trails: Physics-based particle motion leaving continuous glowing light vectors with speed-dependent persistence',
    '4 Production Telemetry States: Optimal (Harmonic Bohr orbit), Active (Relativistic burst), Degraded (Precession wobble), and Offline (Dormant standby)',
    'Platform Light & Dark UI Adaptation: Seamless auto-synchronization with document data-theme, featuring obsidian void in dark mode and porcelain titanium in light mode',
    'Flexible Form Factors: sm (32px inline dot/badge), md (72px status card), and lg (220px HUD showcase with live telemetry labels)',
    '3D Perspective Tilt: Real-time pointer proximity tracking that dynamically tilts the orbital plane with spring damping',
    'Web Audio Quantum Chimes: Pure procedural in-browser sound synthesis providing crystal acoustic feedback on state transitions',
    'Hardware Composited Canvas: Automatic devicePixelRatio scaling for Retina and 4K displays',
  ],
  accessibilityNotes: [
    'ARIA role="status" announcing live telemetry status changes and latency metrics to screen readers',
    'Aria-hidden canvas and decorative glow layers to prevent assistive tech clutter',
    'Accessible interactive preset buttons with high-contrast active indicator states',
    'Respects reduced motion preferences by attenuating particle acceleration',
  ],
};
