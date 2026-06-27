import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      label,
      error,
      helperText,
      disabled = false,
      required = false,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-300 uppercase tracking-wider select-none"
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            className={`w-full bg-slate-950/60 border rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-slate-600 text-sm transition-all focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed ${
              error
                ? 'border-error/80 focus:border-error focus:ring-error'
                : 'border-slate-800 focus:border-primary focus:ring-primary'
            } ${className}`.trim()}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-error font-medium animate-fade-in flex items-center gap-1">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
