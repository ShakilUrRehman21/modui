import React, { useRef } from 'react';
import './Footer.css';
import { trackGithubClick } from '../../lib/analytics';
import { COMPONENT_REGISTRY } from '../../registry/components';

interface FooterProps {
  onNavigate: (path: string) => void;
}

const CURRENT_YEAR = new Date().getFullYear();
const GITHUB_URL = 'https://github.com/ShakilUrRehman21/modui';

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const wordmarkRef = useRef<HTMLDivElement>(null);

  // The oversized wordmark fills with colour around the pointer
  const handleWordmarkMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = wordmarkRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--wx', `${e.clientX - r.left}px`);
    el.style.setProperty('--wy', `${e.clientY - r.top}px`);
  };

  const link = (path: string, label: string) => (
    <a
      href={path}
      className="modui-footer-link"
      onClick={(e) => {
        e.preventDefault();
        onNavigate(path);
      }}
    >
      {label}
    </a>
  );

  return (
    <footer className="modui-footer">
      {/* Closing call to action */}
      <div className="modui-container">
        <div className="modui-footer-cta-card modui-reveal">
          <div className="modui-footer-cta-content">
            <h3 className="modui-footer-cta-title">Give your next interface a little more life.</h3>
            <p className="modui-footer-cta-desc">
              All {COMPONENT_REGISTRY.length} components are MIT licensed. Copy one in, and keep what works.
            </p>
          </div>
          <div className="modui-footer-cta-actions">
            <a
              href="/components"
              className="modui-cta-btn"
              data-magnetic
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/components');
              }}
            >
              <span>Browse components</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="modui-cta-btn-arrow" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="modui-footer-ghost-btn"
              data-magnetic
              onClick={() => trackGithubClick({ location: 'footer' })}
            >
              <span>Star on GitHub</span>
            </a>
          </div>
        </div>
      </div>

      <div className="modui-container modui-footer-inner">
        <div className="modui-footer-brand">
          <span className="modui-footer-logo">ModUI</span>
          <span className="modui-footer-tagline">Modular UI, thoughtfully engineered.</span>
        </div>

        <nav className="modui-footer-nav" aria-label="Footer">
          <div className="modui-footer-col">
            <span className="modui-footer-col-title">Library</span>
            {link('/', 'Overview')}
            {link('/components', 'Components')}
            {link('/docs', 'Documentation')}
          </div>
          <div className="modui-footer-col">
            <span className="modui-footer-col-title">Project</span>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="modui-footer-link"
              onClick={() => trackGithubClick({ location: 'footer' })}
            >
              GitHub
            </a>
            <a href={`${GITHUB_URL}/issues`} target="_blank" rel="noopener noreferrer" className="modui-footer-link">
              Report an issue
            </a>
            <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" className="modui-footer-link">
              MIT licence
            </a>
          </div>
        </nav>
      </div>

      <div
        ref={wordmarkRef}
        className="modui-footer-wordmark"
        onPointerMove={handleWordmarkMove}
        aria-hidden="true"
      >
        <span className="modui-footer-wordmark-base">ModUI</span>
        <span className="modui-footer-wordmark-fill">ModUI</span>
      </div>

      <div className="modui-container modui-footer-sub">
        <span>© {CURRENT_YEAR} ModUI</span>
        <span>Made for developers who sweat the details.</span>
      </div>
    </footer>
  );
};

export default Footer;
