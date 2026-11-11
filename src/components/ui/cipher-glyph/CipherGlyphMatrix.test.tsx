import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CipherGlyphMatrix } from './CipherGlyphMatrix';

describe('CipherGlyphMatrix component (Primitive #30)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders with role="region" and clean accessible label', () => {
    render(<CipherGlyphMatrix text="QUANTUM_NEXUS" soundEnabled={false} autoStart={false} />);
    const region = screen.getByRole('region');
    expect(region).toBeDefined();
    expect(region.getAttribute('aria-label')).toBe('Cipher decoded text: QUANTUM_NEXUS');
    expect(region.className).toContain('modui-cipher-container');
    expect(region.className).toContain('modui-cipher--matrix-emerald');
  });

  it('renders screen reader text matching target string', () => {
    render(<CipherGlyphMatrix text="SECURITY_PROTOCOL" soundEnabled={false} autoStart={false} />);
    const srEl = screen.getByText('SECURITY_PROTOCOL');
    expect(srEl).toBeDefined();
    expect(srEl.className).toContain('modui-cipher-sr-text');
  });

  it('runs scramble and fires onComplete callback when fully resolved', () => {
    const handleComplete = vi.fn();
    render(
      <CipherGlyphMatrix
        text="DECRYPT"
        speed={10}
        iterations={2}
        autoStart={true}
        soundEnabled={false}
        onComplete={handleComplete}
      />
    );

    // Fast-forward timers through the scramble iterations
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(handleComplete).toHaveBeenCalled();
  });

  it('supports phrase cycling when passed an array of strings', () => {
    render(
      <CipherGlyphMatrix
        text={['PHRASE_ONE', 'PHRASE_TWO']}
        soundEnabled={false}
        autoStart={false}
      />
    );

    expect(screen.getByText('PHRASE_ONE')).toBeDefined();

    // Click on the stream to advance phrase
    const stream = document.querySelector('.modui-cipher-stream');
    expect(stream).not.toBeNull();
    fireEvent.click(stream!);

    expect(screen.getByText('PHRASE_TWO')).toBeDefined();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(
      <CipherGlyphMatrix text="TEST" variant="cyber-cyan" soundEnabled={false} autoStart={false} />
    );
    expect(screen.getByRole('region').className).toContain('modui-cipher--cyber-cyan');

    rerender(
      <CipherGlyphMatrix text="TEST" variant="violet-plasma" soundEnabled={false} autoStart={false} />
    );
    expect(screen.getByRole('region').className).toContain('modui-cipher--violet-plasma');

    rerender(
      <CipherGlyphMatrix text="TEST" variant="amber-phosphor" soundEnabled={false} autoStart={false} />
    );
    expect(screen.getByRole('region').className).toContain('modui-cipher--amber-phosphor');
  });

  it('applies theme classes for light and dark modes', () => {
    const { rerender } = render(
      <CipherGlyphMatrix text="THEME" theme="light" soundEnabled={false} autoStart={false} />
    );
    expect(screen.getByRole('region').className).toContain('modui-cipher--theme-light');

    rerender(
      <CipherGlyphMatrix text="THEME" theme="dark" soundEnabled={false} autoStart={false} />
    );
    expect(screen.getByRole('region').className).toContain('modui-cipher--theme-dark');
  });

  it('supports compact mode without HUD', () => {
    render(<CipherGlyphMatrix text="COMPACT" compact soundEnabled={false} autoStart={false} />);
    const region = screen.getByRole('region');
    expect(region.className).toContain('modui-cipher--compact');
    expect(document.querySelector('.modui-cipher-hud')).toBeNull();
  });

  it('triggers scramble on mouse enter when scrambleOnHover is enabled', () => {
    render(
      <CipherGlyphMatrix
        text="HOVER_TRIGGER"
        scrambleOnHover={true}
        autoStart={false}
        soundEnabled={false}
      />
    );

    const region = screen.getByRole('region');
    fireEvent.mouseEnter(region);

    // Characters should be scrambled
    const scramblingChars = document.querySelectorAll('.modui-cipher-char.is-scrambling');
    expect(scramblingChars.length).toBeGreaterThan(0);
  });

  it('handles cursor-proximity pointer movements without errors', () => {
    render(
      <CipherGlyphMatrix
        text="PROXIMITY_SCAN"
        choreography="cursor-proximity"
        autoStart={false}
        soundEnabled={false}
      />
    );

    const region = screen.getByRole('region');
    fireEvent.pointerMove(region, { clientX: 120, clientY: 40 });
  });
});

