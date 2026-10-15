import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './CylindricalCarousel.css';

export interface CylindricalCarouselItem {
  id: string | number;
  title: string;
  subtitle?: string;
  tag?: string;
  badge?: string;
  image?: string;
  color?: string;
  content?: React.ReactNode;
}

export interface CylindricalCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of items to display on the 3D cylinder */
  items: CylindricalCarouselItem[];
  /** Radius of cylinder in pixels (default: 280) */
  radius?: number;
  /** Width of each card in pixels (default: 190) */
  cardWidth?: number;
  /** Height of each card in pixels (default: 260) */
  cardHeight?: number;
  /** Subtle camera pitch/tilt angle in degrees (default: -4) */
  tiltAngle?: number;
  /** CSS 3D perspective distance in pixels (default: 1000) */
  perspective?: number;
  /** Enable continuous atmospheric rotation (default: false) */
  autoplay?: boolean;
  /** Autoplay rotational speed in degrees/second (default: 8) */
  autoplaySpeed?: number;
  /** Drag inertia friction factor between 0.85 and 0.98 (default: 0.93) */
  friction?: number;
  /** Automatically snap to nearest card when momentum ends (default: true) */
  snapToNearest?: boolean;
  /** Callback fired whenever the active card in front changes */
  onActiveChange?: (index: number, item: CylindricalCarouselItem) => void;
  /** Show bottom navigation pill controls */
  showControls?: boolean;
  /** Show indicator dots at bottom */
  showIndicators?: boolean;
  /** Show top drag hint instruction badge */
  showDragHint?: boolean;
  /** Custom additional CSS class name */
  className?: string;
}

export const CylindricalCarousel: React.FC<CylindricalCarouselProps> = ({
  items,
  radius = 280,
  cardWidth = 190,
  cardHeight = 260,
  tiltAngle = -4,
  perspective = 1000,
  autoplay = false,
  autoplaySpeed = 8,
  friction = 0.93,
  snapToNearest = true,
  onActiveChange,
  showControls = true,
  showIndicators = true,
  showDragHint = true,
  className = '',
  style,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);

  // Dynamic container dimensions for mathematically bounded auto-scaling
  const [containerDim, setContainerDim] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateDim = () => {
      const rect = el.getBoundingClientRect();
      setContainerDim({ width: rect.width, height: rect.height });
    };

    updateDim();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateDim);
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      window.addEventListener('resize', updateDim);
      return () => window.removeEventListener('resize', updateDim);
    }
  }, []);

  // Compute auto-scale factor so the 3D cylinder NEVER escapes the container box and leaves clear gap for controls
  const autoScale = useMemo(() => {
    if (!containerDim.width || !containerDim.height) return 1;
    // Total diameter footprint needed in 3D projection
    const requiredWidth = radius * 2 + cardWidth;
    const verticalReserve = (showControls ? 76 : 16) + (showDragHint ? 32 : 0);
    const requiredHeight = cardHeight + 20;

    const scaleX = (containerDim.width - 24) / requiredWidth;
    const scaleY = (containerDim.height - verticalReserve) / requiredHeight;

    const fitScale = Math.min(scaleX, scaleY, 1);
    return Math.max(fitScale, 0.28);
  }, [containerDim, radius, cardWidth, cardHeight, showControls, showDragHint]);

  // Rotation state in degrees
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  rotationRef.current = rotation;

  // Active index
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  // Drag tracking refs
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const movedDistanceRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Autoplay pause on hover/drag
  const isHoveredRef = useRef(false);

  const totalItems = items.length;
  const angleStep = totalItems > 0 ? 360 / totalItems : 0;

  // Normalize angle to -180 to 180 range
  const normalizeAngle = useCallback((deg: number) => {
    return ((((deg % 360) + 540) % 360) - 180);
  }, []);

  // Calculate active index from rotation
  const computeActiveIndex = useCallback(
    (rot: number) => {
      if (totalItems === 0) return 0;
      let minDiff = Infinity;
      let closestIdx = 0;

      for (let i = 0; i < totalItems; i++) {
        const itemAngle = i * angleStep;
        const diff = Math.abs(normalizeAngle(itemAngle + rot));
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      }
      return closestIdx;
    },
    [totalItems, angleStep, normalizeAngle]
  );

  // Update active index and notify callback
  const updateActiveIndex = useCallback(
    (newIdx: number) => {
      if (newIdx !== activeIndexRef.current) {
        activeIndexRef.current = newIdx;
        setActiveIndex(newIdx);
        if (items[newIdx]) {
          onActiveChange?.(newIdx, items[newIdx]);
        }
      }
    },
    [items, onActiveChange]
  );

  // Snap to specific card index smoothly
  const snapToIndex = useCallback(
    (targetIndex: number) => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      const targetAngle = -targetIndex * angleStep;
      const current = rotationRef.current;
      const diff = normalizeAngle(targetAngle - current);
      const destination = current + diff;

      const startTime = performance.now();
      const duration = 500; // ms
      const startAngle = current;

      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const animateSnap = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const nextRotation = startAngle + (destination - startAngle) * eased;

        setRotation(nextRotation);
        rotationRef.current = nextRotation;

        if (progress < 1) {
          rafIdRef.current = requestAnimationFrame(animateSnap);
        } else {
          updateActiveIndex(targetIndex);
        }
      };

      rafIdRef.current = requestAnimationFrame(animateSnap);
    },
    [angleStep, normalizeAngle, updateActiveIndex]
  );

  // Run inertia animation after pointer release
  const runInertia = useCallback(() => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

    const stepInertia = () => {
      velocityRef.current *= friction;

      if (Math.abs(velocityRef.current) > 0.04) {
        const nextRot = rotationRef.current + velocityRef.current;
        setRotation(nextRot);
        rotationRef.current = nextRot;

        const currentActive = computeActiveIndex(nextRot);
        updateActiveIndex(currentActive);

        rafIdRef.current = requestAnimationFrame(stepInertia);
      } else {
        velocityRef.current = 0;
        if (snapToNearest) {
          const nearest = computeActiveIndex(rotationRef.current);
          snapToIndex(nearest);
        }
      }
    };

    rafIdRef.current = requestAnimationFrame(stepInertia);
  }, [friction, snapToNearest, computeActiveIndex, updateActiveIndex, snapToIndex]);

  // Pointer event handlers for silky drag
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;

    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    movedDistanceRef.current = 0;

    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const currentX = e.clientX;
    const now = performance.now();
    const deltaX = currentX - lastXRef.current;
    const deltaTime = Math.max(now - lastTimeRef.current, 1);

    movedDistanceRef.current += Math.abs(deltaX);

    const sensitivity = 0.35;
    const rotDelta = deltaX * sensitivity;
    const newRot = rotationRef.current + rotDelta;

    setRotation(newRot);
    rotationRef.current = newRot;

    velocityRef.current = (rotDelta / deltaTime) * 16.6;

    lastXRef.current = currentX;
    lastTimeRef.current = now;

    const currentActive = computeActiveIndex(newRot);
    updateActiveIndex(currentActive);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignored if capture already lost
    }

    if (Math.abs(velocityRef.current) > 0.08) {
      runInertia();
    } else if (snapToNearest) {
      const nearest = computeActiveIndex(rotationRef.current);
      snapToIndex(nearest);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIdx = (activeIndex - 1 + totalItems) % totalItems;
      snapToIndex(prevIdx);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIdx = (activeIndex + 1) % totalItems;
      snapToIndex(nextIdx);
    }
  };

  // Autoplay loop
  useEffect(() => {
    if (!autoplay) return;

    let lastTime = performance.now();
    let autoplayRaf: number;

    const animateAutoplay = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (!isDraggingRef.current && !isHoveredRef.current) {
        const step = autoplaySpeed * delta;
        const nextRot = rotationRef.current - step;
        setRotation(nextRot);
        rotationRef.current = nextRot;

        const currentActive = computeActiveIndex(nextRot);
        updateActiveIndex(currentActive);
      }

      autoplayRaf = requestAnimationFrame(animateAutoplay);
    };

    autoplayRaf = requestAnimationFrame(animateAutoplay);

    return () => cancelAnimationFrame(autoplayRaf);
  }, [autoplay, autoplaySpeed, computeActiveIndex, updateActiveIndex]);

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const halfWidth = cardWidth / 2;
  const halfHeight = cardHeight / 2;

  // Precomputed card items with center-anchor transforms & depth-of-field
  const renderedCards = useMemo(() => {
    return items.map((item, index) => {
      const itemAngle = index * angleStep;
      const angleDiff = normalizeAngle(itemAngle + rotation);

      // Depth calculations: cosine normalized to 0 (back) -> 1 (front)
      const rad = (angleDiff * Math.PI) / 180;
      const zFactor = (Math.cos(rad) + 1) / 2;

      const blurPx = (1 - zFactor) * 4;
      const opacity = 0.35 + zFactor * 0.65;
      const scale = 0.88 + zFactor * 0.12;

      const isCurrentActive = index === activeIndex;

      return {
        item,
        index,
        itemAngle,
        isCurrentActive,
        style: {
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          marginLeft: `-${halfWidth}px`,
          marginTop: `-${halfHeight}px`,
          transform: `rotateY(${itemAngle}deg) translateZ(${radius}px) scale(${scale})`,
          filter: `blur(${blurPx.toFixed(1)}px)`,
          opacity: opacity.toFixed(2),
          zIndex: Math.round(zFactor * 100),
        } as React.CSSProperties,
      };
    });
  }, [items, angleStep, rotation, normalizeAngle, cardWidth, cardHeight, halfWidth, halfHeight, radius, activeIndex]);

  return (
    <div
      ref={containerRef}
      className={`modui-cylindrical-viewport ${className}`}
      style={{
        perspective: `${perspective}px`,
        ...style,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="3D Cylindrical Carousel"
      {...rest}
    >
      {/* 3D Cylindrical Ring with Auto-fit scale & recessed Z-depth */}
      <div
        ref={cylinderRef}
        className="modui-cylindrical-ring"
        style={{
          top: showControls ? 'calc(50% - 20px)' : '50%',
          transform: `scale(${autoScale}) translateZ(-${radius}px) rotateX(${tiltAngle}deg) rotateY(${rotation}deg)`,
        }}
      >
        {renderedCards.map(({ item, index, isCurrentActive, style: cardStyle }) => (
          <div
            key={item.id}
            className={`modui-cylindrical-card ${isCurrentActive ? 'modui-cylindrical-card--active' : ''}`}
            style={cardStyle}
            onClick={(e) => {
              if (movedDistanceRef.current > 6) return;
              e.stopPropagation();
              snapToIndex(index);
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${item.title} (${index + 1} of ${totalItems})`}
            aria-current={isCurrentActive ? 'true' : undefined}
          >
            {/* Top architectural badge */}
            {(item.badge || item.tag) && (
              <div className="modui-cylindrical-card-top">
                {item.badge && <span className="modui-cylindrical-badge">{item.badge}</span>}
                {item.tag && <span className="modui-cylindrical-tag">{item.tag}</span>}
              </div>
            )}

            {/* Visual preview or artwork */}
            {item.image ? (
              <div
                className="modui-cylindrical-art"
                style={{ backgroundImage: `url(${item.image})` }}
              />
            ) : (
              <div
                className="modui-cylindrical-art modui-cylindrical-art--pattern"
                style={{
                  background: item.color
                    ? `linear-gradient(135deg, ${item.color}15, ${item.color}35)`
                    : undefined,
                }}
              >
                <div className="modui-cylindrical-art-halo" />
                <span className="modui-cylindrical-index-label">0{index + 1}</span>
              </div>
            )}

            {/* Content info */}
            <div className="modui-cylindrical-card-body">
              <h4 className="modui-cylindrical-title">{item.title}</h4>
              {item.subtitle && <p className="modui-cylindrical-subtitle">{item.subtitle}</p>}
              {item.content && <div className="modui-cylindrical-custom">{item.content}</div>}
            </div>

            {/* Specular sheen overlay */}
            <div className="modui-cylindrical-card-sheen" />
          </div>
        ))}
      </div>
      {/* Floating Tactical Bottom Controls */}
      {
        showControls && (
          <div className="modui-cylindrical-controls" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modui-cylindrical-ctrl-btn"
              onClick={() => snapToIndex((activeIndex - 1 + totalItems) % totalItems)}
              aria-label="Previous slide"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {showIndicators && (
              <div className="modui-cylindrical-dots" role="tablist" aria-label="Slides">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`modui-cylindrical-dot ${i === activeIndex ? 'modui-cylindrical-dot--active' : ''}`}
                    onClick={() => snapToIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    role="tab"
                    aria-selected={i === activeIndex}
                  />
                ))}
              </div>
            )}

            <button
              type="button"
              className="modui-cylindrical-ctrl-btn"
              onClick={() => snapToIndex((activeIndex + 1) % totalItems)}
              aria-label="Next slide"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )
      }

      {/* Drag instruction micro-hint */}
      {
        showDragHint && (
          <div className="modui-cylindrical-drag-hint">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="8 17 3 12 8 7" />
              <polyline points="16 17 21 12 16 7" />
            </svg>
            <span>Drag to rotate · Click card to focus</span>
          </div>
        )
      }
    </div >
  );
};
