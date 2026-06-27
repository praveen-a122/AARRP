import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'error';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase select-none transition-colors';

    const variants = {
      default: 'bg-primary/20 text-primary-light border border-primary/30',
      secondary: 'bg-slate-800 text-slate-300 border border-slate-700',
      outline: 'text-slate-300 border border-slate-700 bg-transparent',
      success: 'bg-success/20 text-success border border-success/30',
      warning: 'bg-warning/20 text-warning border border-warning/30',
      error: 'bg-error/20 text-error border border-error/30',
    };

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`.trim()}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
