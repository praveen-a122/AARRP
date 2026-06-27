'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';

export interface ReadingHeaderProps {
  experimentTitle: string;
  sectionTitle: string;
  sectionIndex: number;
  totalSections: number;
  elapsedSeconds: number;
  onExit?: () => void;
}

export const ReadingHeader: React.FC<ReadingHeaderProps> = ({
  experimentTitle,
  sectionTitle,
  sectionIndex,
  totalSections,
  elapsedSeconds,
  onExit,
}) => {
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400 hidden sm:inline">
            Active Study
          </span>
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-bold text-white truncate">{experimentTitle || 'Adaptive Reading Session'}</h1>
          <p className="text-xs text-slate-400 truncate">
            Module {sectionIndex + 1} of {totalSections}: <strong className="text-slate-200">{sectionTitle}</strong>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 font-mono text-xs">
        <Badge variant="secondary">
          ⏱️ {formatTime(elapsedSeconds)}
        </Badge>

        {onExit && (
          <button
            type="button"
            onClick={onExit}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-error/20 hover:text-error border border-slate-800 text-slate-400 transition-all font-sans text-xs font-semibold"
            title="Exit Session"
          >
            Exit Study
          </button>
        )}
      </div>
    </header>
  );
};
