import React, { createRef } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  InteractiveReactionPillBar,
  type InteractiveReactionPillBarHandle,
} from './InteractiveReactionPillBar';

beforeEach(() => {
  const mockAudioContext = {
    currentTime: 0,
    state: 'running',
    resume: () => Promise.resolve(),
    createOscillator: () => ({
      type: 'sine',
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

describe('InteractiveReactionPillBar', () => {
  it('renders default reaction pills with accessible group role and counts', () => {
    render(<InteractiveReactionPillBar />);
    expect(screen.getByRole('group', { name: /Emoji Reactions/i })).toBeInTheDocument();

    const fireBtn = screen.getByRole('button', { name: /Fire \(14\)/i });
    expect(fireBtn).toHaveAttribute('aria-pressed', 'true');

    const rocketBtn = screen.getByRole('button', { name: /Ship it \(9\)/i });
    expect(rocketBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('toggles reaction state, updates count, and fires callbacks', () => {
    const onToggle = vi.fn();
    render(<InteractiveReactionPillBar onReactionToggle={onToggle} />);

    const rocketBtn = screen.getByRole('button', { name: /Ship it \(9\)/i });
    fireEvent.click(rocketBtn);

    expect(screen.getByRole('button', { name: /Ship it \(10\)/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(onToggle).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'rocket', reacted: true, count: 10 }),
      expect.any(Array)
    );

    // Click again to unreact
    fireEvent.click(screen.getByRole('button', { name: /Ship it \(10\)/i }));
    expect(screen.getByRole('button', { name: /Ship it \(9\)/i })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('opens quick-add emoji popover and adds a new reaction pill', () => {
    render(<InteractiveReactionPillBar />);
    const addBtn = screen.getByRole('button', { name: /Add reaction/i });
    expect(addBtn).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(addBtn);
    expect(addBtn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu', { name: /Quick reaction picker/i })).toBeInTheDocument();

    const celebrateItem = screen.getByRole('menuitem', { name: /Add Celebrate/i });
    fireEvent.click(celebrateItem);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Celebrate \(1\)/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('closes the quick-add popover when Escape is pressed', () => {
    render(<InteractiveReactionPillBar />);
    fireEvent.click(screen.getByRole('button', { name: /Add reaction/i }));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('exposes imperative handle methods via ref', () => {
    const ref = createRef<InteractiveReactionPillBarHandle>();
    render(<InteractiveReactionPillBar ref={ref} />);

    expect(ref.current?.getReactions()).toHaveLength(4);

    act(() => {
      ref.current?.toggleReaction('heart');
    });
    expect(ref.current?.getReactions().find((r) => r.id === 'heart')?.count).toBe(25);

    act(() => {
      ref.current?.addReaction('💯', 'Hundred');
    });
    expect(ref.current?.getReactions()).toHaveLength(5);

    act(() => {
      ref.current?.reset();
    });
    expect(ref.current?.getReactions()).toHaveLength(4);
    expect(ref.current?.getReactions().find((r) => r.id === 'heart')?.count).toBe(24);
  });

  it('supports compact explorer mode without tooltips', () => {
    const { container } = render(<InteractiveReactionPillBar compact={true} />);
    expect(container.querySelector('.react-compact')).toBeInTheDocument();
    expect(container.querySelector('.react-pill-tooltip')).not.toBeInTheDocument();
  });

  it('prevents interaction when readOnly is true', () => {
    const onToggle = vi.fn();
    render(<InteractiveReactionPillBar readOnly={true} onReactionToggle={onToggle} />);

    expect(screen.queryByRole('button', { name: /Add reaction/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Ship it \(9\)/i }));
    expect(onToggle).not.toHaveBeenCalled();
  });
});
