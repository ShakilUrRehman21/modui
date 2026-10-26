import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { CardStack, DEFAULT_STACK_ITEMS } from './CardStack';

describe('CardStack component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it('renders with accessible region role and default label', () => {
    render(<CardStack />);
    const region = screen.getByRole('region', { name: /card stack/i });
    expect(region).toBeInTheDocument();
    expect(region).toHaveClass('modui-card-stack-wrap');
    expect(region).toHaveClass('modui-card-stack-theme-studio-light');
  });

  it('renders default cards with top card accessible button', () => {
    render(<CardStack soundEnabled={false} />);
    const topCardButton = screen.getByRole('button', { name: /card 01: fluid kinetic springs/i });
    expect(topCardButton).toBeInTheDocument();
    expect(screen.getByText('Fluid Kinetic Springs')).toBeInTheDocument();
    expect(screen.getByText('Design System')).toBeInTheDocument();
  });

  it('cycles to next card when top card is clicked', () => {
    const handleCardChange = vi.fn();
    render(<CardStack onCardChange={handleCardChange} soundEnabled={false} />);

    const topCard = screen.getByRole('button', { name: /card 01: fluid kinetic springs/i });
    fireEvent.click(topCard);

    // Fast-forward fling timer (220ms)
    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(handleCardChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'card-02', title: 'Synthesized Acoustic Haptics' }),
      1
    );
  });

  it('supports keyboard navigation with ArrowRight and ArrowLeft', () => {
    const handleCardChange = vi.fn();
    render(<CardStack onCardChange={handleCardChange} soundEnabled={false} />);
    const region = screen.getByRole('region', { name: /card stack/i });

    // ArrowRight to cycle next
    fireEvent.keyDown(region, { key: 'ArrowRight' });
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(handleCardChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'card-02' }),
      1
    );

    // ArrowLeft to cycle prev
    fireEvent.keyDown(region, { key: 'ArrowLeft' });
    expect(handleCardChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'card-01' }),
      0
    );
  });

  it('switches cards when dot indicator is clicked', () => {
    const handleCardChange = vi.fn();
    render(<CardStack onCardChange={handleCardChange} soundEnabled={false} />);

    const dot3 = screen.getByRole('tab', { name: /jump to card 3/i });
    fireEvent.click(dot3);

    expect(handleCardChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'card-03', title: 'Subpixel Spatial Glare' }),
      2
    );
  });

  it('applies theme variant classes correctly', () => {
    const { container } = render(<CardStack variant="warm-editorial" />);
    const root = container.querySelector('.modui-card-stack-wrap');
    expect(root).toHaveClass('modui-card-stack-theme-warm-editorial');
  });

  it('renders in compact mode without breaking layout', () => {
    const { container } = render(<CardStack compact={true} soundEnabled={false} />);
    const root = container.querySelector('.modui-card-stack-wrap');
    expect(root).toHaveClass('modui-card-stack-compact');
    // Navigation controls are hidden in compact mode
    expect(screen.queryByRole('tablist', { name: /card dots/i })).not.toBeInTheDocument();
  });

  it('renders custom items array when provided', () => {
    const customItems = [
      {
        id: 'cust-1',
        title: 'Custom Alpha',
        description: 'First custom card description',
        category: 'ALPHA',
      },
      {
        id: 'cust-2',
        title: 'Custom Beta',
        description: 'Second custom card description',
        category: 'BETA',
      },
    ];

    render(<CardStack items={customItems} soundEnabled={false} />);
    expect(screen.getByText('Custom Alpha')).toBeInTheDocument();
    expect(screen.getByText('ALPHA')).toBeInTheDocument();
  });
});
