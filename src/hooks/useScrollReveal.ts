import { useEffect } from 'react';

interface ScrollRevealOptions {
  threshold?: number | number[];
  rootMargin?: string;
  enableOutTop?: boolean;
}

/**
 * Universal Hook to trigger slide-in, fade-in, and graceful fade-out on scroll
 * Supports prefers-reduced-motion for complete accessibility.
 */
export function useScrollReveal(options: ScrollRevealOptions = {}) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect user's reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll('.modui-reveal').forEach((el) => {
        el.classList.add('modui-in-view');
      });
      return;
    }

    const {
      rootMargin = '0px 0px -10% 0px',
      threshold = [0, 0.15, 0.5, 0.85],
      enableOutTop = true,
    } = options;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          el.classList.add('modui-in-view');
          el.classList.remove('modui-out-top');
        } else {
          const rect = entry.boundingClientRect;
          if (enableOutTop && rect.top < 0) {
            el.classList.add('modui-out-top');
          } else {
            el.classList.remove('modui-in-view');
            el.classList.remove('modui-out-top');
          }
        }
      });
    }, { rootMargin, threshold });

    const elements = document.querySelectorAll('.modui-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [options.rootMargin, options.threshold, options.enableOutTop]);
}

export default useScrollReveal;

