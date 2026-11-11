import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PerspectiveTextRibbon } from './PerspectiveTextRibbon';

describe('PerspectiveTextRibbon component (Primitive #28)', () => {
  beforeEach(() => {
    // Mock requestAnimationFrame & cancelAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      return setTimeout(cb, 16) as unknown as number;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      clearTimeout(id);
    });
  });

  it('renders with accessible region role and default label', () => {
    render(<PerspectiveTextRibbon soundEnabled={false} />);
    const region = screen.getByRole('region');
    expect(region).toBeDefined();
    expect(region.className).toContain('modui-perspective-ribbon-container');
    expect(region.className).toContain('modui-perspective-ribbon--cyber-indigo');
  });

  it('renders ribbon text items with appropriate style classes', () => {
    render(<PerspectiveTextRibbon soundEnabled={false} />);
    const elements = screen.getAllByText('MODUI');
    expect(elements.length).toBeGreaterThan(0);

    const solidItem = elements[0].closest('.modui-ribbon-item');
    expect(solidItem?.className).toContain('modui-ribbon-item--solid');
  });

  it('renders Dynamic 3D and Horizontal orientation buttons in standard mode', () => {
    render(<PerspectiveTextRibbon soundEnabled={false} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(2);

    expect(screen.getByText('Dynamic 3D')).toBeDefined();
    expect(screen.getByText('Horizontal')).toBeDefined();
  });

  it('switches between Dynamic and Horizontal 3D perspective orientation', () => {
    render(<PerspectiveTextRibbon soundEnabled={false} />);
    const horizBtn = screen.getByText('Horizontal');
    fireEvent.click(horizBtn);

    expect(horizBtn.className).toContain('modui-ribbon-btn--active');
    expect(screen.getByText(/Flat ribbon/i)).toBeDefined();

    const dynamicBtn = screen.getByText('Dynamic 3D');
    fireEvent.click(dynamicBtn);
    expect(dynamicBtn.className).toContain('modui-ribbon-btn--active');
    expect(screen.getByText(/Perspective ribbon/i)).toBeDefined();
  });

  it('reverses velocity when Reverse Velocity button is clicked', () => {
    const handleDirectionChange = vi.fn();
    render(<PerspectiveTextRibbon soundEnabled={false} onDirectionChange={handleDirectionChange} />);
    const reverseBtn = screen.getByRole('button', { name: /reverse velocity direction/i });
    expect(reverseBtn).toBeDefined();

    fireEvent.click(reverseBtn);
    expect(handleDirectionChange).toHaveBeenCalledWith('reverse');

    fireEvent.click(reverseBtn);
    expect(handleDirectionChange).toHaveBeenCalledWith('forward');
  });

  it('toggles pause and resume states on button click', () => {
    render(<PerspectiveTextRibbon soundEnabled={false} />);
    const pauseBtn = screen.getByRole('button', { name: /pause marquee/i });
    expect(pauseBtn).toBeDefined();

    fireEvent.click(pauseBtn);
    expect(screen.getByRole('button', { name: /resume marquee/i })).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: /resume marquee/i }));
    expect(screen.getByRole('button', { name: /pause marquee/i })).toBeDefined();
  });

  it('handles keyboard navigation with arrow keys, R key, and spacebar', () => {
    render(<PerspectiveTextRibbon soundEnabled={false} />);
    const region = screen.getByRole('region');

    fireEvent.keyDown(region, { key: 'ArrowLeft' });
    fireEvent.keyDown(region, { key: 'ArrowRight' });

    // 'r' key reverses velocity
    fireEvent.keyDown(region, { key: 'r' });

    // Spacebar toggles pause
    fireEvent.keyDown(region, { key: ' ' });
    expect(screen.getByRole('button', { name: /resume marquee/i })).toBeDefined();
  });

  it('hides toolbar and HUD in compact mode for card previews', () => {
    render(<PerspectiveTextRibbon compact={true} soundEnabled={false} />);
    expect(screen.queryByRole('tablist')).toBeNull();
    expect(screen.queryByText(/Perspective ribbon|Flat ribbon/i)).toBeNull();
  });

  it('adapts cleanly to light mode theme', () => {
    const { container } = render(
      <PerspectiveTextRibbon theme="light" variant="matrix-emerald" soundEnabled={false} />
    );
    const wrapper = container.querySelector('.modui-perspective-ribbon--theme-light');
    expect(wrapper).not.toBeNull();
    expect(wrapper?.className).toContain('modui-perspective-ribbon--matrix-emerald');
  });
});
