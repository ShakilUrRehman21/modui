import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MagneticProjectList, DEFAULT_PROJECTS } from './MagneticProjectList';
import type { ProjectItem } from './MagneticProjectList';

describe('MagneticProjectList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders container with default studio-light variant and header bar', () => {
    const { container } = render(<MagneticProjectList soundEnabled={false} />);
    const root = container.querySelector('.modui-project-list');
    expect(root).toBeInTheDocument();
    expect(root).toHaveClass('modui-project-list--studio-light');
    expect(screen.getByText('SELECTED WORK')).toBeInTheDocument();
    expect(screen.getByText(/5 CASE STUDIES/i)).toBeInTheDocument();
  });

  it('renders all default project rows with titles and years', () => {
    render(<MagneticProjectList soundEnabled={false} />);
    expect(screen.getByText('Aether Sound Core')).toBeInTheDocument();
    expect(screen.getByText('Chronos Spatial Watch')).toBeInTheDocument();
    expect(screen.getByText('Neo Helsinki Biennale')).toBeInTheDocument();
    expect(screen.getByText('Kroma Optical Caustics')).toBeInTheDocument();
    expect(screen.getByText('Verlet Structural Cloth')).toBeInTheDocument();

    const rows = screen.getAllByRole('listitem');
    expect(rows.length).toBe(DEFAULT_PROJECTS.length);
  });

  it('triggers onProjectHover on row mouse enter and reveals floating card', () => {
    const handleHover = vi.fn();
    const { container } = render(
      <MagneticProjectList onProjectHover={handleHover} soundEnabled={false} />
    );

    const rows = screen.getAllByRole('listitem');
    fireEvent.mouseEnter(rows[0]);

    expect(handleHover).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'proj-1', title: 'Aether Sound Core' })
    );

    const floatingCard = container.querySelector('.modui-floating-card');
    expect(floatingCard).toBeInTheDocument();
    expect(floatingCard).toHaveClass('is-visible');
  });

  it('hides floating card and resets active project on container mouse leave', () => {
    const handleHover = vi.fn();
    const { container } = render(
      <MagneticProjectList onProjectHover={handleHover} soundEnabled={false} />
    );

    const rows = screen.getAllByRole('listitem');
    fireEvent.mouseEnter(rows[1]);

    const root = container.querySelector('.modui-project-list');
    if (root) fireEvent.mouseLeave(root);

    expect(handleHover).toHaveBeenLastCalledWith(null);
  });

  it('fires onProjectClick when a row is clicked', () => {
    const handleClick = vi.fn();
    render(<MagneticProjectList onProjectClick={handleClick} soundEnabled={false} />);

    const rows = screen.getAllByRole('listitem');
    fireEvent.click(rows[0]);

    expect(handleClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'proj-1', title: 'Aether Sound Core' })
    );
  });

  it('navigates via keyboard Enter and Arrow keys', () => {
    const handleClick = vi.fn();
    const handleHover = vi.fn();
    render(
      <MagneticProjectList
        onProjectClick={handleClick}
        onProjectHover={handleHover}
        soundEnabled={false}
      />
    );

    const rows = screen.getAllByRole('listitem');

    // Press Enter to click
    fireEvent.keyDown(rows[0], { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'proj-1' })
    );

    // Press ArrowDown to navigate to second row
    fireEvent.keyDown(rows[0], { key: 'ArrowDown' });
    expect(handleHover).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'proj-2' })
    );
  });

  it('supports custom projects and dark-slate variant', () => {
    const customProjects: ProjectItem[] = [
      {
        id: 'c-1',
        index: '01',
        title: 'Custom Test Project',
        client: 'Test Client',
        category: 'Testing',
        year: '2026',
        description: 'Test description for verification',
      },
    ];

    const { container } = render(
      <MagneticProjectList projects={customProjects} variant="dark-slate" soundEnabled={false} />
    );

    const root = container.querySelector('.modui-project-list');
    expect(root).toHaveClass('modui-project-list--dark-slate');
    expect(screen.getByText('Custom Test Project')).toBeInTheDocument();
    expect(screen.getByText('Test Client')).toBeInTheDocument();
  });

  it('renders compact mode with pinned preview card for explorer catalog cards', () => {
    const { container } = render(<MagneticProjectList compact soundEnabled={false} />);
    const root = container.querySelector('.modui-project-list');
    expect(root).toHaveClass('modui-project-list--compact');
    expect(screen.queryByText('SELECTED WORK')).not.toBeInTheDocument();

    const compactPreviewCard = container.querySelector('.modui-compact-preview-card');
    expect(compactPreviewCard).toBeInTheDocument();
  });
});
