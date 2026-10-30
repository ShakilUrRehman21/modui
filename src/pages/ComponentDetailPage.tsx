import React, { useState } from 'react';
import { AnimatedButton } from '../components/ui/button';
import type { ButtonVariant, ButtonSize } from '../components/ui/button';
import { KineticText } from '../components/ui/motion/KineticText';
import { Badge } from '../components/ui/badge';
import { NumberTicker } from '../components/ui/counter';
import { CylindricalCarousel } from '../components/ui/carousel';
import { FloatingDock } from '../components/ui/dock';
import { RadialOrbitHub } from '../components/ui/radial-hub';
import type { RadialOrbitMode, RadialOrbitVariant } from '../components/ui/radial-hub';
import { FluidElasticAccordion } from '../components/ui/accordion';
import type { FluidAccordionOrientation, FluidAccordionVariant, FluidAccordionTrigger, FluidAccordionSpring } from '../components/ui/accordion';
import { BeforeAfterSlider } from '../components/ui/slider';
import type { SliderOrientation, SliderInteraction, SliderVariant } from '../components/ui/slider';
import { RotaryJogWheel } from '../components/ui/rotary';
import type { RotaryWheelVariant, RotaryWheelMode, RotaryDisplayFormat } from '../components/ui/rotary';
import { CyberStreamMatrix } from '../components/ui/matrix';
import type { MatrixVariant, MatrixCharset } from '../components/ui/matrix';
import { CausticRippleSurface } from '../components/ui/caustic-surface';
import type { CausticSurfaceVariant } from '../components/ui/caustic-surface';
import { NeuralClothMesh } from '../components/ui/cloth';
import type { ClothVariant, ClothRenderMode, ClothPinMode } from '../components/ui/cloth';
import { ApertureIrisLens } from '../components/ui/aperture';
import type { ApertureVariant } from '../components/ui/aperture';
import { ChromaticPrismCard } from '../components/ui/prism';
import type { PrismVariant } from '../components/ui/prism';
import { FilmstripGallery } from '../components/ui/filmstrip';
import type { FilmstripVariant } from '../components/ui/filmstrip';
import { CardStack } from '../components/ui/card-stack';
import type { CardStackVariant } from '../components/ui/card-stack';
import { TimelineRoadmap } from '../components/ui/timeline';
import type { TimelineVariant, TimelineOrientation } from '../components/ui/timeline';
import { NeuralGraph } from '../components/ui/neural-graph';
import type { NeuralGraphVariant } from '../components/ui/neural-graph';
import { ReelTapeDeck } from '../components/ui/tape-deck';
import type { ReelTapeDeckVariant, TapeSpeed } from '../components/ui/tape-deck';
import { COMPONENT_REGISTRY } from '../registry/components';
import { trackCopyCode, trackGithubClick, trackPreviewOpen } from '../lib/analytics';
import './ComponentDetailPage.css';

interface ComponentDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ComponentDetailPage: React.FC<ComponentDetailPageProps> = ({
  slug,
  onNavigate,
}) => {
  const component = COMPONENT_REGISTRY.find((c) => c.slug === slug);

  // Playground state for AnimatedButton
  const [btnVariant, setBtnVariant] = useState<ButtonVariant>('shimmer');
  const [btnSize, setBtnSize] = useState<ButtonSize>('md');
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [btnText, setBtnText] = useState('Interactive Action');

  // Playground state for NumberTicker
  const [tickerVal, setTickerVal] = useState(1420);
  const [tickerPrefix, setTickerPrefix] = useState('$');
  const [tickerSuffix, setTickerSuffix] = useState('/mo');
  const [tickerDecimals, setTickerDecimals] = useState(0);
  const [tickerDuration, setTickerDuration] = useState(1.2);

  // Playground state for CylindricalCarousel
  const [carouselRadius, setCarouselRadius] = useState(280);
  const [carouselTilt, setCarouselTilt] = useState(-4);
  const [carouselAutoplay, setCarouselAutoplay] = useState(false);
  const [carouselCount, setCarouselCount] = useState(6);

  // Playground state for FloatingDock
  const [dockVariant, setDockVariant] = useState<'glass' | 'solid' | 'minimal' | 'dark'>('solid');
  const [dockOrientation, setDockOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [dockActiveId, setDockActiveId] = useState('home');

  // Playground state for RadialOrbitHub
  const [orbitRadius, setOrbitRadius] = useState(115);
  const [orbitMode, setOrbitMode] = useState<RadialOrbitMode>('circle');
  const [orbitVariant, setOrbitVariant] = useState<RadialOrbitVariant>('glass');
  const [orbitSound, setOrbitSound] = useState(true);
  const [orbitSelectedLabel, setOrbitSelectedLabel] = useState<string>('None (Click any node)');

  // Playground state for FluidElasticAccordion
  const [accordionOrientation, setAccordionOrientation] = useState<FluidAccordionOrientation>('horizontal');
  const [accordionVariant, setAccordionVariant] = useState<FluidAccordionVariant>('light');
  const [accordionTrigger, setAccordionTrigger] = useState<FluidAccordionTrigger>('click');
  const [accordionSpring, setAccordionSpring] = useState<FluidAccordionSpring>('elastic');
  const [accordionSound, setAccordionSound] = useState(true);
  const [accordionLiquidEdge, setAccordionLiquidEdge] = useState(true);
  const [accordionRatio, setAccordionRatio] = useState(3.4);

  // Playground state for BeforeAfterSlider
  const [sliderOrientation, setSliderOrientation] = useState<SliderOrientation>('horizontal');
  const [sliderMode, setSliderMode] = useState<SliderInteraction>('drag');
  const [sliderVariant, setSliderVariant] = useState<SliderVariant>('light');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [sliderLabels, setSliderLabels] = useState(true);
  const [sliderSound, setSliderSound] = useState(true);

  // Playground state for RotaryJogWheel
  const [rotaryValue, setRotaryValue] = useState(42);
  const [rotaryVariant, setRotaryVariant] = useState<RotaryWheelVariant>('metallic');
  const [rotaryMode, setRotaryMode] = useState<RotaryWheelMode>('bounded');
  const [rotarySize, setRotarySize] = useState<'sm' | 'md' | 'lg'>('md');
  const [rotaryFormat, setRotaryFormat] = useState<RotaryDisplayFormat>('value');
  const [rotarySound, setRotarySound] = useState(true);
  const [rotaryInertia, setRotaryInertia] = useState(true);
  const [rotarySnapping, setRotarySnapping] = useState(false);

  // Playground state for CyberStreamMatrix
  const [matrixVariant, setMatrixVariant] = useState<MatrixVariant>('studio-light');
  const [matrixCharset, setMatrixCharset] = useState<MatrixCharset>('hex');
  const [matrixSpeed, setMatrixSpeed] = useState<number>(0.5);
  const [matrixDensity, setMatrixDensity] = useState<number>(1);
  const [matrixGlow, setMatrixGlow] = useState<boolean>(true);
  const [matrixSound, setMatrixSound] = useState<boolean>(true);

  // Playground state for CausticRippleSurface
  const [causticVariant, setCausticVariant] = useState<CausticSurfaceVariant>('porcelain');
  const [causticDamping, setCausticDamping] = useState<number>(0.98);
  const [causticRefraction, setCausticRefraction] = useState<number>(2.2);
  const [causticDropletRadius, setCausticDropletRadius] = useState<number>(4);
  const [causticRain, setCausticRain] = useState<boolean>(true);
  const [causticSound, setCausticSound] = useState<boolean>(true);

  // Playground state for NeuralClothMesh
  const [clothVariant, setClothVariant] = useState<ClothVariant>('studio-silk');
  const [clothRenderMode, setClothRenderMode] = useState<ClothRenderMode>('wireframe');
  const [clothPinMode, setClothPinMode] = useState<ClothPinMode>('curtain');
  const [clothGravity, setClothGravity] = useState<number>(0.10);
  const [clothWind, setClothWind] = useState<number>(0);
  const [clothStiffness, setClothStiffness] = useState<number>(2);
  const [clothSound, setClothSound] = useState<boolean>(true);

  // Playground state for ApertureIrisLens
  const [apertureVariant, setApertureVariant] = useState<ApertureVariant>('studio-silver');
  const [apertureBlades, setApertureBlades] = useState<number>(9);
  const [apertureValue, setApertureValue] = useState<number>(0.55);
  const [apertureSound, setApertureSound] = useState<boolean>(true);
  const [apertureRing, setApertureRing] = useState<boolean>(true);
  const [apertureFocal, setApertureFocal] = useState<string>('50mm');

  // Playground state for ChromaticPrismCard
  const [prismVariant, setPrismVariant] = useState<PrismVariant>('sapphire-crystal');
  const [prismTilt, setPrismTilt] = useState<number>(14);
  const [prismInteractive, setPrismInteractive] = useState<boolean>(true);
  const [prismSound, setPrismSound] = useState<boolean>(true);
  const [prismTitle, setPrismTitle] = useState<string>('Optical Sapphire Specimen');
  const [prismActionClicked, setPrismActionClicked] = useState<number>(0);

  // Playground state for FilmstripGallery
  const [filmstripVariant, setFilmstripVariant] = useState<FilmstripVariant>('studio-light');
  const [filmstripSprockets, setFilmstripSprockets] = useState<boolean>(true);
  const [filmstripFrameNumbers, setFilmstripFrameNumbers] = useState<boolean>(true);
  const [filmstripSound, setFilmstripSound] = useState<boolean>(true);
  const [filmstripLightbox, setFilmstripLightbox] = useState<boolean>(true);
  const [filmstripActiveFrame, setFilmstripActiveFrame] = useState<string>('Monolith Horizon');

  // Playground state for CardStack
  const [cardStackVariant, setCardStackVariant] = useState<CardStackVariant>('studio-light');
  const [cardStackFanOut, setCardStackFanOut] = useState<boolean>(true);
  const [cardStackSound, setCardStackSound] = useState<boolean>(true);
  const [cardStackActiveTitle, setCardStackActiveTitle] = useState<string>('Fluid Kinetic Springs');

  // Playground state for TimelineRoadmap
  const [timelineVariant, setTimelineVariant] = useState<TimelineVariant>('studio-light');
  const [timelineOrientation, setTimelineOrientation] = useState<TimelineOrientation>('vertical');
  const [timelineSound, setTimelineSound] = useState<boolean>(true);
  const [timelineActiveTitle, setTimelineActiveTitle] = useState<string>('Dynamic Design Tokens');

  // Playground state for NeuralGraph
  const [neuralVariant, setNeuralVariant] = useState<NeuralGraphVariant>('studio-light');
  const [neuralSound, setNeuralSound] = useState<boolean>(true);
  const [neuralAutoPulse, setNeuralAutoPulse] = useState<boolean>(true);
  const [neuralSelectedNodeTitle, setNeuralSelectedNodeTitle] = useState<string>('Semantic Nexus');

  // Playground state for ReelTapeDeck
  const [deckVariant, setDeckVariant] = useState<ReelTapeDeckVariant>('studio-light');
  const [deckSpeed, setDeckSpeed] = useState<TapeSpeed>('15');
  const [deckSound, setDeckSound] = useState<boolean>(true);
  const [deckTransport, setDeckTransport] = useState<string>('stop');

  // File viewer state inside Code tab
  const [selectedFile, setSelectedFile] = useState<'tsx' | 'css' | 'usage'>('tsx');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Main navigation tabs
  const [activeTab, setActiveTab] = useState<'code' | 'props' | 'a11y'>('code');

  if (!component) {
    return (
      <div className="modui-container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Component Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: 'var(--text-sm)' }}>
          The requested module "{slug}" was not found in the catalogue.
        </p>
        <button
          onClick={() => onNavigate('/components')}
          style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--accent-primary)', textDecoration: 'underline' }}
        >
          Return to Components
        </button>
      </div>
    );
  }

  // Copy handler exclusively for inside code tab
  const handleCopyInsideTab = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(selectedFile);
    setTimeout(() => setCopiedKey(null), 2000);

    trackCopyCode({
      component: component.slug,
      file: label || getFileLabel(),
      format: selectedFile === 'css' ? 'css' : selectedFile === 'tsx' ? 'full_component' : 'snippet',
      source: 'component_detail_tab',
    });
  };

  const getActiveCode = () => {
    if (selectedFile === 'tsx') return component.rawSourceCode;
    if (selectedFile === 'css') return component.rawCssCode;
    return component.codeSnippet;
  };

  const getFileLabel = () => {
    if (selectedFile === 'tsx') return `${component.name}.tsx`;
    if (selectedFile === 'css') return `${component.name}.css`;
    return 'Usage.tsx';
  };

  return (
    <div className="modui-detail-page-wrap">
      <div className="modui-container modui-detail-page">
        {/* Breadcrumb */}
        <nav className="modui-breadcrumb" aria-label="Breadcrumb">
          <span className="modui-breadcrumb-link" onClick={() => onNavigate('/')}>
            Overview
          </span>
          <span className="modui-breadcrumb-sep">/</span>
          <span className="modui-breadcrumb-link" onClick={() => onNavigate('/components')}>
            Components
          </span>
          <span className="modui-breadcrumb-sep">/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{component.name}</span>
        </nav>

        {/* Header Info - NO external code copy button here (copy opt ONLY inside tab) */}
        <div className="modui-detail-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <Badge variant="accent">{component.category}</Badge>
              <span className="modui-status-tag">{component.status}</span>
            </div>
            <h1 className="modui-detail-title">{component.name}</h1>
            <p className="modui-detail-desc">{component.description}</p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
            <a
              href={component.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="modui-action-btn-copy"
              title="GitHub Source"
              onClick={() => trackGithubClick({ location: 'component_header', component: component.slug })}
            >
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Interactive Studio Stage */}
        <div className="modui-studio-workbench">
          <div className="modui-canvas-stage">
            {slug === 'animated-button' && (
              <AnimatedButton
                variant={btnVariant}
                size={btnSize}
                loading={btnLoading}
                loadingText="Processing..."
                disabled={btnDisabled}
              >
                {btnText}
              </AnimatedButton>
            )}

            {slug === 'badge' && (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                <Badge variant="accent" dot pulse>
                  Live Radar Pulse
                </Badge>
              </div>
            )}

            {slug === 'kinetic-text' && (
              <div className="modui-detail-kinetic-wrap">
                <KineticText
                  as="h2"
                  text="Crafted with kinetic physics & precision motion."
                  interactiveWave={true}
                />
                <p style={{ marginTop: '1rem', color: '#71717a', fontSize: '0.85rem' }}>
                  Hover cursor across letters to test real-time GSAP wave stagger.
                </p>
              </div>
            )}

            {slug === 'number-ticker' && (
              <div className="modui-detail-ticker-stage">
                <div className="modui-detail-ticker-value">
                  <NumberTicker
                    value={tickerVal}
                    prefix={tickerPrefix}
                    suffix={tickerSuffix}
                    decimalPlaces={tickerDecimals}
                    duration={tickerDuration}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="modui-pill-toggle"
                    onClick={() => setTickerVal((v) => v + 100)}
                  >
                    +100
                  </button>
                  <button
                    type="button"
                    className="modui-pill-toggle"
                    onClick={() => setTickerVal((v) => Math.max(0, v - 50))}
                  >
                    -50
                  </button>
                  <button
                    type="button"
                    className="modui-pill-toggle"
                    onClick={() => setTickerVal(Math.floor(Math.random() * 95000) + 1000)}
                  >
                    Random Integer
                  </button>
                  <button
                    type="button"
                    className="modui-pill-toggle"
                    onClick={() => {
                      setTickerPrefix('$');
                      setTickerSuffix('/mo');
                      setTickerDecimals(0);
                      setTickerVal(1420);
                    }}
                  >
                    $1,420/mo
                  </button>
                  <button
                    type="button"
                    className="modui-pill-toggle"
                    onClick={() => {
                      setTickerPrefix('');
                      setTickerSuffix('%');
                      setTickerDecimals(2);
                      setTickerVal(99.98);
                    }}
                  >
                    99.98%
                  </button>
                </div>
              </div>
            )}

            {slug === 'cylindrical-carousel' && (
              <div style={{ width: '100%', maxWidth: '860px', height: '420px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
                <CylindricalCarousel
                  items={[
                    { id: '1', title: 'Spatial Studio', subtitle: 'Hardware module', tag: 'Core', badge: 'v2.1', color: '#4F46E5' },
                    { id: '2', title: 'Neural Canvas', subtitle: 'Generative shader', tag: 'WebGL', badge: 'New', color: '#06B6D4' },
                    { id: '3', title: 'Haptic Rotary', subtitle: 'Dial encoder', tag: 'Analog', color: '#10B981' },
                    { id: '4', title: 'Vector Oscilloscope', subtitle: 'Waveform telemetry', tag: 'Audio', color: '#F59E0B' },
                    { id: '5', title: 'Kinetic Matrix', subtitle: 'Spring geometry', tag: 'Physics', color: '#8B5CF6' },
                    { id: '6', title: 'Quantum Telemetry', subtitle: 'Atomic clock sync', tag: 'Radio', badge: 'Pro', color: '#EC4899' },
                    { id: '7', title: 'Optical Grid', subtitle: 'Subpixel raster', tag: 'Display', color: '#3B82F6' },
                    { id: '8', title: 'Resonance Filter', subtitle: 'Analog cutoff', tag: 'DSP', color: '#14B8A6' },
                  ].slice(0, carouselCount)}
                  radius={carouselRadius}
                  tiltAngle={carouselTilt}
                  autoplay={carouselAutoplay}
                  autoplaySpeed={8}
                  style={{ minHeight: '420px', height: '420px' }}
                />
              </div>
            )}

            {slug === 'floating-dock' && (
              <div style={{
                width: '100%',
                minHeight: '260px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2.5rem 1rem',
                background: dockVariant === 'dark'
                  ? 'radial-gradient(circle at center, #1E293B 0%, #0F172A 100%)'
                  : 'radial-gradient(circle at center, rgba(54, 92, 245, 0.05) 0%, transparent 70%)',
                borderRadius: '16px',
                transition: 'background 0.3s ease',
              }}>
                <FloatingDock
                  items={[
                    {
                      id: 'home',
                      label: 'Home',
                      shortcut: '⌘1',
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      ),
                    },
                    {
                      id: 'explore',
                      label: 'Explore Components',
                      shortcut: '⌘2',
                      badge: 'New',
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                        </svg>
                      ),
                    },
                    {
                      id: 'layers',
                      label: 'Architecture Layers',
                      shortcut: '⌘3',
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                          <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                          <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                        </svg>
                      ),
                    },
                    {
                      id: 'notifications',
                      label: 'System Telemetry',
                      shortcut: '⌘4',
                      badge: 5,
                      badgeVariant: 'count',
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                        </svg>
                      ),
                    },
                    {
                      id: 'terminal',
                      label: 'Interactive Console',
                      shortcut: '⌘5',
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="4 17 10 11 4 5" />
                          <line x1="12" x2="20" y1="19" y2="19" />
                        </svg>
                      ),
                    },
                    {
                      id: 'settings',
                      label: 'Preferences',
                      shortcut: '⌘,',
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                      ),
                    },
                  ]}
                  activeId={dockActiveId}
                  onSelect={(id) => setDockActiveId(id)}
                  variant={dockVariant}
                  orientation={dockOrientation}
                />
                <div style={{ marginTop: '1.25rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: dockVariant === 'dark' ? '#94A3B8' : 'var(--text-tertiary)' }}>
                  Active Selection: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{dockActiveId}</span>
                </div>
              </div>
            )}

            {/* Stage for RadialOrbitHub */}
            {slug === 'radial-orbit-hub' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '380px', position: 'relative' }}>
                <RadialOrbitHub
                  items={[
                    {
                      id: 'search',
                      label: 'Spotlight Search',
                      shortcut: '⌘K',
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
                      label: 'Layer Stack',
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 2 7 12 12 22 7 12 2" />
                          <polyline points="2 17 12 22 22 17" />
                          <polyline points="2 12 12 17 22 12" />
                        </svg>
                      ),
                    },
                    {
                      id: 'telemetry',
                      label: 'Telemetry Pulse',
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="20" x2="18" y2="10" />
                          <line x1="12" y1="20" x2="12" y2="4" />
                          <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                      ),
                    },
                    {
                      id: 'deploy',
                      label: 'Deploy Module',
                      badge: '99.9%',
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                        </svg>
                      ),
                    },
                    {
                      id: 'settings',
                      label: 'Preferences',
                      shortcut: '⌘,',
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                      ),
                    },
                  ]}
                  radius={orbitRadius}
                  mode={orbitMode}
                  variant={orbitVariant}
                  defaultOpen={false}
                  soundEnabled={orbitSound}
                  onSelect={(item) => setOrbitSelectedLabel(`${item.label} (${item.id})`)}
                />
                <div style={{ marginTop: '2rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                  Last Activated: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{orbitSelectedLabel}</span>
                  <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                    Tip: Drag the orbit ring to spin with rotational momentum, or press Tab / Enter
                  </div>
                </div>
              </div>
            )}

            {/* Stage for FluidElasticAccordion */}
            {slug === 'fluid-elastic-accordion' && (
              <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto', padding: '1rem 0' }}>
                <FluidElasticAccordion
                  items={[
                    {
                      id: 'spatial',
                      number: '01',
                      title: 'Spatial Studio',
                      subtitle: 'Volumetric WebGL 2.0',
                      description: 'Real-time raymarching engine with procedural noise deformation, subsurface caustics, and cinematic bloom.',
                      tag: 'Core 3D',
                      color: '#4F46E5',
                      actionText: 'Explore Shaders',
                    },
                    {
                      id: 'rotary',
                      number: '02',
                      title: 'Haptic Rotary',
                      subtitle: 'Kinetic Dial Controller',
                      description: 'Hardware-grade brushed aluminum rotary jog wheel with angular notch snapping and synthesized micro-haptic audio ticks.',
                      tag: 'Hardware',
                      color: '#06B6D4',
                      actionText: 'Inspect Specs',
                    },
                    {
                      id: 'neural',
                      number: '03',
                      title: 'Neural Matrix',
                      subtitle: 'Spring Inertia Physics',
                      description: 'Adaptive non-linear elastic spring mesh featuring dynamic liquid SVG bezier edge boundary deformation under transition velocity.',
                      tag: 'Physics',
                      color: '#10B981',
                      actionText: 'View Architecture',
                    },
                    {
                      id: 'quantum',
                      number: '04',
                      title: 'Quantum Scope',
                      subtitle: 'Telemetry Waveforms',
                      description: 'Low-latency streaming signal graphs rendering high-frequency oscilloscope channels at fluid 120 FPS.',
                      tag: 'Telemetry',
                      color: '#F59E0B',
                      actionText: 'Launch Monitor',
                    },
                  ]}
                  defaultActiveId="spatial"
                  orientation={accordionOrientation}
                  variant={accordionVariant}
                  trigger={accordionTrigger}
                  springTension={accordionSpring}
                  soundEnabled={accordionSound}
                  enableLiquidEdge={accordionLiquidEdge}
                  expandedRatio={accordionRatio}
                />
              </div>
            )}

            {/* Stage for BeforeAfterSlider */}
            {slug === 'before-after-slider' && (
              <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', padding: '1rem 0' }}>
                <BeforeAfterSlider
                  orientation={sliderOrientation}
                  mode={sliderMode}
                  variant={sliderVariant}
                  position={sliderPosition}
                  onPositionChange={(pos) => setSliderPosition(pos)}
                  showLabels={sliderLabels}
                  soundEnabled={sliderSound}
                  aspectRatio="16 / 10"
                />
                <div style={{ marginTop: '1.5rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                  Divider Position: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{sliderPosition}%</span>
                  <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                    Tip: Drag the tactile handle, hover (if mode allows), or focus and use Arrow / Home / End keys.
                  </div>
                </div>
              </div>
            )}

            {/* Stage for RotaryJogWheel */}
            {slug === 'rotary-jog-wheel' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '380px', padding: '1rem 0' }}>
                <RotaryJogWheel
                  value={rotaryValue}
                  onChange={(val) => setRotaryValue(val)}
                  min={0}
                  max={100}
                  step={1}
                  variant={rotaryVariant}
                  mode={rotaryMode}
                  size={rotarySize}
                  displayFormat={rotaryFormat}
                  soundEnabled={rotarySound}
                  inertia={rotaryInertia}
                  snapping={rotarySnapping}
                  label="Master Output"
                  sublabel="LEVEL"
                />
                <div style={{ marginTop: '2rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                  Current Output: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{rotaryValue}</span>
                  <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                    Tip: Drag wheel circularly, flick with velocity to test momentum inertia, or use Arrow keys. Tap center to reset.
                  </div>
                </div>
              </div>
            )}

            {/* Stage for CyberStreamMatrix */}
            {slug === 'cyber-stream-matrix' && (
              <div style={{ width: '100%', maxWidth: '920px', margin: '0 auto', padding: '1rem 0' }}>
                <CyberStreamMatrix
                  variant={matrixVariant}
                  charset={matrixCharset}
                  speed={matrixSpeed}
                  density={matrixDensity}
                  glow={matrixGlow}
                  soundEnabled={matrixSound}
                  style={{ width: '100%', height: '420px', borderRadius: '12px', boxShadow: '0 12px 36px rgba(0,0,0,0.08)' }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1.5rem 2rem',
                      background: matrixVariant === 'studio-light'
                        ? 'rgba(255, 255, 255, 0.88)'
                        : 'rgba(10, 15, 28, 0.82)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '16px',
                      border: matrixVariant === 'studio-light'
                        ? '1px solid rgba(0, 0, 0, 0.08)'
                        : '1px solid rgba(255, 255, 255, 0.12)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      textAlign: 'center',
                      pointerEvents: 'none',
                      maxWidth: '90%',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        color: 'var(--accent-primary)',
                      }}
                    >
                      STREAM GENERATIVE ENGINE
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: matrixVariant === 'studio-light' ? '#0F172A' : '#F8FAFC',
                      }}
                    >
                      Hover to Repel &bull; Click to Burst
                    </div>
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        margin: 0,
                        color: matrixVariant === 'studio-light' ? '#64748B' : '#94A3B8',
                        maxWidth: '380px',
                        lineHeight: 1.5,
                      }}
                    >
                      Continuous canvas glyph rain with pointer shockwave repulsion physics, particle dissipation, and Web Audio synthesizer chirps.
                    </p>
                  </div>
                </CyberStreamMatrix>
                <div style={{ marginTop: '1.25rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                  Interactive Canvas: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>60 FPS Stream Loop</span>
                  <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                    Tip: Move your cursor across the canvas to disperse glyph columns, click anywhere to trigger a particle shockwave burst, or change themes below.
                  </div>
                </div>
              </div>
            )}

            {/* Stage for CausticRippleSurface */}
            {slug === 'caustic-ripple-surface' && (
              <div style={{ width: '100%', maxWidth: '920px', margin: '0 auto', padding: '1rem 0' }}>
                <CausticRippleSurface
                  variant={causticVariant}
                  damping={causticDamping}
                  refractionStrength={causticRefraction}
                  dropletRadius={causticDropletRadius}
                  rainEnabled={causticRain}
                  soundEnabled={causticSound}
                  style={{ width: '100%', height: '480px', borderRadius: '16px' }}
                />
                <div style={{ marginTop: '1.25rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                  Clean Fluid Surface: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>2D Wave Equation & Caustic Refractor</span>
                  <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                    Tip: Drag cursor to generate smooth wake ripples, click anywhere to drop an acoustic water droplet, or press Spacebar.
                  </div>
                </div>
              </div>
            )}

            {/* Stage for NeuralClothMesh */}
            {slug === 'neural-cloth-mesh' && (
              <div style={{ width: '100%', maxWidth: '920px', margin: '0 auto', padding: '1rem 0' }}>
                <NeuralClothMesh
                  variant={clothVariant}
                  renderMode={clothRenderMode}
                  pinMode={clothPinMode}
                  gravity={clothGravity}
                  windStrength={clothWind}
                  stiffness={clothStiffness}
                  soundEnabled={clothSound}
                  style={{ width: '100%', height: '480px', borderRadius: '16px' }}
                />
                <div style={{ marginTop: '1.25rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                  Verlet Continuum: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Structural Spring Lattice</span>
                  <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                    Tip: Drag through the fabric to billow the silk with aerodynamic wind wake, click or press Spacebar to inject a resonant wave impulse.
                  </div>
                </div>
              </div>
            )}

            {/* Stage for ApertureIrisLens */}
            {slug === 'aperture-iris-lens' && (
              <div style={{ width: '100%', maxWidth: '780px', margin: '0 auto', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ApertureIrisLens
                  variant={apertureVariant}
                  bladesCount={apertureBlades}
                  value={apertureValue}
                  onChange={(val) => setApertureValue(val)}
                  soundEnabled={apertureSound}
                  showRing={apertureRing}
                  focalLength={apertureFocal}
                />
                <div style={{ marginTop: '1.75rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                  Mechanical Iris Barrel: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Trigonometric Blade Overlap</span>
                  <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                    Tip: Drag along the outer knurled ring to scrub aperture opening with rotary angle tracking, click f-stop step presets, or use Arrow keys.
                  </div>
                </div>
              </div>
            )}

            {/* Stage for ChromaticPrismCard */}
            {slug === 'chromatic-prism-card' && (
              <div style={{ width: '100%', maxWidth: '520px', margin: '0 auto', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ChromaticPrismCard
                  variant={prismVariant}
                  title={prismTitle}
                  maxTilt={prismTilt}
                  interactive={prismInteractive}
                  soundEnabled={prismSound}
                  onAction={() => setPrismActionClicked((c) => c + 1)}
                />
                <div style={{ marginTop: '1.75rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                  Optical Quartz Specimen: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>3D Gyro Tilt & Spectral Dispersion</span>
                  <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                    Tip: Move your cursor across the card surface to cast dynamic incident glare, observe RGB chromatic caustics, or click Inspect Specimen ({prismActionClicked} activations).
                  </div>
                </div>
              </div>
            )}

            {/* Stage for FilmstripGallery */}
            {slug === 'filmstrip-gallery' && (
              <div style={{ width: '100%', maxWidth: '1080px', margin: '0 auto', padding: '1.25rem 0', display: 'flex', flexDirection: 'column' }}>
                <FilmstripGallery
                  variant={filmstripVariant}
                  showSprockets={filmstripSprockets}
                  showFrameNumbers={filmstripFrameNumbers}
                  soundEnabled={filmstripSound}
                  enableLightbox={filmstripLightbox}
                  onFrameSelect={(item) => setFilmstripActiveFrame(item.title)}
                />
                <div style={{ marginTop: '1.25rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                  35mm Cinematography Reel: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{filmstripActiveFrame}</span>
                  <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                    Drag horizontally to scrub the reel. Click any frame to inspect in lightbox modal.
                  </div>
                </div>
              </div>
            )}

            {/* Stage for CardStack */}
            {slug === 'card-stack' && (
              <div style={{ width: '100%', maxWidth: '540px', margin: '0 auto', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CardStack
                  variant={cardStackVariant}
                  fanOutOnHover={cardStackFanOut}
                  soundEnabled={cardStackSound}
                  onCardChange={(item) => setCardStackActiveTitle(item.title)}
                />
                <div style={{ marginTop: '1.25rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                  Active Deck Card: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{cardStackActiveTitle}</span>
                  <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                    Click the top card or press Space / Arrow keys to cycle through the stack. Hover over the deck to fan out.
                  </div>
                </div>
              </div>
            )}

            {/* Stage for TimelineRoadmap */}
            {slug === 'timeline-roadmap' && (
              <div style={{ width: '100%', maxWidth: timelineOrientation === 'vertical' ? '560px' : '900px', margin: '0 auto', padding: '1.5rem 0', display: 'flex', flexDirection: 'column' }}>
                <TimelineRoadmap
                  variant={timelineVariant}
                  orientation={timelineOrientation}
                  soundEnabled={timelineSound}
                  onSelectMilestone={(item) => setTimelineActiveTitle(item.title)}
                />
                <div style={{ marginTop: '1.5rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                  Active Milestone: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{timelineActiveTitle}</span>
                  <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                    Click any milestone node or card, or use keyboard arrow keys to navigate the continuous progress spine.
                  </div>
                </div>
              </div>
            )}

            {/* Stage for NeuralGraph */}
            {/* Stage for ReelTapeDeck */}
            {slug === 'reel-tape-deck' && (
              <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', padding: '1rem 0', display: 'flex', flexDirection: 'column' }}>
                <ReelTapeDeck
                  variant={deckVariant}
                  speed={deckSpeed}
                  soundEnabled={deckSound}
                  onTransportChange={(state) => setDeckTransport(state)}
                />
                <div style={{ marginTop: '1.25rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                  Transport Status: <span style={{ color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>{deckTransport}</span>
                  <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                    Click PLAY, REW, FFWD or drag either tape spool directly to scrub audio. Watch the twin ballistic VU meters dance in real time.
                  </div>
                </div>
              </div>
            )}

            {slug === 'neural-graph' && (
              <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto', padding: '1rem 0', display: 'flex', flexDirection: 'column' }}>
                <NeuralGraph
                  variant={neuralVariant}
                  soundEnabled={neuralSound}
                  autoPulse={neuralAutoPulse}
                  onSelectNode={(node) => setNeuralSelectedNodeTitle(node ? node.label : 'None')}
                />
                <div style={{ marginTop: '1.25rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                  Focused Node: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{neuralSelectedNodeTitle}</span>
                  <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                    Drag nodes to stretch spring constraints, click nodes to fire synaptic action potentials, or drag canvas background to pan & wheel to zoom.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Playground Controls for Button */}
          {slug === 'animated-button' && (
            <div className="modui-controls-panel">
              <div className="modui-control-group">
                <label className="modui-control-label">Variant</label>
                <select
                  className="modui-control-select"
                  value={btnVariant}
                  onChange={(e) => setBtnVariant(e.target.value as ButtonVariant)}
                >
                  <option value="shimmer">shimmer</option>
                  <option value="glow">glow</option>
                  <option value="ripple">ripple</option>
                  <option value="magnetic">magnetic</option>
                  <option value="slide">slide</option>
                  <option value="gradient-border">gradient-border</option>
                  <option value="minimal">minimal</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Size</label>
                <select
                  className="modui-control-select"
                  value={btnSize}
                  onChange={(e) => setBtnSize(e.target.value as ButtonSize)}
                >
                  <option value="sm">sm (32px)</option>
                  <option value="md">md (40px)</option>
                  <option value="lg">lg (48px)</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Label</label>
                <input
                  type="text"
                  className="modui-control-input"
                  value={btnText}
                  onChange={(e) => setBtnText(e.target.value)}
                />
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">States</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={btnLoading}
                      onChange={(e) => setBtnLoading(e.target.checked)}
                    />
                    <span>Loading state</span>
                  </label>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={btnDisabled}
                      onChange={(e) => setBtnDisabled(e.target.checked)}
                    />
                    <span>Disabled state</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Playground Controls for NumberTicker */}
          {slug === 'number-ticker' && (
            <div className="modui-controls-panel">
              <div className="modui-control-group">
                <label className="modui-control-label">Target Value</label>
                <input
                  type="number"
                  className="modui-control-input"
                  value={tickerVal}
                  onChange={(e) => setTickerVal(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Prefix</label>
                <input
                  type="text"
                  className="modui-control-input"
                  value={tickerPrefix}
                  onChange={(e) => setTickerPrefix(e.target.value)}
                  placeholder="e.g. $"
                />
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Suffix</label>
                <input
                  type="text"
                  className="modui-control-input"
                  value={tickerSuffix}
                  onChange={(e) => setTickerSuffix(e.target.value)}
                  placeholder="e.g. % or /mo"
                />
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Decimals</label>
                <select
                  className="modui-control-select"
                  value={tickerDecimals}
                  onChange={(e) => setTickerDecimals(parseInt(e.target.value, 10))}
                >
                  <option value={0}>0 (Whole numbers)</option>
                  <option value={1}>1 (e.g. 4.5)</option>
                  <option value={2}>2 (e.g. 99.98)</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Duration ({tickerDuration}s)</label>
                <input
                  type="range"
                  min="0.4"
                  max="3.0"
                  step="0.2"
                  value={tickerDuration}
                  onChange={(e) => setTickerDuration(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>
            </div>
          )}

          {/* Playground Controls for CylindricalCarousel */}
          {slug === 'cylindrical-carousel' && (
            <div className="modui-controls-panel">
              <div className="modui-control-group">
                <label className="modui-control-label">Items Count ({carouselCount})</label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {[4, 6, 8].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      className={`modui-pill-toggle ${carouselCount === cnt ? 'modui-pill-toggle--active' : ''}`}
                      onClick={() => setCarouselCount(cnt)}
                    >
                      {cnt} Cards
                    </button>
                  ))}
                </div>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">3D Radius ({carouselRadius}px)</label>
                <input
                  type="range"
                  min="200"
                  max="360"
                  step="10"
                  value={carouselRadius}
                  onChange={(e) => setCarouselRadius(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Tilt Pitch ({carouselTilt}°)</label>
                <input
                  type="range"
                  min="-15"
                  max="15"
                  step="1"
                  value={carouselTilt}
                  onChange={(e) => setCarouselTilt(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Physics & Motion</label>
                <label className="modui-control-toggle">
                  <input
                    type="checkbox"
                    checked={carouselAutoplay}
                    onChange={(e) => setCarouselAutoplay(e.target.checked)}
                  />
                  <span>Continuous Orbit</span>
                </label>
              </div>
            </div>
          )}

          {/* Playground Controls for FloatingDock */}
          {slug === 'floating-dock' && (
            <div className="modui-controls-panel">
              <div className="modui-control-group">
                <label className="modui-control-label">Surface Shell</label>
                <select
                  className="modui-control-select"
                  value={dockVariant}
                  onChange={(e) => setDockVariant(e.target.value as any)}
                >
                  <option value="glass">Frosted Glass (Light)</option>
                  <option value="dark">Dark Obsidian Glass</option>
                  <option value="solid">Crisp Solid Surface</option>
                  <option value="minimal">Minimal Wireframe</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Orientation</label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {(['horizontal', 'vertical'] as const).map((orient) => (
                    <button
                      key={orient}
                      type="button"
                      className={`modui-pill-toggle ${dockOrientation === orient ? 'modui-pill-toggle--active' : ''}`}
                      onClick={() => setDockOrientation(orient)}
                    >
                      {orient.charAt(0).toUpperCase() + orient.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Playground Controls for RadialOrbitHub */}
          {slug === 'radial-orbit-hub' && (
            <div className="modui-controls-panel">
              <div className="modui-control-group">
                <label className="modui-control-label">Surface Shell</label>
                <select
                  className="modui-control-select"
                  value={orbitVariant}
                  onChange={(e) => setOrbitVariant(e.target.value as RadialOrbitVariant)}
                >
                  <option value="glass">Frosted Glass (Light)</option>
                  <option value="dark">Dark Obsidian Glass</option>
                  <option value="neon">Cyber Neon Glow</option>
                  <option value="minimal">Minimal Wireframe</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Distribution Mode</label>
                <select
                  className="modui-control-select"
                  value={orbitMode}
                  onChange={(e) => setOrbitMode(e.target.value as RadialOrbitMode)}
                >
                  <option value="circle">Full 360° Circle</option>
                  <option value="fan-top">Fan Top (180°)</option>
                  <option value="fan-bottom">Fan Bottom (180°)</option>
                  <option value="fan-right">Fan Right (180°)</option>
                  <option value="fan-left">Fan Left (180°)</option>
                  <option value="quarter">Quarter Arc (90°)</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Orbit Radius ({orbitRadius}px)</label>
                <input
                  type="range"
                  min="85"
                  max="155"
                  step="5"
                  value={orbitRadius}
                  onChange={(e) => setOrbitRadius(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Synthesized Haptic Audio</label>
                <label className="modui-control-toggle">
                  <input
                    type="checkbox"
                    checked={orbitSound}
                    onChange={(e) => setOrbitSound(e.target.checked)}
                  />
                  <span>Web Audio Mechanical Clicks</span>
                </label>
              </div>
            </div>
          )}

          {/* Playground Controls for FluidElasticAccordion */}
          {slug === 'fluid-elastic-accordion' && (
            <div className="modui-controls-panel">
              <div className="modui-control-group">
                <label className="modui-control-label">Layout Orientation</label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {(['horizontal', 'vertical'] as const).map((orient) => (
                    <button
                      key={orient}
                      type="button"
                      className={`modui-pill-toggle ${accordionOrientation === orient ? 'modui-pill-toggle--active' : ''}`}
                      onClick={() => setAccordionOrientation(orient)}
                    >
                      {orient === 'horizontal' ? 'Horizontal Filmstrip' : 'Vertical Stack'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Surface Skin</label>
                <select
                  className="modui-control-select"
                  value={accordionVariant}
                  onChange={(e) => setAccordionVariant(e.target.value as FluidAccordionVariant)}
                >
                  <option value="light">Crisp Light Studio</option>
                  <option value="dark">Dark Obsidian</option>
                  <option value="glass">Frosted Translucent Glass</option>
                  <option value="editorial">Warm Titanium Editorial</option>
                  <option value="minimal">Minimal Monochrome</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Interaction Trigger</label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {(['click', 'hover'] as const).map((trig) => (
                    <button
                      key={trig}
                      type="button"
                      className={`modui-pill-toggle ${accordionTrigger === trig ? 'modui-pill-toggle--active' : ''}`}
                      onClick={() => setAccordionTrigger(trig)}
                    >
                      {trig.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Spring Tension Physics</label>
                <select
                  className="modui-control-select"
                  value={accordionSpring}
                  onChange={(e) => setAccordionSpring(e.target.value as FluidAccordionSpring)}
                >
                  <option value="elastic">Elastic Bounce (0.65s)</option>
                  <option value="snappy">Snappy Linear (0.42s)</option>
                  <option value="gentle">Gentle Cinematic (0.85s)</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Expansion Ratio ({accordionRatio}x)</label>
                <input
                  type="range"
                  min="2.0"
                  max="5.0"
                  step="0.2"
                  value={accordionRatio}
                  onChange={(e) => setAccordionRatio(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Liquid Edge & Acoustics</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={accordionLiquidEdge}
                      onChange={(e) => setAccordionLiquidEdge(e.target.checked)}
                    />
                    <span>Liquid Bezier Boundary Wave</span>
                  </label>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={accordionSound}
                      onChange={(e) => setAccordionSound(e.target.checked)}
                    />
                    <span>Web Audio Micro-Haptics</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Playground Controls for BeforeAfterSlider */}
          {slug === 'before-after-slider' && (
            <div className="modui-controls-panel">
              <div className="modui-control-group">
                <label className="modui-control-label">Orientation</label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {(['horizontal', 'vertical'] as const).map((orient) => (
                    <button
                      key={orient}
                      type="button"
                      className={`modui-pill-toggle ${sliderOrientation === orient ? 'modui-pill-toggle--active' : ''}`}
                      onClick={() => setSliderOrientation(orient)}
                    >
                      {orient.charAt(0).toUpperCase() + orient.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Interaction Mode</label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {(['drag', 'hover', 'both'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`modui-pill-toggle ${sliderMode === m ? 'modui-pill-toggle--active' : ''}`}
                      onClick={() => setSliderMode(m)}
                    >
                      {m.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Surface Skin</label>
                <select
                  className="modui-control-select"
                  value={sliderVariant}
                  onChange={(e) => setSliderVariant(e.target.value as SliderVariant)}
                >
                  <option value="light">Crisp Light Studio</option>
                  <option value="dark">Dark Obsidian</option>
                  <option value="glass">Frosted Glass</option>
                  <option value="minimal">Minimal Monoline</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Divider Position ({sliderPosition}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Toggles & Feedback</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={sliderLabels}
                      onChange={(e) => setSliderLabels(e.target.checked)}
                    />
                    <span>Corner Badges (Before / After)</span>
                  </label>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={sliderSound}
                      onChange={(e) => setSliderSound(e.target.checked)}
                    />
                    <span>Center Snap Acoustic Tick</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Playground Controls for RotaryJogWheel */}
          {slug === 'rotary-jog-wheel' && (
            <div className="modui-controls-panel">
              <div className="modui-control-group">
                <label className="modui-control-label">Surface Skin</label>
                <select
                  className="modui-control-select"
                  value={rotaryVariant}
                  onChange={(e) => setRotaryVariant(e.target.value as RotaryWheelVariant)}
                >
                  <option value="metallic">Machined Silver Aluminum</option>
                  <option value="dark">Stealth Dark Obsidian</option>
                  <option value="glass">Luminous Studio Glass</option>
                  <option value="minimal">Minimal Monoline</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Rotation Mode</label>
                <select
                  className="modui-control-select"
                  value={rotaryMode}
                  onChange={(e) => setRotaryMode(e.target.value as RotaryWheelMode)}
                >
                  <option value="bounded">Bounded (300° Arc Limit)</option>
                  <option value="continuous">Continuous (Infinite 360° Scrub)</option>
                  <option value="bipolar">Bipolar (Center-Zero Balance)</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Wheel Size</label>
                <div style={{ display: 'flex', gap: '0.35rem', width: '100%' }}>
                  {[
                    { id: 'sm', label: 'SM (148px)' },
                    { id: 'md', label: 'MD (196px)' },
                    { id: 'lg', label: 'LG (248px)' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`modui-pill-toggle ${rotarySize === s.id ? 'modui-pill-toggle--active' : ''}`}
                      onClick={() => setRotarySize(s.id as 'sm' | 'md' | 'lg')}
                      style={{ flex: 1, padding: '0.45rem 0.25rem', textAlign: 'center', fontSize: '0.75rem', minWidth: 0, whiteSpace: 'nowrap' }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Center Readout Format</label>
                <select
                  className="modui-control-select"
                  value={rotaryFormat}
                  onChange={(e) => setRotaryFormat(e.target.value as RotaryDisplayFormat)}
                >
                  <option value="value">Numeric Value (0-100)</option>
                  <option value="percent">Percentage (%)</option>
                  <option value="degrees">Radial Degrees (°)</option>
                  <option value="timecode">Scrub Timecode (MM:SS:FF)</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Value Position ({rotaryValue})</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={rotaryValue}
                  onChange={(e) => setRotaryValue(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Physics & Haptics</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={rotarySound}
                      onChange={(e) => setRotarySound(e.target.checked)}
                    />
                    <span>Web Audio Mechanical Ticks</span>
                  </label>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={rotaryInertia}
                      onChange={(e) => setRotaryInertia(e.target.checked)}
                    />
                    <span>Rotational Momentum Inertia</span>
                  </label>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={rotarySnapping}
                      onChange={(e) => setRotarySnapping(e.target.checked)}
                    />
                    <span>Detent Notch Snapping</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Playground Controls for CyberStreamMatrix */}
          {slug === 'cyber-stream-matrix' && (
            <div className="modui-controls-panel">
              <div className="modui-control-group">
                <label className="modui-control-label">Surface Skin</label>
                <select
                  className="modui-control-select"
                  value={matrixVariant}
                  onChange={(e) => setMatrixVariant(e.target.value as MatrixVariant)}
                >
                  <option value="studio-light">Studio Light (Cobalt on Off-White)</option>
                  <option value="dark-obsidian">Dark Obsidian (Cyber Cyan)</option>
                  <option value="emerald">Emerald Matrix (Classic Neon)</option>
                  <option value="blueprint">Blueprint Technical (Deep Navy)</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Character Glyph Set</label>
                <div style={{ display: 'flex', gap: '0.35rem', width: '100%' }}>
                  {(['matrix', 'binary', 'hex', 'ascii'] as const).map((cs) => (
                    <button
                      key={cs}
                      type="button"
                      className={`modui-pill-toggle ${matrixCharset === cs ? 'modui-pill-toggle--active' : ''}`}
                      onClick={() => setMatrixCharset(cs)}
                      style={{ flex: 1, padding: '0.45rem 0.25rem', textAlign: 'center', fontSize: '0.75rem', minWidth: 0, textTransform: 'uppercase' }}
                    >
                      {cs}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Rain Velocity ({matrixSpeed}x)</label>
                <input
                  type="range"
                  min="0.4"
                  max="2.5"
                  step="0.1"
                  value={matrixSpeed}
                  onChange={(e) => setMatrixSpeed(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Stream Density ({matrixDensity}x)</label>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.1"
                  value={matrixDensity}
                  onChange={(e) => setMatrixDensity(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Optics & Audio</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={matrixGlow}
                      onChange={(e) => setMatrixGlow(e.target.checked)}
                    />
                    <span>Lead Glyph Bloom Glow</span>
                  </label>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={matrixSound}
                      onChange={(e) => setMatrixSound(e.target.checked)}
                    />
                    <span>Web Audio Particle Chirps</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Playground Controls for CausticRippleSurface */}
          {slug === 'caustic-ripple-surface' && (
            <div className="modui-controls-panel">
              <div className="modui-control-group">
                <label className="modui-control-label">Liquid Surface Skin</label>
                <select
                  className="modui-control-select"
                  value={causticVariant}
                  onChange={(e) => setCausticVariant(e.target.value as CausticSurfaceVariant)}
                >
                  <option value="porcelain">Studio Porcelain (Daylight Clear)</option>
                  <option value="crystal-lake">Crystal Lake (Pure Aquamarine)</option>
                  <option value="dark-obsidian">Dark Obsidian (Deep Midnight)</option>
                  <option value="amber-spring">Amber Spring (Golden Sunlight)</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Viscosity Damping ({causticDamping})</label>
                <input
                  type="range"
                  min="0.94"
                  max="0.995"
                  step="0.005"
                  value={causticDamping}
                  onChange={(e) => setCausticDamping(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Caustic Refraction ({causticRefraction}x)</label>
                <input
                  type="range"
                  min="1.0"
                  max="4.0"
                  step="0.2"
                  value={causticRefraction}
                  onChange={(e) => setCausticRefraction(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Droplet Scale ({causticDropletRadius}px)</label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="1"
                  value={causticDropletRadius}
                  onChange={(e) => setCausticDropletRadius(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Fluid Acoustics & Rain</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={causticRain}
                      onChange={(e) => setCausticRain(e.target.checked)}
                    />
                    <span>Ambient Idle Raindrops</span>
                  </label>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={causticSound}
                      onChange={(e) => setCausticSound(e.target.checked)}
                    />
                    <span>Web Audio Droplet Plinks</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Playground Controls for NeuralClothMesh */}
          {slug === 'neural-cloth-mesh' && (
            <div className="modui-controls-panel">
              <div className="modui-control-group">
                <label className="modui-control-label">Surface Material</label>
                <select
                  className="modui-control-select"
                  value={clothVariant}
                  onChange={(e) => setClothVariant(e.target.value as ClothVariant)}
                >
                  <option value="studio-silk">Studio Silk (Porcelain / Cobalt)</option>
                  <option value="liquid-gold">Liquid Gold (Champagne / Bronze)</option>
                  <option value="dark-obsidian">Dark Obsidian (Titanium / Cyan)</option>
                  <option value="emerald-aurora">Emerald Aurora (Mint / Forest)</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Rendering Technique</label>
                <div style={{ display: 'flex', gap: '0.35rem', width: '100%' }}>
                  {(['shaded', 'wireframe', 'hybrid'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      className={`modui-pill-toggle ${clothRenderMode === mode ? 'modui-pill-toggle--active' : ''}`}
                      onClick={() => setClothRenderMode(mode)}
                      style={{ flex: 1, padding: '0.45rem 0.25rem', textAlign: 'center', fontSize: '0.75rem', minWidth: 0, textTransform: 'capitalize' }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Anchor Tether Mode</label>
                <select
                  className="modui-control-select"
                  value={clothPinMode}
                  onChange={(e) => setClothPinMode(e.target.value as ClothPinMode)}
                >
                  <option value="top-edge">Top Edge Suspended (Banner)</option>
                  <option value="corners">Corner Pins (Hammock / Flag)</option>
                  <option value="curtain">Periodic Draped (Curtain Pleats)</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Breeze Wind ({clothWind.toFixed(2)}x)</label>
                <input
                  type="range"
                  min="0.0"
                  max="1.2"
                  step="0.05"
                  value={clothWind}
                  onChange={(e) => setClothWind(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Gravity Vector ({clothGravity.toFixed(2)})</label>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={clothGravity}
                  onChange={(e) => setClothGravity(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Acoustics & Sound</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={clothSound}
                      onChange={(e) => setClothSound(e.target.checked)}
                    />
                    <span>Web Audio Breeze Resonance</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Playground Controls for ApertureIrisLens */}
          {slug === 'aperture-iris-lens' && (
            <div className="modui-controls-panel">
              <div className="modui-control-group">
                <label className="modui-control-label">Barrel & Blade Finish</label>
                <select
                  className="modui-control-select"
                  value={apertureVariant}
                  onChange={(e) => setApertureVariant(e.target.value as ApertureVariant)}
                >
                  <option value="studio-silver">Studio Silver (Machined Anodized)</option>
                  <option value="matte-obsidian">Matte Obsidian (Stealth Graphite)</option>
                  <option value="classic-brass">Classic Brass (Vintage Leica)</option>
                  <option value="cyber-neon">Cyber Neon (Sci-Fi Holographic)</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Aperture Ratio ({(apertureValue * 100).toFixed(0)}%)</label>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.01"
                  value={apertureValue}
                  onChange={(e) => setApertureValue(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Iris Blades ({apertureBlades})</label>
                <input
                  type="range"
                  min="6"
                  max="14"
                  step="1"
                  value={apertureBlades}
                  onChange={(e) => setApertureBlades(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Focal Engraving</label>
                <select
                  className="modui-control-select"
                  value={apertureFocal}
                  onChange={(e) => setApertureFocal(e.target.value)}
                >
                  <option value="35mm">35mm f/1.4 Summilux</option>
                  <option value="50mm">50mm f/1.4 Noctilux</option>
                  <option value="85mm">85mm f/1.4 Portrait Master</option>
                  <option value="135mm">135mm f/1.8 Telephoto</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Mechanics & Audio</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={apertureSound}
                      onChange={(e) => setApertureSound(e.target.checked)}
                    />
                    <span>Web Audio Leaf Ratchet Clicks</span>
                  </label>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={apertureRing}
                      onChange={(e) => setApertureRing(e.target.checked)}
                    />
                    <span>Machined Barrel Ring & Degree Ticks</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Playground Controls for ChromaticPrismCard */}
          {slug === 'chromatic-prism-card' && (
            <div className="modui-controls-panel">
              <div className="modui-control-group">
                <label className="modui-control-label">Mineral Crystal Finish</label>
                <select
                  className="modui-control-select"
                  value={prismVariant}
                  onChange={(e) => setPrismVariant(e.target.value as PrismVariant)}
                >
                  <option value="sapphire-crystal">Sapphire Crystal (Studio Daylight Silica)</option>
                  <option value="obsidian-prism">Obsidian Prism (Stealth Space Graphite)</option>
                  <option value="amber-quartz">Amber Quartz (Warm Champagne Mineral)</option>
                  <option value="emerald-matrix">Emerald Matrix (Luminescent Jade)</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Perspective Max Tilt ({prismTilt}°)</label>
                <input
                  type="range"
                  min="4"
                  max="26"
                  step="1"
                  value={prismTilt}
                  onChange={(e) => setPrismTilt(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Specimen Headline</label>
                <input
                  type="text"
                  className="modui-control-input"
                  value={prismTitle}
                  onChange={(e) => setPrismTitle(e.target.value)}
                  placeholder="Enter title..."
                />
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Optics & Haptics</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={prismInteractive}
                      onChange={(e) => setPrismInteractive(e.target.checked)}
                    />
                    <span>Pointer-Tracking Gyro Tilt</span>
                  </label>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={prismSound}
                      onChange={(e) => setPrismSound(e.target.checked)}
                    />
                    <span>Web Audio Crystal Glass Chime</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Playground Controls for FilmstripGallery */}
          {slug === 'filmstrip-gallery' && (
            <div className="modui-controls-panel">
              <div className="modui-control-group">
                <label className="modui-control-label">Emulsion & Atmosphere Finish</label>
                <select
                  className="modui-control-select"
                  value={filmstripVariant}
                  onChange={(e) => setFilmstripVariant(e.target.value as FilmstripVariant)}
                >
                  <option value="studio-light">Studio Light (ModUI Signature)</option>
                  <option value="warm-editorial">Warm Editorial (Linen & Coral)</option>
                  <option value="minimal-mono">Minimal Mono (High Contrast)</option>
                  <option value="cinema-dark">Cinema Dark (35mm Noir)</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Reel Aesthetics & Overlays</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={filmstripSprockets}
                      onChange={(e) => setFilmstripSprockets(e.target.checked)}
                    />
                    <span>Perforated 35mm Sprocket Borders</span>
                  </label>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={filmstripFrameNumbers}
                      onChange={(e) => setFilmstripFrameNumbers(e.target.checked)}
                    />
                    <span>Frame Index Numbers & 24 FPS Sync</span>
                  </label>

                </div>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Inspection & Acoustics</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={filmstripLightbox}
                      onChange={(e) => setFilmstripLightbox(e.target.checked)}
                    />
                    <span>Full-Bleed Modal Lightbox Inspection</span>
                  </label>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={filmstripSound}
                      onChange={(e) => setFilmstripSound(e.target.checked)}
                    />
                    <span>Synthesized Sprocket & Shutter Haptics</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Playground Controls for CardStack */}
          {slug === 'card-stack' && (
            <div className="modui-controls-panel">
              <div className="modui-control-group">
                <label className="modui-control-label">Surface Finish</label>
                <select
                  className="modui-control-select"
                  value={cardStackVariant}
                  onChange={(e) => setCardStackVariant(e.target.value as CardStackVariant)}
                >
                  <option value="studio-light">Studio Light (ModUI Standard)</option>
                  <option value="warm-editorial">Warm Editorial (Linen & Coral)</option>
                  <option value="glass-frost">Glass Frost (Specular Blur)</option>
                  <option value="cinema-dark">Cinema Dark (35mm Slate)</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Physics & Motion</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={cardStackFanOut}
                      onChange={(e) => setCardStackFanOut(e.target.checked)}
                    />
                    <span>Rotational Fan Spread on Hover</span>
                  </label>
                </div>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Acoustics</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={cardStackSound}
                      onChange={(e) => setCardStackSound(e.target.checked)}
                    />
                    <span>Web Audio Paper Flick Haptics</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Playground Controls for TimelineRoadmap */}
          {slug === 'timeline-roadmap' && (
            <div className="modui-controls-panel">
              <div className="modui-control-group">
                <label className="modui-control-label">Surface Finish</label>
                <select
                  className="modui-control-select"
                  value={timelineVariant}
                  onChange={(e) => setTimelineVariant(e.target.value as TimelineVariant)}
                >
                  <option value="studio-light">Studio Light (ModUI Standard)</option>
                  <option value="warm-editorial">Warm Editorial (Linen & Coral)</option>
                  <option value="minimal-mono">Minimal Mono (High Contrast)</option>
                  <option value="cinema-dark">Cinema Dark (35mm Slate)</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Layout Flow</label>
                <select
                  className="modui-control-select"
                  value={timelineOrientation}
                  onChange={(e) => setTimelineOrientation(e.target.value as TimelineOrientation)}
                >
                  <option value="vertical">Vertical (Changelog Stream)</option>
                  <option value="horizontal">Horizontal (Roadmap Track)</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Acoustics</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={timelineSound}
                      onChange={(e) => setTimelineSound(e.target.checked)}
                    />
                    <span>Web Audio Latch Haptics</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Playground Controls for ReelTapeDeck */}
          {slug === 'reel-tape-deck' && (
            <div className="modui-controls-panel">
              <div className="modui-control-group">
                <label className="modui-control-label">Chassis Finish</label>
                <select
                  className="modui-control-select"
                  value={deckVariant}
                  onChange={(e) => setDeckVariant(e.target.value as ReelTapeDeckVariant)}
                >
                  <option value="studio-light">Studio Light (ModUI Cream & Cobalt)</option>
                  <option value="dark-slate">Dark Slate (Mastering Suite)</option>
                  <option value="warm-editorial">Warm Editorial (Linen & Brass)</option>
                  <option value="minimal-mono">Minimal Mono (Dieter Rams Bauhaus)</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Tape Speed (IPS)</label>
                <select
                  className="modui-control-select"
                  value={deckSpeed}
                  onChange={(e) => setDeckSpeed(e.target.value as TapeSpeed)}
                >
                  <option value="15">15 IPS (Studio High-Fidelity)</option>
                  <option value="7.5">7.5 IPS (Standard Reel)</option>
                  <option value="3.75">3.75 IPS (Extended Play)</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Acoustics</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={deckSound}
                      onChange={(e) => setDeckSound(e.target.checked)}
                    />
                    <span>Web Audio Capstan & Solenoids</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Playground Controls for NeuralGraph */}
          {slug === 'neural-graph' && (
            <div className="modui-controls-panel">
              <div className="modui-control-group">
                <label className="modui-control-label">Surface Finish</label>
                <select
                  className="modui-control-select"
                  value={neuralVariant}
                  onChange={(e) => setNeuralVariant(e.target.value as NeuralGraphVariant)}
                >
                  <option value="studio-light">Studio Light (ModUI Standard)</option>
                  <option value="dark-slate">Dark Slate (Cyber Graphite)</option>
                  <option value="warm-editorial">Warm Editorial (Linen & Terracotta)</option>
                  <option value="quantum-violet">Quantum Violet (Bioluminescent)</option>
                </select>
              </div>

              <div className="modui-control-group">
                <label className="modui-control-label">Acoustics & Simulation</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={neuralSound}
                      onChange={(e) => setNeuralSound(e.target.checked)}
                    />
                    <span>Web Audio Micro-Tonal Chimes</span>
                  </label>
                  <label className="modui-control-toggle">
                    <input
                      type="checkbox"
                      checked={neuralAutoPulse}
                      onChange={(e) => setNeuralAutoPulse(e.target.checked)}
                    />
                    <span>Ambient Synapse Pulses</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Tabs Navigation */}
          <div className="modui-detail-tabs-bar" role="tablist">
            <button
              className={`modui-detail-tab-btn ${activeTab === 'code' ? 'modui-detail-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('code')}
              role="tab"
            >
              <span>Code & Implementation</span>
            </button>
            <button
              className={`modui-detail-tab-btn ${activeTab === 'props' ? 'modui-detail-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('props')}
              role="tab"
            >
              <span>Props & API</span>
            </button>
            <button
              className={`modui-detail-tab-btn ${activeTab === 'a11y' ? 'modui-detail-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('a11y')}
              role="tab"
            >
              <span>Accessibility</span>
            </button>
          </div>

          {/* TAB 1: CODE — Here user has the 3 files (Component TSX, CSS, Usage) and Copy is ONLY inside tab */}
          {activeTab === 'code' && (
            <div className="modui-code-section-wrap">
              {/* File Switcher Tabs */}
              <div className="modui-code-file-tabs">
                <button
                  className={`modui-code-tab-pill ${selectedFile === 'tsx' ? 'modui-code-tab-pill--active' : ''}`}
                  onClick={() => setSelectedFile('tsx')}
                >
                  <span>{component.name}.tsx</span>
                  <span className="modui-tab-badge">Component</span>
                </button>

                <button
                  className={`modui-code-tab-pill ${selectedFile === 'css' ? 'modui-code-tab-pill--active' : ''}`}
                  onClick={() => setSelectedFile('css')}
                >
                  <span>{component.name}.css</span>
                  <span className="modui-tab-badge">CSS Styles</span>
                </button>

                <button
                  className={`modui-code-tab-pill ${selectedFile === 'usage' ? 'modui-code-tab-pill--active' : ''}`}
                  onClick={() => setSelectedFile('usage')}
                >
                  <span>Usage.tsx</span>
                  <span className="modui-tab-badge">How to Use</span>
                </button>
              </div>

              {/* Code Viewer Container With Explicit Copy Inside */}
              <div className="modui-code-container">
                <div className="modui-code-header">
                  <div className="modui-code-file-meta">
                    <span className="modui-code-file-dot" />
                    <span className="modui-code-file-name">{getFileLabel()}</span>
                    <span className="modui-code-file-type">
                      {selectedFile === 'tsx' ? 'TypeScript / React' : selectedFile === 'css' ? 'CSS3 Stylesheet' : 'Usage Example'}
                    </span>
                  </div>

                  {/* COPY BUTTON INSIDE ITS TAB */}
                  <button
                    className={`modui-btn-copy-action ${copiedKey === selectedFile ? 'modui-btn-copy-action--success' : ''}`}
                    onClick={() => handleCopyInsideTab(getActiveCode(), getFileLabel())}
                    title={`Copy ${getFileLabel()}`}
                  >
                    <span>
                      {copiedKey === selectedFile
                        ? 'Copied to Clipboard!'
                        : `Copy ${getFileLabel()}`}
                    </span>
                  </button>
                </div>

                <pre className="modui-code-pre">
                  <code>{getActiveCode()}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: PROPS */}
          {activeTab === 'props' && (
            <div>
              {component.propsDoc.length > 0 ? (
                <div className="modui-table-wrap">
                  <table className="modui-props-table">
                    <thead>
                      <tr>
                        <th>Prop</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {component.propsDoc.map((p) => (
                        <tr key={p.name}>
                          <td><span className="modui-prop-name">{p.name}</span></td>
                          <td><span className="modui-prop-type">{p.type}</span></td>
                          <td><span className="modui-prop-default">{p.defaultValue || '—'}</span></td>
                          <td>{p.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  Standard React HTML attributes supported.
                </p>
              )}
            </div>
          )}

          {/* TAB 3: ACCESSIBILITY */}
          {activeTab === 'a11y' && (
            <div>
              <ul className="modui-a11y-list">
                {component.accessibilityNotes.map((note, idx) => (
                  <li key={idx} className="modui-a11y-item">
                    <span className="modui-a11y-bullet">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      );
};

      export default ComponentDetailPage;
