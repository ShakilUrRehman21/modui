import React, { useState, useEffect } from 'react';
import './Navbar.css';

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

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
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

          {/* Center Nav Links - Clean without dropdown chevrons */}
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
            >
              <span>GitHub</span>
            </a>

            <button
              className="nomu-cta-pill"
              onClick={() => handleNavClick('/components')}
            >
              <span>Start building</span>
            </button>

            <button
              className="nomu-mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="nomu-mobile-drawer">
          <button className="nomu-mobile-link" onClick={() => handleNavClick('/')}>
            Overview
          </button>
          <button className="nomu-mobile-link" onClick={() => handleNavClick('/components')}>
            Components
          </button>
          <button className="nomu-mobile-link" onClick={() => handleNavClick('/docs')}>
            Docs
          </button>
          <div className="nomu-mobile-drawer-footer">
            <button
              className="nomu-cta-btn"
              style={{ width: '100%' }}
              onClick={() => handleNavClick('/components')}
            >
              <span>Start building</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
