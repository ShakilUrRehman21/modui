import React, { useState, useEffect } from 'react';
import { FloatingDock } from '../../components/ui/dock';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function FloatingDockDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [dockVariant, setDockVariant] = useState<'glass' | 'solid' | 'minimal' | 'dark'>(() => isDark ? 'dark' : 'solid');
    const [dockOrientation, setDockOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
    const [dockActiveId, setDockActiveId] = useState('home');

  useEffect(() => {
    setDockVariant(isDark ? 'dark' : 'solid');
  }, [theme]);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{
                        width: '100%',
                        minHeight: '260px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2.5rem 1rem',
                        background: dockVariant === 'dark'
                          ? 'radial-gradient(circle at center, #1E293B 0%, #0F172A 100%)'
                          : 'radial-gradient(circle at center, rgba(54, 92, 245, 0.05) 0%, transparent 70%)',
                        borderRadius: '16px',
                        transition: 'background 0.3s ease',
                      }}>
                        <FloatingDock
                          items={[
                            {
                              id: 'home',
                              label: 'Home',
                              shortcut: '⌘1',
                              icon: (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                  <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                              ),
                            },
                            {
                              id: 'explore',
                              label: 'Explore Components',
                              shortcut: '⌘2',
                              badge: 'New',
                              icon: (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10" />
                                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                                </svg>
                              ),
                            },
                            {
                              id: 'layers',
                              label: 'Architecture Layers',
                              shortcut: '⌘3',
                              icon: (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                                  <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                                  <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                                </svg>
                              ),
                            },
                            {
                              id: 'notifications',
                              label: 'System Telemetry',
                              shortcut: '⌘4',
                              badge: 5,
                              badgeVariant: 'count',
                              icon: (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                                </svg>
                              ),
                            },
                            {
                              id: 'terminal',
                              label: 'Interactive Console',
                              shortcut: '⌘5',
                              icon: (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="4 17 10 11 4 5" />
                                  <line x1="12" x2="20" y1="19" y2="19" />
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
                          activeId={dockActiveId}
                          onSelect={(id) => setDockActiveId(id)}
                          variant={dockVariant}
                          orientation={dockOrientation}
                        />
                        <div style={{ marginTop: '1.25rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: dockVariant === 'dark' ? '#94A3B8' : 'var(--text-tertiary)' }}>
                          Active Selection: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{dockActiveId}</span>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Surface Shell</label>
                      <select
                        className="modui-control-select"
                        value={dockVariant}
                        onChange={(e) => setDockVariant(e.target.value as any)}
                      >
                        <option value="glass">Frosted Glass (Light)</option>
                        <option value="dark">Dark Obsidian Glass</option>
                        <option value="solid">Crisp Solid Surface</option>
                        <option value="minimal">Minimal Wireframe</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Orientation</label>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {(['horizontal', 'vertical'] as const).map((orient) => (
                          <button
                            key={orient}
                            type="button"
                            className={`modui-pill-toggle ${dockOrientation === orient ? 'modui-pill-toggle--active' : ''}`}
                            onClick={() => setDockOrientation(orient)}
                          >
                            {orient.charAt(0).toUpperCase() + orient.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
    </>
  );
}
