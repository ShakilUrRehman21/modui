import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { NumberTicker } from './NumberTicker';

describe('NumberTicker component', () => {
  it('renders numerical value correctly with thousands separators', () => {
    render(<NumberTicker value={12500} />);
    const ticker = screen.getByRole('status');
    expect(ticker).toBeInTheDocument();
    expect(ticker).toHaveAttribute('aria-label', '12,500');
  });

  it('renders prefix and suffix properly', () => {
    render(<NumberTicker value={99.4} decimalPlaces={1} prefix="$" suffix="/mo" />);
    const ticker = screen.getByRole('status');
    expect(ticker).toHaveAttribute('aria-label', '$99.4/mo');
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('/mo')).toBeInTheDocument();
  });

  it('supports decimal precision formatting', () => {
    render(<NumberTicker value={42.857} decimalPlaces={2} suffix="%" />);
    const ticker = screen.getByRole('status');
    expect(ticker).toHaveAttribute('aria-label', '42.86%');
  });

  it('handles negative values with minus symbol', () => {
    render(<NumberTicker value={-150} prefix="$" />);
    const ticker = screen.getByRole('status');
    expect(ticker).toHaveAttribute('aria-label', '$-150');
  });

  it('updates accessible label when value prop changes', () => {
    const { rerender } = render(<NumberTicker value={100} />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', '100');

    rerender(<NumberTicker value={250} />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', '250');
  });
});
