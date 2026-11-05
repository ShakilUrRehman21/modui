import React, { useState, useEffect, useRef } from 'react';
import { trackCopyCode, trackComponentInstall, trackGithubClick } from '../lib/analytics';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './DocsPage.css';

interface DocsPageProps {
  onNavigate?: (path: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'introduction', label: 'Introduction to ModUI' },
  { id: 'quick-start', label: 'Quick Start & Peer Deps' },
  { id: 'philosophy', label: 'Copy-Paste Architecture' },
  { id: 'frameworks', label: 'Framework Integration' },
  { id: 'tokens', label: 'Design Tokens & Theming' },
  { id: 'workflow', label: 'Component Lifecycle' },
  { id: 'contributing', label: 'Contributing & Community' },
];

interface ColorToken {
  name: string;
  variable: string;
  hex: string;
  role: string;
}

const DESIGN_TOKENS: ColorToken[] = [
  { name: 'ModUI Cobalt', variable: '--accent-primary', hex: '#365CF5', role: 'Primary interactive focus & brand' },
  { name: 'Cobalt Deep', variable: '--accent-primary-hover', hex: '#2445D4', role: 'Active & hover press state' },
  { name: 'Studio Canvas', variable: '--bg-app', hex: '#F8F7F2', role: 'Warm neutral application canvas' },
  { name: 'Surface Pure', variable: '--bg-surface', hex: '#FFFFFF', role: 'Elevated card & dialogue backing' },
  { name: 'Surface Warm', variable: '--bg-surface-elevated', hex: '#FAF9F5', role: 'Secondary inset surface & well' },
  { name: 'Hairline Border', variable: '--border-default', hex: '#E4E1D9', role: 'Architectural structural edge' },
  { name: 'Strong Border', variable: '--border-strong', hex: '#C8C5BC', role: 'Active border & divider' },
  { name: 'Studio Noir', variable: '--text-primary', hex: '#20201E', role: 'High-contrast typography' },
  { name: 'Graphite Muted', variable: '--text-secondary', hex: '#696963', role: 'Supporting descriptions & captions' },
  { name: 'Emerald Green', variable: '--color-success', hex: '#059669', role: 'Production ready status' },
  { name: 'Ochre Amber', variable: '--color-warning', hex: '#D97706', role: 'Attention & notice alerts' },
  { name: 'Analog Coral', variable: '--color-danger', hex: '#FF4A36', role: 'Recording & active detent' },
];

export const DocsPage: React.FC<DocsPageProps> = ({ onNavigate }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('introduction');
  const [activePkgManager, setActivePkgManager] = useState<'npm' | 'pnpm' | 'bun' | 'yarn'>('npm');
  const [activeFramework, setActiveFramework] = useState<'next' | 'vite' | 'remix'>('next');
  const [tokenSearch, setTokenSearch] = useState<string>('');

  const navListRef = useRef<HTMLDivElement>(null);
  const navBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const isProgrammaticScrollRef = useRef(false);

  // Activate scroll-triggered slide-ins across documentation cards
  useScrollReveal({ rootMargin: '0px 0px -40px 0px', enableOutTop: false });

  const copyCode = (code: string, id: string, label?: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);

    trackCopyCode({
      component: 'docs',
      file: label || id,
      format: 'snippet',
      source: 'docs_page',
    });
  };

  const handleInstallCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId('install-cmd');
    setTimeout(() => setCopiedId(null), 2000);

    trackComponentInstall({
      component: 'react-peer-dependencies',
      package_manager: activePkgManager,
      method: 'cli',
    });
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    isProgrammaticScrollRef.current = true;
    const element = document.getElementById(id);
    if (element) {
      const isMobile = window.innerWidth <= 960;
      const topOffset = isMobile ? 120 : 96;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(0, elementPosition - topOffset),
        behavior: 'smooth',
      });
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 700);
    }
  };

  // Center active navigation button in mobile scrollable list
  useEffect(() => {
    const container = navListRef.current;
    const btn = navBtnRefs.current[activeSection];
    if (container && btn && window.innerWidth <= 960) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const offset = (btnRect.left - containerRect.left) - (containerRect.width / 2) + (btnRect.width / 2);
      container.scrollBy({ left: offset, behavior: 'smooth' });
    }
  }, [activeSection]);

  // Synchronize active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;

      const scrollBottom = window.innerHeight + window.scrollY;
      const totalHeight = document.documentElement.scrollHeight;

      if (scrollBottom >= totalHeight - 160) {
        setActiveSection('contributing');
        return;
      }

      const isMobile = window.innerWidth <= 960;
      const offsetThreshold = isMobile ? 140 : 160;

      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offsetThreshold) {
            setActiveSection(item.id);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredTokens = DESIGN_TOKENS.filter(
    (t) =>
      t.name.toLowerCase().includes(tokenSearch.toLowerCase()) ||
      t.variable.toLowerCase().includes(tokenSearch.toLowerCase()) ||
      t.hex.toLowerCase().includes(tokenSearch.toLowerCase())
  );

  const getInstallCommand = () => {
    switch (activePkgManager) {
      case 'pnpm':
        return 'pnpm add lucide-react canvas-confetti';
      case 'bun':
        return 'bun add lucide-react canvas-confetti';
      case 'yarn':
        return 'yarn add lucide-react canvas-confetti';
      default:
        return 'npm install lucide-react canvas-confetti';
    }
  };

  return (
    <div className="modui-docs-page">
      <div className="modui-container">
        {/* Top Header */}
        <div className="modui-docs-header">
          <div className="modui-docs-eyebrow">
            <span className="modui-docs-eyebrow-dot" />
            <span>DOCUMENTATION // ARCHITECTURE</span>
            <span className="modui-docs-eyebrow-tag">SPECIFICATION & GUIDE</span>
          </div>
          <h1 className="modui-docs-title">Engineering Documentation.</h1>
          <p className="modui-docs-subtitle">
            Comprehensive reference guides, design tokens, copy-paste architecture, and accessibility standards for ModUI modular primitives.
          </p>
        </div>

        <div className="modui-docs-grid">
          {/* Sticky Sidebar Navigation */}
          <aside className="modui-docs-sidebar">
            <div className="modui-docs-sidebar-header">
              <span className="modui-docs-sidebar-title">QUICK NAVIGATION</span>
            </div>
            <div ref={navListRef} className="modui-docs-nav-list" role="navigation" aria-label="Documentation sections">
              {NAV_ITEMS.map((item, idx) => (
                <button
                  key={item.id}
                  ref={(el) => {
                    navBtnRefs.current[item.id] = el;
                  }}
                  type="button"
                  className={`modui-docs-nav-item ${activeSection === item.id ? 'modui-docs-nav-item--active' : ''}`}
                  onClick={() => scrollToSection(item.id)}
                >
                  <span className="modui-docs-nav-num">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="modui-docs-nav-label">{item.label}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content Column */}
          <div className="modui-docs-content">
            {/* Section 1: Introduction */}
            <section id="introduction" className="modui-docs-card modui-reveal modui-scale-up">
              <div className="modui-docs-card-header">
                <span className="modui-docs-section-tag">01 // OVERVIEW</span>
                <h2 className="modui-docs-section-title">Introduction to ModUI</h2>
              </div>
              <p className="modui-docs-p">
                ModUI is a thoughtfully engineered collection of expressive, production-ready React UI primitives.
                It is built around a singular core tenet: <strong>Modular UI, thoughtfully engineered</strong>.
              </p>
              <p className="modui-docs-p">
                Unlike monolithic UI frameworks that require heavy <code>node_modules</code> runtime wrappers, inflexible CSS-in-JS compilers, and opinionated bundler plugins, ModUI delivers self-contained TypeScript components paired with pure, predictable CSS custom properties.
              </p>

              {/* 3 Core Architecture Guarantees */}
              <div className="modui-docs-callout-grid">
                <div className="modui-docs-callout-item">
                  <div className="modui-docs-callout-tag">FOUNDATION</div>
                  <h4 className="modui-docs-callout-heading">Zero Runtime Baggage</h4>
                  <p className="modui-docs-callout-body">
                    No runtime styling libraries, emotion caches, or complex theme providers. Native CSS custom properties handle theming instantly at zero bundle overhead.
                  </p>
                </div>

                <div className="modui-docs-callout-item">
                  <div className="modui-docs-callout-tag">ARCHITECTURE</div>
                  <h4 className="modui-docs-callout-heading">Complete Source Ownership</h4>
                  <p className="modui-docs-callout-body">
                    Every primitive is a single file or clean folder dropped directly into your codebase. You retain 100% control over layout, styling, and behavior.
                  </p>
                </div>

                <div className="modui-docs-callout-item">
                  <div className="modui-docs-callout-tag">PERFORMANCE</div>
                  <h4 className="modui-docs-callout-heading">Hardware-Accelerated 60 FPS</h4>
                  <p className="modui-docs-callout-body">
                    All dynamic motion, rotation, and spring relaxation runs on the GPU compositor using CSS transforms and subpixel physics integration.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Quick Start & Peer Dependencies */}
            <section id="quick-start" className="modui-docs-card modui-reveal modui-scale-up">
              <div className="modui-docs-card-header">
                <span className="modui-docs-section-tag">02 // SETUP</span>
                <h2 className="modui-docs-section-title">Quick Start & Peer Dependencies</h2>
              </div>
              <p className="modui-docs-p">
                Because ModUI avoids heavyweight runtime styling engines, the only dependencies you need in your project are standard React peer packages used by specific primitives (such as icons and canvas effects):
              </p>

              {/* Interactive Terminal Box */}
              <div className="modui-code-container">
                <div className="modui-code-header">
                  <div className="modui-docs-pkg-tabs" role="tablist" aria-label="Package Manager">
                    {(['npm', 'pnpm', 'bun', 'yarn'] as const).map((pm) => (
                      <button
                        key={pm}
                        type="button"
                        className={`modui-docs-pkg-tab ${activePkgManager === pm ? 'modui-docs-pkg-tab--active' : ''}`}
                        onClick={() => setActivePkgManager(pm)}
                      >
                        {pm}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="modui-docs-copy-action"
                    onClick={() => handleInstallCopy(getInstallCommand())}
                  >
                    <span>{copiedId === 'install-cmd' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="modui-code-pre">
                  <code>{getInstallCommand()}</code>
                </pre>
              </div>

              <div className="modui-docs-alert modui-docs-alert--tip">
                <div className="modui-docs-alert-icon">💡</div>
                <div className="modui-docs-alert-content">
                  <strong>Installation Tip:</strong> You only need to install peer dependencies required by the specific primitives you choose to use. For example, if you only use <code>RotaryJogWheel</code> or <code>TimelineRoadmap</code>, they require zero external packages beyond React.
                </div>
              </div>
            </section>

            {/* Section 3: Copy-Paste Architecture */}
            <section id="philosophy" className="modui-docs-card modui-reveal modui-scale-up">
              <div className="modui-docs-card-header">
                <span className="modui-docs-section-tag">03 // PHILOSOPHY</span>
                <h2 className="modui-docs-section-title">The Copy-Paste Architecture</h2>
              </div>
              <p className="modui-docs-p">
                Every component lives independently within <code>src/components/ui/&lt;name&gt;</code>.
                You copy the component TSX and its companion CSS file straight into your repository:
              </p>

              <div className="modui-code-container">
                <div className="modui-code-header">
                  <span>PROJECT DIRECTORY STRUCTURE</span>
                  <button
                    type="button"
                    className="modui-docs-copy-action"
                    onClick={() =>
                      copyCode(
                        `your-project/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── radial-hub/
│   │       │   ├── RadialOrbitHub.tsx
│   │       │   ├── RadialOrbitHub.css
│   │       │   └── index.ts
│   │       ├── rotary/
│   │       │   ├── RotaryJogWheel.tsx
│   │       │   ├── RotaryJogWheel.css
│   │       │   └── index.ts
│   │       ├── tape-deck/
│   │       │   ├── ReelTapeDeck.tsx
│   │       │   ├── ReelTapeDeck.css
│   │       │   └── index.ts
│   │       ├── neural-graph/
│   │       │   ├── NeuralGraph.tsx
│   │       │   ├── NeuralGraph.css
│   │       │   └── index.ts`,
                        'structure',
                        'Directory Structure'
                      )
                    }
                  >
                    <span>{copiedId === 'structure' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="modui-code-pre">{`your-project/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── radial-hub/
│   │       │   ├── RadialOrbitHub.tsx
│   │       │   ├── RadialOrbitHub.css
│   │       │   └── index.ts
│   │       ├── rotary/
│   │       │   ├── RotaryJogWheel.tsx
│   │       │   ├── RotaryJogWheel.css
│   │       │   └── index.ts
│   │       ├── tape-deck/
│   │       │   ├── ReelTapeDeck.tsx
│   │       │   ├── ReelTapeDeck.css
│   │       │   └── index.ts
│   │       ├── neural-graph/
│   │       │   ├── NeuralGraph.tsx
│   │       │   ├── NeuralGraph.css
│   │       │   └── index.ts`}</pre>
              </div>

              {/* Step Flow */}
              <div className="modui-docs-steps-row">
                <div className="modui-docs-step">
                  <span className="modui-docs-step-badge">STEP 01</span>
                  <h5>Pick Primitive</h5>
                  <p>Browse the interactive catalog and find the component tailored to your interaction pattern.</p>
                </div>
                <div className="modui-docs-step">
                  <span className="modui-docs-step-badge">STEP 02</span>
                  <h5>Copy Files</h5>
                  <p>Copy the clean self-contained <code>.tsx</code> and <code>.css</code> files into your project folder.</p>
                </div>
                <div className="modui-docs-step">
                  <span className="modui-docs-step-badge">STEP 03</span>
                  <h5>Customize Tokens</h5>
                  <p>Adjust CSS variables for colors, easing, and borders to harmonize with your existing brand identity.</p>
                </div>
              </div>
            </section>

            {/* Section 4: Framework Integration */}
            <section id="frameworks" className="modui-docs-card modui-reveal modui-scale-up">
              <div className="modui-docs-card-header">
                <span className="modui-docs-section-tag">04 // INTEGRATION</span>
                <h2 className="modui-docs-section-title">Framework Integration</h2>
              </div>
              <p className="modui-docs-p">
                ModUI components are universal React 18 & 19 components compatible with all modern frontend architectures.
              </p>

              {/* Framework Tabs */}
              <div className="modui-docs-framework-bar">
                {(['next', 'vite', 'remix'] as const).map((fw) => (
                  <button
                    key={fw}
                    type="button"
                    className={`modui-docs-fw-btn ${activeFramework === fw ? 'modui-docs-fw-btn--active' : ''}`}
                    onClick={() => setActiveFramework(fw)}
                  >
                    {fw === 'next' && 'Next.js (App Router)'}
                    {fw === 'vite' && 'Vite & React 19'}
                    {fw === 'remix' && 'Remix & Astro'}
                  </button>
                ))}
              </div>

              {activeFramework === 'next' && (
                <div className="modui-code-container">
                  <div className="modui-code-header">
                    <span>app/dashboard/page.tsx (Next.js App Router)</span>
                    <button
                      type="button"
                      className="modui-docs-copy-action"
                      onClick={() =>
                        copyCode(
                          `'use client';

import React, { useState } from 'react';
import { RotaryJogWheel } from '@/components/ui/rotary/RotaryJogWheel';
import '@/components/ui/rotary/RotaryJogWheel.css';

export default function AudioConsolePage() {
  const [volume, setVolume] = useState(65);

  return (
    <main className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Mastering Console</h1>
      <RotaryJogWheel
        value={volume}
        onChange={setVolume}
        size="lg"
        variant="metallic"
        sublabel="GAIN"
      />
    </main>
  );
}`,
                          'next-example',
                          'Next.js Example'
                        )
                      }
                    >
                      <span>{copiedId === 'next-example' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="modui-code-pre">{`'use client';

import React, { useState } from 'react';
import { RotaryJogWheel } from '@/components/ui/rotary/RotaryJogWheel';
import '@/components/ui/rotary/RotaryJogWheel.css';

export default function AudioConsolePage() {
  const [volume, setVolume] = useState(65);

  return (
    <main className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Mastering Console</h1>
      <RotaryJogWheel
        value={volume}
        onChange={setVolume}
        size="lg"
        variant="metallic"
        sublabel="GAIN"
      />
    </main>
  );
}`}</pre>
                </div>
              )}

              {activeFramework === 'vite' && (
                <div className="modui-code-container">
                  <div className="modui-code-header">
                    <span>src/App.tsx (Vite / React 19)</span>
                    <button
                      type="button"
                      className="modui-docs-copy-action"
                      onClick={() =>
                        copyCode(
                          `import React from 'react';
import { NeuralGraph } from './components/ui/neural-graph/NeuralGraph';
import './components/ui/neural-graph/NeuralGraph.css';

export function App() {
  return (
    <div className="container">
      <NeuralGraph
        variant="studio-light"
        autoPulse={true}
        showControls={true}
      />
    </div>
  );
}`,
                          'vite-example',
                          'Vite Example'
                        )
                      }
                    >
                      <span>{copiedId === 'vite-example' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="modui-code-pre">{`import React from 'react';
import { NeuralGraph } from './components/ui/neural-graph/NeuralGraph';
import './components/ui/neural-graph/NeuralGraph.css';

export function App() {
  return (
    <div className="container">
      <NeuralGraph
        variant="studio-light"
        autoPulse={true}
        showControls={true}
      />
    </div>
  );
}`}</pre>
                </div>
              )}

              {activeFramework === 'remix' && (
                <div className="modui-code-container">
                  <div className="modui-code-header">
                    <span>app/routes/_index.tsx (Remix / React Router)</span>
                    <button
                      type="button"
                      className="modui-docs-copy-action"
                      onClick={() =>
                        copyCode(
                          `import { LinksFunction } from '@remix-run/node';
import { ReelTapeDeck } from '~/components/ui/tape-deck/ReelTapeDeck';
import tapeDeckStyles from '~/components/ui/tape-deck/ReelTapeDeck.css?url';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tapeDeckStyles },
];

export default function Index() {
  return <ReelTapeDeck variant="studio-light" autoPlay={true} />;
}`,
                          'remix-example',
                          'Remix Example'
                        )
                      }
                    >
                      <span>{copiedId === 'remix-example' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="modui-code-pre">{`import { LinksFunction } from '@remix-run/node';
import { ReelTapeDeck } from '~/components/ui/tape-deck/ReelTapeDeck';
import tapeDeckStyles from '~/components/ui/tape-deck/ReelTapeDeck.css?url';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tapeDeckStyles },
];

export default function Index() {
  return <ReelTapeDeck variant="studio-light" autoPlay={true} />;
}`}</pre>
                </div>
              )}
            </section>

            {/* Section 5: Design Tokens & Theming */}
            <section id="tokens" className="modui-docs-card modui-reveal modui-scale-up">
              <div className="modui-docs-card-header">
                <span className="modui-docs-section-tag">05 // STYLE TOKENS</span>
                <h2 className="modui-docs-section-title">Design Tokens & Theming System</h2>
              </div>
              <p className="modui-docs-p">
                ModUI is styled entirely through standard CSS custom properties. Click any swatch below to copy its variable name directly into your clipboard:
              </p>

              {/* Live Search for Tokens */}
              <div className="modui-docs-token-search-bar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Filter color tokens (e.g. Cobalt, border, canvas)..."
                  value={tokenSearch}
                  onChange={(e) => setTokenSearch(e.target.value)}
                  className="modui-docs-token-input"
                />
              </div>

              {/* Interactive Token Swatches Grid */}
              <div className="modui-docs-swatches-grid">
                {filteredTokens.map((token) => (
                  <button
                    key={token.variable}
                    type="button"
                    className="modui-docs-swatch-card"
                    onClick={() => copyCode(token.variable, token.variable, token.name)}
                    title={`Click to copy ${token.variable}`}
                  >
                    <div className="modui-docs-swatch-preview" style={{ backgroundColor: token.hex }} />
                    <div className="modui-docs-swatch-info">
                      <div className="modui-docs-swatch-top">
                        <span className="modui-docs-swatch-name">{token.name}</span>
                        <span className="modui-docs-swatch-hex">{token.hex}</span>
                      </div>
                      <code className="modui-docs-swatch-var">{token.variable}</code>
                      <span className="modui-docs-swatch-role">{token.role}</span>
                    </div>
                    {copiedId === token.variable && (
                      <span className="modui-docs-swatch-toast">Copied!</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Global CSS Tokens Specification Block */}
              <div className="modui-code-container" style={{ marginTop: '1.75rem' }}>
                <div className="modui-code-header">
                  <span>CSS TOKENS SPECIFICATION (index.css)</span>
                  <button
                    type="button"
                    className="modui-docs-copy-action"
                    onClick={() =>
                      copyCode(
                        `:root {
  --bg-app: #F8F7F2;
  --bg-surface: #FFFFFF;
  --bg-surface-elevated: #FAF9F5;
  --border-default: #E4E1D9;
  --border-strong: #C8C5BC;
  --accent-primary: #365CF5;
  --accent-primary-hover: #2445D4;
  --text-primary: #20201E;
  --text-secondary: #696963;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --font-sans: 'Manrope', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}`,
                        'tokens-spec',
                        'Tokens Spec'
                      )
                    }
                  >
                    <span>{copiedId === 'tokens-spec' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="modui-code-pre">{`:root {
  --bg-app: #F8F7F2;
  --bg-surface: #FFFFFF;
  --bg-surface-elevated: #FAF9F5;
  --border-default: #E4E1D9;
  --border-strong: #C8C5BC;
  --accent-primary: #365CF5;
  --accent-primary-hover: #2445D4;
  --text-primary: #20201E;
  --text-secondary: #696963;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --font-sans: 'Manrope', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}`}</pre>
              </div>
            </section>

            {/* Section 6: Component Lifecycle */}
            <section id="workflow" className="modui-docs-card modui-reveal modui-scale-up">
              <div className="modui-docs-card-header">
                <span className="modui-docs-section-tag">06 // CRAFT</span>
                <h2 className="modui-docs-section-title">Incremental Component Workflow</h2>
              </div>
              <p className="modui-docs-p">
                Every primitive in the ModUI catalogue is created through an engineering cycle:
              </p>

              <ol className="modui-docs-ordered-list">
                <li>
                  <strong>Standalone TypeScript Contract:</strong> Define exhaustive interface props, variant types, and sensible defaults with zero internal framework ties.
                </li>
                <li>
                  <strong>Physics & Micro-Interactions:</strong> Implement physics springs, drag detents, pointer capture, and synthesized audio cues.
                </li>
                <li>
                  <strong>Automated Vitest Test Suite:</strong> Write unit and integration tests verifying rendering, ARIA attributes, callbacks, and keyboard interactions.
                </li>
                <li>
                  <strong>Catalog Documentation:</strong> Register metadata in <code>COMPONENT_REGISTRY</code> with dedicated TSX, CSS, and Usage code tabs.
                </li>
                <li>
                  <strong>Browser & Mobile Verification:</strong> Test real-world browser execution at 375px mobile, tablet, and 1440px desktop breakpoints.
                </li>
              </ol>
            </section>

            {/* Section 7: Contributing & Community */}
            <section id="contributing" className="modui-docs-card modui-reveal modui-scale-up">
              <div className="modui-docs-card-header">
                <span className="modui-docs-section-tag">07 // OPEN SOURCE</span>
                <h2 className="modui-docs-section-title">Contributing Guidelines & Community</h2>
              </div>
              <p className="modui-docs-p">
                ModUI is completely open source under the permissive MIT license. We welcome contributions, bug reports, and new primitive proposals from creative engineers worldwide.
              </p>

              <div className="modui-docs-contrib-actions">
                <a
                  href="https://github.com/ShakilUrRehman21/modui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modui-cta-btn"
                  onClick={() => trackGithubClick({ location: 'footer' })}
                  style={{ textDecoration: 'none' }}
                >
                  <span>View GitHub Repository</span>
                  <span style={{ marginLeft: '0.4rem' }}>↗</span>
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
