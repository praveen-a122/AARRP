'use client';

import React, { useState, ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

export interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  defaultOpen = true,
  badge,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-lg overflow-hidden transition-all">
      <CardHeader
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer select-none flex flex-row items-center justify-between pb-4 border-b border-slate-800/60 hover:bg-slate-800/20 transition-colors"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-bold text-white">{title}</CardTitle>
            {badge && (
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-primary/20 text-primary-light border border-primary/30">
                {badge}
              </span>
            )}
          </div>
          {description && <CardDescription className="text-xs">{description}</CardDescription>}
        </div>

        <button
          type="button"
          aria-label={isOpen ? 'Collapse section' : 'Expand section'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <svg
            className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </CardHeader>

      {isOpen && <CardContent className="pt-6 space-y-4">{children}</CardContent>}
    </Card>
  );
};
