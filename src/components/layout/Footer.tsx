import React from 'react';
import './Footer.css';
import { trackGithubClick } from '../../lib/analytics';
import { COMPONENT_REGISTRY } from '../../registry/components';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="modui-footer">
      {/* Closing CTA Callout */}
      <div className="modui-container">
        <div className="modui-footer-cta-card">
          <div className="modui-footer-cta-content">
            <span className="modui-footer-cta-eyebrow">READY TO DEPLOY</span>
            <h3 className="modui-footer-cta-title">Build interfaces that refuse to be boring.</h3>
            <p className="modui-footer-cta-desc">
              All {COMPONENT_REGISTRY.length} components are open source, MIT licensed, and ready to drop directly into your project.
            </p>
          </div>
          <div className="modui-footer-cta-actions">
            <button
              className="modui-cta-btn"
              onClick={() => onNavigate('/components')}
            >
              <span>Explore All Components</span>
              <span style={{ marginLeft: '0.4rem' }}>→</span>
            </button>
            <a
              href="https://github.com/ShakilUrRehman21/modui"
              target="_blank"
              rel="noopener noreferrer"
              className="modui-secondary-btn"
              onClick={() => trackGithubClick({ location: 'footer' })}
            >
              <span>GitHub ↗</span>
            </a>
          </div>
        </div>
      </div>

      <div className="modui-container modui-footer-inner">
        <div className="modui-footer-brand">
          <div className="modui-footer-logo-wrap">
            <span className="modui-footer-logo">ModUI</span>
            <span className="modui-footer-dot" />
          </div>
          <span className="modui-footer-tagline">
            Modular UI, thoughtfully engineered.
          </span>
        </div>

        <div className="modui-footer-nav">
          <button className="modui-footer-link" onClick={() => onNavigate('/')}>
            Overview
          </button>
          <button className="modui-footer-link" onClick={() => onNavigate('/components')}>
            Components
          </button>
          <button className="modui-footer-link" onClick={() => onNavigate('/docs')}>
            Documentation
          </button>
          <a
            href="https://github.com/ShakilUrRehman21/modui"
            target="_blank"
            rel="noopener noreferrer"
            className="modui-footer-link"
            onClick={() => trackGithubClick({ location: 'footer' })}
          >
            <span>GitHub</span>
          </a>
        </div>
      </div>

      <div className="modui-container modui-footer-sub">
        <span>© {new Date().getFullYear()} ModUI. Built for contemporary creative developers.</span>
        <span>Open source. MIT Licensed.</span>
      </div>
    </footer>
  );
};

export default Footer;
