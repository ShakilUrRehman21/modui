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
    stepTitle: 'Nothing extra to ship',
    headerCategory: 'Foundation',
    statusText: 'Production Ready',
    title: 'React 19 and plain CSS',
    description:
      'No animation runtime and no styling library. Motion is computed with CSS transforms and native React state, so your bundle only grows by what you paste.',
    metricLabel: 'Bundle impact',
    metricDetail: 'No 3rd-party baggage',
    metricValue: '0 KB',
  },
  {
    id: 'spec-step-2',
    stepNum: '02',
    stepTitle: 'Source you own',
    headerCategory: 'Ownership',
    statusText: '100% Owned',
    title: 'Paste it, then make it yours',
    description:
      'Each component is a .tsx and a .css file. Change the tokens, the breakpoints or the ARIA labels — there is no upstream package to fight.',
    metricLabel: 'Code you can read',
    metricDetail: 'Full inspection rights',
    metricValue: '100%',
  },
  {
    id: 'spec-step-3',
    stepNum: '03',
    stepTitle: 'GPU-composited motion',
    headerCategory: 'Performance',
    statusText: 'Silky Smooth',
    title: 'Smooth on every frame',
    description:
      'Animations stick to transform and opacity, which the GPU composites without reflowing layout — even while you scroll fast.',
    metricLabel: 'Refresh target',
    metricDetail: 'Zero dropped frames',
    metricValue: '60 FPS',
  },
];

export const StackedCardsSection: React.FC<StackedCardsSectionProps> = () => {
  const [activeStep, setActiveStep] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [progress, setProgress] = useState(0);

  // Active step + "deck" depth: earlier cards recede as the next one stacks on top
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!cards.length) return;
      let active = 0;
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.top <= 260) active = index;
        const next = cards[index + 1];
        if (!next || reduce) {
          card.style.setProperty('--deck-depth', '0');
          return;
        }
        // 0 when the next card is a viewport away, 1 when it has fully covered this one
        const nextTop = next.getBoundingClientRect().top;
        const depth = Math.min(1, Math.max(0, 1 - (nextTop - rect.top) / (rect.height + 40)));
        card.style.setProperty('--deck-depth', depth.toFixed(3));
      });
      setActiveStep(active);

      const first = cards[0].getBoundingClientRect();
      const last = cards[cards.length - 1].getBoundingClientRect();
      const span = last.top - first.top + 1;
      setProgress(Math.min(1, Math.max(0, (260 - first.top) / span)));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
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
          <div className="modui-specs-left-sticky modui-reveal">
            <h2 className="modui-section-title modui-specs-pinned-title">
              Built to ship, not just to demo.
            </h2>

            <p className="modui-section-lede modui-specs-pinned-desc">
              Three promises every component keeps, whether it is a button or a WebGL gallery.
            </p>

            {/* Step Navigation Indicator */}
            <div
              className="modui-specs-step-indicator"
              role="tablist"
              aria-label="Architecture guarantees"
              style={{ '--rail-progress': progress } as React.CSSProperties}
            >
              {SPEC_ITEMS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={activeStep === idx}
                  className={`modui-step-pill ${activeStep === idx ? 'modui-step-pill--active' : ''}`}
                  onClick={() => scrollToCard(idx)}
                >
                  <span className="modui-step-dot" aria-hidden="true" />
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
                className="modui-spec-deck-card"
                style={{ top: `${120 + idx * 20}px` }}
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
