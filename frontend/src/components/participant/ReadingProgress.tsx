'use client';

import React from 'react';

export interface ReadingProgressProps {
  currentSlideIndex: number;
  totalSlidesInSection: number;
  currentSectionIndex: number;
  totalSections: number;
  totalWordCount?: number;
  wordsRead?: number;
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({
  currentSlideIndex,
  totalSlidesInSection,
  currentSectionIndex,
  totalSections,
  totalWordCount = 500,
  wordsRead = 120,
}) => {
  const slidePct = Math.min(100, Math.round(((currentSlideIndex + 1) / Math.max(1, totalSlidesInSection)) * 100));
  const overallPct = Math.min(
    100,
    Math.round(
      ((currentSectionIndex + (currentSlideIndex + 1) / Math.max(1, totalSlidesInSection)) / Math.max(1, totalSections)) *
        100
    )
  );

  const wordsRemaining = Math.max(0, totalWordCount - wordsRead);
  const estMinsRemaining = Math.ceil(wordsRemaining / 150); // assuming 150 wpm reading pace

  return (
    <div className="w-full bg-slate-900/80 border-b border-slate-800/80 px-4 sm:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex-1 max-w-xs space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Section Completion</span>
            <span className="text-primary font-bold">{slidePct}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${slidePct}%` }}
            />
          </div>
        </div>

        <div className="hidden md:block flex-1 max-w-xs space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Overall Study Progress</span>
            <span className="text-emerald-400 font-bold">{overallPct}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-slate-400 justify-between sm:justify-end text-[11px]">
        <span>
          Slide <strong className="text-white">{currentSlideIndex + 1}</strong> / {totalSlidesInSection}
        </span>
        <span className="pl-3 border-l border-slate-800">
          Est. Remaining: <strong className="text-amber-400">~{estMinsRemaining}m</strong>
        </span>
      </div>
    </div>
  );
};
