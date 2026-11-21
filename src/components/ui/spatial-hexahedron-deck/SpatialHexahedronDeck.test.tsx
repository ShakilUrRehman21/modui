import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React, { createRef } from 'react';
import {
  SpatialHexahedronDeck,
  type SpatialHexahedronDeckHandle,
} from './SpatialHexahedronDeck';

describe('SpatialHexahedronDeck component (Primitive #37)', () => {
  it('renders with role="region" and accessible aria attributes', () => {
    render(<SpatialHexahedronDeck />);
    const region = screen.getByRole('region', {
      name: /3D Navigable Spatial Hexahedron Product Deck/i,
    });
    expect(region).toBeInTheDocument();
  });

  it('renders all 6 default face titles', () => {
    render(<SpatialHexahedronDeck />);
    expect(screen.getByText('Velocity Engine')).toBeInTheDocument();
    expect(screen.getByText('Isolated Vault')).toBeInTheDocument();
    expect(screen.getByText('Global Mesh')).toBeInTheDocument();
    expect(screen.getByText('Self-Healing SLA')).toBeInTheDocument();
    expect(screen.getByText('Developer Craft')).toBeInTheDocument();
    expect(screen.getByText('Tactile Acoustics')).toBeInTheDocument();
  });

  it('renders quick-nav buttons when showFaceNav is true', () => {
    render(<SpatialHexahedronDeck showFaceNav={true} />);
    expect(screen.getByRole('button', { name: /Front/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Right/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Left/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Top/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bottom/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Explode/i })).toBeInTheDocument();
  });

  it('does not render navigation buttons when showFaceNav is false', () => {
    render(<SpatialHexahedronDeck showFaceNav={false} />);
    expect(screen.queryByRole('button', { name: /Front/i })).not.toBeInTheDocument();
  });

  it('fires onFaceChange callback when a face button is clicked', () => {
    const handleFaceChange = vi.fn();
    render(<SpatialHexahedronDeck onFaceChange={handleFaceChange} />);

    const rightBtn = screen.getByRole('button', { name: /Right/i });
    fireEvent.click(rightBtn);

    expect(handleFaceChange).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'right',
        title: 'Isolated Vault',
      })
    );
  });

  it('toggles exploded state when the explode button is clicked', () => {
    const { container } = render(<SpatialHexahedronDeck />);
    const explodeBtn = screen.getByRole('button', { name: /Explode/i });
    const cube = container.querySelector('.modui-shd-cube');

    expect(cube).not.toHaveClass('modui-shd-exploded');

    fireEvent.click(explodeBtn);
    expect(cube).toHaveClass('modui-shd-exploded');
    expect(screen.getByRole('button', { name: /Collapse/i })).toBeInTheDocument();

    fireEvent.click(explodeBtn);
    expect(cube).not.toHaveClass('modui-shd-exploded');
  });

  it('applies variant and size classes properly', () => {
    const { container } = render(
      <SpatialHexahedronDeck variant="aurora-violet" size="lg" compact={true} />
    );
    const root = container.querySelector('.modui-shd-container');
    expect(root).toHaveClass('modui-shd-variant-aurora-violet');
    expect(root).toHaveClass('modui-shd-compact');
  });

  it('exposes imperative handle methods via ref', () => {
    const ref = createRef<SpatialHexahedronDeckHandle>();
    const handleFaceChange = vi.fn();
    const { container } = render(
      <SpatialHexahedronDeck ref={ref} onFaceChange={handleFaceChange} />
    );

    expect(ref.current).toBeDefined();

    act(() => {
      ref.current?.snapToFace('top');
    });
    expect(handleFaceChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'top' })
    );

    act(() => {
      ref.current?.setExploded(true);
    });
    const cube = container.querySelector('.modui-shd-cube');
    expect(cube).toHaveClass('modui-shd-exploded');

    act(() => {
      ref.current?.toggleExplode();
    });
    expect(cube).not.toHaveClass('modui-shd-exploded');

    const rot = ref.current?.getRotation();
    expect(rot).toHaveProperty('rotX');
    expect(rot).toHaveProperty('rotY');
  });

  it('supports custom faces data', () => {
    const customFaces = [
      { id: 'front' as const, title: 'AI Automation' },
      { id: 'right' as const, title: 'Edge Cloud' },
      { id: 'back' as const, title: 'Vector DB' },
      { id: 'left' as const, title: 'Compute Mesh' },
      { id: 'top' as const, title: 'Security Perimeter' },
      { id: 'bottom' as const, title: 'Observability' },
    ];

    render(<SpatialHexahedronDeck faces={customFaces} />);
    expect(screen.getByText('AI Automation')).toBeInTheDocument();
    expect(screen.getByText('Compute Mesh')).toBeInTheDocument();
  });
});
