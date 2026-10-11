import React, { useState, useEffect, useRef, useMemo } from 'react';
import { COMPONENT_REGISTRY } from '../../registry/components';
import './CommandPaletteModal.css';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Components' | 'Navigation' | 'Docs'>('All');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
      setQuery('');
      setActiveCategory('All');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const staticNavigation = useMemo(() => [
    { title: 'Overview', path: '/', category: 'Navigation' },
    { title: 'Component Catalogue', path: '/components', category: 'Navigation' },
    { title: 'Documentation & Guides', path: '/docs', category: 'Docs' },
  ], []);

  // Filtered list combining navigation and components
  const allResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    const navMatches = staticNavigation.filter((item) => {
      if (activeCategory !== 'All' && item.category !== activeCategory) return false;
      if (!q) return true;
      return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    }).map((item) => ({
      id: item.path,
      title: item.title,
      description: 'System page',
      path: item.path,
      category: item.category,
      isComponent: false,
    }));

    const compMatches = COMPONENT_REGISTRY.filter((item) => {
      if (activeCategory === 'Navigation' || activeCategory === 'Docs') return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }).map((item) => ({
      id: item.slug,
      title: item.name,
      description: item.description,
      path: `/components/${item.slug}`,
      category: item.category,
      isComponent: true,
    }));

    return [...navMatches, ...compMatches];
  }, [query, activeCategory, staticNavigation]);

  // Keyboard navigation listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (allResults.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (allResults.length || 1)) % (allResults.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (allResults[selectedIndex]) {
          onNavigate(allResults[selectedIndex].path);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, allResults, selectedIndex, onNavigate, onClose]);

  // Keep selected index in view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('.modui-cmdk-item--active');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const handleSelect = (path: string) => {
    onNavigate(path);
    onClose();
  };

  return (
    <div className="modui-cmdk-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modui-cmdk-box" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Bar - Clean without icons */}
        <div className="modui-cmdk-header">
          <input
            ref={inputRef}
            type="text"
            className="modui-cmdk-input"
            placeholder="Search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          {query && (
            <button
              className="modui-cmdk-clear-btn"
              onClick={() => setQuery('')}
              aria-label="Clear query"
            >
              Clear
            </button>
          )}
          <span className="modui-cmdk-esc-tag">ESC</span>
        </div>

        {/* Results List - Clean minimal typography */}
        <div ref={listRef} className="modui-cmdk-results">
          {allResults.length > 0 ? (
            <div className="modui-cmdk-list-wrap">
              {allResults.map((item, idx) => {
                const isActive = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    className={`modui-cmdk-item ${isActive ? 'modui-cmdk-item--active' : ''}`}
                    onClick={() => handleSelect(item.path)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className="modui-cmdk-item-left">
                      <span className="modui-cmdk-item-title">{item.title}</span>
                    </div>

                    <div className="modui-cmdk-item-right">
                      <span className="modui-cmdk-cat-badge">{item.category}</span>
                      {isActive && (
                        <span className="modui-cmdk-select-pill">↵</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="modui-cmdk-empty">
              <p>No results</p>
            </div>
          )}
        </div>

        {/* Minimal Footer */}
        <div className="modui-cmdk-footer">
          <span className="modui-cmdk-esc-hint">esc to close</span>
          <span className="modui-cmdk-count-info">{allResults.length} results</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPaletteModal;
