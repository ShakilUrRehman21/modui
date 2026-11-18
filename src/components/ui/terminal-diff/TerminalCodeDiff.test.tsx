import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { TerminalCodeDiff } from './TerminalCodeDiff';

describe('TerminalCodeDiff component (Primitive #34)', () => {
  beforeEach(() => {
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders with role="region" and accessible label', () => {
    render(<TerminalCodeDiff soundEnabled={false} />);
    const region = screen.getByRole('region', {
      name: /interactive terminal code diff inspector/i,
    });
    expect(region).toBeInTheDocument();
  });

  it('renders all default tabs in tablist', () => {
    render(<TerminalCodeDiff soundEnabled={false} />);
    expect(screen.getByRole('tab', { name: /pipeline\.ts/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /legacy-setup\.js/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /diff ±/i })).toBeInTheDocument();
  });

  it('switches tab on click and fires onTabChange', () => {
    const handleTabChange = vi.fn();
    render(
      <TerminalCodeDiff soundEnabled={false} onTabChange={handleTabChange} />
    );

    const legacyTab = screen.getByRole('tab', { name: /legacy-setup\.js/i });
    fireEvent.click(legacyTab);

    expect(handleTabChange).toHaveBeenCalledWith(
      'legacy',
      expect.objectContaining({ id: 'legacy' })
    );
    expect(screen.getByText(/Legacy complex configuration/i)).toBeInTheDocument();
  });

  it('copies code content to clipboard and shows "Copied!" status', async () => {
    const handleCopy = vi.fn();
    render(<TerminalCodeDiff soundEnabled={false} onCopy={handleCopy} />);

    const copyBtn = screen.getByRole('button', { name: /copy active code to clipboard/i });
    expect(copyBtn).toHaveTextContent('Copy');

    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      expect(handleCopy).toHaveBeenCalled();
      expect(copyBtn).toHaveTextContent('Copied!');
    });
  });

  it('renders diff lines with added and removed styles in diff tab', () => {
    render(<TerminalCodeDiff soundEnabled={false} defaultTabId="diff" />);

    const diffTab = screen.getByRole('tab', { name: /diff ±/i });
    expect(diffTab).toHaveClass('is-active');

    // Should display diff lines with + and -
    const plusSigns = screen.getAllByText('+');
    const minusSigns = screen.getAllByText('-');
    expect(plusSigns.length).toBeGreaterThan(0);
    expect(minusSigns.length).toBeGreaterThan(0);
  });

  it('applies compact styling when compact is true', () => {
    const { container } = render(
      <TerminalCodeDiff compact={true} soundEnabled={false} />
    );
    expect(container.querySelector('.modui-terminal-chassis')).toHaveClass(
      'modui-terminal--compact'
    );
  });

  it('applies variant class correctly', () => {
    const { container } = render(
      <TerminalCodeDiff variant="cyber-terminal" soundEnabled={false} />
    );
    expect(container.querySelector('.modui-terminal-chassis')).toHaveClass(
      'modui-terminal--cyber-terminal'
    );
  });
});
