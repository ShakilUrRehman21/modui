import React, { useRef, useState, useCallback, useEffect } from 'react';
import './ChromaticPrismCard.css';

export type PrismVariant = 'sapphire-crystal' | 'obsidian-prism' | 'amber-quartz' | 'emerald-matrix';

export interface ChromaticPrismCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual finish and spectral color tone */
  variant?: PrismVariant;
  /** Primary display headline */
  title?: string;
  /** Supporting architectural description */
  subtitle?: string;
  /** Category badge or specimen classification */
  category?: string;
  /** Technical reference / serial engraving */
  serialNumber?: string;
  /** Optical refractive index label */
  refractiveIndex?: string;
  /** Primary interactive button label */
  actionLabel?: string;
  /** Callback fired when the specimen card action button is triggered */
  onAction?: () => void;
  /** Maximum 3D tilt angle in degrees (default: 14) */
  maxTilt?: number;
  /** Enable dynamic 3D tilt and optical pointer tracking (default: true) */
  interactive?: boolean;
  /** Synthesize delicate resonant glass chime upon action click (default: true) */
  soundEnabled?: boolean;
  /** Compact card mode for catalogue grids and embedded previews (default: false) */
  compact?: boolean;
  /** Custom specimen visual or graphic rendered inside the card */
  mediaNode?: React.ReactNode;
  /** Optional custom child elements */
  children?: React.ReactNode;
}

// Synthesize a pristine crystalline sapphire glass chime via native Web Audio
let audioCtx: AudioContext | null = null;

function playGlassChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx || audioCtx.state === 'suspended') {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const t = audioCtx.currentTime;

    // Fundamental crystal tone (1760 Hz - A6)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1760, t);
    gain1.gain.setValueAtTime(0.045, t);
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);

    // High harmonic overtone (3520 Hz - A7) for crystal sparkle
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(3520, t);
    gain2.gain.setValueAtTime(0.02, t);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);

    osc1.start(t);
    osc1.stop(t + 0.6);
    osc2.start(t);
    osc2.stop(t + 0.4);
  } catch {
    // Audio Context safely suppressed if unavailable
  }
}

export const ChromaticPrismCard: React.FC<ChromaticPrismCardProps> = ({
  variant = 'sapphire-crystal',
  title = 'Optical Sapphire Specimen',
  subtitle = 'Subpixel chromatic dispersion prism featuring multi-plane silica depth refraction and dynamic incident light tracking.',
  category = 'QUARTZ PRIMITIVE',
  serialNumber = 'REF. 9042 // SPECIMEN 01',
  refractiveIndex = 'n = 1.544',
  actionLabel = 'Inspect Specimen',
  onAction,
  maxTilt = 14,
  interactive = true,
  soundEnabled = true,
  compact = false,
  mediaNode,
  children,
  className = '',
  style,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number; angle: number }>({
    x: 50,
    y: 50,
    opacity: 0,
    angle: 0,
  });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!interactive || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      // Normalized coordinates (-1 to 1)
      const normX = Math.max(-1, Math.min(1, (clientX / rect.width) * 2 - 1));
      const normY = Math.max(-1, Math.min(1, (clientY / rect.height) * 2 - 1));

      // 3D rotation angles
      const rotX = -normY * maxTilt;
      const rotY = normX * maxTilt;

      // Incident light vector in degrees
      const angle = (Math.atan2(normY, normX) * 180) / Math.PI + 180;

      setTilt({ x: rotX, y: rotY });
      setGlare({
        x: (clientX / rect.width) * 100,
        y: (clientY / rect.height) * 100,
        opacity: 0.85,
        angle,
      });
    },
    [interactive, maxTilt]
  );

  const handlePointerEnter = useCallback(() => {
    if (!interactive) return;
    setIsHovered(true);
  }, [interactive]);

  const handlePointerLeave = useCallback(() => {
    if (!interactive) return;
    setIsHovered(false);
    // Smooth decay back to resting equilibrium
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  }, [interactive]);

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (soundEnabled) {
      playGlassChime();
    }
    onAction?.();
  };

  // Keyboard navigation for accessible tilt
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setTilt((prev) => ({ ...prev, y: Math.min(maxTilt, prev.y + 4) }));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setTilt((prev) => ({ ...prev, y: Math.max(-maxTilt, prev.y - 4) }));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setTilt((prev) => ({ ...prev, x: Math.min(maxTilt, prev.x + 4) }));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setTilt((prev) => ({ ...prev, x: Math.max(-maxTilt, prev.x - 4) }));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleActionClick(e as unknown as React.MouseEvent);
    }
  };

  // Dispersion chromatic offset vectors
  const chromaRedOffset = `${(tilt.y * 0.45).toFixed(2)}px, ${(-tilt.x * 0.45).toFixed(2)}px`;
  const chromaBlueOffset = `${(-tilt.y * 0.45).toFixed(2)}px, ${(tilt.x * 0.45).toFixed(2)}px`;

  return (
    <div
      ref={cardRef}
      className={`modui-prism-wrap modui-prism--${variant} ${compact ? 'modui-prism--compact' : ''} ${isHovered ? 'modui-prism--hovered' : ''} ${className}`}
      style={
        {
          ...style,
          '--prism-rx': `${tilt.x.toFixed(2)}deg`,
          '--prism-ry': `${tilt.y.toFixed(2)}deg`,
          '--glare-x': `${glare.x.toFixed(1)}%`,
          '--glare-y': `${glare.y.toFixed(1)}%`,
          '--glare-opacity': glare.opacity,
          '--prism-angle': `${glare.angle.toFixed(1)}deg`,
          '--chroma-red-offset': chromaRedOffset,
          '--chroma-blue-offset': chromaBlueOffset,
        } as React.CSSProperties
      }
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
      tabIndex={interactive ? 0 : undefined}
      role="region"
      aria-label={`Chromatic Prism Card: ${title}`}
      {...rest}
    >
      {/* 3D Perspective Card Chassis */}
      <div className="modui-prism-chassis">
        {/* Outer Spectral Rainbow Border Caustic Ring */}
        <div className="modui-prism-spectral-edge" aria-hidden="true" />

        {/* Dynamic Optical Glare Layer */}
        <div className="modui-prism-glare" aria-hidden="true" />

        {/* Crystalline Glass Substrate Body */}
        <div className="modui-prism-body">
          {/* Top Architectural Header Bar */}
          <div className="modui-prism-header">
            <div className="modui-prism-serial-group">
              <span className="modui-prism-facet-dot" />
              <span className="modui-prism-serial">{serialNumber}</span>
            </div>

            <div className="modui-prism-spec-badge">
              <span className="modui-prism-index">{refractiveIndex}</span>
            </div>
          </div>

          {/* Millimeter Calibrated Horizon Rule */}
          <div className="modui-prism-rule" aria-hidden="true">
            <div className="modui-prism-rule-track" />
            <div className="modui-prism-rule-notch" />
          </div>

          {/* Central Specimen Display Area */}
          <div className="modui-prism-stage">
            {mediaNode ? (
              <div className="modui-prism-custom-media">{mediaNode}</div>
            ) : (
              <div className="modui-prism-emblem-box">
                {/* Layered Chromatic Dispersion Quartz Emblem */}
                <div className="modui-prism-refractor">
                  <div className="modui-prism-facet modui-prism-facet--red" aria-hidden="true" />
                  <div className="modui-prism-facet modui-prism-facet--cyan" aria-hidden="true" />
                  <div className="modui-prism-facet modui-prism-facet--blue" aria-hidden="true" />
                  <div className="modui-prism-facet-core">
                    <svg
                      className="modui-prism-core-icon"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polygon
                        points="24,4 44,40 4,40"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinejoin="round"
                        className="modui-prism-svg-prism"
                      />
                      <line
                        x1="4"
                        y1="28"
                        x2="24"
                        y2="28"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeDasharray="2 2"
                        className="modui-prism-svg-ray-in"
                      />
                      <line
                        x1="24"
                        y1="28"
                        x2="44"
                        y2="22"
                        stroke="#FF4D4D"
                        strokeWidth="1.5"
                        className="modui-prism-svg-ray-red"
                      />
                      <line
                        x1="24"
                        y1="28"
                        x2="44"
                        y2="28"
                        stroke="#00F0FF"
                        strokeWidth="1.5"
                        className="modui-prism-svg-ray-cyan"
                      />
                      <line
                        x1="24"
                        y1="28"
                        x2="44"
                        y2="34"
                        stroke="#8B5CF6"
                        strokeWidth="1.5"
                        className="modui-prism-svg-ray-blue"
                      />
                    </svg>
                  </div>
                </div>

                <div className="modui-prism-badge-pill">{category}</div>
              </div>
            )}

            {children && <div className="modui-prism-custom-children">{children}</div>}
          </div>

          {/* Footer Editorial Typography & Action */}
          {!compact && (
            <div className="modui-prism-footer">
              <div className="modui-prism-editorial">
                <h3 className="modui-prism-title">{title}</h3>
                <p className="modui-prism-subtitle">{subtitle}</p>
              </div>

              <button
                type="button"
                className="modui-prism-action-btn"
                onClick={handleActionClick}
                aria-label={actionLabel}
              >
                <span>{actionLabel}</span>
                <svg
                  className="modui-prism-action-arrow"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
