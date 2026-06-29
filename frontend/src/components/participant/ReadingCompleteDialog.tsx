'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface ReadingCompleteDialogProps {
  isOpen: boolean;
  experimentTitle: string;
  totalElapsedSeconds: number;
  onContinueToAssessment?: () => void;
  onReturnHome?: () => void;
}

export const ReadingCompleteDialog: React.FC<ReadingCompleteDialogProps> = ({
  isOpen,
  experimentTitle,
  totalElapsedSeconds,
  onContinueToAssessment,
  onReturnHome,
}) => {
  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-md w-full p-8 bg-slate-900 border-slate-800 space-y-6 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl mx-auto shadow-inner">
          🎉
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Reading Modules Completed!</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            You have successfully completed all assigned reading sections for <strong className="text-slate-200">{experimentTitle}</strong>.
          </p>
        </div>

        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 font-mono text-xs space-y-2">
          <div className="flex justify-between text-slate-400">
            <span>Total Reading Duration:</span>
            <strong className="text-emerald-400">{formatTime(totalElapsedSeconds)}</strong>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>AI Scaffolding Status:</span>
            <strong className="text-primary-light">Logged & Verified</strong>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          {onContinueToAssessment && (
            <Button variant="default" size="lg" onClick={onContinueToAssessment} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg">
              View Study Completion Report →
            </Button>
          )}
          {onReturnHome && (
            <Button variant="outline" size="md" onClick={onReturnHome} className="w-full text-xs text-slate-400">
              Return to Participant Portal
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
