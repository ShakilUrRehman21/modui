import React, { useState, useEffect } from 'react';
import { TimelineRoadmap } from '../../components/ui/timeline';
import type { TimelineVariant, TimelineOrientation } from '../../components/ui/timeline';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function TimelineRoadmapDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [timelineVariant, setTimelineVariant] = useState<TimelineVariant>(() => isDark ? 'cinema-dark' : 'studio-light');
    const [timelineOrientation, setTimelineOrientation] = useState<TimelineOrientation>('vertical');
    const [timelineSound, setTimelineSound] = useState<boolean>(true);
    const [timelineActiveTitle, setTimelineActiveTitle] = useState<string>('Dynamic Design Tokens');

  useEffect(() => {
    setTimelineVariant(isDark ? 'cinema-dark' : 'studio-light');
  }, [theme]);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: timelineOrientation === 'vertical' ? '560px' : '900px', margin: '0 auto', padding: '1.5rem 0', display: 'flex', flexDirection: 'column' }}>
                        <TimelineRoadmap
                          variant={timelineVariant}
                          orientation={timelineOrientation}
                          soundEnabled={timelineSound}
                          onSelectMilestone={(item) => setTimelineActiveTitle(item.title)}
                        />
                        <div style={{ marginTop: '1.5rem', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                          Active Milestone: <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{timelineActiveTitle}</span>
                          <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                            Click any milestone node or card, or use keyboard arrow keys to navigate the continuous progress spine.
                          </div>
                        </div>
                      </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Surface Finish</label>
                      <select
                        className="modui-control-select"
                        value={timelineVariant}
                        onChange={(e) => setTimelineVariant(e.target.value as TimelineVariant)}
                      >
                        <option value="studio-light">Studio Light (ModUI Standard)</option>
                        <option value="warm-editorial">Warm Editorial (Linen & Coral)</option>
                        <option value="minimal-mono">Minimal Mono (High Contrast)</option>
                        <option value="cinema-dark">Cinema Dark (35mm Slate)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Layout Flow</label>
                      <select
                        className="modui-control-select"
                        value={timelineOrientation}
                        onChange={(e) => setTimelineOrientation(e.target.value as TimelineOrientation)}
                      >
                        <option value="vertical">Vertical (Changelog Stream)</option>
                        <option value="horizontal">Horizontal (Roadmap Track)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Acoustics</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={timelineSound}
                            onChange={(e) => setTimelineSound(e.target.checked)}
                          />
                          <span>Web Audio Latch Haptics</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
