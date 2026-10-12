import React from 'react';
import './Footer.css';
import { trackGithubClick } from '../../lib/analytics';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="nomu-footer">
      <div className="modui-container nomu-footer-inner">
        <div className="nomu-footer-brand">
          <div className="nomu-footer-logo-wrap">
            <span className="nomu-footer-logo">ModUI</span>
            <span className="nomu-footer-dot" />
          </div>
          <span className="nomu-footer-tagline">
            Modular UI, thoughtfully built.
          </span>
        </div>

        <div className="nomu-footer-nav">
          <button className="nomu-footer-link" onClick={() => onNavigate('/')}>
            Overview
          </button>
          <button className="nomu-footer-link" onClick={() => onNavigate('/components')}>
            Components
          </button>
          <button className="nomu-footer-link" onClick={() => onNavigate('/docs')}>
            Docs
          </button>
          <a
            href="https://github.com/ShakilUrRehman21/modui"
            target="_blank"
            rel="noopener noreferrer"
            className="nomu-footer-link"
            onClick={() => trackGithubClick({ location: 'footer' })}
          >
            <span>GitHub</span>
          </a>
        </div>
      </div>

      <div className="modui-container nomu-footer-sub">
        <span>© {new Date().getFullYear()} Modui. Built for modern creative developers.</span>
        <span>Open source. MIT Licensed.</span>
      </div>
    </footer>
  );
};

export default Footer;
