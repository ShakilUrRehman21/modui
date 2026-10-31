import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
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

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.15,
      smoothWheel: true,
      anchors: true,
    });
    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Apply light creative playground theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

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
      return <HomePage onNavigate={navigate} />;
    }

    if (cleanPath.startsWith('/components/')) {
      const slug = cleanPath.replace('/components/', '');
      return <ComponentDetailPage slug={slug} onNavigate={navigate} />;
    }

    if (cleanPath === '/components') {
      const urlParams = new URLSearchParams(currentPath.includes('?') ? currentPath.split('?')[1] : '');
      const initialCat = urlParams.get('category') || undefined;
      return <ExplorerPage initialCategory={initialCat} onNavigate={navigate} />;
    }

    if (cleanPath === '/docs' || cleanPath.startsWith('/docs') || ['introduction', 'philosophy', 'tokens', 'accessibility', 'workflow', 'contributing'].includes(cleanPath)) {
      return <DocsPage onNavigate={navigate} />;
    }

    // Default fallback
    return <HomePage onNavigate={navigate} />;
  };

  return (
    <div className="modui-app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenCommandPalette={() => setIsCmdkOpen(true)}
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
