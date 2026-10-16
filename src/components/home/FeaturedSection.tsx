import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RadialOrbitHub } from '../ui/radial-hub';
import { CylindricalCarousel } from '../ui/carousel';
import { NumberTicker } from '../ui/counter';
import './FeaturedSection.css';

interface FeaturedSectionProps {
  onNavigate: (path: string) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ onNavigate }) => {
  const [cardTickerVal, setCardTickerVal] = useState(1420);

  return (
    <section className="modui-showcase-section">
      <div className="modui-container">
        <div className="modui-showcase-header">
          <div className="modui-eyebrow">FEATURED SHOWCASE</div>
          <h2 className="modui-showcase-title">Signature Interface Patterns</h2>
          <p className="modui-showcase-desc">
            Explore live, interactive modules crafted for tactile engagement, high performance, and rapid copy-paste adoption.
          </p>
        </div>

        <div className="modui-featured-3-grid">
          {/* Card 1: Radial Orbit Action Hub */}
          <div
            className="modui-featured-card"
            onClick={() => onNavigate('/components/radial-orbit-hub')}
          >
            <div className="modui-card-meta-top">
              <span className="modui-card-cat-badge">Action Wheel</span>
              <span className="modui-card-accent-tag">Inertia Momentum</span>
            </div>
            <h3 className="modui-card-title">Radial Orbit Action Hub</h3>
            <p className="modui-card-description">
              Tactile circular core blossoming into satellite action nodes with rotational inertia, drag momentum, and Web Audio haptics.
            </p>

            <div className="modui-card-preview-stage modui-card-preview-stage--orbit" onClick={(e) => e.stopPropagation()}>
              <RadialOrbitHub
                items={[
                  {
                    id: 'search',
                    label: 'Spotlight',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    ),
                  },
                  {
                    id: 'ai',
                    label: 'AI Synthesis',
                    badge: 'Pro',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
                      </svg>
                    ),
                  },
                  {
                    id: 'layers',
                    label: 'Stack',
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
                    label: 'Console',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="4 17 10 11 4 5" />
                        <line x1="12" x2="20" y1="19" y2="19" />
                      </svg>
                    ),
                  },
                  {
                    id: 'deploy',
                    label: 'Publish',
                    badge: 'Fast',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                      </svg>
                    ),
                  },
                ]}
                radius={60}
                variant="glass"
                showLabels={false}
                soundEnabled={true}
                onSelect={(_item) => {
                  confetti({
                    particleCount: 28,
                    spread: 55,
                    origin: { y: 0.6 },
                    colors: ['#4F46E5', '#38BDF8', '#F59E0B', '#10B981'],
                  });
                }}
              />
            </div>

            <div className="modui-card-action-bar">
              <span className="modui-card-cta-link">
                <span>Inspect Component</span>
                <span>→</span>
              </span>
            </div>
          </div>

          {/* Card 2: Cylindrical 3D Carousel */}
          <div
            className="modui-featured-card"
            onClick={() => onNavigate('/components/cylindrical-carousel')}
          >
            <div className="modui-card-meta-top">
              <span className="modui-card-cat-badge">3D & Interactive Showcase</span>
              <span className="modui-card-accent-tag">CSS 3D Engine</span>
            </div>
            <h3 className="modui-card-title">Cylindrical 3D Carousel</h3>
            <p className="modui-card-description">
              Pure CSS 3D cylindrical carousel supporting touch drag, mouse physics, inertia momentum, and tilt.
            </p>

            <div className="modui-card-preview-stage modui-card-preview-stage--carousel" onClick={(e) => e.stopPropagation()}>
              <div style={{ width: '100%', height: '145px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CylindricalCarousel
                  items={[
                    { id: '1', title: 'Spatial Studio', tag: 'Core', color: '#4F46E5', badge: 'v2.1' },
                    { id: '2', title: 'Neural Canvas', tag: 'WebGL', color: '#06B6D4', badge: 'New' },
                    { id: '3', title: 'Haptic Rotary', tag: 'Dial', color: '#10B981' },
                    { id: '4', title: 'Vector Scope', tag: 'Audio', color: '#F59E0B' },
                  ]}
                  radius={115}
                  cardWidth={120}
                  cardHeight={150}
                  perspective={420}
                  tiltAngle={-4}
                  showControls={false}
                  showIndicators={false}
                  showDragHint={false}
                  autoplay={true}
                  autoplaySpeed={15}
                  style={{ minHeight: '145px', height: '145px' }}
                />
              </div>
            </div>

            <div className="modui-card-action-bar">

              <span className="modui-card-cta-link">
                <span>Inspect Component</span>
                <span>→</span>
              </span>
            </div>
          </div>

          {/* Card 3: Number Ticker */}
          <div
            className="modui-featured-card"
            onClick={() => onNavigate('/components/number-ticker')}
          >
            <div className="modui-card-meta-top">
              <span className="modui-card-cat-badge">Status & Indicators</span>
              <span className="modui-card-accent-tag">Easing Springs</span>
            </div>
            <h3 className="modui-card-title">Number Ticker Counter</h3>
            <p className="modui-card-description">
              Mechanical rolling digits ticker for metrics, dashboards, dynamic counters, and realtime analytics.
            </p>

            <div className="modui-card-preview-stage" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem', width: '100%' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  <NumberTicker value={cardTickerVal} prefix="$" suffix="/mo" duration={1} />
                </div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    type="button"
                    className="modui-pill-toggle"
                    onClick={() => setCardTickerVal((v) => v + 250)}
                  >
                    +250
                  </button>
                  <button
                    type="button"
                    className="modui-pill-toggle"
                    onClick={() => setCardTickerVal((v) => Math.max(0, v - 100))}
                  >
                    -100
                  </button>
                  <button
                    type="button"
                    className="modui-pill-toggle"
                    onClick={() => setCardTickerVal(Math.floor(Math.random() * 8000) + 500)}
                  >
                    Random
                  </button>
                </div>
              </div>
            </div>

            <div className="modui-card-action-bar">

              <span className="modui-card-cta-link">
                <span>Inspect Component</span>
                <span>→</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
