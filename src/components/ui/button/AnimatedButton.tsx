import React, { useState, useRef, useEffect } from 'react';
import './AnimatedButton.css';

export type ButtonVariant = 
  | 'shimmer'
  | 'glow'
  | 'ripple'
  | 'magnetic'
  | 'slide'
  | 'gradient-border'
  | 'minimal';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual animation variant */
  variant?: ButtonVariant;
  /** Button sizing */
  size?: ButtonSize;
  /** Show loading spinner and disable clicks */
  loading?: boolean;
  /** Optional text replacement when loading */
  loadingText?: string;
  /** Stretch button to 100% of container width */
  fullWidth?: boolean;
  /** Optional icon rendered on the left of children */
  icon?: React.ReactNode;
  /** Optional icon rendered on the right of children */
  iconRight?: React.ReactNode;
  /** Optional custom class name */
  className?: string;
}

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = 'shimmer',
  size = 'md',
  loading = false,
  loadingText,
  disabled = false,
  fullWidth = false,
  icon,
  iconRight,
  className = '',
  children,
  onClick,
  onMouseMove,
  onMouseLeave,
  ...restProps
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
  const lastRippleTimeRef = useRef(0);

  // Trigger circular water ripple
  const triggerRipple = (clientX?: number, clientY?: number) => {
    if (variant === 'ripple' && buttonRef.current && !disabled && !loading) {
      const now = performance.now();
      if (now - lastRippleTimeRef.current < 60) return;
      lastRippleTimeRef.current = now;

      const rect = buttonRef.current.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height) * 1.5;
      const radius = diameter / 2;

      const posX = clientX !== undefined ? clientX - rect.left - radius : rect.width / 2 - radius;
      const posY = clientY !== undefined ? clientY - rect.top - radius : rect.height / 2 - radius;

      const newRipple: Ripple = {
        x: posX,
        y: posY,
        size: diameter,
        id: Date.now() + Math.random(),
      };

      setRipples((prev) => [...prev, newRipple]);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    triggerRipple(e.clientX, e.clientY);
    if (restProps.onPointerDown) {
      restProps.onPointerDown(e);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerRipple(e.clientX, e.clientY);
    if (onClick && !disabled && !loading) {
      onClick(e);
    }
  };

  // Clean up ripples after animation duration
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  // Handle Magnetic pull physics for 'magnetic' variant
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === 'magnetic' && buttonRef.current && !disabled && !loading) {
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Subtle attraction factor
      const distanceX = (e.clientX - centerX) * 0.25;
      const distanceY = (e.clientY - centerY) * 0.25;

      setMagneticOffset({ x: distanceX, y: distanceY });
    }
    if (onMouseMove) onMouseMove(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === 'magnetic') {
      setMagneticOffset({ x: 0, y: 0 });
    }
    if (onMouseLeave) onMouseLeave(e);
  };

  const isDisabled = disabled || loading;

  const baseClasses = [
    'modui-btn',
    `modui-btn--${variant}`,
    `modui-btn--${size}`,
    fullWidth ? 'modui-btn--full' : '',
    isDisabled ? 'modui-btn--disabled' : '',
    loading ? 'modui-btn--loading' : '',
    className,
  ].filter(Boolean).join(' ');

  const magneticStyle = variant === 'magnetic' && (magneticOffset.x !== 0 || magneticOffset.y !== 0)
    ? { transform: `translate(${magneticOffset.x}px, ${magneticOffset.y}px)` }
    : undefined;

  const content = (
    <>
      {/* Shimmer light sweep element */}
      {variant === 'shimmer' && <span className="modui-btn-shimmer-sweep" aria-hidden="true" />}

      {/* Ripple elements */}
      {variant === 'ripple' && ripples.map((r) => (
        <span
          key={r.id}
          className="modui-btn-ripple-effect"
          style={{
            top: r.y,
            left: r.x,
            width: r.size,
            height: r.size,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Spinner for Loading State */}
      {loading && <span className="modui-btn-spinner" aria-hidden="true" />}

      {/* Leading Icon */}
      {!loading && icon && <span className="modui-btn-icon-leading">{icon}</span>}

      {/* Button Label / Loading Text */}
      <span className="modui-btn-label">
        {loading && loadingText ? loadingText : children}
      </span>

      {/* Trailing Icon / Slide Indicator */}
      {!loading && (iconRight || variant === 'slide') && (
        <span className={variant === 'slide' ? 'modui-btn-icon-slide' : 'modui-btn-icon-trailing'} aria-hidden="true">
          {iconRight || <span className="modui-btn-slide-arrow">→</span>}
        </span>
      )}
    </>
  );

  return (
    <button
      ref={buttonRef}
      className={baseClasses}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={magneticStyle}
      {...restProps}
    >
      {variant === 'gradient-border' ? (
        <span className="modui-btn-inner-bg">{content}</span>
      ) : (
        content
      )}
    </button>
  );
};

export default AnimatedButton;
