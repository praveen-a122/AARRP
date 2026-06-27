'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizSession } from '@/hooks/useQuizSession';
import { QuizProgress } from '@/components/participant/QuizProgress';
import { QuestionRenderer } from '@/components/participant/QuestionRenderer';
import { QuizNavigation } from '@/components/participant/QuizNavigation';
import { QuizSubmissionDialog } from '@/components/participant/QuizSubmissionDialog';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface QuizRuntimeProps {
  sessionId: string;
  sectionId: string;
  onComplete?: () => void;
}

export const QuizRuntime: React.FC<QuizRuntimeProps> = ({ sessionId, sectionId, onComplete }) => {
  const router = useRouter();
  const {
    quiz,
    questions,
    activeQuestion,
    currentQuestionIdx,
    setCurrentQuestionIdx,
    answers,
    handleSetAnswer,
    elapsedSeconds,
    isLoading,
    error,
    autosaveStatus,
    isSubmitting,
    isSubmitted,
    submissionResult,
    handleSubmitQuiz,
  } = useQuizSession(sessionId, sectionId);

  const [confirmingSubmit, setConfirmingSubmit] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-400 space-y-4">
        <Spinner size="lg" />
        <p className="font-mono text-xs uppercase tracking-widest text-slate-500 animate-pulse">
          Loading Comprehension Assessment...
        </p>
      </div>
    );
  }

  if (error || !quiz || questions.length === 0) {
    return (
      <div className="min-h-[60vh] bg-slate-950 flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 bg-slate-900 border-error/40 text-center space-y-4">
          <div className="text-3xl">⚠️</div>
          <h2 className="text-lg font-bold text-white">Assessment Unavailable</h2>
          <p className="text-xs text-slate-400">
            No active comprehension quiz could be retrieved for section ID <code className="text-white bg-slate-950 px-2 py-0.5 rounded">{sectionId}</code>.
          </p>
          <Button variant="outline" onClick={() => router.back()} className="w-full text-xs">
            Return to Reading Portal
          </Button>
        </Card>
      </div>
    );
  }

  const currentAnswer = answers[activeQuestion?.id || ''];
  const hasAnsweredCurrent = currentAnswer !== undefined && currentAnswer !== '';
  const answeredCount = Object.keys(answers).filter((k) => answers[k] !== undefined && answers[k] !== '').length;
  const unansweredCount = questions.length - answeredCount;

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1);
    }
  };

  const handleConfirmSubmit = async () => {
    await handleSubmitQuiz();
    setConfirmingSubmit(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-primary/30 selection:text-white">
      {/* Top Title Bar */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          <h1 className="text-sm font-bold text-white truncate">{quiz.title}</h1>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Session Code: <strong className="text-slate-200">{sessionId}</strong>
        </span>
      </header>

      {/* Progress Bar */}
      <QuizProgress
        currentIndex={currentQuestionIdx}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        elapsedSeconds={elapsedSeconds}
        autosaveStatus={autosaveStatus}
      />

      {/* Main Question Area */}
      <main className="flex-1 px-4 sm:px-8 py-10 flex flex-col justify-center max-w-3xl mx-auto w-full">
        <QuestionRenderer
          key={activeQuestion.id}
          question={activeQuestion}
          index={currentQuestionIdx}
          totalCount={questions.length}
          answerValue={currentAnswer}
          onAnswerChange={(val) => handleSetAnswer(activeQuestion.id, val)}
          disabled={isSubmitted || isSubmitting}
        />
      </main>

      {/* Navigation Footer */}
      <QuizNavigation
        onPrev={handlePrev}
        onNext={handleNext}
        onSubmit={() => setConfirmingSubmit(true)}
        isFirst={currentQuestionIdx === 0}
        isLast={currentQuestionIdx === questions.length - 1}
        canProceed={hasAnsweredCurrent}
        isSubmitting={isSubmitting}
      />

      {/* Submission Confirmation & Score Dialog */}
      <QuizSubmissionDialog
        isOpen={confirmingSubmit || isSubmitted}
        isConfirming={confirmingSubmit && !isSubmitted}
        unansweredCount={unansweredCount}
        result={submissionResult}
        onConfirmSubmit={handleConfirmSubmit}
        onCancelConfirm={() => setConfirmingSubmit(false)}
        onContinueAfterResult={() => {
          if (onComplete) onComplete();
          else router.push('/login');
        }}
      />
    </div>
  );
};
