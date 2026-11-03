import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
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

  it('opens inspected image lightbox modal when inspect button is clicked', () => {
    const handleInspect = vi.fn();
    render(<InfiniteCanvasGallery onInspectItem={handleInspect} />);

    // Click on Inspect hint for the first item
    const inspectBtn = screen.getByRole('button', { name: /inspect kroma optical caustics/i });
    expect(inspectBtn).toBeDefined();
    fireEvent.click(inspectBtn);

    // Modal dialog should be rendered
    const modal = screen.getByRole('dialog', { name: /inspected image: kroma optical caustics/i });
    expect(modal).toBeDefined();
    expect(handleInspect).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Kroma Optical Caustics',
      })
    );

    // Check inspected image is present within dialog
    const inspectedImg = within(modal).getByRole('img');
    expect(inspectedImg).toBeDefined();
    expect(inspectedImg.getAttribute('alt')).toBe('Kroma Optical Caustics');
  });

  it('navigates next and previous items inside the inspected modal', () => {
    render(<InfiniteCanvasGallery />);

    // Open first item
    const inspectBtn = screen.getByRole('button', { name: /inspect kroma optical caustics/i });
    fireEvent.click(inspectBtn);

    const modal = screen.getByRole('dialog');

    // Click Next Image button
    const nextBtn = within(modal).getByRole('button', { name: /next image/i });
    fireEvent.click(nextBtn);

    // Should now display second item (Aether Spatial Studio) inside dialog
    const nextImg = within(screen.getByRole('dialog')).getByRole('img');
    expect(nextImg.getAttribute('alt')).toBe('Aether Spatial Studio');

    // Click Prev Image button
    const prevBtn = within(modal).getByRole('button', { name: /previous image/i });
    fireEvent.click(prevBtn);

    // Should return to first item
    const prevImg = within(screen.getByRole('dialog')).getByRole('img');
    expect(prevImg.getAttribute('alt')).toBe('Kroma Optical Caustics');
  });

  it('closes inspected image modal when close button is clicked or Escape is pressed', () => {
    const handleInspect = vi.fn();
    const { container } = render(<InfiniteCanvasGallery onInspectItem={handleInspect} />);

    // Open first item
    const inspectBtn = screen.getByRole('button', { name: /inspect kroma optical caustics/i });
    fireEvent.click(inspectBtn);
    expect(screen.getByRole('dialog')).toBeDefined();

    // Click close button
    const closeBtn = screen.getByRole('button', { name: /close image inspection/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(handleInspect).toHaveBeenLastCalledWith(null);

    // Open again and test Escape key
    fireEvent.click(inspectBtn);
    expect(screen.getByRole('dialog')).toBeDefined();

    const galleryEl = container.querySelector('.modui-infinite-gallery');
    if (galleryEl) {
      fireEvent.keyDown(galleryEl, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).toBeNull();
    }
  });
});

