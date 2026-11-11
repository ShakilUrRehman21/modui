import React, { useEffect, useRef, useState } from 'react';

interface ProximityHeadlineProps {
  /** Static first line(s) of the headline */
  lead: string;
  /** Prefix of the rotating line, e.g. "in" */
  rotatingPrefix: string;
  /** Phrases that cycle on the second line */
  phrases: string[];
  /** Element whose pointer movement drives the effect (defaults to the headline) */
  trackRef?: React.RefObject<HTMLElement | null>;
  interval?: number;
  className?: string;
}

const MIN_WEIGHT = 480;
const MAX_WEIGHT = 860;
const RADIUS = 170;

function splitChars(text: string, keyPrefix: string, startIndex = 0) {
  return Array.from(text).map((ch, i) =>
    ch === ' ' ? (
      <span key={`${keyPrefix}-${i}`} className="modui-ph-space"> </span>
    ) : (
      <span
        key={`${keyPrefix}-${i}`}
        className="modui-ph-char"
        style={{ '--ci': startIndex + i } as React.CSSProperties}
      >
        {ch}
      </span>
    ),
  );
}

/**
 * Headline whose letters gain weight as the pointer approaches them.
 * Uses Geist's variable `wght` axis — no transforms, so the text stays crisp.
 * The last line cycles through phrases with a staggered letter swap.
 */
export const ProximityHeadline: React.FC<ProximityHeadlineProps> = ({
  lead,
  rotatingPrefix,
  phrases,
  trackRef,
  interval = 3400,
  className = '',
}) => {
  const headRef = useRef<HTMLHeadingElement>(null);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);

  // Phrase rotation (paused for reduced motion and while the tab is hidden)
  useEffect(() => {
    if (phrases.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let exitTimer = 0;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setPhraseIdx((i) => {
        setPrevIdx(i);
        return (i + 1) % phrases.length;
      });
      window.clearTimeout(exitTimer);
      exitTimer = window.setTimeout(() => setPrevIdx(null), 700);
    }, interval);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(exitTimer);
    };
  }, [phrases.length, interval]);

  // Pointer proximity → font weight
  useEffect(() => {
    const head = headRef.current;
    const area = trackRef?.current ?? head;
    if (!head || !area) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let px = -9999;
    let py = -9999;
    let active = false;
    // Smoothed weights so letters ease rather than snap
    const current = new WeakMap<Element, number>();

    const tick = () => {
      frame = 0;
      const chars = head.querySelectorAll<HTMLElement>('.modui-ph-live .modui-ph-char');
      // read phase
      const rects = Array.from(chars, (c) => c.getBoundingClientRect());
      let stillMoving = false;
      // write phase
      chars.forEach((c, i) => {
        const r = rects[i];
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const d = Math.hypot(px - cx, py - cy);
        const t = active ? Math.max(0, 1 - d / RADIUS) : 0;
        const eased = t * t * (3 - 2 * t);
        const target = MIN_WEIGHT + (MAX_WEIGHT - MIN_WEIGHT) * eased;
        const prev = current.get(c) ?? MIN_WEIGHT;
        const next = prev + (target - prev) * 0.22;
        if (Math.abs(next - target) > 0.6) stillMoving = true;
        current.set(c, next);
        c.style.fontVariationSettings = `'wght' ${next.toFixed(0)}`;
      });
      if (stillMoving) frame = requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      active = true;
      schedule();
    };
    const onLeave = () => {
      active = false;
      schedule();
    };

    area.addEventListener('pointermove', onMove, { passive: true });
    area.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      area.removeEventListener('pointermove', onMove);
      area.removeEventListener('pointerleave', onLeave);
    };
  }, [trackRef]);

  const leadLength = Array.from(lead).length;
  const prefixLength = Array.from(rotatingPrefix).length + 1;

  return (
    <h1 ref={headRef} className={`modui-ph ${className}`} aria-label={`${lead} ${rotatingPrefix} ${phrases[phraseIdx]}`}>
      <span className="modui-ph-line modui-ph-live" aria-hidden="true">
        {splitChars(lead, 'lead')}
      </span>
      <span className="modui-ph-line modui-ph-rotor" aria-hidden="true">
        <span className="modui-ph-live">{splitChars(`${rotatingPrefix} `, 'pre', leadLength)}</span>
        <span className="modui-ph-slot">
          {prevIdx !== null && (
            <span className="modui-ph-phrase modui-ph-phrase--out" key={`out-${prevIdx}`}>
              {splitChars(phrases[prevIdx], `o${prevIdx}`, 0)}
            </span>
          )}
          <span className="modui-ph-phrase modui-ph-phrase--in modui-ph-live" key={`in-${phraseIdx}`}>
            {splitChars(phrases[phraseIdx], `p${phraseIdx}`, prevIdx === null ? leadLength + prefixLength : 0)}
          </span>
        </span>
      </span>
    </h1>
  );
};

export default ProximityHeadline;
