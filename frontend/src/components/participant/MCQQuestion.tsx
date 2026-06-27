'use client';

import React from 'react';
import type { Question } from '@/types/api';

export interface MCQQuestionProps {
  question: Question;
  selectedOption?: string | number;
  onSelect: (val: string | number) => void;
  disabled?: boolean;
}

export const MCQQuestion: React.FC<MCQQuestionProps> = ({
  question,
  selectedOption,
  onSelect,
  disabled = false,
}) => {
  return (
    <div className="space-y-3 animate-fade-in">
      {question.options.map((opt, idx) => {
        const isSelected = selectedOption === opt || selectedOption === idx;

        return (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(opt)}
            className={`w-full p-4 rounded-xl text-left transition-all flex items-start gap-3.5 border ${
              isSelected
                ? 'bg-primary/20 border-primary shadow-md shadow-primary/10 text-white font-semibold'
                : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            } ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                isSelected ? 'border-primary bg-primary text-white text-xs font-bold' : 'border-slate-700 bg-slate-950'
              }`}
            >
              {isSelected && '✓'}
            </div>
            <div className="flex-1 text-xs sm:text-sm leading-relaxed">{opt}</div>
          </button>
        );
      })}
    </div>
  );
};
