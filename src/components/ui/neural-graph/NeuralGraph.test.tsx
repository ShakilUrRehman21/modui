import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { NeuralGraph, DEFAULT_NEURAL_NODES, DEFAULT_NEURAL_EDGES } from './NeuralGraph';

describe('NeuralGraph component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock HTMLCanvasElement.getContext 2D
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      setTransform: vi.fn(),
      scale: vi.fn(),
      translate: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      roundRect: vi.fn(),
      measureText: vi.fn().mockReturnValue({ width: 60 }),
      fillText: vi.fn(),
      setLineDash: vi.fn(),
      createRadialGradient: vi.fn().mockReturnValue({
        addColorStop: vi.fn(),
      }),
    });
  });

  it('renders with accessible region role and default label', () => {
    render(<NeuralGraph />);
    const region = screen.getByRole('region', {
      name: /interactive synaptic neural graph/i,
    });
    expect(region).toBeInTheDocument();
    expect(region).toHaveClass('modui-neural-graph');
    expect(region).toHaveClass('modui-neural-graph--studio-light');
  });

  it('renders canvas element inside the container', () => {
    const { container } = render(<NeuralGraph />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveClass('modui-neural-graph__canvas');
  });

  it('renders floating studio telemetry HUD with node and synapse statistics', () => {
    render(<NeuralGraph soundEnabled={false} />);
    expect(screen.getByText(/SYNAPSE LATTICE \/\/ ENGINE/i)).toBeInTheDocument();
    expect(screen.getByText('NODES')).toBeInTheDocument();
    expect(screen.getByText(String(DEFAULT_NEURAL_NODES.length))).toBeInTheDocument();
    expect(screen.getByText('SYNAPSES')).toBeInTheDocument();
    expect(screen.getByText(String(DEFAULT_NEURAL_EDGES.length))).toBeInTheDocument();
  });

  it('applies variant theme classes correctly', () => {
    const { container: c1 } = render(<NeuralGraph variant="dark-slate" />);
    expect(c1.firstChild).toHaveClass('modui-neural-graph--dark-slate');

    const { container: c2 } = render(<NeuralGraph variant="quantum-violet" />);
    expect(c2.firstChild).toHaveClass('modui-neural-graph--quantum-violet');

    const { container: c3 } = render(<NeuralGraph variant="warm-editorial" />);
    expect(c3.firstChild).toHaveClass('modui-neural-graph--warm-editorial');
  });

  it('allows clicking cluster filter buttons', () => {
    render(<NeuralGraph soundEnabled={false} />);
    const reasoningBtn = screen.getByRole('button', { name: /REASONING/i });
    expect(reasoningBtn).toBeInTheDocument();

    fireEvent.click(reasoningBtn);
    expect(reasoningBtn).toHaveClass('modui-neural-filter-btn--active');
  });

  it('fires action potential pulse when "Fire Impulse" button is clicked', () => {
    const handleFire = vi.fn();
    render(<NeuralGraph onFireSynapse={handleFire} soundEnabled={false} />);
    const fireBtn = screen.getByRole('button', { name: /fire impulse/i });
    expect(fireBtn).toBeInTheDocument();

    fireEvent.click(fireBtn);
    expect(handleFire).toHaveBeenCalledTimes(1);
  });

  it('toggles audio haptics state when sound toggle button is clicked', () => {
    render(<NeuralGraph soundEnabled={true} />);
    const audioBtn = screen.getByRole('button', { name: /toggle web audio synthesized haptics/i });
    expect(audioBtn).toBeInTheDocument();

    fireEvent.click(audioBtn);
    // After clicking, it toggles audio off
    expect(audioBtn).not.toHaveClass('modui-neural-action-btn--active');
  });

  it('renders compact mode without telemetry HUD and controls', () => {
    const { container } = render(<NeuralGraph compact={true} />);
    expect(container.firstChild).toHaveClass('modui-neural-graph--compact');
    expect(screen.queryByText(/SYNAPSE LATTICE \/\/ ENGINE/i)).not.toBeInTheDocument();
  });
});

