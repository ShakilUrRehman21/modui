import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ApertureIrisLens, STANDARD_F_STOPS } from './ApertureIrisLens';

describe('ApertureIrisLens component', () => {
  it('renders with proper ARIA accessibility slider role and default f-stop', () => {
    render(<ApertureIrisLens defaultValue={0.55} />);
    const slider = screen.getByRole('slider', { name: /mechanical lens aperture iris/i });
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('aria-valuenow', '0.55');
    expect(slider).toHaveAttribute('aria-valuemin', '0.05');
    expect(slider).toHaveAttribute('aria-valuemax', '1');
    expect(slider).toHaveAttribute('aria-valuetext', 'f/4.0');
  });

  it('handles keyboard navigation with arrow keys and Home/End', () => {
    const handleChange = vi.fn();
    render(
      <ApertureIrisLens
        defaultValue={0.55}
        onChange={handleChange}
        soundEnabled={false}
      />
    );

    const slider = screen.getByRole('slider');
    slider.focus();

    // ArrowRight opens iris by +0.05
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(handleChange).toHaveBeenCalledWith(0.6, expect.any(String));

    // ArrowLeft closes iris by -0.05
    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(handleChange).toHaveBeenCalledWith(0.55, expect.any(String));

    // ArrowUp opens iris
    fireEvent.keyDown(slider, { key: 'ArrowUp' });
    expect(handleChange).toHaveBeenCalledWith(0.6, expect.any(String));

    // ArrowDown closes iris
    fireEvent.keyDown(slider, { key: 'ArrowDown' });
    expect(handleChange).toHaveBeenCalledWith(0.55, expect.any(String));

    // Home closes down to minimum f/22 (0.05)
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(handleChange).toHaveBeenCalledWith(0.05, 'f/22');

    // End opens wide to maximum f/1.4 (1.0)
    fireEvent.keyDown(slider, { key: 'End' });
    expect(handleChange).toHaveBeenCalledWith(1.0, 'f/1.4');
  });

  it('changes aperture when f-stop preset buttons are clicked', () => {
    const handleChange = vi.fn();
    render(<ApertureIrisLens defaultValue={0.55} onChange={handleChange} soundEnabled={false} />);

    // Click f/1.4 button
    const f14Btn = screen.getByRole('button', { name: 'f/1.4' });
    expect(f14Btn).toBeInTheDocument();
    fireEvent.click(f14Btn);

    expect(handleChange).toHaveBeenCalledWith(1.0, 'f/1.4');
    expect(f14Btn).toHaveAttribute('aria-pressed', 'true');

    // Click f/8.0 button
    const f8Btn = screen.getByRole('button', { name: 'f/8.0' });
    fireEvent.click(f8Btn);
    expect(handleChange).toHaveBeenCalledWith(0.3, 'f/8.0');
  });

  it('renders in compact mode without f-stop buttons or HUD', () => {
    const { container } = render(<ApertureIrisLens compact={true} showFStops={false} />);
    const wrap = container.querySelector('.modui-aperture-wrap');
    expect(wrap).toHaveClass('modui-aperture--compact');
    expect(container.querySelector('.modui-aperture-hud')).toBeNull();
    expect(container.querySelector('.modui-fstop-selector')).toBeNull();
  });

  it('supports custom theme variants', () => {
    const { container, rerender } = render(<ApertureIrisLens variant="classic-brass" />);
    expect(container.querySelector('.modui-aperture--classic-brass')).toBeInTheDocument();

    rerender(<ApertureIrisLens variant="matte-obsidian" />);
    expect(container.querySelector('.modui-aperture--matte-obsidian')).toBeInTheDocument();

    rerender(<ApertureIrisLens variant="cyber-neon" />);
    expect(container.querySelector('.modui-aperture--cyber-neon')).toBeInTheDocument();
  });

  it('renders custom reveal content within the aperture center', () => {
    render(
      <ApertureIrisLens
        revealContent={<div data-testid="custom-subject">Sensor Matrix Activated</div>}
      />
    );
    expect(screen.getByTestId('custom-subject')).toHaveTextContent('Sensor Matrix Activated');
  });

  it('exports standard f-stops array correctly', () => {
    expect(STANDARD_F_STOPS.length).toBe(9);
    expect(STANDARD_F_STOPS[0].label).toBe('f/1.4');
    expect(STANDARD_F_STOPS[8].label).toBe('f/22');
  });
});
