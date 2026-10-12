import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as vercelAnalytics from '@vercel/analytics';
import {
  trackEvent,
  trackCopyCode,
  trackPreviewOpen,
  trackGithubClick,
  trackComponentInstall,
  trackPurchase,
} from './analytics';

vi.mock('@vercel/analytics', () => ({
  track: vi.fn(),
}));

describe('Analytics service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete window.gtag;
  });

  it('calls @vercel/analytics track function with event name and properties', () => {
    trackEvent('test_event', { foo: 'bar' });
    expect(vercelAnalytics.track).toHaveBeenCalledWith('test_event', { foo: 'bar' });
  });

  it('forwards events to window.gtag if GA4 is loaded on the page', () => {
    const mockGtag = vi.fn();
    window.gtag = mockGtag;

    trackEvent('custom_action', { page: '/components' });
    expect(mockGtag).toHaveBeenCalledWith('event', 'custom_action', { page: '/components' });
    expect(vercelAnalytics.track).toHaveBeenCalledWith('custom_action', { page: '/components' });
  });

  it('tracks copy_code events with proper parameters', () => {
    trackCopyCode({
      component: 'animated-button',
      file: 'AnimatedButton.tsx',
      format: 'full_component',
      source: 'test_runner',
    });

    expect(vercelAnalytics.track).toHaveBeenCalledWith('copy_code', {
      component: 'animated-button',
      file: 'AnimatedButton.tsx',
      format: 'full_component',
      source: 'test_runner',
    });
  });

  it('tracks preview_open events', () => {
    trackPreviewOpen({
      component: 'kinetic-text',
      mode: 'preset',
      variant: 'physics',
    });

    expect(vercelAnalytics.track).toHaveBeenCalledWith('preview_open', {
      component: 'kinetic-text',
      mode: 'preset',
      variant: 'physics',
    });
  });

  it('tracks github_click events', () => {
    trackGithubClick({ location: 'navbar' });
    expect(vercelAnalytics.track).toHaveBeenCalledWith('github_click', { location: 'navbar' });
  });

  it('tracks component_install events', () => {
    trackComponentInstall({
      component: 'react-peer-dependencies',
      package_manager: 'npm',
      method: 'cli',
    });

    expect(vercelAnalytics.track).toHaveBeenCalledWith('component_install', {
      component: 'react-peer-dependencies',
      package_manager: 'npm',
      method: 'cli',
    });
  });

  it('tracks purchase events for prospective commerce or sponsorships', () => {
    trackPurchase({
      plan: 'pro-team',
      itemId: 'modui-pro',
      price: 49,
      currency: 'USD',
    });

    expect(vercelAnalytics.track).toHaveBeenCalledWith('purchase', {
      plan: 'pro-team',
      itemId: 'modui-pro',
      price: 49,
      currency: 'USD',
    });
  });
});
