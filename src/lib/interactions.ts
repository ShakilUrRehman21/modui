/**
 * ModUI interaction kit
 * ---------------------------------------------------------------------------
 * One delegated listener set for the whole app (no per-component wiring):
 *  - Reveal:    `.modui-reveal` / `.modui-stagger` animate in once when visible
 *  - Spotlight: `.modui-spotlight` gets a cursor-tracked rim light
 *  - Magnetic:  `[data-magnetic]` elements lean toward the pointer
 * All effects respect `prefers-reduced-motion` and skip coarse (touch) pointers.
 */

const REVEAL_SELECTOR = '.modui-reveal, .modui-stagger';

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function hasFinePointer() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function indexStaggerChildren(el: Element) {
  if (!el.classList.contains('modui-stagger')) return;
  Array.from(el.children).forEach((child, i) => {
    (child as HTMLElement).style.setProperty('--i', String(i));
  });
}

export function initReveal(): () => void {
  if (typeof window === 'undefined') return () => {};

  if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
    const revealAll = () =>
      document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => el.classList.add('modui-in-view'));
    revealAll();
    const mo = new MutationObserver(revealAll);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('modui-in-view');
          io.unobserve(entry.target);
        }
      });
    },
    // threshold 0: tall elements (a 30-card grid on a phone) must still trigger
    { rootMargin: '0px 0px -6% 0px', threshold: 0 },
  );

  const seen = new WeakSet<Element>();
  const scan = () => {
    document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);
      indexStaggerChildren(el);
      if (!el.classList.contains('modui-in-view')) io.observe(el);
    });
  };

  scan();
  let queued = false;
  const mo = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      scan();
    });
  });
  mo.observe(document.body, { childList: true, subtree: true });

  return () => {
    io.disconnect();
    mo.disconnect();
  };
}

function ensureSpotlightLayers(el: HTMLElement) {
  if (el.dataset.spotlightReady) return;
  el.dataset.spotlightReady = '1';
  const fill = document.createElement('span');
  fill.className = 'modui-spotlight-fill';
  fill.setAttribute('aria-hidden', 'true');
  const rim = document.createElement('span');
  rim.className = 'modui-spotlight-rim';
  rim.setAttribute('aria-hidden', 'true');
  el.prepend(fill);
  el.append(rim);
}

export function initPointerEffects(): () => void {
  if (typeof window === 'undefined' || !hasFinePointer() || prefersReducedMotion()) {
    return () => {};
  }

  let magnetEl: HTMLElement | null = null;
  let frame = 0;
  let lastEvent: PointerEvent | null = null;

  const releaseMagnet = () => {
    if (magnetEl) {
      magnetEl.style.translate = '';
      magnetEl = null;
    }
  };

  const apply = () => {
    frame = 0;
    const e = lastEvent;
    if (!e) return;
    const target = e.target as Element | null;
    if (!target || !(target instanceof Element)) return;

    // Spotlight
    const spot = target.closest<HTMLElement>('.modui-spotlight');
    if (spot) {
      ensureSpotlightLayers(spot);
      const r = spot.getBoundingClientRect();
      spot.style.setProperty('--mx', `${e.clientX - r.left}px`);
      spot.style.setProperty('--my', `${e.clientY - r.top}px`);
    }

    // Magnetic
    const mag = target.closest<HTMLElement>('[data-magnetic]');
    if (mag !== magnetEl) releaseMagnet();
    if (mag) {
      magnetEl = mag;
      const r = mag.getBoundingClientRect();
      const strength = parseFloat(mag.dataset.magnetic || '') || 0.28;
      const dx = (e.clientX - (r.left + r.width / 2)) * strength;
      const dy = (e.clientY - (r.top + r.height / 2)) * strength;
      const clamp = (v: number) => Math.max(-10, Math.min(10, v));
      mag.style.translate = `${clamp(dx).toFixed(2)}px ${clamp(dy).toFixed(2)}px`;
    }
  };

  const onMove = (e: PointerEvent) => {
    lastEvent = e;
    if (!frame) frame = requestAnimationFrame(apply);
  };

  const onLeaveWindow = () => releaseMagnet();

  document.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', onLeaveWindow);
  window.addEventListener('blur', onLeaveWindow);

  return () => {
    cancelAnimationFrame(frame);
    releaseMagnet();
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerleave', onLeaveWindow);
    window.removeEventListener('blur', onLeaveWindow);
  };
}
