import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BeforeAfterSlider } from './BeforeAfterSlider';

describe('BeforeAfterSlider component', () => {
  beforeEach(() => {
    // Mock Web Audio Context
    class MockAudioContext {
      currentTime = 0;
      destination = {};
      createOscillator() {
        return {
          type: 'triangle',
          frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
          connect: vi.fn(),
          start: vi.fn(),
          stop: vi.fn(),
        };
      }
      createGain() {
        return {
          gain: {
            setValueAtTime: vi.fn(),
            linearRampToValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
          },
          connect: vi.fn(),
        };
      }
      close() {
        return Promise.resolve();
      }
    }
    window.AudioContext = MockAudioContext as unknown as typeof AudioContext;

    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 0,
      top: 0,
      width: 500,
      height: 300,
      right: 500,
      bottom: 300,
    });
  });

  it('renders slider with accessible role and default labels', () => {
    render(<BeforeAfterSlider />);

    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('aria-valuenow', '50');

    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
  });

  it('updates position when dragged via pointer events', () => {
    const handlePositionChange = vi.fn();
    render(<BeforeAfterSlider onPositionChange={handlePositionChange} initialPosition={50} />);

    const slider = screen.getByRole('slider');

    // Simulate pointer down at 250px (50%) then move to 350px (70%)
    fireEvent.pointerDown(slider, { clientX: 250, clientY: 150 });
    fireEvent.pointerMove(slider, { clientX: 350, clientY: 150 });
    fireEvent.pointerUp(slider);

    expect(handlePositionChange).toHaveBeenCalledWith(70);
    expect(slider).toHaveAttribute('aria-valuenow', '70');
  });

  it('supports keyboard navigation via arrow keys', () => {
    const handlePositionChange = vi.fn();
    render(<BeforeAfterSlider initialPosition={50} onPositionChange={handlePositionChange} />);

    const slider = screen.getByRole('slider');

    // Press ArrowRight (step +2)
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(slider).toHaveAttribute('aria-valuenow', '52');
    expect(handlePositionChange).toHaveBeenCalledWith(52);

    // Press ArrowLeft (step -2)
    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(slider).toHaveAttribute('aria-valuenow', '50');

    // Press End (jump to 100)
    fireEvent.keyDown(slider, { key: 'End' });
    expect(slider).toHaveAttribute('aria-valuenow', '100');

    // Press Home (jump to 0)
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(slider).toHaveAttribute('aria-valuenow', '0');
  });

  it('renders custom badge labels and custom nodes', () => {
    render(
      <BeforeAfterSlider
        beforeLabel="Wireframe"
        afterLabel="Production"
        beforeNode={<div data-testid="custom-before">Wireframe Canvas</div>}
        afterNode={<div data-testid="custom-after">Production Shader</div>}
      />
    );

    expect(screen.getByText('Wireframe')).toBeInTheDocument();
    expect(screen.getByText('Production')).toBeInTheDocument();
    expect(screen.getByTestId('custom-before')).toBeInTheDocument();
    expect(screen.getByTestId('custom-after')).toBeInTheDocument();
  });

  it('supports vertical orientation keyboard navigation', () => {
    const handlePositionChange = vi.fn();
    render(
      <BeforeAfterSlider
        orientation="vertical"
        initialPosition={50}
        onPositionChange={handlePositionChange}
      />
    );

    const slider = screen.getByRole('slider');

    // ArrowDown increases position
    fireEvent.keyDown(slider, { key: 'ArrowDown' });
    expect(slider).toHaveAttribute('aria-valuenow', '52');

    // ArrowUp decreases position
    fireEvent.keyDown(slider, { key: 'ArrowUp' });
    expect(slider).toHaveAttribute('aria-valuenow', '50');
  });
});
