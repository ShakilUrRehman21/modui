import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PointCloudMorpher } from './PointCloudMorpher';

describe('PointCloudMorpher component (Primitive #27)', () => {
  beforeEach(() => {
    // Mock HTMLCanvasElement.getContext
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      globalAlpha: 1,
    } as unknown as CanvasRenderingContext2D);

    // Mock requestAnimationFrame & cancelAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      return setTimeout(cb, 16) as unknown as number;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      clearTimeout(id);
    });
  });

  it('renders with accessible region role and default label', () => {
    render(<PointCloudMorpher soundEnabled={false} />);
    const region = screen.getByRole('region');
    expect(region).toBeDefined();
    expect(region.className).toContain('modui-point-cloud-container');
    expect(region.className).toContain('modui-point-cloud--cyber-violet');
  });

  it('renders all 6 topology switcher buttons in standard mode', () => {
    render(<PointCloudMorpher soundEnabled={false} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(6);

    expect(screen.getByText('Fibonacci Sphere')).toBeDefined();
    expect(screen.getByText('Clifford Torus')).toBeDefined();
    expect(screen.getByText('Double Helix')).toBeDefined();
    expect(screen.getByText('Quantum Wave')).toBeDefined();
    expect(screen.getByText('Tesseract Lattice')).toBeDefined();
    expect(screen.getByText('Galactic Spiral')).toBeDefined();
  });

  it('switches topology when a button is clicked and triggers callback', () => {
    const handleTopologyChange = vi.fn();
    render(
      <PointCloudMorpher
        soundEnabled={false}
        onTopologyChange={handleTopologyChange}
      />
    );

    const torusBtn = screen.getByText('Clifford Torus').closest('button');
    expect(torusBtn).not.toBeNull();
    fireEvent.click(torusBtn!);

    expect(handleTopologyChange).toHaveBeenCalledWith('torus');
    expect(screen.getByText(/TOPOLOGY \/\/ TORUS/i)).toBeDefined();
  });

  it('applies selected color variant classes correctly', () => {
    const { container } = render(
      <PointCloudMorpher variant="matrix-emerald" soundEnabled={false} />
    );
    const wrapper = container.querySelector('.modui-point-cloud--matrix-emerald');
    expect(wrapper).not.toBeNull();
  });

  it('adapts cleanly to light mode theme', () => {
    const { container } = render(
      <PointCloudMorpher theme="light" variant="cyber-violet" soundEnabled={false} />
    );
    const wrapper = container.querySelector('.modui-point-cloud--theme-light');
    expect(wrapper).not.toBeNull();
    expect(wrapper?.className).toContain('modui-point-cloud--cyber-violet');
  });

  it('hides toolbar and HUD in compact mode for card previews', () => {
    render(<PointCloudMorpher compact={true} soundEnabled={false} />);
    expect(screen.queryByRole('tablist')).toBeNull();
    expect(screen.queryByText(/TOPOLOGY \/\//i)).toBeNull();
  });

  it('handles keyboard navigation with arrow keys and spacebar', () => {
    const handleTopologyChange = vi.fn();
    render(
      <PointCloudMorpher
        soundEnabled={false}
        onTopologyChange={handleTopologyChange}
      />
    );

    const region = screen.getByRole('region');
    fireEvent.keyDown(region, { key: 'ArrowRight' });
    fireEvent.keyDown(region, { key: 'ArrowLeft' });
    fireEvent.keyDown(region, { key: 'ArrowUp' });
    fireEvent.keyDown(region, { key: 'ArrowDown' });

    // Spacebar cycles to next topology (torus)
    fireEvent.keyDown(region, { key: ' ' });
    expect(handleTopologyChange).toHaveBeenCalledWith('torus');
  });

  it('accepts custom particle count and disabled constellations', () => {
    const { container } = render(
      <PointCloudMorpher
        particleCount={500}
        showConstellations={false}
        soundEnabled={false}
      />
    );
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
    expect(screen.getByText(/VERTICES: 500/i)).toBeDefined();
  });
});
