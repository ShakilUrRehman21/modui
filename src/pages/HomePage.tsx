import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { AnimatedButton } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { KineticText } from '../components/ui/motion/KineticText';
import { COMPONENT_REGISTRY } from '../registry/components';
import './HomePage.css';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [promptText, setPromptText] = useState('');

  // Interactive Kinetic Text Studio state
  const [stageKineticText, setStageKineticText] = useState('Modular UI, crafted with character.');
  const [kineticWaveKey, setKineticWaveKey] = useState(0);

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

  const handleBottomCopy = (text: string, _label?: string) => {
    navigator.clipboard.writeText(text);
    setBottomCopied(true);
    setTimeout(() => setBottomCopied(false), 2000);
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
              <div className="nomu-tweak-group" style={{ flex: 1, minWidth: '240px' }}>
                <span className="nomu-tweak-label">Kinetic String:</span>
                <input
                  type="text"
                  className="nomu-tweak-input"
                  style={{ width: '100%', maxWidth: '340px' }}
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
                onClick={() => onNavigate('/components/kinetic-text')}
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

            {/* Card 2: Pulse Badge Indicator */}
            <div className="nomu-featured-card" onClick={() => onNavigate('/components/badge')}>
              <div className="nomu-card-meta-top">
                <span className="nomu-card-cat-badge">Status & Indicators</span>
                <span className="nomu-card-accent-tag">CSS Keyframes</span>
              </div>

              <h3 className="nomu-card-title">Pulse Badge Indicator</h3>
              <p className="nomu-card-description">
                Tactile status indicators and pill badges with breathing ambient pulse auras, live indicator beacons, and semantic tokens.
              </p>

              {/* Live rendered preview directly inside card */}
              <div className="nomu-card-preview-stage" onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                  <Badge
                    variant="accent"
                    dot
                    pulse
                    onClick={() => {
                      confetti({ particleCount: 18, spread: 45 });
                    }}
                  >
                    Live Pulse
                  </Badge>
                  <Badge variant="success" dot>
                    Online
                  </Badge>
                  <Badge variant="cyan">
                    React 19
                  </Badge>
                </div>
              </div>

              <div className="nomu-card-action-bar">
                <span className="nomu-card-cta-link">
                  <span>Inspect & View Code Tabs</span>
                </span>
              </div>
            </div>

            {/* Card 3: Kinetic Typography */}
            <div className="nomu-featured-card" onClick={() => onNavigate('/components/kinetic-text')}>
              <div className="nomu-card-meta-top">
                <span className="nomu-card-cat-badge">Typography & Motion</span>
                <span className="nomu-card-accent-tag">GSAP Wave</span>
              </div>

              <h3 className="nomu-card-title">Kinetic Typography</h3>
              <p className="nomu-card-description">
                Expressive character-level split text interaction with GSAP wave elevation, magnetic hover deflection, and elastic recovery.
              </p>

              {/* Live rendered preview directly inside card */}
              <div className="nomu-card-preview-stage" onClick={(e) => e.stopPropagation()}>
                <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                  <KineticText text="Hover over each letter" interactiveWave={true} />
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

      {/* 5. Senior Developer Architectural Sandbox & Terminal (Much Better Section) */}
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
