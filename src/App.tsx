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

export function App() {
  // Routing state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || window.location.pathname || '/';
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

  // Apply light theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  // Synchronize route changes
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      setCurrentPath(hash || window.location.pathname || '/');
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
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

  const navigate = (path: string) => {
    window.location.hash = path;
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
