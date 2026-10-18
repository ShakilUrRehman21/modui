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
  const [dockVariant, setDockVariant] = useState<'glass' | 'solid' | 'minimal' | 'dark'>('glass');
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
  const [accordionVariant, setAccordionVariant] = useState<FluidAccordionVariant>('dark');
  const [accordionTrigger, setAccordionTrigger] = useState<FluidAccordionTrigger>('click');
  const [accordionSpring, setAccordionSpring] = useState<FluidAccordionSpring>('elastic');
  const [accordionSound, setAccordionSound] = useState(true);
  const [accordionLiquidEdge, setAccordionLiquidEdge] = useState(true);
  const [accordionRatio, setAccordionRatio] = useState(3.4);

  // Playground state for BeforeAfterSlider
  const [sliderOrientation, setSliderOrientation] = useState<SliderOrientation>('horizontal');
  const [sliderMode, setSliderMode] = useState<SliderInteraction>('drag');
  const [sliderVariant, setSliderVariant] = useState<SliderVariant>('dark');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [sliderLabels, setSliderLabels] = useState(true);
  const [sliderSound, setSliderSound] = useState(true);

  // File viewer state inside Code tab
  const [selectedFile, setSelectedFile] = useState<'tsx' | 'css' | 'usage'>('tsx');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Main navigation tabs
  const [activeTab, setActiveTab] = useState<'code' | 'props' | 'a11y'>('code');

  if (!component) {
    return (
      <div className="modui-container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '1rem', color: '#fff' }}>
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
                  : 'radial-gradient(circle at center, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
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
