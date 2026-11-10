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
import { CardStack } from '../components/ui/card-stack';
import { TimelineRoadmap } from '../components/ui/timeline';
import { NeuralGraph } from '../components/ui/neural-graph';
import { ReelTapeDeck } from '../components/ui/tape-deck';
import { StoryTimeline } from '../components/ui/story-timeline';
import { Polaroid } from '../components/ui/polaroid';
import { MagneticProjectList } from '../components/ui/magnetic-project-list';
import { InfiniteCanvasGallery } from '../components/ui/infinite-canvas-gallery';
import { SpatialGallery } from '../components/ui/spatial-gallery';
import { PageTurnBook } from '../components/ui/page-turn';
import { PointCloudMorpher } from '../components/ui/point-cloud';
import { PerspectiveTextRibbon } from '../components/ui/perspective-text';
import { QuantumOrbitBeacon } from '../components/ui/quantum-orbit-beacon';
import { trackPreviewOpen } from '../lib/analytics';
import './ExplorerPage.css';

interface ExplorerPageProps {
  initialCategory?: string;
  onNavigate: (path: string) => void;
  theme?: 'light' | 'dark';
}

export const ExplorerPage: React.FC<ExplorerPageProps> = ({
  initialCategory,
  onNavigate,
  theme,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');

  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -4;
    const rotY = ((x - cx) / cx) * 4;
    card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(2px)`;
    const glare = card.querySelector('.modui-card-glare') as HTMLElement;
    if (glare) {
      glare.style.opacity = '1';
      glare.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 65%)`;
    }
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    const glare = card.querySelector('.modui-card-glare') as HTMLElement;
    if (glare) {
      glare.style.opacity = '0';
    }
  };

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
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                onClick={() => {
                  trackPreviewOpen({ component: comp.slug, mode: 'card_preview' });
                  onNavigate(`/components/${comp.slug}`);
                }}
              >
                <div className="modui-card-glare" aria-hidden="true" />

                {/* 1. Hero Live Component Preview Canvas */}
                <div className="modui-card-preview-stage">
                  {comp.slug === 'animated-button' && (
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', gap: '0.65rem', justifyContent: 'center', alignItems: 'center' }}>
                      <Badge variant="accent" dot pulse>
                        Live Pulse
                      </Badge>
                      <Badge variant="success" dot>
                        Operational
                      </Badge>
                      <Badge variant="cyan">
                        v2.4 Ready
                      </Badge>
                      <Badge variant="warning" dot>
                        Syncing
                      </Badge>
                    </div>
                  )}

                  {comp.slug === 'kinetic-text' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center', width: '100%', pointerEvents: 'auto' }}>
                      <div style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
                        <KineticText text="Interactive Wave" interactiveWave={true} />
                      </div>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', background: 'rgba(54, 92, 245, 0.08)', padding: '0.2rem 0.6rem', border: '1px solid rgba(54, 92, 245, 0.18)', borderRadius: '999px' }}>
                        HOVER OVER CHARACTERS
                      </span>
                    </div>
                  )}

                  {comp.slug === 'number-ticker' && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.45rem',
                      background: isDark ? '#14151C' : '#FFFFFF',
                      padding: '0.85rem 1.4rem',
                      borderRadius: '12px',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid var(--border-default)',
                      boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.4)' : 'var(--shadow-sm)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem' }}>
                        <div style={{ fontSize: '2.1rem', fontWeight: 800, color: isDark ? '#F4F4F6' : 'var(--text-primary)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.03em' }}>
                          <NumberTicker value={1420} prefix="$" suffix="/mo" />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', background: 'rgba(16, 185, 129, 0.12)', padding: '0.15rem 0.5rem', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                          +24.8%
                        </span>
                      </div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 600, color: isDark ? '#9DA3AE' : 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
                        REVENUE METRIC // 60 FPS
                      </span>
                    </div>
                  )}

                  {comp.slug === 'cylindrical-carousel' && (
                    <div style={{ width: '280px', height: '170px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CylindricalCarousel
                        items={[
                          { id: '1', title: 'Spatial Studio', tag: 'Core', color: '#365CF5', badge: 'v2.1' },
                          { id: '2', title: 'Neural Canvas', tag: 'WebGL', color: '#FF735E', badge: 'New' },
                          { id: '3', title: 'Haptic Rotary', tag: 'Dial', color: '#10B981' },
                          { id: '4', title: 'Vector Scope', tag: 'Audio', color: '#F1E99B' },
                        ]}
                        radius={110}
                        cardWidth={110}
                        cardHeight={130}
                        perspective={420}
                        tiltAngle={-4}
                        showControls={false}
                        showIndicators={false}
                        showDragHint={false}
                        autoplay={true}
                        autoplaySpeed={12}
                        style={{ minHeight: '170px', height: '170px' }}
                      />
                    </div>
                  )}

                  {comp.slug === 'floating-dock' && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
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
                        variant={isDark ? 'dark' : 'solid'}
                      />
                    </div>
                  )}

                  {comp.slug === 'radial-orbit-hub' && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '160px', height: '160px', flexShrink: 0 }}>
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
                        radius={52}
                        defaultOpen={true}
                        variant={isDark ? 'dark' : 'glass'}
                        showLabels={false}
                        soundEnabled={false}
                      />
                    </div>
                  )}

                  {comp.slug === 'fluid-elastic-accordion' && (
                    <div style={{ width: '100%', maxWidth: '300px', height: '155px', overflow: 'hidden', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      <FluidElasticAccordion
                        items={[
                          { id: '1', number: '01', title: 'Spatial', subtitle: 'WebGL 3D', color: '#365CF5', tag: 'Core' },
                          { id: '2', number: '02', title: 'Rotary', subtitle: 'Dial Wheel', color: '#FF735E', tag: 'Audio' },
                          { id: '3', number: '03', title: 'Neural', subtitle: 'Spring Mesh', color: '#10B981', tag: 'Physics' },
                        ]}
                        defaultActiveId="1"
                        orientation="horizontal"
                        variant={isDark ? 'dark' : 'light'}
                        trigger="hover"
                        soundEnabled={false}
                        expandedRatio={2.2}
                        style={{ height: '145px', minHeight: '145px', width: '100%', borderRadius: '8px' }}
                      />
                    </div>
                  )}

                  {comp.slug === 'before-after-slider' && (
                    <div style={{ width: '100%', maxWidth: '280px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <BeforeAfterSlider
                        aspectRatio="16 / 10"
                        variant={isDark ? 'dark' : 'light'}
                        mode="drag"
                        soundEnabled={false}
                        initialPosition={50}
                        showLabels={true}
                        style={{ width: '100%', maxHeight: '160px', borderRadius: '8px', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)' }}
                      />
                    </div>
                  )}

                  {comp.slug === 'rotary-jog-wheel' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '160px', height: '160px', flexShrink: 0 }}>
                      <RotaryJogWheel
                        size="md"
                        defaultValue={58}
                        min={0}
                        max={100}
                        variant={isDark ? 'dark' : 'metallic'}
                        mode="bounded"
                        soundEnabled={false}
                        sublabel="VOL"
                      />
                    </div>
                  )}

                  {comp.slug === 'cyber-stream-matrix' && (
                    <div style={{ width: '100%', maxWidth: '290px', height: '175px', borderRadius: '8px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                      <CyberStreamMatrix
                        variant={isDark ? 'dark-obsidian' : 'studio-light'}
                        charset="hex"
                        speed={0.6}
                        density={1}
                        glow={true}
                        soundEnabled={false}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  )}

                  {comp.slug === 'caustic-ripple-surface' && (
                    <div style={{ width: '100%', maxWidth: '290px', height: '175px', borderRadius: '8px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                      <CausticRippleSurface
                        variant={isDark ? 'dark-obsidian' : 'porcelain'}
                        compact={true}
                        damping={0.97}
                        refractionStrength={2.2}
                        dropletRadius={3}
                        rainEnabled={true}
                        rainInterval={2400}
                        soundEnabled={false}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  )}

                  {comp.slug === 'neural-cloth-mesh' && (
                    <div style={{ width: '100%', maxWidth: '280px', height: '175px', borderRadius: '8px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                      <NeuralClothMesh
                        variant={isDark ? 'dark-obsidian' : 'studio-silk'}
                        renderMode="wireframe"
                        pinMode="curtain"
                        gravity={0.12}
                        windStrength={0.02}
                        compact={true}
                        soundEnabled={false}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  )}

                  {comp.slug === 'aperture-iris-lens' && (
                    <div style={{ width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                      <ApertureIrisLens
                        variant={isDark ? 'matte-obsidian' : 'studio-silver'}
                        bladesCount={9}
                        defaultValue={0.52}
                        compact={true}
                        showFStops={false}
                        soundEnabled={false}
                        style={{ transform: 'scale(0.55)', transformOrigin: 'center center' }}
                      />
                    </div>
                  )}

                  {comp.slug === 'chromatic-prism-card' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ChromaticPrismCard
                        variant={isDark ? 'obsidian-prism' : 'sapphire-crystal'}
                        category="QUARTZ // 01"
                        serialNumber="SPECIMEN 01"
                        compact={true}
                        soundEnabled={false}
                        maxTilt={10}
                      />
                    </div>
                  )}

                  {comp.slug === 'filmstrip-gallery' && (
                    <div style={{ width: '100%', maxWidth: '300px', height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FilmstripGallery
                        variant={isDark ? 'cinema-dark' : 'studio-light'}
                        compact={true}
                        soundEnabled={false}
                      />
                    </div>
                  )}

                  {comp.slug === 'card-stack' && (
                    <div style={{ width: '100%', maxWidth: '280px', height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CardStack
                        variant={isDark ? 'cinema-dark' : 'studio-light'}
                        compact={true}
                        soundEnabled={false}
                      />
                    </div>
                  )}

                  {comp.slug === 'timeline-roadmap' && (
                    <div style={{ width: '100%', maxWidth: '300px', height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                      <div style={{ width: '310px', transform: 'scale(0.88)', transformOrigin: 'center center' }}>
                        <TimelineRoadmap
                          variant={isDark ? 'cinema-dark' : 'studio-light'}
                          compact={true}
                          soundEnabled={false}
                        />
                      </div>
                    </div>
                  )}

                  {comp.slug === 'reel-tape-deck' && (
                    <div style={{ width: '100%', maxWidth: '310px', height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ReelTapeDeck
                        variant={isDark ? 'dark-slate' : 'studio-light'}
                        compact={true}
                        soundEnabled={false}
                        autoPlay={true}
                        style={{ width: '100%' }}
                      />
                    </div>
                  )}

                  {comp.slug === 'story-timeline' && (
                    <div style={{ width: '100%', maxWidth: '280px', height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <StoryTimeline
                        variant={isDark ? 'instagram-dark' : 'editorial-paper'}
                        compact={true}
                        soundEnabled={false}
                        autoPlay={true}
                      />
                    </div>
                  )}

                  {comp.slug === 'polaroid' && (
                    <div style={{ width: '100%', maxWidth: '280px', height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Polaroid
                        compact={true}
                        soundEnabled={false}
                        variant={isDark ? 'dark-room' : 'studio-classic'}
                      />
                    </div>
                  )}

                  {comp.slug === 'spatial-gallery' && (
                    <div style={{ width: '100%', maxWidth: '290px', height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <SpatialGallery
                        compact={true}
                        soundEnabled={false}
                        variant={isDark ? 'studio-dark' : 'studio-light'}
                        autoPlay={true}
                        autoPlayInterval={3200}
                        showReflection={true}
                      />
                    </div>
                  )}

                  {comp.slug === 'page-turn-book' && (
                    <div style={{ width: '100%', maxWidth: '290px', height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <PageTurnBook
                        compact={true}
                        variant={isDark ? 'dark-obsidian' : 'studio-editorial'}
                        soundEnabled={false}
                        autoPlay={true}
                        autoPlayInterval={3200}
                        interactiveCurl={false}
                      />
                    </div>
                  )}

                  {comp.slug === 'point-cloud-morpher' && (
                    <div style={{ width: '100%', height: '185px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', overflow: 'hidden' }}>
                      <PointCloudMorpher
                        compact={true}
                        theme={theme}
                        topology="torus"
                        variant={isDark ? 'cyber-violet' : 'deep-ice'}
                        particleCount={450}
                        showConstellations={false}
                        soundEnabled={false}
                        autoRotate={true}
                        interactiveVortex={true}
                      />
                    </div>
                  )}

                  {comp.slug === 'perspective-text-ribbon' && (
                    <div style={{ width: '100%', height: '185px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', overflow: 'hidden' }}>
                      <PerspectiveTextRibbon
                        compact={true}
                        theme={theme}
                        orientation="dynamic"
                        variant={isDark ? 'cyber-indigo' : 'solar-flame'}
                        speed={1.0}
                        direction="forward"
                        soundEnabled={false}
                        interactiveScrub={true}
                      />
                    </div>
                  )}

                  {comp.slug === 'quantum-orbit-beacon' && (
                    <div style={{ width: '100%', height: '185px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', overflow: 'hidden' }}>
                      <QuantumOrbitBeacon
                        compact={true}
                        theme={theme}
                        size="md"
                        state="optimal"
                        speed={1.0}
                        soundEnabled={false}
                        interactive={true}
                        showTelemetry={true}
                      />
                    </div>
                  )}

                  {comp.slug === 'infinite-canvas-gallery' && (
                    <div style={{ width: '100%', maxWidth: '290px', height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <InfiniteCanvasGallery
                        compact={true}
                        soundEnabled={false}
                        variant={isDark ? 'dark-slate' : 'studio-light'}
                      />
                    </div>
                  )}

                  {comp.slug === 'magnetic-project-list' && (
                    <div style={{ width: '100%', maxWidth: '290px', height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MagneticProjectList
                        compact={true}
                        soundEnabled={false}
                        variant={isDark ? 'dark-slate' : 'studio-light'}
                      />
                    </div>
                  )}

                  {comp.slug === 'neural-graph' && (
                    <div style={{ width: '100%', maxWidth: '300px', height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                      <NeuralGraph
                        variant={isDark ? 'dark-slate' : 'studio-light'}
                        compact={true}
                        soundEnabled={false}
                        autoPulse={true}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  )}
                </div>

                {/* 2. Structured Card Information */}
                <div className="modui-card-content">
                  <h3 className="modui-card-title">
                    <a
                      href={`/components/${comp.slug}`}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onNavigate(`/components/${comp.slug}`);
                      }}
                    >
                      {comp.name}
                    </a>
                  </h3>
                  <p className="modui-card-description">{comp.description}</p>

                  <div className="modui-card-action-bar">
                    <span className="modui-card-cta-link" style={{ marginLeft: 'auto' }}>
                      <span>Inspect Component</span>
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
