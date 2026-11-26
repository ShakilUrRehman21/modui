import React, { createRef } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  InteractiveSourceCitations,
  type InteractiveSourceCitationsHandle,
} from './InteractiveSourceCitations';

beforeEach(() => {
  const mockAudioContext = {
    currentTime: 0,
    state: 'running',
    resume: () => Promise.resolve(),
    createOscillator: () => ({
      type: 'triangle',
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

describe('InteractiveSourceCitations', () => {
  it('renders grounded sources summary and default active citation #1', () => {
    render(<InteractiveSourceCitations />);
    expect(screen.getByRole('region', { name: /Grounded Source Citations/i })).toBeInTheDocument();
    expect(screen.getByText(/3 Sources Grounded/i)).toBeInTheDocument();
    expect(screen.getByText('react.dev/blog/react-compiler')).toBeInTheDocument();
    expect(screen.getByText('99% Grounded')).toBeInTheDocument();
  });

  it('switches active source drawer when inline citation chip is clicked', () => {
    const onSelect = vi.fn();
    render(<InteractiveSourceCitations onSourceSelect={onSelect} />);

    const chip2 = screen.getByRole('button', { name: /Inspect citation 2/i });
    fireEvent.click(chip2);

    expect(chip2).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('developer.mozilla.org/css-variables')).toBeInTheDocument();
    expect(screen.getByText('97% Grounded')).toBeInTheDocument();
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'css-tokens', index: 2 }),
      2
    );
  });

  it('cycles through sources using stepper buttons and keyboard navigation', () => {
    render(<InteractiveSourceCitations />);
    const root = screen.getByRole('region', { name: /Grounded Source Citations/i });

    fireEvent.click(screen.getByRole('button', { name: /Next citation/i }));
    expect(screen.getByText('developer.mozilla.org/css-variables')).toBeInTheDocument();

    fireEvent.keyDown(root, { key: 'ArrowRight' });
    expect(screen.getByText('webaudio.github.io/web-audio-api')).toBeInTheDocument();

    fireEvent.keyDown(root, { key: 'ArrowLeft' });
    expect(screen.getByText('developer.mozilla.org/css-variables')).toBeInTheDocument();

    fireEvent.keyDown(root, { key: '1' });
    expect(screen.getByText('react.dev/blog/react-compiler')).toBeInTheDocument();
  });

  it('exposes imperative handle methods via ref', () => {
    const ref = createRef<InteractiveSourceCitationsHandle>();
    render(<InteractiveSourceCitations ref={ref} />);

    expect(ref.current?.getActiveIndex()).toBe(1);

    act(() => {
      ref.current?.selectSource(3);
    });
    expect(ref.current?.getActiveIndex()).toBe(3);

    act(() => {
      ref.current?.nextSource();
    });
    expect(ref.current?.getActiveIndex()).toBe(1);

    act(() => {
      ref.current?.prevSource();
    });
    expect(ref.current?.getActiveIndex()).toBe(3);

    act(() => {
      ref.current?.reset();
    });
    expect(ref.current?.getActiveIndex()).toBe(1);
  });

  it('switches sources via bottom source strip tabs', () => {
    render(<InteractiveSourceCitations />);
    const tab3 = screen.getByRole('tab', { name: /\[3\]/i });
    fireEvent.click(tab3);
    expect(tab3).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Web Audio API Oscillator Synthesis')).toBeInTheDocument();
  });

  it('renders compact explorer mode without source strip or stepper', () => {
    const { container } = render(<InteractiveSourceCitations compact={true} />);
    expect(container.querySelector('.cite-compact')).toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Next citation/i })).not.toBeInTheDocument();
  });
});
