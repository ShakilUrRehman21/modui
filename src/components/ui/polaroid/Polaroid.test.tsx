import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Polaroid, DEFAULT_POLAROIDS } from './Polaroid';
import type { PolaroidPhoto } from './Polaroid';

describe('Polaroid Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Polyfill setPointerCapture / releasePointerCapture for JSDOM
    if (!window.HTMLElement.prototype.setPointerCapture) {
      window.HTMLElement.prototype.setPointerCapture = vi.fn();
    }
    if (!window.HTMLElement.prototype.releasePointerCapture) {
      window.HTMLElement.prototype.releasePointerCapture = vi.fn();
    }
  });

  it('renders container with default studio-classic variant and toolbar', () => {
    const { container } = render(<Polaroid soundEnabled={false} />);
    const root = container.querySelector('.modui-polaroid');
    expect(root).toBeInTheDocument();
    expect(root).toHaveClass('modui-polaroid--studio-classic');
    expect(screen.getByText('POLAROID SX-70')).toBeInTheDocument();
    expect(screen.getByText('STUDIO ARCHIVE')).toBeInTheDocument();
  });

  it('renders all default Polaroid cards with captions and tags', () => {
    render(<Polaroid soundEnabled={false} />);
    expect(screen.getByText('Zurich Haptics Lab')).toBeInTheDocument();
    expect(screen.getByText('Subpixel Reverie')).toBeInTheDocument();
    expect(screen.getByText('Tokyo Midnight Crossing')).toBeInTheDocument();
    expect(screen.getByText('Spatial Studio v2')).toBeInTheDocument();

    const cards = screen.getAllByRole('button', { name: /Polaroid Photo:/i });
    expect(cards.length).toBe(DEFAULT_POLAROIDS.length);
  });

  it('switches layout mode between Scatter and Grid', () => {
    const { container } = render(<Polaroid soundEnabled={false} />);
    const root = container.querySelector('.modui-polaroid');
    expect(root).toHaveClass('modui-polaroid--scatter');

    const gridBtn = screen.getByRole('button', { name: 'Grid' });
    fireEvent.click(gridBtn);
    expect(root).toHaveClass('modui-polaroid--grid');

    const scatterBtn = screen.getByRole('button', { name: 'Scatter' });
    fireEvent.click(scatterBtn);
    expect(root).toHaveClass('modui-polaroid--scatter');
  });

  it('flips card to back face on flip button click and triggers onPhotoFlip', () => {
    const handleFlip = vi.fn();
    render(<Polaroid onPhotoFlip={handleFlip} soundEnabled={false} />);

    const flipButtons = screen.getAllByRole('button', { name: /flip to back/i });
    expect(flipButtons.length).toBeGreaterThan(0);

    // Click first flip button
    fireEvent.click(flipButtons[0]);

    expect(handleFlip).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'polaroid-1' }),
      true
    );

    // Back metadata should now be visible or rendered
    const stamps = screen.getAllByText(/EXPOSURE ARCHIVE/i);
    expect(stamps.length).toBeGreaterThan(0);
    const specs = screen.getAllByText(/INSTANT FILM 600/i);
    expect(specs.length).toBeGreaterThan(0);
  });

  it('flips card via keyboard Enter or Space key', () => {
    const handleFlip = vi.fn();
    render(<Polaroid onPhotoFlip={handleFlip} soundEnabled={false} />);

    const cards = screen.getAllByRole('button', { name: /Polaroid Photo:/i });
    const firstCard = cards[0];

    // Press Space to flip
    fireEvent.keyDown(firstCard, { key: ' ' });
    expect(handleFlip).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'polaroid-1' }),
      true
    );

    // Press Enter to flip back
    fireEvent.keyDown(firstCard, { key: 'Enter' });
    expect(handleFlip).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'polaroid-1' }),
      false
    );
  });

  it('triggers develop chemistry on Develop All click', () => {
    const { container } = render(<Polaroid soundEnabled={false} />);
    const developAllBtn = screen.getByRole('button', { name: /develop all photos/i });

    fireEvent.click(developAllBtn);

    const developingPhotos = container.querySelectorAll('.modui-polaroid-photo.is-developing');
    expect(developingPhotos.length).toBe(DEFAULT_POLAROIDS.length);
  });

  it('invokes onPhotoClick when a card is selected', () => {
    const handleClick = vi.fn();
    render(<Polaroid onPhotoClick={handleClick} soundEnabled={false} />);

    const cards = screen.getAllByRole('button', { name: /Polaroid Photo:/i });
    fireEvent.click(cards[0]);

    expect(handleClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'polaroid-1' })
    );
  });

  it('supports custom photos and variants', () => {
    const customPhotos: PolaroidPhoto[] = [
      {
        id: 'test-1',
        title: 'Custom Test Shot',
        caption: 'Test caption for verification',
        date: '01 JAN 2026',
        tag: 'Testing',
        cameraSettings: 'f/1.8 · 1/1000s · ISO 50',
      },
    ];

    const { container } = render(
      <Polaroid photos={customPhotos} variant="dark-room" soundEnabled={false} />
    );

    const root = container.querySelector('.modui-polaroid');
    expect(root).toHaveClass('modui-polaroid--dark-room');
    expect(screen.getByText('Custom Test Shot')).toBeInTheDocument();
    expect(screen.getByText('Test caption for verification')).toBeInTheDocument();
  });

  it('renders compact mode without controls for preview cards', () => {
    const { container } = render(<Polaroid compact soundEnabled={false} />);
    const root = container.querySelector('.modui-polaroid');
    expect(root).toHaveClass('modui-polaroid--compact');
    expect(screen.queryByText('POLAROID SX-70')).not.toBeInTheDocument();
  });
});
