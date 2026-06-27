'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export interface VariableCategory {
  name: 'Participant' | 'Reading' | 'Quiz' | 'Session' | 'AI';
  items: { key: string; description: string }[];
}

export interface VariableCatalogProps {
  onInsertVariable: (variableKey: string) => void;
}

export const VariableCatalog: React.FC<VariableCatalogProps> = ({ onInsertVariable }) => {
  const categories: VariableCategory[] = [
    {
      name: 'Participant',
      items: [
        { key: '{{participant.id}}', description: 'Unique participant identifier' },
        { key: '{{participant.demographics}}', description: 'JSON summary of demographic attributes' },
        { key: '{{participant.reading_speed_wpm}}', description: 'Calculated words per minute' },
      ],
    },
    {
      name: 'Reading',
      items: [
        { key: '{{paragraph.content}}', description: 'Text of the current reading paragraph' },
        { key: '{{paragraph.title}}', description: 'Heading of active reading module' },
        { key: '{{section.title}}', description: 'Parent chapter or section heading' },
      ],
    },
    {
      name: 'Quiz',
      items: [
        { key: '{{quiz.last_score}}', description: 'Score percentage on previous quiz' },
        { key: '{{quiz.missed_questions}}', description: 'List of incorrect item prompts' },
      ],
    },
    {
      name: 'Session',
      items: [
        { key: '{{session.duration_seconds}}', description: 'Total elapsed time in active cohort' },
        { key: '{{session.condition_name}}', description: 'Assigned experimental condition group' },
      ],
    },
    {
      name: 'AI',
      items: [
        { key: '{{ai.previous_intervention}}', description: 'Text of immediate prior AI response' },
        { key: '{{ai.trigger_reason}}', description: 'Heuristic condition that caused invocation' },
      ],
    },
  ];

  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md select-none">
      <CardHeader className="pb-3 border-b border-slate-800/60">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Dynamic Variable Catalog (Click to Insert)
        </CardTitle>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Inject runtime contextual variables directly into cursor position.
        </p>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {categories.map((cat) => (
          <div key={cat.name} className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold px-1.5 py-0.5 bg-primary/10 rounded border border-primary/20">
              {cat.name} Scope
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
              {cat.items.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onInsertVariable(item.key)}
                  className="text-left p-2 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-primary/50 hover:bg-slate-900 transition-all group flex flex-col justify-between"
                  title={`Insert ${item.key}`}
                >
                  <span className="font-mono text-xs font-bold text-accent group-hover:text-accent-light block truncate">
                    {item.key}
                  </span>
                  <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
