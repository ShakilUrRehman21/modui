import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { trackGithubClick } from '../../lib/analytics';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenCommandPalette: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenCommandPalette,
  theme = 'light',
  onToggleTheme,
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
          <a
            href="/"
            className="modui-brand-btn"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/');
            }}
            aria-label="ModUI Home"
          >
            <span className="modui-brand-text">ModUI</span>
            <span className="modui-brand-badge">LAB</span>
          </a>

          {/* Desktop Center Nav Links */}
          <nav className="modui-nav-center" aria-label="Main Navigation">
            <a
              href="/"
              className={`modui-nav-link ${currentPath === '/' ? 'modui-nav-link--active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/');
              }}
            >
              <span>Overview</span>
            </a>
            <a
              href="/components"
              className={`modui-nav-link ${currentPath.startsWith('/components') ? 'modui-nav-link--active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/components');
              }}
            >
              <span>Components</span>
            </a>
            <a
              href="/docs"
              className={`modui-nav-link ${currentPath === '/docs' ? 'modui-nav-link--active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/docs');
              }}
            >
              <span>Documentation</span>
            </a>
          </nav>

          {/* Right Actions */}
          <div className="modui-nav-actions">
            <button
              className="modui-search-btn"
              onClick={onOpenCommandPalette}
              title="Search (Ctrl + K)"
              aria-label="Search components"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
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

            {/* Theme Toggle Button */}
            {onToggleTheme && (
              <button
                className="modui-theme-toggle-btn"
                onClick={onToggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="modui-theme-icon modui-theme-icon--sun"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                  </svg>
                ) : (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="modui-theme-icon modui-theme-icon--moon"
                    aria-hidden="true"
                  >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                )}
              </button>
            )}

            <button
              className="modui-cta-pill"
              onClick={() => handleNavClick('/components')}
            >
              <span>Explore Components</span>
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
              <a
                href="/"
                className={`modui-mobile-link ${currentPath === '/' ? 'modui-mobile-link--active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/');
                }}
              >
                <span>Overview</span>
              </a>
              <a
                href="/components"
                className={`modui-mobile-link ${currentPath.startsWith('/components') ? 'modui-mobile-link--active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/components');
                }}
              >
                <span>Components</span>
              </a>
              <a
                href="/docs"
                className={`modui-mobile-link ${currentPath === '/docs' ? 'modui-mobile-link--active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/docs');
                }}
              >
                <span>Documentation</span>
              </a>
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

              {onToggleTheme && (
                <button
                  className="modui-mobile-link modui-mobile-theme-btn"
                  onClick={onToggleTheme}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {theme === 'dark' ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2" />
                        <path d="M12 20v2" />
                        <path d="m4.93 4.93 1.41 1.41" />
                        <path d="m17.66 17.66 1.41 1.41" />
                        <path d="M2 12h2" />
                        <path d="M20 12h2" />
                        <path d="m6.34 17.66-1.41 1.41" />
                        <path d="m19.07 4.93-1.41 1.41" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                      </svg>
                    )}
                    <span>Appearance</span>
                  </span>
                  <span className="modui-mobile-theme-pill">
                    {theme === 'dark' ? 'Dark' : 'Light'}
                  </span>
                </button>
              )}
            </div>

            <div className="modui-mobile-drawer-footer">
              <button
                className="modui-cta-btn"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => handleNavClick('/components')}
              >
                <span>Explore Components</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
