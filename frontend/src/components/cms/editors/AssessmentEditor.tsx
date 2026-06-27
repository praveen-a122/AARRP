'use client';

import React from 'react';
import { FormSection } from '@/components/cms/FormSection';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { QuestionEditor } from '@/components/cms/editors/QuestionEditor';
import type { Quiz } from '@/types/api';
import type { ExtendedQuestion } from '@/components/cms/editors/QuizStatisticsPanel';

export interface AssessmentEditorProps {
  quiz: Quiz;
  questions: ExtendedQuestion[];
  index: number;
  onQuizChange: (updated: Quiz) => void;
  onDeleteQuiz: () => void;
  onDuplicateQuiz: () => void;
  onAddQuestion: (quizId: string) => void;
  onQuestionChange: (updated: ExtendedQuestion) => void;
  onDeleteQuestion: (id: string) => void;
  onDuplicateQuestion: (id: string) => void;
  onReorderQuestions: (newQs: ExtendedQuestion[]) => void;
}

export const AssessmentEditor: React.FC<AssessmentEditorProps> = ({
  quiz,
  questions,
  index,
  onQuizChange,
  onDeleteQuiz,
  onDuplicateQuiz,
  onAddQuestion,
  onQuestionChange,
  onDeleteQuestion,
  onDuplicateQuestion,
  onReorderQuestions,
}) => {
  const quizQs = questions
    .filter((q) => q.quiz_id === quiz.id)
    .sort((a, b) => a.order - b.order);

  const handleMoveQ = (qIdx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? qIdx - 1 : qIdx + 1;
    if (targetIdx < 0 || targetIdx >= quizQs.length) return;

    const copy = [...quizQs];
    const temp = copy[qIdx];
    copy[qIdx] = copy[targetIdx];
    copy[targetIdx] = temp;

    const reordered = copy.map((q, idx) => ({ ...q, order: idx + 1 }));
    onReorderQuestions(reordered);
  };

  return (
    <FormSection
      title={`${quiz.title || `Assessment Module ${index + 1}`}`}
      badge={`${quizQs.length} Items`}
      description="Structure comprehension evaluations and score metrics."
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div className="flex-1 min-w-0 pr-4">
            <Input
              label="Quiz Assessment Title"
              value={quiz.title || ''}
              onChange={(e) => onQuizChange({ ...quiz, title: e.target.value })}
              placeholder="e.g. Post-Reading Comprehension Check"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button variant="outline" size="sm" onClick={onDuplicateQuiz} className="text-xs">
              Duplicate Quiz
            </Button>
            <Button variant="destructive" size="sm" onClick={onDeleteQuiz} className="text-xs">
              Delete Quiz
            </Button>
          </div>
        </div>

        <div className="space-y-4 pl-0 sm:pl-4 border-l-2 border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Configured Questions ({quizQs.length})
            </h4>
            <Button variant="secondary" size="sm" onClick={() => onAddQuestion(quiz.id)} className="text-xs">
              + Append Question Item
            </Button>
          </div>

          {quizQs.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-500">
              No evaluation questions configured. Click &quot;+ Append Question Item&quot; to begin.
            </div>
          ) : (
            <div className="space-y-4">
              {quizQs.map((q, qIdx) => (
                <QuestionEditor
                  key={q.id}
                  question={q}
                  index={qIdx}
                  totalCount={quizQs.length}
                  onChange={onQuestionChange}
                  onDelete={() => onDeleteQuestion(q.id)}
                  onDuplicate={() => onDuplicateQuestion(q.id)}
                  onMoveUp={() => handleMoveQ(qIdx, 'up')}
                  onMoveDown={() => handleMoveQ(qIdx, 'down')}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </FormSection>
  );
};
