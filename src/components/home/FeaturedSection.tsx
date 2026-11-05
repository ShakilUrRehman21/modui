import React, { useState } from 'react';
import { COMPONENT_REGISTRY } from '../../registry/components';
import { InfiniteCanvasGallery } from '../ui/infinite-canvas-gallery';
import { MagneticProjectList } from '../ui/magnetic-project-list';
import { SpatialGallery } from '../ui/spatial-gallery';
import { trackPreviewOpen, trackCopyCode } from '../../lib/analytics';
import './FeaturedSection.css';

interface FeaturedSectionProps {
  onNavigate: (path: string) => void;
}

// Strictly showcase 3 flagship primitives on the Home Page
const FEATURED_SLUGS = [
  'infinite-canvas-gallery',
  'magnetic-project-list',
  'spatial-gallery',
];

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ onNavigate }) => {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Retrieve the 3 featured components from the registry
  const featuredComponents = FEATURED_SLUGS.map((slug) =>
    COMPONENT_REGISTRY.find((comp) => comp.slug === slug)
  ).filter(Boolean);

  const handleCopySnippet = (slug: string, snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSlug(slug);
    trackCopyCode({
      component: slug,
      file: 'snippet',
      format: 'snippet',
      source: 'featured_showcase',
    });
    setTimeout(() => {
      setCopiedSlug((prev) => (prev === slug ? null : prev));
    }, 2000);
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -4.5;
    const rotY = ((x - cx) / cx) * 4.5;
    card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(4px)`;
    const glare = card.querySelector('.modui-card-glare') as HTMLElement;
    if (glare) {
      glare.style.opacity = '1';
      glare.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 65%)`;
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

  return (
    <section className="modui-gallery-section" id="components-gallery">
      <div className="modui-container">
        {/* Section Header */}
        <div className="modui-gallery-header modui-reveal">
          <div className="modui-gallery-eyebrow">
            <span className="modui-gallery-eyebrow-dot" />
            <span>FEATURED PRIMITIVES</span>
            <span className="modui-gallery-count">3 FLAGSHIP MODULES</span>
          </div>

          <h2 className="modui-gallery-title">
            Engineered for Character.
          </h2>

          <p className="modui-gallery-desc">
            Three living interactive primitives showcasing fluid spring mechanics, tactile haptic responses,
            and high-precision architectural styling. Interact directly with each module.
          </p>
        </div>

        {/* 3-Card Featured Grid */}
        <div className="modui-gallery-grid">
          {featuredComponents.map((comp, i) => {
            if (!comp) return null;
            const isCopied = copiedSlug === comp.slug;
            const directionClass = i === 0 ? 'modui-slide-left' : i === 1 ? 'modui-scale-up' : 'modui-slide-right';
            const delayClass = `modui-delay-${i + 1}`;

            return (
              <div
                key={comp.slug}
                className={`modui-card-item modui-reveal ${directionClass} ${delayClass}`}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                onClick={() => {
                  trackPreviewOpen({
                    component: comp.slug,
                    variant: 'default',
                    source: 'featured_card',
                  });
                  onNavigate(`/components/${comp.slug}`);
                }}
              >
                <div className="modui-card-glare" aria-hidden="true" />

                {/* 1. Component Live Canvas Stage */}
                <div
                  className="modui-card-stage"
                  onClick={(e) => e.stopPropagation()}
                >

                  {/* InfiniteCanvasGallery Live Stage */}
                  {comp.slug === 'infinite-canvas-gallery' && (
                    <div style={{ width: '100%', maxWidth: '290px', height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <InfiniteCanvasGallery
                        compact={true}
                        soundEnabled={false}
                        variant="studio-light"
                      />
                    </div>
                  )}

                  {/* MagneticProjectList Live Stage */}
                  {comp.slug === 'magnetic-project-list' && (
                    <div style={{ width: '100%', maxWidth: '290px', height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MagneticProjectList
                        compact={true}
                        soundEnabled={false}
                        variant="studio-light"
                      />
                    </div>
                  )}

                  {/* SpatialGallery Live Stage */}
                  {comp.slug === 'spatial-gallery' && (
                    <div style={{ width: '100%', maxWidth: '290px', height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <SpatialGallery
                        compact={true}
                        soundEnabled={false}
                        variant="studio-light"
                        autoPlay={true}
                        autoPlayInterval={3200}
                        showReflection={true}
                      />
                    </div>
                  )}
                </div>

                {/* 2. Structured Card Information */}
                <div className="modui-card-body">
                  <div className="modui-card-header-row">
                    <h3 className="modui-card-name">
                      <a
                        href={`/components/${comp.slug}`}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate(`/components/${comp.slug}`);
                        }}
                      >
                        {comp.name}
                      </a>
                    </h3>

                    {/* Quick Snippet Copy */}
                    <button
                      type="button"
                      className="modui-card-copy-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopySnippet(comp.slug, comp.codeSnippet || `<${comp.name} />`);
                      }}
                      title={`Copy ${comp.name} snippet`}
                      aria-label={`Copy ${comp.name} snippet`}
                    >
                      {isCopied ? (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#365CF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Copied</span>
                        </>
                      ) : (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="modui-card-desc">{comp.description}</p>

                  <div className="modui-card-footer">
                    <a
                      href={`/components/${comp.slug}`}
                      className="modui-card-inspect-cta"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onNavigate(`/components/${comp.slug}`);
                      }}
                      style={{ textDecoration: 'none', marginLeft: 'auto' }}
                      title={`Inspect ${comp.name} component`}
                    >
                      <span>Inspect Component</span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner to Explore All Components */}
        <div className="modui-gallery-footer-banner modui-reveal modui-scale-up modui-delay-2">
          <div className="modui-gallery-footer-text">
            <h4 className="modui-gallery-footer-title">{`Looking for the remaining ${COMPONENT_REGISTRY.length - 3} components?`}</h4>
            <p className="modui-gallery-footer-desc">
              Browse BeforeAfterSlider, FloatingDock, CylindricalCarousel, NumberTicker, AnimatedButton, KineticText, and Badge in the laboratory catalogue.
            </p>
          </div>
          <button
            type="button"
            className="modui-gallery-explore-all-btn"
            onClick={() => onNavigate('/components')}
          >
            <span>{`Explore All ${COMPONENT_REGISTRY.length} Primitives`}</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
