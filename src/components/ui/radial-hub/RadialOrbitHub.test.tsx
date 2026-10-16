import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RadialOrbitHub, type RadialOrbitItem } from './RadialOrbitHub';

const mockItems: RadialOrbitItem[] = [
  { id: 'item-1', label: 'Dashboard', icon: <span data-testid="icon-1">D</span> },
  { id: 'item-2', label: 'Analytics', icon: <span data-testid="icon-2">A</span>, badge: 'New' },
  { id: 'item-3', label: 'Settings', icon: <span data-testid="icon-3">S</span> },
  { id: 'item-4', label: 'Lock', icon: <span data-testid="icon-4">L</span>, disabled: true },
];

describe('RadialOrbitHub component', () => {
  it('renders closed by default with proper ARIA accessibility roles', () => {
    render(<RadialOrbitHub items={mockItems} coreLabel="Main Hub" />);
    const coreBtn = screen.getByRole('button', { name: /main hub/i });
    expect(coreBtn).toBeInTheDocument();
    expect(coreBtn).toHaveAttribute('aria-expanded', 'false');
    expect(coreBtn).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('opens and closes on core button click and toggles aria-expanded', () => {
    const handleOpenChange = vi.fn();
    render(<RadialOrbitHub items={mockItems} coreLabel="Main Hub" onOpenChange={handleOpenChange} />);

    const coreBtn = screen.getByRole('button', { name: /main hub/i });
    fireEvent.click(coreBtn);

    expect(coreBtn).toHaveAttribute('aria-expanded', 'true');
    expect(handleOpenChange).toHaveBeenCalledWith(true);

    fireEvent.click(coreBtn);
    expect(coreBtn).toHaveAttribute('aria-expanded', 'false');
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders satellite items and handles item click and onSelect callback', () => {
    const handleSelect = vi.fn();
    const itemClick = vi.fn();
    const testItems: RadialOrbitItem[] = [
      { id: '1', label: 'Explore', icon: <span>E</span>, onClick: itemClick },
    ];

    render(<RadialOrbitHub items={testItems} defaultOpen={true} onSelect={handleSelect} />);

    const itemBtn = screen.getByRole('menuitem', { name: /explore/i });
    expect(itemBtn).toBeInTheDocument();

    fireEvent.click(itemBtn);
    expect(itemClick).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(testItems[0]);
  });

  it('respects disabled state on satellite items', () => {
    const disabledClick = vi.fn();
    const testItems: RadialOrbitItem[] = [
      { id: '1', label: 'Locked Action', icon: <span>L</span>, disabled: true, onClick: disabledClick },
    ];

    render(<RadialOrbitHub items={testItems} defaultOpen={true} />);
    const itemBtn = screen.getByRole('menuitem', { name: /locked action/i });
    expect(itemBtn).toBeDisabled();

    fireEvent.click(itemBtn);
    expect(disabledClick).not.toHaveBeenCalled();
  });

  it('supports closing with Escape keyboard shortcut', () => {
    const handleOpenChange = vi.fn();
    render(<RadialOrbitHub items={mockItems} defaultOpen={true} onOpenChange={handleOpenChange} />);

    const container = screen.getByRole('region');
    fireEvent.keyDown(container, { key: 'Escape' });

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});
