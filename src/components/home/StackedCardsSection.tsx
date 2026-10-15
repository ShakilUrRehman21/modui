import React from 'react';
import './StackedCardsSection.css';

interface StackedCardsSectionProps {
  onNavigate: (path: string) => void;
}

export const StackedCardsSection: React.FC<StackedCardsSectionProps> = () => {
  return (
    <section className="modui-specs-section">
      <div className="modui-container">
        <div className="modui-specs-header">
          <div className="modui-eyebrow">ARCHITECTURAL SPEC SHEET</div>
          <h2 className="modui-specs-title">Engineered for Production Rigor</h2>
          <p className="modui-specs-desc">
            ModUI removes brittle npm abstractions, bloated component libraries, and vendor lock-in.
            You own 100% of the code, tokens, and markup.
          </p>
        </div>

        <div className="modui-stacked-cards-list">
          {/* Spec Card 1: Pure React & CSS Foundation */}
          <div className="modui-stacked-card" style={{ '--card-index': 0 } as React.CSSProperties}>
            <div className="modui-stacked-card-header">
              <div className="modui-stacked-card-meta">
                <span className="modui-stacked-card-num">01</span>
                <span className="modui-stacked-card-sep">/</span>
                <span className="modui-stacked-card-category">FOUNDATION</span>
              </div>
              <div className="modui-stacked-card-status">
                <span className="modui-status-dot" />
                <span className="modui-status-text">Production Grade</span>
              </div>
            </div>

            <div className="modui-stacked-card-body">
              <div className="modui-stacked-card-content">
                <h3 className="modui-stacked-card-title">Pure React & CSS Foundation</h3>
                <p className="modui-stacked-card-text">
                  Zero heavy runtime dependencies. Built strictly on React 19 and modern CSS tokens with subpixel accuracy.
                  Never worry about bundle bloat or dependency deprecations breaking your UI.
                </p>
                <div className="modui-stacked-card-tags">
                  <span className="modui-tag-chip">React 19</span>
                  <span className="modui-tag-chip">Pure CSS</span>
                  <span className="modui-tag-chip">TypeScript 5+</span>
                  <span className="modui-tag-chip">Zero Bundle Overhead</span>
                </div>
              </div>

              <div className="modui-stacked-card-metric-box">
                <div className="modui-metric-num">0 KB</div>
                <div className="modui-metric-sub">Runtime Dependencies</div>
                <div className="modui-metric-detail">Pure React & standard CSS3 transforms</div>
              </div>
            </div>
          </div>

          {/* Spec Card 2: Complete Code Ownership */}
          <div className="modui-stacked-card" style={{ '--card-index': 1 } as React.CSSProperties}>
            <div className="modui-stacked-card-header">
              <div className="modui-stacked-card-meta">
                <span className="modui-stacked-card-num">02</span>
                <span className="modui-stacked-card-sep">/</span>
                <span className="modui-stacked-card-category">ARCHITECTURE</span>
              </div>
              <div className="modui-stacked-card-status">
                <span className="modui-status-dot" />
                <span className="modui-status-text">Source Transparent</span>
              </div>
            </div>

            <div className="modui-stacked-card-body">
              <div className="modui-stacked-card-content">
                <h3 className="modui-stacked-card-title">Complete Code Ownership</h3>
                <p className="modui-stacked-card-text">
                  No npm lock-in, no black-box packages. Copy self-contained components directly into your codebase.
                  Full control to tweak easing curves, styling tokens, ARIA bindings, and layout behavior.
                </p>
                <div className="modui-stacked-card-tags">
                  <span className="modui-tag-chip">Direct Copy</span>
                  <span className="modui-tag-chip">Self Contained</span>
                  <span className="modui-tag-chip">No Vendor Lock-in</span>
                  <span className="modui-tag-chip">Customizable</span>
                </div>
              </div>

              <div className="modui-stacked-card-metric-box">
                <div className="modui-metric-num">100%</div>
                <div className="modui-metric-sub">Code Ownership</div>
                <div className="modui-metric-detail">Direct file drop into your existing design system</div>
              </div>
            </div>
          </div>

          {/* Spec Card 3: Hardware-Accelerated Motion */}
          <div className="modui-stacked-card" style={{ '--card-index': 2 } as React.CSSProperties}>
            <div className="modui-stacked-card-header">
              <div className="modui-stacked-card-meta">
                <span className="modui-stacked-card-num">03</span>
                <span className="modui-stacked-card-sep">/</span>
                <span className="modui-stacked-card-category">PERFORMANCE</span>
              </div>
              <div className="modui-stacked-card-status">
                <span className="modui-status-dot" />
                <span className="modui-status-text">GPU Accelerated</span>
              </div>
            </div>

            <div className="modui-stacked-card-body">
              <div className="modui-stacked-card-content">
                <h3 className="modui-stacked-card-title">Hardware-Accelerated Motion</h3>
                <p className="modui-stacked-card-text">
                  Animations run strictly on GPU compositor layers using transform and opacity.
                  Engineered for seamless 120 FPS high refresh rates on ProMotion and mobile displays.
                </p>
                <div className="modui-stacked-card-tags">
                  <span className="modui-tag-chip">Compositor Layer</span>
                  <span className="modui-tag-chip">Zero Layout Thrash</span>
                  <span className="modui-tag-chip">Subpixel Easing</span>
                  <span className="modui-tag-chip">Mobile Optimized</span>
                </div>
              </div>

              <div className="modui-stacked-card-metric-box">
                <div className="modui-metric-num">120 FPS</div>
                <div className="modui-metric-sub">Fluid Compositing</div>
                <div className="modui-metric-detail">Zero CPU layout thrashing during animations</div>
              </div>
            </div>
          </div>

          {/* Spec Card 4: Accessible by Default */}
          <div className="modui-stacked-card" style={{ '--card-index': 3 } as React.CSSProperties}>
            <div className="modui-stacked-card-header">
              <div className="modui-stacked-card-meta">
                <span className="modui-stacked-card-num">04</span>
                <span className="modui-stacked-card-sep">/</span>
                <span className="modui-stacked-card-category">ACCESSIBILITY</span>
              </div>
              <div className="modui-stacked-card-status">
                <span className="modui-status-dot" />
                <span className="modui-status-text">Standards Compliant</span>
              </div>
            </div>

            <div className="modui-stacked-card-body">
              <div className="modui-stacked-card-content">
                <h3 className="modui-stacked-card-title">Accessible by Default</h3>
                <p className="modui-stacked-card-text">
                  Fully keyboard navigable with visible focus indicators, semantic HTML5 elements,
                  WAI-ARIA compliance, and automatic prefers-reduced-motion media query dampening.
                </p>
                <div className="modui-stacked-card-tags">
                  <span className="modui-tag-chip">WAI-ARIA AA</span>
                  <span className="modui-tag-chip">Keyboard Nav</span>
                  <span className="modui-tag-chip">Reduced Motion</span>
                  <span className="modui-tag-chip">Screen Readers</span>
                </div>
              </div>

              <div className="modui-stacked-card-metric-box">
                <div className="modui-metric-num">100 / 100</div>
                <div className="modui-metric-sub">Accessibility Score</div>
                <div className="modui-metric-detail">Lighthouse verified WCAG AA compliance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
