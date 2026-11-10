import React, { useState, useEffect } from 'react';
import { MagneticProjectList } from '../../components/ui/magnetic-project-list';
import type { ProjectListVariant } from '../../components/ui/magnetic-project-list';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function MagneticProjectListDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [projectListVariant, setProjectListVariant] = useState<ProjectListVariant>(() => isDark ? 'dark-slate' : 'studio-light');
    const [projectListSound, setProjectListSound] = useState<boolean>(true);
    const [projectListTilt, setProjectListTilt] = useState<boolean>(true);
    const [projectListActiveTitle, setProjectListActiveTitle] = useState<string>('Aether Sound Core');

  useEffect(() => {
    setProjectListVariant(isDark ? 'dark-slate' : 'studio-light');
  }, [theme]);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto', padding: '1rem 0', display: 'flex', flexDirection: 'column' }}>
                        <MagneticProjectList
                          variant={projectListVariant}
                          soundEnabled={projectListSound}
                          enableVelocityTilt={projectListTilt}
                          onProjectHover={(p) => p && setProjectListActiveTitle(p.title)}
                          onProjectClick={(p) => setProjectListActiveTitle(`${p.title} (Selected)`)}
                        />
                        <div style={{ marginTop: '1.25rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                          Inspecting Case Study: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{projectListActiveTitle}</span>
                          <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                            Hover across rows to summon the floating preview card with velocity tilt. Press ArrowDown / ArrowUp to cycle with keyboard navigation.
                          </div>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Aesthetic Finish</label>
                      <select
                        className="modui-control-select"
                        value={projectListVariant}
                        onChange={(e) => setProjectListVariant(e.target.value as ProjectListVariant)}
                      >
                        <option value="studio-light">Studio Light (ModUI Standard)</option>
                        <option value="dark-slate">Dark Slate (Cyber Charcoal)</option>
                        <option value="editorial-paper">Editorial Paper (Linen & Stone)</option>
                        <option value="minimal-mono">Minimal Mono (High Contrast)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Interactions & Physics</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={projectListTilt}
                            onChange={(e) => setProjectListTilt(e.target.checked)}
                          />
                          <span>Velocity-Damped 3D Tilt</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={projectListSound}
                            onChange={(e) => setProjectListSound(e.target.checked)}
                          />
                          <span>Web Audio Micro-Haptic Ticks</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
