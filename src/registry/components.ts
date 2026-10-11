export type ComponentCategory =
  | 'Buttons and Actions'
  | 'Status & Indicators'
  | 'Typography & Motion';

export type ComponentStatus = 'published' | 'in-progress';

export interface ComponentPropDoc {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
  required?: boolean;
}

export interface ComponentRegistryItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ComponentCategory;
  tags: string[];
  status: ComponentStatus;
  publishedAt?: string;
  updatedAt?: string;
  version: string;
  sourceLocation: string;
  githubUrl: string;
  codeSnippet: string;
  installSnippet: string;
  rawSourceCode: string;
  rawCssCode: string;
  propsDoc: ComponentPropDoc[];
  accessibilityNotes: string[];
  features: string[];
}

export const COMPONENT_CATEGORIES: ComponentCategory[] = [
  'Buttons and Actions',
  'Status & Indicators',
  'Typography & Motion',
];

export const COMPONENT_REGISTRY: ComponentRegistryItem[] = [
  {
    id: 'animated-button',
    slug: 'animated-button',
    name: 'Animated Button',
    description: 'Polished button component with micro-interactions including shimmer sheen, magnetic pull, click ripples, glowing borders, and icon slides.',
    category: 'Buttons and Actions',
    tags: ['button', 'interaction', 'shimmer', 'ripple', 'magnetic', 'micro-interactions'],
    status: 'published',
    publishedAt: '2026-10-10',
    updatedAt: '2026-10-11',
    version: '1.2.0',
    sourceLocation: 'src/components/ui/button/AnimatedButton.tsx',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/button/AnimatedButton.tsx',
    installSnippet: `// 1. Copy AnimatedButton.tsx and AnimatedButton.css into your project:
// components/ui/button/AnimatedButton.tsx
// components/ui/button/AnimatedButton.css
// 2. Import into your application:
import { AnimatedButton } from '@/components/ui/button';`,
    codeSnippet: `import React from 'react';
import { AnimatedButton } from '@/components/ui/button';

export function ButtonShowcase() {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {/* Shimmer sweep effect */}
      <AnimatedButton variant="shimmer">
        Get Started
      </AnimatedButton>

      {/* Perimeter pulse glow */}
      <AnimatedButton variant="glow">
        Launch Project
      </AnimatedButton>

      {/* Click-origin radial ripple */}
      <AnimatedButton variant="ripple">
        Interactive Ripple
      </AnimatedButton>

      {/* Magnetic physics attraction */}
      <AnimatedButton variant="magnetic">
        Hover Magnetic
      </AnimatedButton>

      {/* Trailing icon slide */}
      <AnimatedButton variant="slide" iconRight={<ArrowRight size={16} />}>
        Explore Components
      </AnimatedButton>

      {/* Dynamic spinning gradient border */}
      <AnimatedButton variant="gradient-border">
        Special Edition
      </AnimatedButton>
    </div>
  );
}`,
    rawSourceCode: `import React, { useState, useRef, useEffect } from 'react';
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
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
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

      setRipples((prev) => [
        ...prev,
        {
          x: posX,
          y: posY,
          size: diameter,
          id: Date.now() + Math.random(),
        },
      ]);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    triggerRipple(e.clientX, e.clientY);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerRipple(e.clientX, e.clientY);
    if (onClick && !disabled && !loading) {
      onClick(e);
    }
  };

  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === 'magnetic' && buttonRef.current && !disabled && !loading) {
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setMagneticOffset({
        x: (e.clientX - centerX) * 0.25,
        y: (e.clientY - centerY) * 0.25,
      });
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
    \`modui-btn--\${variant}\`,
    \`modui-btn--\${size}\`,
    fullWidth ? 'modui-btn--full' : '',
    isDisabled ? 'modui-btn--disabled' : '',
    loading ? 'modui-btn--loading' : '',
    className,
  ].filter(Boolean).join(' ');

  const magneticStyle = variant === 'magnetic' && (magneticOffset.x !== 0 || magneticOffset.y !== 0)
    ? { transform: \`translate(\${magneticOffset.x}px, \${magneticOffset.y}px)\` }
    : undefined;

  const content = (
    <>
      {variant === 'shimmer' && <span className="modui-btn-shimmer-sweep" aria-hidden="true" />}
      {variant === 'ripple' && ripples.map((r) => (
        <span
          key={r.id}
          className="modui-btn-ripple-effect"
          style={{ top: r.y, left: r.x, width: r.size, height: r.size }}
          aria-hidden="true"
        />
      ))}
      {loading && <span className="modui-btn-spinner" aria-hidden="true" />}
      {!loading && icon && <span className="modui-btn-icon-leading">{icon}</span>}
      <span className="modui-btn-label">
        {loading && loadingText ? loadingText : children}
      </span>
      {!loading && (iconRight || variant === 'slide') && (
        <span className={variant === 'slide' ? 'modui-btn-icon-slide' : 'modui-btn-icon-trailing'}>
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

export default AnimatedButton;`,
    rawCssCode: `/* AnimatedButton.css */
.modui-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: inherit;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  box-sizing: border-box;
}

.modui-btn--sm { height: 32px; padding: 0 0.75rem; font-size: 0.75rem; border-radius: 6px; }
.modui-btn--md { height: 40px; padding: 0 1.125rem; font-size: 0.875rem; border-radius: 8px; }
.modui-btn--lg { height: 48px; padding: 0 1.5rem; font-size: 1rem; border-radius: 12px; }
.modui-btn--full { width: 100%; }

.modui-btn:disabled, .modui-btn--disabled {
  opacity: 0.55;
  cursor: not-allowed;
  pointer-events: none;
}
.modui-btn--loading { cursor: wait; }

.modui-btn:focus-visible {
  outline: 2px solid #ff5e3a;
  outline-offset: 3px;
}

/* Shimmer */
.modui-btn--shimmer {
  background: linear-gradient(180deg, #18181b 0%, #09090b 100%);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}
.modui-btn--shimmer .modui-btn-shimmer-sweep {
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.28) 50%, transparent 100%);
  transform: skewX(-22deg);
  pointer-events: none;
}
.modui-btn--shimmer:hover .modui-btn-shimmer-sweep {
  animation: modui-shimmer-pass 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes modui-shimmer-pass {
  0% { left: -100%; }
  100% { left: 180%; }
}
.modui-btn--shimmer:hover { transform: translateY(-1px); }

/* Glow */
.modui-btn--glow {
  background: #ff5e3a;
  color: #ffffff;
  box-shadow: 0 0 16px rgba(255, 94, 58, 0.45);
}
.modui-btn--glow:hover {
  background: #ff4319;
  transform: translateY(-1px);
  box-shadow: 0 0 24px rgba(255, 94, 58, 0.65);
}

/* Ripple */
.modui-btn--ripple {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.12);
}
.modui-btn-ripple-effect {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 94, 58, 0.35);
  transform: scale(0);
  animation: modui-ripple-expand 0.6s linear;
  pointer-events: none;
}
@keyframes modui-ripple-expand {
  to { transform: scale(4); opacity: 0; }
}

/* Magnetic */
.modui-btn--magnetic {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: transform 0.15s cubic-bezier(0.2, 0, 0.2, 1);
}
.modui-btn--magnetic:hover { border-color: #ff5e3a; }

/* Slide */
.modui-btn--slide {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.modui-btn--slide:hover {
  background: #ff5e3a;
  color: #ffffff;
  border-color: #ff5e3a;
}
.modui-btn--slide:hover .modui-btn-icon-slide { transform: translateX(4px); }

/* Gradient Border */
.modui-btn--gradient-border {
  background: transparent;
  color: #ffffff;
  position: relative;
  z-index: 1;
  border: none;
  padding: 1px;
}
.modui-btn--gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, #ff5e3a, #38bdf8, #a855f7, #ff5e3a);
  background-size: 300% 300%;
  animation: modui-gradient-shift 4s linear infinite;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
@keyframes modui-gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.modui-btn--gradient-border .modui-btn-inner-bg {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  background: #0d1018;
  border-radius: 7px;
  padding: 0 1.125rem;
}

/* Minimal */
.modui-btn--minimal {
  background: transparent;
  color: #a1a1aa;
}
.modui-btn--minimal:hover { background: rgba(255, 255, 255, 0.06); color: #ffffff; }

.modui-btn-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: modui-spin 0.65s linear infinite;
}
@keyframes modui-spin { to { transform: rotate(360deg); } }`,
    propsDoc: [
      {
        name: 'variant',
        type: "'shimmer' | 'glow' | 'ripple' | 'magnetic' | 'slide' | 'gradient-border' | 'minimal'",
        defaultValue: "'shimmer'",
        description: 'Visual animation style and interactive behavior mode.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: 'Dimension scale of the button (heights: 32px, 40px, 48px).',
      },
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Renders an accessible loading spinner and disables user interaction.',
      },
      {
        name: 'loadingText',
        type: 'string',
        defaultValue: 'undefined',
        description: 'Optional label override displayed during the loading state.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Disables button interactions and applies muted visual state.',
      },
      {
        name: 'icon',
        type: 'ReactNode',
        defaultValue: 'undefined',
        description: 'Icon element rendered before the button label.',
      },
      {
        name: 'iconRight',
        type: 'ReactNode',
        defaultValue: 'undefined',
        description: 'Icon element rendered after the button label.',
      },
      {
        name: 'fullWidth',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Expands button to fill 100% of parent width.',
      },
    ],
    accessibilityNotes: [
      'Semantic <button> element with full keyboard operability (Tab, Enter, Space).',
      'Provides aria-disabled="true" when disabled.',
      'Provides aria-busy="true" during active loading states.',
      'High-contrast focus-visible ring adhering to WCAG 2.1 AA standards.',
    ],
    features: [
      '7 bespoke animation variants with zero external motion dependencies',
      'Pure CSS micro-animations & physics-inspired magnetic tracking',
      'Click-origin canvas ripple calculation',
      'Seamless dark & light mode token integration',
    ],
  },
  {
    id: 'badge',
    slug: 'badge',
    name: 'Pulse Badge',
    description: 'Tactile status indicators and pill badges with breathing ambient pulse auras, icon slots, and semantic color tokens.',
    category: 'Status & Indicators',
    tags: ['badge', 'status', 'pulse', 'indicator', 'pill', 'aura'],
    status: 'published',
    publishedAt: '2026-10-11',
    updatedAt: '2026-10-11',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/badge/Badge.tsx',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/badge/Badge.tsx',
    installSnippet: `// 1. Copy Badge.tsx and Badge.css into your project:
import { Badge } from '@/components/ui/badge';`,
    codeSnippet: `import React from 'react';
import { Badge } from '@/components/ui/badge';

export function BadgeShowcase() {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="accent" dot pulse>Live Pulse</Badge>
      <Badge variant="success" dot>Operational</Badge>
      <Badge variant="cyan">React 19</Badge>
      <Badge variant="default">Pure CSS</Badge>
    </div>
  );
}`,
    rawSourceCode: `import React from 'react';
import './Badge.css';

export type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'cyan';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
  pulse?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  dot = false,
  pulse = false,
  icon,
  children,
  className = '',
  ...props
}) => {
  return (
    <span className={\`modui-badge modui-badge--\${variant} \${className}\`} {...props}>
      {dot && (
        <span
          className={\`modui-badge-dot \${pulse ? 'modui-badge-dot--pulse' : ''}\`}
          aria-hidden="true"
        />
      )}
      {icon && <span className="modui-badge-icon">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;`,
    rawCssCode: `/* Badge.css */
.modui-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.2rem 0.625rem;
  border-radius: 9999px;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.25;
  white-space: nowrap;
  transition: all 160ms ease;
  border: 1px solid transparent;
}

.modui-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}

.modui-badge-dot--pulse {
  position: relative;
}

.modui-badge-dot--pulse::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background-color: currentColor;
  opacity: 0.75;
  animation: modui-pulse-scale 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes modui-pulse-scale {
  0% { transform: scale(0.9); opacity: 0.8; }
  70% { transform: scale(2.2); opacity: 0; }
  100% { transform: scale(2.4); opacity: 0; }
}

.modui-badge--default {
  background: #F1F5F9;
  color: #475569;
  border-color: rgba(15, 23, 42, 0.08);
}

.modui-badge--accent {
  background: rgba(79, 70, 229, 0.08);
  color: #4F46E5;
  border-color: rgba(79, 70, 229, 0.25);
}

.modui-badge--success {
  background: rgba(16, 185, 129, 0.12);
  color: #10B981;
  border-color: rgba(16, 185, 129, 0.3);
}

.modui-badge--cyan {
  background: rgba(6, 182, 212, 0.12);
  color: #06B6D4;
  border-color: rgba(6, 182, 212, 0.3);
}`,
    propsDoc: [
      {
        name: 'variant',
        type: "'default' | 'accent' | 'success' | 'warning' | 'cyan'",
        defaultValue: "'default'",
        description: 'Semantic surface and color token styling.',
      },
      {
        name: 'dot',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Displays a live indicator circle dot.',
      },
      {
        name: 'pulse',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Adds breathing radial pulse keyframe wave around the dot.',
      },
      {
        name: 'icon',
        type: 'React.ReactNode',
        defaultValue: 'undefined',
        description: 'Optional leading icon slot.',
      },
    ],
    accessibilityNotes: [
      'Pure semantic text pill with optional aria-hidden decorative pulse beacon.',
      'Meets WCAG AA contrast standards across all variants.',
    ],
    features: [
      'Lightweight React & CSS keyframes',
      'Smooth breathing pulse radar beacon',
      'Compact & responsive token-driven colors',
    ],
  },
  {
    id: 'kinetic-text',
    slug: 'kinetic-text',
    name: 'Kinetic Text',
    description: 'Expressive typography interaction with GSAP character-level splitting, magnetic wave elevation, and kinetic bounce.',
    category: 'Typography & Motion',
    tags: ['gsap', 'typography', 'kinetic', 'motion', 'text', 'wave', 'split-text'],
    status: 'published',
    publishedAt: '2026-10-11',
    updatedAt: '2026-10-11',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/motion/KineticText.tsx',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/motion/KineticText.tsx',
    installSnippet: `// 1. Install GSAP:
npm install gsap

// 2. Import KineticText:
import { KineticText } from '@/components/ui/motion/KineticText';`,
    codeSnippet: `import React from 'react';
import { KineticText } from '@/components/ui/motion/KineticText';

export function TypographyShowcase() {
  return (
    <div style={{ padding: '2rem' }}>
      <KineticText
        as="h1"
        text="Modular UI, sculpted in real time."
        interactiveWave={true}
      />
    </div>
  );
}`,
    rawSourceCode: `import React, { useRef } from 'react';
import gsap from 'gsap';
import './KineticText.css';

export interface KineticTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
  accentIndices?: number[];
  interactiveWave?: boolean;
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  className = '',
  as: Component = 'h2',
  accentIndices = [],
  interactiveWave = true,
}) => {
  const containerRef = useRef<HTMLElement>(null);

  const handleMouseEnter = () => {
    if (!interactiveWave || !containerRef.current) return;
    const chars = containerRef.current.querySelectorAll('.kinetic-char');

    gsap.to(chars, {
      y: -12,
      scale: 1.08,
      rotationZ: () => (Math.random() - 0.5) * 12,
      color: '#ff5e3a',
      stagger: {
        each: 0.02,
        from: 'center',
        ease: 'power2.out',
      },
      duration: 0.25,
      yoyo: true,
      repeat: 1,
    });
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    const chars = containerRef.current.querySelectorAll('.kinetic-char');
    gsap.to(chars, {
      y: 0,
      scale: 1,
      rotationZ: 0,
      color: '',
      duration: 0.3,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  const words = text.split(' ');

  return (
    <Component
      // @ts-expect-error dynamic polymorphic ref
      ref={containerRef}
      className={\`kinetic-text-wrapper \${className}\`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {words.map((word, wIdx) => (
        <span key={wIdx} className="kinetic-word">
          {word.split('').map((char, cIdx) => {
            const globalIndex = wIdx * 10 + cIdx;
            const isAccent = accentIndices.includes(globalIndex);
            return (
              <span
                key={cIdx}
                className={\`kinetic-char \${isAccent ? 'kinetic-char--accent' : ''}\`}
              >
                {char}
              </span>
            );
          })}
          {wIdx < words.length - 1 && <span className="kinetic-space">&nbsp;</span>}
        </span>
      ))}
    </Component>
  );
};

export default KineticText;`,
    rawCssCode: `/* KineticText.css */
.kinetic-text-wrapper {
  display: inline-block;
  cursor: default;
  user-select: none;
  font-family: inherit;
  line-height: 1.15;
}

.kinetic-word {
  display: inline-block;
  white-space: nowrap;
}

.kinetic-char {
  display: inline-block;
  position: relative;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, color;
}

.kinetic-char--accent {
  color: var(--accent-primary, #ff5e3a);
}

.kinetic-space {
  display: inline-block;
} `,
    propsDoc: [
      {
        name: 'text',
        type: 'string',
        description: 'Input string to decompose and animate kinetically.',
        required: true,
      },
      {
        name: 'as',
        type: "'h1' | 'h2' | 'h3' | 'span' | 'div'",
        defaultValue: "'h2'",
        description: 'Semantic HTML tag to render.',
      },
      {
        name: 'interactiveWave',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Trigger GSAP ripple wave across character indices on hover.',
      },
    ],
    accessibilityNotes: [
      'Accessible text node preserved for screen readers without disruption.',
      'Characters marked with will-change for high performance rendering.',
    ],
    features: [
      'Zero layout shift character decomposition',
      'Smooth GSAP timeline easing',
      'Customizable per-character accent coloring',
    ],
  },
];
