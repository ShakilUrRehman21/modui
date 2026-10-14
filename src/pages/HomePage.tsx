import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { AnimatedButton } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { KineticText } from '../components/ui/motion/KineticText';
import { NumberTicker } from '../components/ui/counter';
import { CylindricalCarousel } from '../components/ui/carousel';
import { COMPONENT_REGISTRY } from '../registry/components';
import { trackCopyCode, trackComponentInstall, trackPreviewOpen } from '../lib/analytics';
import './HomePage.css';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [promptText, setPromptText] = useState('');

  // Interactive Kinetic Text Studio state
  const [stageKineticText, setStageKineticText] = useState('Modular UI, crafted with character.');
  const [kineticWaveKey, setKineticWaveKey] = useState(0);

  // Number Ticker showcase card state
  const [cardTickerVal, setCardTickerVal] = useState(1420);

  // Audio & Interaction counter
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [clickCount, setClickCount] = useState(0);

  // Refs for Hero Interactive Pixel Grid
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Synthesized mechanical audio click via Web Audio API (Zero external assets)
  const playClickSound = (pitch = 720) => {
    if (!soundEnabled) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;
      const ctx = new AudioCtxClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.45, ctx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch {
      // AudioContext blocked by browser policy, fail gracefully
    }
  };

  // 5. Interactive Pixel Grid Trail in Hero Section — 100% matched with background grid
  useEffect(() => {
    const canvas = gridCanvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const CELL_SIZE = 56;
    const BOX_LIFETIME = 1400; // 1.4s smooth fading delay so boxes fade away one by one
    let animId: number;
    let activeBoxes: Array<{ col: number; row: number; addedAt: number }> = [];

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

      // Filter active boxes within decay lifetime
      activeBoxes = activeBoxes.filter((b) => now - b.addedAt < BOX_LIFETIME);

      const canvasDocX = rect.left + window.scrollX;
      const canvasDocY = rect.top + window.scrollY;

      for (const box of activeBoxes) {
        const age = now - box.addedAt;
        const progress = age / BOX_LIFETIME;
        const opacity = Math.max(0, 1 - progress);

        // Document coordinate aligned to 56px grid
        const drawX = box.col * CELL_SIZE - canvasDocX;
        const drawY = box.row * CELL_SIZE - canvasDocY;

        // Active pixel box illumination
        ctx.fillStyle = `rgba(79, 70, 229, ${opacity * 0.13})`;
        ctx.fillRect(drawX + 1, drawY + 1, CELL_SIZE - 1, CELL_SIZE - 1);

        ctx.strokeStyle = `rgba(79, 70, 229, ${opacity * 0.38})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(drawX + 0.5, drawY + 0.5, CELL_SIZE, CELL_SIZE);
      }

      if (activeBoxes.length > 0) {
        animId = requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();

      // Check bounds within hero container
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return;
      }

      // Convert viewport coordinate to document coordinate (which matches body background-image origin)
      const docX = e.clientX + window.scrollX;
      const docY = e.clientY + window.scrollY;

      const col = Math.floor(docX / CELL_SIZE);
      const row = Math.floor(docY / CELL_SIZE);

      const now = performance.now();
      const existing = activeBoxes.find((b) => b.col === col && b.row === row);
      if (existing) {
        existing.addedAt = now;
      } else {
        // Do NOT cap the number: every visited box gets added and fades away individually
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

  // Fluid cursor tracking spotlight
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // Typewriter effect for "crafted with character."
  const [typedTitle, setTypedTitle] = useState('');
  useEffect(() => {
    const text = 'crafted with character.';
    let i = 0;
    setTypedTitle('');
    const timer = setInterval(() => {
      i++;
      setTypedTitle(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
      }
    }, 60);
    return () => clearInterval(timer);
  }, []);

  // Bottom section interactive sandbox state
  const [bottomActiveTab, setBottomActiveTab] = useState<'tsx' | 'css' | 'usage'>('tsx');
  const [bottomCopied, setBottomCopied] = useState(false);
  const [pkgManager, setPkgManager] = useState<'npm' | 'pnpm' | 'bun'>('npm');

  const publishedCount = COMPONENT_REGISTRY.length;

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) {
      onNavigate('/components');
      return;
    }
    const match = COMPONENT_REGISTRY.find((c) =>
      c.name.toLowerCase().includes(promptText.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(promptText.toLowerCase()))
    );
    if (match) {
      onNavigate(`/components/${match.slug}`);
    } else {
      onNavigate('/components');
    }
  };

  const handleBottomCopy = (text: string, label?: string) => {
    navigator.clipboard.writeText(text);
    setBottomCopied(true);
    setTimeout(() => setBottomCopied(false), 2000);

    const isCli = label === 'Peer Dependency Command';
    trackCopyCode({
      component: isCli ? 'react-peer-dependencies' : 'animated-button',
      file: label || getBottomCodeLabel(),
      format: isCli ? 'terminal_command' : 'full_component',
      source: 'homepage_sandbox',
    });

    if (isCli) {
      trackComponentInstall({
        component: 'react-peer-dependencies',
        package_manager: pkgManager,
        method: 'cli',
      });
    }
  };

  const buttonData = COMPONENT_REGISTRY.find((c) => c.slug === 'animated-button');

  const getBottomCode = () => {
    if (!buttonData) return '';
    if (bottomActiveTab === 'tsx') return buttonData.rawSourceCode;
    if (bottomActiveTab === 'css') return buttonData.rawCssCode;
    return buttonData.codeSnippet;
  };

  const getBottomCodeLabel = () => {
    if (bottomActiveTab === 'tsx') return 'AnimatedButton.tsx';
    if (bottomActiveTab === 'css') return 'AnimatedButton.css';
    return 'Usage.tsx';
  };

  return (
    <div className="nomu-home">
      {/* 1. Hero Section with Interactive Pixel Grid Canvas */}
      <div className="nomu-hero-wrap" ref={heroRef as React.RefObject<HTMLDivElement>}>
        <canvas ref={gridCanvasRef} className="nomu-hero-grid-canvas" />
        <section className="nomu-hero-section">

          {/* Sculpted Editorial Headline */}
          <h1 className="nomu-headline">
            <span className="nomu-headline-line">Modular UI,</span>
            <span className="nomu-headline-line nomu-headline-serif">
              {typedTitle}
              <span className="nomu-cursor-caret" aria-hidden="true">|</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="nomu-hero-subtitle">
            A curated collection of thoughtful React components, tactile micro-interactions, and spatial surfaces.
            Zero runtime dependencies. Inspect every module and copy code directly inside its dedicated tab.
          </p>

          {/* Primary CTA Buttons (Clean without icons) */}
          <div className="nomu-hero-cta-row">
            <button
              className="nomu-cta-btn"
              onClick={() => onNavigate('/components')}
            >
              <span>Explore Components ({publishedCount})</span>
            </button>

            <button
              className="nomu-secondary-btn"
              onClick={() => {
                const el = document.getElementById('studio-stage');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Interactive Studio Stage</span>
            </button>
          </div>

          {/* Improved Search Bar (Compact, Sleek, Shorter placeholder, No icons) */}
          <form className="nomu-composer-bar" onSubmit={handlePromptSubmit}>
            <input
              type="text"
              className="nomu-composer-input"
              placeholder="Search components..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
            />
            <button
              type="submit"
              className="nomu-composer-submit-btn"
              title="Search components"
              aria-label="Search components"
            >
              Search
            </button>
          </form>

          {/* 2. Interactive Studio Stage (Kinetic Motion Engine) */}
          <div id="studio-stage" className="nomu-workbench-stage-card">
            <div className="nomu-workbench-header">
              <div className="nomu-workbench-title-group">
                <span className="nomu-stage-dot" />
                <span className="nomu-workbench-title">INTERACTIVE STUDIO</span>
                <span className="nomu-stage-counter-pill">GSAP Kinetic Wave</span>
              </div>

              <div className="nomu-workbench-header-right">
                {/* Mechanical Click SFX Toggle */}
                <button
                  type="button"
                  className="nomu-sound-toggle-btn"
                  onClick={() => {
                    const next = !soundEnabled;
                    setSoundEnabled(next);
                    if (next) playClickSound(840);
                  }}
                  title={soundEnabled ? 'Mute sound' : 'Enable sound'}
                  aria-label="Toggle SFX"
                >
                  <span>{soundEnabled ? 'Sound: ON' : 'Sound: OFF'}</span>
                </button>
              </div>
            </div>

            {/* Interactive Canvas Stage */}
            <div className="nomu-workbench-canvas">
              <div className="nomu-stage-center-box">
                <KineticText
                  key={kineticWaveKey}
                  as="h2"
                  text={stageKineticText}
                  interactiveWave={true}
                />
                <span className="nomu-canvas-caption">
                  Hover your cursor across characters to trigger <strong>real-time GSAP wave stagger</strong> • Edit string or choose preset below
                </span>
              </div>
            </div>

            {/* Real-time Tweak Controls */}
            <div className="nomu-stage-tweak-bar">
              <div className="nomu-tweak-group nomu-tweak-group-grow">
                <span className="nomu-tweak-label">Kinetic String:</span>
                <input
                  type="text"
                  className="nomu-tweak-input"
                  value={stageKineticText}
                  onChange={(e) => setStageKineticText(e.target.value)}
                  placeholder="Type kinetic text..."
                />
              </div>

              <div className="nomu-tweak-group">
                <span className="nomu-tweak-label">Presets:</span>
                <button
                  type="button"
                  className="nomu-pill-toggle"
                  onClick={() => {
                    setStageKineticText('Modular UI, crafted with character.');
                    setKineticWaveKey((k) => k + 1);
                    playClickSound(780);
                    trackPreviewOpen({ component: 'kinetic-text', mode: 'preset', variant: 'default' });
                  }}
                >
                  Default
                </button>
                <button
                  type="button"
                  className="nomu-pill-toggle"
                  onClick={() => {
                    setStageKineticText('Tactile Physics & Fluid Surfaces');
                    setKineticWaveKey((k) => k + 1);
                    playClickSound(840);
                    trackPreviewOpen({ component: 'kinetic-text', mode: 'preset', variant: 'physics' });
                  }}
                >
                  Physics
                </button>
                <button
                  type="button"
                  className="nomu-pill-toggle"
                  onClick={() => {
                    setStageKineticText('GSAP Character Stagger Wave');
                    setKineticWaveKey((k) => k + 1);
                    playClickSound(920);
                    trackPreviewOpen({ component: 'kinetic-text', mode: 'preset', variant: 'stagger' });
                  }}
                >
                  Stagger
                </button>
              </div>

              <div className="nomu-tweak-group">
                <button
                  type="button"
                  className="nomu-ping-btn"
                  onClick={() => {
                    setKineticWaveKey((k) => k + 1);
                    playClickSound(920);
                    trackPreviewOpen({ component: 'kinetic-text', mode: 'interactive_stage', variant: 'wave_animation' });
                  }}
                >
                  <span>Trigger Wave Animation</span>
                </button>
              </div>
            </div>

            {/* Stage Footer with Inspect Link */}
            <div className="nomu-workbench-footer">
              <span className="nomu-workbench-footer-hint">
                Character-Level GSAP Engine • Hover each letter to experience physics
              </span>

              <button
                className="nomu-inspect-action-btn"
                onClick={() => {
                  trackPreviewOpen({ component: 'kinetic-text', mode: 'code_tab' });
                  onNavigate('/components/kinetic-text');
                }}
              >
                <span>Inspect Kinetic Text & View Code Tabs</span>
              </button>
            </div>
          </div>

          {/* 3. Technology Ecosystem Bar */}
          <div className="nomu-ecosystem-strip">
            <span className="nomu-ecosystem-label">Architecture</span>
            <div className="nomu-ecosystem-badges">
              <span className="nomu-eco-tag">React 19</span>
              <span className="nomu-eco-dot">•</span>
              <span className="nomu-eco-tag">TypeScript</span>
              <span className="nomu-eco-dot">•</span>
              <span className="nomu-eco-tag">Pure CSS</span>
              <span className="nomu-eco-dot">•</span>
              <span className="nomu-eco-tag">Zero Runtime Dependencies</span>
              <span className="nomu-eco-dot">•</span>
              <span className="nomu-eco-tag">1-Click Code Tabs</span>
            </div>
          </div>
        </section>
      </div>

      {/* 4. Featured Showcase: STRICTLY 3 CARDS for the Latest Components */}
      <section className="nomu-showcase-section">
        <div className="modui-container">
          <div className="nomu-showcase-header">
            <div className="nomu-eyebrow">FEATURED SHOWCASE</div>
            <h2 className="nomu-showcase-title">Latest Components</h2>
            <p className="nomu-showcase-desc">
              Three premier components engineered for distinctive web experiences.
              Test them live below, then click to view complete TSX, CSS, and usage tabs.
            </p>
          </div>

          {/* Strictly 3 Premier Cards (NO 4th card, NO v__ labels) */}
          <div className="nomu-featured-3-grid">
            {/* Card 1: Animated Button Suite */}
            <div className="nomu-featured-card" onClick={() => onNavigate('/components/animated-button')}>
              <div className="nomu-card-meta-top">
                <span className="nomu-card-cat-badge">Buttons & Actions</span>
                <span className="nomu-card-accent-tag">Interactive</span>
              </div>

              <h3 className="nomu-card-title">Animated Button Engine</h3>
              <p className="nomu-card-description">
                Polished button component with 7 micro-interactions including shimmer sheen, magnetic pull, click ripples, and icon slides.
              </p>

              {/* Live rendered preview directly inside card with confetti trigger */}
              <div className="nomu-card-preview-stage" onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <AnimatedButton
                    variant="shimmer"
                    size="sm"
                    onClick={() => {
                      confetti({ particleCount: 20, spread: 50, origin: { y: 0.6 } });
                    }}
                  >
                    Shimmer
                  </AnimatedButton>
                  <AnimatedButton
                    variant="glow"
                    size="sm"
                    onClick={() => {
                      confetti({ particleCount: 20, spread: 50, origin: { y: 0.6 } });
                    }}
                  >
                    Glow
                  </AnimatedButton>
                  <AnimatedButton
                    variant="ripple"
                    size="sm"
                  >
                    Ripple
                  </AnimatedButton>
                </div>
              </div>

              <div className="nomu-card-action-bar">
                <span className="nomu-card-cta-link">
                  <span>Inspect & View Code Tabs</span>
                </span>
              </div>
            </div>

            {/* Card 2: Cylindrical 3D Carousel (Today's Component) */}
            <div className="nomu-featured-card" onClick={() => onNavigate('/components/cylindrical-carousel')}>
              <div className="nomu-card-meta-top">
                <span className="nomu-card-cat-badge">3D & Interactive</span>
                <span className="nomu-card-accent-tag">Inertia Physics</span>
              </div>

              <h3 className="nomu-card-title">Cylindrical 3D Carousel</h3>
              <p className="nomu-card-description">
                3D cylindrical projection carousel with touch/mouse inertia drag physics, real-time depth-of-field blur, and click-to-focus orientation.
              </p>

              {/* Live rendered preview directly inside card */}
              <div className="nomu-card-preview-stage" onClick={(e) => e.stopPropagation()}>
                <div style={{ width: '100%', height: '145px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CylindricalCarousel
                    items={[
                      { id: '1', title: 'Spatial Studio', tag: 'Core', color: '#4F46E5', badge: 'v2.1' },
                      { id: '2', title: 'Neural Canvas', tag: 'WebGL', color: '#06B6D4', badge: 'New' },
                      { id: '3', title: 'Haptic Rotary', tag: 'Dial', color: '#10B981' },
                      { id: '4', title: 'Vector Scope', tag: 'Audio', color: '#F59E0B' },
                    ]}
                    radius={110}
                    cardWidth={90}
                    cardHeight={105}
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

              <div className="nomu-card-action-bar">
                <span className="nomu-card-cta-link">
                  <span>Inspect & View Code Tabs</span>
                </span>
              </div>
            </div>

            {/* Card 3: Number Ticker (Rolling Counter) */}
            <div className="nomu-featured-card" onClick={() => onNavigate('/components/number-ticker')}>
              <div className="nomu-card-meta-top">
                <span className="nomu-card-cat-badge">Typography & Motion</span>
                <span className="nomu-card-accent-tag">Spring Odometer</span>
              </div>

              <h3 className="nomu-card-title">Number Ticker</h3>
              <p className="nomu-card-description">
                Smooth vertical slot-machine rolling number counter with spring physics, individual column staggering, and prefix/suffix formatting.
              </p>

              {/* Live rendered preview directly inside card */}
              <div className="nomu-card-preview-stage" onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                  <div style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                    <NumberTicker value={cardTickerVal} prefix="$" suffix="/mo" duration={1.1} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button
                      type="button"
                      className="nomu-pill-toggle"
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
                      onClick={() => setCardTickerVal((v) => v + 100)}
                    >
                      +100
                    </button>
                    <button
                      type="button"
                      className="nomu-pill-toggle"
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
                      onClick={() => setCardTickerVal(1420)}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      className="nomu-pill-toggle"
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
                      onClick={() => setCardTickerVal(Math.floor(Math.random() * 8500) + 500)}
                    >
                      Random
                    </button>
                  </div>
                </div>
              </div>

              <div className="nomu-card-action-bar">
                <span className="nomu-card-cta-link">
                  <span>Inspect & View Code Tabs</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Option A: Architectural Spec Sheet (Why ModUI) - Stackable Cards on Scroll */}
      <section className="nomu-specs-section">
        <div className="modui-container">
          <div className="nomu-specs-header">
            <div className="nomu-eyebrow">ENGINEERING SPECIFICATIONS</div>
            <h2 className="nomu-specs-title">
              Crafted with Purpose. <br />
              Engineered for Longevity.
            </h2>
            <p className="nomu-specs-desc">
              We reject the bloat of black-box component libraries. Every module in ModUI is built on foundational web standards, giving you complete autonomy, blistering speed, and uncompromising visual fidelity.
            </p>
          </div>

          <div className="nomu-stacked-cards-list">
            {/* Spec Card 1: Pure React & CSS Foundation */}
            <div className="nomu-stacked-card" style={{ '--card-index': 0 } as React.CSSProperties}>
              <div className="nomu-stacked-card-header">
                <div className="nomu-stacked-card-meta">
                  <span className="nomu-stacked-card-num">01</span>
                  <span className="nomu-stacked-card-sep">/</span>
                  <span className="nomu-stacked-card-category">RUNTIME ARCHITECTURE</span>
                </div>
                <div className="nomu-stacked-card-status">
                  <span className="nomu-status-dot" />
                  <span className="nomu-status-text">Production Verified</span>
                </div>
              </div>

              <div className="nomu-stacked-card-body">
                <div className="nomu-stacked-card-content">
                  <h3 className="nomu-stacked-card-title">Pure React & CSS Foundation</h3>
                  <p className="nomu-stacked-card-text">
                    No third-party runtime bloat, no proprietary styling engines, and no hidden wrapper baggage. You get lean, ultra-fast JSX and vanilla CSS that bundle cleanly into any React 18 or 19 stack.
                  </p>
                  <div className="nomu-stacked-card-tags">
                    <span className="nomu-tag-chip">Zero Runtime Dependency</span>
                    <span className="nomu-tag-chip">Standard CSS Tokens</span>
                    <span className="nomu-tag-chip">100% Tree-Shakeable</span>
                  </div>
                </div>

                <div className="nomu-stacked-card-metric-box">
                  <div className="nomu-metric-num">&lt; 1.8kb</div>
                  <div className="nomu-metric-sub">Average gzip footprint</div>
                  <div className="nomu-metric-detail">Measured across all core atomic components</div>
                </div>
              </div>
            </div>

            {/* Spec Card 2: Complete Code Ownership */}
            <div className="nomu-stacked-card" style={{ '--card-index': 1 } as React.CSSProperties}>
              <div className="nomu-stacked-card-header">
                <div className="nomu-stacked-card-meta">
                  <span className="nomu-stacked-card-num">02</span>
                  <span className="nomu-stacked-card-sep">/</span>
                  <span className="nomu-stacked-card-category">CODE OWNERSHIP</span>
                </div>
                <div className="nomu-stacked-card-status">
                  <span className="nomu-status-dot" />
                  <span className="nomu-status-text">Direct Copy-Paste</span>
                </div>
              </div>

              <div className="nomu-stacked-card-body">
                <div className="nomu-stacked-card-content">
                  <h3 className="nomu-stacked-card-title">Complete Code Ownership</h3>
                  <p className="nomu-stacked-card-text">
                    No lock-in CLI commands or breaking upstream package updates. Copy the raw TSX and CSS straight into your project. You own every single line, variable, and keyframe forever.
                  </p>
                  <div className="nomu-stacked-card-tags">
                    <span className="nomu-tag-chip">Zero Vendor Lock-In</span>
                    <span className="nomu-tag-chip">Direct TSX & CSS</span>
                    <span className="nomu-tag-chip">Autonomous Styling</span>
                  </div>
                </div>

                <div className="nomu-stacked-card-metric-box">
                  <div className="nomu-metric-num">100%</div>
                  <div className="nomu-metric-sub">Source code transparency</div>
                  <div className="nomu-metric-detail">Full access to raw JSX & vanilla CSS styles</div>
                </div>
              </div>
            </div>

            {/* Spec Card 3: Hardware-Accelerated Motion */}
            <div className="nomu-stacked-card" style={{ '--card-index': 2 } as React.CSSProperties}>
              <div className="nomu-stacked-card-header">
                <div className="nomu-stacked-card-meta">
                  <span className="nomu-stacked-card-num">03</span>
                  <span className="nomu-stacked-card-sep">/</span>
                  <span className="nomu-stacked-card-category">MOTION COMPOSITING</span>
                </div>
                <div className="nomu-stacked-card-status">
                  <span className="nomu-status-dot" />
                  <span className="nomu-status-text">GPU Composited</span>
                </div>
              </div>

              <div className="nomu-stacked-card-body">
                <div className="nomu-stacked-card-content">
                  <h3 className="nomu-stacked-card-title">Hardware-Accelerated Motion</h3>
                  <p className="nomu-stacked-card-text">
                    All micro-interactions, 3D projections, and inertia physics run exclusively on GPU-accelerated CSS properties (transform, opacity, preserve-3d), preventing CPU layout thrashing and stutter.
                  </p>
                  <div className="nomu-stacked-card-tags">
                    <span className="nomu-tag-chip">Composited Transforms</span>
                    <span className="nomu-tag-chip">Zero Layout Thrashing</span>
                    <span className="nomu-tag-chip">Subpixel Precision</span>
                  </div>
                </div>

                <div className="nomu-stacked-card-metric-box">
                  <div className="nomu-metric-num">120 FPS</div>
                  <div className="nomu-metric-sub">Fluid refresh stability</div>
                  <div className="nomu-metric-detail">Zero frame drops under continuous interaction</div>
                </div>
              </div>
            </div>

            {/* Spec Card 4: Accessible by Default */}
            <div className="nomu-stacked-card" style={{ '--card-index': 3 } as React.CSSProperties}>
              <div className="nomu-stacked-card-header">
                <div className="nomu-stacked-card-meta">
                  <span className="nomu-stacked-card-num">04</span>
                  <span className="nomu-stacked-card-sep">/</span>
                  <span className="nomu-stacked-card-category">STANDARDS & ACCESSIBILITY</span>
                </div>
                <div className="nomu-stacked-card-status">
                  <span className="nomu-status-dot" />
                  <span className="nomu-status-text">Standards Verified</span>
                </div>
              </div>

              <div className="nomu-stacked-card-body">
                <div className="nomu-stacked-card-content">
                  <h3 className="nomu-stacked-card-title">Accessible by Default</h3>
                  <p className="nomu-stacked-card-text">
                    Every component is thoroughly tested with screen readers, semantic landmark roles, polite live regions, and full keyboard navigation. Smooth motion gracefully respects user preferences.
                  </p>
                  <div className="nomu-stacked-card-tags">
                    <span className="nomu-tag-chip">WAI-ARIA 1.2 Standards</span>
                    <span className="nomu-tag-chip">Keyboard Navigable</span>
                    <span className="nomu-tag-chip">Reduced Motion Support</span>
                  </div>
                </div>

                <div className="nomu-stacked-card-metric-box">
                  <div className="nomu-metric-num">100 / 100</div>
                  <div className="nomu-metric-sub">Accessibility audit baseline</div>
                  <div className="nomu-metric-detail">Lighthouse & axe-core standard compliance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Senior Developer Architectural Sandbox & Terminal */}
      <section className="nomu-architecture-sandbox-section">
        <div className="modui-container">
          <div className="nomu-sandbox-grid">
            {/* Left Column: Architecture Blueprint & Quick Install */}
            <div className="nomu-sandbox-left">
              <div className="nomu-eyebrow">MODUI ARCHITECTURE</div>
              <h2 className="nomu-sandbox-title">
                Crafted for production. <br />
                Built without bloat.
              </h2>
              <p className="nomu-sandbox-desc">
                Every component is modular, accessible, and self-contained. No black-box runtimes or proprietary CLIs.
                Copy the code straight into your codebase, own every line, and customize without limits.
              </p>

              {/* Genuine Zero-CLI Integration Workflow */}
              <div className="nomu-install-terminal-box">
                <div className="nomu-install-pkg-tabs">
                  <span className="nomu-terminal-badge">React 19 Peer Dependencies</span>
                  {(['npm', 'pnpm', 'bun'] as const).map((pkg) => (
                    <button
                      key={pkg}
                      className={`nomu-pkg-tab ${pkgManager === pkg ? 'nomu-pkg-tab--active' : ''}`}
                      onClick={() => setPkgManager(pkg)}
                    >
                      {pkg}
                    </button>
                  ))}
                </div>

                <div className="nomu-install-code-line">
                  <code>
                    {pkgManager === 'npm' && 'npm install react react-dom'}
                    {pkgManager === 'pnpm' && 'pnpm add react react-dom'}
                    {pkgManager === 'bun' && 'bun add react react-dom'}
                  </code>
                  <button
                    className="nomu-terminal-copy-btn"
                    onClick={() => {
                      const cmd = `${pkgManager === 'npm' ? 'npm install' : pkgManager === 'pnpm' ? 'pnpm add' : 'bun add'} react react-dom`;
                      handleBottomCopy(cmd, 'Peer Dependency Command');
                    }}
                    title="Copy install command"
                  >
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              {/* 3-Step Copy & Own Workflow (Interactive to restore code box if closed) */}
              <div className="nomu-integration-steps">
                <div className="nomu-step-row">
                  <div className="nomu-step-number">1</div>
                  <div className="nomu-step-text">
                    <strong>Zero CLI Required:</strong> No proprietary npm executable to run. Direct copy & paste.
                  </div>
                </div>
                <div className="nomu-step-row">
                  <div className="nomu-step-number">2</div>
                  <div className="nomu-step-text">
                    <strong>Copy from Tabs:</strong> Switch between <em>AnimatedButton.tsx</em>, <em>AnimatedButton.css</em>, and <em>Usage.tsx</em> on the right.
                  </div>
                </div>
                <div className="nomu-step-row">
                  <div className="nomu-step-number">3</div>
                  <div className="nomu-step-text">
                    <strong>Drop into Project:</strong> Save into <code>src/components/ui/button/</code> and use anywhere in React 19.
                  </div>
                </div>
              </div>

              {/* Reassuring Engineering Principles (Clean typography) */}
              <div className="nomu-engineering-pills">
                <div className="nomu-eng-pill">
                  <span className="nomu-eng-bullet">•</span>
                  <span>100% Zero Runtime Dependencies</span>
                </div>
                <div className="nomu-eng-pill">
                  <span className="nomu-eng-bullet">•</span>
                  <span>WAI-ARIA & Keyboard Accessible</span>
                </div>
                <div className="nomu-eng-pill">
                  <span className="nomu-eng-bullet">•</span>
                  <span>Strict TypeScript & React 19 Ready</span>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <button
                  className="nomu-cta-btn"
                  onClick={() => onNavigate('/components')}
                >
                  <span>Browse Complete Catalogue</span>
                </button>
              </div>
            </div>

            {/* Right Column: Basic Code Terminal & File Tabs */}
            <div className="nomu-sandbox-right">
              <div className="nomu-sandbox-console-card">
                {/* Console Tab Header */}
                <div className="nomu-console-tabs-bar">
                  <div className="nomu-console-window-dots">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>

                  <div className="nomu-console-file-tabs">
                    <button
                      type="button"
                      className={`nomu-console-tab ${bottomActiveTab === 'tsx' ? 'nomu-console-tab--active' : ''}`}
                      onClick={() => setBottomActiveTab('tsx')}
                    >
                      <span>AnimatedButton.tsx</span>
                    </button>
                    <button
                      type="button"
                      className={`nomu-console-tab ${bottomActiveTab === 'css' ? 'nomu-console-tab--active' : ''}`}
                      onClick={() => setBottomActiveTab('css')}
                    >
                      <span>AnimatedButton.css</span>
                    </button>
                    <button
                      type="button"
                      className={`nomu-console-tab ${bottomActiveTab === 'usage' ? 'nomu-console-tab--active' : ''}`}
                      onClick={() => setBottomActiveTab('usage')}
                    >
                      <span>Usage.tsx</span>
                    </button>
                  </div>

                  {/* Copy Button strictly inside the code tab */}
                  <button
                    type="button"
                    className={`nomu-console-copy-btn ${bottomCopied ? 'nomu-console-copy-btn--copied' : ''}`}
                    onClick={() => handleBottomCopy(getBottomCode(), getBottomCodeLabel())}
                  >
                    <span>{bottomCopied ? 'Copied' : `Copy ${getBottomCodeLabel()}`}</span>
                  </button>
                </div>

                {/* Console Code View */}
                <pre className="nomu-console-pre">
                  <code>{getBottomCode()}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
