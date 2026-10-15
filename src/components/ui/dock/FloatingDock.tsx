import React, { useState, useRef, useEffect, useMemo } from 'react';
import './FloatingDock.css';

export interface DockItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  badge?: string | number;
  badgeVariant?: 'dot' | 'count';
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}

export interface FloatingDockProps {
  items: DockItem[];
  activeId?: string;
  defaultActiveId?: string;
  onSelect?: (id: string, item: DockItem) => void;
  orientation?: 'horizontal' | 'vertical';
  baseSize?: number;
  variant?: 'glass' | 'solid' | 'minimal' | 'dark';
  position?: 'bottom' | 'top' | 'static';
  showTooltips?: boolean;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  items,
  activeId: controlledActiveId,
  defaultActiveId,
  onSelect,
  orientation = 'horizontal',
  baseSize = 44,
  variant = 'glass',
  position = 'static',
  showTooltips = true,
  className = '',
  style,
  ariaLabel = 'Interactive Dock',
}) => {
  // Active selection state
  const [internalActiveId, setInternalActiveId] = useState<string>(
    controlledActiveId || defaultActiveId || items[0]?.id || ''
  );
  const activeId = controlledActiveId !== undefined ? controlledActiveId : internalActiveId;

  // Track hover and focus states
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // References to button elements for keyboard focus management
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Click & Selection handler
  const handleItemClick = (item: DockItem) => {
    if (item.disabled) return;
    if (controlledActiveId === undefined) {
      setInternalActiveId(item.id);
    }
    onSelect?.(item.id, item);
    item.onClick?.();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isHorizontal = orientation === 'horizontal';
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

    if (e.key === nextKey) {
      e.preventDefault();
      const nextIdx = (focusedIndex + 1) % items.length;
      setFocusedIndex(nextIdx);
      const nextItem = items[nextIdx];
      itemRefs.current.get(nextItem.id)?.focus();
      handleItemClick(nextItem);
    } else if (e.key === prevKey) {
      e.preventDefault();
      const prevIdx = (focusedIndex - 1 + items.length) % items.length;
      setFocusedIndex(prevIdx);
      const prevItem = items[prevIdx];
      itemRefs.current.get(prevItem.id)?.focus();
      handleItemClick(prevItem);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusedIndex(0);
      itemRefs.current.get(items[0]?.id)?.focus();
      handleItemClick(items[0]);
    } else if (e.key === 'End') {
      e.preventDefault();
      const lastIdx = items.length - 1;
      setFocusedIndex(lastIdx);
      itemRefs.current.get(items[lastIdx]?.id)?.focus();
      handleItemClick(items[lastIdx]);
    }
  };

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const hasCmd = e.metaKey || e.ctrlKey;
      if (!hasCmd) return;

      const matchedItem = items.find((item) => {
        if (!item.shortcut) return false;
        const normalized = item.shortcut.toLowerCase().replace(/^(cmd|ctrl)\+?/, '');
        return normalized === key;
      });

      if (matchedItem && !matchedItem.disabled) {
        e.preventDefault();
        handleItemClick(matchedItem);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [items]);

  const dockClasses = useMemo(() => {
    return [
      'modui-floating-dock',
      `modui-dock--${orientation}`,
      `modui-dock--variant-${variant}`,
      `modui-dock--pos-${position}`,
      className,
    ].filter(Boolean).join(' ');
  }, [orientation, variant, position, className]);

  return (
    <div
      className={dockClasses}
      style={{
        '--dock-base-size': `${baseSize}px`,
        ...style,
      } as React.CSSProperties}
      onKeyDown={handleKeyDown}
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation={orientation}
    >
      <div className="modui-dock-items-track">
        {items.map((item, idx) => {
          const isActive = item.id === activeId;
          const isHovered = item.id === hoveredId;

          return (
            <div key={item.id} className="modui-dock-item-wrapper">
              <button
                ref={(el) => {
                  if (el) itemRefs.current.set(item.id, el);
                  else itemRefs.current.delete(item.id);
                }}
                type="button"
                className={`modui-dock-item-btn ${isActive ? 'modui-dock-item--active' : ''} ${
                  item.disabled ? 'modui-dock-item--disabled' : ''
                }`}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => {
                  setFocusedIndex(idx);
                  setHoveredId(item.id);
                }}
                onBlur={() => setHoveredId(null)}
                disabled={item.disabled}
                role="tab"
                aria-selected={isActive}
                aria-label={item.label}
                tabIndex={isActive || (focusedIndex === -1 && idx === 0) ? 0 : -1}
              >
                {/* Main Icon with micro-interaction lift on hover */}
                <span className="modui-dock-icon-wrap" aria-hidden="true">
                  {item.icon}
                </span>

                {/* Optional Badge Indicator */}
                {item.badge !== undefined && (
                  <span
                    className={`modui-dock-badge ${
                      item.badgeVariant === 'dot' ? 'modui-dock-badge--dot' : 'modui-dock-badge--count'
                    }`}
                    aria-label={`Badge: ${item.badge}`}
                  >
                    {item.badgeVariant !== 'dot' && item.badge}
                  </span>
                )}
              </button>

              {/* Floating Tooltip with Optional Shortcut Tag */}
              {showTooltips && (
                <div
                  className={`modui-dock-tooltip ${isHovered ? 'modui-dock-tooltip--visible' : ''}`}
                  role="tooltip"
                  aria-hidden={!isHovered}
                >
                  <span className="modui-dock-tooltip-label">{item.label}</span>
                  {item.shortcut && (
                    <kbd className="modui-dock-tooltip-shortcut">{item.shortcut}</kbd>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FloatingDock;
