'use client';

import React from 'react';
import type { Question } from '@/types/api';

export interface LikertQuestionProps {
  question: Question;
  selectedVal?: string | number;
  onSelect: (val: string | number) => void;
  disabled?: boolean;
}

export const LikertQuestion: React.FC<LikertQuestionProps> = ({
  question,
  selectedVal,
  onSelect,
  disabled = false,
}) => {
  const defaultScale = ['1 - Strongly Disagree', '2 - Disagree', '3 - Neutral', '4 - Agree', '5 - Strongly Agree'];
  const scale = question.options && question.options.length > 0 ? question.options : defaultScale;

  return (
    <div className="space-y-4 animate-fade-in py-2">
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {scale.map((item, idx) => {
          const isSelected = selectedVal === item || selectedVal === idx + 1;
          const numLabel = item.split(' - ')[0] || `${idx + 1}`;
          const textLabel = item.split(' - ')[1] || item;

          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(item)}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                isSelected
                  ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md shadow-emerald-500/10 font-bold scale-[1.02]'
                  : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              } ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold border ${
                  isSelected ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                {numLabel}
              </span>
              <span className="text-[11px] leading-tight line-clamp-2">{textLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
