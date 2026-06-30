import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'default',
      size = 'md',
      isLoading = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none';
    
    const variants = {
      default: 'bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-500 text-white shadow-lg shadow-primary/25',
      outline: 'border border-slate-700 bg-transparent hover:bg-slate-800/60 text-slate-200 hover:border-slate-600',
      secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 shadow-md',
      destructive: 'bg-error hover:bg-error/90 text-white shadow-lg shadow-error/25',
      ghost: 'bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3 gap-2.5',
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim();

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedClassName}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
