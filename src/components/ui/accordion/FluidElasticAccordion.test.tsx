import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FluidElasticAccordion, type FluidAccordionItem } from './FluidElasticAccordion';

const mockItems: FluidAccordionItem[] = [
  {
    id: 'spatial',
    title: 'Spatial Canvas',
    subtitle: '3D Raymarching',
    description: 'Hardware accelerated WebGL pipeline with volumetric shaders.',
    tag: 'Core',
    number: '01',
  },
  {
    id: 'rotary',
    title: 'Haptic Rotary',
    subtitle: 'Rotational Physics',
    description: 'Precision dial with angular notch snapping and inertia damping.',
    tag: 'Audio',
    number: '02',
  },
  {
    id: 'elastic',
    title: 'Elastic Spring',
    subtitle: 'Dynamic Physics',
    description: 'Liquid edge boundary deformation under spring velocity.',
    tag: 'Motion',
    number: '03',
  },
];

describe('FluidElasticAccordion component', () => {
  beforeEach(() => {
    // Mock Web Audio Context
    class MockAudioContext {
      currentTime = 0;
      destination = {};
      createOscillator() {
        return {
          type: 'sine',
          frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
          connect: vi.fn(),
          start: vi.fn(),
          stop: vi.fn(),
        };
      }
      createGain() {
        return {
          gain: {
            setValueAtTime: vi.fn(),
            linearRampToValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
          },
          connect: vi.fn(),
        };
      }
      close() {
        return Promise.resolve();
      }
    }
    window.AudioContext = MockAudioContext as unknown as typeof AudioContext;
  });

  it('renders all accordion panels and tablist container', () => {
    render(<FluidElasticAccordion items={mockItems} defaultActiveId="spatial" />);

    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);

    // Initial active panel
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('switches active panel when a collapsed tab is clicked', () => {
    const handleActiveChange = vi.fn();
    render(
      <FluidElasticAccordion
        items={mockItems}
        defaultActiveId="spatial"
        onActiveChange={handleActiveChange}
      />
    );

    const tabs = screen.getAllByRole('tab');
    fireEvent.click(tabs[1]);

    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
    expect(handleActiveChange).toHaveBeenCalledWith('rotary', mockItems[1]);
  });

  it('supports keyboard navigation using arrow keys', () => {
    const handleActiveChange = vi.fn();
    render(
      <FluidElasticAccordion
        items={mockItems}
        defaultActiveId="spatial"
        orientation="horizontal"
        onActiveChange={handleActiveChange}
      />
    );

    const tabs = screen.getAllByRole('tab');
    // Press ArrowRight to move to panel 2
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(handleActiveChange).toHaveBeenCalledWith('rotary', mockItems[1]);

    // Press ArrowLeft to move back to panel 1
    fireEvent.keyDown(tabs[1], { key: 'ArrowLeft' });
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('supports hover trigger mode when enabled', () => {
    const handleActiveChange = vi.fn();
    render(
      <FluidElasticAccordion
        items={mockItems}
        defaultActiveId="spatial"
        trigger="hover"
        onActiveChange={handleActiveChange}
      />
    );

    const tabs = screen.getAllByRole('tab');
    fireEvent.mouseEnter(tabs[2]);

    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    expect(handleActiveChange).toHaveBeenCalledWith('elastic', mockItems[2]);
  });

  it('renders custom action buttons and triggers click handler', () => {
    const handleAction = vi.fn();
    const itemsWithAction: FluidAccordionItem[] = [
      {
        ...mockItems[0],
        actionText: 'Launch Studio',
        onActionClick: handleAction,
      },
    ];

    render(<FluidElasticAccordion items={itemsWithAction} defaultActiveId="spatial" />);

    const actionBtn = screen.getByRole('button', { name: /Launch Studio/i });
    expect(actionBtn).toBeInTheDocument();

    fireEvent.click(actionBtn);
    expect(handleAction).toHaveBeenCalledWith(itemsWithAction[0]);
  });
});
