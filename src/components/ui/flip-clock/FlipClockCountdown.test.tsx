import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { FlipClockCountdown } from './FlipClockCountdown';

describe('FlipClockCountdown component (Primitive #35)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with role="timer" and accessible aria attributes', () => {
    render(<FlipClockCountdown />);
    const timer = screen.getByRole('timer');
    expect(timer).toBeInTheDocument();
    expect(timer).toHaveAttribute('aria-live', 'polite');
    expect(timer).toHaveAttribute('aria-label');
  });

  it('renders all default time units with labels (Days, Hours, Minutes, Seconds)', () => {
    render(<FlipClockCountdown />);
    expect(screen.getByText('Days')).toBeInTheDocument();
    expect(screen.getByText('Hours')).toBeInTheDocument();
    expect(screen.getByText('Minutes')).toBeInTheDocument();
    expect(screen.getByText('Seconds')).toBeInTheDocument();
  });

  it('respects showDays={false} and showLabels={false}', () => {
    render(<FlipClockCountdown showDays={false} showLabels={false} />);
    expect(screen.queryByText('Days')).not.toBeInTheDocument();
    expect(screen.queryByText('Seconds')).not.toBeInTheDocument();
  });

  it('applies variant and size classes properly', () => {
    const { container } = render(
      <FlipClockCountdown variant="brass-vintage" size="lg" />
    );
    const root = container.querySelector('.modui-flip-clock-root');
    expect(root).toHaveClass('modui-flip-variant-brass-vintage');
    expect(root).toHaveClass('modui-flip-size-lg');
  });

  it('supports custom internationalization labels', () => {
    render(
      <FlipClockCountdown
        labels={{
          days: 'Jours',
          hours: 'Heures',
          minutes: 'Minutes',
          seconds: 'Secondes',
        }}
      />
    );
    expect(screen.getByText('Jours')).toBeInTheDocument();
    expect(screen.getByText('Heures')).toBeInTheDocument();
    expect(screen.getByText('Secondes')).toBeInTheDocument();
  });

  it('fires onTick callback on interval ticks', () => {
    const onTick = vi.fn();
    render(<FlipClockCountdown onTick={onTick} />);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onTick).toHaveBeenCalled();
  });

  it('fires onComplete callback when countdown target is already in the past', () => {
    const onComplete = vi.fn();
    const pastDate = new Date(Date.now() - 5000);
    render(<FlipClockCountdown targetDate={pastDate} onComplete={onComplete} />);

    act(() => {
      vi.advanceTimersByTime(1100);
    });

    expect(onComplete).toHaveBeenCalled();
  });

  it('renders mechanical hinge pins and divider line for split-flap realism', () => {
    const { container } = render(<FlipClockCountdown />);
    expect(
      container.querySelectorAll('.modui-flip-hinge-pin-left').length
    ).toBeGreaterThan(0);
    expect(
      container.querySelectorAll('.modui-flip-divider-line').length
    ).toBeGreaterThan(0);
  });
});
