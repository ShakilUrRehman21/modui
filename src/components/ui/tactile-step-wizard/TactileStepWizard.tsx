import React, { useState, useEffect, useRef, useId, useCallback } from 'react';
import './TactileStepWizard.css';

export interface WizardStep {
  /** Unique identifier for the step */
  id: string;
  /** Human-readable title */
  title: string;
  /** Optional secondary subtitle or description */
  description?: string;
  /** Optional status badge text */
  badge?: string;
  /** Custom icon element */
  icon?: React.ReactNode;
  /** Step content element */
  content?: React.ReactNode;
  /** Optional validator: returns boolean or Promise<boolean> */
  validate?: () => boolean | Promise<boolean>;
}

export type WizardOrientation = 'horizontal' | 'vertical' | 'minimal';
export type WizardVariant = 'studio' | 'editorial' | 'emerald' | 'minimal';

export interface TactileStepWizardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Array of step definitions */
  steps: WizardStep[];
  /** Controlled active step index (0-indexed) */
  currentStep?: number;
  /** Initial step index for uncontrolled mode (default: 0) */
  defaultStep?: number;
  /** Stepper track orientation */
  orientation?: WizardOrientation;
  /** Visual finish variant */
  variant?: WizardVariant;
  /** Explicit light/dark theme override */
  theme?: 'light' | 'dark';
  /** Require prior steps to be completed before allowing direct node clicking (default: true) */
  linear?: boolean;
  /** Enable zero-asset Web Audio micro-haptics (default: true) */
  soundEnabled?: boolean;
  /** Compact display mode for catalog cards and preview stages */
  compact?: boolean;
  /** Whether to render outer container card border and background (default: true) */
  bordered?: boolean;
  /** Callback fired on step change */
  onStepChange?: (nextIndex: number, prevIndex: number, step: WizardStep) => void;
  /** Callback fired when the final step completes */
  onComplete?: () => void;
  /** Custom label for Next / Complete button */
  nextLabel?: string;
  /** Custom label for Previous button */
  prevLabel?: string;
  /** Custom label for Final Complete button */
  completeLabel?: string;
}

/* ====================================================================
   Zero-Asset Web Audio Synthesizer (Acoustic Relay & Haptic Solenoid)
   ==================================================================== */
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtx && AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

function playHapticSound(type: 'advance' | 'back' | 'complete' | 'error') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'advance') {
      // Crisp mechanical solenoid click with pitch rise
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.035);
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    } else if (type === 'back') {
      // Soft tactile mechanical latch release
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.04);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'complete') {
      // Uplifting dual resonant chime
      [660, 990, 1320].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const delay = idx * 0.05;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);
        gain.gain.setValueAtTime(0.04, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.22);
      });
    } else if (type === 'error') {
      // Damped double reject pulse
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    }
  } catch {
    // Audio gracefully silences if context blocked
  }
}

export function TactileStepWizard({
  steps,
  currentStep: controlledStep,
  defaultStep = 0,
  orientation = 'horizontal',
  variant = 'studio',
  theme,
  linear = true,
  soundEnabled = true,
  compact = false,
  bordered = true,
  onStepChange,
  onComplete,
  nextLabel = 'Next Step',
  prevLabel = 'Previous',
  completeLabel = 'Complete Setup',
  className = '',
  style,
  ...rest
}: TactileStepWizardProps) {
  const wizardId = useId();
  const [uncontrolledStep, setUncontrolledStep] = useState(defaultStep);
  const isControlled = controlledStep !== undefined;
  const activeIndex = isControlled ? controlledStep : uncontrolledStep;

  // Track completed steps and animation slide direction
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(() => {
    const set = new Set<number>();
    for (let i = 0; i < defaultStep; i++) set.add(i);
    return set;
  });
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');
  const [isValidating, setIsValidating] = useState(false);
  const [hasError, setHasError] = useState(false);

  const prevIndexRef = useRef(activeIndex);

  // Synchronize completed steps if controlled active step advances
  useEffect(() => {
    if (activeIndex > prevIndexRef.current) {
      setSlideDirection('forward');
      setCompletedSteps((prev) => {
        const next = new Set(prev);
        for (let i = 0; i < activeIndex; i++) next.add(i);
        return next;
      });
    } else if (activeIndex < prevIndexRef.current) {
      setSlideDirection('backward');
    }
    prevIndexRef.current = activeIndex;
  }, [activeIndex]);

  const totalSteps = steps.length;
  const isFirstStep = activeIndex === 0;
  const isLastStep = activeIndex === totalSteps - 1;

  // Step navigation dispatcher
  const changeStep = useCallback(
    (targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= totalSteps || targetIndex === activeIndex) return;

      const direction = targetIndex > activeIndex ? 'forward' : 'backward';
      setSlideDirection(direction);
      setHasError(false);

      if (!isControlled) {
        setUncontrolledStep(targetIndex);
      }

      if (direction === 'forward') {
        setCompletedSteps((prev) => new Set(prev).add(activeIndex));
        if (soundEnabled) playHapticSound('advance');
      } else {
        if (soundEnabled) playHapticSound('back');
      }

      onStepChange?.(targetIndex, activeIndex, steps[targetIndex]);
    },
    [activeIndex, totalSteps, isControlled, soundEnabled, onStepChange, steps]
  );

  // Handle Next button click with validator support
  const handleNext = async () => {
    const currentStepObj = steps[activeIndex];
    if (currentStepObj?.validate) {
      try {
        setIsValidating(true);
        const valid = await Promise.resolve(currentStepObj.validate());
        setIsValidating(false);
        if (!valid) {
          setHasError(true);
          if (soundEnabled) playHapticSound('error');
          return;
        }
      } catch {
        setIsValidating(false);
        setHasError(true);
        if (soundEnabled) playHapticSound('error');
        return;
      }
    }

    if (isLastStep) {
      setCompletedSteps((prev) => new Set(prev).add(activeIndex));
      if (soundEnabled) playHapticSound('complete');
      onComplete?.();
    } else {
      changeStep(activeIndex + 1);
    }
  };

  // Handle Previous button click
  const handlePrev = () => {
    if (!isFirstStep) {
      changeStep(activeIndex - 1);
    }
  };

  // Direct step node click
  const handleNodeClick = (index: number) => {
    if (linear && index > activeIndex + 1 && !completedSteps.has(index - 1)) {
      if (soundEnabled) playHapticSound('error');
      return;
    }
    changeStep(index);
  };

  // Keyboard navigation shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // Don't intercept Enter inside multiline textareas
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'textarea') return;
      e.preventDefault();
      handleNext();
    } else if (
      (e.key === 'Backspace' && (e.metaKey || e.ctrlKey)) ||
      (e.key === 'ArrowLeft' && e.altKey)
    ) {
      e.preventDefault();
      handlePrev();
    }
  };

  // Calculate track progress fill percentage
  const progressPercent = totalSteps > 1 ? (activeIndex / (totalSteps - 1)) * 100 : 100;

  const currentStepData = steps[activeIndex];

  return (
    <div
      id={wizardId}
      className={`modui-wizard-root modui-wizard--${variant} modui-wizard--${orientation} ${
        compact ? 'modui-wizard--compact' : ''
      } ${!bordered ? 'modui-wizard--borderless' : ''} ${className}`}
      data-theme={theme}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Interactive Step Wizard"
      style={style}
      {...rest}
    >
      {/* ==========================================================
          Stepper Progress Track (Header or Sidebar)
          ========================================================== */}
      <nav
        className="modui-wizard-stepper"
        aria-label="Progress Steps"
        role="tablist"
      >
        {orientation !== 'minimal' && (
          <div className="modui-wizard-track" aria-hidden="true">
            <div
              className="modui-wizard-track-fill"
              style={{
                [orientation === 'vertical' ? 'height' : 'width']: `${progressPercent}%`,
              }}
            />
          </div>
        )}

        {steps.map((step, idx) => {
          const isActive = idx === activeIndex;
          const isCompleted = completedSteps.has(idx);
          const isPending = !isActive && !isCompleted;
          const isClickable = !linear || isCompleted || idx === activeIndex || idx === activeIndex + 1;

          let statusClass = 'is-pending';
          if (isActive) statusClass = 'is-active';
          else if (isCompleted) statusClass = 'is-completed';

          return (
            <button
              key={step.id || `step-${idx}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? 'step' : undefined}
              aria-disabled={!isClickable}
              className={`modui-wizard-node ${statusClass} ${!isClickable ? 'is-disabled' : ''}`}
              onClick={() => handleNodeClick(idx)}
            >
              <div className="modui-wizard-indicator">
                {isCompleted ? (
                  <svg
                    className="modui-wizard-check-icon"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.5 8.5L6.5 11.5L12.5 4.5"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : step.icon ? (
                  <span className="modui-wizard-custom-icon">{step.icon}</span>
                ) : (
                  <span className="modui-wizard-index-num">{idx + 1}</span>
                )}
              </div>

              {orientation !== 'minimal' && (
                <div className="modui-wizard-node-meta">
                  <div className="modui-wizard-node-header">
                    <span className="modui-wizard-node-title">{step.title}</span>
                    {step.badge && (
                      <span className="modui-wizard-node-badge">{step.badge}</span>
                    )}
                  </div>
                  {step.description && !compact && (
                    <span className="modui-wizard-node-desc">{step.description}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* ==========================================================
          Step Viewport & Active Body
          ========================================================== */}
      <div className={`modui-wizard-viewport ${hasError ? 'is-shaking' : ''}`}>
        <div
          key={`step-content-${activeIndex}`}
          className={`modui-wizard-body modui-wizard-slide-${slideDirection}`}
          role="tabpanel"
          aria-labelledby={`step-${activeIndex}`}
        >
          {currentStepData?.content}
        </div>
      </div>

      {/* ==========================================================
          Tactile Footer Controls
          ========================================================== */}
      <footer className="modui-wizard-footer">
        <button
          type="button"
          className="modui-wizard-btn modui-wizard-btn-prev"
          onClick={handlePrev}
          disabled={isFirstStep || isValidating}
          aria-label={prevLabel}
        >
          <svg
            className="modui-wizard-arrow-icon"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{prevLabel}</span>
        </button>

        <div className="modui-wizard-counter" aria-live="polite">
          <span className="modui-wizard-counter-cur">STEP {activeIndex + 1}</span>
          <span className="modui-wizard-counter-div">/</span>
          <span className="modui-wizard-counter-tot">{totalSteps}</span>
        </div>

        <button
          type="button"
          className={`modui-wizard-btn modui-wizard-btn-next ${
            isLastStep ? 'modui-wizard-btn-complete' : ''
          }`}
          onClick={handleNext}
          disabled={isValidating}
          aria-label={isLastStep ? completeLabel : nextLabel}
        >
          {isValidating ? (
            <span className="modui-wizard-spinner" aria-hidden="true" />
          ) : (
            <>
              <span>{isLastStep ? completeLabel : nextLabel}</span>
              <svg
                className="modui-wizard-arrow-icon"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 4L10 8L6 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </button>
      </footer>
    </div>
  );
}

export default TactileStepWizard;
