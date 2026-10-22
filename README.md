# ModUI

> **Modular React 19 UI System • Thoughtful Interactions, Pure CSS & Zero Runtime Overhead**

ModUI is an open-source collection of production-grade, highly interactive React primitives designed with expressive physics-informed motion, synthesized Web Audio haptics, and zero external style dependencies. Every component is designed to be copied directly into your codebase with complete source ownership.

[![Live Demo](https://img.shields.io/badge/Demo-modui--six.vercel.app-blue.svg)](https://modui-six.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-ShakilUrRehman21%2Fmodui-181717.svg?logo=github)](https://github.com/ShakilUrRehman21/modui)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff.svg?logo=vite)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-67%20Passing-green.svg?logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Core Principles

- **Zero Runtime Style Dependencies:** Built strictly with standard CSS custom properties and native React APIs. No Tailwind, no Emotion, no styled-components, and no vendor lock-in.
- **Copy & Paste Architecture:** Every component is self-contained. Copy the `.tsx` and `.css` directly into your codebase and customize freely.
- **Physics-Informed Motion:** Realistic mechanical detents, non-linear spring expansions, magnetic cursor attraction, liquid bezier deformation, and velocity momentum.
- **Synthesized Web Audio Haptics:** Acoustic micro-ticks and mechanical feedback generated in real time using the native Web Audio API oscillators — zero external sound assets needed.
- **Accessible by Default:** Built to WCAG AA standards with visible focus rings, ARIA roles (`slider`, `tablist`, `menu`, `button`, `region`), keyboard navigation, and reduced-motion considerations.

---

## Published Modules (13 Primitives)

| Component | Category | Highlights | Source Directory |
| :--- | :--- | :--- | :--- |
| **Neural Cloth Mesh** | 3D & Showcase | 2D physical Verlet integration particle lattice, elastic structural constraints, 3D facet normal lighting, pointer turbulence wake, and harmonic breeze whoosh | `src/components/ui/cloth` |
| **Caustic Ripple Surface** | 3D & Showcase | 2D discrete wave propagation, real-time sunlight caustic light refraction, ambient idle raindrops, and synthesized acoustic droplet haptics | `src/components/ui/caustic-surface` |
| **Cyber Stream Matrix** | Typography & Motion | Generative 2D canvas stream, pointer shockwave repulsion physics, click particle bursts, and Web Audio synthesizer chirps | `src/components/ui/matrix` |
| **Rotary Jog Wheel** | Buttons and Actions | Circular scrub physics (`atan2`), momentum inertia deceleration, detent notch snapping, and synthesized micro-haptic audio ticks | `src/components/ui/rotary` |
| **Radial Orbit Hub** | Buttons and Actions | Radial action launcher, circular satellite bloom, rotational velocity momentum, default-closed tactile core, and haptic tones | `src/components/ui/radial-hub` |
| **Animated Button** | Buttons and Actions | Shimmer light pass, neon glow pulse, water ripple waves, magnetic cursor tracking, and arrow slides | `src/components/ui/button` |
| **Pulse Badge** | Status & Indicators | Live radar beacon pulse, compact status indicator tokens, and WCAG AA contrast compliance | `src/components/ui/badge` |
| **Kinetic Text** | Typography & Motion | Character-level GSAP split-text, real-time mouse proximity wave elevation, and kinetic character physics | `src/components/ui/motion` |
| **Number Ticker** | Typography & Motion | High-velocity spring rolling counter with tabular font figures, comma separators, and velocity damping | `src/components/ui/counter` |
| **Fluid Elastic Accordion** | 3D & Showcase | Non-linear spring expansion, dynamic liquid SVG bezier edge boundary deformation, and horizontal vs vertical layout | `src/components/ui/accordion` |
| **Before-After Slider** | 3D & Showcase | Hardware-accelerated clip-path masking, tactile circular glass handle, dual orientation, and center-snap haptic tick | `src/components/ui/slider` |
| **Tactile Floating Dock** | 3D & Showcase | macOS-inspired action dock with parabolic icon scaling, tactile hover lift, keyboard shortcuts, and accessible ARIA roles | `src/components/ui/dock` |
| **Cylindrical Carousel** | 3D & Showcase | 3D perspective carousel with rotational drag, depth-of-field blur, and click-to-focus card orientation | `src/components/ui/carousel` |

---

## Platform Features

- **Interactive Hero Stage:** Real-time component experimentation workbench featuring animated buttons, kinetic typography waves, subpixel clipping, and numerical rolling tickers.
- **Component Catalogue (`/components`):** Filterable module browser with real-time search, category filters, and live interactive previews.
- **Component Detail Inspector (`/components/:slug`):** Interactive prop playground with live controls, accessibility checklist, and multi-tab source viewer (`TSX`, `CSS`, `Usage`).
- **Documentation Guide (`/docs`):** Design token hierarchy, project file structure, and copy-paste integration walkthroughs.
- **Command Palette (`Ctrl+K` / `Cmd+K`):** Fast fuzzy search across all primitives, documentation chapters, and shortcuts.

---

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/ShakilUrRehman21/modui.git
cd modui
npm install
```

### Development Server

Start the local Vite dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Automated Test Suite

Run the full Vitest suite (all 51 unit tests):

```bash
npm test
```

### Production Build

Generate an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Component Integration Example

Each module in ModUI is self-contained. To integrate the **Rotary Jog Wheel**:

1. Copy `RotaryJogWheel.tsx` and `RotaryJogWheel.css` into your project's `components/ui/rotary/` directory.
2. Import and use it directly:

```tsx
import React, { useState } from 'react';
import { RotaryJogWheel } from '@/components/ui/rotary';

export function MasterVolumeControl() {
  const [volume, setVolume] = useState(64);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <RotaryJogWheel
        value={volume}
        onChange={(val) => setVolume(val)}
        min={0}
        max={100}
        step={1}
        mode="bounded"
        variant="metallic"
        label="Master Output"
        sublabel="LEVEL"
        soundEnabled={true}
        inertia={true}
      />
    </div>
  );
}
```

---

## Directory Structure

```
modui/
├── src/
│   ├── components/
│   │   ├── common/             # Command palette modal & shared utilities
│   │   ├── home/               # Hero section, Featured section, Sandbox, Stacked cards
│   │   ├── layout/             # Responsive Navbar, Mobile menu, Footer
│   │   └── ui/
│   │       ├── accordion/      # Fluid Elastic Accordion
│   │       ├── badge/          # Pulse Radar Badge
│   │       ├── button/         # Animated Button (shimmer, glow, ripple, magnetic)
│   │       ├── carousel/       # Cylindrical 3D Carousel
│   │       ├── caustic-surface/# Caustic Ripple Surface 2D water wave simulation
│   │       ├── counter/        # Number Ticker spring counter
│   │       ├── dock/           # Tactile Floating Dock
│   │       ├── matrix/         # Cyber Stream Matrix generative canvas
│   │       ├── motion/         # Kinetic Text character wave
│   │       ├── radial-hub/     # Radial Orbit Hub launcher
│   │       ├── rotary/         # Rotary Jog Wheel controller
│   │       └── slider/         # Before-After Split Slider
│   ├── pages/
│   │   ├── HomePage.tsx        # Hero interactive stage & featured cards
│   │   ├── ExplorerPage.tsx    # Full catalog browser & search filters
│   │   ├── ComponentDetailPage.tsx # Interactive playground & source code tabs
│   │   └── DocsPage.tsx        # Architecture guide & design tokens
│   ├── registry/               # Central component registry & raw sources
│   ├── index.css               # Design tokens, CSS variables, & typography
│   └── main.tsx                # Application root entry
├── dist/                       # Optimized production build
└── package.json
```

---

## Contributing

1. Fork the repository: [https://github.com/ShakilUrRehman21/modui](https://github.com/ShakilUrRehman21/modui)
2. Create your feature branch (`git checkout -b feat/new-primitive`)
3. Develop your component with strict TypeScript and pure CSS
4. Add unit tests (`*.test.tsx`)
5. Register the component in `src/registry/components.ts`
6. Commit and push your changes, then submit a Pull Request

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
