'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';

export interface ReadinessScoreCardProps {
  score: number; // 0 to 100
  criticalCount: number;
  warningCount: number;
  passedCount: number;
}

export const ReadinessScoreCard: React.FC<ReadinessScoreCardProps> = ({
  score,
  criticalCount,
  warningCount,
  passedCount,
}) => {
  let statusColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  let label = 'Production Ready';
  if (criticalCount > 0) {
    statusColor = 'text-error-light border-error/40 bg-error/10';
    label = 'Deployment Blocked';
  } else if (warningCount > 0 || score < 90) {
    statusColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    label = 'Ready with Warnings';
  }

  return (
    <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md overflow-hidden">
      <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          {/* Circular Score Badge */}
          <div className={`w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center flex-shrink-0 ${statusColor}`}>
            <span className="text-3xl font-extrabold font-mono tracking-tighter">{score}%</span>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Readiness</span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Diagnostic Health Score
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">{label}</h2>
            <p className="text-xs text-slate-400 max-w-sm leading-normal">
              Aggregated from reading modules, assessment quizzes, AI prompt rules, and accessibility standards.
            </p>
          </div>
        </div>

        {/* Breakdown Counters */}
        <div className="grid grid-cols-3 gap-3 w-full sm:w-auto self-stretch sm:self-auto border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-6 text-center font-mono">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-error-light font-bold text-lg block">{criticalCount}</span>
            <span className="text-[10px] text-slate-500 uppercase">Criticals</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-amber-400 font-bold text-lg block">{warningCount}</span>
            <span className="text-[10px] text-slate-500 uppercase">Warnings</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-emerald-400 font-bold text-lg block">{passedCount}</span>
            <span className="text-[10px] text-slate-500 uppercase">Passed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
