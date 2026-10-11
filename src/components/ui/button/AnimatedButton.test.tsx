import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnimatedButton } from './AnimatedButton';

describe('AnimatedButton', () => {
  it('renders correctly with default props', () => {
    render(<AnimatedButton>Click me</AnimatedButton>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('modui-btn', 'modui-btn--shimmer', 'modui-btn--md');
  });

  it('renders different animation variants properly', () => {
    const { rerender } = render(<AnimatedButton variant="glow">Glow</AnimatedButton>);
    expect(screen.getByRole('button')).toHaveClass('modui-btn--glow');

    rerender(<AnimatedButton variant="magnetic">Magnetic</AnimatedButton>);
    expect(screen.getByRole('button')).toHaveClass('modui-btn--magnetic');

    rerender(<AnimatedButton variant="gradient-border">Gradient</AnimatedButton>);
    expect(screen.getByRole('button')).toHaveClass('modui-btn--gradient-border');

    rerender(<AnimatedButton variant="slide">Slide</AnimatedButton>);
    expect(screen.getByRole('button')).toHaveClass('modui-btn--slide');
  });

  it('renders different size options properly', () => {
    const { rerender } = render(<AnimatedButton size="sm">Small</AnimatedButton>);
    expect(screen.getByRole('button')).toHaveClass('modui-btn--sm');

    rerender(<AnimatedButton size="lg">Large</AnimatedButton>);
    expect(screen.getByRole('button')).toHaveClass('modui-btn--lg');
  });

  it('triggers onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<AnimatedButton onClick={handleClick}>Submit</AnimatedButton>);
    const button = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<AnimatedButton disabled onClick={handleClick}>Disabled</AnimatedButton>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('displays loading state with spinner and aria-busy', () => {
    const handleClick = vi.fn();
    render(
      <AnimatedButton loading loadingText="Processing..." onClick={handleClick}>
        Save
      </AnimatedButton>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('modui-btn--loading');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders custom leading and trailing icons', () => {
    render(
      <AnimatedButton
        icon={<span data-testid="test-icon-left">←</span>}
        iconRight={<span data-testid="test-icon-right">→</span>}
      >
        Navigate
      </AnimatedButton>
    );
    expect(screen.getByTestId('test-icon-left')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon-right')).toBeInTheDocument();
  });

  it('renders ripple effect element on click for ripple variant', () => {
    const { container } = render(<AnimatedButton variant="ripple">Ripple Action</AnimatedButton>);
    const button = screen.getByRole('button', { name: /ripple action/i });
    fireEvent.click(button);
    const rippleEl = container.querySelector('.modui-btn-ripple-effect');
    expect(rippleEl).toBeInTheDocument();
  });

  it('renders slide indicator arrow by default for slide variant', () => {
    const { container } = render(<AnimatedButton variant="slide">Slide Action</AnimatedButton>);
    const slideArrow = container.querySelector('.modui-btn-slide-arrow');
    expect(slideArrow).toBeInTheDocument();
  });
});
