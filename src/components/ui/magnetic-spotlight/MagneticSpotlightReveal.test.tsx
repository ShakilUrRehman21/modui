import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MagneticSpotlightReveal } from './MagneticSpotlightReveal';

describe('MagneticSpotlightReveal component (Primitive #33)', () => {
  it('renders with role="region" and accessible label', () => {
    render(<MagneticSpotlightReveal />);
    const region = screen.getByRole('region', {
      name: /interactive magnetic spotlight & portal reveal/i,
    });
    expect(region).toBeInTheDocument();
  });

  it('renders default approved blueprint schematic and production cloud layers', () => {
    render(<MagneticSpotlightReveal />);
    expect(screen.getByText(/Schematic Architecture • Hover to Reveal/i)).toBeInTheDocument();
    expect(screen.getByText(/Core Compute Cluster \[Wireframe\]/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Production Cloud • Fully Deployed/i)).toBeInTheDocument();
    expect(screen.getByText(/Quantum Cluster Active/i)).toBeInTheDocument();
    expect(screen.getByText('99.99% SLO')).toBeInTheDocument();
  });

  it('renders custom base and reveal content when provided', () => {
    render(
      <MagneticSpotlightReveal
        baseContent={<div data-testid="custom-base">Custom Base</div>}
        revealContent={<div data-testid="custom-reveal">Custom Reveal</div>}
      />
    );
    expect(screen.getByTestId('custom-base')).toBeInTheDocument();
    expect(screen.getByTestId('custom-reveal')).toBeInTheDocument();
  });

  it('renders glowing portal ring by default and hides it when showRing is false', () => {
    const { container, rerender } = render(<MagneticSpotlightReveal />);
    expect(container.querySelector('.modui-spotlight-ring')).toBeInTheDocument();

    rerender(<MagneticSpotlightReveal showRing={false} />);
    expect(container.querySelector('.modui-spotlight-ring')).not.toBeInTheDocument();
  });

  it('applies compact styling class when compact is true', () => {
    const { container } = render(<MagneticSpotlightReveal compact={true} />);
    expect(container.querySelector('.modui-spotlight-canvas-wrapper')).toHaveClass(
      'modui-spotlight--compact'
    );
  });

  it('handles pointer move and leave events with onPositionChange callback', () => {
    const onPositionChange = vi.fn();
    const { container } = render(
      <MagneticSpotlightReveal onPositionChange={onPositionChange} />
    );
    const wrapper = container.querySelector('.modui-spotlight-canvas-wrapper')!;

    fireEvent.pointerMove(wrapper, { clientX: 180, clientY: 120 });
    expect(onPositionChange).toHaveBeenCalled();

    fireEvent.pointerLeave(wrapper);
    expect(wrapper).toBeInTheDocument();
  });

  it('supports keyboard navigation via arrow keys and escape key', () => {
    const onPositionChange = vi.fn();
    const { container } = render(
      <MagneticSpotlightReveal onPositionChange={onPositionChange} />
    );
    const wrapper = container.querySelector('.modui-spotlight-canvas-wrapper')!;

    fireEvent.keyDown(wrapper, { key: 'ArrowRight' });
    expect(onPositionChange).toHaveBeenCalled();

    fireEvent.keyDown(wrapper, { key: 'ArrowDown' });
    expect(onPositionChange).toHaveBeenCalled();

    fireEvent.keyDown(wrapper, { key: 'Escape' });
    expect(wrapper).toBeInTheDocument();
  });
});
