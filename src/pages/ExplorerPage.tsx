import React, { useState, useMemo } from 'react';
import { COMPONENT_REGISTRY, COMPONENT_CATEGORIES } from '../registry/components';
import { AnimatedButton } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { KineticText } from '../components/ui/motion/KineticText';
import { NumberTicker } from '../components/ui/counter';
import { trackPreviewOpen } from '../lib/analytics';
import './ExplorerPage.css';

interface ExplorerPageProps {
  initialCategory?: string;
  onNavigate: (path: string) => void;
}

export const ExplorerPage: React.FC<ExplorerPageProps> = ({
  initialCategory,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');

  const filteredComponents = useMemo(() => {
    return COMPONENT_REGISTRY.filter((comp) => {
      if (selectedCategory !== 'All' && comp.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = comp.name.toLowerCase().includes(q);
        const matchesDesc = comp.description.toLowerCase().includes(q);
        const matchesCat = comp.category.toLowerCase().includes(q);
        const matchesTag = comp.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCat && !matchesTag) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="nomu-explorer-wrap">
      <div className="modui-container">
        {/* Header */}
        <div className="nomu-explorer-header">
          <div className="nomu-eyebrow">MODULE CATALOGUE</div>
          <h1 className="nomu-explorer-title">Explore Components</h1>
          <p className="nomu-explorer-subtitle">
            Browse our curated collection of modular React components.
            Inspect live variations and open dedicated code tabs to copy TSX, CSS, and usage examples.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="nomu-explorer-toolbar">
          <div className="nomu-explorer-search">
            <input
              type="text"
              className="nomu-search-input-field"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="nomu-clear-search-btn"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>

          <div className="nomu-explorer-pills">
            <button
              className={`nomu-category-pill ${selectedCategory === 'All' ? 'nomu-category-pill--active' : ''}`}
              onClick={() => setSelectedCategory('All')}
            >
              All ({COMPONENT_REGISTRY.length})
            </button>
            {COMPONENT_CATEGORIES.map((cat) => {
              const count = COMPONENT_REGISTRY.filter((c) => c.category === cat).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat}
                  className={`nomu-category-pill ${selectedCategory === cat ? 'nomu-category-pill--active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual Component Cards Grid (No Boring Table) */}
        {filteredComponents.length > 0 ? (
          <div className="nomu-featured-grid" style={{ marginTop: '2.5rem', marginBottom: '6rem' }}>
            {filteredComponents.map((comp) => (
              <div
                key={comp.id}
                className="nomu-featured-card"
                onClick={() => {
                  trackPreviewOpen({ component: comp.slug, mode: 'card_preview' });
                  onNavigate(`/components/${comp.slug}`);
                }}
              >
                <div className="nomu-card-meta-top">
                  <span className="nomu-card-cat-badge">{comp.category}</span>
                </div>

                <h3 className="nomu-card-title">{comp.name}</h3>
                <p className="nomu-card-description">{comp.description}</p>

                {/* Live component preview inside each card */}
                <div className="nomu-card-preview-stage" onClick={(e) => e.stopPropagation()}>
                  {comp.slug === 'animated-button' && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <AnimatedButton variant="shimmer" size="sm">
                        Shimmer
                      </AnimatedButton>
                      <AnimatedButton variant="glow" size="sm">
                        Glow
                      </AnimatedButton>
                    </div>
                  )}

                  {comp.slug === 'badge' && (
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                      <Badge variant="accent" dot pulse>
                        Live Pulse
                      </Badge>
                      <Badge variant="success" dot>
                        Online
                      </Badge>
                      <Badge variant="cyan">React 19</Badge>
                    </div>
                  )}

                  {comp.slug === 'kinetic-text' && (
                    <div style={{ textAlign: 'center', padding: '0.4rem 0' }}>
                      <KineticText text="Hover over each letter" interactiveWave={true} />
                    </div>
                  )}

                  {comp.slug === 'number-ticker' && (
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      <NumberTicker value={1240} prefix="$" suffix="k" />
                    </div>
                  )}
                </div>

                <div className="nomu-card-action-bar">
                  <span className="nomu-card-cta-link">
                    <span>Inspect & View Code Tabs</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="nomu-empty-state">
            <p>No components found matching "{searchQuery}".</p>
            <button
              className="nomu-category-pill nomu-category-pill--active"
              style={{ marginTop: '1rem' }}
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorerPage;
