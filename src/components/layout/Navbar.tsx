import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { trackGithubClick } from '../../lib/analytics';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenCommandPalette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenCommandPalette,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 840) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const handleSearchClick = () => {
    setMobileMenuOpen(false);
    onOpenCommandPalette();
  };

  return (
    <>
      <header className="nomu-navbar-wrapper">
        <div className="nomu-navbar-pill">
          {/* Brand Logo */}
          <button
            className="nomu-brand-btn"
            onClick={() => handleNavClick('/')}
            aria-label="ModUI Home"
          >
            <span className="nomu-brand-text">ModUI</span>
            <span className="nomu-brand-dot" />
          </button>

          {/* Desktop Center Nav Links */}
          <nav className="nomu-nav-center" aria-label="Main Navigation">
            <button
              className={`nomu-nav-link ${currentPath === '/' ? 'nomu-nav-link--active' : ''}`}
              onClick={() => handleNavClick('/')}
            >
              <span>Overview</span>
            </button>
            <button
              className={`nomu-nav-link ${currentPath.startsWith('/components') ? 'nomu-nav-link--active' : ''}`}
              onClick={() => handleNavClick('/components')}
            >
              <span>Components</span>
            </button>
            <button
              className={`nomu-nav-link ${currentPath === '/docs' ? 'nomu-nav-link--active' : ''}`}
              onClick={() => handleNavClick('/docs')}
            >
              <span>Docs</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="nomu-nav-actions">
            <button
              className="nomu-search-btn"
              onClick={onOpenCommandPalette}
              title="Search (Ctrl + K)"
              aria-label="Search components"
            >
              <span>Search</span>
              <span className="nomu-search-kbd">⌘K</span>
            </button>

            <a
              href="https://github.com/ShakilUrRehman21/modui"
              target="_blank"
              rel="noopener noreferrer"
              className="nomu-github-btn"
              title="GitHub"
              onClick={() => trackGithubClick({ location: 'navbar' })}
            >
              <span>GitHub</span>
            </a>

            <button
              className="nomu-cta-pill"
              onClick={() => handleNavClick('/components')}
            >
              <span>Start building</span>
            </button>

            {/* Mobile Menu Button with Animated Bars */}
            <button
              className="nomu-mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              <span className={`nomu-hamburger-icon ${mobileMenuOpen ? 'open' : ''}`}>
                <span className="nomu-hamburger-bar" />
                <span className="nomu-hamburger-bar" />
              </span>
              <span className="nomu-mobile-trigger-text">{mobileMenuOpen ? 'Close' : 'Menu'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop & Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="nomu-mobile-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="nomu-mobile-drawer" role="dialog" aria-modal="true">
            <div className="nomu-mobile-nav-links">
              <button
                className={`nomu-mobile-link ${currentPath === '/' ? 'nomu-mobile-link--active' : ''}`}
                onClick={() => handleNavClick('/')}
              >
                <span>Overview</span>
              </button>
              <button
                className={`nomu-mobile-link ${currentPath.startsWith('/components') ? 'nomu-mobile-link--active' : ''}`}
                onClick={() => handleNavClick('/components')}
              >
                <span>Components</span>
              </button>
              <button
                className={`nomu-mobile-link ${currentPath === '/docs' ? 'nomu-mobile-link--active' : ''}`}
                onClick={() => handleNavClick('/docs')}
              >
                <span>Documentation</span>
              </button>
              <button
                className="nomu-mobile-link nomu-mobile-search-link"
                onClick={handleSearchClick}
              >
                <span>Search Components (⌘K)</span>
              </button>
              <a
                href="https://github.com/ShakilUrRehman21/modui"
                target="_blank"
                rel="noopener noreferrer"
                className="nomu-mobile-link"
                onClick={() => trackGithubClick({ location: 'drawer' })}
              >
                <span>GitHub Repository ↗</span>
              </a>
            </div>

            <div className="nomu-mobile-drawer-footer">
              <button
                className="nomu-cta-btn"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => handleNavClick('/components')}
              >
                <span>Start building</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
