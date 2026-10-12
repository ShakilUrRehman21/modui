import { track } from '@vercel/analytics';

/**
 * Global typing for optional Google Analytics 4 (GA4) window.gtag
 */
declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
    dataLayer?: unknown[];
  }
}

export type EventProperties = Record<string, string | number | boolean | null | undefined>;

export type ModUIEvent =
  | 'copy_code'
  | 'preview_open'
  | 'github_click'
  | 'component_install'
  | 'purchase';

export interface CopyCodeParams extends EventProperties {
  component: string;
  file?: string;
  format?: 'snippet' | 'full_component' | 'terminal_command' | 'css';
  source?: string;
}

export interface PreviewOpenParams extends EventProperties {
  component: string;
  mode?: 'interactive_stage' | 'card_preview' | 'code_tab' | 'preset';
  variant?: string;
}

export interface GithubClickParams extends EventProperties {
  location: 'navbar' | 'footer' | 'component_header' | 'hero' | 'drawer';
  component?: string;
}

export interface ComponentInstallParams extends EventProperties {
  component: string;
  package_manager?: 'npm' | 'pnpm' | 'yarn' | 'bun' | 'copy_paste';
  method?: 'cli' | 'manual';
}

export interface PurchaseParams extends EventProperties {
  plan?: string;
  itemId?: string;
  price?: number;
  currency?: string;
}

/**
 * Unified dispatch for Vercel Web Analytics + optional GA4 + Dev logging
 */
export function trackEvent(name: ModUIEvent | string, properties?: EventProperties): void {
  try {
    // 1. Vercel Analytics custom event
    track(name, properties);

    // 2. Google Analytics 4 (if configured on site)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', name, properties);
    }

    // 3. Dev logger
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(`[ModUI Analytics] 📊 ${name}`, properties ?? {});
    }
  } catch (err) {
    // Analytics should never break user interactions
    if (import.meta.env.DEV) {
      console.warn('[ModUI Analytics] Failed to track event:', name, err);
    }
  }
}

/**
 * Typed helper: User copies code snippet, terminal command, or full file
 */
export function trackCopyCode(params: CopyCodeParams): void {
  trackEvent('copy_code', params);
}

/**
 * Typed helper: User views or toggles an interactive preview
 */
export function trackPreviewOpen(params: PreviewOpenParams): void {
  trackEvent('preview_open', params);
}

/**
 * Typed helper: User clicks an external link to GitHub repository
 */
export function trackGithubClick(params: GithubClickParams): void {
  trackEvent('github_click', params);
}

/**
 * Typed helper: User initiates component installation or copies install CLI
 */
export function trackComponentInstall(params: ComponentInstallParams): void {
  trackEvent('component_install', params);
}

/**
 * Typed helper: Future e-commerce / sponsorship / pro-component purchase
 */
export function trackPurchase(params: PurchaseParams): void {
  trackEvent('purchase', params);
}
