'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export interface PromptPreviewProps {
  systemPrompt: string;
  userPromptTemplate: string;
  variables: string[];
}

export const PromptPreview: React.FC<PromptPreviewProps> = ({
  systemPrompt,
  userPromptTemplate,
  variables,
}) => {
  const [mockValues, setMockValues] = useState<Record<string, string>>({
    'participant.id': 'PAR_9942_ALPHA',
    'paragraph.content': 'Neural networks demonstrate striking emergent properties when scaled across parameters.',
    'paragraph.title': 'Section 2: Emergent Behaviors',
    'quiz.last_score': '65%',
    'session.duration_seconds': '420',
  });

  const handleMockChange = (key: string, val: string) => {
    setMockValues((prev) => ({ ...prev, [key]: val }));
  };

  const renderInterpolated = (text: string) => {
    if (!text) return '';
    let output = text;
    variables.forEach((v) => {
      const regex = new RegExp(`\\{\\{${v}\\}\\}`, 'g');
      const val = mockValues[v] ?? `[MOCK_${v.toUpperCase()}]`;
      output = output.replace(regex, val);
    });
    return output;
  };

  return (
    <Card className="border-slate-800 bg-slate-950 shadow-2xl">
      <CardHeader className="bg-slate-900/80 border-b border-slate-800 pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          <CardTitle className="text-sm font-bold text-white">Live Payload Interpolation Simulator</CardTitle>
        </div>
        <span className="text-xs font-mono text-slate-400">Backend API Payload Preview</span>
      </CardHeader>

      <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mock Values Form */}
        <div className="space-y-3 lg:border-r lg:border-slate-800 lg:pr-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Runtime Mock Arguments
          </h4>
          {variables.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No variables configured for mocking.</p>
          ) : (
            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {variables.map((v) => (
                <div key={v} className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-accent">&#123;&#123;{v}&#125;&#125;</label>
                  <input
                    type="text"
                    value={mockValues[v] || ''}
                    onChange={(e) => handleMockChange(v, e.target.value)}
                    placeholder={`Enter sample value for ${v}...`}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interpolated Payload Output */}
        <div className="lg:col-span-2 space-y-4 font-mono text-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 bg-primary/10 rounded border border-primary/20">
              ROLE: SYSTEM
            </span>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 whitespace-pre-wrap leading-relaxed">
              {renderInterpolated(systemPrompt) || <span className="italic text-slate-600">[System instruction empty]</span>}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
              ROLE: USER (DYNAMIC PAYLOAD)
            </span>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 whitespace-pre-wrap leading-relaxed">
              {renderInterpolated(userPromptTemplate) || <span className="italic text-slate-600">[User template empty]</span>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
