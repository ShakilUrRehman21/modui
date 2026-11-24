import React, { useState, useRef } from 'react';
import {
  InteractiveSentimentRatingPill,
  type SentimentVariant,
  type SentimentSize,
  type InteractiveSentimentRatingPillHandle,
  type SentimentTier,
  type FeedbackSubmission,
} from '../../components/ui/sentiment-rating-pill';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function InteractiveSentimentRatingPillDemo({ theme }: DemoProps) {
  const isDark =
    theme
      ? theme === 'dark'
      : typeof document !== 'undefined' &&
        document.documentElement.getAttribute('data-theme') === 'dark';

  const [variant, setVariant] = useState<SentimentVariant>(() =>
    isDark ? 'studio-obsidian' : 'clean-porcelain'
  );
  const [size, setSize] = useState<SentimentSize>('md');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showAvatar, setShowAvatar] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showFeedbackDrawer, setShowFeedbackDrawer] = useState<boolean>(true);
  const [currentRating, setCurrentRating] = useState<number>(5);
  const [, setActiveTier] = useState<SentimentTier | null>(null);
  const [lastSubmission, setLastSubmission] = useState<FeedbackSubmission | null>(null);

  const pillRef = useRef<InteractiveSentimentRatingPillHandle>(null);

  const handleSelectPreset = (rating: number) => {
    setCurrentRating(rating);
    pillRef.current?.setRating(rating);
  };

  const handleReset = () => {
    setCurrentRating(5);
    pillRef.current?.reset();
    setLastSubmission(null);
  };

  return (
    <>
      <div className="modui-canvas-stage">
        <div
          style={{
            width: '100%',
            maxWidth: '680px',
            margin: '0 auto',
            padding: '2.5rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '360px',
          }}
        >
          <InteractiveSentimentRatingPill
            ref={pillRef}
            variant={variant}
            size={size}
            soundEnabled={soundEnabled}
            showAvatar={showAvatar}
            showLabels={showLabels}
            showFeedbackDrawer={showFeedbackDrawer}
            onChange={(r, tier) => {
              setCurrentRating(r);
              setActiveTier(tier);
            }}
            onSubmitFeedback={(sub) => setLastSubmission(sub)}
          />

          <div className="modui-stage-caption" style={{ marginTop: '1.75rem' }}>
            <div className="modui-stage-caption-hint">
              Drag or click fluid segmented pill &bull; Squash &amp; stretch avatar physics &bull; Realtime Web Audio pentatonic chime arpeggios
            </div>
          </div>
        </div>
      </div>

      <div className="modui-controls-panel">
        <div className="modui-control-group">
          <label className="modui-control-label">Visual Variant</label>
          <select
            className="modui-control-select"
            value={variant}
            onChange={(e) => setVariant(e.target.value as SentimentVariant)}
          >
            <option value="studio-obsidian">Studio Obsidian (Dark)</option>
            <option value="clean-porcelain">Clean Porcelain (Light)</option>
            <option value="cyber-neon">Cyber Neon (Cyan)</option>
            <option value="warm-editorial">Warm Editorial (Amber)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Scale &amp; Proportions</label>
          <select
            className="modui-control-select"
            value={size}
            onChange={(e) => setSize(e.target.value as SentimentSize)}
          >
            <option value="sm">Small (Compact Inline)</option>
            <option value="md">Medium (Default Dashboard)</option>
            <option value="lg">Large (Dedicated CSAT)</option>
          </select>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Rating Shortcuts</label>
          <div className="modui-control-buttons">
            <button
              type="button"
              className={`modui-control-btn ${currentRating === 1 ? 'modui-control-btn--active' : ''}`}
              onClick={() => handleSelectPreset(1)}
            >
              1 😡 Poor
            </button>
            <button
              type="button"
              className={`modui-control-btn ${currentRating === 3 ? 'modui-control-btn--active' : ''}`}
              onClick={() => handleSelectPreset(3)}
            >
              3 😐 Good
            </button>
            <button
              type="button"
              className={`modui-control-btn ${currentRating === 5 ? 'modui-control-btn--active' : ''}`}
              onClick={() => handleSelectPreset(5)}
            >
              5 🤩 Stellar
            </button>
            <button
              type="button"
              className="modui-control-btn"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="modui-control-group">
          <label className="modui-control-label">Features &amp; Haptics</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              <span>Web Audio Pentatonic Synthesizer</span>
            </label>
            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={showAvatar}
                onChange={(e) => setShowAvatar(e.target.checked)}
              />
              <span>Squash &amp; Stretch Sentiment Avatar</span>
            </label>
            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
              />
              <span>Title &amp; Category Badges</span>
            </label>
            <label className="modui-control-toggle">
              <input
                type="checkbox"
                checked={showFeedbackDrawer}
                onChange={(e) => setShowFeedbackDrawer(e.target.checked)}
              />
              <span>Qualitative Feedback Drawer</span>
            </label>
          </div>
        </div>

        {lastSubmission && (
          <div className="modui-control-group" style={{ gridColumn: '1 / -1' }}>
            <label className="modui-control-label">Live Submission Telemetry</label>
            <div
              style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                color: 'var(--senti-text-main, #38bdf8)',
                lineHeight: 1.5,
              }}
            >
              <div><strong>Rating:</strong> {lastSubmission.rating} / 5 ({lastSubmission.tier.title})</div>
              <div><strong>Category:</strong> {lastSubmission.tier.category}</div>
              <div><strong>Tags:</strong> {lastSubmission.selectedTags.join(', ') || 'None'}</div>
              {lastSubmission.note && <div><strong>Note:</strong> &ldquo;{lastSubmission.note}&rdquo;</div>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
