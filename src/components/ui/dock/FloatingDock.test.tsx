import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { FloatingDock } from './FloatingDock';
import type { DockItem } from './FloatingDock';

const mockItems: DockItem[] = [
  { id: 'home', label: 'Home', icon: <span data-testid="icon-home">H</span>, shortcut: '⌘1' },
  { id: 'components', label: 'Catalogue', icon: <span data-testid="icon-components">C</span>, shortcut: '⌘2', badge: 'New' },
  { id: 'docs', label: 'Documentation', icon: <span data-testid="icon-docs">D</span>, shortcut: '⌘3' },
  { id: 'notifications', label: 'Alerts', icon: <span data-testid="icon-notif">N</span>, badge: 3, badgeVariant: 'count' },
  { id: 'disabled-item', label: 'Locked Feature', icon: <span>L</span>, disabled: true },
];

describe('FloatingDock component', () => {
  it('renders dock with proper ARIA accessibility roles', () => {
    render(<FloatingDock items={mockItems} />);

    const dock = screen.getByRole('tablist', { name: /Interactive Dock/i });
    expect(dock).toBeInTheDocument();
    expect(dock).toHaveAttribute('aria-orientation', 'horizontal');

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(5);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('aria-label', 'Home');
  });

  it('triggers onSelect and sets active tab on item click', () => {
    const handleSelect = vi.fn();
    render(<FloatingDock items={mockItems} onSelect={handleSelect} />);

    const docsTab = screen.getByRole('tab', { name: 'Documentation' });
    fireEvent.click(docsTab);

    expect(handleSelect).toHaveBeenCalledWith('docs', expect.objectContaining({ id: 'docs', label: 'Documentation' }));
    expect(docsTab).toHaveAttribute('aria-selected', 'true');
  });

  it('does not trigger onSelect on disabled items', () => {
    const handleSelect = vi.fn();
    render(<FloatingDock items={mockItems} onSelect={handleSelect} />);

    const disabledTab = screen.getByRole('tab', { name: 'Locked Feature' });
    expect(disabledTab).toBeDisabled();
    fireEvent.click(disabledTab);

    expect(handleSelect).not.toHaveBeenCalled();
  });

  it('renders badges and tooltips with shortcuts', () => {
    render(<FloatingDock items={mockItems} />);

    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('⌘1')).toBeInTheDocument();
    expect(screen.getByText('⌘2')).toBeInTheDocument();
  });

  it('supports keyboard navigation via arrow keys', () => {
    render(<FloatingDock items={mockItems} />);

    const dock = screen.getByRole('tablist');
    fireEvent.keyDown(dock, { key: 'ArrowRight' });
    fireEvent.keyDown(dock, { key: 'ArrowLeft' });
    fireEvent.keyDown(dock, { key: 'Home' });
    fireEvent.keyDown(dock, { key: 'End' });
  });

  it('supports vertical orientation', () => {
    render(<FloatingDock items={mockItems} orientation="vertical" />);

    const dock = screen.getByRole('tablist');
    expect(dock).toHaveClass('modui-dock--vertical');
    expect(dock).toHaveAttribute('aria-orientation', 'vertical');
  });
});
