import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CausticRippleSurface } from './CausticRippleSurface';

describe('CausticRippleSurface component', () => {
  beforeEach(() => {
    // Mock 2D canvas context including createImageData
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      putImageData: vi.fn(),
      createImageData: vi.fn().mockReturnValue({
        data: new Uint8ClampedArray(400),
      }),
    });
  });

  it('renders with proper accessible region role and label', () => {
    render(<CausticRippleSurface data-testid="caustic-root" />);
    const region = screen.getByRole('region', {
      name: /interactive liquid caustic ripple surface/i,
    });
    expect(region).toBeInTheDocument();
  });

  it('renders headline and subheadline properly', () => {
    render(
      <CausticRippleSurface
        headline="Pure Spring Water"
        subheadline="Crystalline clarity with liquid wave refraction."
      />
    );
    expect(screen.getByText('Pure Spring Water')).toBeInTheDocument();
    expect(screen.getByText(/crystalline clarity/i)).toBeInTheDocument();
  });

  it('renders custom children overlay content', () => {
    render(
      <CausticRippleSurface>
        <button data-testid="action-btn">Explore Depths</button>
      </CausticRippleSurface>
    );
    expect(screen.getByTestId('action-btn')).toHaveTextContent('Explore Depths');
  });

  it('applies variant styling CSS class correctly', () => {
    const { container } = render(<CausticRippleSurface variant="crystal-lake" />);
    expect(container.firstChild).toHaveClass('modui-caustic-surface--crystal-lake');
  });

  it('handles pointer interactions and keyboard spacebar ripple triggers', () => {
    render(<CausticRippleSurface data-testid="caustic-root" />);
    const region = screen.getByRole('region', {
      name: /interactive liquid caustic ripple surface/i,
    });

    fireEvent.pointerDown(region, { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(region, { clientX: 120, clientY: 120 });
    fireEvent.pointerUp(region);

    fireEvent.keyDown(region, { key: ' ' });
    expect(region).toBeInTheDocument();
  });
});
