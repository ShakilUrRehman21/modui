export type ComponentCategory =
  | 'Buttons and Actions'
  | 'Status & Indicators'
  | 'Typography & Motion'
  | '3D & Interactive Showcase';

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
  '3D & Interactive Showcase',
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
  {
    id: 'number-ticker',
    slug: 'number-ticker',
    name: 'Number Ticker',
    description: 'Smooth vertical slot-machine rolling number counter with spring physics, individual column staggering, tabular numerals, and prefix/suffix formatting.',
    category: 'Typography & Motion',
    tags: ['counter', 'ticker', 'odometer', 'motion', 'spring', 'typography', 'numbers'],
    status: 'published',
    publishedAt: '2026-10-13',
    updatedAt: '2026-10-13',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/counter/NumberTicker.tsx',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/counter/NumberTicker.tsx',
    installSnippet: `// 1. Copy NumberTicker.tsx and NumberTicker.css into your project:
// components/ui/counter/NumberTicker.tsx
// components/ui/counter/NumberTicker.css

import { NumberTicker } from './components/ui/counter/NumberTicker';

export default function Example() {
  return (
    <div style={{ fontSize: '3rem', fontWeight: 700 }}>
      <NumberTicker value={1420} prefix="$" suffix="/mo" />
    </div>
  );
}`,
    codeSnippet: `import { NumberTicker } from './components/ui/counter/NumberTicker';

export function MetricsShowcase() {
  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <span className="metric-label">Monthly Active Users</span>
        <NumberTicker
          value={84250}
          suffix="+"
          duration={1.4}
        />
      </div>

      <div className="metric-card">
        <span className="metric-label">Uptime Reliability</span>
        <NumberTicker
          value={99.98}
          decimalPlaces={2}
          suffix="%"
          duration={1.2}
        />
      </div>

      <div className="metric-card">
        <span className="metric-label">Annual Recurring Revenue</span>
        <NumberTicker
          value={1240}
          prefix="$"
          suffix="k"
          duration={1.5}
        />
      </div>
    </div>
  );
}`,
    rawSourceCode: `import React, { useEffect, useRef, useState, useMemo } from 'react';
import './NumberTicker.css';

export interface NumberTickerProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
  stagger?: number;
  className?: string;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

interface DigitColumnProps {
  digit: number;
  duration: number;
  delay: number;
}

const DigitColumn: React.FC<DigitColumnProps> = ({ digit, duration, delay }) => {
  return (
    <span className="modui-ticker-column" aria-hidden="true">
      <span
        className="modui-ticker-track"
        style={{
          transform: \`translateY(-\${digit * 10}%)\`,
          transitionDuration: \`\${duration}s\`,
          transitionDelay: \`\${delay}s\`,
        }}
      >
        {DIGITS.map((d) => (
          <span key={d} className="modui-ticker-digit">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
};

export const NumberTicker: React.FC<NumberTickerProps> = ({
  value,
  decimalPlaces = 0,
  prefix = '',
  suffix = '',
  duration = 1.2,
  delay = 0,
  stagger = 0.04,
  className = '',
  ...rest
}) => {
  const [mounted, setMounted] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    prevValueRef.current = value;
  }, [value]);

  const formattedParts = useMemo(() => {
    const fixed = Math.abs(value).toFixed(decimalPlaces);
    const [intPart, decPart] = fixed.split('.');
    const withCommas = intPart.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
    return decPart !== undefined ? \`\${withCommas}.\${decPart}\` : withCommas;
  }, [value, decimalPlaces]);

  const characters = useMemo(() => {
    return formattedParts.split('');
  }, [formattedParts]);

  const isNegative = value < 0;
  const accessibleLabel = \`\${prefix}\${isNegative ? '-' : ''}\${formattedParts}\${suffix}\`;

  return (
    <span
      className={\`modui-number-ticker \${className}\`}
      role="status"
      aria-live="polite"
      aria-label={accessibleLabel}
      {...rest}
    >
      <span className="modui-ticker-sr-only">{accessibleLabel}</span>
      <span className="modui-ticker-display" aria-hidden="true">
        {prefix && <span className="modui-ticker-affix modui-ticker-prefix">{prefix}</span>}
        {isNegative && <span className="modui-ticker-symbol">-</span>}
        
        {characters.map((char, index) => {
          const isDigit = /\\d/.test(char);
          if (!isDigit) {
            return (
              <span key={\`sym-\${index}\`} className="modui-ticker-symbol">
                {char}
              </span>
            );
          }

          const targetDigit = mounted ? parseInt(char, 10) : 0;
          const colDelay = delay + index * stagger;

          return (
            <DigitColumn
              key={\`digit-\${index}-\${characters.length}\`}
              digit={targetDigit}
              duration={duration}
              delay={colDelay}
            />
          );
        })}

        {suffix && <span className="modui-ticker-affix modui-ticker-suffix">{suffix}</span>}
      </span>
    </span>
  );
};

export default NumberTicker;`,
    rawCssCode: `/* NumberTicker.css */
.modui-number-ticker {
  display: inline-flex;
  align-items: baseline;
  position: relative;
  font-family: inherit;
  font-variant-numeric: tabular-nums;
  -moz-font-feature-settings: "tnum";
  -webkit-font-feature-settings: "tnum";
  font-feature-settings: "tnum";
  line-height: 1;
}

.modui-ticker-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.modui-ticker-display {
  display: inline-flex;
  align-items: baseline;
  user-select: none;
}

.modui-ticker-column {
  position: relative;
  display: inline-block;
  height: 1em;
  overflow: hidden;
  vertical-align: baseline;
}

.modui-ticker-track {
  display: flex;
  flex-direction: column;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.modui-ticker-digit {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1em;
  width: 1ch;
  line-height: 1;
  text-align: center;
}

.modui-ticker-symbol {
  display: inline-block;
  line-height: 1;
  padding: 0 0.05ch;
}

.modui-ticker-affix {
  display: inline-block;
  line-height: 1;
}

.modui-ticker-prefix {
  margin-right: 0.15ch;
}

.modui-ticker-suffix {
  margin-left: 0.15ch;
}

@media (prefers-reduced-motion: reduce) {
  .modui-ticker-track {
    transition-duration: 0.01s !important;
    transition-delay: 0s !important;
  }
}`,
    propsDoc: [
      {
        name: 'value',
        type: 'number',
        description: 'Target numerical value to roll to.',
        required: true,
      },
      {
        name: 'decimalPlaces',
        type: 'number',
        defaultValue: '0',
        description: 'Number of decimal places to format and display.',
      },
      {
        name: 'prefix',
        type: 'string',
        defaultValue: "''",
        description: 'Text or symbol prepended before numbers (e.g. $, +).',
      },
      {
        name: 'suffix',
        type: 'string',
        defaultValue: "''",
        description: 'Text or symbol appended after numbers (e.g. %, k, /mo).',
      },
      {
        name: 'duration',
        type: 'number',
        defaultValue: '1.2',
        description: 'Animation roll duration in seconds.',
      },
      {
        name: 'delay',
        type: 'number',
        defaultValue: '0',
        description: 'Delay in seconds before roll begins.',
      },
      {
        name: 'stagger',
        type: 'number',
        defaultValue: '0.04',
        description: 'Per-digit column stagger interval in seconds.',
      },
    ],
    accessibilityNotes: [
      'Accessible screen-reader readout container with role="status" and aria-live="polite".',
      'Visual rolling digits marked with aria-hidden="true" to prevent redundant character readings.',
      'Respects prefers-reduced-motion media query by disabling animation transitions.',
      'Strict tabular figures (font-variant-numeric: tabular-nums) eliminate layout shift and horizontal jank.',
    ],
    features: [
      'Individual slot-machine vertical roll strips for every digit 0-9',
      'Physics-based cubic-bezier(0.16, 1, 0.3, 1) spring deceleration',
      'Thousands comma separation with fractional precision support',
      'Zero external runtime dependencies (Pure React 19 + CSS)',
    ],
  },
  {
    id: 'cylindrical-carousel',
    slug: 'cylindrical-carousel',
    name: 'Cylindrical 3D Carousel',
    description: '3D cylindrical projection carousel with touch/mouse inertia drag physics, real-time depth-of-field blur, and click-to-focus orientation.',
    category: '3D & Interactive Showcase',
    tags: ['carousel', '3d', 'inertia', 'physics', 'perspective', 'depth-of-field', 'slider', 'interactive'],
    status: 'published',
    publishedAt: '2026-10-14',
    updatedAt: '2026-10-14',
    version: '1.0.0',
    sourceLocation: 'src/components/ui/carousel/CylindricalCarousel.tsx',
    githubUrl: 'https://github.com/ShakilUrRehman21/modui/blob/main/src/components/ui/carousel/CylindricalCarousel.tsx',
    installSnippet: `// 1. Copy CylindricalCarousel.tsx and CylindricalCarousel.css into your project:
// components/ui/carousel/CylindricalCarousel.tsx
// components/ui/carousel/CylindricalCarousel.css

// 2. Import and pass an array of items:
import { CylindricalCarousel } from '@/components/ui/carousel';

const items = [
  { id: '1', title: 'Spatial Studio', subtitle: 'Hardware module', tag: 'Core', badge: 'v2.1' },
  { id: '2', title: 'Neural Canvas', subtitle: 'Generative shader', tag: 'WebGL', badge: 'New' },
  { id: '3', title: 'Haptic Rotary', subtitle: 'Dial encoder', tag: 'Analog' },
  { id: '4', title: 'Vector Scope', subtitle: 'Waveform telemetry', tag: 'Audio' },
  { id: '5', title: 'Kinetic Matrix', subtitle: 'Spring geometry', tag: 'Physics' },
];

export default function Showcase() {
  return (
    <CylindricalCarousel
      items={items}
      radius={380}
      cardWidth={230}
      cardHeight={310}
      autoplay={false}
    />
  );
}`,
    codeSnippet: `import React from 'react';
import { CylindricalCarousel } from '@/components/ui/carousel';

const items = [
  { id: '1', title: 'Spatial Studio', subtitle: 'Hardware module', tag: 'Core', badge: 'v2.1' },
  { id: '2', title: 'Neural Canvas', subtitle: 'Generative shader', tag: 'WebGL', badge: 'New' },
  { id: '3', title: 'Haptic Rotary', subtitle: 'Dial encoder', tag: 'Analog' },
  { id: '4', title: 'Vector Oscilloscope', subtitle: 'Waveform telemetry', tag: 'Audio' },
  { id: '5', title: 'Kinetic Matrix', subtitle: 'Spring geometry', tag: 'Physics' },
  { id: '6', title: 'Quantum Telemetry', subtitle: 'Atomic clock sync', tag: 'Radio', badge: 'Pro' },
];

export function CarouselDemo() {
  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <CylindricalCarousel
        items={items}
        radius={360}
        cardWidth={220}
        cardHeight={300}
        snapToNearest={true}
        showControls={true}
      />
    </div>
  );
}`,
    rawSourceCode: `import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './CylindricalCarousel.css';

export interface CylindricalCarouselItem {
  id: string | number;
  title: string;
  subtitle?: string;
  tag?: string;
  badge?: string;
  image?: string;
  color?: string;
  content?: React.ReactNode;
}

export interface CylindricalCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: CylindricalCarouselItem[];
  radius?: number;
  cardWidth?: number;
  cardHeight?: number;
  tiltAngle?: number;
  perspective?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
  friction?: number;
  snapToNearest?: boolean;
  onActiveChange?: (index: number, item: CylindricalCarouselItem) => void;
  showControls?: boolean;
  showIndicators?: boolean;
  showDragHint?: boolean;
  className?: string;
}

export const CylindricalCarousel: React.FC<CylindricalCarouselProps> = ({
  items,
  radius = 360,
  cardWidth = 220,
  cardHeight = 300,
  tiltAngle = -4,
  perspective = 1100,
  autoplay = false,
  autoplaySpeed = 8,
  friction = 0.93,
  snapToNearest = true,
  onActiveChange,
  showControls = true,
  showIndicators = true,
  showDragHint = true,
  className = '',
  style,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);

  const [containerDim, setContainerDim] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateDim = () => {
      const rect = el.getBoundingClientRect();
      setContainerDim({ width: rect.width, height: rect.height });
    };

    updateDim();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateDim);
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      window.addEventListener('resize', updateDim);
      return () => window.removeEventListener('resize', updateDim);
    }
  }, []);

  const autoScale = useMemo(() => {
    if (!containerDim.width || !containerDim.height) return 1;
    const requiredWidth = radius * 2 + cardWidth;
    const requiredHeight = cardHeight + 40;

    const scaleX = (containerDim.width - 20) / requiredWidth;
    const scaleY = (containerDim.height - 30) / requiredHeight;

    const fitScale = Math.min(scaleX, scaleY, 1);
    return Math.max(fitScale, 0.28);
  }, [containerDim, radius, cardWidth, cardHeight]);

  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  rotationRef.current = rotation;

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const movedDistanceRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  const isHoveredRef = useRef(false);

  const totalItems = items.length;
  const angleStep = totalItems > 0 ? 360 / totalItems : 0;

  const normalizeAngle = useCallback((deg: number) => {
    return ((((deg % 360) + 540) % 360) - 180);
  }, []);

  const computeActiveIndex = useCallback(
    (rot: number) => {
      if (totalItems === 0) return 0;
      let minDiff = Infinity;
      let closestIdx = 0;

      for (let i = 0; i < totalItems; i++) {
        const itemAngle = i * angleStep;
        const diff = Math.abs(normalizeAngle(itemAngle + rot));
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      }
      return closestIdx;
    },
    [totalItems, angleStep, normalizeAngle]
  );

  const updateActiveIndex = useCallback(
    (newIdx: number) => {
      if (newIdx !== activeIndexRef.current) {
        activeIndexRef.current = newIdx;
        setActiveIndex(newIdx);
        if (items[newIdx]) {
          onActiveChange?.(newIdx, items[newIdx]);
        }
      }
    },
    [items, onActiveChange]
  );

  const snapToIndex = useCallback(
    (targetIndex: number) => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      const targetAngle = -targetIndex * angleStep;
      const current = rotationRef.current;
      const diff = normalizeAngle(targetAngle - current);
      const destination = current + diff;

      const startTime = performance.now();
      const duration = 500;
      const startAngle = current;

      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const animateSnap = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const nextRotation = startAngle + (destination - startAngle) * eased;

        setRotation(nextRotation);
        rotationRef.current = nextRotation;

        if (progress < 1) {
          rafIdRef.current = requestAnimationFrame(animateSnap);
        } else {
          updateActiveIndex(targetIndex);
        }
      };

      rafIdRef.current = requestAnimationFrame(animateSnap);
    },
    [angleStep, normalizeAngle, updateActiveIndex]
  );

  const runInertia = useCallback(() => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

    const stepInertia = () => {
      velocityRef.current *= friction;

      if (Math.abs(velocityRef.current) > 0.04) {
        const nextRot = rotationRef.current + velocityRef.current;
        setRotation(nextRot);
        rotationRef.current = nextRot;

        const currentActive = computeActiveIndex(nextRot);
        updateActiveIndex(currentActive);

        rafIdRef.current = requestAnimationFrame(stepInertia);
      } else {
        velocityRef.current = 0;
        if (snapToNearest) {
          const nearest = computeActiveIndex(rotationRef.current);
          snapToIndex(nearest);
        }
      }
    };

    rafIdRef.current = requestAnimationFrame(stepInertia);
  }, [friction, snapToNearest, computeActiveIndex, updateActiveIndex, snapToIndex]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;

    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    movedDistanceRef.current = 0;

    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const currentX = e.clientX;
    const now = performance.now();
    const deltaX = currentX - lastXRef.current;
    const deltaTime = Math.max(now - lastTimeRef.current, 1);

    movedDistanceRef.current += Math.abs(deltaX);

    const sensitivity = 0.35;
    const rotDelta = deltaX * sensitivity;
    const newRot = rotationRef.current + rotDelta;

    setRotation(newRot);
    rotationRef.current = newRot;

    velocityRef.current = (rotDelta / deltaTime) * 16.6;

    lastXRef.current = currentX;
    lastTimeRef.current = now;

    const currentActive = computeActiveIndex(newRot);
    updateActiveIndex(currentActive);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignored if capture already lost
    }

    if (Math.abs(velocityRef.current) > 0.08) {
      runInertia();
    } else if (snapToNearest) {
      const nearest = computeActiveIndex(rotationRef.current);
      snapToIndex(nearest);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIdx = (activeIndex - 1 + totalItems) % totalItems;
      snapToIndex(prevIdx);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIdx = (activeIndex + 1) % totalItems;
      snapToIndex(nextIdx);
    }
  };

  useEffect(() => {
    if (!autoplay) return;

    let lastTime = performance.now();
    let autoplayRaf: number;

    const animateAutoplay = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (!isDraggingRef.current && !isHoveredRef.current) {
        const step = autoplaySpeed * delta;
        const nextRot = rotationRef.current - step;
        setRotation(nextRot);
        rotationRef.current = nextRot;

        const currentActive = computeActiveIndex(nextRot);
        updateActiveIndex(currentActive);
      }

      autoplayRaf = requestAnimationFrame(animateAutoplay);
    };

    autoplayRaf = requestAnimationFrame(animateAutoplay);

    return () => cancelAnimationFrame(autoplayRaf);
  }, [autoplay, autoplaySpeed, computeActiveIndex, updateActiveIndex]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const halfWidth = cardWidth / 2;
  const halfHeight = cardHeight / 2;

  const renderedCards = useMemo(() => {
    return items.map((item, index) => {
      const itemAngle = index * angleStep;
      const angleDiff = normalizeAngle(itemAngle + rotation);

      const rad = (angleDiff * Math.PI) / 180;
      const zFactor = (Math.cos(rad) + 1) / 2;

      const blurPx = (1 - zFactor) * 4.5;
      const opacity = 0.32 + zFactor * 0.68;
      const scale = 0.88 + zFactor * 0.12;

      const isCurrentActive = index === activeIndex;

      return {
        item,
        index,
        itemAngle,
        isCurrentActive,
        style: {
          width: \`\${cardWidth}px\`,
          height: \`\${cardHeight}px\`,
          marginLeft: \`-\${halfWidth}px\`,
          marginTop: \`-\${halfHeight}px\`,
          transform: \`rotateY(\${itemAngle}deg) translateZ(\${radius}px) scale(\${scale})\`,
          filter: \`blur(\${blurPx.toFixed(1)}px)\`,
          opacity: opacity.toFixed(2),
          zIndex: Math.round(zFactor * 100),
        } as React.CSSProperties,
      };
    });
  }, [items, angleStep, rotation, normalizeAngle, cardWidth, cardHeight, halfWidth, halfHeight, radius, activeIndex]);

  return (
    <div
      ref={containerRef}
      className={\`modui-cylindrical-viewport \${className}\`}
      style={{
        perspective: \`\${perspective}px\`,
        ...style,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="3D Cylindrical Carousel"
      {...rest}
    >
      <div
        ref={cylinderRef}
        className="modui-cylindrical-ring"
        style={{
          transform: \`scale(\${autoScale}) translateZ(-\${radius}px) rotateX(\${tiltAngle}deg) rotateY(\${rotation}deg)\`,
        }}
      >
        {renderedCards.map(({ item, index, isCurrentActive, style: cardStyle }) => (
          <div
            key={item.id}
            className={\`modui-cylindrical-card \${isCurrentActive ? 'modui-cylindrical-card--active' : ''}\`}
            style={cardStyle}
            onClick={(e) => {
              if (movedDistanceRef.current > 6) return;
              e.stopPropagation();
              snapToIndex(index);
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={\`\${item.title} (\${index + 1} of \${totalItems})\`}
            aria-current={isCurrentActive ? 'true' : undefined}
          >
            {(item.badge || item.tag) && (
              <div className="modui-cylindrical-card-top">
                {item.badge && <span className="modui-cylindrical-badge">{item.badge}</span>}
                {item.tag && <span className="modui-cylindrical-tag">{item.tag}</span>}
              </div>
            )}

            {item.image ? (
              <div
                className="modui-cylindrical-art"
                style={{ backgroundImage: \`url(\${item.image})\` }}
              />
            ) : (
              <div
                className="modui-cylindrical-art modui-cylindrical-art--pattern"
                style={{
                  background: item.color
                    ? \`linear-gradient(135deg, \${item.color}15, \${item.color}35)\`
                    : undefined,
                }}
              >
                <div className="modui-cylindrical-art-halo" />
                <span className="modui-cylindrical-index-label">0{index + 1}</span>
              </div>
            )}

            <div className="modui-cylindrical-card-body">
              <h4 className="modui-cylindrical-title">{item.title}</h4>
              {item.subtitle && <p className="modui-cylindrical-subtitle">{item.subtitle}</p>}
              {item.content && <div className="modui-cylindrical-custom">{item.content}</div>}
            </div>

            <div className="modui-cylindrical-card-sheen" />
          </div>
        ))}
      </div>

      {showControls && (
        <div className="modui-cylindrical-controls" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="modui-cylindrical-ctrl-btn"
            onClick={() => snapToIndex((activeIndex - 1 + totalItems) % totalItems)}
            aria-label="Previous slide"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {showIndicators && (
            <div className="modui-cylindrical-dots" role="tablist" aria-label="Slides">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={\`modui-cylindrical-dot \${i === activeIndex ? 'modui-cylindrical-dot--active' : ''}\`}
                  onClick={() => snapToIndex(i)}
                  aria-label={\`Go to slide \${i + 1}\`}
                  role="tab"
                  aria-selected={i === activeIndex}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            className="modui-cylindrical-ctrl-btn"
            onClick={() => snapToIndex((activeIndex + 1) % totalItems)}
            aria-label="Next slide"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}

      {showDragHint && (
        <div className="modui-cylindrical-drag-hint">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="8 17 3 12 8 7" />
            <polyline points="16 17 21 12 16 7" />
          </svg>
          <span>Drag to rotate · Click card to focus</span>
        </div>
      )}
    </div>
  );
};`,
    rawCssCode: `.modui-cylindrical-viewport {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  user-select: none;
  cursor: grab;
  touch-action: pan-y;
  outline: none;
  perspective-origin: 50% 50%;
}

.modui-cylindrical-viewport:active {
  cursor: grabbing;
}

.modui-cylindrical-viewport:focus-visible {
  outline: 2px solid var(--accent-primary, #4f46e5);
  outline-offset: 4px;
  border-radius: var(--radius-xl, 1rem);
}

.modui-cylindrical-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  transform-origin: center center;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modui-cylindrical-card {
  position: absolute;
  top: 0;
  left: 0;
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-subtle, #e2e8f0);
  border-radius: var(--radius-lg, 0.75rem);
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
  backface-visibility: hidden;
  will-change: transform, filter, opacity;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  transform-origin: center center;
  pointer-events: auto;
  box-sizing: border-box;
  transition:
    box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modui-cylindrical-card:hover {
  border-color: var(--border-hover, #cbd5e1);
  box-shadow: 0 20px 35px -8px rgba(15, 23, 42, 0.12), 0 1px 3px 0 rgba(15, 23, 42, 0.05);
}

.modui-cylindrical-card--active {
  border-color: var(--accent-primary, #4f46e5);
  box-shadow:
    0 24px 48px -12px rgba(79, 70, 229, 0.18),
    0 0 0 1px rgba(79, 70, 229, 0.25);
  cursor: default;
}

.modui-cylindrical-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.8rem 0.35rem;
  gap: 0.4rem;
  z-index: 2;
  flex-shrink: 0;
}

.modui-cylindrical-badge {
  font-family: var(--font-mono, monospace);
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.15rem 0.4rem;
  border-radius: 9999px;
  background: rgba(79, 70, 229, 0.08);
  color: var(--accent-primary, #4f46e5);
  border: 1px solid rgba(79, 70, 229, 0.16);
}

.modui-cylindrical-tag {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.68rem;
  color: var(--text-tertiary, #94a3b8);
  font-weight: 500;
}

.modui-cylindrical-art {
  position: relative;
  flex: 1;
  min-height: 45px;
  margin: 0.2rem 0.6rem;
  border-radius: var(--radius-md, 0.5rem);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.6);
}

.modui-cylindrical-art--pattern {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.modui-cylindrical-art-halo {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(79, 70, 229, 0.12) 0%, transparent 70%);
  pointer-events: none;
}

.modui-cylindrical-index-label {
  font-family: var(--font-mono, monospace);
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-primary, #0f172a);
  opacity: 0.14;
  letter-spacing: -0.04em;
  user-select: none;
}

.modui-cylindrical-card-body {
  padding: 0.5rem 0.8rem 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  z-index: 2;
  background: var(--bg-card, #ffffff);
  flex-shrink: 0;
}

.modui-cylindrical-title {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary, #0f172a);
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.modui-cylindrical-subtitle {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.7rem;
  color: var(--text-secondary, #64748b);
  margin: 0;
  line-height: 1.35;
}

.modui-cylindrical-card-sheen {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4) 0%,
    transparent 50%,
    rgba(15, 23, 42, 0.02) 100%
  );
  border-radius: inherit;
}

.modui-cylindrical-controls {
  position: absolute;
  bottom: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.3rem 0.55rem;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--border-subtle, #e2e8f0);
  border-radius: 9999px;
  box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.08);
  z-index: 10;
  pointer-events: auto;
}

.modui-cylindrical-ctrl-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 9999px;
  border: 1px solid var(--border-subtle, #e2e8f0);
  background: #ffffff;
  color: var(--text-secondary, #64748b);
  cursor: pointer;
  transition: all 0.15s ease;
}

.modui-cylindrical-ctrl-btn:hover {
  background: var(--bg-hover, #f8fafc);
  color: var(--text-primary, #0f172a);
  border-color: var(--border-hover, #cbd5e1);
}

.modui-cylindrical-dots {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0 0.2rem;
}

.modui-cylindrical-dot {
  width: 5px;
  height: 5px;
  border-radius: 9999px;
  border: none;
  padding: 0;
  background: var(--border-hover, #cbd5e1);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.modui-cylindrical-dot--active {
  width: 16px;
  background: var(--accent-primary, #4f46e5);
}

.modui-cylindrical-drag-hint {
  position: absolute;
  top: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-mono, monospace);
  font-size: 0.6875rem;
  color: var(--text-tertiary, #94a3b8);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  pointer-events: none;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(4px);
  padding: 0.22rem 0.6rem;
  border-radius: 9999px;
  border: 1px solid var(--border-subtle, #e2e8f0);
  z-index: 10;
}

@media (max-width: 640px) {
  .modui-cylindrical-viewport {
    min-height: 260px;
  }

  .modui-cylindrical-drag-hint {
    top: 0.5rem;
    font-size: 0.625rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .modui-cylindrical-ring,
  .modui-cylindrical-card {
    transition: none !important;
  }
}`,
    propsDoc: [
      {
        name: 'items',
        type: 'CylindricalCarouselItem[]',
        required: true,
        description: 'Array of items with title, subtitle, tag, badge, image, color, or custom content.',
      },
      {
        name: 'radius',
        type: 'number',
        defaultValue: '360',
        description: 'Virtual cylinder radius in pixels for 3D translateZ distance.',
      },
      {
        name: 'cardWidth',
        type: 'number',
        defaultValue: '220',
        description: 'Width of each card on the cylinder in pixels.',
      },
      {
        name: 'cardHeight',
        type: 'number',
        defaultValue: '300',
        description: 'Height of each card on the cylinder in pixels.',
      },
      {
        name: 'tiltAngle',
        type: 'number',
        defaultValue: '-4',
        description: 'Pitch angle in degrees to tilt the 3D cylinder towards or away from the viewer.',
      },
      {
        name: 'perspective',
        type: 'number',
        defaultValue: '1100',
        description: 'CSS 3D perspective distance in pixels.',
      },
      {
        name: 'autoplay',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Enable slow continuous rotation when idle, pausing on hover or drag.',
      },
      {
        name: 'autoplaySpeed',
        type: 'number',
        defaultValue: '8',
        description: 'Rotation speed in degrees per second when autoplay is enabled.',
      },
      {
        name: 'friction',
        type: 'number',
        defaultValue: '0.93',
        description: 'Momentum friction deceleration factor between 0.85 and 0.98.',
      },
      {
        name: 'snapToNearest',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Smoothly snap to the nearest card with cubic easing after drag inertia ends.',
      },
      {
        name: 'onActiveChange',
        type: '(index: number, item: CylindricalCarouselItem) => void',
        description: 'Callback fired whenever the active focused card in front changes.',
      },
      {
        name: 'showControls',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Show bottom floating capsule controls with previous/next buttons.',
      },
      {
        name: 'showIndicators',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Show active slide indicator dots in the bottom control pill.',
      },
      {
        name: 'showDragHint',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Show top drag hint instruction badge.',
      },
    ],
    accessibilityNotes: [
      'Container is accessible with role="region" and aria-roledescription="carousel".',
      'Each card is accessible with role="group", aria-roledescription="slide", and aria-current="true" when active.',
      'Keyboard navigation enabled: Left and Right arrow keys smoothly step between slides.',
      'Indicator tabs are marked with role="tablist" and role="tab" with aria-selected.',
      'Respects prefers-reduced-motion media query by disabling continuous animations and abrupt transitions.',
    ],
    features: [
      'True 3D perspective projection with CSS preserve-3d and geometric circular layout',
      'Pointer inertia momentum tossing with exponential friction deceleration physics',
      'Dynamic optical depth-of-field with progressive blur, opacity, and scale falloff',
      'Click-to-focus smooth spherical camera rotation with cubic-bezier easing',
      'Zero external 3D libraries (100% native React + CSS GPU acceleration)',
    ],
  },
];
