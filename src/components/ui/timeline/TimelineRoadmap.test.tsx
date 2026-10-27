import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TimelineRoadmap, DEFAULT_ROADMAP_ITEMS } from './TimelineRoadmap';

describe('TimelineRoadmap component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with accessible region role and label', () => {
    render(<TimelineRoadmap />);
    const region = screen.getByRole('region', { name: /timeline roadmap/i });
    expect(region).toBeInTheDocument();
    expect(region).toHaveClass('modui-timeline-roadmap');
    expect(region).toHaveClass('modui-timeline-theme-studio-light');
  });

  it('renders all default milestones with titles and dates', () => {
    render(<TimelineRoadmap soundEnabled={false} />);
    expect(screen.getByText('Core Engine 2.0')).toBeInTheDocument();
    expect(screen.getByText('Q1 2026')).toBeInTheDocument();
    expect(screen.getByText('Spatial Audio Haptics')).toBeInTheDocument();
    expect(screen.getByText('Generative Canvas Primitives')).toBeInTheDocument();
  });

  it('updates active milestone and fires onSelectMilestone on node click', () => {
    const handleSelect = vi.fn();
    render(<TimelineRoadmap onSelectMilestone={handleSelect} soundEnabled={false} />);

    const firstNode = screen.getByRole('button', { name: /milestone: core engine 2\.0/i });
    fireEvent.click(firstNode);

    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'm1', title: 'Core Engine 2.0' }),
      0
    );
    expect(firstNode).toHaveAttribute('aria-pressed', 'true');
  });

  it('supports keyboard navigation with arrow keys and Home/End in vertical mode', () => {
    const handleSelect = vi.fn();
    render(<TimelineRoadmap orientation="vertical" onSelectMilestone={handleSelect} soundEnabled={false} activeId="m1" />);
    const region = screen.getByRole('region', { name: /timeline roadmap/i });

    // ArrowDown to move to next milestone
    fireEvent.keyDown(region, { key: 'ArrowDown' });
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'm2', title: 'Spatial Audio Haptics' }),
      1
    );

    // End to jump to last milestone
    fireEvent.keyDown(region, { key: 'End' });
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'm4', title: 'Generative Canvas Primitives' }),
      3
    );

    // Home to jump to first milestone
    fireEvent.keyDown(region, { key: 'Home' });
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'm1', title: 'Core Engine 2.0' }),
      0
    );
  });

  it('supports keyboard navigation with ArrowRight/ArrowLeft in horizontal mode', () => {
    const handleSelect = vi.fn();
    render(<TimelineRoadmap orientation="horizontal" onSelectMilestone={handleSelect} soundEnabled={false} activeId="m1" />);
    const region = screen.getByRole('region', { name: /timeline roadmap/i });

    fireEvent.keyDown(region, { key: 'ArrowRight' });
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'm2' }),
      1
    );

    fireEvent.keyDown(region, { key: 'ArrowLeft' });
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'm1' }),
      0
    );
  });

  it('applies theme variant classes correctly', () => {
    const { container } = render(<TimelineRoadmap variant="warm-editorial" />);
    const root = container.querySelector('.modui-timeline-roadmap');
    expect(root).toHaveClass('modui-timeline-theme-warm-editorial');
  });

  it('renders in compact mode with horizontal orientation', () => {
    const { container } = render(<TimelineRoadmap compact={true} soundEnabled={false} />);
    const root = container.querySelector('.modui-timeline-roadmap');
    expect(root).toHaveClass('modui-timeline-compact');
    expect(root).toHaveClass('modui-timeline-horizontal');
  });

  it('renders custom milestones when provided', () => {
    const customItems = [
      {
        id: 'c1',
        date: '2026.01',
        title: 'Custom Alpha',
        description: 'First alpha delivery',
        status: 'shipped' as const,
      },
      {
        id: 'c2',
        date: '2026.02',
        title: 'Custom Beta',
        description: 'Second beta iteration',
        status: 'in-progress' as const,
      },
    ];

    render(<TimelineRoadmap items={customItems} soundEnabled={false} />);
    expect(screen.getByText('Custom Alpha')).toBeInTheDocument();
    expect(screen.getByText('Custom Beta')).toBeInTheDocument();
  });
});
