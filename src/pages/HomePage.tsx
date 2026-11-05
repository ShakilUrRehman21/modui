import React, { useEffect } from 'react';
import {
  HeroSection,
  MetricsRibbon,
  FeaturedSection,
  StackedCardsSection,
  SandboxSection,
} from '../components/home';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './HomePage.css';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  // Activate universal scroll-triggered slide-in, fade-in, and graceful fade-out
  useScrollReveal();

  // Fluid cursor tracking spotlight
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <div className="modui-home">
      {/* 1. Creative Playground Hero Section */}
      <HeroSection onNavigate={onNavigate} />

      {/* 2. Organized Architectural Metrics Ribbon */}
      <MetricsRibbon />

      {/* 3. Featured 3-Card Showcase Grid */}
      <FeaturedSection onNavigate={onNavigate} />

      {/* 4. Architectural Spec Sheet (Sticky Stacked Cards on Scroll) */}
      <StackedCardsSection onNavigate={onNavigate} />

      {/* 5. Developer Architectural Sandbox & Code Terminal */}
      <SandboxSection onNavigate={onNavigate} />
    </div>
  );
};

export default HomePage;
