'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import type { CompletionTrendItem } from '@/hooks/useResearchAnalytics';

export interface CompletionChartProps {
  trends: CompletionTrendItem[];
}

export const CompletionChart: React.FC<CompletionChartProps> = ({ trends }) => {
  const maxVal = Math.max(...trends.map((t) => t.enrolled), 1);

  return (
    <Card className="p-6 bg-slate-900/90 border-slate-800 shadow-xl space-y-6 animate-fade-in flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Reading Flow & Retention (RQ2 Trends)
          </h3>
          <p className="text-xs text-slate-400">Cohort enrollment vs module completion continuity over time</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed
          </span>
          <span className="flex items-center gap-1 text-error">
            <span className="w-2.5 h-2.5 rounded-full bg-error" /> Dropped
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:gap-6 items-end pt-4 pb-2 h-48">
        {trends.map((t, idx) => {
          const compH = Math.round((t.completed / maxVal) * 100);
          const dropH = Math.round((t.droppedOut / maxVal) * 100);

          return (
            <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
              <div className="w-full flex items-end justify-center gap-1 sm:gap-2 flex-1 pb-1 border-b border-slate-800">
                <div
                  title={`Completed: ${t.completed}`}
                  className="w-4 sm:w-8 bg-emerald-500 rounded-t transition-all hover:bg-emerald-400"
                  style={{ height: `${compH}%` }}
                />
                <div
                  title={`Dropped: ${t.droppedOut}`}
                  className="w-4 sm:w-8 bg-error/80 rounded-t transition-all hover:bg-error"
                  style={{ height: `${dropH}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-slate-400">{t.date}</span>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-[11px] font-mono text-slate-400 flex justify-between items-center">
        <span>* Continuity measured via slide progression checkpoints</span>
        <span className="text-primary-light">RQ2 Flow Impact: +18.4%</span>
      </div>
    </Card>
  );
};
