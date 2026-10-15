import React, { useState, useEffect, useRef } from 'react';
import { COMPONENT_REGISTRY } from '../../registry/components';
import './HeroSection.css';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
  children?: React.ReactNode;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, children }) => {
  const [promptText, setPromptText] = useState('');
  const [typedTitle, setTypedTitle] = useState('');
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Typewriter effect for "crafted with character."
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

  // Interactive Pixel Grid Trail in Hero Section
  useEffect(() => {
    const canvas = gridCanvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const CELL_SIZE = 56;
    const BOX_LIFETIME = 1400;
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

      activeBoxes = activeBoxes.filter((b) => now - b.addedAt < BOX_LIFETIME);

      const canvasDocX = rect.left + window.scrollX;
      const canvasDocY = rect.top + window.scrollY;

      for (const box of activeBoxes) {
        const age = now - box.addedAt;
        const progress = age / BOX_LIFETIME;
        const opacity = Math.max(0, 1 - progress);

        const drawX = box.col * CELL_SIZE - canvasDocX;
        const drawY = box.row * CELL_SIZE - canvasDocY;

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
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return;
      }

      const docX = e.clientX + window.scrollX;
      const docY = e.clientY + window.scrollY;

      const col = Math.floor(docX / CELL_SIZE);
      const row = Math.floor(docY / CELL_SIZE);

      const now = performance.now();
      const existing = activeBoxes.find((b) => b.col === col && b.row === row);
      if (existing) {
        existing.addedAt = now;
      } else {
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

  return (
    <div className="modui-hero-wrap" ref={heroRef as React.RefObject<HTMLDivElement>}>
      <canvas ref={gridCanvasRef} className="modui-hero-grid-canvas" />
      <section className="modui-hero-section">
        {/* Sculpted Editorial Headline */}
        <h1 className="modui-headline">
          <span className="modui-headline-line">Modular UI,</span>
          <span className="modui-headline-line modui-headline-serif">
            {typedTitle}
            <span className="modui-cursor-caret" aria-hidden="true">|</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="modui-hero-subtitle">
          An open catalogue of premium, animated React components and interaction patterns.
          Engineered with pure CSS, zero runtime lock-in, and full source code transparency.
        </p>

        {/* Primary CTA Buttons */}
        <div className="modui-hero-cta-row">
          <button
            onClick={() => onNavigate('/components')}
            className="modui-cta-btn"
          >
            <span>Explore All Components</span>
          </button>
          <button
            onClick={() => onNavigate('/docs')}
            className="modui-secondary-btn"
          >
            <span>Read Documentation</span>
          </button>
        </div>

        {/* Search Bar */}
        <form className="modui-composer-bar" onSubmit={handlePromptSubmit}>
          <input
            type="text"
            className="modui-composer-input"
            placeholder="Search components (e.g. Button, Dock, Carousel)..."
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
          />
          <button type="submit" className="modui-composer-submit-btn">
            Find
          </button>
        </form>

        {/* Studio Section / Children */}
        {children}

        {/* Technology Ecosystem Bar */}
        <div className="modui-ecosystem-strip">
          <span className="modui-ecosystem-label">Architecture</span>
          <div className="modui-ecosystem-badges">
            <span className="modui-eco-tag">React 19</span>
            <span className="modui-eco-dot">•</span>
            <span className="modui-eco-tag">TypeScript</span>
            <span className="modui-eco-dot">•</span>
            <span className="modui-eco-tag">Pure CSS</span>
            <span className="modui-eco-dot">•</span>
            <span className="modui-eco-tag">Zero Runtime Dependencies</span>
          </div>
        </div>
      </section>
    </div>
  );
};
