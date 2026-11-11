import React, { useState } from 'react';
import { AnimatedButton } from '../../components/ui/button';
import type { ButtonVariant, ButtonSize } from '../../components/ui/button';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

const VARIANTS: { id: ButtonVariant; label: string; hint: string }[] = [
  { id: 'shimmer', label: 'Shimmer', hint: 'Light sweeps across on hover' },
  { id: 'glow', label: 'Glow', hint: 'Soft accent halo' },
  { id: 'ripple', label: 'Ripple', hint: 'Ink spreads from the click' },
  { id: 'magnetic', label: 'Magnetic', hint: 'Leans toward the cursor' },
  { id: 'slide', label: 'Slide', hint: 'Icon slides in on hover' },
  { id: 'gradient-border', label: 'Gradient border', hint: 'Animated edge' },
  { id: 'minimal', label: 'Minimal', hint: 'Quiet secondary action' },
];

export default function AnimatedButtonDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [btnVariant, setBtnVariant] = useState<ButtonVariant>('shimmer');
    const [btnSize, setBtnSize] = useState<ButtonSize>('md');
    const [btnLoading, setBtnLoading] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [btnText, setBtnText] = useState('Get started');

  return (
    <>
      <div className="modui-canvas-stage">
        <div className="modui-button-gallery">
          {VARIANTS.map(({ id, label, hint }) => (
            <div key={id} className={`modui-button-gallery__cell ${btnVariant === id ? 'is-selected' : ''}`}>
              <AnimatedButton
                variant={id}
                size={btnSize}
                loading={btnLoading}
                loadingText="Saving"
                disabled={btnDisabled}
                onClick={() => setBtnVariant(id)}
              >
                {btnText}
              </AnimatedButton>
              <span className="modui-button-gallery__name">{label}</span>
              <span className="modui-button-gallery__hint">{hint}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="modui-controls-panel">
                    <div className="modui-control-group">
                      <label className="modui-control-label">Variant</label>
                      <select
                        className="modui-control-select"
                        value={btnVariant}
                        onChange={(e) => setBtnVariant(e.target.value as ButtonVariant)}
                      >
                        <option value="shimmer">shimmer</option>
                        <option value="glow">glow</option>
                        <option value="ripple">ripple</option>
                        <option value="magnetic">magnetic</option>
                        <option value="slide">slide</option>
                        <option value="gradient-border">gradient-border</option>
                        <option value="minimal">minimal</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Size</label>
                      <select
                        className="modui-control-select"
                        value={btnSize}
                        onChange={(e) => setBtnSize(e.target.value as ButtonSize)}
                      >
                        <option value="sm">sm (32px)</option>
                        <option value="md">md (40px)</option>
                        <option value="lg">lg (48px)</option>
                      </select>
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">Label</label>
                      <input
                        type="text"
                        className="modui-control-input"
                        value={btnText}
                        onChange={(e) => setBtnText(e.target.value)}
                      />
                    </div>
      
                    <div className="modui-control-group">
                      <label className="modui-control-label">States</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={btnLoading}
                            onChange={(e) => setBtnLoading(e.target.checked)}
                          />
                          <span>Loading state</span>
                        </label>
                        <label className="modui-control-toggle">
                          <input
                            type="checkbox"
                            checked={btnDisabled}
                            onChange={(e) => setBtnDisabled(e.target.checked)}
                          />
                          <span>Disabled state</span>
                        </label>
                      </div>
                    </div>
                  </div>
    </>
  );
}
