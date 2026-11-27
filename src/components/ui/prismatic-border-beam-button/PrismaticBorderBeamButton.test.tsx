import React, { createRef } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  PrismaticBorderBeamButton,
  type PrismaticBorderBeamButtonHandle,
} from './PrismaticBorderBeamButton';

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

describe('PrismaticBorderBeamButton', () => {
  it('renders button with default label and variant classes', () => {
    render(<PrismaticBorderBeamButton />);
    const btn = screen.getByRole('button', { name: /Launch Workspace/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('beam-variant-obsidian-prism');
  });

  it('fires onClick and emits radial pulse ring on click', () => {
    const onClick = vi.fn();
    const { container } = render(
      <PrismaticBorderBeamButton onClick={onClick}>Get Early Access</PrismaticBorderBeamButton>
    );

    const btn = screen.getByRole('button', { name: /Get Early Access/i });
    fireEvent.click(btn);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.beam-pulse-ring')).toBeInTheDocument();
  });

  it('renders loading state and blocks click callbacks while loading or disabled', () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <PrismaticBorderBeamButton loading={true} loadingText="Deploying..." onClick={onClick} />
    );

    const btn = screen.getByRole('button', { name: /Deploying.../i });
    expect(btn).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();

    rerender(<PrismaticBorderBeamButton disabled={true} onClick={onClick} />);
    const disabledBtn = screen.getByRole('button', { name: /Launch Workspace/i });
    expect(disabledBtn).toBeDisabled();
    fireEvent.click(disabledBtn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('tracks pointer move for specular spotlight and resets on leave', () => {
    render(<PrismaticBorderBeamButton />);
    const btn = screen.getByRole('button', { name: /Launch Workspace/i });

    btn.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 200, height: 50, right: 200, bottom: 50 }) as DOMRect;

    fireEvent.pointerMove(btn, { clientX: 150, clientY: 25 });
    expect(btn.style.getPropertyValue('--pointer-x')).toBe('75%');

    fireEvent.pointerLeave(btn);
    expect(btn.style.transform).toBe('');
  });

  it('exposes imperative handle methods via ref', () => {
    const ref = createRef<PrismaticBorderBeamButtonHandle>();
    const { container } = render(<PrismaticBorderBeamButton ref={ref} />);

    act(() => {
      ref.current?.triggerPulse();
      ref.current?.setBeamSpeed(1.5);
    });

    expect(container.querySelector('.beam-pulse-ring')).toBeInTheDocument();
    const btn = screen.getByRole('button');
    expect(btn.style.getPropertyValue('--beam-duration')).toBe('1.5s');
  });

  it('supports compact explorer mode', () => {
    const { container } = render(<PrismaticBorderBeamButton compact={true} />);
    expect(container.querySelector('.beam-compact')).toBeInTheDocument();
  });
});
