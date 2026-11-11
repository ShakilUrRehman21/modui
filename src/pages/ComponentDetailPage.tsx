import React, { useState, useEffect, useLayoutEffect, useRef, Suspense } from 'react';
import { updatePageSeo, generateComponentJsonLd } from '../lib/seo';
import { Badge } from '../components/ui/badge';
import { COMPONENT_REGISTRY } from '../registry/components';
import { trackCopyCode, trackGithubClick } from '../lib/analytics';
import { COMPONENT_DEMOS } from './component-demos';
import './ComponentDetailPage.css';

interface ComponentDetailPageProps {
  slug: string;
  theme?: 'light' | 'dark';
  onNavigate: (path: string) => void;
}

const StageLoadingSkeleton: React.FC = () => (
  <div className="modui-canvas-stage modui-stage-skeleton" role="status">
    <span className="modui-skeleton-spinner" aria-hidden="true" />
    <span className="modui-skeleton-label">Loading preview</span>
  </div>
);

export const ComponentDetailPage: React.FC<ComponentDetailPageProps> = ({
  slug,
  theme,
  onNavigate,
}) => {
  const component = COMPONENT_REGISTRY.find((c) => c.slug === slug);

  // Dynamic SEO metadata & JSON-LD Rich Snippet for Google Search
  useEffect(() => {
    if (component) {
      updatePageSeo({
        title: `${component.name} — ModUI React Component`,
        description: `${component.description} Drop-in React component with interactive live preview, TypeScript definitions, and zero external CSS dependencies.`,
        canonicalPath: `/components/${component.slug}`,
        keywords: [
          'react ' + component.slug,
          component.name,
          component.category,
          'react component',
          'copy paste ui',
          ...(component.tags || []),
        ],
        jsonLd: generateComponentJsonLd(component),
      });
    } else {
      updatePageSeo({
        title: 'Component Not Found — ModUI',
        description: 'The requested ModUI component could not be found in the registry.',
        canonicalPath: `/components/${slug}`,
      });
    }
  }, [component, slug]);

  // File viewer state inside Code tab
  const [selectedFile, setSelectedFile] = useState<'tsx' | 'css' | 'usage'>('tsx');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Main navigation tabs
  const [activeTab, setActiveTab] = useState<'code' | 'props' | 'a11y'>('code');

  // Sliding underline under the active documentation tab
  const tabsRef = useRef<HTMLDivElement>(null);
  const [tabLine, setTabLine] = useState({ x: 0, w: 0 });
  useLayoutEffect(() => {
    const measure = () => {
      const el = tabsRef.current?.querySelector<HTMLElement>('.modui-detail-tab-btn--active');
      if (el) setTabLine({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {});
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeTab, slug]);

  if (!component) {
    return (
      <div className="modui-container modui-detail-missing">
        <h1 className="modui-section-title">We couldn’t find “{slug}”.</h1>
        <p className="modui-section-lede">It may have been renamed. Browse the catalogue to find it.</p>
        <button className="modui-cta-btn" onClick={() => onNavigate('/components')}>
          Browse components
        </button>
      </div>
    );
  }

  const index = COMPONENT_REGISTRY.findIndex((c) => c.slug === component.slug);
  const prevComp = COMPONENT_REGISTRY[(index - 1 + COMPONENT_REGISTRY.length) % COMPONENT_REGISTRY.length];
  const nextComp = COMPONENT_REGISTRY[(index + 1) % COMPONENT_REGISTRY.length];

  // Copy handler exclusively for inside code tab
  const handleCopyInsideTab = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(selectedFile);
    setTimeout(() => setCopiedKey(null), 2000);

    trackCopyCode({
      component: component.slug,
      file: label || getFileLabel(),
      format: selectedFile === 'css' ? 'css' : selectedFile === 'tsx' ? 'full_component' : 'snippet',
      source: 'component_detail_tab',
    });
  };

  const getActiveCode = () => {
    if (selectedFile === 'tsx') return component.rawSourceCode;
    if (selectedFile === 'css') return component.rawCssCode;
    return component.codeSnippet;
  };

  const getFileLabel = () => {
    if (selectedFile === 'tsx') return `${component.name}.tsx`;
    if (selectedFile === 'css') return `${component.name}.css`;
    return 'Usage.tsx';
  };

  const DemoComponent = COMPONENT_DEMOS[slug];

  return (
    <div className="modui-detail-page-wrap">
      <div className="modui-container modui-detail-page">
        {/* Breadcrumb */}
        <nav className="modui-breadcrumb" aria-label="Breadcrumb">
          <a
            href="/"
            className="modui-breadcrumb-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
          >
            Overview
          </a>
          <span className="modui-breadcrumb-sep" aria-hidden="true">/</span>
          <a
            href="/components"
            className="modui-breadcrumb-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/components');
            }}
          >
            Components
          </a>
          <span className="modui-breadcrumb-sep" aria-hidden="true">/</span>
          <span className="modui-breadcrumb-current" aria-current="page">{component.name}</span>
        </nav>

        {/* Header Info - NO external code copy button here (copy opt ONLY inside tab) */}
        <div className="modui-detail-header">
          <div>
            <div className="modui-detail-meta">
              <Badge variant="accent">{component.category}</Badge>
              <span className={`modui-status-tag modui-status-tag--${component.status}`}>
                {component.status === 'published' ? 'Stable' : 'In progress'}
              </span>
            </div>
            <h1 className="modui-detail-title">{component.name}</h1>
            <p className="modui-detail-desc">{component.description}</p>
          </div>

          <div className="modui-detail-header-actions">
            <a
              href={component.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="modui-action-btn-copy"
              title="View source on GitHub"
              data-magnetic="0.2"
              onClick={() => trackGithubClick({ location: 'component_header', component: component.slug })}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>View source</span>
            </a>
          </div>
        </div>

        {/* Interactive Studio Stage & Controls (Lazy-Loaded per Component) */}
        <div className="modui-studio-workbench">
          <Suspense fallback={<StageLoadingSkeleton />}>
            {DemoComponent ? (
              <DemoComponent theme={theme} />
            ) : (
              <div className="modui-canvas-stage">
                <p style={{ color: 'var(--text-secondary)' }}>No interactive playground available for this module.</p>
              </div>
            )}
          </Suspense>
        </div>

        {/* Main Tabs Navigation & Documentation Section */}
        <div className="modui-detail-tabs-section modui-reveal">
          <div className="modui-detail-tabs-bar" role="tablist" ref={tabsRef}>
            <span
              className="modui-detail-tab-line"
              aria-hidden="true"
              style={{ transform: `translateX(${tabLine.x}px)`, width: tabLine.w }}
            />
            <button
              className={`modui-detail-tab-btn ${activeTab === 'code' ? 'modui-detail-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('code')}
              role="tab"
              aria-selected={activeTab === 'code'}
            >
              <span>Code</span>
            </button>
            <button
              className={`modui-detail-tab-btn ${activeTab === 'props' ? 'modui-detail-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('props')}
              role="tab"
              aria-selected={activeTab === 'props'}
            >
              <span>Props</span>
            </button>
            <button
              className={`modui-detail-tab-btn ${activeTab === 'a11y' ? 'modui-detail-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('a11y')}
              role="tab"
              aria-selected={activeTab === 'a11y'}
            >
              <span>Accessibility</span>
            </button>
          </div>

          {/* TAB 1: CODE — Here user has the 3 files (Component TSX, CSS, Usage) and Copy is ONLY inside tab */}
          {activeTab === 'code' && (
            <div className="modui-code-section-wrap modui-tab-panel" role="tabpanel">
              {/* File Switcher Tabs */}
              <div className="modui-code-file-tabs">
                <button
                  className={`modui-code-tab-pill ${selectedFile === 'tsx' ? 'modui-code-tab-pill--active' : ''}`}
                  onClick={() => setSelectedFile('tsx')}
                >
                  <span>{component.name}.tsx</span>

                </button>

                <button
                  className={`modui-code-tab-pill ${selectedFile === 'css' ? 'modui-code-tab-pill--active' : ''}`}
                  onClick={() => setSelectedFile('css')}
                >
                  <span>{component.name}.css</span>

                </button>

                <button
                  className={`modui-code-tab-pill ${selectedFile === 'usage' ? 'modui-code-tab-pill--active' : ''}`}
                  onClick={() => setSelectedFile('usage')}
                >
                  <span>Usage.tsx</span>

                </button>
              </div>

              {/* Code Viewer Container With Explicit Copy Inside */}
              <div className="modui-code-container">
                <div className="modui-code-header">
                  <div className="modui-code-file-meta">
                    <span className="modui-code-file-name">{getFileLabel()}</span>
                    <span className="modui-code-file-type">
                      {selectedFile === 'tsx' ? 'TypeScript' : selectedFile === 'css' ? 'CSS' : 'Example'}
                    </span>
                  </div>

                  {/* COPY BUTTON INSIDE ITS TAB */}
                  <button
                    className={`modui-btn-copy-action ${copiedKey === selectedFile ? 'modui-btn-copy-action--success' : ''}`}
                    onClick={() => handleCopyInsideTab(getActiveCode(), getFileLabel())}
                    title={`Copy ${getFileLabel()}`}
                  >
                    {copiedKey === selectedFile ? (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                    <span aria-live="polite">{copiedKey === selectedFile ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <pre className="modui-code-pre" key={selectedFile}>
                  <code>{getActiveCode()}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: PROPS */}
          {activeTab === 'props' && (
            <div className="modui-tab-panel" role="tabpanel">
              {component.propsDoc.length > 0 ? (
                <div className="modui-table-wrap">
                  <table className="modui-props-table">
                    <thead>
                      <tr>
                        <th>Prop</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {component.propsDoc.map((p) => (
                        <tr key={p.name}>
                          <td><span className="modui-prop-name">{p.name}</span></td>
                          <td><span className="modui-prop-type">{p.type}</span></td>
                          <td><span className="modui-prop-default">{p.defaultValue || '—'}</span></td>
                          <td>{p.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="modui-detail-note">
                  Accepts the standard HTML attributes of its root element.
                </p>
              )}
            </div>
          )}

          {/* TAB 3: ACCESSIBILITY */}
          {activeTab === 'a11y' && (
            <div className="modui-tab-panel" role="tabpanel">
              <ul className="modui-a11y-list">
                {component.accessibilityNotes.map((note, idx) => (
                  <li key={idx} className="modui-a11y-item">
                    <svg className="modui-a11y-bullet" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Previous / next in the catalogue */}
        <nav className="modui-detail-pager" aria-label="More components">
          {[
            { comp: prevComp, label: 'Previous', dir: 'prev' },
            { comp: nextComp, label: 'Next', dir: 'next' },
          ].map(({ comp, label, dir }) => (
            <a
              key={dir}
              href={`/components/${comp.slug}`}
              className={`modui-pager-card modui-pager-card--${dir} modui-spotlight`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/components/${comp.slug}`);
              }}
            >
              <span className="modui-pager-label">{label}</span>
              <span className="modui-pager-name">{comp.name}</span>
              <svg className="modui-pager-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {dir === 'prev' ? (
                  <>
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </>
                ) : (
                  <>
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </>
                )}
              </svg>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ComponentDetailPage;
