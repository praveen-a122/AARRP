'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  passed: boolean;
  mandatory: boolean;
}

export interface PublishChecklistProps {
  items: ChecklistItem[];
}

export const PublishChecklist: React.FC<PublishChecklistProps> = ({ items }) => {
  const allMandatoryPassed = items.filter((i) => i.mandatory).every((i) => i.passed);

  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-slate-800/60 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-white">Pre-Deployment Verification Matrix</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Mandatory checks required before opening participant cohorts.
          </p>
        </div>
        <Badge variant={allMandatoryPassed ? 'success' : 'error'}>
          {allMandatoryPassed ? 'All Systems Go' : 'Blockers Detected'}
        </Badge>
      </CardHeader>

      <CardContent className="pt-4 space-y-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-start justify-between p-3 rounded-xl border transition-all text-xs ${
              item.passed
                ? 'bg-slate-950/60 border-slate-800 text-slate-200'
                : item.mandatory
                ? 'bg-error/10 border-error/30 text-white'
                : 'bg-amber-500/10 border-amber-500/30 text-white'
            }`}
          >
            <div className="flex items-start gap-3 min-w-0 pr-3">
              <span className="text-sm mt-0.5">{item.passed ? '✅' : item.mandatory ? '❌' : '⚠️'}</span>
              <div className="min-w-0">
                <div className="font-bold flex items-center gap-2">
                  <span>{item.label}</span>
                  {item.mandatory && <span className="text-[10px] font-mono uppercase text-slate-400 font-normal">[Mandatory]</span>}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.description}</p>
              </div>
            </div>

            <span className="font-mono text-[11px] font-bold flex-shrink-0 pt-0.5">
              {item.passed ? (
                <span className="text-emerald-400">PASSED</span>
              ) : item.mandatory ? (
                <span className="text-error-light">FAILED</span>
              ) : (
                <span className="text-amber-400">WARNING</span>
              )}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
