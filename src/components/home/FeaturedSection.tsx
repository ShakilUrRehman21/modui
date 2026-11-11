import React, { useState } from 'react';
import { COMPONENT_REGISTRY } from '../../registry/components';
import { InfiniteCanvasGallery } from '../ui/infinite-canvas-gallery';
import { MagneticProjectList } from '../ui/magnetic-project-list';
import { SpatialGallery } from '../ui/spatial-gallery';
import { trackPreviewOpen, trackCopyCode } from '../../lib/analytics';
import './FeaturedSection.css';

interface FeaturedSectionProps {
  onNavigate: (path: string) => void;
  theme?: 'light' | 'dark';
}

// Strictly showcase 3 flagship primitives on the Home Page
const FEATURED_SLUGS = [
  'infinite-canvas-gallery',
  'magnetic-project-list',
  'spatial-gallery',
];

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ onNavigate, theme }) => {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

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
    const rotX = ((y - cy) / cy) * -2.5;
    const rotY = ((x - cx) / cx) * 2.5;
    card.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px)`;
    const glare = card.querySelector('.modui-card-glare') as HTMLElement;
    if (glare) {
      glare.style.opacity = '1';
      glare.style.setProperty('--gx', `${(x / rect.width) * 100}%`);
      glare.style.setProperty('--gy', `${(y / rect.height) * 100}%`);
    }
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = '';
    const glare = card.querySelector('.modui-card-glare') as HTMLElement;
    if (glare) {
      glare.style.opacity = '0';
    }
  };

  return (
    <section className="modui-gallery-section" id="components-gallery">
      <div className="modui-container">
        {/* Section Header */}
        <div className="modui-gallery-header">
          <div className="modui-gallery-header-text modui-reveal">
            <h2 className="modui-section-title modui-gallery-title">Three to start with.</h2>
            <p className="modui-section-lede">
              Our most ambitious pieces, running live. Drag, hover and scroll inside each one —
              then open it to read the source.
            </p>
          </div>
          <a
            href="/components"
            className="modui-gallery-see-all modui-reveal modui-delay-1"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/components');
            }}
          >
            <span>{`See all ${COMPONENT_REGISTRY.length}`}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        {/* 3-Card Featured Grid */}
        <div className="modui-gallery-grid">
          {featuredComponents.map((comp, i) => {
            if (!comp) return null;
            const isCopied = copiedSlug === comp.slug;
            const delayClass = `modui-delay-${i + 1}`;

            return (
              <div
                key={comp.slug}
                className={`modui-card-item modui-spotlight modui-reveal ${delayClass}`}
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
                    <div className="modui-card-preview-surface">
                      <InfiniteCanvasGallery
                        compact={true}
                        soundEnabled={false}
                        variant={isDark ? 'dark-slate' : 'studio-light'}
                      />
                    </div>
                  )}

                  {/* MagneticProjectList Live Stage */}
                  {comp.slug === 'magnetic-project-list' && (
                    <div className="modui-card-preview-surface">
                      <MagneticProjectList
                        compact={true}
                        soundEnabled={false}
                        variant={isDark ? 'dark-slate' : 'studio-light'}
                      />
                    </div>
                  )}

                  {/* SpatialGallery Live Stage */}
                  {comp.slug === 'spatial-gallery' && (
                    <div className="modui-card-preview-surface">
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
                      className={`modui-card-copy-btn ${isCopied ? 'is-copied' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopySnippet(comp.slug, comp.codeSnippet || `<${comp.name} />`);
                      }}
                      title={`Copy ${comp.name} snippet`}
                      aria-label={`Copy ${comp.name} snippet`}
                    >
                      {isCopied ? (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Copied</span>
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
                      <span>Open component</span>
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

      </div>
    </section>
  );
};

export default FeaturedSection;
