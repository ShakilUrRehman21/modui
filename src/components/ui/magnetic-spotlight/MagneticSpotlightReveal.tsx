import React, { useRef, useCallback, useEffect } from 'react';
import './MagneticSpotlightReveal.css';

export interface MagneticSpotlightRevealProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Underlying content revealed inside the spotlight aperture (defaults to approved production cloud card) */
  revealContent?: React.ReactNode;
  /** Base background content visible outside the spotlight (defaults to approved schematic architecture card) */
  baseContent?: React.ReactNode;
  /** Radius of the spotlight aperture in pixels (default: 80) */
  radius?: number;
  /** Show glowing illuminated portal ring (default: true) */
  showRing?: boolean;
  /** Compact sizing for catalog card previews */
  compact?: boolean;
  /** Callback fired as the spotlight moves */
  onPositionChange?: (x: number, y: number) => void;
}

export function MagneticSpotlightReveal({
  revealContent,
  baseContent,
  radius = 80,
  showRing = true,
  compact = false,
  onPositionChange,
  className = '',
  style,
  ...rest
}: MagneticSpotlightRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<{ x: number; y: number } | null>(null);

  const effectiveRadius = compact ? Math.round(radius * 0.75) : radius;
  const ringDiameter = effectiveRadius * 2;

  // Keep radius in sync if prop changes
  useEffect(() => {
    if (!coordsRef.current) {
      if (revealRef.current) {
        revealRef.current.style.clipPath = `circle(${effectiveRadius}px at 50% 50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.width = `${ringDiameter}px`;
        ringRef.current.style.height = `${ringDiameter}px`;
      }
    }
  }, [effectiveRadius, ringDiameter]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

      coordsRef.current = { x, y };

      // ZERO-LATENCY SYNCHRONOUS UPDATE:
      // Remove any CSS transitions during active cursor movement so the clip-path
      // and the glowing portal ring move in 100% lockstep with zero latency and zero tearing.
      if (revealRef.current) {
        revealRef.current.style.transition = 'none';
        revealRef.current.style.clipPath = `circle(${effectiveRadius}px at ${x}px ${y}px)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transition = 'none';
        ringRef.current.style.left = `${x}px`;
        ringRef.current.style.top = `${y}px`;
      }

      onPositionChange?.(x, y);
    },
    [effectiveRadius, onPositionChange]
  );

  const handlePointerLeave = useCallback(() => {
    coordsRef.current = null;

    // Smooth return to center when pointer exits
    if (revealRef.current) {
      revealRef.current.style.transition =
        'clip-path 0.22s cubic-bezier(0.16, 1, 0.3, 1)';
      revealRef.current.style.clipPath = `circle(${effectiveRadius}px at 50% 50%)`;
    }

    if (ringRef.current) {
      ringRef.current.style.transition =
        'left 0.22s cubic-bezier(0.16, 1, 0.3, 1), top 0.22s cubic-bezier(0.16, 1, 0.3, 1)';
      ringRef.current.style.left = '50%';
      ringRef.current.style.top = '50%';
    }
  }, [effectiveRadius]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const step = 24;

      const currentX = coordsRef.current ? coordsRef.current.x : rect.width / 2;
      const currentY = coordsRef.current ? coordsRef.current.y : rect.height / 2;

      let nextX = currentX;
      let nextY = currentY;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          nextY = Math.max(0, currentY - step);
          break;
        case 'ArrowDown':
          e.preventDefault();
          nextY = Math.min(rect.height, currentY + step);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          nextX = Math.max(0, currentX - step);
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextX = Math.min(rect.width, currentX + step);
          break;
        case 'Escape':
        case 'Enter':
        case ' ':
          e.preventDefault();
          handlePointerLeave();
          return;
        default:
          return;
      }

      coordsRef.current = { x: nextX, y: nextY };

      if (revealRef.current) {
        revealRef.current.style.transition = 'clip-path 0.1s ease-out';
        revealRef.current.style.clipPath = `circle(${effectiveRadius}px at ${nextX}px ${nextY}px)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transition =
          'left 0.1s ease-out, top 0.1s ease-out';
        ringRef.current.style.left = `${nextX}px`;
        ringRef.current.style.top = `${nextY}px`;
      }

      onPositionChange?.(nextX, nextY);
    },
    [effectiveRadius, handlePointerLeave, onPositionChange]
  );

  return (
    <div
      ref={containerRef}
      className={`modui-spotlight-canvas-wrapper ${
        compact ? 'modui-spotlight--compact' : ''
      } ${className}`}
      tabIndex={0}
      role="region"
      aria-label="Interactive Magnetic Spotlight & Portal Reveal"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
      style={style}
      {...rest}
    >
      {/* Base Wireframe Schematic Layer */}
      <div className="modui-spotlight-base-layer" aria-hidden="true">
        {baseContent ? (
          baseContent
        ) : (
          <>
            <div className="modui-spotlight-label">
              Schematic Architecture • Hover to Reveal
            </div>
            <div className="modui-spotlight-wireframe-box">
              <span>● Core Compute Cluster [Wireframe]</span>
              <span>128-bit Encrypted</span>
            </div>
            <div className="modui-spotlight-subtext">
              Move cursor over canvas to focus spotlight portal
            </div>
          </>
        )}
      </div>

      {/* Top Vivid Product Layer (revealed via dynamic clip-path) */}
      <div
        ref={revealRef}
        className="modui-spotlight-reveal-layer"
        style={{
          clipPath: `circle(${effectiveRadius}px at 50% 50%)`,
        }}
      >
        {revealContent ? (
          revealContent
        ) : (
          <>
            <div className="modui-spotlight-label-reveal">
              ⚡ Live Production Cloud • Fully Deployed
            </div>
            <div className="modui-spotlight-vibrant-card">
              <span style={{ fontWeight: 700 }}>🚀 Quantum Cluster Active</span>
              <span className="modui-spotlight-badge">99.99% SLO</span>
            </div>
            <div className="modui-spotlight-subtext-reveal">
              High-throughput edge routing verified
            </div>
          </>
        )}
      </div>

      {/* Glowing Portal Ring */}
      {showRing && (
        <div
          ref={ringRef}
          className="modui-spotlight-ring"
          style={{
            left: '50%',
            top: '50%',
            width: `${ringDiameter}px`,
            height: `${ringDiameter}px`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Screen reader keyboard hint */}
      <span className="modui-spotlight-sr-only">
        Use arrow keys to move spotlight aperture. Press Escape or Enter to reset to center.
      </span>
    </div>
  );
}

export default MagneticSpotlightReveal;
