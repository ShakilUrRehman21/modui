import type { ComponentRegistryItem } from '../types';
import rawSourceCode from '../../components/ui/tape-deck/ReelTapeDeck.tsx?raw';
import rawCssCode from '../../components/ui/tape-deck/ReelTapeDeck.css?raw';

export const reelTapeDeckItem: ComponentRegistryItem = {
    id: 'reel-tape-deck',
    slug: 'reel-tape-deck',
    name: 'Studio Reel-to-Reel Tape Deck',
    description:
      'Precision analog reel-to-reel tape console featuring dual rotating spools with dynamic tape pack thickness physics, twin ballistic galvanometer VU meters, tactile piano-key transport controls, and synthesized capstan motor hum and solenoid acoustics.',
    category: '3D & Interactive Showcase',
    tags: [
      'Audio',
      'Analog',
      'Tape Deck',
      'VU Meter',
      'Hardware',
      'Physics',
      'Interactive',
      'Web Audio',
      'Showcase',
    ],
    status: 'published',
    publishedAt: '2026-10-30',
    updatedAt: '2026-10-30',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/tape-deck/ReelTapeDeck.tsx',
    githubUrl:
      'https://github.com/ShakilUrRehman21/modui/tree/main/src/components/ui/tape-deck',
    codeSnippet: `import { ReelTapeDeck } from '@/components/ui/tape-deck';

export function TapeDeckDemo() {
  return (
    <ReelTapeDeck
      variant="studio-light"
      speed="15"
      soundEnabled={true}
      autoPlay={false}
    />
  );
}`,
    installSnippet: 'npm install react react-dom',
    rawSourceCode,
    rawCssCode,
    propsDoc: [
      {
        name: 'variant',
        type: "'studio-light' | 'dark-slate' | 'warm-editorial' | 'minimal-mono'",
        defaultValue: "'studio-light'",
        description: 'Visual faceplate theme and dial illumination aesthetic.',
      },
      {
        name: 'tracks',
        type: 'TapeTrack[]',
        defaultValue: 'DEFAULT_TRACK_LIST',
        description: 'Playlist of tape recordings with title, artist, and duration.',
      },
      {
        name: 'activeTrackIndex',
        type: 'number',
        description: 'Controlled active recording index.',
      },
      {
        name: 'speed',
        type: "'3.75' | '7.5' | '15'",
        defaultValue: "'15'",
        description: 'Tape transport speed in inches per second (IPS).',
      },
      {
        name: 'soundEnabled',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Synthesizes mechanical solenoid engagement clicks, motor hum, and lo-fi tape chords via Web Audio API.',
      },
      {
        name: 'volume',
        type: 'number',
        defaultValue: '0.75',
        description: 'Output monitor volume level between 0.0 and 1.0.',
      },
      {
        name: 'autoPlay',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Automatically engages playback on component mount.',
      },
      {
        name: 'compact',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Compact card mode optimized for component catalogue previews.',
      },
      {
        name: 'onTransportChange',
        type: '(state: TapeTransportState) => void',
        description: 'Callback fired when transport state changes (play, pause, stop, rewind, fast-forward, record).',
      },
      {
        name: 'onTrackChange',
        type: '(track: TapeTrack, index: number) => void',
        description: 'Callback fired when a recording track is selected.',
      },
    ],
    accessibilityNotes: [
      'Accessible region landmark with aria-label="Analog Studio Reel-to-Reel Tape Deck".',
      'Dual tape spools provide slider ARIA roles with live value progression representing remaining and wound tape percentages.',
      'Piano-key transport toolbar uses native semantic buttons with descriptive aria-label attributes.',
      'Twin ballistic VU meters are labelled with live decibel readings for screen readers.',
      'Supports full keyboard navigation: Space to Play/Pause, Escape to Stop, ArrowLeft to Rewind, ArrowRight to Fast Forward, and "R" to Record.',
    ],
    features: [
      'Dual CNC-milled rotating tape spools with dynamic tape pack thickness transfer physics',
      'Twin ballistic galvanometer VU meters with authentic 300ms rise-time damping, overshoot, and peak LEDs',
      'Mechanical piano-key transport bar with 3D key travel, solenoid engagement, and mechanical brakes',
      'Synthesized Web Audio acoustics: mechanical solenoid clack, capstan motor hum, manual tape scrub grain, and warm analog chord pads',
      'Manual tape reel scrubbing by dragging either spool with real-time audio scrub feedback',
      '4 curated studio themes: Studio Light, Dark Slate, Warm Editorial, and Minimal Mono',
    ],
  };
