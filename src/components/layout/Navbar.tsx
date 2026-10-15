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
      <header className="modui-navbar-wrapper">
        <div className="modui-navbar-pill">
          {/* Brand Logo */}
          <button
            className="modui-brand-btn"
            onClick={() => handleNavClick('/')}
            aria-label="ModUI Home"
          >
            <span className="modui-brand-text">ModUI</span>
            <span className="modui-brand-dot" />
          </button>

          {/* Desktop Center Nav Links */}
          <nav className="modui-nav-center" aria-label="Main Navigation">
            <button
              className={`modui-nav-link ${currentPath === '/' ? 'modui-nav-link--active' : ''}`}
              onClick={() => handleNavClick('/')}
            >
              <span>Overview</span>
            </button>
            <button
              className={`modui-nav-link ${currentPath.startsWith('/components') ? 'modui-nav-link--active' : ''}`}
              onClick={() => handleNavClick('/components')}
            >
              <span>Components</span>
            </button>
            <button
              className={`modui-nav-link ${currentPath === '/docs' ? 'modui-nav-link--active' : ''}`}
              onClick={() => handleNavClick('/docs')}
            >
              <span>Docs</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="modui-nav-actions">
            <button
              className="modui-search-btn"
              onClick={onOpenCommandPalette}
              title="Search (Ctrl + K)"
              aria-label="Search components"
            >
              <span>Search</span>
              <span className="modui-search-kbd">⌘K</span>
            </button>

            <a
              href="https://github.com/ShakilUrRehman21/modui"
              target="_blank"
              rel="noopener noreferrer"
              className="modui-github-btn"
              title="GitHub"
              onClick={() => trackGithubClick({ location: 'navbar' })}
            >
              <span>GitHub</span>
            </a>

            <button
              className="modui-cta-pill"
              onClick={() => handleNavClick('/components')}
            >
              <span>Start building</span>
            </button>

            {/* Mobile Menu Button with Animated Bars */}
            <button
              className="modui-mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              <span className={`modui-hamburger-icon ${mobileMenuOpen ? 'open' : ''}`}>
                <span className="modui-hamburger-bar" />
                <span className="modui-hamburger-bar" />
              </span>
              <span className="modui-mobile-trigger-text">{mobileMenuOpen ? 'Close' : 'Menu'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop & Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="modui-mobile-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="modui-mobile-drawer" role="dialog" aria-modal="true">
            <div className="modui-mobile-nav-links">
              <button
                className={`modui-mobile-link ${currentPath === '/' ? 'modui-mobile-link--active' : ''}`}
                onClick={() => handleNavClick('/')}
              >
                <span>Overview</span>
              </button>
              <button
                className={`modui-mobile-link ${currentPath.startsWith('/components') ? 'modui-mobile-link--active' : ''}`}
                onClick={() => handleNavClick('/components')}
              >
                <span>Components</span>
              </button>
              <button
                className={`modui-mobile-link ${currentPath === '/docs' ? 'modui-mobile-link--active' : ''}`}
                onClick={() => handleNavClick('/docs')}
              >
                <span>Documentation</span>
              </button>
              <button
                className="modui-mobile-link modui-mobile-search-link"
                onClick={handleSearchClick}
              >
                <span>Search Components (⌘K)</span>
              </button>
              <a
                href="https://github.com/ShakilUrRehman21/modui"
                target="_blank"
                rel="noopener noreferrer"
                className="modui-mobile-link"
                onClick={() => trackGithubClick({ location: 'drawer' })}
              >
                <span>GitHub Repository ↗</span>
              </a>
            </div>

            <div className="modui-mobile-drawer-footer">
              <button
                className="modui-cta-btn"
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
