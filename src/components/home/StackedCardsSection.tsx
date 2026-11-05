import React, { useState, useEffect, useRef } from 'react';
import './StackedCardsSection.css';

interface StackedCardsSectionProps {
  onNavigate?: (path: string) => void;
}

interface SpecItem {
  id: string;
  stepNum: string;
  stepTitle: string;
  headerCategory: string;
  statusText: string;
  title: string;
  description: string;
  metricLabel: string;
  metricDetail: string;
  metricValue: string;
}

const SPEC_ITEMS: SpecItem[] = [
  {
    id: 'spec-step-1',
    stepNum: '01',
    stepTitle: 'Zero Runtime Bloat',
    headerCategory: '01 / FOUNDATION',
    statusText: 'Production Ready',
    title: 'Pure React 19 & CSS Math',
    description:
      'Zero external animation bloat or oversized bundles. Every motion equation is computed with CSS transforms and native React state.',
    metricLabel: 'BUNDLE IMPACT',
    metricDetail: 'No 3rd-party baggage',
    metricValue: '0 KB',
  },
  {
    id: 'spec-step-2',
    stepNum: '02',
    stepTitle: 'Complete Source Ownership',
    headerCategory: '02 / ARCHITECTURE',
    statusText: '100% Owned',
    title: 'Direct Source Code Ownership',
    description:
      'Drop files directly into your codebase. You retain 100% control over design tokens, CSS styling, responsive breakpoints, and ARIA attributes.',
    metricLabel: 'CODE TRANSPARENCY',
    metricDetail: 'Full inspection rights',
    metricValue: '100%',
  },
  {
    id: 'spec-step-3',
    stepNum: '03',
    stepTitle: 'Hardware-Accelerated 60 FPS',
    headerCategory: '03 / PERFORMANCE',
    statusText: 'Silky Smooth',
    title: 'Hardware Compositing',
    description:
      'Strictly uses GPU-promoted layer operations (transform, opacity). Zero layout reflows, zero paint bottlenecks during rapid scrolling.',
    metricLabel: 'REFRESH TARGET',
    metricDetail: 'Zero dropped frames',
    metricValue: '60 FPS',
  },
];

export const StackedCardsSection: React.FC<StackedCardsSectionProps> = () => {
  const [activeStep, setActiveStep] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Synchronize active step indicator as user scrolls through the cards
  useEffect(() => {
    const handleScroll = () => {
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        // Trigger active step when the card enters the upper focal zone
        if (rect.top <= 260 && rect.bottom >= 180) {
          setActiveStep(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCard = (index: number) => {
    setActiveStep(index);
    const card = cardRefs.current[index];
    if (card) {
      const topOffset = card.getBoundingClientRect().top + window.scrollY - 130;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  return (
    <section className="modui-specs-pinned-section" id="architecture-specs">
      <div className="modui-container">
        <div className="modui-specs-pinned-grid">

          {/* Left Column: Pinned Sticky Information & Step Indicator */}
          <div className="modui-specs-left-sticky modui-reveal modui-slide-left">
            <div className="modui-specs-eyebrow-pill">
              ENGINEERING INTEGRITY
            </div>

            <h2 className="modui-specs-pinned-title">
              Built for Real Production
            </h2>

            <p className="modui-specs-pinned-desc">
              No fragile dependencies. As you scroll down, each architectural guarantee locks into place while the previous card gracefully fades out.
            </p>

            {/* Step Navigation Indicator */}
            <div className="modui-specs-step-indicator" role="tablist" aria-label="Architecture guarantees">
              {SPEC_ITEMS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={activeStep === idx}
                  className={`modui-step-pill ${activeStep === idx ? 'modui-step-pill--active' : ''}`}
                  onClick={() => scrollToCard(idx)}
                >
                  <span className="modui-step-num">{item.stepNum}</span>
                  <span className="modui-step-name">{item.stepTitle}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Sequential Deck of Cards (Slide-In, Pin, and Graceful Fade-Out) */}
          <div className="modui-specs-right-deck">
            {SPEC_ITEMS.map((item, idx) => (
              <div
                key={item.id}
                ref={(el) => { cardRefs.current[idx] = el; }}
                className={`modui-spec-deck-card modui-reveal modui-delay-${idx + 1}`}
                style={{ top: `${110 + idx * 18}px` }}
              >
                <div className="modui-spec-deck-card-head">
                  <span className="modui-spec-deck-card-cat">{item.headerCategory}</span>
                  <span className="modui-spec-deck-card-status">
                    <span className="modui-status-dot-green" />
                    <span>{item.statusText}</span>
                  </span>
                </div>

                <h3 className="modui-spec-deck-card-title">{item.title}</h3>
                <p className="modui-spec-deck-card-text">{item.description}</p>

                <div className="modui-spec-deck-metric-box">
                  <div className="modui-spec-deck-metric-meta">
                    <div className="modui-spec-deck-metric-label">{item.metricLabel}</div>
                    <div className="modui-spec-deck-metric-detail">{item.metricDetail}</div>
                  </div>
                  <div className="modui-spec-deck-metric-val">{item.metricValue}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default StackedCardsSection;
