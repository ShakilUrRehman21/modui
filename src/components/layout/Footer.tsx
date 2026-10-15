import React from 'react';
import './Footer.css';
import { trackGithubClick } from '../../lib/analytics';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="modui-footer">
      <div className="modui-container modui-footer-inner">
        <div className="modui-footer-brand">
          <div className="modui-footer-logo-wrap">
            <span className="modui-footer-logo">ModUI</span>
            <span className="modui-footer-dot" />
          </div>
          <span className="modui-footer-tagline">
            Modular UI, thoughtfully built.
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
            Docs
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
        <span>© {new Date().getFullYear()} Modui. Built for modern creative developers.</span>
        <span>Open source. MIT Licensed.</span>
      </div>
    </footer>
  );
};

export default Footer;
