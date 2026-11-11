/**
 * Scroll reveal is now handled app-wide by `initReveal()` in src/lib/interactions.ts
 * (elements animate in once, and newly mounted `.modui-reveal` nodes are picked up
 * automatically). This hook is kept so existing pages keep compiling.
 */
interface ScrollRevealOptions {
  threshold?: number | number[];
  rootMargin?: string;
  enableOutTop?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useScrollReveal(_options: ScrollRevealOptions = {}) {
  /* no-op: see initReveal() */
}

export default useScrollReveal;
