import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { PageTurnBook, DEFAULT_BOOK_PAGES } from './PageTurnBook';

describe('PageTurnBook component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with accessible region role and default label', () => {
    render(<PageTurnBook soundEnabled={false} />);
    const region = screen.getByRole('region', { name: /3d interactive page turn book/i });
    expect(region).toBeInTheDocument();
    expect(region).toHaveClass('modui-page-turn-book');
    expect(region).toHaveClass('modui-page-turn--studio-editorial');
  });

  it('renders initial dual-page spread (Pages 1 & 2)', () => {
    render(<PageTurnBook soundEnabled={false} />);
    expect(screen.getByText('The Art of Tactile Motion')).toBeInTheDocument();
    expect(screen.getByText('Zero Runtime Baggage')).toBeInTheDocument();
    expect(screen.getByText('— 1 —')).toBeInTheDocument();
    expect(screen.getByText('— 2 —')).toBeInTheDocument();
  });

  it('turns to next spread when Next Page button is clicked', () => {
    const handlePageChange = vi.fn();
    render(<PageTurnBook soundEnabled={false} onPageChange={handlePageChange} />);

    const nextBtn = screen.getByRole('button', { name: /next spread/i });
    fireEvent.click(nextBtn);

    // Fast-forward page-turn animation duration (720ms)
    act(() => {
      vi.advanceTimersByTime(750);
    });

    expect(handlePageChange).toHaveBeenCalledWith(1);
    expect(screen.getByText('Architectural Shadows')).toBeInTheDocument();
    expect(screen.getByText('Acoustic Presence')).toBeInTheDocument();
  });

  it('turns backward when Prev Page button is clicked', () => {
    const handlePageChange = vi.fn();
    render(<PageTurnBook soundEnabled={false} onPageChange={handlePageChange} />);

    const nextBtn = screen.getByRole('button', { name: /next spread/i });
    fireEvent.click(nextBtn);
    act(() => {
      vi.advanceTimersByTime(750);
    });

    const prevBtn = screen.getByRole('button', { name: /previous spread/i });
    fireEvent.click(prevBtn);
    act(() => {
      vi.advanceTimersByTime(750);
    });

    expect(handlePageChange).toHaveBeenCalledWith(0);
    expect(screen.getByText('The Art of Tactile Motion')).toBeInTheDocument();
  });

  it('supports keyboard navigation via ArrowRight and ArrowLeft', () => {
    const handlePageChange = vi.fn();
    render(<PageTurnBook soundEnabled={false} onPageChange={handlePageChange} />);

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    act(() => {
      vi.advanceTimersByTime(750);
    });
    expect(handlePageChange).toHaveBeenCalledWith(1);

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    act(() => {
      vi.advanceTimersByTime(750);
    });
    expect(handlePageChange).toHaveBeenCalledWith(0);
  });

  it('renders custom variants correctly', () => {
    const { container } = render(<PageTurnBook variant="dark-obsidian" soundEnabled={false} />);
    const book = container.querySelector('.modui-page-turn--dark-obsidian');
    expect(book).toBeInTheDocument();
  });

  it('handles autoplay properly', () => {
    const handlePageChange = vi.fn();
    render(
      <PageTurnBook
        autoPlay={true}
        autoPlayInterval={2000}
        soundEnabled={false}
        onPageChange={handlePageChange}
      />
    );

    act(() => {
      vi.advanceTimersByTime(2000);
      vi.advanceTimersByTime(750);
    });

    expect(handlePageChange).toHaveBeenCalledWith(1);
  });
});

