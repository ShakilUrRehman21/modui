import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './MagneticProjectList.css';

export type ProjectListVariant = 'studio-light' | 'dark-slate' | 'editorial-paper' | 'minimal-mono';

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  client: string;
  category: string;
  year: string;
  description?: string;
  gradient?: string;
  imageUrl?: string;
  deliverables?: string[];
  linkUrl?: string;
  accentColor?: string;
}

export interface MagneticProjectListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Visual theme matching platform design system (default: 'studio-light') */
  variant?: ProjectListVariant;
  /** Array of project items */
  projects?: ProjectItem[];
  /** Synthesize subtle micro-haptic ticks when crossing project rows (default: true) */
  soundEnabled?: boolean;
  /** Compact card preview mode for explorer catalogue cards */
  compact?: boolean;
  /** Enable mouse velocity 3D tilt calculation (default: true) */
  enableVelocityTilt?: boolean;
  /** Callback fired when a project row is clicked */
  onProjectClick?: (project: ProjectItem) => void;
  /** Callback fired when hovered project changes */
  onProjectHover?: (project: ProjectItem | null) => void;
}

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    index: '01',
    title: 'Aether Sound Core',
    client: 'Zurich Audio Labs',
    category: 'Hardware / DSP',
    year: '2026',
    description: 'Bespoke mechanical synthesizer DSP engine with milled brass potentiometers and real-time Web Audio oscillators.',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a8a 100%)',
    deliverables: ['Custom DSP Architecture', 'React 19 Synthesis Engine', 'Physics Modeling'],
    accentColor: '#365CF5',
  },
  {
    id: 'proj-2',
    index: '02',
    title: 'Chronos Spatial Watch',
    client: 'Manufacture Horlogère',
    category: '3D / WebGL',
    year: '2026',
    description: 'Subpixel 3D mechanical watch configurator with real-time tourbillon escapement simulation and dynamic studio lighting.',
    gradient: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)',
    deliverables: ['Three.js GLTF Pipeline', 'Physical PBR Shaders', '4K Turntable Rendering'],
    accentColor: '#10B981',
  },
  {
    id: 'proj-3',
    index: '03',
    title: 'Neo Helsinki Biennale',
    client: 'Nordic Culture Trust',
    category: 'Editorial / Code',
    year: '2025',
    description: 'Kinetic bilingual typographic pavilion index with mouse-reactive wave elevation and fluid spring transitions.',
    gradient: 'linear-gradient(135deg, #4c1d95 0%, #581c87 50%, #3b0764 100%)',
    deliverables: ['Editorial Design System', 'Split-Text Physics', 'Accessibility WCAG AAA'],
    accentColor: '#A855F7',
  },
  {
    id: 'proj-4',
    index: '04',
    title: 'Kroma Optical Caustics',
    client: 'Tokyo Optics Guild',
    category: 'Shaders / Canvas',
    year: '2025',
    description: 'Real-time raymarched sunlight refraction simulation across liquid and quartz crystal substrates.',
    gradient: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)',
    deliverables: ['GLSL Caustic Solvers', 'Refraction Buffer', 'Interactive Pointer Wake'],
    accentColor: '#F59E0B',
  },
  {
    id: 'proj-5',
    index: '05',
    title: 'Verlet Structural Cloth',
    client: 'Studio Monolith Berlin',
    category: 'Verlet Physics',
    year: '2024',
    description: 'Hardware-accelerated 2D particle lattice simulating silk fabric aerodynamics, ambient breeze, and pointer drag tears.',
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #431407 100%)',
    deliverables: ['Verlet Integration Rig', 'Dynamic Normal Shading', 'Zero-Dependency Math'],
    accentColor: '#EF4444',
  },
];

// Audio Context Singleton & Synthesizer Engine
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx || audioCtx.state === 'suspended') {
      audioCtx = new AudioContextClass();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

function playHoverTick() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    
    // Subtle acoustic micro-tick (1200Hz -> 600Hz in 25ms)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.025);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.025);
  } catch {
    // Ignore audio errors gracefully
  }
}

export const MagneticProjectList: React.FC<MagneticProjectListProps> = ({
  variant = 'studio-light',
  projects = DEFAULT_PROJECTS,
  soundEnabled = true,
  compact = false,
  enableVelocityTilt = true,
  onProjectClick,
  onProjectHover,
  className = '',
  style,
  ...rest
}) => {
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [cardPos, setCardPos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0, time: 0 });

  // Mouse Move tracking with intelligent boundary clamping & left/right flipping
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (compact) return;

      const now = performance.now();
      const dt = Math.max(1, now - lastMousePos.current.time);
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;

      lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };

      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const cardWidth = 290;
      const cardHeight = 220;

      const relX = e.clientX - containerRect.left;
      const relY = e.clientY - containerRect.top;

      // Smart flipping: if mouse is on the right 55% of the container, show card to the LEFT
      const isRightSide = relX > (containerRect.width * 0.52);
      let targetX = isRightSide ? relX - cardWidth - 20 : relX + 24;

      // Clamp X strictly within container boundaries
      targetX = Math.max(12, Math.min(containerRect.width - cardWidth - 12, targetX));

      // Clamp Y safely
      let targetY = relY - (cardHeight * 0.45);
      targetY = Math.max(10, Math.min(containerRect.height - cardHeight - 10, targetY));

      setCardPos({ x: targetX, y: targetY });

      if (enableVelocityTilt) {
        // Calculate velocity-driven 3D tilt
        const velX = (dx / dt) * 14;
        const velY = (dy / dt) * 14;

        const targetTiltX = Math.max(-15, Math.min(15, -velY * 1.4));
        const targetTiltY = Math.max(-15, Math.min(15, velX * 1.4));

        setTilt({ x: targetTiltX, y: targetTiltY });
      }
    },
    [compact, enableVelocityTilt]
  );

  // Smooth tilt relaxation back to 0
  useEffect(() => {
    if (compact || !enableVelocityTilt) return;

    const decayInterval = setInterval(() => {
      setTilt((prev) => {
        if (Math.abs(prev.x) < 0.2 && Math.abs(prev.y) < 0.2) return { x: 0, y: 0 };
        return {
          x: prev.x * 0.82,
          y: prev.y * 0.82,
        };
      });
    }, 30);

    return () => clearInterval(decayInterval);
  }, [compact, enableVelocityTilt]);

  // Row Hover
  const handleRowMouseEnter = useCallback(
    (project: ProjectItem) => {
      if (compact) return;
      setActiveProject(project);
      setIsVisible(true);
      if (soundEnabled) playHoverTick();
      if (onProjectHover) onProjectHover(project);
    },
    [compact, soundEnabled, onProjectHover]
  );

  const handleContainerMouseLeave = useCallback(() => {
    if (compact) return;
    setIsVisible(false);
    setActiveProject(null);
    setTilt({ x: 0, y: 0 });
    if (onProjectHover) onProjectHover(null);
  }, [compact, onProjectHover]);

  // Row Click
  const handleRowClick = useCallback(
    (project: ProjectItem) => {
      setSelectedProjectId(project.id);
      if (soundEnabled) playHoverTick();
      if (onProjectClick) onProjectClick(project);
    },
    [soundEnabled, onProjectClick]
  );

  // Keyboard Navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, project: ProjectItem, index: number) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleRowClick(project);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = (index + 1) % projects.length;
        const nextElem = containerRef.current?.querySelectorAll<HTMLElement>('.modui-project-row')[nextIdx];
        nextElem?.focus();
        handleRowMouseEnter(projects[nextIdx]);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = (index - 1 + projects.length) % projects.length;
        const prevElem = containerRef.current?.querySelectorAll<HTMLElement>('.modui-project-row')[prevIdx];
        prevElem?.focus();
        handleRowMouseEnter(projects[prevIdx]);
      }
    },
    [handleRowClick, handleRowMouseEnter, projects]
  );

  const primaryProject = useMemo(() => {
    return activeProject || projects[0] || null;
  }, [activeProject, projects]);

  return (
    <div
      ref={containerRef}
      className={`modui-project-list modui-project-list--${variant} ${compact ? 'modui-project-list--compact' : ''} ${className}`}
      style={style}
      role="region"
      aria-label="Interactive Magnetic Project Showcase"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleContainerMouseLeave}
      {...rest}
    >
      {/* ================= STANDARD FULL MODE ================= */}
      {!compact && (
        <>
          {/* Top Header / Metadata Bar */}
          <div className="modui-project-list__header">
            <div className="modui-project-list__brand">
              <span className="modui-project-list__badge">SELECTED WORK</span>
              <span className="modui-project-list__count">({projects.length} CASE STUDIES)</span>
            </div>
            <div className="modui-project-list__hint">
              <span>HOVER TO INSPECT</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Main Project Rows */}
          <div className="modui-project-list__rows" role="list">
            {projects.map((project, idx) => {
              const isActive = activeProject?.id === project.id;
              const isSelected = selectedProjectId === project.id;

              return (
                <div
                  key={project.id}
                  className={`modui-project-row ${isActive ? 'is-active' : ''} ${isSelected ? 'is-selected' : ''}`}
                  role="listitem"
                  tabIndex={0}
                  onMouseEnter={() => handleRowMouseEnter(project)}
                  onClick={() => handleRowClick(project)}
                  onKeyDown={(e) => handleKeyDown(e, project, idx)}
                  aria-label={`Project ${project.index}: ${project.title}, ${project.client}. Press Enter to view case study.`}
                >
                  <div className="modui-project-row__left">
                    <span className="modui-project-row__index">{project.index}</span>
                    <div className="modui-project-row__title-wrap">
                      <h3 className="modui-project-row__title">{project.title}</h3>
                      <span className="modui-project-row__client">{project.client}</span>
                    </div>
                  </div>

                  <div className="modui-project-row__right">
                    <span className="modui-project-row__category">{project.category}</span>
                    <span className="modui-project-row__year">{project.year}</span>
                    <span className="modui-project-row__arrow" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Cursor-Following Preview Card */}
          {activeProject && (
            <div
              className={`modui-floating-card ${isVisible ? 'is-visible' : ''}`}
              style={{
                left: `${cardPos.x}px`,
                top: `${cardPos.y}px`,
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isVisible ? 1 : 0.88})`,
              }}
              aria-hidden="true"
            >
              <div
                className="modui-floating-card__media"
                style={{
                  background: activeProject.gradient || 'linear-gradient(135deg, #1e1b4b, #312e81)',
                }}
              >
                {activeProject.imageUrl ? (
                  <img
                    src={activeProject.imageUrl}
                    alt={activeProject.title}
                    className="modui-floating-card__img"
                  />
                ) : (
                  <div className="modui-floating-card__art-placeholder">
                    <div className="modui-floating-card__art-chip">{activeProject.category}</div>
                    <div className="modui-floating-card__art-year">{activeProject.year}</div>
                  </div>
                )}
                <div className="modui-floating-card__glare" />
              </div>

              <div className="modui-floating-card__content">
                <div className="modui-floating-card__header">
                  <span className="modui-floating-card__tag">{activeProject.category}</span>
                  <span className="modui-floating-card__index">SPECIMEN #{activeProject.index}</span>
                </div>
                <h4 className="modui-floating-card__title">{activeProject.title}</h4>
                <p className="modui-floating-card__desc">{activeProject.description}</p>

                {activeProject.deliverables && (
                  <div className="modui-floating-card__pills">
                    {activeProject.deliverables.slice(0, 2).map((deliv, i) => (
                      <span key={i} className="modui-floating-card__pill">
                        {deliv}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* ================= COMPACT EXPLORER CARD MODE =================
          Tailored specifically for the 230px catalog card on /components
          Displays the signature 3D floating preview card proudly in the center! */}
      {compact && primaryProject && (
        <div className="modui-compact-stage" aria-hidden="true">
          {/* Subtle Background Rows */}
          <div className="modui-compact-bg-rows">
            <div className="modui-compact-bg-row">
              <span className="modui-compact-bg-idx">01</span>
              <span className="modui-compact-bg-title">Aether Sound Core</span>
              <span className="modui-compact-bg-tag">2026</span>
            </div>
            <div className="modui-compact-bg-row modui-compact-bg-row--dim">
              <span className="modui-compact-bg-idx">02</span>
              <span className="modui-compact-bg-title">Chronos Spatial Watch</span>
              <span className="modui-compact-bg-tag">2026</span>
            </div>
          </div>

          {/* Elevated Signature Floating Specimen Card */}
          <div className="modui-compact-floating-card">
            <div
              className="modui-compact-card-media"
              style={{
                background: primaryProject.gradient || 'linear-gradient(135deg, #1e1b4b, #312e81)',
              }}
            >
              <div className="modui-compact-card-top">
                <span className="modui-compact-card-chip">{primaryProject.category}</span>
                <span className="modui-compact-card-spec">#{primaryProject.index}</span>
              </div>
              <div className="modui-compact-card-title">{primaryProject.title}</div>
              <div className="modui-floating-card__glare" />
            </div>

            <div className="modui-compact-card-bottom">
              <div className="modui-compact-card-client">{primaryProject.client}</div>
              <div className="modui-compact-card-pills">
                {primaryProject.deliverables?.slice(0, 2).map((d, i) => (
                  <span key={i} className="modui-compact-card-pill">{d}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MagneticProjectList;
