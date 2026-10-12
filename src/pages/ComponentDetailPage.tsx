import React, { useState } from 'react';
import { AnimatedButton } from '../components/ui/button';
import type { ButtonVariant, ButtonSize } from '../components/ui/button';
import { KineticText } from '../components/ui/motion/KineticText';
import { Badge } from '../components/ui/badge';
import { COMPONENT_REGISTRY } from '../registry/components';
import { trackCopyCode, trackGithubClick, trackPreviewOpen } from '../lib/analytics';
import './ComponentDetailPage.css';

interface ComponentDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ComponentDetailPage: React.FC<ComponentDetailPageProps> = ({
  slug,
  onNavigate,
}) => {
  const component = COMPONENT_REGISTRY.find((c) => c.slug === slug);

  // Playground state for AnimatedButton
  const [btnVariant, setBtnVariant] = useState<ButtonVariant>('shimmer');
  const [btnSize, setBtnSize] = useState<ButtonSize>('md');
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [btnText, setBtnText] = useState('Interactive Action');

  // File viewer state inside Code tab
  const [selectedFile, setSelectedFile] = useState<'tsx' | 'css' | 'usage'>('tsx');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Main navigation tabs
  const [activeTab, setActiveTab] = useState<'code' | 'props' | 'a11y'>('code');

  if (!component) {
    return (
      <div className="modui-container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '1rem', color: '#fff' }}>
          Component Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: 'var(--text-sm)' }}>
          The requested module "{slug}" was not found in the catalogue.
        </p>
        <button
          onClick={() => onNavigate('/components')}
          style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--accent-primary)', textDecoration: 'underline' }}
        >
          Return to Components
        </button>
      </div>
    );
  }

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

  return (
    <div className="modui-container modui-detail-page">
      {/* Breadcrumb */}
      <nav className="modui-breadcrumb" aria-label="Breadcrumb">
        <span className="modui-breadcrumb-link" onClick={() => onNavigate('/')}>
          Overview
        </span>
        <span className="modui-breadcrumb-sep">/</span>
        <span className="modui-breadcrumb-link" onClick={() => onNavigate('/components')}>
          Components
        </span>
        <span className="modui-breadcrumb-sep">/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{component.name}</span>
      </nav>

      {/* Header Info - NO external code copy button here (copy opt ONLY inside tab) */}
      <div className="modui-detail-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <Badge variant="accent">{component.category}</Badge>
            <span className="nomu-status-tag">{component.status}</span>
          </div>
          <h1 className="modui-detail-title">{component.name}</h1>
          <p className="modui-detail-desc">{component.description}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
          <a
            href={component.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="modui-action-btn-copy"
            title="GitHub Source"
            onClick={() => trackGithubClick({ location: 'component_header', component: component.slug })}
          >
            <span>GitHub</span>
          </a>
        </div>
      </div>

      {/* Interactive Studio Stage */}
      <div className="modui-studio-workbench">
        <div className="modui-canvas-stage">
          {slug === 'animated-button' && (
            <AnimatedButton
              variant={btnVariant}
              size={btnSize}
              loading={btnLoading}
              loadingText="Processing..."
              disabled={btnDisabled}
            >
              {btnText}
            </AnimatedButton>
          )}

          {slug === 'badge' && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
              <Badge variant="accent" dot pulse>
                Live Radar Pulse
              </Badge>
              <Badge variant="success" dot>
                System Active
              </Badge>
              <Badge variant="cyan">
                React 19 Ready
              </Badge>
              <Badge variant="default">
                Pure React
              </Badge>
            </div>
          )}

          {slug === 'kinetic-text' && (
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <KineticText
                as="h2"
                text="Crafted with kinetic physics & precision motion."
                interactiveWave={true}
              />
              <p style={{ marginTop: '1rem', color: '#71717a', fontSize: '0.85rem' }}>
                Hover cursor across letters to test real-time GSAP wave stagger.
              </p>
            </div>
          )}
        </div>

        {/* Playground Controls for Button */}
        {slug === 'animated-button' && (
          <div className="modui-controls-panel">
            <div className="modui-control-group">
              <label className="modui-control-label">Variant</label>
              <select
                className="modui-control-select"
                value={btnVariant}
                onChange={(e) => setBtnVariant(e.target.value as ButtonVariant)}
              >
                <option value="shimmer">shimmer</option>
                <option value="glow">glow</option>
                <option value="ripple">ripple</option>
                <option value="magnetic">magnetic</option>
                <option value="slide">slide</option>
                <option value="gradient-border">gradient-border</option>
                <option value="minimal">minimal</option>
              </select>
            </div>

            <div className="modui-control-group">
              <label className="modui-control-label">Size</label>
              <select
                className="modui-control-select"
                value={btnSize}
                onChange={(e) => setBtnSize(e.target.value as ButtonSize)}
              >
                <option value="sm">sm (32px)</option>
                <option value="md">md (40px)</option>
                <option value="lg">lg (48px)</option>
              </select>
            </div>

            <div className="modui-control-group">
              <label className="modui-control-label">Label</label>
              <input
                type="text"
                className="modui-control-input"
                value={btnText}
                onChange={(e) => setBtnText(e.target.value)}
              />
            </div>

            <div className="modui-control-group">
              <label className="modui-control-label">States</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="modui-control-toggle">
                  <input
                    type="checkbox"
                    checked={btnLoading}
                    onChange={(e) => setBtnLoading(e.target.checked)}
                  />
                  <span>Loading state</span>
                </label>
                <label className="modui-control-toggle">
                  <input
                    type="checkbox"
                    checked={btnDisabled}
                    onChange={(e) => setBtnDisabled(e.target.checked)}
                  />
                  <span>Disabled state</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Tabs Navigation */}
      <div className="modui-detail-tabs-bar" role="tablist">
        <button
          className={`modui-detail-tab-btn ${activeTab === 'code' ? 'modui-detail-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('code')}
          role="tab"
        >
          <span>Code & Implementation</span>
        </button>
        <button
          className={`modui-detail-tab-btn ${activeTab === 'props' ? 'modui-detail-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('props')}
          role="tab"
        >
          <span>Props & API</span>
        </button>
        <button
          className={`modui-detail-tab-btn ${activeTab === 'a11y' ? 'modui-detail-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('a11y')}
          role="tab"
        >
          <span>Accessibility</span>
        </button>
      </div>

      {/* TAB 1: CODE — Here user has the 3 files (Component TSX, CSS, Usage) and Copy is ONLY inside tab */}
      {activeTab === 'code' && (
        <div className="modui-code-section-wrap">
          {/* File Switcher Tabs */}
          <div className="modui-code-file-tabs">
            <button
              className={`modui-code-tab-pill ${selectedFile === 'tsx' ? 'modui-code-tab-pill--active' : ''}`}
              onClick={() => setSelectedFile('tsx')}
            >
              <span>{component.name}.tsx</span>
              <span className="modui-tab-badge">Component</span>
            </button>

            <button
              className={`modui-code-tab-pill ${selectedFile === 'css' ? 'modui-code-tab-pill--active' : ''}`}
              onClick={() => setSelectedFile('css')}
            >
              <span>{component.name}.css</span>
              <span className="modui-tab-badge">CSS Styles</span>
            </button>

            <button
              className={`modui-code-tab-pill ${selectedFile === 'usage' ? 'modui-code-tab-pill--active' : ''}`}
              onClick={() => setSelectedFile('usage')}
            >
              <span>Usage.tsx</span>
              <span className="modui-tab-badge">How to Use</span>
            </button>
          </div>

          {/* Code Viewer Container With Explicit Copy Inside */}
          <div className="modui-code-container">
            <div className="modui-code-header">
              <div className="modui-code-file-meta">
                <span className="modui-code-file-dot" />
                <span className="modui-code-file-name">{getFileLabel()}</span>
                <span className="modui-code-file-type">
                  {selectedFile === 'tsx' ? 'TypeScript / React' : selectedFile === 'css' ? 'CSS3 Stylesheet' : 'Usage Example'}
                </span>
              </div>

              {/* COPY BUTTON INSIDE ITS TAB */}
              <button
                className={`modui-btn-copy-action ${copiedKey === selectedFile ? 'modui-btn-copy-action--success' : ''}`}
                onClick={() => handleCopyInsideTab(getActiveCode(), getFileLabel())}
                title={`Copy ${getFileLabel()}`}
              >
                <span>
                  {copiedKey === selectedFile
                    ? 'Copied to Clipboard!'
                    : `Copy ${getFileLabel()}`}
                </span>
              </button>
            </div>

            <pre className="modui-code-pre">
              <code>{getActiveCode()}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: PROPS */}
      {activeTab === 'props' && (
        <div>
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
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              Standard React HTML attributes supported.
            </p>
          )}
        </div>
      )}

      {/* TAB 3: ACCESSIBILITY */}
      {activeTab === 'a11y' && (
        <div>
          <ul className="modui-a11y-list">
            {component.accessibilityNotes.map((note, idx) => (
              <li key={idx} className="modui-a11y-item">
                <span className="modui-a11y-bullet">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ComponentDetailPage;
