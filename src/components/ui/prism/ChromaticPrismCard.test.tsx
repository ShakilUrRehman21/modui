import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChromaticPrismCard } from './ChromaticPrismCard';

describe('ChromaticPrismCard component', () => {
  it('renders with accessible region role and custom label', () => {
    render(<ChromaticPrismCard title="Quartz Lens Specimen" />);
    const card = screen.getByRole('region', { name: /chromatic prism card: quartz lens specimen/i });
    expect(card).toBeInTheDocument();
    expect(screen.getByText('Quartz Lens Specimen')).toBeInTheDocument();
  });

  it('renders serial number, refractive index, and subtitle', () => {
    render(
      <ChromaticPrismCard
        title="Sapphire Refractor"
        serialNumber="SPECIMEN-44"
        refractiveIndex="n = 1.770"
        subtitle="Precision crystal wafer with subpixel optical dispersion."
      />
    );

    expect(screen.getByText('SPECIMEN-44')).toBeInTheDocument();
    expect(screen.getByText('n = 1.770')).toBeInTheDocument();
    expect(screen.getByText('Precision crystal wafer with subpixel optical dispersion.')).toBeInTheDocument();
  });

  it('triggers onAction callback when the action button is clicked', () => {
    const handleAction = vi.fn();
    render(
      <ChromaticPrismCard
        actionLabel="Inspect Crystal"
        onAction={handleAction}
        soundEnabled={false}
      />
    );

    const btn = screen.getByRole('button', { name: /inspect crystal/i });
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('supports keyboard navigation with arrow keys and Enter/Space', () => {
    const handleAction = vi.fn();
    render(
      <ChromaticPrismCard
        onAction={handleAction}
        soundEnabled={false}
      />
    );

    const card = screen.getByRole('region');
    card.focus();

    // Arrow keys tilt card
    fireEvent.keyDown(card, { key: 'ArrowRight' });
    fireEvent.keyDown(card, { key: 'ArrowLeft' });
    fireEvent.keyDown(card, { key: 'ArrowUp' });
    fireEvent.keyDown(card, { key: 'ArrowDown' });

    // Enter triggers action
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleAction).toHaveBeenCalledTimes(1);

    // Space triggers action
    fireEvent.keyDown(card, { key: ' ' });
    expect(handleAction).toHaveBeenCalledTimes(2);
  });

  it('supports custom mediaNode and children', () => {
    render(
      <ChromaticPrismCard
        mediaNode={<div data-testid="custom-media">Holographic 3D Gem</div>}
      >
        <span data-testid="custom-child">Overlaid Telemetry</span>
      </ChromaticPrismCard>
    );

    expect(screen.getByTestId('custom-media')).toHaveTextContent('Holographic 3D Gem');
    expect(screen.getByTestId('custom-child')).toHaveTextContent('Overlaid Telemetry');
  });

  it('renders all 4 theme variants properly', () => {
    const { container, rerender } = render(<ChromaticPrismCard variant="sapphire-crystal" />);
    expect(container.querySelector('.modui-prism--sapphire-crystal')).toBeInTheDocument();

    rerender(<ChromaticPrismCard variant="obsidian-prism" />);
    expect(container.querySelector('.modui-prism--obsidian-prism')).toBeInTheDocument();

    rerender(<ChromaticPrismCard variant="amber-quartz" />);
    expect(container.querySelector('.modui-prism--amber-quartz')).toBeInTheDocument();

    rerender(<ChromaticPrismCard variant="emerald-matrix" />);
    expect(container.querySelector('.modui-prism--emerald-matrix')).toBeInTheDocument();
  });

  it('renders in compact mode with appropriate class and omitted subtitle', () => {
    const { container } = render(
      <ChromaticPrismCard
        compact={true}
        subtitle="This should be hidden in compact mode"
      />
    );

    expect(container.querySelector('.modui-prism--compact')).toBeInTheDocument();
    expect(screen.queryByText('This should be hidden in compact mode')).toBeNull();
  });
});
