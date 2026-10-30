import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/rotary/RotaryJogWheel.tsx?raw';
import rawCssCode from '../../components/ui/rotary/RotaryJogWheel.css?raw';

export const rotaryJogWheelItem: ComponentRegistryItem = {
    id: 'rotary-jog-wheel',
    slug: 'rotary-jog-wheel',
    name: 'Rotary Jog Wheel',
    description: 'Hardware-grade brushed aluminum rotary dial with circular scrub physics, rotational momentum inertia, detent notch snapping, and synthesized micro-haptic audio clicks.',
    category: 'Buttons and Actions',
    tags: ['rotary', 'dial', 'jog-wheel', 'haptics', 'audio', 'inertia', 'controller', 'knob'],
    status: 'published',
    publishedAt: '2026-10-19',
    updatedAt: '2026-10-19',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/rotary/RotaryJogWheel.tsx',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/rotary/RotaryJogWheel.tsx',
    installSnippet: `// 1. Copy RotaryJogWheel.tsx and RotaryJogWheel.css into your project:
// components/ui/rotary/RotaryJogWheel.tsx
// components/ui/rotary/RotaryJogWheel.css
// 2. Import into your application:
import { RotaryJogWheel } from '@/components/ui/rotary';`,
    codeSnippet: `import React, { useState } from 'react';
import { RotaryJogWheel } from '@/components/ui/rotary';

export function JogWheelDemo() {
  const [gain, setGain] = useState(42);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <RotaryJogWheel
        value={gain}
        onChange={(val) => setGain(val)}
        min={0}
        max={100}
        step={1}
        mode="bounded"
        variant="metallic"
        label="Master Volume"
        sublabel="GAIN dB"
        soundEnabled={true}
        inertia={true}
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
        description: 'Controlled numerical value of the rotary dial.',
      },
      {
        name: 'defaultValue',
        type: 'number',
        defaultValue: '0',
        description: 'Initial value when used in uncontrolled mode.',
      },
      {
        name: 'min',
        type: 'number',
        defaultValue: '0',
        description: 'Minimum value limit in bounded or bipolar mode.',
      },
      {
        name: 'max',
        type: 'number',
        defaultValue: '100',
        description: 'Maximum value limit in bounded or bipolar mode.',
      },
      {
        name: 'step',
        type: 'number',
        defaultValue: '1',
        description: 'Step increment for snapping and keyboard navigation.',
      },
      {
        name: 'mode',
        type: "'continuous' | 'bounded' | 'bipolar'",
        defaultValue: "'bounded'",
        description: 'Interaction model: continuous infinite scrub, bounded with arc limit, or bipolar balance.',
      },
      {
        name: 'variant',
        type: "'metallic' | 'dark' | 'glass' | 'minimal'",
        defaultValue: "'metallic'",
        description: 'Visual surface styling: brushed aluminum, stealth dark obsidian, luminous glass, or minimal.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg' | number",
        defaultValue: "'md'",
        description: 'Preset diameter (sm: 148px, md: 196px, lg: 248px) or custom pixel size.',
      },
      {
        name: 'inertia',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Simulates physical rotational momentum with smooth friction deceleration upon release.',
      },
      {
        name: 'friction',
        type: 'number',
        defaultValue: '0.92',
        description: 'Momentum friction deceleration rate (0.80 to 0.98).',
      },
      {
        name: 'soundEnabled',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Synthesizes authentic mechanical micro-tick clicks using Web Audio API.',
      },
      {
        name: 'snapping',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Snaps rotation angle to discrete detent notches.',
      },
      {
        name: 'displayFormat',
        type: "'value' | 'percent' | 'degrees' | 'timecode'",
        defaultValue: "'value'",
        description: 'Numerical formatting rendered in the center digital readout.',
      },
      {
        name: 'label',
        type: 'string',
        description: 'Header title text positioned above the dial.',
      },
      {
        name: 'sublabel',
        type: 'string',
        description: 'Subtitle / parameter unit rendered on the dial.',
      },
      {
        name: 'onChange',
        type: '(val: number, angleDeg: number) => void',
        description: 'Callback firing continuously as the dial is scrubbed.',
      },
      {
        name: 'onCenterClick',
        type: '() => void',
        description: 'Callback when tapping the center tactile cap (defaults to value reset).',
      },
    ],
    accessibilityNotes: [
      'Accessible role="slider" with aria-valuenow, aria-valuemin, aria-valuemax, and aria-valuetext.',
      'Keyboard navigation: ArrowRight / ArrowUp (+step), ArrowLeft / ArrowDown (-step), PageUp / PageDown (+10 steps).',
      'Home key snaps to minimum or zero; End key snaps to maximum.',
      'Center button / Enter / Space triggers action or resets dial to zero.',
      'Perimeter SVG tick lines and rotor marked aria-hidden="true" to keep screen reader output clean.',
    ],
    features: [
      'Circular tangential mouse and touch scrub calculation using atan2 geometry',
      'Rotational inertia physics with velocity tracking and natural exponential deceleration',
      'Realistic Web Audio oscillator synthesized mechanical detent clicks without audio assets',
      'Machined radial brushed aluminum conic gradient with specular highlights and tactile finger dimple',
      'Active illuminated progress arc and precision laser-etched perimeter tick marks',
      '4 curated design themes: CNC Machined Silver, Industrial Obsidian, Luminous Glass, Minimal Swiss',
    ],
  };
