import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React, { createRef } from 'react';
import { InteractiveSignaturePad } from './InteractiveSignaturePad';
import type { InteractiveSignaturePadHandle } from './InteractiveSignaturePad';

describe('InteractiveSignaturePad component (Primitive #36)', () => {
  beforeEach(() => {
    // Mock HTMLCanvasElement.prototype methods for jsdom
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      scale: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      clearRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      getImageData: vi.fn().mockReturnValue({
        data: new Uint8ClampedArray([0, 0, 0, 255, 0, 0, 0, 255]),
        width: 2,
        height: 1,
      }),
    });

    HTMLCanvasElement.prototype.toDataURL = vi
      .fn()
      .mockReturnValue('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');

    HTMLCanvasElement.prototype.toBlob = vi.fn((cb) => {
      cb(new Blob(['mock-png'], { type: 'image/png' }));
    });

    // Mock pointer capture
    HTMLCanvasElement.prototype.setPointerCapture = vi.fn();
    HTMLCanvasElement.prototype.releasePointerCapture = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with default executive-dark finish, title, and canvas', () => {
    const { container } = render(<InteractiveSignaturePad title="Executive Signature" />);
    expect(screen.getByText('Executive Signature')).toBeInTheDocument();
    expect(screen.getByLabelText('Draw your vector signature here')).toBeInTheDocument();
    const root = container.querySelector('.modui-signature-root');
    expect(root).toHaveClass('modui-signature-variant-executive-dark');
    expect(root).toHaveClass('modui-signature-size-md');
  });

  it('renders ink color swatches and allows changing active color', () => {
    render(<InteractiveSignaturePad colors={['#3b82f6', '#10b981', '#f59e0b']} />);
    const swatches = screen.getAllByRole('button', { name: /Select ink color/i });
    expect(swatches.length).toBe(3);

    fireEvent.click(swatches[1]);
    expect(swatches[1]).toHaveClass('active');
  });

  it('renders legal baseline guide and X-mark', () => {
    render(<InteractiveSignaturePad showBaseline={true} />);
    expect(screen.getByText(/✕ Sign on the line above/i)).toBeInTheDocument();
  });

  it('disables Undo, Clear, and Export PNG buttons when canvas is empty', () => {
    render(<InteractiveSignaturePad />);
    expect(screen.getByRole('button', { name: 'Undo last stroke' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Clear canvas' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Export PNG' })).toBeDisabled();
  });

  it('simulates drawing pointer events and records strokes', () => {
    const onDrawStart = vi.fn();
    const onDrawEnd = vi.fn();

    render(
      <InteractiveSignaturePad
        onDrawStart={onDrawStart}
        onDrawEnd={onDrawEnd}
      />
    );

    const canvas = screen.getByLabelText('Draw your vector signature here');

    fireEvent.pointerDown(canvas, { clientX: 50, clientY: 50, pointerId: 1 });
    expect(onDrawStart).toHaveBeenCalled();

    fireEvent.pointerMove(canvas, { clientX: 75, clientY: 80, pointerId: 1 });
    fireEvent.pointerUp(canvas, { clientX: 100, clientY: 100, pointerId: 1 });

    expect(onDrawEnd).toHaveBeenCalledWith(1);
    expect(screen.getByText('1 stroke recorded')).toBeInTheDocument();
  });

  it('clears canvas and resets stroke count when Clear button is clicked', () => {
    const onClear = vi.fn();
    render(<InteractiveSignaturePad onClear={onClear} />);

    const canvas = screen.getByLabelText('Draw your vector signature here');
    fireEvent.pointerDown(canvas, { clientX: 40, clientY: 40, pointerId: 1 });
    fireEvent.pointerUp(canvas, { clientX: 80, clientY: 80, pointerId: 1 });

    const clearBtn = screen.getByRole('button', { name: 'Clear canvas' });
    expect(clearBtn).not.toBeDisabled();

    fireEvent.click(clearBtn);
    expect(onClear).toHaveBeenCalled();
    expect(screen.getByText('Ready to sign')).toBeInTheDocument();
  });

  it('literally exports PNG, triggers download link click, and fires onExport callback', async () => {
    const onExport = vi.fn();
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<InteractiveSignaturePad onExport={onExport} />);

    const canvas = screen.getByLabelText('Draw your vector signature here');
    fireEvent.pointerDown(canvas, { clientX: 30, clientY: 30, pointerId: 1 });
    fireEvent.pointerUp(canvas, { clientX: 90, clientY: 90, pointerId: 1 });

    const exportBtn = screen.getByRole('button', { name: 'Export PNG' });
    expect(exportBtn).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(exportBtn);
    });

    expect(clickSpy).toHaveBeenCalled();
    expect(onExport).toHaveBeenCalledWith(
      expect.stringContaining('data:image/png'),
      expect.any(Blob)
    );
  });

  it('exposes imperative ref handle with exportPNG, clear, undo, redo, and isEmpty', async () => {
    const ref = createRef<InteractiveSignaturePadHandle>();
    render(<InteractiveSignaturePad ref={ref} />);

    expect(ref.current).toBeDefined();
    expect(ref.current?.isEmpty()).toBe(true);

    const canvas = screen.getByLabelText('Draw your vector signature here');
    fireEvent.pointerDown(canvas, { clientX: 20, clientY: 20, pointerId: 1 });
    fireEvent.pointerUp(canvas, { clientX: 60, clientY: 60, pointerId: 1 });

    expect(ref.current?.isEmpty()).toBe(false);
    expect(ref.current?.getStrokes().length).toBe(1);

    act(() => {
      ref.current?.undo();
    });
    expect(ref.current?.getStrokes().length).toBe(0);

    act(() => {
      ref.current?.redo();
    });
    expect(ref.current?.getStrokes().length).toBe(1);

    act(() => {
      ref.current?.clear();
    });
    expect(ref.current?.isEmpty()).toBe(true);
  });
});
