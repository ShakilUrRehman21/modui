import React from 'react';
import './Badge.css';

export type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'cyan';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
  pulse?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  dot = false,
  pulse = false,
  icon,
  children,
  className = '',
  ...props
}) => {
  return (
    <span className={`modui-badge modui-badge--${variant} ${className}`} {...props}>
      {dot && (
        <span
          className={`modui-badge-dot ${pulse ? 'modui-badge-dot--pulse' : ''}`}
          aria-hidden="true"
        />
      )}
      {icon && <span className="modui-badge-icon">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
