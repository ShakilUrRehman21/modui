import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuantumOrbitBeacon } from './QuantumOrbitBeacon';

describe('QuantumOrbitBeacon component (Primitive #29)', () => {
  beforeEach(() => {
    // Mock HTMLCanvasElement.getContext
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      ellipse: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      createRadialGradient: vi.fn().mockReturnValue({
        addColorStop: vi.fn(),
      }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      globalAlpha: 1,
      lineCap: 'butt',
      shadowColor: '',
      shadowBlur: 0,
    } as unknown as CanvasRenderingContext2D);

    // Mock requestAnimationFrame & cancelAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      return setTimeout(cb, 16) as unknown as number;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      clearTimeout(id);
    });
  });

  it('renders with role="status" and default optimal state', () => {
    render(<QuantumOrbitBeacon soundEnabled={false} />);
    const beacon = screen.getByRole('status');
    expect(beacon).toBeDefined();
    expect(beacon.className).toContain('modui-quantum-beacon');
    expect(beacon.className).toContain('modui-quantum-beacon--optimal');
    expect(beacon.className).toContain('modui-quantum-beacon--lg');
    expect(screen.getByText('Systems Optimal')).toBeDefined();
    expect(screen.getByText(/99.99% • 14ms/i)).toBeDefined();
  });

  it('renders all state switcher buttons in standard large mode', () => {
    render(<QuantumOrbitBeacon soundEnabled={false} />);
    expect(screen.getByRole('button', { name: 'Optimal' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Active' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Degraded' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Dormant' })).toBeDefined();
  });

  it('switches state when preset buttons are clicked and triggers onStateChange', () => {
    const handleStateChange = vi.fn();
    render(<QuantumOrbitBeacon soundEnabled={false} onStateChange={handleStateChange} />);

    const activeBtn = screen.getByRole('button', { name: 'Active' });
    fireEvent.click(activeBtn);

    expect(handleStateChange).toHaveBeenCalledWith('active');
    expect(screen.getByText('High Throughput')).toBeDefined();
    expect(screen.getByText(/12.4k rps/i)).toBeDefined();

    const degradedBtn = screen.getByRole('button', { name: 'Degraded' });
    fireEvent.click(degradedBtn);
    expect(handleStateChange).toHaveBeenCalledWith('degraded');
    expect(screen.getByText('Latency Degraded')).toBeDefined();

    const dormantBtn = screen.getByRole('button', { name: 'Dormant' });
    fireEvent.click(dormantBtn);
    expect(handleStateChange).toHaveBeenCalledWith('offline');
    expect(screen.getByText('Dormant Standby')).toBeDefined();
  });

  it('supports controlled state prop', () => {
    const { rerender } = render(<QuantumOrbitBeacon state="active" soundEnabled={false} />);
    expect(screen.getByText('High Throughput')).toBeDefined();

    rerender(<QuantumOrbitBeacon state="offline" soundEnabled={false} />);
    expect(screen.getByText('Dormant Standby')).toBeDefined();
  });

  it('supports custom label and subLabel overrides', () => {
    render(
      <QuantumOrbitBeacon
        label="Production Kubernetes"
        subLabel="Cluster Healthy • 8ms"
        soundEnabled={false}
      />
    );
    expect(screen.getByText('Production Kubernetes')).toBeDefined();
    expect(screen.getByText('Cluster Healthy • 8ms')).toBeDefined();
  });

  it('applies size classes correctly (sm, md, lg)', () => {
    const { rerender } = render(<QuantumOrbitBeacon size="sm" soundEnabled={false} />);
    expect(screen.getByRole('status').className).toContain('modui-quantum-beacon--sm');

    rerender(<QuantumOrbitBeacon size="md" soundEnabled={false} />);
    expect(screen.getByRole('status').className).toContain('modui-quantum-beacon--md');

    rerender(<QuantumOrbitBeacon size="lg" soundEnabled={false} />);
    expect(screen.getByRole('status').className).toContain('modui-quantum-beacon--lg');
  });

  it('adapts to light and dark theme props', () => {
    const { rerender } = render(<QuantumOrbitBeacon theme="light" soundEnabled={false} />);
    expect(screen.getByRole('status').className).toContain('modui-quantum-beacon--theme-light');

    rerender(<QuantumOrbitBeacon theme="dark" soundEnabled={false} />);
    expect(screen.getByRole('status').className).toContain('modui-quantum-beacon--theme-dark');
  });

  it('supports compact mode by hiding preset buttons', () => {
    render(<QuantumOrbitBeacon compact soundEnabled={false} />);
    const beacon = screen.getByRole('status');
    expect(beacon.className).toContain('modui-quantum-beacon--compact');
    expect(screen.queryByRole('button', { name: 'Optimal' })).toBeNull();
  });

  it('handles mouse pointer movements without errors', () => {
    render(<QuantumOrbitBeacon interactive soundEnabled={false} />);
    const beacon = screen.getByRole('status');

    fireEvent.pointerMove(beacon, { clientX: 100, clientY: 100 });
    fireEvent.pointerLeave(beacon);
  });
});
