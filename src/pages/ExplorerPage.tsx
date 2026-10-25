import React, { useState, useMemo } from 'react';
import { COMPONENT_REGISTRY, COMPONENT_CATEGORIES } from '../registry/components';
import { AnimatedButton } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { KineticText } from '../components/ui/motion/KineticText';
import { NumberTicker } from '../components/ui/counter';
import { CylindricalCarousel } from '../components/ui/carousel';
import { FloatingDock } from '../components/ui/dock';
import { RadialOrbitHub } from '../components/ui/radial-hub';
import { FluidElasticAccordion } from '../components/ui/accordion';
import { BeforeAfterSlider } from '../components/ui/slider';
import { RotaryJogWheel } from '../components/ui/rotary';
import { CyberStreamMatrix } from '../components/ui/matrix';
import { CausticRippleSurface } from '../components/ui/caustic-surface';
import { NeuralClothMesh } from '../components/ui/cloth';
import { ApertureIrisLens } from '../components/ui/aperture';
import { ChromaticPrismCard } from '../components/ui/prism';
import { FilmstripGallery } from '../components/ui/filmstrip';
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
    <div className="modui-explorer-wrap">
      <div className="modui-container">
        {/* Header */}
        <div className="modui-explorer-header">
          <div className="modui-eyebrow">MODULE CATALOGUE</div>
          <h1 className="modui-explorer-title">Explore Components</h1>
          <p className="modui-explorer-subtitle">
            Browse our curated collection of modular React components.
            Inspect live variations and open dedicated code tabs to copy TSX, CSS, and usage examples.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="modui-explorer-toolbar">
          <div className="modui-explorer-search">
            <input
              type="text"
              className="modui-search-input-field"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="modui-clear-search-btn"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>

          <div className="modui-explorer-pills">
            <button
              className={`modui-category-pill ${selectedCategory === 'All' ? 'modui-category-pill--active' : ''}`}
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
                  className={`modui-category-pill ${selectedCategory === cat ? 'modui-category-pill--active' : ''}`}
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
          <div className="modui-featured-grid" style={{ marginTop: '2.5rem', marginBottom: '6rem' }}>
            {filteredComponents.map((comp) => (
              <div
                key={comp.id}
                className="modui-featured-card"
                onClick={() => {
                  trackPreviewOpen({ component: comp.slug, mode: 'card_preview' });
                  onNavigate(`/components/${comp.slug}`);
                }}
              >
                {/* 1. Hero Live Component Preview Canvas */}
                <div className="modui-card-preview-stage" onClick={(e) => e.stopPropagation()}>
                  <div className="modui-card-stage-meta">
                    <span className="modui-card-cat-badge">{comp.category}</span>
                    <span className="modui-card-ver-tag">v{comp.version}</span>
                  </div>

                  {comp.slug === 'animated-button' && (
                    <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                      <AnimatedButton variant="shimmer" size="sm">
                        Shimmer
                      </AnimatedButton>
                      <AnimatedButton variant="glow" size="sm">
                        Glow
                      </AnimatedButton>
                      <AnimatedButton variant="slide" size="sm">
                        Slide
                      </AnimatedButton>
                    </div>
                  )}

                  {comp.slug === 'badge' && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', maxWidth: '240px' }}>
                      <Badge variant="accent" dot pulse>
                        Live Pulse
                      </Badge>
                      <Badge variant="success" dot>
                        Operational
                      </Badge>
                      <Badge variant="cyan">
                        v2.4
                      </Badge>
                      <Badge variant="warning" dot>
                        Syncing
                      </Badge>
                    </div>
                  )}

                  {comp.slug === 'kinetic-text' && (
                    <div style={{ textAlign: 'center', padding: '0.5rem', color: 'var(--text-primary)', pointerEvents: 'auto', fontSize: '1.25rem', fontWeight: 700 }}>
                      <KineticText text="Interactive Wave" interactiveWave={true} />
                    </div>
                  )}

                  {comp.slug === 'number-ticker' && (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                        <NumberTicker value={1420} prefix="$" suffix="/mo" />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', background: 'rgba(16, 185, 129, 0.12)', padding: '0.15rem 0.45rem', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                        +24.8%
                      </span>
                    </div>
                  )}

                  {comp.slug === 'cylindrical-carousel' && (
                    <div style={{ width: '100%', height: '160px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CylindricalCarousel
                        items={[
                          { id: '1', title: 'Spatial Studio', tag: 'Core', color: '#365CF5', badge: 'v2.1' },
                          { id: '2', title: 'Neural Canvas', tag: 'WebGL', color: '#FF735E', badge: 'New' },
                          { id: '3', title: 'Haptic Rotary', tag: 'Dial', color: '#10B981' },
                          { id: '4', title: 'Vector Scope', tag: 'Audio', color: '#F1E99B' },
                        ]}
                        radius={110}
                        cardWidth={115}
                        cardHeight={135}
                        perspective={380}
                        tiltAngle={-4}
                        showControls={false}
                        showIndicators={false}
                        showDragHint={false}
                        autoplay={true}
                        autoplaySpeed={15}
                        style={{ minHeight: '160px', height: '160px' }}
                      />
                    </div>
                  )}

                  {comp.slug === 'floating-dock' && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                      <FloatingDock
                        items={[
                          {
                            id: '1',
                            label: 'Home',
                            icon: (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                              </svg>
                            ),
                          },
                          {
                            id: '2',
                            label: 'Explore',
                            icon: (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                              </svg>
                            ),
                          },
                          {
                            id: '3',
                            label: 'Docs',
                            icon: (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                                <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                              </svg>
                            ),
                          },
                          {
                            id: '4',
                            label: 'Terminal',
                            badge: '3',
                            badgeVariant: 'count',
                            icon: (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="4 17 10 11 4 5" />
                                <line x1="12" x2="20" y1="19" y2="19" />
                              </svg>
                            ),
                          },
                          {
                            id: '5',
                            label: 'Settings',
                            icon: (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                              </svg>
                            ),
                          },
                        ]}
                        baseSize={36}
                        variant="solid"
                      />
                    </div>
                  )}

                  {comp.slug === 'radial-orbit-hub' && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                      <RadialOrbitHub
                        items={[
                          {
                            id: 'search',
                            label: 'Search',
                            icon: (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                              </svg>
                            ),
                          },
                          {
                            id: 'ai',
                            label: 'AI Core',
                            badge: 'AI',
                            icon: (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
                              </svg>
                            ),
                          },
                          {
                            id: 'layers',
                            label: 'Layers',
                            icon: (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                                <polyline points="2 17 12 22 22 17" />
                                <polyline points="2 12 12 17 22 12" />
                              </svg>
                            ),
                          },
                          {
                            id: 'terminal',
                            label: 'Terminal',
                            icon: (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="4 17 10 11 4 5" />
                                <line x1="12" x2="20" y1="19" y2="19" />
                              </svg>
                            ),
                          },
                        ]}
                        radius={48}
                        defaultOpen={false}
                        variant="glass"
                        showLabels={false}
                        soundEnabled={false}
                      />
                    </div>
                  )}

                  {comp.slug === 'fluid-elastic-accordion' && (
                    <div style={{ width: '100%', height: '160px', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 0.5rem' }}>
                      <FluidElasticAccordion
                        items={[
                          { id: '1', number: '01', title: 'Spatial', subtitle: 'WebGL 3D', color: '#365CF5', tag: 'Core' },
                          { id: '2', number: '02', title: 'Rotary', subtitle: 'Dial Wheel', color: '#FF735E', tag: 'Audio' },
                          { id: '3', number: '03', title: 'Neural', subtitle: 'Spring Mesh', color: '#10B981', tag: 'Physics' },
                        ]}
                        defaultActiveId="1"
                        orientation="horizontal"
                        variant="light"
                        trigger="hover"
                        soundEnabled={false}
                        expandedRatio={2.5}
                        style={{ height: '145px', minHeight: '145px', width: '100%', borderRadius: '6px' }}
                      />
                    </div>
                  )}

                  {comp.slug === 'before-after-slider' && (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.75rem' }}>
                      <BeforeAfterSlider
                        aspectRatio="16 / 10"
                        variant="light"
                        mode="drag"
                        soundEnabled={false}
                        initialPosition={50}
                        showLabels={true}
                        style={{ width: '100%', maxHeight: '155px', borderRadius: '6px' }}
                      />
                    </div>
                  )}

                  {comp.slug === 'rotary-jog-wheel' && (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <RotaryJogWheel
                        size="sm"
                        defaultValue={48}
                        min={0}
                        max={100}
                        variant="metallic"
                        mode="bounded"
                        soundEnabled={false}
                        sublabel="VOL"
                      />
                    </div>
                  )}

                  {comp.slug === 'cyber-stream-matrix' && (
                    <div style={{ width: '100%', height: '160px', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                      <CyberStreamMatrix
                        variant="studio-light"
                        charset="hex"
                        speed={0.5}
                        density={1}
                        glow={true}
                        soundEnabled={false}
                        style={{ width: '100%', height: '100%' }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            padding: '0.35rem 0.75rem',
                            background: 'rgba(255,255,255,0.88)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(0,0,0,0.08)',
                            borderRadius: '999px',
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            color: '#1a1a1a',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                            pointerEvents: 'none',
                          }}
                        >
                          CANVAS // STREAM
                        </div>
                      </CyberStreamMatrix>
                    </div>
                  )}

                  {comp.slug === 'caustic-ripple-surface' && (
                    <div style={{ width: '100%', height: '160px', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                      <CausticRippleSurface
                        variant="porcelain"
                        compact={true}
                        damping={0.97}
                        refractionStrength={2.0}
                        dropletRadius={3}
                        rainEnabled={true}
                        rainInterval={2800}
                        soundEnabled={false}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  )}

                  {comp.slug === 'neural-cloth-mesh' && (
                    <div style={{ width: '100%', height: '160px', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                      <NeuralClothMesh
                        variant="studio-silk"
                        renderMode="wireframe"
                        pinMode="curtain"
                        gravity={0.10}
                        windStrength={0}
                        compact={true}
                        soundEnabled={false}
                        style={{ width: '100%', height: '100%', minHeight: '160px' }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            padding: '0.35rem 0.75rem',
                            background: 'rgba(255,255,255,0.92)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(0,0,0,0.08)',
                            borderRadius: '999px',
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            color: '#1a1a1a',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                            pointerEvents: 'none',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          VERLET // WIREFRAME
                        </div>
                      </NeuralClothMesh>
                    </div>
                  )}

                  {comp.slug === 'aperture-iris-lens' && (
                    <div style={{ width: '100%', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <ApertureIrisLens
                        variant="studio-silver"
                        bladesCount={9}
                        defaultValue={0.55}
                        compact={true}
                        showFStops={false}
                        soundEnabled={false}
                        style={{ transform: 'scale(0.48)', transformOrigin: 'center center' }}
                      />
                    </div>
                  )}

                  {comp.slug === 'chromatic-prism-card' && (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem' }}>
                      <ChromaticPrismCard
                        variant="sapphire-crystal"
                        category="QUARTZ // 01"
                        serialNumber="SPECIMEN 01"
                        compact={true}
                        soundEnabled={false}
                        maxTilt={10}
                      />
                    </div>
                  )}

                  {comp.slug === 'filmstrip-gallery' && (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FilmstripGallery
                        variant="studio-light"
                        compact={true}
                        soundEnabled={false}
                      />
                    </div>
                  )}
                </div>

                {/* 2. Structured Card Information */}
                <div className="modui-card-content">
                  <h3 className="modui-card-title">{comp.name}</h3>
                  <p className="modui-card-description">{comp.description}</p>

                  <div className="modui-card-action-bar">
                    <div className="modui-card-tags-mini">
                      {comp.tags?.slice(0, 2).map((t) => (
                        <span key={t} className="modui-card-tag-pill">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <span className="modui-card-cta-link">
                      <span>Inspect</span>
                      <svg className="modui-card-arrow-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="modui-empty-state">
            <p>No components found matching "{searchQuery}".</p>
            <button
              className="modui-category-pill modui-category-pill--active"
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
