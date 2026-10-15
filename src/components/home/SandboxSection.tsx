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
  const [pkgManager, setPkgManager] = useState<'npm' | 'pnpm' | 'bun'>('npm');

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
    setBottomCopied(true);
    setTimeout(() => setBottomCopied(false), 2000);

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
          <div className="modui-sandbox-left">
            <div className="modui-eyebrow">MODUI ARCHITECTURE</div>
            <h2 className="modui-sandbox-title">
              Direct integration. Zero boilerplate.
            </h2>
            <p className="modui-sandbox-desc">
              All ModUI modules are self-contained and engineered to plug cleanly into any existing Next.js, Vite, or Remix repository.
            </p>

            {/* Zero-CLI Integration Workflow */}
            <div className="modui-install-terminal-box">
              <div className="modui-install-pkg-tabs">
                <span className="modui-terminal-badge">React Peer Deps</span>
                {(['npm', 'pnpm', 'bun'] as const).map((pm) => (
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
                        : 'bun add lucide-react canvas-confetti',
                      'Peer Dependency Command'
                    )
                  }
                >
                  Copy
                </button>
              </div>
            </div>

            {/* 3-Step Copy & Own Workflow */}
            <div className="modui-integration-steps">
              <div className="modui-step-row">
                <div className="modui-step-number">1</div>
                <div className="modui-step-text">
                  <strong>Select Component:</strong> Browse our catalogue and click any module card to inspect live variations.
                </div>
              </div>
              <div className="modui-step-row">
                <div className="modui-step-number">2</div>
                <div className="modui-step-text">
                  <strong>Copy Source Code:</strong> Switch between the dedicated TSX, CSS, and Usage tabs to copy clean code.
                </div>
              </div>
              <div className="modui-step-row">
                <div className="modui-step-number">3</div>
                <div className="modui-step-text">
                  <strong>Own & Customize:</strong> Paste files into your repository and tailor design tokens directly.
                </div>
              </div>
            </div>

            {/* Engineering Principles */}
            <div className="modui-engineering-pills">
              <div className="modui-eng-pill">
                <span className="modui-eng-bullet">✓</span>
                <span>Zero vendor lock-in</span>
              </div>
              <div className="modui-eng-pill">
                <span className="modui-eng-bullet">✓</span>
                <span>100% TypeScript typed</span>
              </div>
              <div className="modui-eng-pill">
                <span className="modui-eng-bullet">✓</span>
                <span>Standard CSS custom properties</span>
              </div>
            </div>

            <div>
              <button
                onClick={() => onNavigate('/components')}
                className="modui-cta-btn"
              >
                <span>Browse All Components</span>
                <span style={{ marginLeft: '0.4rem' }}>→</span>
              </button>
            </div>
          </div>

          {/* Right Column: Code Terminal & File Tabs */}
          <div className="modui-sandbox-right">
            <div className="modui-sandbox-console-card">
              <div className="modui-console-tabs-bar">
                <div className="modui-console-window-dots">
                  <span className="modui-console-dot modui-console-dot--red" />
                  <span className="modui-console-dot modui-console-dot--yellow" />
                  <span className="modui-console-dot modui-console-dot--green" />
                </div>

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
                  <span>{bottomCopied ? '✓ Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="modui-console-pre">
                <code>{getBottomCode()}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
