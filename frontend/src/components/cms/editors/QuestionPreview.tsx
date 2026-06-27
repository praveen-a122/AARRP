'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { ExtendedQuestion } from '@/components/cms/editors/QuizStatisticsPanel';

export interface QuestionPreviewProps {
  question: ExtendedQuestion;
  index: number;
}

export const QuestionPreview: React.FC<QuestionPreviewProps> = ({ question, index }) => {
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [selectedMulti, setSelectedMulti] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const isMulti = question.type === 'multi_select';
  const isOpenText = question.type === 'short_answer' || question.type === 'long_answer';

  const handleToggleMulti = (idx: number) => {
    if (submitted) return;
    if (selectedMulti.includes(idx)) {
      setSelectedMulti(selectedMulti.filter((i) => i !== idx));
    } else {
      setSelectedMulti([...selectedMulti, idx]);
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
      <CardHeader className="bg-slate-900/80 border-b border-slate-800 pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
          <CardTitle className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Live Quiz Item Simulation
          </CardTitle>
        </div>
        <span className="text-xs font-mono text-primary font-bold">
          {question.points || 10} Points
        </span>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Question Heading & Prompt */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Question {index + 1}</span>
            {question.required !== false && <span className="text-error">* Required</span>}
          </div>
          <h3 className="text-base font-bold text-white leading-relaxed">
            {question.prompt || <span className="italic text-slate-600">[Empty question prompt]</span>}
          </h3>
        </div>

        {/* Options Render */}
        {isOpenText ? (
          <textarea
            disabled={submitted}
            rows={4}
            placeholder="Participant response will be typed here..."
            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none"
          />
        ) : (
          <div className="space-y-2.5">
            {(question.options || []).map((opt, idx) => {
              const isSelected = isMulti ? selectedMulti.includes(idx) : selectedOpt === idx;
              const isCorrect = isMulti
                ? (question.correct_option_indices || []).includes(idx)
                : question.correct_option_index === idx;

              let styleClass = 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-slate-700';
              if (isSelected) {
                styleClass = 'bg-primary/20 border-primary text-white font-semibold';
              }
              if (submitted && isCorrect) {
                styleClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
              } else if (submitted && isSelected && !isCorrect) {
                styleClass = 'bg-error/20 border-error text-error-light line-through';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={submitted}
                  onClick={() => (isMulti ? handleToggleMulti(idx) : setSelectedOpt(idx))}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between gap-3 ${styleClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center font-mono text-[10px] text-slate-400">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {submitted && isCorrect && <span className="text-xs font-mono text-emerald-400">✓ Correct</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Actions & Feedback */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
          <Button
            variant={submitted ? 'outline' : 'default'}
            size="sm"
            onClick={() => {
              if (submitted) {
                setSubmitted(false);
                setSelectedOpt(null);
                setSelectedMulti([]);
              } else {
                setSubmitted(true);
              }
            }}
          >
            {submitted ? 'Reset Simulation' : 'Submit Response'}
          </Button>

          {submitted && question.explanation && (
            <div className="text-xs text-slate-400 max-w-xs text-right italic">
              <strong>Explanation:</strong> {question.explanation}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
