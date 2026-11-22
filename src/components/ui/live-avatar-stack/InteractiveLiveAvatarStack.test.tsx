import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React, { createRef } from 'react';
import {
  InteractiveLiveAvatarStack,
  type InteractiveLiveAvatarStackHandle,
  type TeammatePresence,
} from './InteractiveLiveAvatarStack';

describe('InteractiveLiveAvatarStack component (Primitive #38)', () => {
  it('renders with role="group" and accessible aria attributes', () => {
    render(<InteractiveLiveAvatarStack />);
    const group = screen.getByRole('group', {
      name: /Multiplayer Live Teammate Presence Stack/i,
    });
    expect(group).toBeInTheDocument();
  });

  it('renders visible teammates initials based on maxVisible prop', () => {
    render(<InteractiveLiveAvatarStack maxVisible={3} />);
    expect(screen.getByText('SR')).toBeInTheDocument();
    expect(screen.getByText('AL')).toBeInTheDocument();
    expect(screen.getByText('MD')).toBeInTheDocument();
    // 4th and 5th should be hidden under overflow
    expect(screen.queryByText('EK')).not.toBeInTheDocument();
  });

  it('renders +N overflow button when total teammates exceed maxVisible', () => {
    render(<InteractiveLiveAvatarStack maxVisible={3} />);
    // 5 total - 3 visible = +2
    const overflowBtn = screen.getByRole('button', { name: /View 2 more teammates/i });
    expect(overflowBtn).toBeInTheDocument();
    expect(overflowBtn).toHaveTextContent('+2');
  });

  it('triggers onTeammateClick callback when an avatar is clicked', () => {
    const handleClick = vi.fn();
    render(<InteractiveLiveAvatarStack onTeammateClick={handleClick} />);

    const firstAvatar = screen.getByRole('button', { name: /Sarah Ross/i });
    fireEvent.click(firstAvatar);

    expect(handleClick).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'user-sr',
        name: 'Sarah Ross',
      })
    );
  });

  it('triggers onInviteClick when the invite button is clicked', () => {
    const handleInvite = vi.fn();
    render(<InteractiveLiveAvatarStack showInviteButton={true} onInviteClick={handleInvite} />);

    const inviteBtn = screen.getByRole('button', { name: /Invite teammate/i });
    fireEvent.click(inviteBtn);

    expect(handleInvite).toHaveBeenCalledTimes(1);
  });

  it('triggers onOverflowClick with hidden teammates when overflow button is clicked', () => {
    const handleOverflow = vi.fn();
    render(<InteractiveLiveAvatarStack maxVisible={3} onOverflowClick={handleOverflow} />);

    const overflowBtn = screen.getByRole('button', { name: /View 2 more teammates/i });
    fireEvent.click(overflowBtn);

    expect(handleOverflow).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 'user-ek' }),
        expect.objectContaining({ id: 'user-jt' }),
      ])
    );
  });

  it('applies variant and size classes properly', () => {
    const { container } = render(
      <InteractiveLiveAvatarStack
        variant="cyber-neon"
        size="lg"
        compact={true}
      />
    );
    const root = container.querySelector('.modui-las-root');
    expect(root).toHaveClass('modui-las-variant-cyber-neon');
    expect(root).toHaveClass('modui-las-size-lg');
    expect(root).toHaveClass('modui-las-compact');
  });

  it('exposes imperative handle methods via ref to add, remove, and update teammates', () => {
    const ref = createRef<InteractiveLiveAvatarStackHandle>();
    render(<InteractiveLiveAvatarStack ref={ref} maxVisible={10} />);

    expect(ref.current).toBeDefined();
    expect(ref.current?.getTeammates().length).toBe(5);

    const newTeammate: TeammatePresence = {
      id: 'user-zen',
      name: 'Zenith Vector',
      initials: 'ZV',
      role: 'Staff Kernel Dev',
      status: 'online',
    };

    act(() => {
      ref.current?.addTeammate(newTeammate);
    });
    expect(screen.getByText('ZV')).toBeInTheDocument();
    expect(ref.current?.getTeammates().length).toBe(6);

    act(() => {
      ref.current?.updateStatus('user-zen', 'presenting', 'Sharing Terminal Session');
    });
    expect(ref.current?.getTeammates().find((t) => t.id === 'user-zen')?.status).toBe(
      'presenting'
    );

    act(() => {
      ref.current?.removeTeammate('user-zen');
    });
    expect(screen.queryByText('ZV')).not.toBeInTheDocument();
    expect(ref.current?.getTeammates().length).toBe(5);
  });
});
