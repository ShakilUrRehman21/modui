import React, { createRef } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  InteractivePopoutFolder,
  type InteractivePopoutFolderHandle,
} from './InteractivePopoutFolder';

beforeEach(() => {
  const mockAudioContext = {
    currentTime: 0,
    state: 'running',
    resume: () => Promise.resolve(),
    createOscillator: () => ({
      type: 'triangle',
      frequency: {
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
      },
      connect: () => {},
      start: () => {},
      stop: () => {},
    }),
    createGain: () => ({
      gain: {
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
      },
      connect: () => {},
    }),
    destination: {},
  };

  window.AudioContext = function () {
    return mockAudioContext;
  } as unknown as typeof AudioContext;
});

describe('InteractivePopoutFolder', () => {
  it('renders folder title, image count, and 3 fanned photo cards', () => {
    render(<InteractivePopoutFolder title="Studio Captures" />);
    expect(screen.getByRole('region', { name: /Studio Captures image folder/i })).toBeInTheDocument();
    expect(screen.getByText('Studio Captures')).toBeInTheDocument();
    expect(screen.getByText('3 images')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open image Obsidian Wave Study/i })).toBeInTheDocument();
  });

  it('toggles open state when clicking the folder shell', () => {
    const onToggle = vi.fn();
    render(<InteractivePopoutFolder onFolderToggle={onToggle} />);

    const folderBtn = screen.getByRole('button', { name: /Toggle Visual Captures folder/i });
    expect(folderBtn).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(folderBtn);
    expect(folderBtn).toHaveAttribute('aria-expanded', 'true');
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('opens the image lightbox modal when clicking a popped-out image', () => {
    const onImageOpen = vi.fn();
    render(<InteractivePopoutFolder onImageOpen={onImageOpen} />);

    const photoBtn = screen.getByRole('button', { name: /Open image Iridescent Glass Prism/i });
    fireEvent.click(photoBtn);

    expect(screen.getByRole('dialog', { name: /Iridescent Glass Prism/i })).toBeInTheDocument();
    expect(onImageOpen).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'img-2', title: 'Iridescent Glass Prism' }),
      1
    );
  });

  it('navigates images inside the lightbox and closes on Escape or Close button', () => {
    const onImageClose = vi.fn();
    render(<InteractivePopoutFolder onImageClose={onImageClose} />);

    fireEvent.click(screen.getByRole('button', { name: /Open image Obsidian Wave Study/i }));
    expect(screen.getByRole('dialog', { name: /Obsidian Wave Study/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Next image/i }));
    expect(screen.getByRole('dialog', { name: /Iridescent Glass Prism/i })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByRole('dialog', { name: /Obsidian Wave Study/i })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onImageClose).toHaveBeenCalledTimes(1);
  });

  it('exposes imperative handle methods via ref', () => {
    const ref = createRef<InteractivePopoutFolderHandle>();
    render(<InteractivePopoutFolder ref={ref} />);

    act(() => {
      ref.current?.openFolder();
      ref.current?.openImage(2);
    });
    expect(screen.getByRole('dialog', { name: /Neon Horizon Mesh/i })).toBeInTheDocument();

    act(() => {
      ref.current?.closeLightbox();
      ref.current?.closeFolder();
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('supports compact explorer mode', () => {
    const { container } = render(
      <InteractivePopoutFolder compact={true} size="sm" defaultOpen={true} />
    );
    expect(container.querySelector('.pfolder-compact')).toBeInTheDocument();
    expect(container.querySelector('.pfolder-shell--open')).toBeInTheDocument();
  });
});
