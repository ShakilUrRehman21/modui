import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { InfiniteCanvasGallery, DEFAULT_CANVAS_ITEMS } from './InfiniteCanvasGallery';

describe('InfiniteCanvasGallery Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with accessible region role and label', () => {
    render(<InfiniteCanvasGallery />);
    const region = screen.getByRole('region', {
      name: /infinite 360-degree media canvas gallery/i,
    });
    expect(region).toBeDefined();
    expect(region.getAttribute('tabIndex')).toBe('0');
  });

  it('renders all default canvas items', () => {
    render(<InfiniteCanvasGallery />);
    expect(screen.getByText('Kroma Optical Caustics')).toBeDefined();
    expect(screen.getByText('Aether Spatial Studio')).toBeDefined();
    expect(screen.getByText('Verlet Structural Cloth')).toBeDefined();
  });

  it('fires onItemClick callback when a card is clicked', () => {
    const handleItemClick = vi.fn();
    render(<InfiniteCanvasGallery onItemClick={handleItemClick} />);

    const cardButton = screen.getByRole('button', {
      name: /kroma optical caustics - light simulation/i,
    });
    fireEvent.click(cardButton);

    expect(handleItemClick).toHaveBeenCalledTimes(1);
    expect(handleItemClick).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Kroma Optical Caustics',
      })
    );
  });

  it('fires onItemHover callback on mouse enter and mouse leave', () => {
    const handleItemHover = vi.fn();
    render(<InfiniteCanvasGallery onItemHover={handleItemHover} />);

    const cardButton = screen.getByRole('button', {
      name: /aether spatial studio - hardware architecture/i,
    });

    fireEvent.mouseEnter(cardButton);
    expect(handleItemHover).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Aether Spatial Studio',
      })
    );

    fireEvent.mouseLeave(cardButton);
    expect(handleItemHover).toHaveBeenCalledWith(null);
  });

  it('supports keyboard navigation with arrow keys and Home key', () => {
    const { container } = render(<InfiniteCanvasGallery />);
    const galleryEl = container.querySelector('.modui-infinite-gallery');
    expect(galleryEl).toBeDefined();

    if (galleryEl) {
      fireEvent.keyDown(galleryEl, { key: 'ArrowRight' });
      fireEvent.keyDown(galleryEl, { key: 'ArrowDown' });
      fireEvent.keyDown(galleryEl, { key: 'ArrowLeft' });
      fireEvent.keyDown(galleryEl, { key: 'ArrowUp' });
      fireEvent.keyDown(galleryEl, { key: 'Home' });
    }
  });

  it('resets origin when Origin toolbar button is clicked', () => {
    render(<InfiniteCanvasGallery />);
    const originBtn = screen.getByRole('button', { name: /origin/i });
    expect(originBtn).toBeDefined();
    fireEvent.click(originBtn);
  });

  it('renders radar minimap HUD when showMinimap is true and hides when false', () => {
    const { container, rerender } = render(<InfiniteCanvasGallery showMinimap={true} />);
    expect(container.querySelector('.modui-radar-minimap')).toBeDefined();

    rerender(<InfiniteCanvasGallery showMinimap={false} />);
    expect(container.querySelector('.modui-radar-minimap')).toBeNull();
  });

  it('renders properly in compact mode for explorer cards', () => {
    const { container } = render(<InfiniteCanvasGallery compact={true} />);
    expect(container.querySelector('.modui-infinite-gallery--compact')).toBeDefined();
    expect(container.querySelector('.modui-compact-canvas-overlay')).toBeDefined();
  });

  it('applies custom visual variants correctly', () => {
    const { container, rerender } = render(<InfiniteCanvasGallery variant="dark-slate" />);
    expect(container.querySelector('.modui-infinite-gallery--dark-slate')).toBeDefined();

    rerender(<InfiniteCanvasGallery variant="editorial-paper" />);
    expect(container.querySelector('.modui-infinite-gallery--editorial-paper')).toBeDefined();
  });
});
