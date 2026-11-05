import React, { useEffect, useRef } from 'react';
import './Footer.css';
import { trackGithubClick } from '../../lib/analytics';
import { COMPONENT_REGISTRY } from '../../registry/components';

interface FooterProps {
  onNavigate: (path: string) => void;
}

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const ctaCardRef = useRef<HTMLDivElement>(null);
  const footerInnerRef = useRef<HTMLDivElement>(null);

  // Dedicated scroll-triggered entrance for footer CTA card and footer content
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = [ctaCardRef.current, footerInnerRef.current].filter(Boolean) as HTMLElement[];

    if (prefersReducedMotion) {
      targets.forEach((el) => el.classList.add('modui-in-view'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add('modui-in-view');
          } else {
            const rect = entry.boundingClientRect;
            // Reset when scrolled back above so it can animate in again on scroll down
            if (rect.top > window.innerHeight * 0.9) {
              el.classList.remove('modui-in-view');
            }
          }
        });
      },
      {
        rootMargin: '0px 0px -40px 0px',
        threshold: [0, 0.15, 0.5],
      }
    );

    targets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <footer className="modui-footer">
      {/* Closing CTA Callout with Scroll-Triggered Entrance */}
      <div className="modui-container">
        <div ref={ctaCardRef} className="modui-footer-cta-card">
          <div className="modui-footer-cta-content">
            <span className="modui-footer-cta-eyebrow">READY TO DEPLOY</span>
            <h3 className="modui-footer-cta-title">Build interfaces that refuse to be boring.</h3>
            <p className="modui-footer-cta-desc">
              All {COMPONENT_REGISTRY.length} components are open source, MIT licensed, and ready to drop directly into your project.
            </p>
          </div>
          <div className="modui-footer-cta-actions">
            <a
              href="/components"
              className="modui-cta-btn"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/components');
              }}
              style={{ textDecoration: 'none' }}
            >
              <span>Explore All Components</span>
              <span className="modui-btn-arrow">→</span>
            </a>
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

      <div ref={footerInnerRef} className="modui-container modui-footer-inner">
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
          <a
            href="/"
            className="modui-footer-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
          >
            Overview
          </a>
          <a
            href="/components"
            className="modui-footer-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/components');
            }}
          >
            Components
          </a>
          <a
            href="/docs"
            className="modui-footer-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/docs');
            }}
          >
            Documentation
          </a>
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
        <span>© {CURRENT_YEAR} ModUI. Built for contemporary creative developers.</span>
        <span>Open source. MIT Licensed.</span>
      </div>
    </footer>
  );
};

export default Footer;
