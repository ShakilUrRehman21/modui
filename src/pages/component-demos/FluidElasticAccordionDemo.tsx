import React, { useState, useEffect } from 'react';
import { FluidElasticAccordion } from '../../components/ui/accordion';
import type { FluidAccordionOrientation, FluidAccordionVariant, FluidAccordionTrigger, FluidAccordionSpring } from '../../components/ui/accordion';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function FluidElasticAccordionDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [accordionOrientation, setAccordionOrientation] = useState<FluidAccordionOrientation>('horizontal');
    const [accordionVariant, setAccordionVariant] = useState<FluidAccordionVariant>(() => isDark ? 'dark' : 'light');
    const [accordionTrigger, setAccordionTrigger] = useState<FluidAccordionTrigger>('click');
    const [accordionSpring, setAccordionSpring] = useState<FluidAccordionSpring>('elastic');
    const [accordionSound, setAccordionSound] = useState(true);
    const [accordionLiquidEdge, setAccordionLiquidEdge] = useState(true);
    const [accordionRatio, setAccordionRatio] = useState(3.4);

  useEffect(() => {
    setAccordionVariant(isDark ? 'dark' : 'light');
  }, [theme]);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto', padding: '1rem 0' }}>
                        <FluidElasticAccordion
                          items={[
                            {
                              id: 'spatial',
                              number: '01',
                              title: 'Spatial Studio',
                              subtitle: 'Volumetric WebGL 2.0',
                              description: 'Real-time raymarching engine with procedural noise deformation, subsurface caustics, and cinematic bloom.',
                              tag: 'Core 3D',
                              color: '#4F46E5',
                              actionText: 'Explore Shaders',
                            },
                            {
                              id: 'rotary',
                              number: '02',
                              title: 'Haptic Rotary',
                              subtitle: 'Kinetic Dial Controller',
                              description: 'Hardware-grade brushed aluminum rotary jog wheel with angular notch snapping and synthesized micro-haptic audio ticks.',
                              tag: 'Hardware',
                              color: '#06B6D4',
                              actionText: 'Inspect Specs',
                            },
                            {
                              id: 'neural',
                              number: '03',
                              title: 'Neural Matrix',
                              subtitle: 'Spring Inertia Physics',
                              description: 'Adaptive non-linear elastic spring mesh featuring dynamic liquid SVG bezier edge boundary deformation under transition velocity.',
                              tag: 'Physics',
                              color: '#10B981',
                              actionText: 'View Architecture',
                            },
                            {
                              id: 'quantum',
                              number: '04',
                              title: 'Quantum Scope',
                              subtitle: 'Telemetry Waveforms',
                              description: 'Low-latency streaming signal graphs rendering high-frequency oscilloscope channels at fluid 120 FPS.',
                              tag: 'Telemetry',
                              color: '#F59E0B',
                              actionText: 'Launch Monitor',
                            },
                          ]}
                          defaultActiveId="spatial"
                          orientation={accordionOrientation}
                          variant={accordionVariant}
                          trigger={accordionTrigger}
                          springTension={accordionSpring}
                          soundEnabled={accordionSound}
                          enableLiquidEdge={accordionLiquidEdge}
                          expandedRatio={accordionRatio}
                        />
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Layout Orientation</label>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {(['horizontal', 'vertical'] as const).map((orient) => (
                          <button
                            key={orient}
                            type="button"
                            className={`modui-pill-toggle ${accordionOrientation === orient ? 'modui-pill-toggle--active' : ''}`}
                            onClick={() => setAccordionOrientation(orient)}
                          >
                            {orient === 'horizontal' ? 'Horizontal Filmstrip' : 'Vertical Stack'}
                          </button>
                        ))}
                      </div>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Surface Skin</label>
                      <select
                        className="modui-control-select"
                        value={accordionVariant}
                        onChange={(e) => setAccordionVariant(e.target.value as FluidAccordionVariant)}
                      >
                        <option value="light">Crisp Light Studio</option>
                        <option value="dark">Dark Obsidian</option>
                        <option value="glass">Frosted Translucent Glass</option>
                        <option value="editorial">Warm Titanium Editorial</option>
                        <option value="minimal">Minimal Monochrome</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Interaction Trigger</label>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {(['click', 'hover'] as const).map((trig) => (
                          <button
                            key={trig}
                            type="button"
                            className={`modui-pill-toggle ${accordionTrigger === trig ? 'modui-pill-toggle--active' : ''}`}
                            onClick={() => setAccordionTrigger(trig)}
                          >
                            {trig.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Spring Tension Physics</label>
                      <select
                        className="modui-control-select"
                        value={accordionSpring}
                        onChange={(e) => setAccordionSpring(e.target.value as FluidAccordionSpring)}
                      >
                        <option value="elastic">Elastic Bounce (0.65s)</option>
                        <option value="snappy">Snappy Linear (0.42s)</option>
                        <option value="gentle">Gentle Cinematic (0.85s)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Expansion Ratio ({accordionRatio}x)</label>
                      <input
                        type="range"
                        min="2.0"
                        max="5.0"
                        step="0.2"
                        value={accordionRatio}
                        onChange={(e) => setAccordionRatio(parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Liquid Edge & Acoustics</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={accordionLiquidEdge}
                            onChange={(e) => setAccordionLiquidEdge(e.target.checked)}
                          />
                          <span>Liquid Bezier Boundary Wave</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={accordionSound}
                            onChange={(e) => setAccordionSound(e.target.checked)}
                          />
                          <span>Web Audio Micro-Haptics</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
