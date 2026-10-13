import React, { useEffect, useRef, useState, useMemo } from 'react';
import './NumberTicker.css';

export interface NumberTickerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The target numerical value to roll to */
  value: number;
  /** Number of decimal places to display (default: 0) */
  decimalPlaces?: number;
  /** Optional prefix text/symbol (e.g. "$", "+") */
  prefix?: string;
  /** Optional suffix text/symbol (e.g. "%", "k", "/mo") */
  suffix?: string;
  /** Animation duration in seconds (default: 1.2) */
  duration?: number;
  /** Delay before animation starts in seconds (default: 0) */
  delay?: number;
  /** Stagger delay between digit columns in seconds (default: 0.04) */
  stagger?: number;
  /** Custom CSS class name */
  className?: string;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

interface DigitColumnProps {
  digit: number;
  duration: number;
  delay: number;
}

const DigitColumn: React.FC<DigitColumnProps> = ({ digit, duration, delay }) => {
  return (
    <span className="modui-ticker-column" aria-hidden="true">
      <span
        className="modui-ticker-track"
        style={{
          transform: `translateY(-${digit * 10}%)`,
          transitionDuration: `${duration}s`,
          transitionDelay: `${delay}s`,
        }}
      >
        {DIGITS.map((d) => (
          <span key={d} className="modui-ticker-digit">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
};

export const NumberTicker: React.FC<NumberTickerProps> = ({
  value,
  decimalPlaces = 0,
  prefix = '',
  suffix = '',
  duration = 1.2,
  delay = 0,
  stagger = 0.04,
  className = '',
  ...rest
}) => {
  const [mounted, setMounted] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    // Start animation on initial mount or value change
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    prevValueRef.current = value;
  }, [value]);

  // Format value into string characters with commas and decimal places
  const formattedParts = useMemo(() => {
    const fixed = Math.abs(value).toFixed(decimalPlaces);
    const [intPart, decPart] = fixed.split('.');
    
    // Add thousands commas
    const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decPart !== undefined ? `${withCommas}.${decPart}` : withCommas;
  }, [value, decimalPlaces]);

  // Characters split array for rendering columns
  const characters = useMemo(() => {
    return formattedParts.split('');
  }, [formattedParts]);

  const isNegative = value < 0;
  const accessibleLabel = `${prefix}${isNegative ? '-' : ''}${formattedParts}${suffix}`;

  return (
    <span
      className={`modui-number-ticker ${className}`}
      role="status"
      aria-live="polite"
      aria-label={accessibleLabel}
      {...rest}
    >
      {/* Screen reader only live readout */}
      <span className="modui-ticker-sr-only">{accessibleLabel}</span>

      {/* Visual rolling display */}
      <span className="modui-ticker-display" aria-hidden="true">
        {prefix && <span className="modui-ticker-affix modui-ticker-prefix">{prefix}</span>}
        {isNegative && <span className="modui-ticker-symbol">-</span>}
        
        {characters.map((char, index) => {
          const isDigit = /\d/.test(char);
          if (!isDigit) {
            return (
              <span key={`sym-${index}`} className="modui-ticker-symbol">
                {char}
              </span>
            );
          }

          const targetDigit = mounted ? parseInt(char, 10) : 0;
          // Stagger effect from left to right or right to left
          const colDelay = delay + index * stagger;

          return (
            <DigitColumn
              key={`digit-${index}-${characters.length}`}
              digit={targetDigit}
              duration={duration}
              delay={colDelay}
            />
          );
        })}

        {suffix && <span className="modui-ticker-affix modui-ticker-suffix">{suffix}</span>}
      </span>
    </span>
  );
};

export default NumberTicker;
