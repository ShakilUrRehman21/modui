import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SpatialGallery, DEFAULT_SPATIAL_ITEMS } from './SpatialGallery';

describe('SpatialGallery Component (Primitive #25)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with accessible region role and label', () => {
    render(<SpatialGallery />);
    const region = screen.getByRole('region', { name: /spatial gallery/i });
    expect(region).toBeDefined();
    expect(region.getAttribute('tabIndex')).toBe('0');
  });

  it('renders default showcase items', () => {
    render(<SpatialGallery />);
    expect(screen.getByText('Aura Chromatica')).toBeDefined();
    expect(screen.getByText('Brutalist Monolith')).toBeDefined();
    expect(screen.getByText('Quantum Fluidics')).toBeDefined();
  });

  it('navigates next and previous using controls buttons', () => {
    const handleSelect = vi.fn();
    render(<SpatialGallery onSelect={handleSelect} />);

    const nextBtn = screen.getByRole('button', { name: /next project/i });
    fireEvent.click(nextBtn);

    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Brutalist Monolith' }),
      1
    );

    const prevBtn = screen.getByRole('button', { name: /previous project/i });
    fireEvent.click(prevBtn);

    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Aura Chromatica' }),
      0
    );
  });

  it('navigates using dot indicators', () => {
    const handleSelect = vi.fn();
    render(<SpatialGallery onSelect={handleSelect} />);

    const slide3Dot = screen.getByRole('tab', { name: /go to slide 3/i });
    fireEvent.click(slide3Dot);

    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Quantum Fluidics' }),
      2
    );
  });

  it('supports keyboard navigation (ArrowRight, ArrowLeft, Home, End)', () => {
    const handleSelect = vi.fn();
    const { container } = render(<SpatialGallery onSelect={handleSelect} />);
    const galleryEl = container.querySelector('.modui-spatial-gallery');
    expect(galleryEl).toBeDefined();

    if (galleryEl) {
      fireEvent.keyDown(galleryEl, { key: 'ArrowRight' });
      expect(handleSelect).toHaveBeenLastCalledWith(
        expect.objectContaining({ title: 'Brutalist Monolith' }),
        1
      );

      fireEvent.keyDown(galleryEl, { key: 'ArrowLeft' });
      expect(handleSelect).toHaveBeenLastCalledWith(
        expect.objectContaining({ title: 'Aura Chromatica' }),
        0
      );

      fireEvent.keyDown(galleryEl, { key: 'End' });
      expect(handleSelect).toHaveBeenLastCalledWith(
        expect.objectContaining({ title: 'Lumen Kinetic' }),
        4
      );

      fireEvent.keyDown(galleryEl, { key: 'Home' });
      expect(handleSelect).toHaveBeenLastCalledWith(
        expect.objectContaining({ title: 'Aura Chromatica' }),
        0
      );
    }
  });

  it('opens and closes lightbox modal on card click', () => {
    const handleItemClick = vi.fn();
    render(<SpatialGallery onItemClick={handleItemClick} enableLightbox={true} />);

    // Click on active card
    const activeCardBtn = screen.getByRole('button', {
      name: /aura chromatica/i,
    });
    fireEvent.click(activeCardBtn);

    expect(handleItemClick).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Aura Chromatica' }),
      0
    );

    // Modal should be open
    const modal = screen.getByRole('dialog', { name: /inspect: aura chromatica/i });
    expect(modal).toBeDefined();

    // Close via close button
    const closeBtn = screen.getByRole('button', { name: /close lightbox/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens modal on Enter key and closes on Escape key', () => {
    const { container } = render(<SpatialGallery enableLightbox={true} />);
    const galleryEl = container.querySelector('.modui-spatial-gallery');

    if (galleryEl) {
      fireEvent.keyDown(galleryEl, { key: 'Enter' });
      expect(screen.getByRole('dialog')).toBeDefined();

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).toBeNull();
    }
  });

  it('closes modal when clicking backdrop', () => {
    render(<SpatialGallery enableLightbox={true} />);

    const activeCardBtn = screen.getByRole('button', { name: /aura chromatica/i });
    fireEvent.click(activeCardBtn);

    const modalBackdrop = screen.getByRole('dialog');
    fireEvent.click(modalBackdrop);

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('applies theme variants correctly', () => {
    const { container, rerender } = render(<SpatialGallery variant="studio-dark" />);
    expect(container.querySelector('.modui-spatial-studio-dark')).toBeDefined();

    rerender(<SpatialGallery variant="studio-light" />);
    expect(container.querySelector('.modui-spatial-studio-light')).toBeDefined();

    rerender(<SpatialGallery variant="minimal-mono" />);
    expect(container.querySelector('.modui-spatial-minimal-mono')).toBeDefined();

    rerender(<SpatialGallery variant="cyber-cyan" />);
    expect(container.querySelector('.modui-spatial-cyber-cyan')).toBeDefined();
  });

  it('renders in compact mode for explorer cards', () => {
    const { container } = render(<SpatialGallery compact={true} />);
    expect(container.querySelector('.modui-spatial-compact')).toBeDefined();
    // Controls and HUD should not render in compact mode
    expect(container.querySelector('.modui-spatial-hud')).toBeNull();
    expect(container.querySelector('.modui-spatial-controls')).toBeNull();
  });

  it('toggles reflection floor visibility', () => {
    const { container, rerender } = render(<SpatialGallery showReflection={true} />);
    expect(container.querySelector('.modui-spatial-reflection')).toBeDefined();

    rerender(<SpatialGallery showReflection={false} />);
    expect(container.querySelector('.modui-spatial-reflection')).toBeNull();
  });

  it('supports controlled activeIndex', () => {
    const { container, rerender } = render(<SpatialGallery activeIndex={2} />);
    const slots = container.querySelectorAll('.modui-spatial-card-slot');
    expect(slots[2]?.classList.contains('is-active')).toBe(true);

    rerender(<SpatialGallery activeIndex={3} />);
    expect(slots[3]?.classList.contains('is-active')).toBe(true);
  });

  it('handles sound playback without throwing when soundEnabled is true', () => {
    expect(() => {
      render(<SpatialGallery soundEnabled={true} />);
      const nextBtn = screen.getByRole('button', { name: /next project/i });
      fireEvent.click(nextBtn);
    }).not.toThrow();
  });
});

