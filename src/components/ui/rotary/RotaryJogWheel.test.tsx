import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RotaryJogWheel } from './RotaryJogWheel';

describe('RotaryJogWheel component', () => {
  it('renders with proper ARIA accessibility slider role', () => {
    render(<RotaryJogWheel defaultValue={25} min={0} max={100} label="Master Gain" />);
    const slider = screen.getByRole('slider', { name: /master gain/i });
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('aria-valuenow', '25');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '100');
  });

  it('handles keyboard navigation with arrow keys', () => {
    const handleChange = vi.fn();
    render(
      <RotaryJogWheel
        defaultValue={50}
        min={0}
        max={100}
        step={5}
        onChange={handleChange}
      />
    );

    const slider = screen.getByRole('slider');
    slider.focus();

    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(handleChange).toHaveBeenCalledWith(55, expect.any(Number));

    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(handleChange).toHaveBeenCalledWith(50, expect.any(Number));
  });

  it('triggers center click callback or reset', () => {
    const handleCenter = vi.fn();
    render(<RotaryJogWheel onCenterClick={handleCenter} />);

    const centerCap = screen.getByRole('button', { name: /center control button/i });
    fireEvent.click(centerCap);

    expect(handleCenter).toHaveBeenCalledTimes(1);
  });

  it('renders disabled state properly with aria-disabled', () => {
    render(<RotaryJogWheel disabled={true} defaultValue={10} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-disabled', 'true');
    expect(slider).toHaveAttribute('tabIndex', '-1');
  });
});
