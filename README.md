# ModUI

> **Modular React 19 UI System • Thoughtful Interactions & Pure CSS**

A curated collection of production-ready React components, expressive micro-interactions, and spatial surfaces. Designed with strict accessibility standards, zero external CSS runtime dependencies, and a direct copy-paste architecture.

[![GitHub Repo](https://img.shields.io/badge/GitHub-ShakilUrRehman21%2Fmodui-blue.svg)](https://github.com/ShakilUrRehman21/modui)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff.svg)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-Passing-green.svg)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Philosophy & Core Principles

**ModUI** is built around the philosophy of transparent, modular React architecture:

- **Zero Runtime Dependencies:** Built strictly with pure React and standard CSS custom properties. No invasive style libraries or vendor lock-in.
- **Copy & Paste Model:** Every component lives directly in your codebase. You own the code, the markup, and the styling.
- **Thoughtful Motion:** Purposeful micro-animations, physics-inspired magnetic tracking, water-ripple waves, and character-level kinetic split-text typography.
- **Accessible by Default:** Built to meet WCAG AA standards with full keyboard support, visible focus rings, and proper ARIA attributes.

---

## Published Modules

| Component | Category | Highlights | Location |
| :--- | :--- | :--- | :--- |
| **Animated Button** | Actions | Shimmer pass, perimeter glow, water ripple, magnetic cursor physics, arrow slide | `src/components/ui/button` |
| **Pulse Badge** | Feedback & Status | Live radar beacon pulse, compact status tokens, WCAG AA contrast | `src/components/ui/badge` |
| **Kinetic Text** | Typography & Motion | Character-level GSAP split-text, real-time mouse wave elevation, kinetic bounce | `src/components/ui/motion` |

---

## Component Showcase & Navigation

- **Interactive Canvas Stage:** Live kinetic typography studio with real-time character wave interactions.
- **Component Catalogue (`#/components`):** Complete module browser with instant search and category filtering.
- **Component Detail Inspector (`#/components/:slug`):** Interactive prop playground, accessibility checklist, and multi-tab source viewer (`TSX`, `CSS`, `Usage`).
- **Documentation Guide (`#/docs`):** Design system architecture, token hierarchy, and copy-paste integration guide.
- **Command Palette (`Ctrl+K` / `Cmd+K`):** Fast fuzzy navigation across all modules and documentation sections.

---

## Quickstart & Local Development

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/ShakilUrRehman21/modui.git
cd modui
npm install
```

### Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Automated Tests

Run the Vitest test suite:

```bash
npm test
```

### Production Build

Create an optimized production bundle:

```bash
npm run build
```

Preview the build locally:

```bash
npm run preview
```

---

## Architecture & Directory Structure

```
modui/
├── src/
│   ├── components/
│   │   ├── common/         # Command palette modal
│   │   ├── layout/         # Navbar, Footer
│   │   └── ui/
│   │       ├── badge/      # Badge & Pulse Radar beacon
│   │       ├── button/     # Animated Button (shimmer, ripple, slide, magnetic)
│   │       └── motion/     # Kinetic Text (GSAP character wave)
│   ├── pages/
│   │   ├── HomePage.tsx    # Hero stage, interactive studio & architecture strip
│   │   ├── ExplorerPage.tsx# Catalogue grid & search filter
│   │   ├── ComponentDetailPage.tsx # Props workbench & dedicated code tabs
│   │   └── DocsPage.tsx    # Architectural guidelines & token documentation
│   ├── registry/           # Component registry, raw TSX/CSS sources
│   ├── index.css           # Design tokens, color system, and global reset
│   └── main.tsx            # Application entry point
├── dist/                   # Production build output
└── package.json
```

---

## How to Use Components in Your Project

Each module in ModUI is self-contained. For example, to integrate the **Animated Button**:

1. Copy `AnimatedButton.tsx` and `AnimatedButton.css` into your project's `components/ui/button/` directory.
2. Import and use it directly:

```tsx
import { AnimatedButton } from './components/ui/button/AnimatedButton';

export function Example() {
  return (
    <AnimatedButton variant="shimmer" size="md" onClick={() => console.log('Clicked!')}>
      Get Started
    </AnimatedButton>
  );
}
```

---

## Contributing

1. Fork the repository [https://github.com/ShakilUrRehman21/modui](https://github.com/ShakilUrRehman21/modui)
2. Create your feature branch (`git checkout -b feat/new-module`)
3. Develop your component with strict TypeScript and pure CSS
4. Add unit tests (`*.test.tsx`)
5. Register the component in `src/registry/components.ts`
6. Commit and submit a Pull Request

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
