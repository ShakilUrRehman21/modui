import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React, { createRef } from 'react';
import {
  TactileColorPalettePicker,
  type TactileColorPalettePickerHandle,
} from './TactileColorPalettePicker';

// Mock canvas getContext
beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    createImageData: vi.fn().mockReturnValue({
      data: new Uint8ClampedArray(220 * 220 * 4),
    }),
    putImageData: vi.fn(),
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
});

describe('TactileColorPalettePicker component (Primitive #39)', () => {
  it('renders with role="region" and accessible name', () => {
    render(<TactileColorPalettePicker />);
    const region = screen.getByRole('region', {
      name: /Tactile Color Palette Picker/i,
    });
    expect(region).toBeInTheDocument();
  });

  it('renders harmony tab list with standard color harmonies', () => {
    render(<TactileColorPalettePicker />);
    const tabList = screen.getByRole('tablist', { name: /Color Harmonies/i });
    expect(tabList).toBeInTheDocument();

    expect(screen.getByRole('tab', { name: /Triadic/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Complement/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Analogous/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Split/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Tetradic/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Mono/i })).toBeInTheDocument();
  });

  it('renders palette swatches for default triadic harmony (3 swatches)', () => {
    render(<TactileColorPalettePicker harmony="triadic" />);
    const swatches = screen.getByRole('list', { name: /Palette Swatches/i });
    expect(swatches).toBeInTheDocument();
    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
    expect(screen.getByText('Accent')).toBeInTheDocument();
  });

  it('switches harmony when a tab is clicked', () => {
    render(<TactileColorPalettePicker harmony="triadic" />);
    const compTab = screen.getByRole('tab', { name: /Complement/i });
    fireEvent.click(compTab);

    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getAllByText('Complement').length).toBeGreaterThanOrEqual(2);
  });

  it('renders WCAG AA contrast badge', () => {
    render(<TactileColorPalettePicker />);
    expect(screen.getByText(/WCAG AA/i)).toBeInTheDocument();
  });

  it('copies tokens when copy button is clicked', () => {
    const handleCopy = vi.fn();
    render(<TactileColorPalettePicker onCopyToken={handleCopy} />);

    const copyBtn = screen.getByRole('button', { name: /Copy Tokens/i });
    fireEvent.click(copyBtn);

    expect(handleCopy).toHaveBeenCalled();
  });

  it('exposes imperative handle methods', () => {
    const ref = createRef<TactileColorPalettePickerHandle>();
    render(<TactileColorPalettePicker ref={ref} initialHue={200} />);

    expect(ref.current).not.toBeNull();
    const primary = ref.current?.getPrimaryColor();
    expect(primary).toBeDefined();
    expect(primary?.hue).toBe(200);

    act(() => {
      ref.current?.setHue(120);
    });
    expect(ref.current?.getPrimaryColor().hue).toBe(120);

    act(() => {
      ref.current?.setHarmony('complementary');
    });
    const palette = ref.current?.getPalette();
    expect(palette?.length).toBe(2); // Primary + Complement
  });

  it('renders in compact mode with scaled wheel and swatches', () => {
    const { container } = render(<TactileColorPalettePicker compact={true} />);
    expect(container.querySelector('.modui-cpp-compact')).toBeInTheDocument();
    expect(container.querySelector('.modui-cpp-swatches')).toBeInTheDocument();
    expect(container.querySelectorAll('.modui-cpp-satellite').length).toBeGreaterThan(0);
  });
});
