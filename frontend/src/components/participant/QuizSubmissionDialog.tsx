'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { QuizResultResponse } from '@/hooks/useQuizSession';

export interface QuizSubmissionDialogProps {
  isOpen: boolean;
  isConfirming: boolean;
  unansweredCount: number;
  result: QuizResultResponse | null;
  onConfirmSubmit: () => void;
  onCancelConfirm: () => void;
  onContinueAfterResult: () => void;
}

export const QuizSubmissionDialog: React.FC<QuizSubmissionDialogProps> = ({
  isOpen,
  isConfirming,
  unansweredCount,
  result,
  onConfirmSubmit,
  onCancelConfirm,
  onContinueAfterResult,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-md w-full p-6 sm:p-8 bg-slate-900 border-slate-800 space-y-6 shadow-2xl text-center">
        {isConfirming ? (
          <>
            <div className="w-14 h-14 rounded-full bg-primary/20 text-primary-light flex items-center justify-center text-2xl mx-auto">
              📝
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white">Ready to Submit Assessment?</h2>
              {unansweredCount > 0 ? (
                <p className="text-xs text-amber-400 font-semibold bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/30">
                  ⚠️ You have {unansweredCount} unanswered question{unansweredCount === 1 ? '' : 's'}. Are you sure you want to finalize your submission?
                </p>
              ) : (
                <p className="text-xs text-slate-400">
                  You have answered all questions. Once submitted, your responses will be logged for research telemetry evaluation.
                </p>
              )}
            </div>
            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={onCancelConfirm} className="flex-1 text-xs">
                Review Answers
              </Button>
              <Button variant="default" onClick={onConfirmSubmit} className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-500 font-bold">
                Confirm Submission ✓
              </Button>
            </div>
          </>
        ) : result ? (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl mx-auto shadow-inner">
              🏅
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Assessment Submitted!</h2>
              <p className="text-xs text-slate-400">
                Thank you for completing this module comprehension assessment.
              </p>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Comprehension Score:</span>
                <strong className="text-emerald-400 text-sm">
                  {result.score} / {result.max_score}
                </strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Validation Status:</span>
                <strong className={result.passed ? 'text-emerald-400' : 'text-amber-400'}>
                  {result.passed ? '✓ PASSED' : '● LOGGED'}
                </strong>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="default" size="lg" onClick={onContinueAfterResult} className="w-full bg-primary hover:bg-primary-dark font-bold shadow-lg text-xs">
                Return to Study Portal →
              </Button>
            </div>
          </>
        ) : null}
      </Card>
    </div>
  );
};
