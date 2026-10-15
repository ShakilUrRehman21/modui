import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { AnimatedButton } from '../ui/button';
import { CylindricalCarousel } from '../ui/carousel';
import { NumberTicker } from '../ui/counter';
import './FeaturedSection.css';

interface FeaturedSectionProps {
  onNavigate: (path: string) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ onNavigate }) => {
  const [cardTickerVal, setCardTickerVal] = useState(1420);

  const triggerConfetti = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { x, y },
      colors: ['#4F46E5', '#38BDF8', '#F59E0B', '#10B981'],
    });
  };

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
          {/* Card 1: Animated Button Suite */}
          <div
            className="modui-featured-card"
            onClick={() => onNavigate('/components/animated-button')}
          >
            <div className="modui-card-meta-top">
              <span className="modui-card-cat-badge">Buttons and Actions</span>
              <span className="modui-card-accent-tag">7 Variants</span>
            </div>
            <h3 className="modui-card-title">Animated Button Suite</h3>
            <p className="modui-card-description">
              Micro-interactions including shimmer sheen, magnetic cursor pull, click ripples, and sliding icons.
            </p>

            <div className="modui-card-preview-stage" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <AnimatedButton
                  variant="shimmer"
                  size="sm"
                  onClick={triggerConfetti}
                >
                  Shimmer Sheen 🎉
                </AnimatedButton>
                <AnimatedButton
                  variant="glow"
                  size="sm"
                >
                  Pulse Glow
                </AnimatedButton>
              </div>
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
