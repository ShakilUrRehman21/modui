import React from 'react';
import {
  HeroSection,
  ComponentMarquee,
  FeaturedSection,
  StackedCardsSection,
  SandboxSection,
} from '../components/home';
import './HomePage.css';

interface HomePageProps {
  onNavigate: (path: string) => void;
  theme?: 'light' | 'dark';
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, theme }) => {
  return (
    <div className="modui-home">
      {/* 1. Creative Playground Hero Section */}
      <HeroSection onNavigate={onNavigate} />

      {/* 2. Endless index of every component */}
      <ComponentMarquee onNavigate={onNavigate} />

      {/* 3. Featured 3-Card Showcase Grid */}
      <FeaturedSection onNavigate={onNavigate} theme={theme} />

      {/* 4. Architectural Spec Sheet (Sticky Stacked Cards on Scroll) */}
      <StackedCardsSection onNavigate={onNavigate} />

      {/* 5. Developer Architectural Sandbox & Code Terminal */}
      <SandboxSection onNavigate={onNavigate} />
    </div>
  );
};

export default HomePage;
