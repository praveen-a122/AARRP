'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export interface DiffItem {
  category: 'Reading Module' | 'Assessment Quiz' | 'AI Prompt Rule' | 'Metadata';
  name: string;
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  detail?: string;
}

export interface VersionComparatorProps {
  currentVersionNumber?: number;
  diffs?: DiffItem[];
}

export const VersionComparator: React.FC<VersionComparatorProps> = ({
  currentVersionNumber = 2,
  diffs = [
    { category: 'Reading Module', name: 'Section 1: Foundations', type: 'modified', detail: 'Added 2 paragraphs, updated difficulty to Medium.' },
    { category: 'Assessment Quiz', name: 'Post-Reading Check', type: 'added', detail: 'Configured 4 MCQ items with 70% passing score.' },
    { category: 'AI Prompt Rule', name: 'Socratic Hint', type: 'modified', detail: 'Adjusted temperature to 0.6 and bound {{paragraph.content}}.' },
    { category: 'Metadata', name: 'Study Abstract', type: 'unchanged', detail: 'Identical to v1.0 release.' },
  ],
}) => {
  const prevVersion = Math.max(1, currentVersionNumber - 1);

  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-slate-800/60 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-white">
            Diff Comparator: v{currentVersionNumber}.0 Draft vs. v{prevVersion}.0 Published
          </CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Granular structural change log across experimental configuration layers.
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-2.5">
        {diffs.map((diff, idx) => {
          let badgeColor = 'bg-slate-900 text-slate-400 border-slate-800';
          if (diff.type === 'added') badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
          else if (diff.type === 'removed') badgeColor = 'bg-error/10 text-error-light border-error/30 line-through';
          else if (diff.type === 'modified') badgeColor = 'bg-primary/15 text-primary-light border-primary/40';

          return (
            <div
              key={idx}
              className="flex items-start justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs gap-4"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 bg-slate-900 text-slate-400 rounded border border-slate-800">
                    {diff.category}
                  </span>
                  <span className="font-bold text-white truncate">{diff.name}</span>
                </div>
                {diff.detail && <p className="text-[11px] text-slate-400 font-sans">{diff.detail}</p>}
              </div>

              <span className={`font-mono text-[10px] font-bold uppercase px-2 py-1 rounded border flex-shrink-0 ${badgeColor}`}>
                {diff.type.toUpperCase()}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
