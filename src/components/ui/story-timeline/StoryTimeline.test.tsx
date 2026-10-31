import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { StoryTimeline, DEFAULT_STORIES } from './StoryTimeline';
import type { StorySlide } from './StoryTimeline';

describe('StoryTimeline component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with accessible region role and default label', () => {
    render(<StoryTimeline soundEnabled={false} />);
    const region = screen.getByRole('region', { name: /instagram-style story timeline/i });
    expect(region).toBeInTheDocument();
    expect(region).toHaveClass('story-timeline-root');
    expect(region).toHaveClass('story-theme-instagram-dark');
  });

  it('renders author username and initial story title', () => {
    render(<StoryTimeline username="modui.lab" soundEnabled={false} />);
    expect(screen.getByText('modui.lab')).toBeInTheDocument();
    expect(screen.getByText('The Brass Dial Experiment')).toBeInTheDocument();
    expect(screen.getByText('CHAPTER 01 · PROTOTYPE')).toBeInTheDocument();
  });

  it('renders segmented progress bars corresponding to all stories', () => {
    render(<StoryTimeline soundEnabled={false} />);
    const progressStrip = screen.getByRole('progressbar');
    expect(progressStrip).toBeInTheDocument();
    const segments = progressStrip.querySelectorAll('.story-progress-segment');
    expect(segments.length).toBe(DEFAULT_STORIES.length);
  });

  it('navigates through stories with ArrowRight and ArrowLeft keys', () => {
    const handleStoryChange = vi.fn();
    render(<StoryTimeline onStoryChange={handleStoryChange} soundEnabled={false} />);
    const region = screen.getByRole('region', { name: /instagram-style story timeline/i });

    // ArrowRight -> advance to story 2
    fireEvent.keyDown(region, { key: 'ArrowRight' });
    expect(handleStoryChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'story-2' }),
      1
    );

    // ArrowLeft -> back to story 1
    fireEvent.keyDown(region, { key: 'ArrowLeft' });
    expect(handleStoryChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'story-1' }),
      0
    );
  });

  it('handles interactive poll voting and reveals percentages', () => {
    const handleVote = vi.fn();
    render(<StoryTimeline onPollVote={handleVote} soundEnabled={false} />);

    const firstOption = screen.getByText('Yes, heavy tactile dials');
    expect(firstOption).toBeInTheDocument();

    fireEvent.click(firstOption);

    expect(handleVote).toHaveBeenCalledWith('story-1', 'opt-1');
    // Result bar and percentage should now be visible on both options
    expect(screen.getAllByText(/%/).length).toBe(2);
  });

  it('spawns flying heart reaction on heart button click', () => {
    render(<StoryTimeline soundEnabled={false} />);
    const heartBtn = screen.getByRole('button', { name: /send heart reaction/i });
    expect(heartBtn).toBeInTheDocument();

    fireEvent.click(heartBtn);
    const flyingHearts = document.querySelectorAll('.floating-heart');
    expect(flyingHearts.length).toBeGreaterThan(0);
  });

  it('toggles pause and mute controls', () => {
    render(<StoryTimeline soundEnabled={false} />);
    const pauseBtn = screen.getByRole('button', { name: /pause story/i });
    fireEvent.click(pauseBtn);
    expect(screen.getByRole('button', { name: /resume story/i })).toBeInTheDocument();

    const muteBtn = screen.getByRole('button', { name: /unmute story sound/i });
    fireEvent.click(muteBtn);
    expect(screen.getByRole('button', { name: /mute story sound/i })).toBeInTheDocument();
  });

  it('renders custom story dataset', () => {
    const custom: StorySlide[] = [
      {
        id: 'cust-1',
        timestamp: 'Just now',
        tag: 'SPECIAL DROP',
        title: 'Custom Story Title',
        description: 'Testing custom story description.',
        gradient: 'linear-gradient(135deg, #111, #222)',
        accentColor: '#3b82f6',
      },
    ];

    render(<StoryTimeline stories={custom} soundEnabled={false} />);
    expect(screen.getByText('Custom Story Title')).toBeInTheDocument();
    expect(screen.getByText('SPECIAL DROP')).toBeInTheDocument();
  });
});
