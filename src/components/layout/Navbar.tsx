import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState<{ x: number; w: number; visible: boolean }>({ x: 0, w: 0, visible: false });

  const activeKey = currentPath === '/' ? '/' : currentPath.startsWith('/components') ? '/components' : currentPath.startsWith('/docs') ? '/docs' : '';

  // Move the sliding indicator under a given link (or back to the active one)
  const moveIndicatorTo = useCallback((el: HTMLElement | null) => {
    const nav = navRef.current;
    if (!nav || !el) {
      setIndicator((prev) => ({ ...prev, visible: false }));
      return;
    }
    const navRect = nav.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setIndicator({ x: r.left - navRect.left, w: r.width, visible: true });
  }, []);

  const resetIndicator = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const active = activeKey ? nav.querySelector<HTMLElement>(`[data-nav-key="${activeKey}"]`) : null;
    moveIndicatorTo(active);
  }, [activeKey, moveIndicatorTo]);

  useLayoutEffect(() => {
    resetIndicator();
  }, [resetIndicator]);

  useEffect(() => {
    // fonts can shift link widths after first paint
    if (document.fonts?.ready) document.fonts.ready.then(resetIndicator).catch(() => {});
    window.addEventListener('resize', resetIndicator);
    return () => window.removeEventListener('resize', resetIndicator);
  }, [resetIndicator]);

  // Condense the bar once the page scrolls
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
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
      <header className={`modui-navbar-wrapper ${isScrolled ? 'is-scrolled' : ''}`}>
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
            <span className="modui-brand-mark" aria-hidden="true">
              <span /><span /><span /><span />
            </span>
            <span className="modui-brand-text">ModUI</span>
            <span className="modui-brand-badge">Lab</span>
          </a>

          {/* Desktop Center Nav Links */}
          <nav
            className="modui-nav-center"
            aria-label="Main Navigation"
            ref={navRef}
            onMouseLeave={resetIndicator}
          >
            <span
              className="modui-nav-indicator"
              aria-hidden="true"
              style={{
                transform: `translateX(${indicator.x}px)`,
                width: `${indicator.w}px`,
                opacity: indicator.visible ? 1 : 0,
              }}
            />
            <a
              href="/"
              data-nav-key="/"
              aria-current={activeKey === '/' ? 'page' : undefined}
              onMouseEnter={(e) => moveIndicatorTo(e.currentTarget)}
              onFocus={(e) => moveIndicatorTo(e.currentTarget)}
              className={`modui-nav-link ${activeKey === '/' ? 'modui-nav-link--active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/');
              }}
            >
              <span>Overview</span>
            </a>
            <a
              href="/components"
              data-nav-key="/components"
              aria-current={activeKey === '/components' ? 'page' : undefined}
              onMouseEnter={(e) => moveIndicatorTo(e.currentTarget)}
              onFocus={(e) => moveIndicatorTo(e.currentTarget)}
              className={`modui-nav-link ${activeKey === '/components' ? 'modui-nav-link--active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/components');
              }}
            >
              <span>Components</span>
            </a>
            <a
              href="/docs"
              data-nav-key="/docs"
              aria-current={activeKey === '/docs' ? 'page' : undefined}
              onMouseEnter={(e) => moveIndicatorTo(e.currentTarget)}
              onFocus={(e) => moveIndicatorTo(e.currentTarget)}
              className={`modui-nav-link ${activeKey === '/docs' ? 'modui-nav-link--active' : ''}`}
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
              data-magnetic="0.2"
              onClick={() => handleNavClick('/components')}
            >
              <span>Browse components</span>
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
                className={`modui-mobile-link ${currentPath.startsWith('/docs') ? 'modui-mobile-link--active' : ''}`}
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
                <span>Search components</span>
                <span className="modui-search-kbd">⌘K</span>
              </button>
              <a
                href="https://github.com/ShakilUrRehman21/modui"
                target="_blank"
                rel="noopener noreferrer"
                className="modui-mobile-link"
                onClick={() => trackGithubClick({ location: 'drawer' })}
              >
                <span>GitHub repository</span>
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
                <span>Browse components</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
