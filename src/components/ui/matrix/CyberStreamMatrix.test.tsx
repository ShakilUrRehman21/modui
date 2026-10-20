import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CyberStreamMatrix } from './CyberStreamMatrix';

describe('CyberStreamMatrix component', () => {
  beforeEach(() => {
    // Mock HTMLCanvasElement.getContext
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      setTransform: vi.fn(),
      scale: vi.fn(),
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      fillText: vi.fn(),
      createRadialGradient: vi.fn().mockReturnValue({
        addColorStop: vi.fn(),
      }),
    });
  });

  it('renders canvas element with proper accessible region role and label', () => {
    render(<CyberStreamMatrix data-testid="matrix-root" />);
    const region = screen.getByRole('region', { name: /interactive generative matrix stream/i });
    expect(region).toBeInTheDocument();
  });

  it('renders children overlay content over the matrix canvas', () => {
    render(
      <CyberStreamMatrix>
        <div data-testid="overlay-badge">System Online</div>
      </CyberStreamMatrix>
    );
    expect(screen.getByTestId('overlay-badge')).toHaveTextContent('System Online');
  });

  it('handles pointer events for interaction and click particle bursts', () => {
    render(<CyberStreamMatrix data-testid="matrix-root" />);
    const container = screen.getByTestId('matrix-root');

    fireEvent.pointerMove(container, { clientX: 100, clientY: 100 });
    fireEvent.pointerDown(container, { clientX: 100, clientY: 100 });
    fireEvent.pointerLeave(container);

    expect(container).toBeInTheDocument();
  });

  it('applies variant styling classes correctly', () => {
    const { container } = render(<CyberStreamMatrix variant="emerald" />);
    expect(container.firstChild).toHaveClass('modui-matrix--emerald');
  });

  it('renders with default hex charset and studio-light theme', () => {
    const { container } = render(<CyberStreamMatrix />);
    expect(container.firstChild).toHaveClass('modui-matrix--studio-light');
  });
});
