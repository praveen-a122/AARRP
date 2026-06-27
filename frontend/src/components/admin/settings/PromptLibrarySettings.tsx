'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const PromptLibrarySettings: React.FC = () => {
  const templates = [
    { name: 'Default Contextual Hint', vars: ['{{reading_text}}', '{{student_level}}'], updated: '2d ago' },
    { name: 'Vocabulary Expansion Base', vars: ['{{target_word}}', '{{context_sentence}}'], updated: '5d ago' },
    { name: 'Socratic Comprehension Prompt', vars: ['{{paragraph_content}}'], updated: '1w ago' },
  ];

  return (
    <Card className="p-6 bg-slate-900/90 border-slate-800 shadow-xl space-y-4 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Global AI Scaffolding Prompt Library
          </h3>
          <p className="text-xs text-slate-400">Baseline instructional prompts inherited by new reading modules</p>
        </div>
        <Button onClick={() => alert('Opening Create Prompt Template dialog')} size="sm" className="bg-primary hover:bg-primary-dark text-xs font-bold">
          + New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {templates.map((t, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-white font-mono">{t.name}</h4>
              <div className="flex flex-wrap gap-1 mt-2">
                {t.vars.map((v) => (
                  <span key={v} className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono text-[10px]">
                    {v}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-900 text-[11px] font-mono text-slate-500">
              <span>Modified: {t.updated}</span>
              <button type="button" onClick={() => alert(`Editing template: ${t.name}`)} className="text-primary hover:underline">
                Configure →
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
