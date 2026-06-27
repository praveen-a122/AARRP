'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';

export interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
  answeredCount: number;
  elapsedSeconds: number;
  autosaveStatus?: 'idle' | 'saving' | 'saved' | 'error';
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  currentIndex,
  totalQuestions,
  answeredCount,
  elapsedSeconds,
  autosaveStatus = 'saved',
}) => {
  const pct = Math.min(100, Math.round((answeredCount / Math.max(1, totalQuestions)) * 100));

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getAutosaveBadge = () => {
    switch (autosaveStatus) {
      case 'saving':
        return <span className="text-amber-400 animate-pulse">🔄 Autosaving...</span>;
      case 'error':
        return <span className="text-error">⚠️ Save Failed</span>;
      default:
        return <span className="text-emerald-400">✓ Draft Saved</span>;
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border-b border-slate-800 px-4 sm:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex-1 max-w-xs space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Assessment Completion</span>
            <span className="text-primary font-bold">{pct}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <span className="text-slate-400 text-[11px]">
          Answered <strong className="text-white">{answeredCount}</strong> of {totalQuestions}
        </span>
      </div>

      <div className="flex items-center gap-3 justify-between sm:justify-end text-[11px]">
        <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
          {getAutosaveBadge()}
        </div>

        <Badge variant="secondary">
          ⏱️ {formatTime(elapsedSeconds)}
        </Badge>
      </div>
    </div>
  );
};
