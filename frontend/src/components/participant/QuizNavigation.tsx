'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

export interface QuizNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isFirst: boolean;
  isLast: boolean;
  canProceed: boolean;
  isSubmitting?: boolean;
}

export const QuizNavigation: React.FC<QuizNavigationProps> = ({
  onPrev,
  onNext,
  onSubmit,
  isFirst,
  isLast,
  canProceed,
  isSubmitting = false,
}) => {
  return (
    <div className="sticky bottom-0 z-40 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
      <Button
        variant="outline"
        size="md"
        onClick={onPrev}
        disabled={isFirst || isSubmitting}
        className="text-xs px-6"
      >
        ← Previous Question
      </Button>

      <div className="flex items-center gap-3">
        {!isLast ? (
          <Button
            variant="default"
            size="md"
            onClick={onNext}
            disabled={!canProceed || isSubmitting}
            className="bg-primary hover:bg-primary-dark text-white font-bold px-8 shadow-lg shadow-primary/20 text-xs"
          >
            Next Question →
          </Button>
        ) : (
          <Button
            variant="default"
            size="md"
            onClick={onSubmit}
            disabled={!canProceed || isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 shadow-lg shadow-emerald-600/20 text-xs"
          >
            {isSubmitting ? 'Submitting Assessment...' : 'Submit Assessment ✓'}
          </Button>
        )}
      </div>
    </div>
  );
};
