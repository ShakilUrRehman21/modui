import React, { useState } from 'react';
import { COMPONENT_REGISTRY } from '../../registry/components';
import { trackCopyCode, trackComponentInstall } from '../../lib/analytics';
import './SandboxSection.css';

interface SandboxSectionProps {
  onNavigate: (path: string) => void;
}

export const SandboxSection: React.FC<SandboxSectionProps> = ({ onNavigate }) => {
  const [bottomActiveTab, setBottomActiveTab] = useState<'tsx' | 'css' | 'usage'>('tsx');
  const [bottomCopied, setBottomCopied] = useState(false);
  const [cliCopied, setCliCopied] = useState(false);
  const [pkgManager, setPkgManager] = useState<'npm' | 'pnpm' | 'bun' | 'yarn'>('npm');

  const buttonData = COMPONENT_REGISTRY.find((c) => c.slug === 'animated-button');

  const getBottomCode = () => {
    if (!buttonData) return '';
    if (bottomActiveTab === 'tsx') return buttonData.rawSourceCode;
    if (bottomActiveTab === 'css') return buttonData.rawCssCode;
    return buttonData.codeSnippet;
  };

  const getBottomCodeLabel = () => {
    if (bottomActiveTab === 'tsx') return 'AnimatedButton.tsx';
    if (bottomActiveTab === 'css') return 'AnimatedButton.css';
    return 'Usage.tsx';
  };

  const handleBottomCopy = (text: string, label?: string) => {
    navigator.clipboard.writeText(text);
    if (label === 'Peer Dependency Command') {
      setCliCopied(true);
      setTimeout(() => setCliCopied(false), 2000);
    } else {
      setBottomCopied(true);
      setTimeout(() => setBottomCopied(false), 2000);
    }

    const isCli = label === 'Peer Dependency Command';
    trackCopyCode({
      component: isCli ? 'react-peer-dependencies' : 'animated-button',
      file: label || getBottomCodeLabel(),
      format: isCli ? 'terminal_command' : 'full_component',
      source: 'homepage_sandbox',
    });

    if (isCli) {
      trackComponentInstall({
        component: 'react-peer-dependencies',
        package_manager: pkgManager,
        method: 'cli',
      });
    }
  };

  return (
    <section className="modui-architecture-sandbox-section">
      <div className="modui-container">
        <div className="modui-sandbox-grid">
          {/* Left Column: Architecture Blueprint & Quick Install */}
          <div className="modui-sandbox-left modui-reveal">
            <h2 className="modui-section-title modui-sandbox-title">
              From browsing to shipping in three steps.
            </h2>
            <p className="modui-section-lede modui-sandbox-desc">
              Every component is self-contained, so it drops into any Next.js, Vite or Remix project.
              A couple of components use two small peer packages — install them once.
            </p>

            {/* 3-Step Copy & Own Workflow */}
            <div className="modui-integration-steps">
              <div className="modui-step-row">
                <div className="modui-step-number">01</div>
                <div className="modui-step-text">
                  <strong className="modui-step-label">Pick a component.</strong>{' '}
                  <span className="modui-step-desc">Open any card in the catalogue to try its variants live.</span>
                </div>
              </div>
              <div className="modui-step-row">
                <div className="modui-step-number">02</div>
                <div className="modui-step-text">
                  <strong className="modui-step-label">Copy the source.</strong>{' '}
                  <span className="modui-step-desc">Grab the .tsx, the .css and a usage example from the tabs.</span>
                </div>
              </div>
              <div className="modui-step-row">
                <div className="modui-step-number">03</div>
                <div className="modui-step-text">
                  <strong className="modui-step-label">Make it yours.</strong>{' '}
                  <span className="modui-step-desc">Paste both files into your repo and adjust the tokens.</span>
                </div>
              </div>
            </div>

            {/* Zero-CLI Integration Workflow */}
            <div className="modui-install-terminal-box">
              <div className="modui-install-pkg-tabs">
                <span className="modui-terminal-badge">Peer packages</span>
                {(['npm', 'pnpm', 'bun', 'yarn'] as const).map((pm) => (
                  <button
                    key={pm}
                    type="button"
                    className={`modui-pkg-tab ${pkgManager === pm ? 'modui-pkg-tab--active' : ''}`}
                    onClick={() => setPkgManager(pm)}
                  >
                    {pm}
                  </button>
                ))}
              </div>
              <div className="modui-install-code-line">
                <code>
                  {pkgManager === 'npm' && 'npm install lucide-react canvas-confetti'}
                  {pkgManager === 'pnpm' && 'pnpm add lucide-react canvas-confetti'}
                  {pkgManager === 'bun' && 'bun add lucide-react canvas-confetti'}
                  {pkgManager === 'yarn' && 'yarn add lucide-react canvas-confetti'}
                </code>
                <button
                  type="button"
                  className="modui-terminal-copy-btn"
                  onClick={() =>
                    handleBottomCopy(
                      pkgManager === 'npm'
                        ? 'npm install lucide-react canvas-confetti'
                        : pkgManager === 'pnpm'
                        ? 'pnpm add lucide-react canvas-confetti'
                        : pkgManager === 'bun'
                        ? 'bun add lucide-react canvas-confetti'
                        : 'yarn add lucide-react canvas-confetti',
                      'Peer Dependency Command'
                    )
                  }
                >
                  {cliCopied ? (
                    <span className="modui-terminal-copied">Copied</span>
                  ) : (
                    <span>Copy</span>
                  )}
                </button>
              </div>
            </div>

            <div className="modui-sandbox-actions">
              <button
                onClick={() => onNavigate('/docs')}
                className="modui-secondary-btn"
                data-magnetic
              >
                <span>Read the docs</span>
              </button>
            </div>
          </div>

          {/* Right Column: Code Terminal & File Tabs */}
          <div className="modui-sandbox-right modui-reveal modui-delay-2">
            <div className="modui-sandbox-console-card">
              <div className="modui-console-tabs-bar">
                <div className="modui-console-file-tabs">
                  <button
                    type="button"
                    className={`modui-console-tab ${bottomActiveTab === 'tsx' ? 'modui-console-tab--active' : ''}`}
                    onClick={() => setBottomActiveTab('tsx')}
                  >
                    AnimatedButton.tsx
                  </button>
                  <button
                    type="button"
                    className={`modui-console-tab ${bottomActiveTab === 'css' ? 'modui-console-tab--active' : ''}`}
                    onClick={() => setBottomActiveTab('css')}
                  >
                    AnimatedButton.css
                  </button>
                  <button
                    type="button"
                    className={`modui-console-tab ${bottomActiveTab === 'usage' ? 'modui-console-tab--active' : ''}`}
                    onClick={() => setBottomActiveTab('usage')}
                  >
                    Usage.tsx
                  </button>
                </div>

                <button
                  type="button"
                  className={`modui-console-copy-btn ${bottomCopied ? 'modui-console-copy-btn--copied' : ''}`}
                  onClick={() => handleBottomCopy(getBottomCode())}
                >
                  {bottomCopied ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="modui-console-pre" key={bottomActiveTab}>
                <code>{getBottomCode()}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SandboxSection;
