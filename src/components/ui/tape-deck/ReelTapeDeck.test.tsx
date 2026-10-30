import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { ReelTapeDeck, DEFAULT_TRACK_LIST } from './ReelTapeDeck';

describe('ReelTapeDeck component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with accessible region role and default label', () => {
    render(<ReelTapeDeck />);
    const deck = screen.getByRole('region', {
      name: /analog studio reel-to-reel tape deck/i,
    });
    expect(deck).toBeInTheDocument();
    expect(deck).toHaveClass('modui-reel-deck');
    expect(deck).toHaveClass('modui-reel-deck--studio-light');
  });

  it('renders dual supply and take-up tape reels with accessible slider roles', () => {
    render(<ReelTapeDeck soundEnabled={false} />);
    const supplyReel = screen.getByRole('slider', { name: /supply tape reel/i });
    const takeUpReel = screen.getByRole('slider', { name: /take-up tape reel/i });
    expect(supplyReel).toBeInTheDocument();
    expect(takeUpReel).toBeInTheDocument();
  });

  it('renders current track information and branding', () => {
    render(<ReelTapeDeck soundEnabled={false} />);
    expect(screen.getByText('STUDIO DECK')).toBeInTheDocument();
    expect(screen.getByText(/MODUI RT-1500 MASTERING CONSOLE/i)).toBeInTheDocument();
    expect(screen.getByText(DEFAULT_TRACK_LIST[0].title)).toBeInTheDocument();
    expect(screen.getByText(DEFAULT_TRACK_LIST[0].artist)).toBeInTheDocument();
  });

  it('renders twin VU meters for Channel L and Channel R', () => {
    render(<ReelTapeDeck soundEnabled={false} />);
    expect(screen.getByText('CH 1 // L')).toBeInTheDocument();
    expect(screen.getByText('CH 2 // R')).toBeInTheDocument();
  });

  it('renders piano-key transport toolbar with all mechanical controls', () => {
    render(<ReelTapeDeck soundEnabled={false} />);
    const toolbar = screen.getByRole('toolbar', { name: /tape transport controls/i });
    expect(toolbar).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /^play$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /stop transport/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^pause$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^rewind$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fast forward/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^record$/i })).toBeInTheDocument();
  });

  it('triggers onTransportChange callback when transport buttons are clicked', () => {
    const handleTransport = vi.fn();
    render(<ReelTapeDeck onTransportChange={handleTransport} soundEnabled={false} />);

    const playBtn = screen.getByRole('button', { name: /^play$/i });
    fireEvent.click(playBtn);
    expect(handleTransport).toHaveBeenCalledWith('play');

    const stopBtn = screen.getByRole('button', { name: /stop transport/i });
    fireEvent.click(stopBtn);
    expect(handleTransport).toHaveBeenCalledWith('stop');
  });

  it('switches tape speed setting when IPS buttons are clicked', () => {
    render(<ReelTapeDeck soundEnabled={false} />);
    const speed75Btn = screen.getByRole('button', { name: /7\.5 ips/i });
    expect(speed75Btn).toBeInTheDocument();

    fireEvent.click(speed75Btn);
    expect(speed75Btn).toHaveClass('modui-tape-speed-btn--active');
  });

  it('switches tracks when track selection buttons are clicked', () => {
    const handleTrackChange = vi.fn();
    render(<ReelTapeDeck onTrackChange={handleTrackChange} soundEnabled={false} />);

    const track2Btn = screen.getByRole('button', { name: /tk 2/i });
    fireEvent.click(track2Btn);

    expect(handleTrackChange).toHaveBeenCalledWith(DEFAULT_TRACK_LIST[1], 1);
    expect(screen.getByText(DEFAULT_TRACK_LIST[1].title)).toBeInTheDocument();
  });

  it('handles keyboard spacebar for Play/Pause transport control', () => {
    const handleTransport = vi.fn();
    render(<ReelTapeDeck onTransportChange={handleTransport} soundEnabled={false} />);
    const deck = screen.getByRole('region', { name: /analog studio reel-to-reel tape deck/i });

    fireEvent.keyDown(deck, { key: ' ' });
    expect(handleTransport).toHaveBeenCalledWith('play');
  });

  it('applies variant styling CSS class correctly', () => {
    const { container: c1 } = render(<ReelTapeDeck variant="dark-slate" soundEnabled={false} />);
    expect(c1.firstChild).toHaveClass('modui-reel-deck--dark-slate');

    const { container: c2 } = render(<ReelTapeDeck variant="warm-editorial" soundEnabled={false} />);
    expect(c2.firstChild).toHaveClass('modui-reel-deck--warm-editorial');

    const { container: c3 } = render(<ReelTapeDeck variant="minimal-mono" soundEnabled={false} />);
    expect(c3.firstChild).toHaveClass('modui-reel-deck--minimal-mono');
  });

  it('renders in compact mode for explorer cards', () => {
    const { container } = render(<ReelTapeDeck compact={true} soundEnabled={false} />);
    expect(container.firstChild).toHaveClass('modui-reel-deck--compact');
  });
});

