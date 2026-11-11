import React, { useState, useEffect } from 'react';
import { NeuralGraph } from '../../components/ui/neural-graph';
import type { NeuralGraphVariant } from '../../components/ui/neural-graph';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function NeuralGraphDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [neuralVariant, setNeuralVariant] = useState<NeuralGraphVariant>(() => isDark ? 'dark-slate' : 'studio-light');
    const [neuralSound, setNeuralSound] = useState<boolean>(true);
    const [neuralAutoPulse, setNeuralAutoPulse] = useState<boolean>(true);
    const [neuralSelectedNodeTitle, setNeuralSelectedNodeTitle] = useState<string>('Semantic Nexus');

  useEffect(() => {
    setNeuralVariant(isDark ? 'dark-slate' : 'studio-light');
  }, [theme]);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto', padding: '1rem 0', display: 'flex', flexDirection: 'column' }}>
                        <NeuralGraph
                          variant={neuralVariant}
                          soundEnabled={neuralSound}
                          autoPulse={neuralAutoPulse}
                          onSelectNode={(node) => setNeuralSelectedNodeTitle(node ? node.label : 'None')}
                        />
                        <div className="modui-stage-caption">
                          Focused Node: <span className="modui-stage-caption-value">{neuralSelectedNodeTitle}</span>
                          <div className="modui-stage-caption-hint">
                            Drag nodes to stretch spring constraints, click nodes to fire synaptic action potentials, or drag canvas background to pan & wheel to zoom.
                          </div>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Surface Finish</label>
                      <select
                        className="modui-control-select"
                        value={neuralVariant}
                        onChange={(e) => setNeuralVariant(e.target.value as NeuralGraphVariant)}
                      >
                        <option value="studio-light">Studio Light (ModUI Standard)</option>
                        <option value="dark-slate">Dark Slate (Cyber Graphite)</option>
                        <option value="warm-editorial">Warm Editorial (Linen & Terracotta)</option>
                        <option value="quantum-violet">Quantum Violet (Bioluminescent)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Acoustics & Simulation</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={neuralSound}
                            onChange={(e) => setNeuralSound(e.target.checked)}
                          />
                          <span>Web Audio Micro-Tonal Chimes</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={neuralAutoPulse}
                            onChange={(e) => setNeuralAutoPulse(e.target.checked)}
                          />
                          <span>Ambient Synapse Pulses</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
