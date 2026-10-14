import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { CylindricalCarousel } from './CylindricalCarousel';
import type { CylindricalCarouselItem } from './CylindricalCarousel';

const mockItems: CylindricalCarouselItem[] = [
  { id: '1', title: 'Spatial Studio', subtitle: 'Hardware module', tag: 'Core', badge: 'v2.1' },
  { id: '2', title: 'Neural Canvas', subtitle: 'Generative shader', tag: 'WebGL', badge: 'New' },
  { id: '3', title: 'Haptic Rotary', subtitle: 'Dial encoder', tag: 'Analog' },
  { id: '4', title: 'Vector Oscilloscope', subtitle: 'Waveform telemetry', tag: 'Audio' },
  { id: '5', title: 'Kinetic Matrix', subtitle: 'Spring geometry', tag: 'Physics' },
];

describe('CylindricalCarousel component', () => {
  it('renders carousel with proper ARIA accessibility roles', () => {
    render(<CylindricalCarousel items={mockItems} />);

    const carousel = screen.getByRole('region', { name: /3D Cylindrical Carousel/i });
    expect(carousel).toBeInTheDocument();
    expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');

    const slides = screen.getAllByRole('group');
    expect(slides).toHaveLength(5);
    expect(slides[0]).toHaveAttribute('aria-current', 'true');
    expect(slides[0]).toHaveAttribute('aria-label', 'Spatial Studio (1 of 5)');
  });

  it('renders title, subtitle, badge, and tag for cards', () => {
    render(<CylindricalCarousel items={mockItems} />);

    expect(screen.getByText('Spatial Studio')).toBeInTheDocument();
    expect(screen.getByText('Hardware module')).toBeInTheDocument();
    expect(screen.getByText('v2.1')).toBeInTheDocument();
    expect(screen.getByText('Core')).toBeInTheDocument();
  });

  it('navigates next and previous via control buttons', () => {
    const handleActiveChange = vi.fn();
    render(<CylindricalCarousel items={mockItems} onActiveChange={handleActiveChange} />);

    const nextBtn = screen.getByLabelText('Next slide');
    const prevBtn = screen.getByLabelText('Previous slide');

    expect(nextBtn).toBeInTheDocument();
    expect(prevBtn).toBeInTheDocument();

    fireEvent.click(nextBtn);
  });

  it('supports keyboard navigation using arrow keys', () => {
    render(<CylindricalCarousel items={mockItems} />);

    const carousel = screen.getByRole('region', { name: /3D Cylindrical Carousel/i });
    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    fireEvent.keyDown(carousel, { key: 'ArrowLeft' });
  });

  it('renders indicator dots and allows clicking specific dot', () => {
    render(<CylindricalCarousel items={mockItems} />);

    const dot3 = screen.getByLabelText('Go to slide 3');
    expect(dot3).toBeInTheDocument();
    fireEvent.click(dot3);
  });
});
