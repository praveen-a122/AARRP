'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import type { InterventionBreakdownItem } from '@/hooks/useResearchAnalytics';

export interface InterventionChartProps {
  items: InterventionBreakdownItem[];
}

export const InterventionChart: React.FC<InterventionChartProps> = ({ items }) => {
  const maxCount = Math.max(...items.map((i) => i.count), 1);

  return (
    <Card className="p-6 bg-slate-900/90 border-slate-800 shadow-xl space-y-6 animate-fade-in flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            AI Scaffolding Efficacy (RQ1 Breakdown)
          </h3>
          <p className="text-xs text-slate-400">Telemetry distribution across cognitive intervention archetypes</p>
        </div>
        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
          Telemetry Verified
        </span>
      </div>

      <div className="space-y-5 py-2">
        {items.map((item, idx) => {
          const widthPct = Math.round((item.count / maxCount) * 100);
          const helpfulPct = Math.round((item.helpfulCount / Math.max(1, item.count)) * 100);

          return (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-200 font-bold">{item.scaffoldingType}</span>
                <div className="flex items-center gap-4 text-[11px] text-slate-400">
                  <span>
                    Helpful: <strong className="text-emerald-400">{helpfulPct}%</strong>
                  </span>
                  <span>
                    Latency: <strong className="text-primary-light">{item.avgLatencyMs}ms</strong>
                  </span>
                  <span className="text-white font-bold">{item.count} events</span>
                </div>
              </div>

              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-[11px] font-mono text-slate-400 flex justify-between items-center">
        <span>* Data logged via participant paragraph engagement hooks</span>
        <span className="text-emerald-400">✓ Reproducible Telemetry</span>
      </div>
    </Card>
  );
};
