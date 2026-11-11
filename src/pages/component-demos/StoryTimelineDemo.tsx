import React, { useState, useEffect } from 'react';
import { StoryTimeline } from '../../components/ui/story-timeline';
import type { StoryTimelineVariant } from '../../components/ui/story-timeline';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function StoryTimelineDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  // (Instagram Stories)
  const [storyVariant, setStoryVariant] = useState<StoryTimelineVariant>(() => isDark ? 'instagram-dark' : 'editorial-paper');
  const [storySound, setStorySound] = useState<boolean>(true);
  const [storyAutoPlay, setStoryAutoPlay] = useState<boolean>(true);
  const [storyActiveTitle, setStoryActiveTitle] = useState<string>('The Brass Dial Experiment');

  useEffect(() => {
    setStoryVariant(isDark ? 'instagram-dark' : 'editorial-paper');
  }, [theme]);

  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ width: '100%', maxWidth: '880px', margin: '0 auto', padding: '1rem 0', display: 'flex', flexDirection: 'column' }}>
          <StoryTimeline
            variant={storyVariant}
            soundEnabled={storySound}
            autoPlay={storyAutoPlay}
            onStoryChange={(st) => setStoryActiveTitle(st.title)}
          />
          <div className="modui-stage-caption">
            Active Story: <span className="modui-stage-caption-value">{storyActiveTitle}</span>
            <div className="modui-stage-caption-hint">
              Tap right half to advance, tap left half to go back. Press and hold to pause (just like Instagram). Vote in polls and tap ❤️ to send flying hearts!
            </div>
          </div>
        </div>
      </div>

      <div className="modui-controls-panel">
        <div className="modui-control-group">
          <label className="modui-control-label">Aesthetic Theme</label>
          <select
            className="modui-control-select"
            value={storyVariant}
            onChange={(e) => setStoryVariant(e.target.value as StoryTimelineVariant)}
          >
            <option value="instagram-dark">Instagram Dark (OLED Black & Neon Aura)</option>
            <option value="editorial-paper">Editorial Paper (Swiss Minimalist)</option>
            <option value="cyber-neon">Cyber Neon (Electric Cyan & Magenta)</option>
            <option value="studio-mono">Studio Mono (Matte Carbon & White)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Playback</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={storyAutoPlay}
                onChange={(e) => setStoryAutoPlay(e.target.checked)}
              />
              <span>Auto-Advance Segmented Progress</span>
            </label>
          </div>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Acoustics</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={storySound}
                onChange={(e) => setStorySound(e.target.checked)}
              />
              <span>Web Audio Taps, Voting Pops & Heart Chimes</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
