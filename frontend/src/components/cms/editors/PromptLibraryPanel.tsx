'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface ExtendedPromptTemplate {
  id: string;
  name: string;
  systemPrompt: string;
  model: string;
  temperature?: number;
  userPromptTemplate?: string;
  triggerReason?: string;
  interventionType?: 'scaffolding' | 'comprehension_check' | 'summary' | 'reflection' | 'custom';
  notes?: string;
  provider?: 'openai' | 'anthropic' | 'google' | 'local';
  top_p?: number;
  max_tokens?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  fallbackProvider?: string;
  variables?: string[];
}

export interface PromptLibraryPanelProps {
  templates: ExtendedPromptTemplate[];
  onSelectTemplate: (template: ExtendedPromptTemplate) => void;
  onDuplicateTemplate: (id: string) => void;
  onArchiveTemplate: (id: string) => void;
  onImportTemplate: (jsonString: string) => void;
  onExportTemplate: (template: ExtendedPromptTemplate) => void;
}

export const PromptLibraryPanel: React.FC<PromptLibraryPanelProps> = ({
  templates,
  onSelectTemplate,
  onDuplicateTemplate,
  onArchiveTemplate,
  onImportTemplate,
  onExportTemplate,
}) => {
  const handleImportClick = () => {
    const input = prompt('Paste exported JSON Prompt Template configuration:');
    if (input && input.trim()) {
      try {
        onImportTemplate(input.trim());
      } catch {
        alert('Invalid JSON prompt template data.');
      }
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-slate-800/60 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-white">Preset Prompt Template Repository</CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage reusable intervention scaffolding specifications across studies.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleImportClick} className="text-xs h-8">
          📥 Import Spec
        </Button>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        {templates.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No saved prompt templates in library.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-200 truncate">{tpl.name}</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-slate-900 text-slate-400 rounded border border-slate-800">
                      {tpl.interventionType || 'custom'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-mono">
                    {tpl.systemPrompt || 'No system instructions configured.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                  <span className="font-mono text-primary text-[11px]">{tpl.model}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onSelectTemplate(tpl)}
                      className="px-2 py-1 rounded bg-primary/20 text-primary hover:bg-primary/30 font-semibold"
                      title="Load into Editor"
                    >
                      Load
                    </button>
                    <button
                      type="button"
                      onClick={() => onDuplicateTemplate(tpl.id)}
                      className="px-2 py-1 rounded bg-slate-900 text-slate-300 hover:text-white"
                      title="Duplicate"
                    >
                      ©
                    </button>
                    <button
                      type="button"
                      onClick={() => onExportTemplate(tpl)}
                      className="px-2 py-1 rounded bg-slate-900 text-slate-300 hover:text-white"
                      title="Export JSON"
                    >
                      📤
                    </button>
                    <button
                      type="button"
                      onClick={() => onArchiveTemplate(tpl.id)}
                      className="px-2 py-1 rounded bg-slate-900 text-error hover:bg-error/10"
                      title="Archive / Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
