import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { FilmstripGallery, DEFAULT_FILMSTRIP_ITEMS } from './FilmstripGallery';

describe('FilmstripGallery component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with accessible region role and label', () => {
    render(<FilmstripGallery />);
    const galleryRegion = screen.getByRole('region', { name: /filmstrip gallery/i });
    expect(galleryRegion).toBeInTheDocument();
    expect(galleryRegion).toHaveClass('modui-filmstrip-gallery');
    expect(galleryRegion).toHaveClass('modui-filmstrip-theme-studio-light');
  });

  it('renders all default frames with accessible buttons', () => {
    render(<FilmstripGallery soundEnabled={false} />);
    const frameButtons = screen.getAllByRole('button', { name: /frame \d+:/i });
    expect(frameButtons.length).toBe(DEFAULT_FILMSTRIP_ITEMS.length);
    expect(frameButtons[0]).toHaveTextContent('Monolith Horizon');
  });

  it('fires onFrameSelect callback and triggers lightbox on frame click', () => {
    const handleSelect = vi.fn();
    render(
      <FilmstripGallery
        onFrameSelect={handleSelect}
        soundEnabled={false}
      />
    );

    const firstFrame = screen.getAllByRole('button', { name: /frame 01:/i })[0];
    fireEvent.click(firstFrame);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'frame-01', title: 'Monolith Horizon' }),
      0
    );

    // Lightbox modal dialog should be displayed
    const lightboxDialog = screen.getByRole('dialog', { name: /expanded frame: monolith horizon/i });
    expect(lightboxDialog).toBeInTheDocument();

    // Close button dismisses the lightbox
    const closeBtn = screen.getByRole('button', { name: /close lightbox/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('supports keyboard navigation with Enter/Space to select and Escape to close lightbox', () => {
    render(<FilmstripGallery soundEnabled={false} />);
    const secondFrame = screen.getAllByRole('button', { name: /frame 02:/i })[0];

    fireEvent.keyDown(secondFrame, { key: 'Enter', code: 'Enter' });
    expect(screen.getByRole('dialog', { name: /expanded frame: kinetic facade/i })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('applies theme finish variant class correctly', () => {
    const { container } = render(<FilmstripGallery variant="minimal-mono" />);
    const root = container.querySelector('.modui-filmstrip-gallery');
    expect(root).toHaveClass('modui-filmstrip-theme-minimal-mono');
  });

  it('renders in compact mode without breaking layout', () => {
    const { container } = render(<FilmstripGallery compact={true} soundEnabled={false} />);
    const root = container.querySelector('.modui-filmstrip-gallery');
    expect(root).toHaveClass('modui-filmstrip-compact');
  });

  it('renders custom items array when provided', () => {
    const customItems = [
      {
        id: 'c1',
        title: 'Custom Stills One',
        src: 'https://example.com/one.jpg',
        category: 'Custom',
      },
      {
        id: 'c2',
        title: 'Custom Stills Two',
        src: 'https://example.com/two.jpg',
        category: 'Custom',
      },
    ];

    render(<FilmstripGallery items={customItems} soundEnabled={false} />);
    const frames = screen.getAllByRole('button', { name: /frame \d+:/i });
    expect(frames.length).toBe(2);
    expect(screen.getByText('Custom Stills One')).toBeInTheDocument();
    expect(screen.getByText('Custom Stills Two')).toBeInTheDocument();
  });
});
