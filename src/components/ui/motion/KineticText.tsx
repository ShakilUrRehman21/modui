import React, { useRef } from 'react';
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
      className={`kinetic-text-wrapper ${className}`}
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
                className={`kinetic-char ${isAccent ? 'kinetic-char--accent' : ''}`}
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

export default KineticText;
