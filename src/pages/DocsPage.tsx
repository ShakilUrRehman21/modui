import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/badge';
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

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const topOffset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - topOffset,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const totalHeight = document.documentElement.scrollHeight;

      // If user reaches within 160px of the bottom of the page, activate the last item ('contributing')
      if (scrollBottom >= totalHeight - 160) {
        setActiveSection('contributing');
        return;
      }

      // Check section bounding rects from bottom to top
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160) {
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
    <div className="modui-container modui-docs-page">
      <div className="modui-docs-grid">
        {/* Sidebar Navigation */}
        <aside className="modui-docs-sidebar">
          <Badge variant="accent" dot style={{
            marginBottom: '0.85rem', width: 'fit-content',
          }}>
            Documentation
          </Badge>
          <div className="modui-docs-nav-list" role="navigation" aria-label="Documentation sections">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
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
                <span>Component Catalogue</span>
              </button>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <div className="modui-docs-content">
          {/* Section 1: Introduction */}
          <section id="introduction" className="modui-docs-section">
            <h2 className="modui-docs-section-title">Introduction to ModUI</h2>
            <p className="modui-docs-p">
              ModUI is an open-source, modular React UI library and interactive playground engineered around a core tenet: <strong>Modular UI, thoughtfully built</strong>.
            </p>
            <p className="modui-docs-p">
              Unlike monolithic component libraries that dictate heavy node_modules runtimes, inflexible CSS-in-JS runtimes, and opinionated bundle wrappers, ModUI provides clean, isolated TypeScript components coupled with predictable, standard CSS custom properties.
            </p>
          </section>

          {/* Section 2: Copy-Paste Architecture */}
          <section id="philosophy" className="modui-docs-section">
            <h2 className="modui-docs-section-title">The Copy-Paste Architecture</h2>
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
│   │       ├── button/
│   │       │   ├── AnimatedButton.tsx
│   │       │   ├── AnimatedButton.css
│   │       ├── badge/
│   │       │   ├── Badge.tsx
│   │       │   ├── Badge.css
│   │       │   └── index.ts
│   │       └── motion/
│   │           ├── KineticText.tsx
│   │           └── KineticText.css`}</pre>
            </div>
          </section>

          {/* Section 3: Design Tokens & Theming */}
          <section id="tokens" className="modui-docs-section">
            <h2 className="modui-docs-section-title">Design Tokens & Theming</h2>
            <p className="modui-docs-p">
              ModUI is styled through standard CSS custom properties. Clean slate surfaces, electric royal indigo accents, and subtle borders are supported out of the box with zero runtime overhead:
            </p>
            <div className="modui-code-container">
              <div className="modui-code-header">
                <span>CSS VARIABLES TOKENS (index.css)</span>
                <button
                  type="button"
                  className="modui-docs-copy-action"
                  onClick={() => copyCode(`:root {
  --bg-app: #F8FAFC;
  --bg-surface: #FFFFFF;
  --bg-surface-elevated: #F1F5F9;
  --accent-primary: #4F46E5;
  --accent-primary-hover: #4338CA;
  --accent-cyan: #06B6D4;
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --radius-md: 14px;
  --font-sans: 'Plus Jakarta Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}`, 'tokens')}
                >
                  <span>{copiedId === 'tokens' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="modui-code-pre">{`:root {
  --bg-app: #F8FAFC;
  --bg-surface: #FFFFFF;
  --bg-surface-elevated: #F1F5F9;
  --accent-primary: #4F46E5;
  --accent-primary-hover: #4338CA;
  --accent-cyan: #06B6D4;
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --radius-md: 14px;
  --transition-normal: 280ms cubic-bezier(0.16, 1, 0.3, 1);
}`}</pre>
            </div>
          </section>

          {/* Section 4: Accessibility */}
          <section id="accessibility" className="modui-docs-section">
            <h2 className="modui-docs-section-title">Accessibility Standards</h2>
            <p className="modui-docs-p">
              Visual excellence must never compromise accessibility. ModUI adheres to WCAG 2.1 AA criteria:
            </p>
            <ul className="modui-docs-list">
              <li>Semantic HTML elements (<code>&lt;button&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;dialog&gt;</code>).</li>
              <li>High-contrast focus rings for keyboard users (<code>:focus-visible</code>).</li>
              <li>ARIA role attributes and state notifications (<code>aria-busy</code>, <code>aria-disabled</code>, <code>aria-modal</code>).</li>
              <li>Respect for user motion preferences (<code>prefers-reduced-motion</code>).</li>
            </ul>
          </section>

          {/* Section 5: The Component Workflow */}
          <section id="workflow" className="modui-docs-section">
            <h2 className="modui-docs-section-title">Incremental Component Workflow</h2>
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
          <section id="contributing" className="modui-docs-section">
            <h2 className="modui-docs-section-title">Contributing Guidelines</h2>
            <p className="modui-docs-p">
              ModUI welcomes contributions. Open a pull request with new components or improvements to existing ones, accompanied by automated tests and accessible semantics.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
