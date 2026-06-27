import React from 'react';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  className = '',
  size = 'md',
  label = 'Loading...',
  ...props
}) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center gap-2 ${className}`.trim()}
      {...props}
    >
      <div
        className={`${sizes[size]} rounded-full border-primary border-t-transparent animate-spin`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

Spinner.displayName = 'Spinner';
