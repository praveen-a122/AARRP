'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MCQQuestion } from '@/components/participant/MCQQuestion';
import { LikertQuestion } from '@/components/participant/LikertQuestion';
import { ShortAnswerQuestion } from '@/components/participant/ShortAnswerQuestion';
import type { Question } from '@/types/api';

export interface QuestionRendererProps {
  question: Question;
  index: number;
  totalCount: number;
  answerValue?: string | number;
  onAnswerChange: (val: string | number) => void;
  disabled?: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  index,
  totalCount,
  answerValue,
  onAnswerChange,
  disabled = false,
}) => {
  // Infer question type
  const isShortAnswer = !question.options || question.options.length === 0;
  const isLikert =
    !isShortAnswer &&
    (question.options.some((o) => o.toLowerCase().includes('agree')) || question.options.length === 5);

  return (
    <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800/80 shadow-xl space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="font-bold">
            Q{index + 1}
          </Badge>
          <span className="text-slate-400">
            Question {index + 1} of {totalCount}
          </span>
        </div>
        <Badge variant="secondary" className="text-[10px]">
          {isShortAnswer ? 'Short Response' : isLikert ? 'Likert Scale' : 'Multiple Choice'}
        </Badge>
      </div>

      {/* Prompt */}
      <h2 className="text-sm sm:text-base font-bold text-white leading-relaxed font-sans select-none">
        {question.prompt}
      </h2>

      {/* Dynamic Selector */}
      <div className="pt-2">
        {isShortAnswer ? (
          <ShortAnswerQuestion
            question={question}
            value={typeof answerValue === 'string' ? answerValue : ''}
            onChange={onAnswerChange}
            disabled={disabled}
          />
        ) : isLikert ? (
          <LikertQuestion
            question={question}
            selectedVal={answerValue}
            onSelect={onAnswerChange}
            disabled={disabled}
          />
        ) : (
          <MCQQuestion
            question={question}
            selectedOption={answerValue}
            onSelect={onAnswerChange}
            disabled={disabled}
          />
        )}
      </div>
    </Card>
  );
};
