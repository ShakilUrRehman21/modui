import React from 'react';

export interface ComponentDemoProps {
  theme?: 'light' | 'dark';
}

export const COMPONENT_DEMOS: Record<string, React.LazyExoticComponent<React.ComponentType<ComponentDemoProps>>> = {
  'animated-button': React.lazy(() => import('./AnimatedButtonDemo')),
  'badge': React.lazy(() => import('./BadgeDemo')),
  'kinetic-text': React.lazy(() => import('./KineticTextDemo')),
  'number-ticker': React.lazy(() => import('./NumberTickerDemo')),
  'cylindrical-carousel': React.lazy(() => import('./CylindricalCarouselDemo')),
  'floating-dock': React.lazy(() => import('./FloatingDockDemo')),
  'radial-orbit-hub': React.lazy(() => import('./RadialOrbitHubDemo')),
  'fluid-elastic-accordion': React.lazy(() => import('./FluidElasticAccordionDemo')),
  'before-after-slider': React.lazy(() => import('./BeforeAfterSliderDemo')),
  'rotary-jog-wheel': React.lazy(() => import('./RotaryJogWheelDemo')),
  'cyber-stream-matrix': React.lazy(() => import('./CyberStreamMatrixDemo')),
  'caustic-ripple-surface': React.lazy(() => import('./CausticRippleSurfaceDemo')),
  'neural-cloth-mesh': React.lazy(() => import('./NeuralClothMeshDemo')),
  'aperture-iris-lens': React.lazy(() => import('./ApertureIrisLensDemo')),
  'chromatic-prism-card': React.lazy(() => import('./ChromaticPrismCardDemo')),
  'filmstrip-gallery': React.lazy(() => import('./FilmstripGalleryDemo')),
  'card-stack': React.lazy(() => import('./CardStackDemo')),
  'timeline-roadmap': React.lazy(() => import('./TimelineRoadmapDemo')),
  'reel-tape-deck': React.lazy(() => import('./ReelTapeDeckDemo')),
  'story-timeline': React.lazy(() => import('./StoryTimelineDemo')),
  'spatial-gallery': React.lazy(() => import('./SpatialGalleryDemo')),
  'page-turn-book': React.lazy(() => import('./PageTurnBookDemo')),
  'point-cloud-morpher': React.lazy(() => import('./PointCloudMorpherDemo')),
  'perspective-text-ribbon': React.lazy(() => import('./PerspectiveTextRibbonDemo')),
  'quantum-orbit-beacon': React.lazy(() => import('./QuantumOrbitBeaconDemo')),
  'infinite-canvas-gallery': React.lazy(() => import('./InfiniteCanvasGalleryDemo')),
  'magnetic-project-list': React.lazy(() => import('./MagneticProjectListDemo')),
  'polaroid': React.lazy(() => import('./PolaroidDemo')),
  'neural-graph': React.lazy(() => import('./NeuralGraphDemo')),
};

export default COMPONENT_DEMOS;