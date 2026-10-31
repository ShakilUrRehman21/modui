import React, { useState } from 'react';
import { COMPONENT_REGISTRY } from '../../registry/components';
import { NeuralClothMesh } from '../ui/cloth';
import { FluidElasticAccordion } from '../ui/accordion';
import { RotaryJogWheel } from '../ui/rotary';
import { trackPreviewOpen, trackCopyCode } from '../../lib/analytics';
import './FeaturedSection.css';

interface FeaturedSectionProps {
  onNavigate: (path: string) => void;
}

// Strictly showcase 3 flagship primitives on the Home Page
const FEATURED_SLUGS = [
  'neural-cloth-mesh',
  'rotary-jog-wheel',
  'fluid-elastic-accordion',
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

  return (
    <section className="modui-gallery-section" id="components-gallery">
      <div className="modui-container">
        {/* Section Header */}
        <div className="modui-gallery-header">
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
          {featuredComponents.map((comp) => {
            if (!comp) return null;
            const isCopied = copiedSlug === comp.slug;

            return (
              <div
                key={comp.slug}
                className="modui-card-item"
                onClick={() => {
                  trackPreviewOpen({
                    component: comp.slug,
                    variant: 'default',
                    source: 'featured_card',
                  });
                  onNavigate(`/components/${comp.slug}`);
                }}
              >
                {/* 1. Component Live Canvas Stage */}
                <div
                  className="modui-card-stage"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="modui-card-stage-topbar">
                    <span className="modui-card-cat-badge">{comp.category}</span>
                    <span className="modui-card-ver-badge">v{comp.version}</span>
                  </div>

                  {/* NeuralClothMesh Live Stage */}
                  {comp.slug === 'neural-cloth-mesh' && (
                    <div style={{ width: '100%', height: '100%', minHeight: '190px', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                      <NeuralClothMesh
                        variant="studio-silk"
                        renderMode="wireframe"
                        pinMode="curtain"
                        windStrength={0}
                        gravity={0.10}
                        compact={true}
                        soundEnabled={false}
                        style={{ width: '100%', height: '100%', minHeight: '190px' }}
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

                  {/* RotaryJogWheel Live Stage */}
                  {comp.slug === 'rotary-jog-wheel' && (
                    <div className="modui-stage-center" style={{ padding: '0.75rem 1rem' }}>
                      <RotaryJogWheel
                        size="sm"
                        defaultValue={64}
                        min={0}
                        max={100}
                        variant="metallic"
                        mode="bounded"
                        soundEnabled={false}
                        sublabel="LEVEL"
                      />
                    </div>
                  )}

                  {/* FluidElasticAccordion Live Stage */}
                  {comp.slug === 'fluid-elastic-accordion' && (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', padding: '0.75rem 1rem' }}>
                      <FluidElasticAccordion
                        items={[
                          { id: '1', number: '01', title: 'Spatial', subtitle: 'WebGL 3D', color: '#365CF5', tag: 'Core' },
                          { id: '2', number: '02', title: 'Rotary', subtitle: 'Haptics', color: '#FF735E', tag: 'Audio' },
                          { id: '3', number: '03', title: 'Physics', subtitle: 'Spring Mesh', color: '#10B981', tag: 'Motion' },
                        ]}
                        defaultActiveId="1"
                        orientation="horizontal"
                        variant="light"
                        trigger="hover"
                        soundEnabled={false}
                        expandedRatio={2.5}
                        style={{ height: '160px', minHeight: '160px', width: '100%', borderRadius: '6px' }}
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
                    <div className="modui-card-tags">
                      {comp.tags?.slice(0, 2).map((t) => (
                        <span key={t} className="modui-card-tag">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <a
                      href={`/components/${comp.slug}`}
                      className="modui-card-inspect-cta"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onNavigate(`/components/${comp.slug}`);
                      }}
                      style={{ textDecoration: 'none' }}
                      title={`Inspect ${comp.name} component`}
                    >
                      <span>Inspect & Code</span>
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
        <div className="modui-gallery-footer-banner">
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
