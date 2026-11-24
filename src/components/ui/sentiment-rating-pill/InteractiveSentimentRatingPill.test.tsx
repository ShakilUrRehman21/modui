import React, { createRef } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  InteractiveSentimentRatingPill,
  type InteractiveSentimentRatingPillHandle,
} from './InteractiveSentimentRatingPill';

// Mock Web Audio API
beforeEach(() => {
  const mockAudioContext = {
    currentTime: 0,
    state: 'running',
    resume: () => Promise.resolve(),
    createOscillator: () => ({
      type: 'sine',
      frequency: { setValueAtTime: () => {} },
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

describe('InteractiveSentimentRatingPill', () => {
  it('renders default rating 5 with promoter status and emoji', () => {
    render(<InteractiveSentimentRatingPill defaultValue={5} />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getByText('Exceptional Craft')).toBeInTheDocument();
    expect(screen.getByText('promoter')).toBeInTheDocument();
    expect(screen.getByText('🤩')).toBeInTheDocument();
  });

  it('renders 5 segmented radio buttons with correct ARIA attributes', () => {
    render(<InteractiveSentimentRatingPill defaultValue={5} />);
    const buttons = screen.getAllByRole('radio');
    expect(buttons).toHaveLength(5);
    expect(buttons[4]).toHaveAttribute('aria-checked', 'true');
    expect(buttons[0]).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onChange with rating and tier when clicking a rating button', () => {
    const handleChange = vi.fn();
    render(<InteractiveSentimentRatingPill defaultValue={5} onChange={handleChange} />);

    const buttons = screen.getAllByRole('radio');
    fireEvent.click(buttons[0]); // Rating 1

    expect(handleChange).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        rating: 1,
        label: 'Poor',
        title: 'Critical Issue',
        category: 'detractor',
      })
    );
    expect(screen.getByText('Critical Issue')).toBeInTheDocument();
    expect(screen.getByText('detractor')).toBeInTheDocument();
    expect(screen.getByText('😡')).toBeInTheDocument();
  });

  it('navigates ratings using keyboard arrows, Home, End, and number keys', () => {
    const handleChange = vi.fn();
    render(<InteractiveSentimentRatingPill defaultValue={3} onChange={handleChange} />);
    const radiogroup = screen.getByRole('radiogroup');

    // ArrowLeft: 3 -> 2
    fireEvent.keyDown(radiogroup, { key: 'ArrowLeft' });
    expect(handleChange).toHaveBeenCalledWith(2, expect.objectContaining({ rating: 2 }));

    // ArrowRight: 2 -> 3
    fireEvent.keyDown(radiogroup, { key: 'ArrowRight' });
    expect(handleChange).toHaveBeenCalledWith(3, expect.objectContaining({ rating: 3 }));

    // Home: jump to 1
    fireEvent.keyDown(radiogroup, { key: 'Home' });
    expect(handleChange).toHaveBeenCalledWith(1, expect.objectContaining({ rating: 1 }));

    // End: jump to 5
    fireEvent.keyDown(radiogroup, { key: 'End' });
    expect(handleChange).toHaveBeenCalledWith(5, expect.objectContaining({ rating: 5 }));

    // Number key '4': jump to 4
    fireEvent.keyDown(radiogroup, { key: '4' });
    expect(handleChange).toHaveBeenCalledWith(4, expect.objectContaining({ rating: 4 }));
  });

  it('exposes imperative handle methods via ref', () => {
    const ref = createRef<InteractiveSentimentRatingPillHandle>();
    render(<InteractiveSentimentRatingPill ref={ref} defaultValue={4} />);

    expect(ref.current).toBeDefined();
    expect(ref.current?.getRating()).toBe(4);
    expect(ref.current?.getSentiment().title).toBe('High Delight');

    act(() => {
      ref.current?.setRating(1);
    });
    expect(ref.current?.getRating()).toBe(1);
    expect(ref.current?.getSentiment().category).toBe('detractor');

    act(() => {
      ref.current?.reset();
    });
    expect(ref.current?.getRating()).toBe(4);
  });

  it('supports selecting feedback tags and submitting notes', () => {
    const handleSubmit = vi.fn();
    render(
      <InteractiveSentimentRatingPill
        defaultValue={5}
        showFeedbackDrawer={true}
        onSubmitFeedback={handleSubmit}
      />
    );

    const tag = screen.getByText('⚡ Lightning Fast');
    fireEvent.click(tag);
    expect(tag).toHaveClass('senti-tag-selected');

    const textarea = screen.getByPlaceholderText(/Tell us what you loved/i);
    fireEvent.change(textarea, { target: { value: 'Incredible polish and responsiveness!' } });

    const submitBtn = screen.getByText('Submit Rating & Notes');
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        rating: 5,
        selectedTags: ['⚡ Lightning Fast'],
        note: 'Incredible polish and responsiveness!',
      })
    );
    expect(screen.getByText(/Feedback recorded!/i)).toBeInTheDocument();
  });

  it('renders compactly for Explorer preview cards without breaking', () => {
    const { container } = render(
      <InteractiveSentimentRatingPill compact={true} defaultValue={5} />
    );
    expect(container.querySelector('.senti-compact')).toBeInTheDocument();
    // In compact mode, telemetry row is hidden to prevent card overflow
    expect(screen.queryByText('Realtime CSAT:')).not.toBeInTheDocument();
  });

  it('ignores clicks and key events when readOnly is true', () => {
    const handleChange = vi.fn();
    render(<InteractiveSentimentRatingPill defaultValue={3} readOnly={true} onChange={handleChange} />);

    const buttons = screen.getAllByRole('radio');
    fireEvent.click(buttons[4]);
    expect(handleChange).not.toHaveBeenCalled();

    const radiogroup = screen.getByRole('radiogroup');
    fireEvent.keyDown(radiogroup, { key: 'ArrowRight' });
    expect(handleChange).not.toHaveBeenCalled();
  });
});
