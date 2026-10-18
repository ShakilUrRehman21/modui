import React, { useState, useEffect, useRef } from 'react';
import { trackCopyCode } from '../lib/analytics';
import './DocsPage.css';

interface DocsPageProps {
  onNavigate?: (path: string) => void;
}

const NAV_ITEMS = [
  { id: 'introduction', label: 'Introduction to ModUI' },
  { id: 'philosophy', label: 'Copy-Paste Architecture' },
  { id: 'tokens', label: 'Design Tokens & Theming' },
  { id: 'accessibility', label: 'Accessibility Standards' },
  { id: 'workflow', label: 'Component Workflow' },
  { id: 'contributing', label: 'Contributing Guidelines' },
];

export const DocsPage: React.FC<DocsPageProps> = ({ onNavigate }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('introduction');
  const navListRef = useRef<HTMLDivElement>(null);
  const navBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const isProgrammaticScrollRef = useRef(false);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);

    trackCopyCode({
      component: 'docs',
      file: id,
      format: 'snippet',
      source: 'docs_page',
    });
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    isProgrammaticScrollRef.current = true;
    const element = document.getElementById(id);
    if (element) {
      const isMobile = window.innerWidth <= 960;
      const topOffset = isMobile ? 120 : 100;
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

  // Keep active pill centered in horizontal scroll track on mobile/tablet without fighting vertical scroll
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

  return (
    <div className="modui-docs-page">
      <div className="modui-container">
        {/* Top Header matching Explorer page */}
        <div className="modui-docs-header">
          <div className="modui-docs-eyebrow">
            <span className="modui-docs-eyebrow-dot" />
            <span>DOCUMENTATION // ARCHITECTURE</span>
            <span className="modui-docs-eyebrow-tag">v2.0 SPECIFICATION</span>
          </div>
          <h1 className="modui-docs-title">Engineering Documentation.</h1>
          <p className="modui-docs-subtitle">
            Practical reference guides, design tokens, copy-paste architecture, and accessibility standards for ModUI modular primitives.
          </p>
        </div>

        <div className="modui-docs-grid">
          {/* Sidebar Navigation */}
          <aside className="modui-docs-sidebar">
            <div className="modui-docs-sidebar-header">
              <span className="modui-docs-sidebar-title">QUICK NAVIGATION</span>
            </div>
            <div ref={navListRef} className="modui-docs-nav-list" role="navigation" aria-label="Documentation sections">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  ref={(el) => {
                    navBtnRefs.current[item.id] = el;
                  }}
                  type="button"
                  className={`modui-docs-nav-item ${activeSection === item.id ? 'modui-docs-nav-item--active' : ''}`}
                  onClick={() => scrollToSection(item.id)}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {onNavigate && (
              <div className="modui-docs-sidebar-footer">
                <button
                  type="button"
                  className="modui-docs-explore-btn"
                  onClick={() => onNavigate('/components')}
                >
                  <span>Browse Components</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            )}
          </aside>

          {/* Main Content with Studio Cards */}
          <div className="modui-docs-content">
            {/* Section 1: Introduction */}
            <section id="introduction" className="modui-docs-card">
              <div className="modui-docs-card-header">
                <span className="modui-docs-section-tag">OVERVIEW</span>
                <h2 className="modui-docs-section-title">Introduction to ModUI</h2>
              </div>
              <p className="modui-docs-p">
                ModUI is an open-source, modular React UI library and interactive playground engineered around a core tenet: <strong>Modular UI, thoughtfully built</strong>.
              </p>
              <p className="modui-docs-p">
                Unlike monolithic component libraries that dictate heavy node_modules runtimes, inflexible CSS-in-JS runtimes, and opinionated bundle wrappers, ModUI provides clean, isolated TypeScript components coupled with predictable, standard CSS custom properties.
              </p>
            </section>

            {/* Section 2: Copy-Paste Architecture */}
            <section id="philosophy" className="modui-docs-card">
              <div className="modui-docs-card-header">
                <span className="modui-docs-section-tag">PHILOSOPHY</span>
                <h2 className="modui-docs-section-title">The Copy-Paste Architecture</h2>
              </div>
              <p className="modui-docs-p">
                Every component lives independently within <code>src/components/ui/&lt;name&gt;</code>. You copy the component TSX and its companion CSS file straight into your repository. You own 100% of the code:
              </p>
              <div className="modui-code-container">
                <div className="modui-code-header">
                  <span>PROJECT DIRECTORY STRUCTURE</span>
                </div>
                <pre className="modui-code-pre">{`your-project/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── radial-hub/
│   │       │   ├── RadialOrbitHub.tsx
│   │       │   ├── RadialOrbitHub.css
│   │       │   └── index.ts
│   │       ├── slider/
│   │       │   ├── BeforeAfterSlider.tsx
│   │       │   ├── BeforeAfterSlider.css
│   │       │   └── index.ts
│   │       ├── accordion/
│   │       │   ├── FluidElasticAccordion.tsx
│   │       │   ├── FluidElasticAccordion.css
│   │       │   └── index.ts`}</pre>
              </div>
            </section>

            {/* Section 3: Design Tokens & Theming */}
            <section id="tokens" className="modui-docs-card">
              <div className="modui-docs-card-header">
                <span className="modui-docs-section-tag">STYLE TOKENS</span>
                <h2 className="modui-docs-section-title">Design Tokens & Theming</h2>
              </div>
              <p className="modui-docs-p">
                ModUI is styled through standard CSS custom properties. Clean studio surfaces, electric Cobalt accents, and subtle borders are supported out of the box with zero runtime overhead:
              </p>
              <div className="modui-code-container">
                <div className="modui-code-header">
                  <span>CSS TOKENS SPECIFICATION (index.css)</span>
                  <button
                    type="button"
                    className="modui-docs-copy-action"
                    onClick={() => copyCode(`:root {
  --bg-app: #F8F7F2;
  --bg-surface: #FFFFFF;
  --bg-surface-elevated: #FAF9F5;
  --border-default: #E4E1D9;
  --border-strong: #C8C5BC;
  --accent-primary: #365CF5;
  --accent-primary-hover: #2445D4;
  --text-primary: #20201E;
  --text-secondary: #6A6D76;
  --font-sans: 'Manrope', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}`, 'tokens')}
                  >
                    <span>{copiedId === 'tokens' ? 'Copied' : 'Copy'}</span>
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
  --text-secondary: #6A6D76;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --font-sans: 'Manrope', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}`}</pre>
              </div>
            </section>

            {/* Section 4: Accessibility */}
            <section id="accessibility" className="modui-docs-card">
              <div className="modui-docs-card-header">
                <span className="modui-docs-section-tag">ACCESSIBILITY</span>
                <h2 className="modui-docs-section-title">Accessibility Standards</h2>
              </div>
              <p className="modui-docs-p">
                Visual excellence must never compromise accessibility. ModUI adheres to WCAG 2.1 AA criteria:
              </p>
              <ul className="modui-docs-list">
                <li>Semantic HTML elements (<code>&lt;button&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;dialog&gt;</code>).</li>
                <li>High-contrast focus rings for keyboard users (<code>:focus-visible</code> with Cobalt accent).</li>
                <li>ARIA role attributes, values, and state updates (<code>aria-valuenow</code>, <code>aria-valuetext</code>, <code>aria-expanded</code>).</li>
                <li>Native respect for user motion preferences via <code>prefers-reduced-motion</code> media queries.</li>
              </ul>
            </section>

            {/* Section 5: The Component Workflow */}
            <section id="workflow" className="modui-docs-card">
              <div className="modui-docs-card-header">
                <span className="modui-docs-section-tag">WORKFLOW</span>
                <h2 className="modui-docs-section-title">Incremental Component Workflow</h2>
              </div>
              <p className="modui-docs-p">
                Every component in ModUI is created through a rigorous engineering cycle:
              </p>
              <ol className="modui-docs-list modui-docs-list--ordered">
                <li>Design standalone React + TypeScript implementation with zero vendor lock-in.</li>
                <li>Add micro-interactions, responsive states, and accessible keyboard navigation.</li>
                <li>Write automated unit tests with Vitest & React Testing Library.</li>
                <li>Register in <code>COMPONENT_REGISTRY</code> with props documentation and dedicated TSX, CSS & Usage tabs.</li>
                <li>Integrate into Explorer and test live demo in the browser.</li>
              </ol>
            </section>

            {/* Section 6: Contributing */}
            <section id="contributing" className="modui-docs-card">
              <div className="modui-docs-card-header">
                <span className="modui-docs-section-tag">OPEN SOURCE</span>
                <h2 className="modui-docs-section-title">Contributing Guidelines</h2>
              </div>
              <p className="modui-docs-p">
                ModUI welcomes contributions. Open a pull request with new components or improvements to existing ones, accompanied by automated tests and accessible semantics.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
