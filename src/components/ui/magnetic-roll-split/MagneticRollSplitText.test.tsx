import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { MagneticRollSplitText } from './MagneticRollSplitText';

describe('MagneticRollSplitText component (Primitive #31)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with role="region" and clean accessible label', () => {
    render(<MagneticRollSplitText text="RESONANCE" soundEnabled={false} autoStart={false} />);
    const region = screen.getByRole('region');
    expect(region).toBeDefined();
    expect(region.getAttribute('aria-label')).toBe('Split-roll typography: RESONANCE');
    expect(region.className).toContain('modui-split-roll-root');
    expect(region.className).toContain('modui-split--studio-light');
  });

  it('renders accessible screen reader text matching the target phrase', () => {
    render(<MagneticRollSplitText text="KINETIC_MOTION" soundEnabled={false} autoStart={false} />);
    const srEl = screen.getByText('KINETIC_MOTION');
    expect(srEl).toBeDefined();
    expect(srEl.className).toContain('modui-split-sr-text');
  });

  it('renders individual character cells for each letter preserving words', () => {
    const { container } = render(
      <MagneticRollSplitText text="AI LAB" soundEnabled={false} autoStart={false} />
    );
    const words = container.querySelectorAll('.modui-split-word');
    expect(words.length).toBe(2);

    const cells = container.querySelectorAll('.modui-split-cell');
    expect(cells.length).toBe(5); // 'AI' (2) + 'LAB' (3)
  });

  it('toggles character drum roll on click and keyboard Enter', () => {
    const { container } = render(
      <MagneticRollSplitText
        text="FLIP"
        speed={100}
        stagger={10}
        soundEnabled={false}
        autoStart={false}
      />
    );

    const root = container.querySelector('.modui-split-roll-root') as HTMLElement;
    expect(root).toBeDefined();

    // Trigger click
    act(() => {
      fireEvent.click(root);
    });

    // Advance timers through stagger
    act(() => {
      vi.advanceTimersByTime(200);
    });

    const drums = container.querySelectorAll('.modui-split-drum');
    drums.forEach((drum) => {
      expect(drum.className).toContain('is-rolled');
    });

    // Keyboard Space key toggles back
    act(() => {
      fireEvent.keyDown(root, { key: ' ' });
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    drums.forEach((drum) => {
      expect(drum.className).not.toContain('is-rolled');
    });
  });

  it('fires onRollComplete callback when drum tumbling concludes', () => {
    const handleComplete = vi.fn();
    render(
      <MagneticRollSplitText
        text="PRECISION"
        speed={50}
        stagger={10}
        soundEnabled={false}
        autoStart={false}
        onRollComplete={handleComplete}
      />
    );

    const root = screen.getByRole('region');
    act(() => {
      fireEvent.click(root);
    });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(handleComplete).toHaveBeenCalledWith('PRECISION');
  });

  it('supports phrase cycling when passed an array of strings', () => {
    render(
      <MagneticRollSplitText
        text={['PHRASE_ONE', 'PHRASE_TWO']}
        speed={50}
        stagger={10}
        soundEnabled={false}
        autoStart={false}
      />
    );

    expect(screen.getByText('PHRASE_ONE')).toBeDefined();

    const root = screen.getByRole('region');
    act(() => {
      fireEvent.click(root);
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Advances to second phrase after roll
    expect(screen.getByText('PHRASE_TWO')).toBeDefined();
  });

  it('applies variant classes correctly', () => {
    const { container } = render(
      <MagneticRollSplitText
        text="SOLENOID"
        variant="solenoid-amber"
        soundEnabled={false}
        compact={true}
      />
    );

    const root = container.querySelector('.modui-split-roll-root');
    expect(root?.className).toContain('modui-split--solenoid-amber');
    expect(root?.className).toContain('modui-split--compact');
  });

  it('supports imperative roll triggering via onRollRef', () => {
    let triggerFn: (() => void) | null = null;
    const { container } = render(
      <MagneticRollSplitText
        text="TRIGGER"
        speed={50}
        stagger={10}
        soundEnabled={false}
        autoStart={false}
        onRollRef={(fn) => {
          triggerFn = fn;
        }}
      />
    );

    expect(triggerFn).toBeDefined();

    act(() => {
      triggerFn?.();
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    const drums = container.querySelectorAll('.modui-split-drum');
    drums.forEach((drum) => {
      expect(drum.className).toContain('is-rolled');
    });
  });
});
