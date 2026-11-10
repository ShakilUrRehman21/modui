import React, { useState, useEffect } from 'react';
import { RadialOrbitHub } from '../../components/ui/radial-hub';
import type { RadialOrbitMode, RadialOrbitVariant } from '../../components/ui/radial-hub';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function RadialOrbitHubDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [orbitRadius, setOrbitRadius] = useState(115);
    const [orbitMode, setOrbitMode] = useState<RadialOrbitMode>('circle');
    const [orbitVariant, setOrbitVariant] = useState<RadialOrbitVariant>(() => isDark ? 'dark' : 'glass');
    const [orbitSound, setOrbitSound] = useState(true);
    const [orbitSelectedLabel, setOrbitSelectedLabel] = useState<string>('None (Click any node)');

  useEffect(() => {
    setOrbitVariant(isDark ? 'dark' : 'glass');
  }, [theme]);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '380px', position: 'relative' }}>
                        <RadialOrbitHub
                          items={[
                            {
                              id: 'search',
                              label: 'Spotlight Search',
                              shortcut: '⌘K',
                              icon: (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="11" cy="11" r="8" />
                                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                              ),
                            },
                            {
                              id: 'ai',
                              label: 'AI Synthesis',
                              badge: 'Pro',
                              icon: (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
                                </svg>
                              ),
                            },
                            {
                              id: 'layers',
                              label: 'Layer Stack',
                              icon: (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                                  <polyline points="2 17 12 22 22 17" />
                                  <polyline points="2 12 12 17 22 12" />
                                </svg>
                              ),
                            },
                            {
                              id: 'telemetry',
                              label: 'Telemetry Pulse',
                              icon: (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="18" y1="20" x2="18" y2="10" />
                                  <line x1="12" y1="20" x2="12" y2="4" />
                                  <line x1="6" y1="20" x2="6" y2="14" />
                                </svg>
                              ),
                            },
                            {
                              id: 'deploy',
                              label: 'Deploy Module',
                              badge: '99.9%',
                              icon: (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                                </svg>
                              ),
                            },
                            {
                              id: 'settings',
                              label: 'Preferences',
                              shortcut: '⌘,',
                              icon: (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="3" />
                                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                </svg>
                              ),
                            },
                          ]}
                          radius={orbitRadius}
                          mode={orbitMode}
                          variant={orbitVariant}
                          defaultOpen={false}
                          soundEnabled={orbitSound}
                          onSelect={(item) => setOrbitSelectedLabel(`${item.label} (${item.id})`)}
                        />
                        <div style={{ marginTop: '2rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                          Last Activated: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{orbitSelectedLabel}</span>
                          <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                            Tip: Drag the orbit ring to spin with rotational momentum, or press Tab / Enter
                          </div>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Surface Shell</label>
                      <select
                        className="modui-control-select"
                        value={orbitVariant}
                        onChange={(e) => setOrbitVariant(e.target.value as RadialOrbitVariant)}
                      >
                        <option value="glass">Frosted Glass (Light)</option>
                        <option value="dark">Dark Obsidian Glass</option>
                        <option value="neon">Cyber Neon Glow</option>
                        <option value="minimal">Minimal Wireframe</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Distribution Mode</label>
                      <select
                        className="modui-control-select"
                        value={orbitMode}
                        onChange={(e) => setOrbitMode(e.target.value as RadialOrbitMode)}
                      >
                        <option value="circle">Full 360° Circle</option>
                        <option value="fan-top">Fan Top (180°)</option>
                        <option value="fan-bottom">Fan Bottom (180°)</option>
                        <option value="fan-right">Fan Right (180°)</option>
                        <option value="fan-left">Fan Left (180°)</option>
                        <option value="quarter">Quarter Arc (90°)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Orbit Radius ({orbitRadius}px)</label>
                      <input
                        type="range"
                        min="85"
                        max="155"
                        step="5"
                        value={orbitRadius}
                        onChange={(e) => setOrbitRadius(parseInt(e.target.value, 10))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Synthesized Haptic Audio</label>
                      <label className="modui-control-toggle">
                        <input
                          type="checkbox"
                          checked={orbitSound}
                          onChange={(e) => setOrbitSound(e.target.checked)}
                        />
                        <span>Web Audio Mechanical Clicks</span>
                      </label>
                    </div>
                  </div>
    </>
  );
}
