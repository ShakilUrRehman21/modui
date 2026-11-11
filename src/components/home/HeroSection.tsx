import React, { useState, useRef, useEffect } from 'react';
import { AnimatedButton } from '../ui/button';
import { KineticText } from '../ui/motion/KineticText';
import { trackGithubClick, trackPreviewOpen, trackCopyCode } from '../../lib/analytics';
import { COMPONENT_REGISTRY } from '../../registry/components';
import { ProximityHeadline } from './ProximityHeadline';
import './HeroSection.css';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
  children?: React.ReactNode;
}

type ExperimentTab = 'buttons' | 'typography';
type MotionMode = 'restrained' | 'expressive';

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, children }) => {
  // Playground state
  const [selectedTab, setSelectedTab] = useState<ExperimentTab>('buttons');
  const [motionMode, setMotionMode] = useState<MotionMode>('expressive');
  const [buttonClicks, setButtonClicks] = useState(0);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [kineticText, setKineticText] = useState('Interfaces with character.');
  const [kineticKey, setKineticKey] = useState(0);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);

  // 2. Interactive Pixel Grid Trail on Mouse Move (Synchronized to 36px studio background grid)
  useEffect(() => {
    const canvas = gridCanvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Must match index.css body background-size: 36px 36px
    const CELL_SIZE = 36;
    const BOX_LIFETIME = 1400;
    let animId: number;
    let activeBoxes: Array<{ col: number; row: number; addedAt: number }> = [];

    // Pull the live accent (changes with theme) as an "r, g, b" triple
    const readAccent = () => {
      const hex = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim();
      const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
      return m ? `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}` : '54, 92, 245';
    };
    let accentRgb = readAccent();

    const resizeCanvas = () => {
      const rect = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      const now = performance.now();
      const rect = hero.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      if (activeBoxes.length === 0) accentRgb = readAccent();

      activeBoxes = activeBoxes.filter((b) => now - b.addedAt < BOX_LIFETIME);

      const canvasDocX = rect.left + window.scrollX;
      const canvasDocY = rect.top + window.scrollY;

      for (const box of activeBoxes) {
        const age = now - box.addedAt;
        const progress = age / BOX_LIFETIME;
        const opacity = Math.max(0, 1 - progress);

        const drawX = Math.round(box.col * CELL_SIZE - canvasDocX);
        const drawY = Math.round(box.row * CELL_SIZE - canvasDocY);

        // Precise Cobalt pixel highlight aligned with the background grid
        ctx.fillStyle = `rgba(${accentRgb}, ${opacity * 0.1})`;
        ctx.fillRect(drawX + 1, drawY + 1, CELL_SIZE - 1, CELL_SIZE - 1);

        ctx.strokeStyle = `rgba(${accentRgb}, ${opacity * 0.32})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(drawX + 0.5, drawY + 0.5, CELL_SIZE, CELL_SIZE);
      }

      if (activeBoxes.length > 0) {
        animId = requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return;
      }

      const docX = e.clientX + window.scrollX;
      const docY = e.clientY + window.scrollY;

      const col = Math.floor(docX / CELL_SIZE);
      const row = Math.floor(docY / CELL_SIZE);

      const now = performance.now();
      const existing = activeBoxes.find((b) => b.col === col && b.row === row);
      if (existing) {
        existing.addedAt = now;
      } else {
        activeBoxes.push({ col, row, addedAt: now });
      }

      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  // Reset interaction
  const handleReset = () => {
    setSelectedTab('buttons');
    setMotionMode('expressive');
    setButtonClicks(0);
    setButtonLoading(false);
    setKineticText('Interfaces with character.');
    setKineticKey((k) => k + 1);
  };

  const handleButtonClick = () => {
    setButtonClicks((c) => c + 1);
    if (buttonClicks > 0 && buttonClicks % 4 === 3) {
      setButtonLoading(true);
      setTimeout(() => setButtonLoading(false), 900);
    }
  };

  const handleTriggerKinetic = () => {
    setKineticKey((k) => k + 1);
  };

  // Active code snippet for playground bottom code preview
  const getActiveCodeSnippet = () => {
    switch (selectedTab) {
      case 'buttons':
        return `<AnimatedButton variant="shimmer" size="md">
  <span>Explore</span>
</AnimatedButton>`;
      case 'typography':
        return `<KineticText text="${kineticText}" interactiveWave={true} />`;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getActiveCodeSnippet());
    setCopiedSnippet(true);
    trackCopyCode({
      component: selectedTab,
      file: 'playground',
      format: 'snippet',
      source: 'hero_playground',
    });
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="modui-hero-wrapper" ref={heroRef}>
      {/* Interactive Pixel Canvas Grid */}
      <div className="modui-hero-aurora" aria-hidden="true">
        <span className="modui-aurora-blob modui-aurora-blob--a" />
        <span className="modui-aurora-blob modui-aurora-blob--b" />
      </div>
      <canvas ref={gridCanvasRef} className="modui-hero-grid-canvas" aria-hidden="true" />

      <section className="modui-hero-container">
        {/* ====================================================================
            LEFT COLUMN: Editorial Brand Narrative & Typewriter Headline
            ==================================================================== */}
        <div className="modui-hero-left">
          <a
            href="/components"
            className="modui-hero-chip"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/components');
            }}
          >
            <span className="modui-pulse-indicator" aria-hidden="true" />
            <span>{COMPONENT_REGISTRY.length} components, all open source</span>
            <span className="modui-hero-chip-sep" aria-hidden="true" />
            <span className="modui-hero-chip-link">Browse</span>
          </a>

          <ProximityHeadline
            className="modui-hero-headline"
            lead="A little more life"
            rotatingPrefix="in"
            phrases={['every interface.', 'every detail.', 'every click.', 'every scroll.']}
            trackRef={heroRef}
          />

          <p className="modui-hero-support">
            React components with spring physics, tactile sound and motion that answers the cursor.
            Copy the source into your project and own every line — there is no package to install.
          </p>

          <div className="modui-hero-actions">
            <a
              href="/components"
              className="modui-cta-btn"
              data-magnetic
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/components');
              }}
            >
              <span>Browse components</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="modui-cta-btn-arrow" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>

            <a
              href="https://github.com/ShakilUrRehman21/modui"
              target="_blank"
              rel="noopener noreferrer"
              className="modui-secondary-btn"
              data-magnetic
              onClick={() => trackGithubClick({ location: 'hero' })}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>Star on GitHub</span>
            </a>
          </div>

          <ul className="modui-hero-specs-row" aria-label="What you get">
            {['No runtime dependencies', 'Source you own', 'React 19 and plain CSS'].map((label) => (
              <li key={label} className="modui-spec-chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ====================================================================
            RIGHT COLUMN: The Live Interactive Component Playground (No Tilt)
            ==================================================================== */}
        <div className="modui-hero-right">
          <div className="modui-playground-halo" aria-hidden="true" />
          <div className="modui-playground-card">
            {/* Top Toolbar: Experiment Tabs & Controls */}
            <div className="modui-playground-header">
              {/* Tab Selector */}
              <div className="modui-playground-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedTab === 'buttons'}
                  className={`modui-tab-btn ${selectedTab === 'buttons' ? 'modui-tab-btn--active' : ''}`}
                  onClick={() => {
                    setSelectedTab('buttons');
                    trackPreviewOpen({ component: 'button', mode: 'interactive_stage' });
                  }}
                >
                  Buttons
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedTab === 'typography'}
                  className={`modui-tab-btn ${selectedTab === 'typography' ? 'modui-tab-btn--active' : ''}`}
                  onClick={() => {
                    setSelectedTab('typography');
                    trackPreviewOpen({ component: 'kinetic-text', mode: 'interactive_stage' });
                  }}
                >
                  Typography
                </button>
              </div>

              {/* Utility Controls: Motion Mode Toggle + Reset */}
              <div className="modui-playground-controls">
                {/* Motion Mode Toggle */}
                <button
                  type="button"
                  className="modui-control-pill"
                  onClick={() => setMotionMode((m) => (m === 'expressive' ? 'restrained' : 'expressive'))}
                  title="Switch between Expressive (spring-rich) and Restrained (subtle) motion"
                >
                  <span className="modui-control-pill-label">Motion</span>
                  <span className="modui-control-pill-val">{motionMode === 'expressive' ? 'Expressive' : 'Restrained'}</span>
                </button>

                {/* Reset Control */}
                <button
                  type="button"
                  className="modui-control-reset-btn"
                  onClick={handleReset}
                  title="Reset playground to initial state"
                  aria-label="Reset playground"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Live Interactive Stage Area */}
            <div className={`modui-playground-stage modui-playground-stage--${motionMode}`}>
              {/* TAB 1: Animated Buttons Demonstration */}
              {selectedTab === 'buttons' && (
                <div className="modui-demo-buttons-wrap">
                  <div className="modui-buttons-cluster">
                    <AnimatedButton
                      variant="shimmer"
                      size="md"
                      loading={buttonLoading}
                      loadingText="Processing..."
                      onClick={handleButtonClick}
                      className="modui-demo-btn-shimmer"
                    >
                      <span>Interactive Spring</span>
                      <span className="modui-btn-counter-badge">{buttonClicks}</span>
                    </AnimatedButton>

                    <AnimatedButton
                      variant="glow"
                      size="md"
                      onClick={handleButtonClick}
                      className="modui-demo-btn-glow"
                    >
                      <span>Glow Pulse</span>
                    </AnimatedButton>

                    <AnimatedButton
                      variant="ripple"
                      size="md"
                      onClick={handleButtonClick}
                      className="modui-demo-btn-ripple"
                    >
                      <span>Radial Ripple</span>
                    </AnimatedButton>
                  </div>
                </div>
              )}

              {/* TAB 2: Kinetic Typography Demonstration */}
              {selectedTab === 'typography' && (
                <div className="modui-demo-typography-wrap">
                  <div className="modui-typography-canvas" key={kineticKey}>
                    <KineticText
                      text={kineticText}
                      interactiveWave={motionMode === 'expressive'}
                      accentIndices={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
                    />
                  </div>

                  <div className="modui-typography-controls">
                    <div className="modui-preset-buttons">
                      {[
                        'Interfaces with character.',
                        'Physics-informed motion.',
                        'Zero runtime lock-in.',
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          className={`modui-preset-pill ${kineticText === preset ? 'modui-preset-pill--active' : ''}`}
                          onClick={() => {
                            setKineticText(preset);
                            setKineticKey((k) => k + 1);
                          }}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="modui-trigger-wave-btn"
                      onClick={handleTriggerKinetic}
                    >
                      <span>Trigger Wave</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10" />
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Playground Bottom Code Bar & Quick Copy */}
            <div className="modui-playground-footer">
              <div className="modui-code-preview-area">
                <span className="modui-code-file-label">{selectedTab}.tsx</span>
                <code className="modui-code-snippet-line">{getActiveCodeSnippet().split('\n')[0]} ...</code>
              </div>

              <div className="modui-code-actions">
                <button
                  type="button"
                  className={`modui-code-copy-btn ${copiedSnippet ? 'is-copied' : ''}`}
                  onClick={handleCopyCode}
                  title="Copy component code"
                >
                  {copiedSnippet ? (
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

                <a
                  href="/components"
                  className="modui-code-inspect-link"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/components');
                  }}
                  style={{ textDecoration: 'none' }}
                >
                  <span>See all</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Render optional children if any are passed */}
      {children}
    </div>
  );
};

export default HeroSection;
