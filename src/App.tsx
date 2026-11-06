import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ExplorerPage from './pages/ExplorerPage';
import ComponentDetailPage from './pages/ComponentDetailPage';
import DocsPage from './pages/DocsPage';
import CommandPaletteModal from './components/common/CommandPaletteModal';
import { Analytics } from '@vercel/analytics/react';
import { updatePageSeo } from './lib/seo';

export function App() {
  // Clean HTML5 Routing state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window === 'undefined') return '/';
    // Backwards compatibility: migrate legacy hash routing to clean path
    const hash = window.location.hash.replace(/^#/, '');
    if (hash && hash.startsWith('/')) {
      return hash;
    }
    return window.location.pathname || '/';
  });

  // Command palette state
  const [isCmdkOpen, setIsCmdkOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scrolling and synchronize top scroll progress line
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.15,
      smoothWheel: true,
      anchors: true,
    });
    lenisRef.current = lenis;

    const updateScrollProgress = (scrollY?: number) => {
      const currentY = typeof scrollY === 'number' ? scrollY : window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const progress = (currentY / totalScroll) * 100;
      const bar = document.getElementById('modui-scroll-progress-line');
      if (bar) {
        bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      }
    };

    const handleLenisScroll = (e: { scroll: number }) => {
      updateScrollProgress(e.scroll);
    };

    const handleWindowScroll = () => {
      updateScrollProgress(window.scrollY);
    };

    lenis.on('scroll', handleLenisScroll);
    window.addEventListener('scroll', handleWindowScroll, { passive: true });

    return () => {
      lenis.off('scroll', handleLenisScroll);
      window.removeEventListener('scroll', handleWindowScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Theme state: 'light' | 'dark' with localStorage & OS system preference sync
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('modui-theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Apply theme to document root and synchronize color-scheme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('modui-theme', theme);
  }, [theme]);

  // Listen to OS system color scheme changes if user has not stored an explicit choice
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      const explicit = localStorage.getItem('modui-theme');
      if (!explicit) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    media.addEventListener('change', handleMediaChange);
    return () => media.removeEventListener('change', handleMediaChange);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.add('theme-transition');
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 280);
  };

  // Migrate legacy hash URLs on mount if present
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash && window.location.hash.startsWith('#/')) {
      const clean = window.location.hash.replace(/^#/, '');
      window.history.replaceState(null, '', clean);
      setCurrentPath(clean);
    }
  }, []);

  // Synchronize route changes (HTML5 popstate)
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      const path = (hash && hash.startsWith('/')) ? hash : (window.location.pathname || '/');
      setCurrentPath(path);
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdkOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Top-level SEO synchronization
  useEffect(() => {
    const cleanPath = currentPath.split('?')[0];

    if (cleanPath === '/' || cleanPath === '') {
      updatePageSeo({
        title: 'ModUI — Crafted React UI Components, Audio DSP & Micro-Interactions',
        description: 'ModUI is a thoughtfully crafted collection of 21+ modular React components, Web Audio DSP, and expressive interactions with zero runtime CSS dependencies.',
        canonicalPath: '/',
        keywords: [
          'react components',
          'ui library',
          'framer motion',
          'audio dsp',
          'micro interactions',
          'accessible react components',
          'tape deck react',
          '3d carousel',
        ],
      });
    } else if (cleanPath === '/components') {
      updatePageSeo({
        title: 'Components Catalog — 21+ Interactive React Primitives | ModUI',
        description: 'Explore all 21 production-ready React components with zero CSS dependencies. Featuring audio players, 3D cylindrical carousels, spring physics accordions, and interactive dials.',
        canonicalPath: '/components',
        keywords: [
          'react component catalog',
          'ui primitives',
          'interactive react components',
          'open source ui',
        ],
      });
    } else if (cleanPath.startsWith('/docs')) {
      updatePageSeo({
        title: 'Documentation & Architecture Guide — ModUI',
        description: 'Architecture principles, copy-paste workflow, design tokens, theming system, and accessibility guidelines for ModUI components.',
        canonicalPath: '/docs',
        keywords: [
          'modui documentation',
          'react component architecture',
          'design tokens',
          'accessibility standards',
        ],
      });
    }
  }, [currentPath]);

  // Clean HTML5 Navigation
  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== path) {
        window.history.pushState(null, '', path);
      }
      if (window.location.hash) {
        window.history.replaceState(null, '', path);
      }
    }
    setCurrentPath(path);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  };

  // Route resolver
  const renderCurrentView = () => {
    const cleanPath = currentPath.split('?')[0];

    if (cleanPath === '/' || cleanPath === '') {
      return <HomePage onNavigate={navigate} theme={theme} />;
    }

    if (cleanPath.startsWith('/components/')) {
      const slug = cleanPath.replace('/components/', '');
      return <ComponentDetailPage slug={slug} onNavigate={navigate} theme={theme} />;
    }

    if (cleanPath === '/components') {
      const urlParams = new URLSearchParams(currentPath.includes('?') ? currentPath.split('?')[1] : '');
      const initialCat = urlParams.get('category') || undefined;
      return <ExplorerPage initialCategory={initialCat} onNavigate={navigate} theme={theme} />;
    }

    if (cleanPath === '/docs' || cleanPath.startsWith('/docs') || ['introduction', 'philosophy', 'tokens', 'accessibility', 'workflow', 'contributing'].includes(cleanPath)) {
      return <DocsPage onNavigate={navigate} theme={theme} />;
    }

    // Default fallback
    return <HomePage onNavigate={navigate} theme={theme} />;
  };

  return (
    <div className="modui-app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Hairline Scroll Progress Bar (Zero text) */}
      <div id="modui-scroll-progress-line" aria-hidden="true" />

      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenCommandPalette={() => setIsCmdkOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main style={{ flex: 1 }}>
        {renderCurrentView()}
      </main>

      <Footer onNavigate={navigate} />

      {/* Global Command Palette */}
      <CommandPaletteModal
        isOpen={isCmdkOpen}
        onClose={() => setIsCmdkOpen(false)}
        onNavigate={navigate}
      />

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}

export default App;
