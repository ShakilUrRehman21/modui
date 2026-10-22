import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NeuralClothMesh } from './NeuralClothMesh';

describe('NeuralClothMesh component', () => {
  beforeEach(() => {
    // Mock HTMLCanvasElement.getContext 2D
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      setTransform: vi.fn(),
      scale: vi.fn(),
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      createRadialGradient: vi.fn().mockReturnValue({
        addColorStop: vi.fn(),
      }),
    });
  });

  it('renders with proper accessible region role and label', () => {
    render(<NeuralClothMesh data-testid="cloth-root" />);
    const region = screen.getByRole('region', {
      name: /interactive verlet silk cloth mesh/i,
    });
    expect(region).toBeInTheDocument();
  });

  it('renders headline and subheadline properly', () => {
    render(
      <NeuralClothMesh
        headline="Neural Continuum"
        subheadline="Physical relaxation spring lattice with liquid satin sheen."
      />
    );
    expect(screen.getByText('Neural Continuum')).toBeInTheDocument();
    expect(
      screen.getByText(/physical relaxation spring lattice/i)
    ).toBeInTheDocument();
  });

  it('renders custom children overlay content', () => {
    render(
      <NeuralClothMesh>
        <button data-testid="cloth-cta">Touch Fabric</button>
      </NeuralClothMesh>
    );
    expect(screen.getByTestId('cloth-cta')).toHaveTextContent('Touch Fabric');
  });

  it('applies variant styling CSS class correctly', () => {
    const { container } = render(<NeuralClothMesh variant="liquid-gold" />);
    expect(container.firstChild).toHaveClass('modui-cloth-mesh--liquid-gold');
  });

  it('handles pointer interactions and keyboard spacebar gust ripple triggers', () => {
    render(<NeuralClothMesh data-testid="cloth-root" />);
    const region = screen.getByRole('region', {
      name: /interactive verlet silk cloth mesh/i,
    });

    fireEvent.pointerDown(region, { clientX: 120, clientY: 100 });
    fireEvent.pointerMove(region, { clientX: 160, clientY: 140 });
    fireEvent.pointerUp(region);
    fireEvent.keyDown(region, { key: ' ' });

    expect(region).toBeInTheDocument();
  });

  it('applies compact styling class and omits headline in compact mode', () => {
    const { container } = render(
      <NeuralClothMesh
        compact={true}
        headline="Hidden in Compact"
      />
    );
    expect(container.firstChild).toHaveClass('modui-cloth-mesh--compact');
    expect(screen.queryByText('Hidden in Compact')).not.toBeInTheDocument();
  });
});
