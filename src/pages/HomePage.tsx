import React, { useEffect } from 'react';
import {
  HeroSection,
  StudioSection,
  FeaturedSection,
  StackedCardsSection,
  SandboxSection,
} from '../components/home';
import './HomePage.css';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
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
      {/* 1. Hero Section with Interactive Pixel Grid & nested Studio Stage */}
      <HeroSection onNavigate={onNavigate}>
        <StudioSection onNavigate={onNavigate} />
      </HeroSection>

      {/* 2. Featured 3-Card Showcase Grid */}
      <FeaturedSection onNavigate={onNavigate} />

      {/* 3. Architectural Spec Sheet (Sticky Stacked Cards on Scroll) */}
      <StackedCardsSection onNavigate={onNavigate} />

      {/* 4. Developer Architectural Sandbox & Code Terminal */}
      <SandboxSection onNavigate={onNavigate} />
    </div>
  );
};

export default HomePage;
