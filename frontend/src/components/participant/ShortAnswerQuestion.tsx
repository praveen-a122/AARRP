'use client';

import React from 'react';
import type { Question } from '@/types/api';

export interface ShortAnswerQuestionProps {
  question: Question;
  value?: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const ShortAnswerQuestion: React.FC<ShortAnswerQuestionProps> = ({
  question,
  value = '',
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2 animate-fade-in py-1">
      <textarea
        rows={5}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your response here... (Minimum 10 words recommended)"
        className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary transition-all resize-y leading-relaxed"
      />
      <div className="flex justify-between text-[11px] font-mono text-slate-500 px-1">
        <span>Be concise and reference specific details from the reading.</span>
        <span>{value.trim() ? value.trim().split(/\s+/).length : 0} words</span>
      </div>
    </div>
  );
};
