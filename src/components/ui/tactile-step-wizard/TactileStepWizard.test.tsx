import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { TactileStepWizard } from './TactileStepWizard';
import type { WizardStep } from './TactileStepWizard';

const mockSteps: WizardStep[] = [
  {
    id: 'account',
    title: 'Account Profile',
    description: 'Set your primary credentials',
    content: <div data-testid="content-0">Profile Form Content</div>,
  },
  {
    id: 'workspace',
    title: 'Workspace',
    description: 'Choose organization and domain',
    content: <div data-testid="content-1">Workspace Settings Content</div>,
  },
  {
    id: 'review',
    title: 'Review & Launch',
    description: 'Confirm deployment specs',
    content: <div data-testid="content-2">Final Review Specs</div>,
  },
];

describe('TactileStepWizard component (Primitive #32)', () => {
  it('renders with role="region" and accessible label', () => {
    render(<TactileStepWizard steps={mockSteps} soundEnabled={false} />);
    const region = screen.getByRole('region', { name: /interactive step wizard/i });
    expect(region).toBeInTheDocument();
  });

  it('renders all step nodes and displays initial step content', () => {
    render(<TactileStepWizard steps={mockSteps} soundEnabled={false} />);
    expect(screen.getByText('Account Profile')).toBeInTheDocument();
    expect(screen.getByText('Workspace')).toBeInTheDocument();
    expect(screen.getByText('Review & Launch')).toBeInTheDocument();

    expect(screen.getByTestId('content-0')).toBeInTheDocument();
    expect(screen.queryByTestId('content-1')).not.toBeInTheDocument();
  });

  it('advances to next step when Next button is clicked', () => {
    const handleStepChange = vi.fn();
    render(
      <TactileStepWizard
        steps={mockSteps}
        soundEnabled={false}
        onStepChange={handleStepChange}
      />
    );

    const nextBtn = screen.getByRole('button', { name: /next step/i });
    fireEvent.click(nextBtn);

    expect(screen.getByTestId('content-1')).toBeInTheDocument();
    expect(handleStepChange).toHaveBeenCalledWith(1, 0, mockSteps[1]);
  });

  it('navigates back to previous step when Previous button is clicked', () => {
    render(<TactileStepWizard steps={mockSteps} defaultStep={1} soundEnabled={false} />);
    expect(screen.getByTestId('content-1')).toBeInTheDocument();

    const prevBtn = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevBtn);

    expect(screen.getByTestId('content-0')).toBeInTheDocument();
  });

  it('disables previous button on the first step', () => {
    render(<TactileStepWizard steps={mockSteps} defaultStep={0} soundEnabled={false} />);
    const prevBtn = screen.getByRole('button', { name: /previous/i });
    expect(prevBtn).toBeDisabled();
  });

  it('calls onComplete when clicking complete on the final step', () => {
    const handleComplete = vi.fn();
    render(
      <TactileStepWizard
        steps={mockSteps}
        defaultStep={2}
        soundEnabled={false}
        onComplete={handleComplete}
      />
    );

    const completeBtn = screen.getByRole('button', { name: /complete setup/i });
    fireEvent.click(completeBtn);

    expect(handleComplete).toHaveBeenCalledTimes(1);
  });

  it('prevents advance when validation returns false', async () => {
    const stepsWithValidation: WizardStep[] = [
      {
        id: 'step-with-val',
        title: 'Validation Step',
        validate: () => false,
        content: <div data-testid="val-content-0">Validation Form</div>,
      },
      {
        id: 'step-2',
        title: 'Next Step',
        content: <div data-testid="val-content-1">Success Form</div>,
      },
    ];

    render(<TactileStepWizard steps={stepsWithValidation} soundEnabled={false} />);

    const nextBtn = screen.getByRole('button', { name: /next step/i });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      // Should stay on step 0 because validation failed
      expect(screen.getByTestId('val-content-0')).toBeInTheDocument();
      expect(screen.queryByTestId('val-content-1')).not.toBeInTheDocument();
    });
  });

  it('advances step on keyboard Enter press', () => {
    render(<TactileStepWizard steps={mockSteps} soundEnabled={false} />);
    const region = screen.getByRole('region', { name: /interactive step wizard/i });

    fireEvent.keyDown(region, { key: 'Enter', code: 'Enter' });
    expect(screen.getByTestId('content-1')).toBeInTheDocument();
  });

  it('applies variant and orientation classes correctly', () => {
    const { container } = render(
      <TactileStepWizard
        steps={mockSteps}
        variant="editorial"
        orientation="vertical"
        compact={true}
        soundEnabled={false}
      />
    );

    const root = container.querySelector('.modui-wizard-root');
    expect(root).toHaveClass('modui-wizard--editorial');
    expect(root).toHaveClass('modui-wizard--vertical');
    expect(root).toHaveClass('modui-wizard--compact');
  });
});
