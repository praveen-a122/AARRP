'use client';

import React from 'react';
import type { Paragraph } from '@/types/api';
import type { InterventionLogItem } from '@/hooks/useReadingSession';

export interface VerticalParagraphCardProps {
  paragraph: Paragraph;
  index: number;
  totalCount: number;
  isActive: boolean;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  diffRating?: number;
  onDiffChange: (rating: number) => void;
  quizAnswer?: number;
  onQuizChange: (optionIdx: number) => void;
  intervention?: InterventionLogItem;
  onInterventionFeedback: (helpful: boolean) => void;
}

export const VerticalParagraphCard: React.FC<VerticalParagraphCardProps> = ({
  paragraph,
  index,
  totalCount,
  isActive,
  fontSize,
  diffRating,
  onDiffChange,
  quizAnswer,
  onQuizChange,
  intervention,
  onInterventionFeedback,
}) => {
  const fontClasses = {
    sm: 'text-base leading-relaxed',
    md: 'text-lg leading-relaxed',
    lg: 'text-xl leading-loose',
    xl: 'text-2xl leading-loose',
  };

  const labelMapping: Record<string, string> = {
    A_definition: 'AI VOCABULARY DEFINITION HELP',
    B_summary: 'AI SUMMARY HIGHLIGHT',
    C_rephrase: 'AI SIMPLE REPHRASE ASSIST',
    D_analogy: 'AI RELATABLE ANALOGY CONCEPT',
  };

  return (
    <div
      id={paragraph.id}
      className={`reading-para relative p-6 sm:p-8 rounded-2xl transition-all duration-300 border mb-8 ${
        isActive
          ? 'bg-slate-900/95 border-orange-500 shadow-2xl shadow-orange-500/10 border-l-4 border-l-orange-500'
          : 'bg-slate-900/60 border-slate-800/80 shadow-md hover:border-slate-700'
      }`}
    >
      {/* Paragraph Metadata Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/60 text-xs font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <span className={`font-bold ${isActive ? 'text-orange-400' : 'text-slate-400'}`}>
            Paragraph #{index + 1}
          </span>
          <span>of {totalCount}</span>
        </div>
        <span>{paragraph.word_count || 0} words</span>
      </div>

      {/* Main Reading Paragraph Text */}
      <div className={`font-serif text-slate-100 ${fontClasses[fontSize]} select-text tracking-wide`}>
        {paragraph.content}
      </div>

      {/* AI Intervention Banner (Dynamic Scaffolding) */}
      {intervention && (
        <div className="mt-6 p-5 rounded-xl bg-orange-950/40 border border-orange-500/40 border-l-4 border-l-orange-500 animate-fade-in space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono tracking-wider text-orange-400 uppercase flex items-center gap-1.5">
              <span>🤖</span>
              {labelMapping[intervention.arm] || 'AI COGNITIVE SCAFFOLDING'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300">
              Triggered by: {intervention.struggle_type.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-slate-200 font-sans leading-relaxed">
            {intervention.support_text}
          </p>
          <div className="pt-2 flex items-center gap-3">
            <span className="text-xs text-slate-400">Was this AI assistance helpful?</span>
            <button
              type="button"
              onClick={() => onInterventionFeedback(true)}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                intervention.accepted === true
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400'
                  : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-emerald-500 hover:text-white'
              }`}
            >
              ✓ This helped
            </button>
            <button
              type="button"
              onClick={() => onInterventionFeedback(false)}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                intervention.accepted === false
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400'
                  : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-rose-500 hover:text-white'
              }`}
            >
              ✕ Not helpful
            </button>
          </div>
        </div>
      )}

      {/* Quick Check Box (Form Validation Requirements) */}
      {paragraph.quiz && (
        <div className="mt-8 p-5 sm:p-6 rounded-xl bg-slate-950/80 border border-slate-800 space-y-6 font-sans">
          <div className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase border-b border-slate-800 pb-2.5 flex items-center justify-between">
            <span>⚡ Quick Check — Paragraph {index + 1}</span>
            <span className={diffRating && quizAnswer !== undefined ? 'text-emerald-400' : 'text-amber-400'}>
              {diffRating && quizAnswer !== undefined ? '✓ Complete' : '⚠️ Action Required'}
            </span>
          </div>

          {/* Difficulty Likert Scale 1-5 */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-300">
              How difficult was this paragraph to understand?
            </label>
            <div className="grid grid-cols-5 gap-2 max-w-md">
              {[1, 2, 3, 4, 5].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => onDiffChange(val)}
                  className={`py-2 rounded-lg text-sm font-bold border transition-all ${
                    diffRating === val
                      ? 'bg-orange-600 border-orange-400 text-white shadow-lg shadow-orange-600/30'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            <div className="flex justify-between max-w-md text-[11px] font-mono text-slate-500 px-1">
              <span>1 = Very easy</span>
              <span>5 = Very difficult</span>
            </div>
          </div>

          {/* MCQ Question */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div className="text-sm font-semibold text-slate-200">
              {paragraph.quiz.question}
            </div>
            <div className="space-y-2">
              {paragraph.quiz.options.map((optText, optIdx) => {
                const isSelected = quizAnswer === optIdx;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => onQuizChange(optIdx)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 text-sm ${
                      isSelected
                        ? 'bg-orange-950/60 border-orange-500 text-white font-medium ring-1 ring-orange-500/50'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        isSelected ? 'bg-orange-600 border-orange-400 text-white' : 'border-slate-700 text-slate-500'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{optText}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
