'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { ExportPackageRequest } from '@/hooks/useExportModule';

export interface ExportInterfaceProps {
  onGenerate: (req: ExportPackageRequest) => Promise<unknown>;
  isGenerating?: boolean;
}

export const ExportInterface: React.FC<ExportInterfaceProps> = ({ onGenerate, isGenerating = false }) => {
  const [includeTelemetry, setIncludeTelemetry] = useState(true);
  const [includeAI, setIncludeAI] = useState(true);
  const [includeQuiz, setIncludeQuiz] = useState(true);
  const [anonymize, setAnonymize] = useState(true);
  const [format, setFormat] = useState<'zip_csv' | 'json_lines'>('zip_csv');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGenerate({
      experiment_ids: ['exp_1', 'exp_2'],
      include_telemetry: includeTelemetry,
      include_ai_interventions: includeAI,
      include_quiz_results: includeQuiz,
      format,
      anonymize_participants: anonymize,
    });
  };

  return (
    <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 shadow-xl space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
            Research Dataset Generator
          </h3>
          <p className="text-xs text-slate-400">
            Synthesize reproducible research datasets matching RQ1 and RQ2 evaluation protocols
          </p>
        </div>
        <Badge variant="secondary" className="font-mono text-[10px]">
          SHA-256 Verified
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Table Selection Grid */}
        <div className="space-y-3">
          <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block font-bold">
            1. Select Telemetry Tables to Include:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${includeTelemetry ? 'bg-primary/10 border-primary text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
              <input type="checkbox" checked={includeTelemetry} onChange={(e) => setIncludeTelemetry(e.target.checked)} className="mt-1" />
              <div className="text-xs">
                <strong className="block text-slate-200">Reading Telemetry</strong>
                <span className="text-[11px] text-slate-400 leading-tight">raw_events, paragraph_events, active timers</span>
              </div>
            </label>

            <label className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${includeAI ? 'bg-purple-500/10 border-purple-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
              <input type="checkbox" checked={includeAI} onChange={(e) => setIncludeAI(e.target.checked)} className="mt-1" />
              <div className="text-xs">
                <strong className="block text-slate-200">AI Interventions</strong>
                <span className="text-[11px] text-slate-400 leading-tight">intervention_log, hints, helpfulness feedback</span>
              </div>
            </label>

            <label className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${includeQuiz ? 'bg-emerald-500/10 border-emerald-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
              <input type="checkbox" checked={includeQuiz} onChange={(e) => setIncludeQuiz(e.target.checked)} className="mt-1" />
              <div className="text-xs">
                <strong className="block text-slate-200">Comprehension Assessment</strong>
                <span className="text-[11px] text-slate-400 leading-tight">quiz_results, item scores, Likert ratings</span>
              </div>
            </label>
          </div>
        </div>

        {/* Export Options & Format */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block font-bold">
              2. Privacy & Compliance:
            </label>
            <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${anonymize ? 'bg-emerald-500/10 border-emerald-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
              <input type="checkbox" checked={anonymize} onChange={(e) => setAnonymize(e.target.checked)} />
              <div className="text-xs">
                <strong className="block text-slate-200">Anonymize Participant IDs</strong>
                <span className="text-[11px] text-slate-400">Hash IDs (e.g. P-1001 → SHA-256 token)</span>
              </div>
            </label>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block font-bold">
              3. Package Format:
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormat('zip_csv')}
                className={`flex-1 p-3 rounded-xl border text-xs font-mono font-bold transition-all ${format === 'zip_csv' ? 'bg-primary text-white border-primary shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
              >
                📦 ZIP (CSV Tables)
              </button>
              <button
                type="button"
                onClick={() => setFormat('json_lines')}
                className={`flex-1 p-3 rounded-xl border text-xs font-mono font-bold transition-all ${format === 'json_lines' ? 'bg-primary text-white border-primary shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
              >
                📄 JSON Lines (.jsonl)
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <Button type="submit" disabled={isGenerating || (!includeTelemetry && !includeAI && !includeQuiz)} className="bg-primary hover:bg-primary-dark text-xs font-bold px-8 shadow-lg shadow-primary/20">
            {isGenerating ? 'Synthesizing Dataset Package...' : 'Generate Research Archive 📦'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
